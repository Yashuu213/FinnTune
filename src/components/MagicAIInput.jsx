import React, { useState, useEffect, useContext, useRef } from 'react';
import { Mic, Sparkles, Send, X, Check, Loader2, ArrowRight } from 'lucide-react';
import { TransactionContext } from '../context/TransactionContext';
import { motion, AnimatePresence } from 'framer-motion';

const MagicAIInput = () => {
    const { addBulkItems } = useContext(TransactionContext);
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [parsedItems, setParsedItems] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US'; // Works surprisingly well for Hinglish too

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setText(transcript);
                setIsListening(false);
                handleParse(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        } else {
            alert("Speech recognition not supported in this browser.");
        }
    };

    const handleParse = async (inputOverride) => {
        const query = inputOverride || text;
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/ai_parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: query })
            });
            const data = await res.json();
            setParsedItems(data);
            setShowPreview(true);
        } catch (err) {
            console.error("Parse failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        await addBulkItems(parsedItems);
        setIsLoading(false);
        setParsedItems([]);
        setShowPreview(false);
        setText('');
    };

    return (
        <div className="w-full relative">
            <div className="flex items-center gap-3 px-4 py-1">
                <div className="flex-shrink-0">
                    <Sparkles size={16} className={isLoading ? "animate-pulse text-indigo-500" : "text-slate-400"} />
                </div>
                
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleParse()}
                    placeholder="Type to log: '200 lunch aur 50 rahul ko diya'..."
                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />

                <div className="flex items-center gap-1.5 border-l border-slate-100 dark:border-slate-800 pl-3">
                    <button
                        onClick={isListening ? () => recognitionRef.current.stop() : startListening}
                        className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        title="Voice Input"
                    >
                        <Mic size={16} />
                    </button>

                    <button
                        onClick={() => handleParse()}
                        disabled={!text.trim() || isLoading}
                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <Send size={16} />
                    </button>
                    
                    <div className="hidden sm:flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-400">
                        <span className="opacity-50">↩</span> ENTER
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showPreview && parsedItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                    >
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reviewing Detected Entries</span>
                                <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {parsedItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`flex-shrink-0 p-1.5 rounded-lg ${item.is_debt ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                                                {item.is_debt ? <ArrowRight size={14} /> : <Check size={14} />}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate capitalize">
                                                    {item.is_debt ? `Lent: ${item.name}` : item.description}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase font-medium">{item.category || 'Ledger'}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white pl-2">₹{item.amount}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleConfirm}
                                className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={14} /> Commit Entries
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MagicAIInput;
