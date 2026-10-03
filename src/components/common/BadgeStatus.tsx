import React from 'react';

interface BadgeStatusProps {
  status: string;
  variant?: 'auto' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  status,
  variant = 'auto',
  size = 'md'
}) => {
  let resolvedVariant = variant;

  if (variant === 'auto') {
    const s = status.toLowerCase();
    if (s.includes('hadir') || s.includes('aktif') || s.includes('lunas') || s.includes('baik') || s.includes('tuntas') || s.includes('selesai') || s.includes('sangat baik')) {
      resolvedVariant = 'success';
    } else if (s.includes('sakit') || s.includes('izin') || s.includes('pantau') || s.includes('sedang') || s.includes('tertunda') || s.includes('rusak ringan')) {
      resolvedVariant = 'warning';
    } else if (s.includes('alpa') || s.includes('rusak berat') || s.includes('belum') || s.includes('non-aktif') || s.includes('perlu perhatian') || s.includes('mutasi')) {
      resolvedVariant = 'error';
    } else if (s.includes('prestasi') || s.includes('bos') || s.includes('pemerintah')) {
      resolvedVariant = 'info';
    } else {
      resolvedVariant = 'neutral';
    }
  }

  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    error: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-0.5 text-xs font-semibold',
    lg: 'px-3 py-1 text-xs font-bold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${styles[resolvedVariant]} ${sizes[size]} whitespace-nowrap`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
