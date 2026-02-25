import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Mail } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState('submitting');

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch("https://formsubmit.co/ajax/pratikthombare03@gmail.com", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            const data = await response.json();
            if (data.success) {
                setFormState('success');
                form.reset();
            } else {
                setFormState('error');
            }
        } catch {
            setFormState('error');
        }
    };

    const handleClose = () => {
        onClose();
        // Reset form state after close animation
        setTimeout(() => setFormState('idle'), 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-md bg-[#fafafa] dark:bg-[#0a0a0a] border border-black/[0.08] dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Glow accent */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-7 pt-7 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/10 flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                        Get in touch
                                    </h2>
                                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 tracking-wide">
                                        I'll get back to you soon
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-7 pt-4 pb-7">
                            <AnimatePresence mode="wait">
                                {formState === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                                            className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center"
                                        >
                                            <Send className="w-7 h-7 text-emerald-500" />
                                        </motion.div>
                                        <div>
                                            <p className="text-zinc-800 dark:text-zinc-200 font-semibold text-lg">Message sent!</p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Thanks for reaching out.</p>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => setFormState('idle')}
                                                className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
                                            >
                                                Send another
                                            </button>
                                            <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                            <button
                                                onClick={handleClose}
                                                className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium transition-colors"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                        action="https://formsubmit.co/ajax/pratikthombare03@gmail.com"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">
                                                    Name
                                                </label>
                                                <input
                                                    required
                                                    name="name"
                                                    type="text"
                                                    placeholder="Your name"
                                                    className="w-full bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">
                                                    Email
                                                </label>
                                                <input
                                                    required
                                                    name="your email"
                                                    type="email"
                                                    placeholder="you@email.com"
                                                    className="w-full bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">
                                                Subject
                                            </label>
                                            <input
                                                name="subject"
                                                type="text"
                                                placeholder="What's this about?"
                                                className="w-full bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">
                                                Message
                                            </label>
                                            <textarea
                                                required
                                                name="message"
                                                rows={4}
                                                placeholder="Hello! I'd like to discuss..."
                                                className="w-full bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            {formState === 'error' && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -5 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="text-xs text-red-500 font-medium"
                                                >
                                                    Something went wrong. Try again.
                                                </motion.span>
                                            )}
                                            <button
                                                disabled={formState === 'submitting'}
                                                type="submit"
                                                className="ml-auto flex items-center gap-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {formState === 'submitting' ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send Message</span>
                                                        <Send className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
