import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ModulAjar } from '../../types';
import { ModulCard } from './ModulCard';
import { ModulDetailModal } from './ModulDetailModal';
import { ModulFormModal } from './ModulFormModal';
import { PedomanModulSection } from './PedomanModulSection';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Sparkles,
  Printer,
  FileText,
  Copy,
  Layers,
  HelpCircle,
  RotateCcw,
  Star,
  GraduationCap,
  LayoutGrid,
  List,
  CheckCircle2,
  Calendar,
  BookMarked
} from 'lucide-react';

export const PerangkatAjarView: React.FC = () => {
  const {
    modulAjarList,
    addModulAjar,
    updateModulAjar,
    deleteModulAjar,
    duplicateModulAjar,
    toggleFavoriteModulAjar,
    resetModulAjarToDefault,
    schoolInfo,
    teachers,
    addJournal
  } = useApp();

  // Active Sub-Tab: 'bank_modul' | 'pedoman'
  const [activeMainTab, setActiveMainTab] = useState<'bank_modul' | 'pedoman'>('bank_modul');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFase, setSelectedFase] = useState<string>('all');
  const [selectedMapel, setSelectedMapel] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [viewModeLayout, setViewModeLayout] = useState<'grid' | 'table'>('grid');

  // Modals State
  const [selectedModulDetail, setSelectedModulDetail] = useState<ModulAjar | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [editingModul, setEditingModul] = useState<ModulAjar | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Available Filter Options
  const mapelOptions = useMemo(() => {
    const mapels = new Set(modulAjarList.map(m => m.mataPelajaran));
    return Array.from(mapels);
  }, [modulAjarList]);

  // Filtered Modul List
  const filteredModules = useMemo(() => {
    return modulAjarList.filter(modul => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = modul.judul.toLowerCase().includes(q);
        const matchesMapel = modul.mataPelajaran.toLowerCase().includes(q);
        const matchesKode = modul.kodeModul.toLowerCase().includes(q);
        const matchesCP = modul.capaianPembelajaran.toLowerCase().includes(q);
        const matchesTP = modul.tujuanPembelajaran?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMapel && !matchesKode && !matchesCP && !matchesTP) {
          return false;
        }
      }

      // Fase
      if (selectedFase !== 'all' && modul.fase !== selectedFase) {
        return false;
      }

      // Mapel
      if (selectedMapel !== 'all' && modul.mataPelajaran !== selectedMapel) {
        return false;
      }

      // Semester
      if (selectedSemester !== 'all' && !modul.semester.includes(selectedSemester)) {
        return false;
      }

      // Favorite
      if (showOnlyFavorites && !modul.isFavorite) {
        return false;
      }

      return true;
    });
  }, [modulAjarList, searchQuery, selectedFase, selectedMapel, selectedSemester, showOnlyFavorites]);

  // Statistics KPIs
  const totalModul = modulAjarList.length;
  const countFaseA = modulAjarList.filter(m => m.fase === 'Fase A').length;
  const countFaseB = modulAjarList.filter(m => m.fase === 'Fase B').length;
  const countFaseC = modulAjarList.filter(m => m.fase === 'Fase C').length;
  const countFavorites = modulAjarList.filter(m => m.isFavorite).length;

  const handleOpenDetail = (modul: ModulAjar) => {
    setSelectedModulDetail(modul);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (modul: ModulAjar) => {
    setEditingModul(modul);
    setIsFormOpen(true);
  };

  const handleOpenAddNew = () => {
    setEditingModul(null);
    setIsFormOpen(true);
  };

  const handleSaveModul = (modulData: Omit<ModulAjar, 'id'> | ModulAjar) => {
    if ('id' in modulData && modulData.id) {
      updateModulAjar(modulData.id, modulData);
    } else {
      addModulAjar(modulData);
    }
  };

  const handlePrintLKPD = (modul: ModulAjar) => {
    setSelectedModulDetail(modul);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab(activeMainTab === 'bank_modul' ? 'pedoman' : 'bank_modul')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {activeMainTab === 'bank_modul' ? (
              <>
                <HelpCircle className="h-4 w-4 text-indigo-500" />
                <span>Pedoman Kurmer</span>
              </>
            ) : (
              <>
                <BookMarked className="h-4 w-4 text-indigo-500" />
                <span>Bank Modul Ajar</span>
              </>
            )}
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            • {totalModul} Modul Siap Pakai
          </span>
        </div>

        <button
          onClick={handleOpenAddNew}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Susun Modul Baru</span>
        </button>
      </div>
        {/* 2. Top Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Modul</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{totalModul}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Fase A (Kls 1-2)</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{countFaseA}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Fase B (Kls 3-4)</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{countFaseB}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Fase C (Kls 5-6)</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{countFaseC}</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Modul Favorit</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{countFavorites}</p>
            </div>
          </div>
        </div>

        {/* 3. Sub Tab Content */}
        {activeMainTab === 'pedoman' ? (
          <PedomanModulSection />
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari modul ajar, topik, TP, mata pelajaran, atau kode..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Fase */}
                  <select
                    value={selectedFase}
                    onChange={e => setSelectedFase(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="all">Semua Fase</option>
                    <option value="Fase A">Fase A (Kelas 1-2)</option>
                    <option value="Fase B">Fase B (Kelas 3-4)</option>
                    <option value="Fase C">Fase C (Kelas 5-6)</option>
                  </select>

                  {/* Filter Mapel */}
                  <select
                    value={selectedMapel}
                    onChange={e => setSelectedMapel(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="all">Semua Mapel</option>
                    {mapelOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  {/* Filter Semester */}
                  <select
                    value={selectedSemester}
                    onChange={e => setSelectedSemester(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="all">Semua Sem</option>
                    <option value="1">Sem 1 (Ganjil)</option>
                    <option value="2">Sem 2 (Genap)</option>
                  </select>

                  {/* Favorite Toggle */}
                  <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      showOnlyFavorites
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${showOnlyFavorites ? 'fill-white' : ''}`} />
                    <span>Favorit</span>
                  </button>

                  {/* Layout Switcher */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setViewModeLayout('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewModeLayout === 'grid'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Tampilan Kartu Grid"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewModeLayout('table')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewModeLayout === 'table'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Tampilan Tabel Baris"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Chips Bar */}
              {(selectedFase !== 'all' || selectedMapel !== 'all' || selectedSemester !== 'all' || showOnlyFavorites || searchQuery) && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <span>Filter Aktif:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {filteredModules.length} dari {totalModul} modul ditemukan
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFase('all');
                      setSelectedMapel('all');
                      setSelectedSemester('all');
                      setShowOnlyFavorites(false);
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-auto"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Grid / Table View of Modul */}
            {filteredModules.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Tidak Ada Modul Ajar Ditemukan
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Silakan sesuaikan kata kunci pencarian atau filter yang dipilih, atau buat modul ajar baru sekarang.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={handleOpenAddNew}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Susun Modul Baru
                  </button>
                  <button
                    onClick={resetModulAjarToDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Muat Contoh Standar
                  </button>
                </div>
              </div>
            ) : viewModeLayout === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredModules.map(modul => (
                  <ModulCard
                    key={modul.id}
                    modul={modul}
                    onView={handleOpenDetail}
                    onEdit={handleOpenEdit}
                    onDuplicate={duplicateModulAjar}
                    onDelete={deleteModulAjar}
                    onToggleFavorite={toggleFavoriteModulAjar}
                    onPrintLKPD={handlePrintLKPD}
                  />
                ))}
              </div>
            ) : (
              /* Table Layout */
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">Fav</th>
                        <th className="py-3 px-4">Kode & Judul Modul</th>
                        <th className="py-3 px-4">Mapel & Fase</th>
                        <th className="py-3 px-4">Model & Alokasi</th>
                        <th className="py-3 px-4">Penyusun</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredModules.map(modul => (
                        <tr key={modul.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleFavoriteModulAjar(modul.id)}
                              className="text-slate-400 hover:text-amber-400 p-1"
                            >
                              <Star className={`h-4 w-4 ${modul.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-mono text-slate-400 block">{modul.kodeModul}</span>
                            <span
                              onClick={() => handleOpenDetail(modul)}
                              className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 cursor-pointer line-clamp-1"
                            >
                              {modul.judul}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {modul.tujuanPembelajaran?.[0] || modul.capaianPembelajaran}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{modul.mataPelajaran}</span>
                            <span className="text-[11px] text-slate-500">{modul.fase} • Kls {modul.kelas} (Sem {modul.semester})</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-700 dark:text-slate-300 block line-clamp-1">{modul.modelPembelajaran}</span>
                            <span className="text-[11px] text-slate-500">{modul.alokasiWaktu}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{modul.penyusun.split(',')[0]}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenDetail(modul)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px]"
                              >
                                Lihat
                              </button>
                              <button
                                onClick={() => handleOpenEdit(modul)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Edit"
                              >
                                ✏️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      {/* 4. Modul Detail & Print Modal */}
      <ModulDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        modul={selectedModulDetail}
        schoolInfo={schoolInfo}
        onEdit={handleOpenEdit}
        onDuplicate={duplicateModulAjar}
        onAddJournalFromModul={addJournal}
      />

      {/* 5. Modul Form Modal */}
      <ModulFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveModul}
        initialData={editingModul}
        schoolInfo={schoolInfo}
        teachers={teachers}
      />
    </div>
  );
};
