import React from 'react';
import { Send, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Inshongizni Yuboring',
      description: 'Telegram botda Task 1 yoki Task 2 turini tanlang va yozgan matningizni botga yuboring (kamida 40 ta so\'z).',
      icon: Send,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      number: '02',
      title: 'AI Bir Zumda Tahlil Qiladi',
      description: 'Sun\'iy intellekt inshongizni grammatika, lug\'at, mantiq va topshiriq talablariga mosligini 30 soniyada skanerdan o\'tkazadi.',
      icon: Cpu,
      gradient: 'from-indigo-600 to-purple-600',
    },
    {
      number: '03',
      title: 'Natija va Tavsiyalarni Oling',
      description: 'Umumiy band ball, 4 mezon bo\'yicha batafsil baholar va keyingi inshongizda ballni oshirish uchun 3 ta aniq tavsiyaga ega bo\'ling.',
      icon: CheckCircle2,
      gradient: 'from-purple-600 to-pink-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1 rounded-full">
            Oddiy va Qulay
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Qanday Ishlaydi?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Hech qanday murakkab ro'yxatdan o'tish shart emas. 3 ta oson qadamda professional tahlilga ega bo'ling.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-slate-950/70 border border-slate-800/90 rounded-3xl p-8 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-800 group-hover:text-slate-700 transition-colors font-mono">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow indicator between steps for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 items-center justify-center shadow">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
