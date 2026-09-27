import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md', showLabel = false }) => {
  let colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
  if (score >= 7.5) {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (score >= 6.5) {
    colorStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (score >= 6.0) {
    colorStyles = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-semibold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border shadow-sm ${colorStyles} ${sizeStyles}`}>
      {showLabel && <span className="font-normal opacity-75">Band</span>}
      <span>{score.toFixed(1)}</span>
    </span>
  );
};
