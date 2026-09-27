import React from 'react';
import { X, Award, CheckCircle2, BookOpen, Clock, Copy, Check } from 'lucide-react';
import { SubmissionDetail } from '../types';
import { ScoreBadge } from './ScoreBadge';

interface SubmissionModalProps {
  submission: SubmissionDetail | null;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ submission, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!submission) return null;

  const copyEssay = () => {
    navigator.clipboard.writeText(submission.essay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const criteriaLabels = {
    tr_ta: submission.task_type === 'task1' ? 'Task Achievement' : 'Task Response',
    cc: 'Coherence & Cohesion',
    lr: 'Lexical Resource',
    gra: 'Grammatical Range & Accuracy',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md tracking-wide ${
              submission.task_type === 'task2' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {submission.task_type === 'task2' ? 'Writing Task 2' : 'Writing Task 1'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(submission.created_at).toLocaleString('uz-UZ', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Topic Title */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Mavzu / Savol</h3>
            <p className="text-base font-semibold text-slate-900 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              {submission.topic}
            </p>
          </div>

          {/* Scores Breakdown Card */}
          <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-slate-50 p-5 rounded-2xl border border-indigo-100/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
              <div>
                <span className="text-xs font-medium text-slate-500">Umumiy Natija</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-slate-900">Overall Band</span>
                  <ScoreBadge score={submission.band_score} size="lg" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100/70 px-3 py-1.5 rounded-lg w-fit">
                <Award className="w-4 h-4" />
                <span>AI IELTS Examiner bahosi</span>
              </div>
            </div>

            {/* 4 Criteria Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-white/80 p-3 rounded-xl border border-indigo-50 text-center">
                <span className="text-[11px] font-medium text-slate-500 block truncate" title={criteriaLabels.tr_ta}>
                  {criteriaLabels.tr_ta}
                </span>
                <span className="text-lg font-bold text-slate-800">{submission.criteria_scores.tr_ta.toFixed(1)}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-indigo-50 text-center">
                <span className="text-[11px] font-medium text-slate-500 block truncate" title="Coherence & Cohesion">
                  Coherence & Cohesion
                </span>
                <span className="text-lg font-bold text-slate-800">{submission.criteria_scores.cc.toFixed(1)}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-indigo-50 text-center">
                <span className="text-[11px] font-medium text-slate-500 block truncate" title="Lexical Resource">
                  Lexical Resource
                </span>
                <span className="text-lg font-bold text-slate-800">{submission.criteria_scores.lr.toFixed(1)}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-indigo-50 text-center">
                <span className="text-[11px] font-medium text-slate-500 block truncate" title="Grammatical Range">
                  Grammar & Accuracy
                </span>
                <span className="text-lg font-bold text-slate-800">{submission.criteria_scores.gra.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Recommendations (3 ta tuzatish tavsiyasi) */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3 ta asosiy tuzatish tavsiyasi</span>
            </h4>
            <ul className="space-y-2.5">
              {submission.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Feedback / Izoh */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Examiner Umumiy Izohi</h4>
            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/70 leading-relaxed">
              {submission.feedback}
            </div>
          </div>

          {/* Essay Text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Yuborilgan Insho Matni</span>
              </h4>
              <button
                onClick={copyEssay}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Nusxalandi" : "Nusxa olish"}</span>
              </button>
            </div>
            <div className="text-sm text-slate-800 bg-white p-5 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed font-serif shadow-inner">
              {submission.essay}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
