import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { BadgeStatus } from '../common/BadgeStatus';
import {
  Boxes,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  Check,
  Package
} from 'lucide-react';

export const InventarisView: React.FC = () => {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    schoolInfo,
    currentUser,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'Semua' | 'Baik' | 'Rusak Ringan' | 'Rusak Berat'>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    kodeBarang: 'INV-4A-01',
    namaBarang: '',
    spesifikasi: '',
    jumlah: 1,
    kondisi: 'Baik',
    tahunPengadaan: 2024,
    sumberDana: 'BOS Reguler',
    keterangan: 'Tersedia di dalam ruang kelas 4A'
  });

  const safeInventory = inventory || [];
  const totalUnits = safeInventory.reduce((sum, item) => sum + item.jumlah, 0);
  const baikCount = safeInventory.filter(i => i.kondisi === 'Baik').reduce((sum, i) => sum + i.jumlah, 0);
  const rusakRinganCount = safeInventory.filter(i => i.kondisi === 'Rusak Ringan').reduce((sum, i) => sum + i.jumlah, 0);
  const rusakBeratCount = safeInventory.filter(i => i.kondisi === 'Rusak Berat').reduce((sum, i) => sum + i.jumlah, 0);

  const handleOpenAdd = () => {
    setFormData({
      kodeBarang: `INV-4A-${(inventory.length + 1).toString().padStart(2, '0')}`,
      namaBarang: '',
      spesifikasi: 'Kayu jati / Besi hollow',
      jumlah: 1,
      kondisi: 'Baik',
      tahunPengadaan: 2024,
      sumberDana: 'BOS Reguler',
      keterangan: 'Tersedia di dalam ruang kelas 4A'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      kodeBarang: item.kodeBarang,
      namaBarang: item.namaBarang,
      spesifikasi: item.spesifikasi,
      jumlah: item.jumlah,
      kondisi: item.kondisi,
      tahunPengadaan: item.tahunPengadaan,
      sumberDana: item.sumberDana,
      keterangan: item.keterangan || ''
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaBarang.trim()) {
      addToast('error', 'Nama Barang Wajib', 'Silakan masukkan nama barang inventaris.');
      return;
    }

    if (editingItem) {
      updateInventoryItem(editingItem.id, formData);
      setEditingItem(null);
    } else {
      addInventoryItem(formData);
      setIsAddModalOpen(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchSearch =
      item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodeBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.spesifikasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCond = conditionFilter === 'Semua' || item.kondisi === conditionFilter;
    return matchSearch && matchCond;
  });

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Buku Inventaris Ruangan (KIR) Kelas {schoolInfo.className}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatatan sarana prasarana, mebeler, dan media pembelajaran di dalam ruang kelas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isTeacherOrAdmin && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Barang Sarpras</span>
              </button>
            )}

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Cetak Kartu KIR</span>
            </button>
          </div>
        </div>

        {/* 4 Inventory Status KPI Cards */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Sarpras</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalUnits} Unit</p>
            <p className="text-[10px] text-slate-400">{inventory.length} Jenis Barang</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Kondisi Baik</p>
            <p className="text-xl font-extrabold text-emerald-950 dark:text-white mt-0.5">{baikCount} Unit</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{Math.round((baikCount/totalUnits)*100)}% Siap Pakai</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Rusak Ringan</p>
            <p className="text-xl font-extrabold text-amber-950 dark:text-white mt-0.5">{rusakRinganCount} Unit</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400">Butuh Perbaikan Ringan</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">Rusak Berat</p>
            <p className="text-xl font-extrabold text-rose-950 dark:text-white mt-0.5">{rusakBeratCount} Unit</p>
            <p className="text-[10px] text-rose-600 dark:text-rose-400">Rencana Usul Hapus / Ganti</p>
          </div>
        </div>
      </div>

      {/* Inventory Table & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode atau nama barang..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 self-start sm:self-auto"
          >
            <option value="Semua">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/90 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3.5 w-10 text-center">No</th>
                  <th className="px-4 py-3.5 w-28">Kode Barang</th>
                  <th className="px-4 py-3.5">Nama & Spesifikasi Barang</th>
                  <th className="px-4 py-3.5 w-20 text-center">Jumlah</th>
                  <th className="px-4 py-3.5 w-28 text-center">Kondisi</th>
                  <th className="px-4 py-3.5 w-28">Tahun / Sumber</th>
                  <th className="px-4 py-3.5">Keterangan</th>
                  {isTeacherOrAdmin && <th className="px-4 py-3.5 text-right w-20">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredInventory.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.kodeBarang}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {item.namaBarang}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.spesifikasi}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-extrabold text-slate-900 dark:text-white">
                      {item.jumlah} Unit
                    </td>
                    <td className="px-4 py-3 text-center">
                      <BadgeStatus status={item.kondisi} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-[11px]">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.tahunPengadaan}</p>
                      <p className="text-slate-400">{item.sumberDana}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-500 dark:text-slate-400">
                      {item.keterangan || '-'}
                    </td>
                    {isTeacherOrAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Data Barang"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Hapus Barang"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit Inventaris */}
      <Modal
        isOpen={isAddModalOpen || editingItem !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Data Barang Inventaris' : 'Tambah Sarpras / Barang Inventaris'}
        subtitle="Lengkapi nomor inventaris, spesifikasi, dan kondisi kelayakan barang"
        maxWidth="lg"
        icon={<Boxes className="h-5 w-5 text-blue-600" />}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kode Barang / Inventaris *
              </label>
              <input
                type="text"
                required
                value={formData.kodeBarang}
                onChange={e => setFormData({ ...formData, kodeBarang: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Unit *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.jumlah}
                onChange={e => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 1 })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Barang *
              </label>
              <input
                type="text"
                required
                value={formData.namaBarang}
                onChange={e => setFormData({ ...formData, namaBarang: e.target.value })}
                placeholder="Contoh: Meja Siswa Standar Kemdikbud"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Spesifikasi / Bahan / Merk
              </label>
              <input
                type="text"
                value={formData.spesifikasi}
                onChange={e => setFormData({ ...formData, spesifikasi: e.target.value })}
                placeholder="Kayu jati, rangka besi hollow powder coating"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kondisi Barang *
              </label>
              <select
                value={formData.kondisi}
                onChange={e => setFormData({ ...formData, kondisi: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Pengadaan
              </label>
              <input
                type="number"
                min="2010"
                max="2030"
                value={formData.tahunPengadaan}
                onChange={e => setFormData({ ...formData, tahunPengadaan: parseInt(e.target.value) || 2024 })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sumber Dana
              </label>
              <select
                value={formData.sumberDana}
                onChange={e => setFormData({ ...formData, sumberDana: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="BOS Reguler">BOS Reguler</option>
                <option value="BOS Kinerja">BOS Kinerja</option>
                <option value="Paguyuban Orang Tua">Paguyuban Orang Tua</option>
                <option value="Bantuan Pemprov">Bantuan Dinas Pendidikan / Pemprov</option>
                <option value="Hibah / Sumbangan">Hibah / Sumbangan Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Keterangan / Lokasi
              </label>
              <input
                type="text"
                value={formData.keterangan}
                onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Tersedia di ruang kelas"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingItem(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
            >
              <Check className="h-4 w-4" />
              <span>{editingItem ? 'Simpan Perubahan' : 'Tambahkan Barang'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Cetak Kartu Inventaris Ruangan (KIR) Resmi */}
      {isPrintModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrintModalOpen(false)}
          title="Pratinjau Kartu Inventaris Ruangan (KIR)"
          maxWidth="5xl"
        >
          <div className="space-y-6">
            <div
              id="printable-official-document"
              className="printable-document-sheet p-6 bg-white rounded-2xl border border-slate-200 text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
            >
              <HeaderKopSekolah
                documentTitle="KARTU INVENTARIS RUANGAN (KIR) KELAS"
                subTitle={`Ruang Kelas: ${schoolInfo.className} • Gedung Utama Lantai 2 • Tahun Ajaran ${schoolInfo.academicYear}`}
              />

              <table className="w-full text-left text-[11px] border-collapse border border-black mt-4">
                <thead>
                  <tr className="bg-slate-100 border border-black text-center font-bold">
                    <th className="border border-black p-1.5 w-8">No</th>
                    <th className="border border-black p-1.5 w-24">Kode Barang</th>
                    <th className="border border-black p-1.5 text-left">Nama & Spesifikasi Barang</th>
                    <th className="border border-black p-1.5 w-16">Jumlah</th>
                    <th className="border border-black p-1.5 w-20">Kondisi</th>
                    <th className="border border-black p-1.5 w-20">Tahun</th>
                    <th className="border border-black p-1.5 w-28">Sumber Dana</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((i, idx) => (
                    <tr key={i.id} className="border border-black">
                      <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-black p-1.5 text-center font-mono font-semibold">{i.kodeBarang}</td>
                      <td className="border border-black p-1.5">
                        <p className="font-bold">{i.namaBarang}</p>
                        <p className="text-[9.5px] text-slate-600">{i.spesifikasi}</p>
                      </td>
                      <td className="border border-black p-1.5 text-center font-bold">{i.jumlah}</td>
                      <td className="border border-black p-1.5 text-center font-semibold">{i.kondisi}</td>
                      <td className="border border-black p-1.5 text-center">{i.tahunPengadaan}</td>
                      <td className="border border-black p-1.5 text-center">{i.sumberDana}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tanda Tangan */}
              <div className="mt-8 flex justify-between text-xs text-black pt-4 page-break-inside-avoid">
                <div className="text-center">
                  <p>Mengetahui,</p>
                  <p>Kepala Sekolah {schoolInfo.schoolName}</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{schoolInfo.headmasterName}</p>
                  <p>NIP. {schoolInfo.headmasterNip}</p>
                </div>
                <div className="text-center">
                  <p>{schoolInfo.city}, 17 Agustus 2026</p>
                  <p>Penanggung Jawab Ruangan / Wali Kelas</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{schoolInfo.homeroomTeacherName}</p>
                  <p>NIP. {schoolInfo.homeroomTeacherNip}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 no-print">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Lembar KIR</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setItemToDelete(null)}
          onConfirm={() => {
            deleteInventoryItem(itemToDelete.id);
            setItemToDelete(null);
          }}
          title="Hapus Barang Inventaris?"
          message={`Apakah Anda yakin ingin menghapus "${itemToDelete.namaBarang}" (${itemToDelete.kodeBarang}) dari daftar inventaris kelas?`}
          confirmText="Ya, Hapus Barang"
          isDestructive={true}
        />
      )}
    </div>
  );
};
