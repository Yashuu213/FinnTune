import React, { useState, useEffect } from 'react';
import { Brain, Trash2, Search, Sparkles, BookOpen, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BotTraining = () => {
    const [vocabulary, setVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchVocabulary();
    }, []);

    const fetchVocabulary = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/check_auth');
            const auth = await res.json();
            if (auth.isAuthenticated) {
                // We'll add a specific endpoint for fetching training data
                const vocabRes = await fetch('/api/vocabulary');
                const data = await vocabRes.json();
                setVocabulary(data);
            }
        } catch (err) {
            console.error("Failed to fetch vocabulary", err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRule = async (id) => {
        try {
            const res = await fetch(`/api/train/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVocabulary(vocabulary.filter(v => v.id !== id));
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const filteredVocab = vocabulary.filter(v => 
        v.keyword.toLowerCase().includes(search.toLowerCase()) ||
        v.target_type.toLowerCase().includes(search.toLowerCase()) ||
        (v.target_category && v.target_category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles size={10} /> BOT COGNITION
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">/ VOCABULARY_LEDGER</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Bot Brain</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage the custom words and patterns your financial assistant has learned.</p>
                </div>
            </div>

            {/* Stats / Intro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="pro-card p-6 bg-slate-900 border-slate-800 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Learned IQ</p>
                    <p className="text-3xl font-black">{vocabulary.length}</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase">CUSTOM RULES</p>
                </div>
                <div className="md:col-span-2 pro-card p-6 border-indigo-100 flex items-center gap-4 text-left">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                        <Brain size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Personalized Context</p>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            These words override the default rules. If the bot makes a mistake, you can correct it here or directly in the command preview.
                        </p>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Filter vocabulary..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-300"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-slate-300 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-widest">Accessing Brain Memory...</p>
                    </div>
                ) : filteredVocab.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {filteredVocab.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="pro-card p-5 group flex items-center justify-between hover:border-indigo-200 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${
                                            item.target_type === 'income' ? 'bg-emerald-50 text-emerald-600' :
                                            item.target_type === 'expense' ? 'bg-rose-50 text-rose-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            <BookOpen size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100 italic">"{item.keyword}"</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                    {item.target_type}
                                                </span>
                                                <ChevronRight size={10} className="text-slate-300" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">
                                                    {item.target_category || 'General'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => deleteRule(item.id)}
                                        className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="pro-card p-20 text-center border-dashed border-slate-200">
                        <Brain size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-sm font-bold text-slate-400">Brain is empty.</h3>
                        <p className="text-xs text-slate-300 mt-1">Start correcting the bot from the command bar to teach it!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Loader2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default BotTraining;
