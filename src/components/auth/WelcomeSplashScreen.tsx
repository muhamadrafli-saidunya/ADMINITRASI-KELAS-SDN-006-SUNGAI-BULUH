import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { SchoolLogoRenderer } from '../common/SchoolLogoRenderer';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  School,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Award,
  ChevronRight
} from 'lucide-react';

interface WelcomeSplashScreenProps {
  onContinue: () => void;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({ onContinue }) => {
  const { schoolInfo } = useApp();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Menghubungkan sistem administrasi sekolah...');

  useEffect(() => {
    const duration = 3800; // 3.8 seconds total
    const intervalTime = 40;
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }

        // Dynamic status text as progress advances
        if (next > 75) {
          setStatusText('Menyiapkan dashboard isian login guru & staf...');
        } else if (next > 45) {
          setStatusText(`Memuat data ${schoolInfo.schoolName} - ${schoolInfo.className}...`);
        } else if (next > 20) {
          setStatusText('Memverifikasi standar Kurikulum Merdeka Pembelajaran Mendalam (KMPM)...');
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [schoolInfo]);

  // Auto transition when progress hits 100%
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onContinue();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onContinue]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 flex flex-col justify-between items-center px-4 py-6 sm:p-8 overflow-hidden font-sans select-none selection:bg-blue-600 selection:text-white">
      {/* Background Animated Ambient Lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.28, 0.15],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/30 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.12, 0.25, 0.12],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.18, 0.08]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-500/20 blur-[90px]"
        />

        {/* Subtle Geometric Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      {/* Top Header: Instansi & Kurikulum Badge */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-slate-300">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
          <span className="font-bold tracking-wide">KEMENDIKDASMEN RI</span>
          <span className="text-slate-500">•</span>
          <span className="text-blue-300 font-semibold">Kurikulum Merdeka</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer group"
            title="Langsung menuju form login"
          >
            <span>Lewati</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.header>

      {/* Center Stage: Logo, App Name, & School Identity */}
      <div className="relative z-10 w-full max-w-3xl my-auto py-6 flex flex-col items-center text-center">
        {/* Animated School Logo with Glowing Halo */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="relative mb-6"
        >
          {/* Animated Glow Rings */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1.6],
              opacity: [0.6, 0.2, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeOut'
            }}
            className="absolute -inset-3 rounded-full bg-gradient-to-r from-blue-500 to-amber-400 blur-md pointer-events-none"
          />

          <motion.div
            animate={{
              scale: [1, 1.25, 1.4],
              opacity: [0.4, 0.1, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.8
            }}
            className="absolute -inset-6 rounded-full bg-indigo-500 blur-lg pointer-events-none"
          />

          {/* Core Logo Container */}
          <div className="relative p-2.5 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 ring-2 ring-blue-400/40 shadow-2xl shadow-blue-950/80">
            <SchoolLogoRenderer
              preset={schoolInfo.logoLeftPreset || 'tutwuri'}
              customUrl={schoolInfo.logoLeft}
              width={88}
              alt={schoolInfo.schoolName}
              className="drop-shadow-lg"
            />
          </div>

          {/* Floating Pill Badge */}
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] shadow-md border border-amber-300"
          >
            <Award className="h-3 w-3" />
            <span>Fase B</span>
          </motion.div>
        </motion.div>

        {/* Application Name with Shimmering Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="space-y-2 mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Aplikasi Resmi Administrasi Kelas & E-Rapor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-tight">
            Administrasi Kelas SD
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Sistem Informasi Pengelolaan Dokumen Pembelajaran, Buku Induk, Asesmen & Buku Rapor Kurikulum Merdeka Pembelajaran Mendalam (KMPM)
          </p>
        </motion.div>

        {/* School Identity Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/50 text-left my-2"
        >
          {/* School Name & NPSN Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30 shrink-0">
                <School className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {schoolInfo.schoolName}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>NPSN: <strong className="text-slate-200 font-mono">{schoolInfo.npsn}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Akreditasi A</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-xs">
                {schoolInfo.className}
              </span>
            </div>
          </div>

          {/* School Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Alamat / Wilayah</span>
                <span className="font-semibold text-slate-200">
                  {schoolInfo.city}, {schoolInfo.province}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <Calendar className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Tahun Pelajaran</span>
                <span className="font-semibold text-slate-200">
                  {schoolInfo.academicYear} • Smt {schoolInfo.semester.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Wali Kelas</span>
                <span className="font-semibold text-slate-200 truncate block">
                  {schoolInfo.homeroomTeacherName.split(',')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Key Modules Highlights */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[11px] text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Buku Induk & Biodata Siswa
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              Nilai Formatif & Sumatif
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
              Rapor SAS & STS Siap Cetak
            </span>
          </div>
        </motion.div>

        {/* Action Button: Manual Proceed to Login */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center"
        >
          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/40 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Masuk ke Halaman Login</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Progress Bar & Status Text */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative z-10 w-full max-w-md mx-auto space-y-2 text-center"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span className="truncate">{statusText}</span>
          <span className="font-mono text-blue-400 font-bold ml-2 shrink-0">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Smooth Track & Indicator */}
        <div className="h-2 w-full rounded-full bg-slate-800/80 p-0.5 border border-slate-700/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          © 2026 {schoolInfo.schoolName} • Kemendikdasmen RI
        </p>
      </motion.footer>
    </div>
  );
};
