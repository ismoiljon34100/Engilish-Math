import React from 'react';
import { Send, CheckCircle2, Star, Zap, Flame, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Call To Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sun'iy Intellekt bilan IELTS Writing 7.5+ sari</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              IELTS Writing inshoyingizni{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                30 soniyada
              </span>{' '}
              tekshiring
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Task 1 va Task 2 insholaringizni Telegram orqali yuboring. AI rasmiy IELTS mezonlari (TR, CC, LR, GRA) bo'yicha aniq band ball beradi va xatolaringiz bo'yicha 3 ta amaliy tavsiya taqdim etadi.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="https://t.me/ielts_writing_bot"
                target="_blank"
                rel="noreferrer"
                id="hero-start-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-extrabold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send className="w-5 h-5" />
                <span>Botni Ishga Tushirish</span>
              </a>

              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 transition-colors"
              >
                <span>Namuna tahlilni ko'rish</span>
              </a>
            </div>

            {/* Trust and Social Proof Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tekshiruv bepul</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>30 soniyada natija</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300 font-semibold">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="ml-1">4.9 / 5 (3,000+ o'quvchi)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Telegram Chat Mockup */}
          <div className="lg:col-span-5" id="demo">
            <div className="relative mx-auto max-w-md bg-slate-900/90 rounded-3xl p-4 border border-slate-800 shadow-2xl backdrop-blur-xl">
              {/* Telegram Window Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    AI
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">IELTS Writing Bot</span>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      bot • onlayn
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                  Task 2
                </span>
              </div>

              {/* Chat Conversation Messages */}
              <div className="py-4 space-y-3.5 text-xs">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm shadow-md space-y-1">
                    <p className="font-mono text-[11px] opacity-90">
                      "In recent decades, higher education has become essential for economic growth. While free university tuition democratizes access..."
                    </p>
                    <span className="text-[9px] text-indigo-200 block text-right">14:22 ✓✓</span>
                  </div>
                </div>

                {/* Bot Response Message */}
                <div className="flex justify-start">
                  <div className="max-w-[92%] bg-slate-800/95 border border-slate-700/80 text-slate-200 p-3.5 rounded-2xl rounded-tl-sm shadow-lg space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                      <span className="font-extrabold text-white flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        AI Examiner Natijasi
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-black text-xs">
                        Band 7.0
                      </span>
                    </div>

                    {/* 4 mezon */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Task Response:</span>
                        <span className="font-bold text-indigo-300">7.0</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Coherence:</span>
                        <span className="font-bold text-indigo-300">7.0</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Lexical:</span>
                        <span className="font-bold text-indigo-300">7.5</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Grammar:</span>
                        <span className="font-bold text-indigo-300">6.5</span>
                      </div>
                    </div>

                    {/* AI tavsiyasi */}
                    <div className="bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800/60 text-[11px] space-y-1">
                      <span className="font-bold text-indigo-300 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        Tavsiya:
                      </span>
                      <p className="text-slate-300 leading-tight">
                        Paragraflar o'rtasida murakkab sintaktik tuzilmalardan ko'proq foydalaning, grammatika 7.0+ bo'lishi mumkin!
                      </p>
                    </div>

                    <span className="text-[9px] text-slate-400 block text-right">14:22</span>
                  </div>
                </div>
              </div>

              {/* Bot Input Bar Mock */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                <div className="flex-1 bg-slate-950/80 rounded-xl px-3 py-2 text-slate-400 text-[11px] border border-slate-800">
                  Insho matnini yuboring (kamida 40 so'z)...
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
