import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState('submitting');

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch("https://formspree.io/f/xpwzgqky", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setFormState('success');
                form.reset();
            } else {
                setFormState('error');
            }
        } catch (err) {
            setFormState('error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6"
        >
            <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Send me a message</h3>

            {formState === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                        <Send className="w-6 h-6" />
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 font-medium">Message sent!</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">I'll get back to you soon.</p>
                    <button
                        onClick={() => setFormState('idle')}
                        className="text-sm text-blue-500 hover:text-blue-600 font-medium mt-2"
                    >
                        Send another
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="name" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Name</label>
                            <input
                                required
                                name="name"
                                type="text"
                                className="w-full bg-white dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</label>
                            <input
                                required
                                name="email"
                                type="email"
                                className="w-full bg-white dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="message" className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Message</label>
                        <textarea
                            required
                            name="message"
                            rows={4}
                            className="w-full bg-white dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            placeholder="Hello! I'd like to discuss..."
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {formState === 'error' && (
                            <span className="text-xs text-red-500">Something went wrong. Please try again.</span>
                        )}
                        <button
                            disabled={formState === 'submitting'}
                            type="submit"
                            className="ml-auto flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
                </form>
            )}
        </motion.div>
    );
}
