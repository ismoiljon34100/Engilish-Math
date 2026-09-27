import React from 'react';
import { Zap, Clock, Award, Flame, Check } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Tezkor Natija — 30 Soniyada',
      description: 'O\'qituvchidan kunlab yoki haftalab tekshiruv kutishga chek qo\'ying. Sun\'iy intellekt inshoyingizni soniyalar ichida tahlil qilib beradi.',
      accent: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
      badge: 'Charchoq va kutishlarsiz',
    },
    {
      icon: Clock,
      title: '24/7 Doimiy Yoningizda',
      description: 'Tungi soat 02:00 da yoki tong saharlab — istalgan vaqtda insho yozing va darhol professional fikr-mulohaza oling.',
      accent: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
      badge: 'Cheklovlarsiz mashq',
    },
    {
      icon: Award,
      title: 'IELTS Mezonlariga 100% Mos',
      description: 'Rasmiy Cambridge Band Descriptors asosida: Task Response, Coherence & Cohesion, Lexical Resource va Grammatical Range bo\'yicha xolis baho.',
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      badge: 'Rasmiy baholash standarti',
    },
    {
      icon: Flame,
      title: 'Streak va O\'sish Dinamikasi',
      description: 'Kunlik yozish orqali odat (streak) shakllantiring. Har bir yangi inshoda ballingiz o\'sayotganini shaxsiy statistikangizda ko\'ring.',
      accent: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      badge: 'Muntazam motivatsiya',
    },
  ];

  return (
    <section id="benefits" className="py-24 relative overflow-hidden">
      {/* Background gradient sphere */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1 rounded-full">
            Nega Bizni Tanlashadi?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            IELTS Writing'da Yuqori Ball Olishingiz Uchun Yaratilgan
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Repetitor bilan taqqoslaganda tezroq, arzonroq va doim qo'l ostingizda bo'lgan kuchli yordamchi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${benefit.accent} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {benefit.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-indigo-300 font-semibold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tekshirilgan va kafolatlangan AI algoritmi</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
