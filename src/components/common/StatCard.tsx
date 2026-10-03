import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  colorTheme?: 'blue' | 'orange' | 'emerald' | 'purple' | 'amber' | 'cyan';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorTheme = 'blue',
  onClick
}) => {
  const colorMap = {
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
      border: 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700',
      glow: 'hover:shadow-blue-500/5'
    },
    orange: {
      bgIcon: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400',
      border: 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700',
      glow: 'hover:shadow-orange-500/5'
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
      border: 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700',
      glow: 'hover:shadow-emerald-500/5'
    },
    purple: {
      bgIcon: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
      border: 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700',
      glow: 'hover:shadow-purple-500/5'
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
      border: 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700',
      glow: 'hover:shadow-amber-500/5'
    },
    cyan: {
      bgIcon: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400',
      border: 'border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700',
      glow: 'hover:shadow-cyan-500/5'
    }
  };

  const currentTheme = colorMap[colorTheme] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border bg-white p-5 dark:bg-slate-900 shadow-sm transition-all duration-200 ${currentTheme.border} ${currentTheme.glow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  trend.isPositive !== false
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${currentTheme.bgIcon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
