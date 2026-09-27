import React from 'react';
import { Send, LayoutDashboard, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/75 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg text-white tracking-tight">IELTS<span className="text-indigo-400">AI</span></span>
            <span className="text-[10px] text-slate-400 font-medium block leading-none">Writing Assistant</span>
          </div>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">Qanday ishlaydi</a>
          <a href="#benefits" className="hover:text-indigo-400 transition-colors">Afzalliklar</a>
          <a href="#demo" className="hover:text-indigo-400 transition-colors">Demo</a>
          <a 
            href="http://localhost:3000" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950/70 border border-indigo-800/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Panel</span>
          </a>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://t.me/ielts_writing_bot"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Botni Ishga Tushirish</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
