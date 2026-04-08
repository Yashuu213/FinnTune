import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const TransactionList = () => {
    const { transactions, deleteTransaction } = useContext(TransactionContext);

    return (
        <div className="w-full">
            {transactions.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No entries recorded in this session.</p>
                </div>
            ) : (
                <div className="space-y-px">
                    <div className="grid grid-cols-12 px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:grid">
                        <div className="col-span-6">Description & Context</div>
                        <div className="col-span-2 text-center">Category</div>
                        <div className="col-span-2 text-right">Date</div>
                        <div className="col-span-2 text-right">Amount (INR)</div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(transactions || []).map((transaction) => (
                            <div key={transaction.id} className="grid grid-cols-12 items-center px-4 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                <div className="col-span-8 md:col-span-6 flex items-center gap-3">
                                    <div className={`p-2 rounded-xl flex-shrink-0 ${transaction.type === 'income' 
                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' 
                                        : 'bg-slate-50 text-slate-400 dark:bg-slate-800'
                                    }`}>
                                        {transaction.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold truncate capitalize" style={{ color: 'var(--text-primary)' }}>{transaction.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5 md:hidden">
                                            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">{transaction.category}</span>
                                            <span className="text-[9px] text-slate-500 dark:text-slate-400">/ {new Date(transaction.date).toLocaleDateString('en-GB')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="hidden md:block col-span-2 text-center">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                        {transaction.category}
                                    </span>
                                </div>

                                <div className="hidden md:block col-span-2 text-right">
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
                                        {new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
                                    </p>
                                </div>

                                <div className="col-span-4 md:col-span-2 text-right flex items-center justify-end gap-2 md:gap-3">
                                    <span className={`text-sm font-bold font-mono tracking-tighter ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                        {transaction.type === 'income' ? '+' : ''}{transaction.amount.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => deleteTransaction(transaction.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;
