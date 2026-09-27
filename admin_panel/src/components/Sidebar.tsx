import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, BarChart3, Bot, Settings, BookOpen, ExternalLink, Shield } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Users, label: "O'quvchilar", end: true },
    { to: '/analytics', icon: BarChart3, label: 'Tahlillar' },
    { to: '/submissions', icon: BookOpen, label: 'Insholar Bazasi' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <span className="font-extrabold text-white text-base tracking-tight block">IELTS AI Admin</span>
          <span className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase">Writing Examiner</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Boshqaruv
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Tizim
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 cursor-pointer transition-colors">
          <Shield className="w-4 h-4" />
          <span>Xavfsizlik</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 cursor-pointer transition-colors">
          <Settings className="w-4 h-4" />
          <span>Sozlamalar</span>
        </div>
      </div>

      {/* Bot Status Card */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-300">Telegram Bot</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Faol
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2.5">
            @ielts_writing_bot
          </p>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <span>Botga o'tish</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
