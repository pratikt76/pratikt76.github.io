import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    ArrowLeft, Plus, Trash2, Loader2, X, CheckCircle2,
    Circle, Sun, Moon, Mic, Search, Pin, PinOff,
    Download, Hash, BarChart3, Filter, Edit2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChecklistItem {
    id: string;
    text: string;
    checked: boolean;
}

interface Note {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'checklist';
    items: ChecklistItem[];
    is_pinned: boolean;
    tags: string[];
    created_at: string;
}

export default function Notes() {
    // --- Auth & Theme ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);

    // --- Notes State ---
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteType, setNoteType] = useState<'text' | 'checklist'>('text');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
    const [newItemText, setNewItemText] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    // --- UI/Filter States ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // --- Speech Recognition ---
    const toggleListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }
        if (isListening) { setIsListening(false); return; }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) setContent(prev => prev + (prev.length > 0 ? ' ' : '') + finalTranscript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    // --- Initialization & Sync ---
    useEffect(() => {
        const auth = sessionStorage.getItem('notes_auth');
        if (auth === 'true') {
            setIsLoggedIn(true);
            fetchNotes();
        } else {
            setIsLoading(false);
        }

        const savedTheme = localStorage.getItem('notes_theme');
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');

        // Load Drafts
        const draftTitle = localStorage.getItem('note_draft_title');
        const draftContent = localStorage.getItem('note_draft_content');
        if (draftTitle) setTitle(draftTitle);
        if (draftContent) setContent(draftContent);
    }, []);

    // Save drafts to localStorage
    useEffect(() => {
        if (title) localStorage.setItem('note_draft_title', title);
        else localStorage.removeItem('note_draft_title');
    }, [title]);

    useEffect(() => {
        if (content) localStorage.setItem('note_draft_content', content);
        else localStorage.removeItem('note_draft_content');
    }, [content]);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('notes_theme', newTheme ? 'dark' : 'light');
    };

    // --- Data Operations ---
    const fetchNotes = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching notes:', error);
        else setNotes(data || []);
        setIsLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { data } = await supabase
            .from('admin_auth')
            .select('*')
            .eq('id', username)
            .eq('password', password)
            .single();

        if (data) {
            setIsLoggedIn(true);
            sessionStorage.setItem('notes_auth', 'true');
            fetchNotes();
        } else {
            setError('Invalid credentials');
        }
        setIsSubmitting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasTextContent = noteType === 'text' ? content.trim().length > 0 : checklistItems.length > 0;
        if (!hasTextContent) {
            alert("Please add some content before logging the entry.");
            return;
        }

        // Extract Tags from content
        const extractedTags = Array.from(content.matchAll(/#(\w+)/g)).map(match => match[1].toLowerCase());

        setIsSubmitting(true);
        try {
            if (editingNoteId) {
                const { data, error: dbError } = await supabase
                    .from('notes')
                    .update({
                        title: title.trim() || 'Untitled Note',
                        content: noteType === 'text' ? content : '',
                        type: noteType,
                        items: noteType === 'checklist' ? checklistItems : [],
                        tags: extractedTags,
                    })
                    .eq('id', editingNoteId)
                    .select();

                if (dbError) throw dbError;
                if (data) {
                    setNotes(notes.map(n => n.id === editingNoteId ? data[0] : n));
                    resetForm();
                }
            } else {
                const { data, error: dbError } = await supabase
                    .from('notes')
                    .insert([{
                        title: title.trim() || 'Untitled Note',
                        content: noteType === 'text' ? content : '',
                        type: noteType,
                        items: noteType === 'checklist' ? checklistItems : [],
                        tags: extractedTags,
                        is_pinned: false
                    }])
                    .select();

                if (dbError) throw dbError;
                if (data) {
                    setNotes([data[0], ...notes]);
                    resetForm();
                    localStorage.removeItem('note_draft_title');
                    localStorage.removeItem('note_draft_content');
                }
            }
        } catch (err: any) {
            alert(`Failed to save note: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteNote = async (id: string) => {
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (!error) setNotes(notes.filter(n => n.id !== id));
    };

    const togglePin = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('notes')
            .update({ is_pinned: !currentStatus })
            .eq('id', id);

        if (!error) {
            setNotes(notes.map(n => n.id === id ? { ...n, is_pinned: !currentStatus } : n));
        }
    };

    const toggleChecklistItem = async (noteId: string, itemId: string) => {
        const updatedNotes = notes.map(note => {
            if (note.id === noteId) {
                const updatedItems = (note.items || []).map(item =>
                    item.id === itemId ? { ...item, checked: !item.checked } : item
                );
                supabase.from('notes').update({ items: updatedItems }).eq('id', noteId).then();
                return { ...note, items: updatedItems };
            }
            return note;
        });
        setNotes(updatedNotes);
    };

    const startEditing = (note: Note) => {
        setEditingNoteId(note.id);
        setTitle(note.title);
        setNoteType(note.type);
        if (note.type === 'text') {
            setContent(note.content);
            setChecklistItems([]);
        } else {
            setContent('');
            setChecklistItems(note.items || []);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setChecklistItems([]);
        setNewItemText('');
        setNoteType('text');
        setEditingNoteId(null);
    };

    // --- Export ---
    const exportNotes = () => {
        const dataStr = JSON.stringify(notes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `notes_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    // --- Filter logic ---
    const filteredNotes = useMemo(() => {
        return notes
            .filter(note => {
                const matchesSearch =
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesTag = activeTag ? note.tags?.includes(activeTag) : true;
                return matchesSearch && matchesTag;
            })
            .sort((a, b) => {
                if (a.is_pinned === b.is_pinned) return 0;
                return a.is_pinned ? -1 : 1;
            });
    }, [notes, searchQuery, activeTag]);

    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        notes.forEach(note => note.tags?.forEach(tag => tagsSet.add(tag)));
        return Array.from(tagsSet);
    }, [notes]);

    // --- Heatmap Logic ---
    const activityData = useMemo(() => {
        const days = 90; // Last 90 days
        const data: { [key: string]: number } = {};
        const now = new Date();

        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            data[d.toISOString().split('T')[0]] = 0;
        }

        notes.forEach(note => {
            const dateStr = new Date(note.created_at).toISOString().split('T')[0];
            if (data[dateStr] !== undefined) data[dateStr]++;
        });

        return Object.entries(data).reverse();
    }, [notes]);

    // --- Styles ---
    const themeClasses = isDarkMode
        ? {
            bg: 'bg-zinc-950',
            text: 'text-zinc-100',
            subtext: 'text-zinc-400',
            muted: 'text-zinc-500',
            border: 'border-white/[0.05]',
            card: 'bg-white/[0.02]',
            input: 'bg-white/[0.01]',
            buttonMuted: 'text-zinc-500',
            headerIcon: 'text-zinc-500'
        }
        : {
            bg: 'bg-white',
            text: 'text-zinc-900',
            subtext: 'text-zinc-400',
            muted: 'text-zinc-300',
            border: 'border-zinc-100',
            card: 'bg-zinc-50/50',
            input: 'bg-zinc-100/30',
            buttonMuted: 'text-zinc-400',
            headerIcon: 'text-zinc-400'
        };

    const addChecklistItemHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;
        const newItem: ChecklistItem = {
            id: Math.random().toString(36).substr(2, 9),
            text: newItemText,
            checked: false
        };
        setChecklistItems([...checklistItems, newItem]);
        setNewItemText('');
    };

    if (isLoading && isLoggedIn) {
        return (
            <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center`}>
                <Loader2 className={`animate-spin ${themeClasses.subtext} w-6 h-6`} />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} flex items-center justify-center p-4`}>
                <div className={`w-full max-w-sm p-8 rounded-2xl border ${themeClasses.border} ${themeClasses.card} shadow-sm`}>
                    <div className="flex flex-col items-center mb-8">
                        <Link to="/" className={`mb-6 p-2 ${themeClasses.headerIcon} hover:${themeClasses.text} transition-colors`}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-medium tracking-tight">Access Vault</h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="text" placeholder="Username"
                            className={`w-full ${themeClasses.input} border ${themeClasses.border} rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-500 transition-colors text-sm ${themeClasses.text}`}
                            value={username} onChange={e => setUsername(e.target.value)} required
                        />
                        <input
                            type="password" placeholder="Password"
                            className={`w-full ${themeClasses.input} border ${themeClasses.border} rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-500 transition-colors text-sm ${themeClasses.text}`}
                            value={password} onChange={e => setPassword(e.target.value)} required
                        />
                        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                        <button
                            type="submit" disabled={isSubmitting}
                            className={`w-full ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-zinc-100'} py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center text-sm`}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-300 font-sans selection:bg-blue-500/30`}>
            {/* Header Navigation */}
            <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <Link to="/" className={`${themeClasses.headerIcon} hover:${themeClasses.text} transition-colors`}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="h-4 w-px bg-white/10" />
                        <button onClick={toggleTheme} className={`${themeClasses.headerIcon} hover:${themeClasses.text} transition-colors p-1`}>
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button onClick={exportNotes} className={`${themeClasses.headerIcon} hover:${themeClasses.text} transition-colors p-1`} title="Export Data">
                            <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowHeatmap(!showHeatmap)} className={`${showHeatmap ? 'text-blue-500' : themeClasses.headerIcon} hover:${themeClasses.text} transition-colors p-1`} title="Activity Heatmap">
                            <BarChart3 className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => { setIsLoggedIn(false); sessionStorage.removeItem('notes_auth'); }}
                        className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-[0.2em] font-bold"
                    >
                        Secure Logout
                    </button>
                </header>

                {/* Heatmap Section */}
                {showHeatmap && (
                    <section className={`mb-12 p-6 rounded-2xl border ${themeClasses.border} ${themeClasses.card} animate-in fade-in slide-in-from-top-4 duration-500`}>
                        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-6">Activity Logs (90 Days)</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {activityData.map(([date, count], i) => (
                                <div
                                    key={date}
                                    title={`${date}: ${count} logs`}
                                    className={`w-3 h-3 rounded-[2px] transition-all hover:scale-125
                                        ${count === 0 ? 'bg-white/[0.03]' :
                                            count === 1 ? 'bg-blue-500/30' :
                                                count === 2 ? 'bg-blue-500/60' : 'bg-blue-500'}`}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid lg:grid-cols-[1fr_280px] gap-12">
                    {/* Main Content Area */}
                    <div className="space-y-12">
                        {/* Note Imput Form */}
                        <section className={`p-8 rounded-[2.5rem] border ${themeClasses.border} ${themeClasses.card} shadow-2xl relative overflow-hidden group`}>
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-4 items-center">
                                {editingNoteId && (
                                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Editing Mode</span>
                                )}
                                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Autosaving...</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <input
                                    type="text" placeholder="Entry Heading..."
                                    className={`w-full bg-transparent text-3xl font-bold placeholder:text-zinc-600 focus:outline-none tracking-tight ${themeClasses.text}`}
                                    value={title} onChange={e => setTitle(e.target.value)}
                                />

                                <div className="flex gap-6 border-b border-white/[0.02] pb-4">
                                    <button
                                        type="button" onClick={() => setNoteType('text')}
                                        className={`text-[10px] font-black tracking-[0.25em] uppercase transition-all flex items-center gap-2 ${noteType === 'text' ? 'text-blue-500' : themeClasses.buttonMuted}`}
                                    >
                                        <div className={`w-1 h-1 rounded-full ${noteType === 'text' ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        Journal
                                    </button>
                                    <button
                                        type="button" onClick={() => setNoteType('checklist')}
                                        className={`text-[10px] font-black tracking-[0.25em] uppercase transition-all flex items-center gap-2 ${noteType === 'checklist' ? 'text-blue-500' : themeClasses.buttonMuted}`}
                                    >
                                        <div className={`w-1 h-1 rounded-full ${noteType === 'checklist' ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        Protocol
                                    </button>
                                </div>

                                {noteType === 'text' ? (
                                    <div className="space-y-4">
                                        <textarea
                                            placeholder="Markdown supported. Use #tags to organize."
                                            className={`w-full bg-transparent min-h-[160px] ${themeClasses.subtext} placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed text-lg font-mono`}
                                            value={content} onChange={e => setContent(e.target.value)}
                                        />
                                        {/* Simple Live Preview if user wants, but keeping it minimal */}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className={`flex items-center gap-4 border-b ${themeClasses.border} pb-4`}>
                                            <Plus className={`w-4 h-4 ${themeClasses.muted}`} />
                                            <input
                                                type="text" placeholder="Append logical checkpoint..."
                                                className={`flex-1 bg-transparent focus:outline-none text-base ${themeClasses.subtext} placeholder:text-zinc-600`}
                                                value={newItemText} onChange={e => setNewItemText(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addChecklistItemHandler(e))}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            {checklistItems.map((item, idx) => (
                                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] group/item transition-all">
                                                    <span className={`text-sm ${themeClasses.subtext}`}>{item.text}</span>
                                                    <button type="button" onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== idx))} className="opacity-0 group-hover/item:opacity-100 text-zinc-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-8 border-t border-white/[0.02]">
                                    <div className="flex gap-4">
                                        <button
                                            type="button" onClick={toggleListening}
                                            className={`transition-all duration-500 p-2 rounded-full ${isListening ? 'bg-red-500/20 text-red-500 scale-125' : 'hover:bg-white/[0.05] text-zinc-600 hover:text-white'}`}
                                        >
                                            <Mic className="w-5 h-5" />
                                        </button>
                                        {editingNoteId && (
                                            <button
                                                type="button" onClick={cancelEditing}
                                                className="px-4 py-2 text-[9px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
                                            >
                                                Abort Change
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.25em] uppercase transition-all 
                                            ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'} 
                                            disabled:opacity-20 active:scale-95`}
                                    >
                                        {isSubmitting ? 'Syncing...' : editingNoteId ? 'Commit Update' : 'Lock Entry'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Notes List */}
                        <div className="space-y-16 mt-24">
                            <div className="flex items-center gap-6">
                                <h2 className={`text-[10px] font-black tracking-[0.4em] ${isDarkMode ? 'text-zinc-800' : 'text-zinc-300'} uppercase italic whitespace-nowrap`}>Sequential_Logs</h2>
                                <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/[0.03]' : 'bg-zinc-100'}`} />
                            </div>

                            {filteredNotes.length === 0 ? (
                                <div className="py-32 text-center">
                                    <p className={`text-[11px] font-bold tracking-[0.3em] uppercase ${themeClasses.muted}`}>No records match the current filter.</p>
                                </div>
                            ) : (
                                <div className="space-y-16">
                                    {filteredNotes.map((note) => (
                                        <article key={note.id} className="group relative">
                                            {note.is_pinned && (
                                                <div className="absolute -left-12 top-2 p-2">
                                                    <Pin className="w-4 h-4 text-blue-500 fill-blue-500" />
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500`}>
                                                        {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    {note.tags?.map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                                                            className={`text-[8px] px-2 py-0.5 rounded-full border ${activeTag === tag ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'border-white/5 text-zinc-600'} uppercase font-bold tracking-widest`}
                                                        >
                                                            #{tag}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => startEditing(note)} className={`p-2 hover:bg-white/[0.05] rounded-xl transition-colors ${editingNoteId === note.id ? 'text-blue-500 bg-white/[0.05]' : 'text-zinc-500 hover:text-blue-500'}`} title="Edit Entry">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => togglePin(note.id, note.is_pinned)} className="p-2 hover:bg-white/[0.05] rounded-xl text-zinc-500 hover:text-blue-500 transition-colors">
                                                        {note.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => deleteNote(note.id)} className="p-2 hover:bg-white/[0.05] rounded-xl text-zinc-500 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={`p-10 rounded-[2.5rem] border ${themeClasses.border} ${themeClasses.card} shadow-sm group-hover:shadow-2xl transition-all duration-700`}>
                                                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-8 tracking-tight`}>{note.title}</h3>

                                                {note.type === 'checklist' ? (
                                                    <div className="grid gap-4">
                                                        {(note.items || []).map(item => (
                                                            <button
                                                                key={item.id} onClick={() => toggleChecklistItem(note.id, item.id)}
                                                                className="flex items-center gap-6 group/check text-left"
                                                            >
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all 
                                                                    ${item.checked ? 'bg-blue-500 border-blue-500' : 'border-white/10 group-hover/check:border-white/30'}`}>
                                                                    {item.checked && <CheckCircle2 className="w-3 h-3 text-black" />}
                                                                </div>
                                                                <span className={`text-base transition-all ${item.checked ? 'text-zinc-600 line-through' : themeClasses.text}`}>
                                                                    {item.text}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={`prose prose-invert max-w-none prose-sm leading-relaxed ${themeClasses.subtext} prose-headings:text-white prose-pre:bg-black/50 prose-code:text-blue-400`}>
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {note.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="space-y-12">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text" placeholder="Query records..."
                                className={`w-full ${themeClasses.input} border ${themeClasses.border} rounded-2xl py-4 pl-12 pr-4 text-[11px] focus:outline-none focus:border-blue-500/50 transition-all uppercase tracking-widest font-bold placeholder:text-zinc-600`}
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Tags Cloud */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Filter className="w-3 h-3 text-zinc-700" />
                                <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-700">Filter_Class</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                                            ${activeTag === tag ? 'bg-blue-500 border-blue-500 text-black' : `${themeClasses.border} ${themeClasses.headerIcon} hover:border-zinc-700`}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                                {allTags.length === 0 && <span className="text-[9px] font-bold text-zinc-800 uppercase italic">No tags indexed yet.</span>}
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className={`p-6 rounded-3xl border ${themeClasses.border} ${themeClasses.card} space-y-4`}>
                            <h4 className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Vault_Statistics</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-2xl font-bold block">{notes.length}</span>
                                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest leading-none">Total Logs</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-2xl font-bold block">{notes.filter(n => n.is_pinned).length}</span>
                                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest leading-none">Pinned</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
