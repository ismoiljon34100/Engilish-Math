import React from 'react';
import { Send, Sparkles, ShieldCheck } from 'lucide-react';

export const Cta: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 border border-indigo-500/40 p-8 sm:p-14 text-center shadow-2xl">
          {/* Subtle background glow pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Orzuingizdagi Band Ball Sari Bir Qadam</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Inshoyingizni Hozir Tekshirib Ko'ring
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Hech qanday to'lov talab etilmaydi. Telegram orqali botga kiring, inshongizni yuboring va birinchi natijangizni 30 soniyada oling!
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://t.me/ielts_writing_bot"
                target="_blank"
                rel="noreferrer"
                id="cta-start-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-extrabold bg-white text-slate-950 hover:bg-slate-100 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send className="w-5 h-5 text-indigo-600" />
                <span>Telegram Botni Boshlash</span>
              </a>

              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold text-indigo-200 hover:text-white bg-indigo-950/50 hover:bg-indigo-950/80 border border-indigo-400/30 transition-colors"
              >
                <span>Admin Panel Namoyishi</span>
              </a>
            </div>

            <div className="pt-6 flex items-center justify-center gap-2 text-xs text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xavfsiz, tezkor va 100% rasmiy baholash standartlari asosida</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
