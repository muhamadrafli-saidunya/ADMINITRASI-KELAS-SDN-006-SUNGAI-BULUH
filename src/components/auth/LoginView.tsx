import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolLogoRenderer } from '../common/SchoolLogoRenderer';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  School,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Info
} from 'lucide-react';

interface LoginViewProps {
  onBackToSplash?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBackToSplash }) => {
  const { login, availableUsers, schoolInfo } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(identifier, password);
      if (!result.success) {
        setErrorMessage(result.error || 'ID Pengguna atau Kata Sandi salah.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleSelectDemoAccount = (u: typeof availableUsers[0]) => {
    setErrorMessage(null);
    const demoUser = u.username || u.email;
    const demoPass = u.password || '123456';
    setIdentifier(demoUser);
    setPassword(demoPass);
  };

  const handleQuickLoginAs = (u: typeof availableUsers[0]) => {
    setErrorMessage(null);
    const demoUser = u.username || u.email;
    const demoPass = u.password || '123456';
    setIdentifier(demoUser);
    setPassword(demoPass);
    setIsLoading(true);

    setTimeout(() => {
      login(demoUser, demoPass);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans antialiased p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Blur Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center justify-center rounded-2xl bg-slate-800/90 p-1.5 ring-2 ring-blue-400/30 shadow-lg">
            <SchoolLogoRenderer
              preset={schoolInfo.logoLeftPreset || 'tutwuri'}
              customUrl={schoolInfo.logoLeft}
              width={42}
              alt={schoolInfo.schoolName}
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>{schoolInfo.schoolName}</span>
              <span className="hidden sm:inline-flex rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                NPSN: {schoolInfo.npsn}
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Sistem Informasi Administrasi Kelas SD & Kurikulum Merdeka
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onBackToSplash && (
            <button
              type="button"
              onClick={onBackToSplash}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 backdrop-blur-sm transition-all cursor-pointer shadow-xs"
              title="Kembali ke tampilan animasi awal dan identitas sekolah"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Animasi Awal</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>T.A. {schoolInfo.academicYear} • Smt {schoolInfo.semester.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Portal Masuk Dashboard Guru & Administrasi</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Akses Manajemen Kelas <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                Cepat, Tertib & Siap Cetak
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Masuk menggunakan ID Pengguna / Email dan kata sandi untuk mengelola data siswa, presensi harian, nilai formatif & sumatif, e-raport, serta asisten mengajar berbasis Kurikulum Merdeka.
            </p>
          </div>

          {/* Key Capabilities List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200">Presensi & Rekap Otomatis</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200">Rapor KMPM (Pembelajaran Mendalam)</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200">Jurnal Guru & Kas Kelas</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200">AI Asisten Modul & Rapor</span>
            </div>
          </div>

          {/* Quick Demo Selector Tabs */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <KeyRound className="h-4 w-4 text-amber-400" />
                <span>Pilih Akun Demo (Klik untuk Isi Otomatis)</span>
              </div>
              <span className="text-[11px] text-slate-400">{availableUsers.length} Akun Tersedia</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {availableUsers.map((u) => {
                const isWali = u.role === 'wali_kelas';
                const isAdmin = u.role === 'admin';
                const isMapel = u.role === 'guru_mapel';
                const isInactive = u.status === 'Nonaktif';

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectDemoAccount(u)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all group ${
                      isInactive 
                        ? 'bg-slate-900/40 border-slate-800 opacity-60' 
                        : 'bg-slate-900/80 border-slate-700 hover:border-blue-500/80 hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-600 shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-300">
                          {u.name.split(',')[0]}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isWali 
                          ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' 
                          : isAdmin 
                          ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' 
                          : isMapel
                          ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                          : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                      }`}>
                        {isWali ? 'Wali Kelas' : isAdmin ? 'Kepsek' : isMapel ? 'Guru Mapel' : 'Siswa'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>ID: <strong className="text-slate-300 font-semibold">{u.username}</strong></span>
                      <span>Sandi: <strong className="text-amber-400 font-semibold">{u.password}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Login Card with Password Field */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200 dark:border-slate-800">
            <div className="mb-6 text-center sm:text-left">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 mb-3 ring-1 ring-blue-500/20">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Masuk ke Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Silakan isi ID Pengguna dan kolom kata sandi akun Anda.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / ID / Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  ID Pengguna / Username / Email / NIP
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Contoh: guru4a, admin, atau email"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Field (Kolom Sandi) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Kolom Kata Sandi
                  </label>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    Demo: <code className="font-mono bg-blue-50 dark:bg-blue-950 px-1 py-0.5 rounded">guru123</code>
                  </span>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masukkan kata sandi..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-3 pl-10 pr-11 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Quick Help */}
              <div className="flex items-center justify-between py-1 text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Ingat Akun Saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('guru4a');
                    setPassword('guru123');
                  }}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Isi Sandi Guru
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-70 transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Login Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Akses Instan 1-Klik
              </p>
              <div className="grid grid-cols-3 gap-2">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLoginAs(u)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-colors"
                  >
                    <span>{u.role === 'wali_kelas' ? '👩‍🏫 Guru 4A' : u.role === 'admin' ? '👨‍💼 Kepsek' : '🎒 Siswa'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Koneksi Aman Sistem Administrasi Sekolah Dasar</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-800/40">
        <p>
          © 2026 {schoolInfo.schoolName} • Sistem Pengelolaan Dokumen Administrasi & Buku Rapor Kurikulum Merdeka Pembelajaran Mendalam (KMPM)
        </p>
      </footer>
    </div>
  );
};
