import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import MagicAIInput from '../components/MagicAIInput';
import { Wallet, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { transactions } = useContext(TransactionContext);

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expense;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Section: Command & History */}
            <div className="lg:col-span-8 space-y-6">
                {/* Command Bar Section */}
                <div className="pro-card p-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <MagicAIInput />
                </div>

                {/* Legacy Form (Optional/Hidden in Pro) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="pro-card p-6 pro-card-hover">
                        <TransactionForm />
                    </div>
                    
                    {/* Placeholder for Quick Stats or mini-chart */}
                    <div className="pro-card p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Weekly Pulse</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                You've logged <span className="text-indigo-600 font-bold">{transactions.length}</span> transactions this week. Reach for the "Command Bar" to add more.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                            <span className="text-slate-400">Total processed</span>
                            <span className="font-mono text-indigo-500">#{transactions.length.toString().padStart(4, '0')}</span>
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="pro-card p-6 shadow-sm border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-400">Transaction Registry</h2>
                        <div className="flex gap-2">
                             <span className="px-2 py-1 rounded-md bg-indigo-50 dark:bg-slate-800 text-[10px] font-bold text-indigo-600 dark:text-slate-400">LATEST</span>
                        </div>
                    </div>
                    <TransactionList />
                </div>
            </div>

            {/* Right Section: Intelligence & Stats */}
            <div className="lg:col-span-4 space-y-6">
                {/* Master Balance Card - Crisp Banking Style */}
                <div className="pro-card bg-white dark:bg-slate-900 border-indigo-100 dark:border-slate-800 p-8 relative overflow-hidden shadow-sm border-l-4 border-l-indigo-600">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                    <h3 className="text-slate-400 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Net Liquidity</h3>
                    <div className="space-y-1">
                        <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">₹{balance.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-indigo-600 dark:text-slate-400 font-bold tracking-widest uppercase mt-2">Available Assets</p>
                    </div>
                    
                    <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-6">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase mb-1 tracking-tighter">Incoming</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">₹{income.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase mb-1 tracking-tighter">Outgoing</span>
                            <span className="text-rose-600 dark:text-rose-400 font-bold text-sm">₹{expense.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Legend or Quick Tips (Replaces the large insights cards for a cleaner look) */}
                <div className="pro-card p-6 bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Pro Tips</h4>
                    <ul className="space-y-3 text-[11px] text-slate-500 font-medium">
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                            <span>Type "500 rent" to log expenses quickly.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                            <span>"1000 salary aai" adds income automatically.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
