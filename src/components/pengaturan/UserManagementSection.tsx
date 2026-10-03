import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ImageUploadAvatar } from '../common/ImageUploadAvatar';
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCheck,
  User,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Lock,
  RefreshCw,
  Sparkles,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export const UserManagementSection: React.FC = () => {
  const {
    availableUsers,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword,
    rolePermissions,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Aktif' | 'Nonaktif'>('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState<Omit<UserProfile, 'id'>>({
    name: '',
    username: '',
    password: '',
    email: '',
    role: 'wali_kelas',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'Wali Kelas',
    nipOrNisn: '',
    classAssigned: 'Kelas 4A',
    status: 'Aktif',
    phone: ''
  });

  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      role: 'wali_kelas',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Wali Kelas',
      nipOrNisn: '',
      classAssigned: 'Kelas 4A',
      status: 'Aktif',
      phone: ''
    });
    setSelectedUser(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username || '',
      password: user.password || '',
      email: user.email,
      role: user.role,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: user.title,
      nipOrNisn: user.nipOrNisn,
      classAssigned: user.classAssigned,
      status: user.status || 'Aktif',
      phone: user.phone || ''
    });
    setIsEditModalOpen(true);
  };

  const handleOpenPasswordModal = (user: UserProfile) => {
    setSelectedUser(user);
    setNewPassword(user.password || '123456');
    setIsPasswordModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addUser(formData);
    if (res.success) {
      setIsAddModalOpen(false);
      resetForm();
    } else if (res.error) {
      addToast('error', 'Gagal Menambah Pengguna', res.error);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const res = updateUser(selectedUser.id, formData);
    if (res.success) {
      setIsEditModalOpen(false);
      resetForm();
    } else if (res.error) {
      addToast('error', 'Gagal Memperbarui Pengguna', res.error);
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    resetUserPassword(selectedUser.id, newPassword);
    setIsPasswordModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    const res = deleteUser(userToDelete.id);
    if (!res.success && res.error) {
      addToast('error', 'Gagal Menghapus', res.error);
    }
    setUserToDelete(null);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(result);
  };

  // Filtered users
  const filteredUsers = availableUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nipOrNisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.classAssigned.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (u.status || 'Aktif') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            <ShieldCheck className="h-3 w-3" />
            Kepala Sekolah / Admin
          </span>
        );
      case 'wali_kelas':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <UserCheck className="h-3 w-3" />
            Wali Kelas
          </span>
        );
      case 'guru_mapel':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <BookOpen className="h-3 w-3" />
            Guru Mapel
          </span>
        );
      case 'siswa':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <User className="h-3 w-3" />
            Siswa / Wali Murid
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card with action */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Manajemen Akun Pengguna & Hak Akses Login</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftarkan akun kepala sekolah, guru kelas, guru mata pelajaran, dan portal wali murid
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all self-start sm:self-auto shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, username, email, NIP, atau kelas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Peran ({availableUsers.length})</option>
            <option value="admin">Kepsek / Admin</option>
            <option value="wali_kelas">Wali Kelas</option>
            <option value="guru_mapel">Guru Mapel</option>
            <option value="siswa">Siswa / Ortu</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="Aktif">Status: Aktif</option>
            <option value="Nonaktif">Status: Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map(user => {
          const isCurrentUser = currentUser.id === user.id;
          const isInactive = user.status === 'Nonaktif';
          const menuCount = (rolePermissions[user.role] || []).length;

          return (
            <div
              key={user.id}
              className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm transition-all relative flex flex-col justify-between ${
                isCurrentUser
                  ? 'border-blue-500/80 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/10'
                  : isInactive
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-75'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                            Anda
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {user.title} • <span className="font-semibold text-slate-700 dark:text-slate-300">{user.classAssigned}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {getRoleBadge(user.role)}
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(user.id)}
                      disabled={isCurrentUser}
                      title={isCurrentUser ? 'Tidak dapat menonaktifkan akun sendiri' : 'Klik untuk ubah status'}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                        isInactive
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-200'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200'
                      }`}
                    >
                      {isInactive ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      <span>{user.status || 'Aktif'}</span>
                    </button>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-mono mb-4 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">ID Pengguna / Username</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{user.username}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Kata Sandi Akun</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {user.password || '******'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">NIP / NISN</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block">
                      {user.nipOrNisn || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Hak Akses Menu</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 block">
                      {menuCount} Menu Aktif
                    </span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
                  {user.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.lastLogin && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Login: {new Date(user.lastLogin).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenPasswordModal(user)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Ubah Sandi</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(user)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Profil</span>
                  </button>

                  <button
                    type="button"
                    disabled={isCurrentUser}
                    onClick={() => setUserToDelete(user)}
                    title={isCurrentUser ? 'Tidak dapat menghapus akun aktif' : 'Hapus akun'}
                    className={`p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ${
                      isCurrentUser ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="col-span-2 p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
            <Users className="h-10 w-10 mx-auto text-slate-400 mb-2 opacity-50" />
            <p className="text-sm font-bold">Tidak ada akun pengguna yang cocok</p>
            <p className="text-xs mt-1">Coba gunakan kata kunci pencarian atau filter yang berbeda.</p>
          </div>
        )}
      </div>

      {/* Modal Add User */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Pendaftaran Akun Pengguna Baru"
        subtitle="Tambahkan profil login baru untuk guru, kepala sekolah, atau akses wali murid"
        maxWidth="2xl"
        icon={<UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ImageUploadAvatar
                label="Foto Profil Akun Pengguna"
                description="Unggah foto profil asli dari komputer/HP, ambil via kamera, atau pilih avatar siap pakai."
                type="user"
                value={formData.avatar}
                onChange={(newAvatar) => setFormData({ ...formData, avatar: newAvatar })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Dra. Hj. Siti Rohmah, M.Pd."
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Username / ID Pengguna *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: guru4b, kepsek01, pakbudi"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi Awal *
              </label>
              <input
                type="text"
                required
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Peran & Hak Akses (Role) *
              </label>
              <select
                required
                value={formData.role}
                onChange={e => {
                  const r = e.target.value as UserRole;
                  let defTitle = 'Wali Kelas';
                  if (r === 'admin') defTitle = 'Kepala Sekolah / Admin';
                  if (r === 'guru_mapel') defTitle = 'Guru Mata Pelajaran';
                  if (r === 'siswa') defTitle = 'Siswa & Wali Murid';
                  setFormData({ ...formData, role: r, title: defTitle });
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="wali_kelas">Wali Kelas / Guru Kelas</option>
                <option value="admin">Kepala Sekolah / Administrator</option>
                <option value="guru_mapel">Guru Mata Pelajaran (Mapel)</option>
                <option value="siswa">Siswa & Wali Murid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jabatan / Keterangan Tugas
              </label>
              <input
                type="text"
                placeholder="Contoh: Wali Kelas 4B / Guru PJOK"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIP / NISN
              </label>
              <input
                type="text"
                placeholder="Contoh: 19850614 201001 1 012"
                value={formData.nipOrNisn}
                onChange={e => setFormData({ ...formData, nipOrNisn: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Penugasan Kelas / Ruang
              </label>
              <input
                type="text"
                placeholder="Contoh: Kelas 4B / Semua Kelas"
                value={formData.classAssigned}
                onChange={e => setFormData({ ...formData, classAssigned: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="user@sdn.sch.id"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp / HP
              </label>
              <input
                type="tel"
                placeholder="081234567890"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all"
            >
              Daftarkan Akun
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit User */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profil Akun Pengguna"
        subtitle="Perbarui data identitas, tugas kelas, foto profil, dan peran akun"
        maxWidth="2xl"
        icon={<Edit2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ImageUploadAvatar
                label="Foto Profil Akun Pengguna"
                description="Ganti foto profil dengan unggah foto baru dari perangkat, foto langsung via kamera, atau pilih avatar."
                type="user"
                value={formData.avatar}
                onChange={(newAvatar) => setFormData({ ...formData, avatar: newAvatar })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Username / ID Pengguna *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Peran & Hak Akses (Role) *
              </label>
              <select
                required
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="wali_kelas">Wali Kelas / Guru Kelas</option>
                <option value="admin">Kepala Sekolah / Administrator</option>
                <option value="guru_mapel">Guru Mata Pelajaran (Mapel)</option>
                <option value="siswa">Siswa & Wali Murid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jabatan / Keterangan Tugas
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIP / NISN
              </label>
              <input
                type="text"
                value={formData.nipOrNisn}
                onChange={e => setFormData({ ...formData, nipOrNisn: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Penugasan Kelas
              </label>
              <input
                type="text"
                value={formData.classAssigned}
                onChange={e => setFormData({ ...formData, classAssigned: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Akun
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Aktif">Aktif (Dapat Login)</option>
                <option value="Nonaktif">Nonaktif (Diblokir)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp / Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Reset Password */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Reset Kata Sandi Pengguna"
        subtitle={`Ubah kata sandi untuk akun ${selectedUser?.name}`}
        maxWidth="md"
        icon={<KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
      >
        <form onSubmit={handleSavePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Kata Sandi Baru untuk {selectedUser?.username} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-3.5 pr-20 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Buat sandi acak yang aman:
            </span>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Acak Sandi</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all"
            >
              Perbarui Kata Sandi
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Akun Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun ${userToDelete?.name} (${userToDelete?.username})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Akun"
        type="danger"
      />
    </div>
  );
};
