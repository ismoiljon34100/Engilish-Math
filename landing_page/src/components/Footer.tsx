import React from 'react';
import { Send, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm">IELTS<span className="text-indigo-400">AI</span> Writing Bot</span>
          <span>© {new Date().getFullYear()} Barcha huquqlar himoyalangan.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="hover:text-slate-200 transition-colors">Qanday ishlaydi</a>
          <a href="#benefits" className="hover:text-slate-200 transition-colors">Afzalliklar</a>
          <a 
            href="https://t.me/ielts_writing_bot" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@ielts_writing_bot</span>
          </a>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <span>O'quvchilar muvaffaqiyati uchun</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>bilan yaratildi</span>
        </div>
      </div>
    </footer>
  );
};
