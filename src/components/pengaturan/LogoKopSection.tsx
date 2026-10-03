import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolInfo } from '../../types';
import {
  Upload,
  Link as LinkIcon,
  Check,
  RotateCcw,
  Printer,
  Sparkles,
  Layers,
  Eye,
  Trash2,
  FileCheck
} from 'lucide-react';

export const LogoKopSection: React.FC = () => {
  const { schoolInfo, updateSchoolInfo, addToast } = useApp();

  const [formData, setFormData] = useState<SchoolInfo>({ ...schoolInfo });
  const [leftTabMode, setLeftTabMode] = useState<'upload' | 'url'>('upload');
  const [rightTabMode, setRightTabMode] = useState<'upload' | 'url'>('upload');
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const fileInputLeftRef = useRef<HTMLInputElement | null>(null);
  const fileInputRightRef = useRef<HTMLInputElement | null>(null);

  // File Processor for Uploaded Images
  const processFile = (file: File, side: 'left' | 'right') => {
    if (!file.type.startsWith('image/')) {
      addToast('error', 'Format Tidak Didukung', 'Silakan pilih berkas gambar (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast('warning', 'Ukuran Gambar Besar', 'Disarankan menggunakan logo dengan ukuran di bawah 2MB agar pemuatan tetap cepat.');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (side === 'left') {
        setFormData(prev => ({
          ...prev,
          logoLeft: base64,
          logoLeftPreset: 'custom',
          showLogoLeft: true
        }));
        addToast('success', 'Logo Kiri Berhasil Dimuat', 'Berkas gambar logo kiri siap disimpan.');
      } else {
        setFormData(prev => ({
          ...prev,
          logoRight: base64,
          logoRightPreset: 'custom',
          showLogoRight: true
        }));
        addToast('success', 'Logo Kanan Berhasil Dimuat', 'Berkas gambar logo kanan siap disimpan.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLeftFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, 'left');
    e.target.value = '';
  };

  const handleRightFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, 'right');
    e.target.value = '';
  };

  const handleLeftDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLeft(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file, 'left');
  };

  const handleRightDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRight(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file, 'right');
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSchoolInfo(formData);
    addToast('success', 'Pengaturan Logo Disimpan', 'Kop surat sekolah telah diperbarui di seluruh dokumen cetak & laporan.');
  };

  const handleResetToDefaults = () => {
    const defaultSettings: Partial<SchoolInfo> = {
      logoLeft: '',
      logoLeftPreset: 'custom',
      logoLeftWidth: 72,
      showLogoLeft: true,
      logoRight: '',
      logoRightPreset: 'custom',
      logoRightWidth: 72,
      showLogoRight: true,
      kopLine1: `PEMERINTAH PROVINSI ${formData.province.toUpperCase()}`,
      kopLine2: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
      kopBorderStyle: 'double'
    };
    setFormData(prev => ({ ...prev, ...defaultSettings }));
    addToast('info', 'Direset ke Standar', 'Pengaturan logo kop dan ukuran telah dikembalikan ke ukuran standar 72px.');
  };

  const handleSyncLogoSizes = (size: number = 72) => {
    setFormData(prev => ({
      ...prev,
      logoLeftWidth: size,
      logoRightWidth: size
    }));
    addToast('info', 'Ukuran Logo Disamakan', `Ukuran logo kiri dan kanan sekarang sama (${size}px) untuk cetak rapor simetris.`);
  };

  const leftWidth = formData.logoLeftWidth || 72;
  const rightWidth = formData.logoRightWidth || 72;

  return (
    <div className="space-y-6">
      {/* 1. Live Preview of School Letterhead (Kop Surat) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pratinjau Langsung Kop Surat Dokumen Resmi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tampilan kop surat ini otomatis diterapkan pada cetak Rapor, Buku Induk, Piagam, dan Kartu Pelajar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Uji Cetak</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" />
              <span>Reset Standar</span>
            </button>
          </div>
        </div>

        {/* Paper Frame Simulation */}
        <div className="bg-slate-100 dark:bg-slate-950/80 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="min-w-[540px] max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-slate-300 text-black">
            <div className={`text-center pb-2 ${
              formData.kopBorderStyle === 'double'
                ? 'border-b-4 border-double border-slate-900'
                : formData.kopBorderStyle === 'solid'
                ? 'border-b-2 border-slate-900'
                : formData.kopBorderStyle === 'dashed'
                ? 'border-b-2 border-dashed border-slate-700'
                : ''
            }`}>
              <div className="flex items-center justify-between gap-3 sm:gap-6">
                {/* Logo Kiri */}
                <div 
                  className="flex shrink-0 items-center justify-center print:flex"
                  style={{ 
                    width: `${leftWidth}px`, 
                    height: `${leftWidth}px`,
                    minWidth: `${leftWidth}px`,
                    maxWidth: `${leftWidth}px`
                  }}
                >
                  {formData.showLogoLeft !== false ? (
                    formData.logoLeft ? (
                      <div
                        className="w-full h-full flex items-center justify-center overflow-hidden aspect-square kop-logo-box"
                        style={{ width: `${leftWidth}px`, height: `${leftWidth}px` }}
                      >
                        <img
                          src={formData.logoLeft}
                          alt="Logo Kiri Kop"
                          className="w-full h-full object-contain p-0.5"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputLeftRef.current?.click()}
                        className="w-full h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer p-1"
                        title="Klik untuk unggah berkas logo kiri"
                      >
                        <Upload className="h-5 w-5 mb-0.5 text-slate-400" />
                        <span className="text-[9px] font-bold">Logo Kiri</span>
                      </div>
                    )
                  ) : (
                    <div style={{ width: `${leftWidth}px`, height: `${leftWidth}px` }} className="opacity-0" />
                  )}
                </div>

                {/* Text Kop */}
                <div className="flex-1 text-center px-2 min-w-0">
                  <h3 className="text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider text-black leading-snug">
                    {formData.kopLine1 || 'PEMERINTAH KABUPATEN KUANTAN SINGINGI'}
                  </h3>
                  <h3 className="text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider text-black leading-snug">
                    {formData.kopLine2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                  </h3>
                  <h1 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-blue-900 leading-tight my-0.5">
                    {formData.schoolName}
                  </h1>
                  <p className="text-[9.5px] sm:text-xs text-slate-700 leading-tight">
                    {formData.address}
                    {formData.village ? `, Desa/Kel. ${formData.village}` : ''}
                    {formData.subdistrict ? `, Kec. ${formData.subdistrict}` : ''}
                    {formData.city ? `, ${formData.city}` : ''}
                    {formData.postalCode ? `, Kode Pos ${formData.postalCode}` : ''}
                  </p>
                  <p className="text-[9px] sm:text-xs text-slate-700 leading-tight mt-0.5">
                    NPSN: <span className="font-semibold text-black">{formData.npsn}</span> | Telp: {formData.phoneNumber} | Email: {formData.email}
                  </p>
                </div>

                {/* Logo Kanan */}
                <div 
                  className="flex shrink-0 items-center justify-center print:flex"
                  style={{ 
                    width: `${rightWidth}px`, 
                    height: `${rightWidth}px`,
                    minWidth: `${rightWidth}px`,
                    maxWidth: `${rightWidth}px`
                  }}
                >
                  {formData.showLogoRight !== false ? (
                    formData.logoRight ? (
                      <div
                        className="w-full h-full flex items-center justify-center overflow-hidden aspect-square kop-logo-box"
                        style={{ width: `${rightWidth}px`, height: `${rightWidth}px` }}
                      >
                        <img
                          src={formData.logoRight}
                          alt="Logo Kanan Kop"
                          className="w-full h-full object-contain p-0.5"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRightRef.current?.click()}
                        className="w-full h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 text-slate-400 hover:text-orange-600 transition-colors cursor-pointer p-1"
                        title="Klik untuk unggah berkas logo kanan"
                      >
                        <Upload className="h-5 w-5 mb-0.5 text-slate-400" />
                        <span className="text-[9px] font-bold">Logo Kanan</span>
                      </div>
                    )
                  ) : (
                    <div style={{ width: `${rightWidth}px`, height: `${rightWidth}px` }} className="opacity-0" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Synchronizer Bar: Samakan Ukuran Logo Kiri & Kanan */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Keselarasan Ukuran Gambar Logo Kop (Kiri & Kanan)
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Logo Kiri: <strong className="text-blue-600 dark:text-blue-400">{leftWidth}px</strong> • Logo Kanan: <strong className="text-orange-600 dark:text-orange-400">{rightWidth}px</strong>.
              {leftWidth === rightWidth ? (
                <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Ukuran sudah simetris dan seimbang.</span>
              ) : (
                <span className="ml-1.5 text-amber-600 dark:text-amber-400 font-semibold">⚠ Ukuran berbeda. Samakan agar seimbang saat dicetak.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleSyncLogoSizes(72)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Samakan ke Standar (72px)
          </button>
          {leftWidth !== rightWidth && (
            <button
              type="button"
              onClick={() => handleSyncLogoSizes(leftWidth)}
              className="px-3 py-1.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              Samakan ke {leftWidth}px
            </button>
          )}
        </div>
      </div>

      {/* 2. Grid Config: Menu Edit Logo Kiri & Logo Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ======================= MENU EDIT LOGO KIRI ======================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                KIRI
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Logo Kiri Kop Surat
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Unggah berkas logo instansi, dinas, atau logo resmi sebelah kiri
                </p>
              </div>
            </div>

            {/* Toggle Tampilkan Logo Kiri */}
            <label className="relative inline-flex items-center cursor-pointer" title="Aktifkan atau sembunyikan logo kiri">
              <input
                type="checkbox"
                checked={formData.showLogoLeft !== false}
                onChange={e => setFormData({ ...formData, showLogoLeft: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Current Active Preview Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            {formData.logoLeft ? (
              <div
                className="flex items-center justify-center shrink-0 overflow-hidden aspect-square rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1"
                style={{ width: '56px', height: '56px' }}
              >
                <img
                  src={formData.logoLeft}
                  alt="Preview Logo Kiri"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center shrink-0 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400"
                style={{ width: '56px', height: '56px' }}
              >
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {formData.logoLeft ? 'Berkas Logo Kiri (Kustom)' : 'Belum Ada Berkas Logo'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ukuran cetak: <span className="font-semibold text-blue-600 dark:text-blue-400">{leftWidth} px</span> • Status: {formData.showLogoLeft !== false ? 'Aktif Tampil' : 'Disembunyikan'}
              </p>
            </div>
            {formData.logoLeft && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoLeft: '', logoLeftPreset: 'custom' })}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                title="Hapus berkas logo kiri"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>

          {/* Mode Selector: Upload Berkas vs URL Gambar */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLeftTabMode('upload')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                leftTabMode === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Unggah Berkas Gambar</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTabMode('url')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                leftTabMode === 'url'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Tautan URL Gambar</span>
            </button>
          </div>

          {/* Tab Content: Upload Berkas (Drag & Drop + Click) */}
          {leftTabMode === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={e => { e.preventDefault(); setIsDraggingLeft(true); }}
                onDragLeave={() => setIsDraggingLeft(false)}
                onDrop={handleLeftDrop}
                onClick={() => fileInputLeftRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDraggingLeft
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto mb-2.5">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Klik atau Seret Berkas Logo Kiri ke Sini
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Format didukung: PNG (Transparan disarankan), JPG, SVG, WebP (Maksimal 2MB)
                </p>
                {formData.logoLeft && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>Berkas logo terpasang. Klik untuk mengganti.</span>
                  </div>
                )}
                <input
                  ref={fileInputLeftRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLeftFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Tab Content: URL Gambar */}
          {leftTabMode === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Alamat URL Gambar Logo (Direct Link)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://contoh.com/logo-kiri.png"
                  value={formData.logoLeft?.startsWith('http') ? formData.logoLeft : ''}
                  onChange={e => setFormData({ ...formData, logoLeft: e.target.value, logoLeftPreset: 'custom', showLogoLeft: true })}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Masukkan tautan langsung berkas gambar berakhiran .png, .jpg, atau .svg.
              </p>
            </div>
          )}

          {/* Width Adjuster */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Lebar Logo Kiri:</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">{leftWidth} px</span>
            </div>
            <input
              type="range"
              min="48"
              max="110"
              step="2"
              value={leftWidth}
              onChange={e => setFormData({ ...formData, logoLeftWidth: parseInt(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex gap-1.5 mt-2">
              {[56, 64, 72, 80, 96].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setFormData({ ...formData, logoLeftWidth: w })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    leftWidth === w
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ======================= MENU EDIT LOGO KANAN ======================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                KANAN
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Logo Kanan Kop Surat
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Unggah berkas logo sekolah, yayasan, komite, atau organisasi
                </p>
              </div>
            </div>

            {/* Toggle Tampilkan Logo Kanan */}
            <label className="relative inline-flex items-center cursor-pointer" title="Aktifkan atau sembunyikan logo kanan">
              <input
                type="checkbox"
                checked={formData.showLogoRight !== false}
                onChange={e => setFormData({ ...formData, showLogoRight: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Current Active Preview Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            {formData.logoRight ? (
              <div
                className="flex items-center justify-center shrink-0 overflow-hidden aspect-square rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1"
                style={{ width: '56px', height: '56px' }}
              >
                <img
                  src={formData.logoRight}
                  alt="Preview Logo Kanan"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center shrink-0 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400"
                style={{ width: '56px', height: '56px' }}
              >
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {formData.logoRight ? 'Berkas Logo Kanan (Kustom)' : 'Belum Ada Berkas Logo'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ukuran cetak: <span className="font-semibold text-orange-600 dark:text-orange-400">{rightWidth} px</span> • Status: {formData.showLogoRight !== false ? 'Aktif Tampil' : 'Disembunyikan'}
              </p>
            </div>
            {formData.logoRight && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoRight: '', logoRightPreset: 'custom' })}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                title="Hapus berkas logo kanan"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>

          {/* Mode Selector: Upload Berkas vs URL Gambar */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRightTabMode('upload')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                rightTabMode === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Unggah Berkas Gambar</span>
            </button>
            <button
              type="button"
              onClick={() => setRightTabMode('url')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                rightTabMode === 'url'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Tautan URL Gambar</span>
            </button>
          </div>

          {/* Tab Content: Upload Berkas (Drag & Drop + Click) */}
          {rightTabMode === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={e => { e.preventDefault(); setIsDraggingRight(true); }}
                onDragLeave={() => setIsDraggingRight(false)}
                onDrop={handleRightDrop}
                onClick={() => fileInputRightRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDraggingRight
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/50 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 mx-auto mb-2.5">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Klik atau Seret Berkas Logo Kanan ke Sini
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Format didukung: PNG (Transparan disarankan), JPG, SVG, WebP (Maksimal 2MB)
                </p>
                {formData.logoRight && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>Berkas logo terpasang. Klik untuk mengganti.</span>
                  </div>
                )}
                <input
                  ref={fileInputRightRef}
                  type="file"
                  accept="image/*"
                  onChange={handleRightFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Tab Content: URL Gambar */}
          {rightTabMode === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Alamat URL Gambar Logo (Direct Link)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://contoh.com/logo-kanan.png"
                  value={formData.logoRight?.startsWith('http') ? formData.logoRight : ''}
                  onChange={e => setFormData({ ...formData, logoRight: e.target.value, logoRightPreset: 'custom', showLogoRight: true })}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Masukkan tautan langsung berkas gambar berakhiran .png, .jpg, atau .svg.
              </p>
            </div>
          )}

          {/* Width Adjuster */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Lebar Logo Kanan:</span>
              <span className="text-orange-600 dark:text-orange-400 font-mono">{rightWidth} px</span>
            </div>
            <input
              type="range"
              min="48"
              max="110"
              step="2"
              value={rightWidth}
              onChange={e => setFormData({ ...formData, logoRightWidth: parseInt(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex gap-1.5 mt-2">
              {[56, 64, 72, 80, 96].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setFormData({ ...formData, logoRightWidth: w })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    rightWidth === w
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Teks Header Kop & Garis Pembatas */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Konfigurasi Teks Instansi & Gaya Garis Pembatas Kop Surat
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Header Baris 1 (Pemerintah / Yayasan)
            </label>
            <input
              type="text"
              value={formData.kopLine1 || ''}
              onChange={e => setFormData({ ...formData, kopLine1: e.target.value })}
              placeholder="PEMERINTAH KABUPATEN KUANTAN SINGINGI"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Header Baris 2 (Dinas / Kantor Kemenag)
            </label>
            <input
              type="text"
              value={formData.kopLine2 || ''}
              onChange={e => setFormData({ ...formData, kopLine2: e.target.value })}
              placeholder="DINAS PENDIDIKAN DAN KEBUDAYAAN"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Gaya Garis Pembatas Kop
            </label>
            <select
              value={formData.kopBorderStyle || 'double'}
              onChange={e => setFormData({ ...formData, kopBorderStyle: e.target.value as any })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="double">Garis Ganda Tebal-Tipis (Resmi Dinas / Standar)</option>
              <option value="solid">Garis Tunggal Tebal (Solid 2px)</option>
              <option value="dashed">Garis Putus-Putus (Dashed)</option>
              <option value="none">Tanpa Garis Pembatas</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleSave()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Simpan Pengaturan Logo & Kop Surat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
