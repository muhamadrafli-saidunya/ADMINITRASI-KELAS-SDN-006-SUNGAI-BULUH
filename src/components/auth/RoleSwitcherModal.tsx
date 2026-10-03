import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { UserProfile, UserRole } from '../../types';
import { ShieldCheck, UserCheck, User, Check, BookOpen, KeyRound } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose
}) => {
  const { availableUsers, currentUser, setCurrentUser, addToast, setCurrentTab, logout, rolePermissions, hasPermission } = useApp();

  const handleSelectUser = (user: UserProfile) => {
    if (user.status === 'Nonaktif') {
      addToast('error', 'Akun Nonaktif', `Akun ${user.name} sedang dinonaktifkan oleh Administrator.`);
      return;
    }

    setCurrentUser(user);
    addToast('success', 'Beralih Akun', `Anda sekarang masuk sebagai ${user.name} (${user.title})`);
    
    // Check if current tab is accessible
    if (!hasPermission(user.customAllowedTabs?.[0] ? 'dashboard' : 'dashboard', user)) {
      setCurrentTab('dashboard');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ganti Pengguna & Mode Hak Akses"
      subtitle="Pilih salah satu profil untuk mensimulasikan sistem multi-user Administrasi SD"
      maxWidth="lg"
      icon={<UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Pilih akun pengguna yang terdaftar di sistem untuk beralih hak akses dan menu:
        </p>

        <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {availableUsers.map(user => {
            const isCurrent = currentUser.id === user.id;
            const isInactive = user.status === 'Nonaktif';

            let roleBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
            let roleLabel = 'Wali Kelas';
            let roleDescription = 'Akses pengelolaan kelas: input nilai, presensi, jurnal mengajar, kas, inventaris, dan cetak rapor.';

            if (user.role === 'admin') {
              roleBadge = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
              roleLabel = 'Kepsek / Admin';
              roleDescription = 'Akses penuh ke seluruh modul sistem, data guru, manajemen akun pengguna, pengaturan hak akses, dan backup.';
            } else if (user.role === 'guru_mapel') {
              roleBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
              roleLabel = 'Guru Mapel';
              roleDescription = 'Akses penilaian mata pelajaran spesifik, absensi siswa, jurnal harian, dan jadwal ajar.';
            } else if (user.role === 'siswa') {
              roleBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
              roleLabel = 'Siswa / Ortu';
              roleDescription = 'Portal Siswa & Wali Murid: Melihat e-rapor, rekap kehadiran pribadi, jadwal pelajaran, dan catatan bimbingan.';
            }

            const allowedMenuCount = (rolePermissions[user.role] || []).length;

            return (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : isInactive
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleBadge}`}>
                        {roleLabel}
                      </span>
                      {isInactive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          Nonaktif
                        </span>
                      )}
                    </div>

                    {isCurrent && (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <Check className="h-4 w-4" />
                        <span>Sedang Aktif</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {user.title} • {user.nipOrNisn ? (user.nipOrNisn.length > 10 ? `NIP: ${user.nipOrNisn}` : `NISN: ${user.nipOrNisn}`) : ''}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Username: <strong className="text-slate-700 dark:text-slate-200">{user.username}</strong></span>
                    <span>•</span>
                    <span>Hak Akses: <strong className="text-blue-600 dark:text-blue-400">{allowedMenuCount} Menu</strong></span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {roleDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          >
            <span>Keluar & Kembali ke Halaman Login</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
