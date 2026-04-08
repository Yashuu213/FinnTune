import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { PlusCircle, MinusCircle, Wallet, Hash, Type, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionForm = () => {
    const { addTransaction } = useContext(TransactionContext);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('General');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        addTransaction({
            amount: parseFloat(amount),
            description,
            type,
            category,
            date: new Date().toISOString(),
        });

        setAmount('');
        setDescription('');
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <PlusCircle size={14} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Manual Entry</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider ${type === 'expense'
                            ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-500'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <MinusCircle className="w-3 h-3" />
                        Debit
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider ${type === 'income'
                            ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-500'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <PlusCircle className="w-3 h-3" />
                        Credit
                    </button>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Volume</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                            <span className="text-sm font-bold">₹</span>
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="pro-input pl-10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Classification</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="pro-input appearance-none cursor-pointer"
                    >
                        <option value="General">General</option>
                        <option value="Food">Food / Dining</option>
                        <option value="Transport">Transport / Fuel</option>
                        <option value="Utilities">Bills / Services</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health / Pharma</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Salary">Salary / Income</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Notation</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Purpose of transaction..."
                        className="pro-input"
                        required
                    />
                </div>

                <div className="mt-auto pt-4">
                    <button
                        type="submit"
                        className="w-full btn-primary text-xs font-bold uppercase tracking-[0.2em] py-3 shadow-indigo-500/10"
                    >
                        Save Entry
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;
