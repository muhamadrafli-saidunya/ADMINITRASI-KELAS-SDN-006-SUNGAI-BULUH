import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CashTransaction } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { BadgeStatus } from '../common/BadgeStatus';
import {
  WalletCards,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Printer,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Receipt,
  Trash2,
  Check,
  CreditCard,
  UserCheck,
  Coins,
  History,
  CheckSquare,
  Square,
  Sparkles,
  FileText,
  User,
  Pencil
} from 'lucide-react';

export const KasKelasView: React.FC = () => {
  const {
    transactions,
    cashTransactions,
    addCashTransaction,
    updateCashTransaction,
    deleteCashTransaction,
    weeklyDues,
    toggleStudentDues,
    recordStudentDuesDeposit,
    getCurrentCashBalance,
    students,
    schoolInfo,
    currentUser,
    addToast
  } = useApp();

  const allTransactions = cashTransactions || transactions || [];

  const [activeSubTab, setActiveSubTab] = useState<'transaksi' | 'riwayat_setor'>('transaksi');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Semua' | 'Pemasukan' | 'Pengeluaran'>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [editingGeneralTxId, setEditingGeneralTxId] = useState<string | null>(null);
  const [editingDepositTxId, setEditingDepositTxId] = useState<string | null>(null);
  const [txToDelete, setTxToDelete] = useState<CashTransaction | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<CashTransaction | null>(null);

  // Form State: Transaksi Kas Umum
  const [formData, setFormData] = useState<{
    tanggal: string;
    keterangan: string;
    jenis: 'Pemasukan' | 'Pengeluaran';
    kategori: string;
    jumlah: number;
    namaSiswa?: string;
    penanggungJawab: string;
  }>({
    tanggal: '2026-08-17',
    keterangan: '',
    jenis: 'Pemasukan',
    kategori: 'Iuran Kas Siswa',
    jumlah: 50000,
    namaSiswa: '',
    penanggungJawab: 'Gita Maharani (Bendahara)'
  });

  // Form State: Setor Iuran Siswa (Nama Siswa & Jumlah Iuran yang Disetor)
  const [depositForm, setDepositForm] = useState<{
    siswaId: string;
    namaSiswa: string;
    jumlah: number;
    tanggal: string;
    mingguKe: number[];
    metodePembayaran: 'Tunai' | 'Transfer' | 'QRIS';
    keterangan: string;
    catatKeKas: boolean;
  }>({
    siswaId: students[0]?.id || '',
    namaSiswa: students[0]?.nama || '',
    jumlah: 10000,
    tanggal: '2026-08-17',
    mingguKe: [1, 2],
    metodePembayaran: 'Tunai',
    keterangan: 'Setoran iuran kas rutin pekan 1 & 2',
    catatKeKas: true
  });

  // Calculate totals
  const totalPemasukan = allTransactions
    .filter(t => t.jenis === 'Pemasukan')
    .reduce((sum, t) => sum + (t.jumlah || (t as any).nominal || 0), 0);

  const totalPengeluaran = allTransactions
    .filter(t => t.jenis === 'Pengeluaran')
    .reduce((sum, t) => sum + (t.jumlah || (t as any).nominal || 0), 0);

  const saldoAkhir = getCurrentCashBalance();

  // Helper to open general transaction modal
  const handleOpenAdd = (defaultType: 'Pemasukan' | 'Pengeluaran' = 'Pemasukan') => {
    setEditingGeneralTxId(null);
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: defaultType === 'Pemasukan' ? 'Pemasukan kas sumbangan paguyuban' : 'Pembelian spidol whiteboard & penghapus',
      jenis: defaultType,
      kategori: defaultType === 'Pemasukan' ? 'Donasi Paguyuban' : 'ATK / Spidol',
      jumlah: defaultType === 'Pemasukan' ? 100000 : 25000,
      namaSiswa: '',
      penanggungJawab: 'Gita Maharani (Bendahara)'
    });
    setIsAddModalOpen(true);
  };

  // Helper to open deposit modal for a specific student or general
  const handleOpenDepositModal = (studentId?: string) => {
    setEditingDepositTxId(null);
    const targetStudent = studentId 
      ? students.find(s => s.id === studentId)
      : students[0];

    const studentDues = targetStudent 
      ? weeklyDues.find(d => d.siswaId === targetStudent.id) 
      : null;

    // Calculate unpaid weeks for smart suggestion
    const unpaidWeeks: number[] = [];
    if (studentDues) {
      if (!studentDues.minggu1) unpaidWeeks.push(1);
      if (!studentDues.minggu2) unpaidWeeks.push(2);
      if (!studentDues.minggu3) unpaidWeeks.push(3);
      if (!studentDues.minggu4) unpaidWeeks.push(4);
    } else {
      unpaidWeeks.push(3, 4);
    }

    const suggestedWeeks = unpaidWeeks.length > 0 ? unpaidWeeks.slice(0, 2) : [1];
    const suggestedNominal = (suggestedWeeks.length || 1) * 5000;

    setDepositForm({
      siswaId: targetStudent?.id || '',
      namaSiswa: targetStudent?.nama || '',
      jumlah: suggestedNominal,
      tanggal: new Date().toISOString().split('T')[0],
      mingguKe: suggestedWeeks,
      metodePembayaran: 'Tunai',
      keterangan: `Setoran iuran kas rutin ${suggestedWeeks.length > 0 ? `Minggu ${suggestedWeeks.join(', ')}` : ''}`,
      catatKeKas: true
    });
    setIsDepositModalOpen(true);
  };

  // Helper to open edit modal for any transaction
  const handleOpenEdit = (tx: CashTransaction) => {
    const isDeposit = tx.kategori === 'Iuran Kas Siswa' || tx.kategori === 'Iuran Kas Mingguan' || !!tx.namaSiswa || !!tx.siswaId;

    if (isDeposit) {
      const student = students.find(s => s.id === tx.siswaId || s.nama === tx.namaSiswa) || students[0];
      const weeks = Array.isArray(tx.mingguKe)
        ? tx.mingguKe
        : typeof tx.mingguKe === 'number'
        ? [tx.mingguKe]
        : [1, 2];

      setEditingDepositTxId(tx.id);
      setDepositForm({
        siswaId: tx.siswaId || student?.id || '',
        namaSiswa: tx.namaSiswa || student?.nama || '',
        jumlah: tx.jumlah || (tx as any).nominal || 0,
        tanggal: tx.tanggal,
        mingguKe: weeks,
        metodePembayaran: (tx.metodePembayaran as any) || 'Tunai',
        keterangan: tx.keterangan || '',
        catatKeKas: true
      });
      setIsDepositModalOpen(true);
    } else {
      setEditingGeneralTxId(tx.id);
      setFormData({
        tanggal: tx.tanggal,
        keterangan: tx.keterangan,
        jenis: tx.jenis,
        kategori: tx.kategori,
        jumlah: tx.jumlah || (tx as any).nominal || 0,
        namaSiswa: tx.namaSiswa || '',
        penanggungJawab: tx.penanggungJawab || 'Bendahara Kelas'
      });
      setIsAddModalOpen(true);
    }
  };

  // When student selection changes in deposit form
  const handleStudentChangeInDeposit = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const studentDues = weeklyDues.find(d => d.siswaId === studentId);
    const unpaidWeeks: number[] = [];
    if (studentDues) {
      if (!studentDues.minggu1) unpaidWeeks.push(1);
      if (!studentDues.minggu2) unpaidWeeks.push(2);
      if (!studentDues.minggu3) unpaidWeeks.push(3);
      if (!studentDues.minggu4) unpaidWeeks.push(4);
    } else {
      unpaidWeeks.push(3, 4);
    }

    const suggestedWeeks = unpaidWeeks.length > 0 ? unpaidWeeks.slice(0, 2) : [1];
    const suggestedNominal = (suggestedWeeks.length || 1) * 5000;

    setDepositForm(prev => ({
      ...prev,
      siswaId: student.id,
      namaSiswa: student.nama,
      mingguKe: suggestedWeeks,
      jumlah: suggestedNominal,
      keterangan: `Setoran iuran kas rutin ${suggestedWeeks.length > 0 ? `Minggu ${suggestedWeeks.join(', ')}` : ''}`
    }));
  };

  // Toggle week in deposit modal
  const handleToggleWeekInDeposit = (weekNum: number) => {
    setDepositForm(prev => {
      const exists = prev.mingguKe.includes(weekNum);
      const newWeeks = exists 
        ? prev.mingguKe.filter(w => w !== weekNum)
        : [...prev.mingguKe, weekNum].sort();
      const autoNominal = newWeeks.length * 5000;
      return {
        ...prev,
        mingguKe: newWeeks,
        jumlah: autoNominal > 0 ? autoNominal : prev.jumlah,
        keterangan: `Setoran iuran kas rutin ${newWeeks.length > 0 ? `Minggu ${newWeeks.join(', ')}` : ''}`
      };
    });
  };

  // Quick preset nominal buttons in deposit modal
  const handlePresetNominal = (nominal: number, weeks: number[]) => {
    setDepositForm(prev => ({
      ...prev,
      jumlah: nominal,
      mingguKe: weeks,
      keterangan: `Setoran iuran kas rutin ${weeks.length > 0 ? `Minggu ${weeks.join(', ')}` : ''}`
    }));
  };

  // Save General Transaction (Add or Edit)
  const handleSaveGeneralTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keterangan.trim()) {
      addToast('error', 'Keterangan Wajib', 'Silakan isi keterangan transaksi kas.');
      return;
    }
    if (formData.jumlah <= 0) {
      addToast('error', 'Nominal Tidak Valid', 'Nominal harus lebih dari Rp 0.');
      return;
    }

    if (editingGeneralTxId) {
      updateCashTransaction(editingGeneralTxId, {
        tanggal: formData.tanggal,
        jenis: formData.jenis,
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: formData.keterangan,
        namaSiswa: formData.namaSiswa || undefined,
        penanggungJawab: formData.penanggungJawab
      });
      setEditingGeneralTxId(null);
    } else {
      addCashTransaction({
        tanggal: formData.tanggal,
        jenis: formData.jenis,
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: formData.keterangan,
        namaSiswa: formData.namaSiswa || undefined,
        penanggungJawab: formData.penanggungJawab
      });
    }

    setIsAddModalOpen(false);
  };

  // Save Student Dues Deposit (Add or Edit)
  const handleSaveStudentDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositForm.namaSiswa.trim()) {
      addToast('error', 'Nama Siswa Wajib', 'Silakan pilih atau isi nama siswa.');
      return;
    }
    if (depositForm.jumlah <= 0) {
      addToast('error', 'Jumlah Iuran Wajib', 'Silakan masukkan jumlah iuran yang disetor.');
      return;
    }

    if (editingDepositTxId) {
      updateCashTransaction(editingDepositTxId, {
        tanggal: depositForm.tanggal,
        jumlah: depositForm.jumlah,
        namaSiswa: depositForm.namaSiswa,
        siswaId: depositForm.siswaId,
        mingguKe: depositForm.mingguKe,
        metodePembayaran: depositForm.metodePembayaran,
        keterangan: depositForm.keterangan
      });
      // Also update weeks in dues
      depositForm.mingguKe.forEach(w => {
        if (depositForm.siswaId) {
          toggleStudentDues(depositForm.siswaId, w as any);
        }
      });
      setEditingDepositTxId(null);
    } else {
      recordStudentDuesDeposit({
        siswaId: depositForm.siswaId,
        namaSiswa: depositForm.namaSiswa,
        jumlah: depositForm.jumlah,
        tanggal: depositForm.tanggal,
        mingguKe: depositForm.mingguKe,
        metodePembayaran: depositForm.metodePembayaran,
        keterangan: depositForm.keterangan,
        catatKeKas: depositForm.catatKeKas
      });
    }

    setIsDepositModalOpen(false);
  };

  // Filter transactions
  const filteredTransactions = allTransactions.filter(t => {
    const term = searchQuery.toLowerCase();
    const matchSearch =
      (t.keterangan && t.keterangan.toLowerCase().includes(term)) ||
      (t.kategori && t.kategori.toLowerCase().includes(term)) ||
      (t.namaSiswa && t.namaSiswa.toLowerCase().includes(term));
    const matchType = typeFilter === 'Semua' || t.jenis === typeFilter;
    return matchSearch && matchType;
  });

  // Filter only dues transactions for deposit history
  const duesDepositTransactions = allTransactions.filter(t => 
    t.jenis === 'Pemasukan' && (t.namaSiswa || t.kategori === 'Iuran Kas Siswa' || t.kategori === 'Iuran Kas Mingguan')
  );

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  // Helper to open receipt modal
  const handleViewReceipt = (tx: CashTransaction) => {
    setSelectedReceiptTx(tx);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <WalletCards className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Buku Kas & Iuran Siswa Kelas {schoolInfo.className}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatatan setor iuran kas siswa, nominal setor, pembukuan mutasi debit/kredit, dan kwitansi kas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View SubTab Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('transaksi')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeSubTab === 'transaksi'
                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Coins className="h-3.5 w-3.5 text-amber-500" />
                <span>Buku Kas Umum</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('riwayat_setor')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeSubTab === 'riwayat_setor'
                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Receipt className="h-3.5 w-3.5 text-emerald-500" />
                <span>Riwayat Setoran Iuran</span>
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Cetak LPJ Kas</span>
            </button>
          </div>
        </div>

        {/* 3 KPI Financial Summary Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Saldo Akhir */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-600/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-100">Saldo Kas Aktif Saat Ini</span>
              <WalletCards className="h-5 w-5 text-blue-200" />
            </div>
            <h3 className="text-2xl font-extrabold mt-1">
              Rp {saldoAkhir.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-blue-100/90 mt-1">
              Tersimpan aman di Kas Kelas 4A
            </p>
          </div>

          {/* Total Penerimaan */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
              <span className="text-xs font-bold">Total Pemasukan</span>
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-extrabold text-emerald-950 dark:text-white mt-1">
              Rp {totalPemasukan.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              Iuran kas siswa & paguyuban orang tua
            </p>
          </div>

          {/* Total Pengeluaran */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center justify-between text-rose-700 dark:text-rose-300">
              <span className="text-xs font-bold">Total Pengeluaran</span>
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-extrabold text-rose-950 dark:text-white mt-1">
              Rp {totalPengeluaran.toLocaleString('id-ID')}
            </h3>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
              ATK, kebersihan & kegiatan kelas
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 2: RIWAYAT SETORAN IURAN SISWA LENGKAP DENGAN NAMA & JUMLAH SETOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'riwayat_setor' && (
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa atau kwitansi setoran..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            {isTeacherOrAdmin && (
              <button
                type="button"
                onClick={() => handleOpenDepositModal()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 active:scale-95 transition-all self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>+ Catat Setoran Iuran Baru</span>
              </button>
            )}
          </div>

          {/* Tabel Riwayat Setoran */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/90 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3.5 w-10 text-center">No</th>
                    <th className="px-4 py-3.5 w-28">Tanggal</th>
                    <th className="px-4 py-3.5 min-w-[180px]">Nama Siswa Penyetor</th>
                    <th className="px-4 py-3.5">Uraian / Pekan Iuran</th>
                    <th className="px-4 py-3.5 w-24 text-center">Metode</th>
                    <th className="px-4 py-3.5 text-right w-36 text-emerald-700 dark:text-emerald-300 font-bold">
                      Jumlah Iuran Disetor
                    </th>
                    <th className="px-4 py-3.5 w-36">Penerima (PJ)</th>
                    <th className="px-4 py-3.5 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {duesDepositTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        Belum ada riwayat setoran iuran siswa. Klik <strong>+ Setor Iuran Siswa</strong> untuk mencatat.
                      </td>
                    </tr>
                  ) : (
                    duesDepositTransactions.map((tx, idx) => {
                      const depositAmount = tx.jumlah || (tx as any).nominal || 0;
                      return (
                        <tr
                          key={`dues-tx-${tx.id || idx}`}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                            {tx.tanggal}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {tx.namaSiswa || 'Siswa Kelas 4A'}
                            </p>
                            {tx.siswaId && (
                              <p className="text-[10px] text-slate-400">ID: {tx.siswaId}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {tx.keterangan}
                            </p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                              {tx.kategori}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {tx.metodePembayaran || 'Tunai'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                            Rp {depositAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-[11px]">
                            {tx.penanggungJawab || 'Bendahara Kelas'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleViewReceipt(tx)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                                title="Lihat & Cetak Kwitansi Tanda Terima"
                              >
                                <Receipt className="h-4 w-4" />
                              </button>
                              {isTeacherOrAdmin && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(tx)}
                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                                    title="Edit Isian Setoran"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setTxToDelete(tx)}
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                    title="Hapus Isian Setoran"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: BUKU KAS UMUM MUTASI LENGKAP */}
      {/* ========================================================================= */}
      {activeSubTab === 'transaksi' && (
        <div className="space-y-4">
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari transaksi, nama siswa atau nota..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Semua">Semua Jenis</option>
                <option value="Pemasukan">Pemasukan (Debit)</option>
                <option value="Pengeluaran">Pengeluaran (Kredit)</option>
              </select>
            </div>

            {isTeacherOrAdmin && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleOpenAdd('Pemasukan')}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Catat Pemasukan</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAdd('Pengeluaran')}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Catat Pengeluaran</span>
                </button>
              </div>
            )}
          </div>

          {/* Transactions Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/90 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3.5 w-10 text-center">No</th>
                    <th className="px-4 py-3.5 w-28">Tanggal</th>
                    <th className="px-4 py-3.5">Uraian Transaksi</th>
                    <th className="px-4 py-3.5 w-32">Kategori</th>
                    <th className="px-4 py-3.5 text-right w-28 text-emerald-700 dark:text-emerald-300">Masuk (Debit)</th>
                    <th className="px-4 py-3.5 text-right w-28 text-rose-700 dark:text-rose-300">Keluar (Kredit)</th>
                    <th className="px-4 py-3.5 text-right w-32 font-extrabold">Saldo Berjalan</th>
                    {isTeacherOrAdmin && <th className="px-4 py-3.5 text-right w-24">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredTransactions.map((tx, idx) => {
                    const amount = tx.jumlah || (tx as any).nominal || 0;
                    return (
                      <tr
                        key={tx.id || idx}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                          {tx.tanggal}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {tx.keterangan}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            {tx.namaSiswa && <span>Siswa: <strong className="text-slate-600 dark:text-slate-300">{tx.namaSiswa}</strong></span>}
                            <span>PJ: {tx.penanggungJawab}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
                            {tx.kategori}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {tx.jenis === 'Pemasukan' ? `Rp ${amount.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-rose-600 dark:text-rose-400">
                          {tx.jenis === 'Pengeluaran' ? `Rp ${amount.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-slate-900 dark:text-white">
                          Rp {(tx.saldoSetelah || 0).toLocaleString('id-ID')}
                        </td>
                        {isTeacherOrAdmin && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(tx)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Transaksi Kas"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setTxToDelete(tx)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                title="Hapus Transaksi Kas"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SETOR IURAN SISWA (ISI NAMA & JUMLAH IURAN YANG DISETOR) */}
      {/* ========================================================================= */}
      {isDepositModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsDepositModalOpen(false)}
          title={editingDepositTxId ? 'Edit Isian Setoran Iuran Siswa' : 'Catat Setoran Iuran Siswa'}
          subtitle="Isi nama siswa dan jumlah nominal iuran yang disetor"
          maxWidth="lg"
          icon={<Coins className="h-5 w-5 text-blue-600" />}
        >
          <form onSubmit={handleSaveStudentDeposit} className="space-y-4">
            {/* 1. Pilih / Isi Nama Siswa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Siswa Penyetor *
              </label>
              <select
                required
                value={depositForm.siswaId}
                onChange={(e) => handleStudentChangeInDeposit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {students.map((s) => (
                  <option key={`opt-student-dep-${s.id}`} value={s.id}>
                    No. {s.nomorAbsen} - {s.nama} (NISN: {s.nisn})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Jumlah Iuran yang Disetor & Quick Preset */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Jumlah Iuran yang Disetor (Rupiah) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={depositForm.jumlah}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 0 }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-11 pr-4 text-base font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 10000"
                />
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => handlePresetNominal(5000, [1])}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-blue-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  Rp 5.000 (1 Pekan)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetNominal(10000, [1, 2])}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-blue-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  Rp 10.000 (2 Pekan)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetNominal(15000, [1, 2, 3])}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-blue-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  Rp 15.000 (3 Pekan)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetNominal(20000, [1, 2, 3, 4])}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  Rp 20.000 (Lunas 1 Bulan)
                </button>
              </div>
            </div>

            {/* 3. Alokasi Pekan / Minggu */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Alokasi Pekan Pembayaran
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(w => {
                  const isChecked = depositForm.mingguKe.includes(w);
                  return (
                    <button
                      key={`chk-week-dep-${w}`}
                      type="button"
                      onClick={() => handleToggleWeekInDeposit(w)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? `✓ Minggu ${w}` : `Minggu ${w}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Tanggal & Metode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Setoran *
                </label>
                <input
                  type="date"
                  required
                  value={depositForm.tanggal}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, tanggal: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={depositForm.metodePembayaran}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, metodePembayaran: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-medium"
                >
                  <option value="Tunai">💵 Tunai (Cash ke Bendahara)</option>
                  <option value="Transfer">🏦 Transfer Bank / Paguyuban</option>
                  <option value="QRIS">📱 QRIS Kas Kelas</option>
                </select>
              </div>
            </div>

            {/* 5. Keterangan Catatan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Keterangan / Catatan
              </label>
              <input
                type="text"
                value={depositForm.keterangan}
                onChange={(e) => setDepositForm(prev => ({ ...prev, keterangan: e.target.value }))}
                placeholder="Contoh: Setoran iuran rutin pekan ke-3 & ke-4"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* 6. Centang Sinkronkan ke Buku Kas */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={depositForm.catatKeKas}
                onChange={(e) => setDepositForm(prev => ({ ...prev, catatKeKas: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-blue-950 dark:text-blue-200 font-semibold">
                Otomatis catat pemasukan debit ke Buku Kas Umum Kelas (+ Rp {depositForm.jumlah.toLocaleString('id-ID')})
              </span>
            </label>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>{editingDepositTxId ? 'Simpan Perubahan' : 'Simpan Setoran Iuran'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH TRANSAKSI KAS UMUM */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title={
            editingGeneralTxId
              ? formData.jenis === 'Pemasukan'
                ? 'Edit Pemasukan Kas'
                : 'Edit Pengeluaran Kas'
              : formData.jenis === 'Pemasukan'
              ? 'Catat Pemasukan Kas Baru'
              : 'Catat Pengeluaran Kas Baru'
          }
          subtitle="Semua transaksi dicatat transparan dan langsung memperbarui saldo kas"
          maxWidth="lg"
          icon={<WalletCards className="h-5 w-5 text-blue-600" />}
        >
          <form onSubmit={handleSaveGeneralTransaction} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Transaksi *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, jenis: 'Pemasukan' })}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    formData.jenis === 'Pemasukan'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  Pemasukan (Debit)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, jenis: 'Pengeluaran' })}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    formData.jenis === 'Pengeluaran'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  Pengeluaran (Kredit)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Transaksi *
              </label>
              <input
                type="date"
                required
                value={formData.tanggal}
                onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Transaksi *
              </label>
              <select
                value={formData.kategori}
                onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Iuran Kas Siswa">Iuran Kas Siswa</option>
                <option value="Donasi Paguyuban">Sumbangan Paguyuban Ortu</option>
                <option value="ATK / Spidol">ATK & Peralatan Belajar</option>
                <option value="Fotocopy Tugas">Fotocopy Lembar Asesmen</option>
                <option value="Kegiatan Kelas">Kegiatan Lomba & Kelas</option>
                <option value="Santunan / Sosial">Santunan Sosial & Sakit</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Nama Siswa Penyetor (Opsional) */}
            {formData.jenis === 'Pemasukan' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Siswa Penyetor (Opsional)
                </label>
                <select
                  value={formData.namaSiswa}
                  onChange={e => setFormData({ ...formData, namaSiswa: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">-- Bukan Setoran Individual --</option>
                  {students.map(s => (
                    <option key={`opt-stu-trx-${s.id}`} value={s.nama}>
                      {s.nama} (Absen {s.nomorAbsen})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Nominal (Rupiah) *
              </label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={formData.jumlah}
                onChange={e => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Uraian Keterangan Transaksi *
              </label>
              <textarea
                rows={2}
                required
                value={formData.keterangan}
                onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Contoh: Pembelian spidol whiteboard Snowman..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Penanggung Jawab (PJ) *
              </label>
              <input
                type="text"
                required
                value={formData.penanggungJawab}
                onChange={e => setFormData({ ...formData, penanggungJawab: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                {editingGeneralTxId ? 'Simpan Perubahan' : 'Simpan Transaksi'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KWITANSI TANDA TERIMA SETORAN IURAN SISWA */}
      {/* ========================================================================= */}
      {isReceiptModalOpen && selectedReceiptTx && (
        <Modal
          isOpen={true}
          onClose={() => setIsReceiptModalOpen(false)}
          title="Kwitansi Tanda Terima Setoran Iuran Siswa"
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div
              id="printable-official-document"
              className="printable-document-sheet p-6 bg-white rounded-2xl border-2 border-slate-900 text-black font-sans space-y-4 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
            >
              <HeaderKopSekolah
                documentTitle="KWITANSI TANDA TERIMA IURAN KAS KELAS"
                subTitle={`Kelas ${schoolInfo.className} • ${schoolInfo.schoolName}`}
              />

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-dashed border-slate-400">
                <div>
                  <p className="text-[10px] text-slate-500">Nomor Transaksi:</p>
                  <p className="font-mono font-bold">{selectedReceiptTx.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Tanggal Setor:</p>
                  <p className="font-bold">{selectedReceiptTx.tanggal}</p>
                </div>
              </div>

              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Telah diterima dari:</span>
                  <span className="font-black text-sm">{selectedReceiptTx.namaSiswa || 'Siswa Kelas 4A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Jumlah Iuran yang Disetor:</span>
                  <span className="font-black text-base text-emerald-700">
                    Rp {(selectedReceiptTx.jumlah || (selectedReceiptTx as any).nominal || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Untuk Pembayaran:</span>
                  <span className="font-semibold text-right">{selectedReceiptTx.keterangan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Metode Pembayaran:</span>
                  <span className="font-bold">{selectedReceiptTx.metodePembayaran || 'Tunai'}</span>
                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="flex justify-between text-xs pt-4 page-break-inside-avoid">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500">Penyetor (Siswa/Wali)</p>
                  <div className="h-12" />
                  <p className="font-bold underline">{selectedReceiptTx.namaSiswa || 'Siswa'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500">Penerima (Bendahara Kelas)</p>
                  <div className="h-12" />
                  <p className="font-bold underline">{selectedReceiptTx.penanggungJawab || 'Gita Maharani'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 no-print">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Kwitansi</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CETAK LPJ BUKU KAS KELAS RESMI */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrintModalOpen(false)}
          title="Pratinjau Cetak Laporan Pertanggungjawaban (LPJ) Kas Kelas"
          maxWidth="5xl"
        >
          <div className="space-y-6">
            <div
              id="printable-official-document"
              className="printable-document-sheet p-6 bg-white rounded-2xl border border-slate-200 text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
            >
              <HeaderKopSekolah
                documentTitle="LAPORAN BUKU KAS KEUANGAN KELAS"
                subTitle={`Kelas ${schoolInfo.className} • Periode Agustus 2026 • Tahun Ajaran ${schoolInfo.academicYear}`}
              />

              <div className="grid grid-cols-3 gap-3 my-4 text-xs font-bold text-center">
                <div className="p-2 border border-black rounded bg-slate-50">
                  Total Pemasukan: Rp {totalPemasukan.toLocaleString('id-ID')}
                </div>
                <div className="p-2 border border-black rounded bg-slate-50">
                  Total Pengeluaran: Rp {totalPengeluaran.toLocaleString('id-ID')}
                </div>
                <div className="p-2 border-2 border-black rounded bg-slate-100">
                  Saldo Kas Akhir: Rp {saldoAkhir.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-[11px] border-collapse border border-black">
                  <thead>
                    <tr className="bg-slate-100 border border-black text-center font-bold">
                      <th className="border border-black p-1.5 w-10">No</th>
                      <th className="border border-black p-1.5 w-24">Tanggal</th>
                      <th className="border border-black p-1.5 text-left">Uraian Transaksi / Siswa</th>
                      <th className="border border-black p-1.5 w-28">Kategori</th>
                      <th className="border border-black p-1.5 text-right w-24">Masuk (Rp)</th>
                      <th className="border border-black p-1.5 text-right w-24">Keluar (Rp)</th>
                      <th className="border border-black p-1.5 text-right w-28">Saldo (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.map((tx, idx) => {
                      const amount = tx.jumlah || (tx as any).nominal || 0;
                      return (
                        <tr key={`print-trx-row-${tx.id || idx}`} className="border border-black">
                          <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-black p-1.5 text-center font-mono">{tx.tanggal}</td>
                          <td className="border border-black p-1.5">
                            <span className="font-semibold">{tx.keterangan}</span>
                            {tx.namaSiswa && <span className="block text-[10px] text-slate-600">Siswa: {tx.namaSiswa}</span>}
                          </td>
                          <td className="border border-black p-1.5 text-center">{tx.kategori}</td>
                          <td className="border border-black p-1.5 text-right">
                            {tx.jenis === 'Pemasukan' ? amount.toLocaleString('id-ID') : '-'}
                          </td>
                          <td className="border border-black p-1.5 text-right">
                            {tx.jenis === 'Pengeluaran' ? amount.toLocaleString('id-ID') : '-'}
                          </td>
                          <td className="border border-black p-1.5 text-right font-bold">
                            {(tx.saldoSetelah || 0).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan */}
              <div className="mt-8 flex justify-between text-xs text-black pt-4 page-break-inside-avoid">
                <div className="text-center">
                  <p>Mengetahui,</p>
                  <p>Wali Kelas {schoolInfo.className}</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{schoolInfo.homeroomTeacherName}</p>
                  <p>NIP. {schoolInfo.homeroomTeacherNip}</p>
                </div>
                <div className="text-center">
                  <p>{schoolInfo.city}, 17 Agustus 2026</p>
                  <p>Bendahara Kelas {schoolInfo.className}</p>
                  <div className="h-16" />
                  <p className="font-bold underline">Gita Maharani</p>
                  <p>NISN. 0147891234</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 no-print">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Laporan Kas</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Transaction */}
      <ConfirmDialog
        isOpen={!!txToDelete}
        title="Hapus Transaksi Kas"
        message={`Apakah Anda yakin ingin menghapus transaksi "${txToDelete?.keterangan}"?`}
        confirmLabel="Hapus Transaksi"
        variant="danger"
        onConfirm={() => {
          if (txToDelete) {
            deleteCashTransaction(txToDelete.id);
            setTxToDelete(null);
          }
        }}
        onCancel={() => setTxToDelete(null)}
      />
    </div>
  );
};
