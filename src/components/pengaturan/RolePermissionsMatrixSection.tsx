import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab, UserRole } from '../../types';
import { MENU_PERMISSIONS_LIST, DEFAULT_ROLE_PERMISSIONS } from '../../data/initialData';
import {
  ShieldCheck,
  UserCheck,
  BookOpen,
  User,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Info,
  Lock,
  Unlock,
  SlidersHorizontal
} from 'lucide-react';

export const RolePermissionsMatrixSection: React.FC = () => {
  const {
    rolePermissions,
    updateRolePermissions,
    resetRolePermissionsToDefault,
    addToast
  } = useApp();

  const roles: Array<{
    id: UserRole;
    name: string;
    description: string;
    badge: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'admin',
      name: 'Kepala Sekolah / Admin',
      description: 'Supervisi madrasah/sekolah & manajemen sistem',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      icon: <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    },
    {
      id: 'wali_kelas',
      name: 'Wali Kelas / Guru Kelas',
      description: 'Pengelolaan penuh administrasi satu rombel kelas',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      icon: <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    },
    {
      id: 'guru_mapel',
      name: 'Guru Mata Pelajaran',
      description: 'Penilaian mapel, presensi siswa, dan jurnal ajar',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      icon: <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
    },
    {
      id: 'siswa',
      name: 'Siswa & Wali Murid',
      description: 'Portal akses pantauan rapor, absensi, & jadwal',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      icon: <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    }
  ];

  const handleToggle = (role: UserRole, tab: ActiveTab) => {
    const currentAllowed = rolePermissions[role] || DEFAULT_ROLE_PERMISSIONS[role] || [];
    
    // Admin must always retain at least 'pengaturan' or 'dashboard'
    if (role === 'admin' && tab === 'pengaturan' && currentAllowed.includes('pengaturan')) {
      addToast('warning', 'Akses Terkunci', 'Menu Pengaturan wajib aktif untuk Administrator agar tidak terkunci keluar dari sistem.');
      return;
    }

    let nextAllowed: ActiveTab[];
    if (currentAllowed.includes(tab)) {
      nextAllowed = currentAllowed.filter(t => t !== tab);
    } else {
      nextAllowed = [...currentAllowed, tab];
    }

    updateRolePermissions(role, nextAllowed);
  };

  const handleSelectAllForRole = (role: UserRole) => {
    const allTabs = MENU_PERMISSIONS_LIST.map(m => m.id);
    updateRolePermissions(role, allTabs);
    addToast('success', 'Semua Menu Diaktifkan', `Seluruh menu diaktifkan untuk peran ${role}.`);
  };

  const handleClearAllForRole = (role: UserRole) => {
    if (role === 'admin') {
      updateRolePermissions(role, ['dashboard', 'pengaturan']);
      addToast('info', 'Reset Admin', 'Peran Admin disisakan menu Dashboard & Pengaturan.');
      return;
    }
    updateRolePermissions(role, ['dashboard']);
    addToast('info', 'Menu Dikosongkan', `Hanya menu Dashboard tersisa untuk peran ${role}.`);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Utama':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'Akademik':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'Administrasi':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'Layanan Siswa':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'Sistem & AI':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span>Matriks Pengaturan Hak Akses Menu Saat Login</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atur visibilitas dan izin buka menu navigasi sidebar untuk setiap tingkatan pengguna secara dinamis
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={resetRolePermissionsToDefault}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Kembalikan Default</span>
          </button>
        </div>
      </div>

      {/* Info notice */}
      <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 dark:bg-blue-950/30 dark:border-blue-900/50 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <strong>Prinsip Hak Akses (Role-Based Access Control):</strong> Centang menu yang diizinkan untuk masing-masing peran. Setiap pengguna yang masuk dengan perannya akan langsung melihat menu yang telah Anda tentukan di sidebar secara otomatis tanpa perlu restart aplikasi.
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
                <th className="p-4 font-bold text-slate-700 dark:text-slate-200 min-w-[240px]">
                  Menu & Modul Aplikasi
                </th>
                {roles.map(role => (
                  <th
                    key={role.id}
                    className="p-4 font-bold text-slate-700 dark:text-slate-200 min-w-[170px] text-center"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        {role.icon}
                        <span className="font-bold text-xs">{role.name.split('/')[0]}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${role.badge}`}>
                        {role.id.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleSelectAllForRole(role.id)}
                          className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          Pilih Semua
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <button
                          type="button"
                          onClick={() => handleClearAllForRole(role.id)}
                          className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                        >
                          Kosongkan
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MENU_PERMISSIONS_LIST.map((menu) => {
                return (
                  <tr
                    key={menu.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-start gap-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {menu.label}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getCategoryBadge(menu.category)}`}>
                              {menu.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {menu.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {roles.map(role => {
                      const isAllowed = (rolePermissions[role.id] || []).includes(menu.id);
                      const isLockedAdmin = role.id === 'admin' && menu.id === 'pengaturan';

                      return (
                        <td key={role.id} className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(role.id, menu.id)}
                            disabled={isLockedAdmin}
                            title={isLockedAdmin ? 'Menu Pengaturan terkunci untuk Admin' : isAllowed ? 'Klik untuk cabut hak akses' : 'Klik untuk berikan hak akses'}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-xl transition-all ${
                              isAllowed
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60 shadow-sm'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            } ${isLockedAdmin ? 'opacity-70 cursor-not-allowed' : 'active:scale-90'}`}
                          >
                            {isAllowed ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
