import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ProjekKokurikuler, 
  KokurikulerDimensiMapping, 
  SiswaDPLCapaianRecord, 
  DPLPredikat,
  Student
} from '../../types';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { Modal } from '../common/Modal';
import * as XLSX from 'xlsx';
import {
  Target,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Info,
  Search,
  BookOpen,
  Check,
  Edit2,
  Copy,
  Layers,
  Award,
  Activity,
  SlidersHorizontal
} from 'lucide-react';

// Preset color options for Dimensi columns
const DIMENSI_COLORS = [
  { name: 'Biru Muda', bg: '#cfe2f3', border: '#9fc5e8', text: '#0b5394' },
  { name: 'Kuning Muda', bg: '#fff2cc', border: '#ffe599', text: '#bf9000' },
  { name: 'Abu-abu Muda', bg: '#d9d9d9', border: '#b7b7b7', text: '#434343' },
  { name: 'Hijau Muda', bg: '#d9ead3', border: '#b6d7a8', text: '#38761d' },
  { name: 'Merah Muda', bg: '#f4cccc', border: '#ea9999', text: '#cc0000' },
  { name: 'Ungu Muda', bg: '#d9d2e9', border: '#b4a7d6', text: '#351c75' }
];

// Default Preset matching the user's uploaded image exactly:
const DEFAULT_GERAKAN_7KAIH_MAPPINGS: KokurikulerDimensiMapping[] = [
  {
    id: 'dim-1',
    dimensi: 'kesehatan',
    warna: '#cfe2f3',
    subdimensi: [
      'hidup bersih dan sehat',
      'kebugaran, kesehatan fisik, dan kesehatan mental'
    ]
  },
  {
    id: 'dim-2',
    dimensi: 'kemandirian',
    warna: '#fff2cc',
    subdimensi: [
      'bertanggung jawab'
    ]
  },
  {
    id: 'dim-3',
    dimensi: 'penalaran kritis',
    warna: '#d9d9d9',
    subdimensi: [
      'penyampaian argumentasi'
    ]
  }
];

export const KokurikulerDPLView: React.FC = () => {
  const {
    schoolInfo,
    students,
    projekKokurikulerList,
    addProjekKokurikuler,
    updateProjekKokurikuler,
    deleteProjekKokurikuler,
    dplAssessmentList,
    saveDPLAssessment,
    bulkSaveDPLAssessments,
    addToast
  } = useApp();

  // Active Tab: 'data_kokurikuler' (matching image) vs 'penilaian' vs 'cetak'
  const [activeTab, setActiveTab] = useState<'data_kokurikuler' | 'penilaian' | 'cetak'>('data_kokurikuler');

  // Selected Project
  const [selectedProjekId, setSelectedProjekId] = useState<string>(() => {
    return projekKokurikulerList[0]?.id || 'prj-kemendikdasmen-01';
  });

  const currentProjek = useMemo(() => {
    return (
      projekKokurikulerList.find(p => p.id === selectedProjekId) ||
      projekKokurikulerList[0] || {
        id: 'prj-kemendikdasmen-01',
        kodeProjek: 'KOKUR-HS-01',
        judul: 'Gerakan 7KAIH (Hidup Sehat)',
        tema: 'Hidup Sehat',
        namaKegiatan: 'Gerakan 7KAIH',
        bentukKegiatan: 'Pembiasaan Berolahraga dan Pola Hidup Bersih & Sehat (PHBS)',
        tujuanRingkasDeskripsi: 'memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga',
        dimensiSubdimensiMapping: DEFAULT_GERAKAN_7KAIH_MAPPINGS,
        deskripsi: 'Kegiatan kokurikuler pembiasaan hidup sehat Gerakan 7KAIH.',
        fase: 'Fase B (Kelas IV)',
        kelas: 'IV-A',
        semester: '1 (Ganjil)',
        tahunAjaran: '2024/2025',
        totalAlokasiJP: 36,
        koordinator: 'Sri Wahyuni, S.Pd., Gr.',
        fasilitator: ['Sri Wahyuni, S.Pd., Gr.'],
        dimensiTargetIds: [],
        elemenTargetIds: [],
        tahapan: [],
        status: 'Sedang Berjalan'
      }
    );
  }, [projekKokurikulerList, selectedProjekId]);

  // Form State for Data Kokurikuler (Header fields & Dimension Mappings)
  const [formData, setFormData] = useState<{
    tema: string;
    namaKegiatan: string;
    bentukKegiatan: string;
    tujuanRingkasDeskripsi: string;
    mappings: KokurikulerDimensiMapping[];
  }>(() => ({
    tema: currentProjek.tema || 'Hidup Sehat',
    namaKegiatan: currentProjek.namaKegiatan || currentProjek.judul || 'Gerakan 7KAIH',
    bentukKegiatan: currentProjek.bentukKegiatan || 'Pembiasaan Berolahraga dan Pola Hidup Bersih & Sehat (PHBS)',
    tujuanRingkasDeskripsi: currentProjek.tujuanRingkasDeskripsi || 'memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga',
    mappings: currentProjek.dimensiSubdimensiMapping && currentProjek.dimensiSubdimensiMapping.length > 0
      ? currentProjek.dimensiSubdimensiMapping
      : DEFAULT_GERAKAN_7KAIH_MAPPINGS
  }));

  // Sync formData when selected project changes
  const handleSelectProjek = (id: string) => {
    setSelectedProjekId(id);
    const prj = projekKokurikulerList.find(p => p.id === id);
    if (prj) {
      setFormData({
        tema: prj.tema || 'Hidup Sehat',
        namaKegiatan: prj.namaKegiatan || prj.judul || 'Gerakan 7KAIH',
        bentukKegiatan: prj.bentukKegiatan || '',
        tujuanRingkasDeskripsi: prj.tujuanRingkasDeskripsi || 'memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga',
        mappings: prj.dimensiSubdimensiMapping && prj.dimensiSubdimensiMapping.length > 0
          ? prj.dimensiSubdimensiMapping
          : DEFAULT_GERAKAN_7KAIH_MAPPINGS
      });
    }
  };

  // Search in assessment table
  const [searchStudent, setSearchStudent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for New Project
  const [isNewProjekModalOpen, setIsNewProjekModalOpen] = useState(false);
  const [newProjekJudul, setNewProjekJudul] = useState('');
  const [newProjekTema, setNewProjekTema] = useState('Hidup Sehat');

  // Flatten active subdimensions list for table columns
  // Disambiguates duplicate dimension names to prevent duplicate React keys
  const activeSubdimensiColumns = useMemo(() => {
    const list: Array<{
      key: string;
      legacyKey: string;
      dimensi: string;
      subdimensi: string;
      dimIndex: number;
      subIndex: number;
      warna?: string;
    }> = [];

    const seenKeys = new Map<string, number>();

    formData.mappings.forEach((m, dimIdx) => {
      const cleanDimName = (m.dimensi || `dim_${dimIdx + 1}`)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || `dim_${dimIdx + 1}`;

      m.subdimensi.forEach((sub, subIdx) => {
        if (sub.trim()) {
          const rawKey = `${cleanDimName}_${subIdx}`;
          let uniqueKey = rawKey;

          if (seenKeys.has(rawKey)) {
            const count = seenKeys.get(rawKey)! + 1;
            seenKeys.set(rawKey, count);
            uniqueKey = `${rawKey}_${count}`;
          } else {
            seenKeys.set(rawKey, 1);
          }

          list.push({
            key: uniqueKey,
            legacyKey: rawKey,
            dimensi: m.dimensi,
            subdimensi: sub,
            dimIndex: dimIdx,
            subIndex: subIdx,
            warna: m.warna
          });
        }
      });
    });

    return list;
  }, [formData.mappings]);

  // Handle Dimension Header / Subdimension editing
  const handleDimensiNameChange = (dimIndex: number, newName: string) => {
    setFormData(prev => {
      const nextMappings = [...prev.mappings];
      nextMappings[dimIndex] = { ...nextMappings[dimIndex], dimensi: newName };
      return { ...prev, mappings: nextMappings };
    });
  };

  const handleSubdimensiChange = (dimIndex: number, subIndex: number, val: string) => {
    setFormData(prev => {
      const nextMappings = [...prev.mappings];
      const subList = [...nextMappings[dimIndex].subdimensi];
      subList[subIndex] = val;
      nextMappings[dimIndex] = { ...nextMappings[dimIndex], subdimensi: subList };
      return { ...prev, mappings: nextMappings };
    });
  };

  const handleAddSubdimensiRow = (dimIndex: number) => {
    setFormData(prev => {
      const nextMappings = [...prev.mappings];
      const subList = [...nextMappings[dimIndex].subdimensi, ''];
      nextMappings[dimIndex] = { ...nextMappings[dimIndex], subdimensi: subList };
      return { ...prev, mappings: nextMappings };
    });
  };

  const handleRemoveSubdimensiRow = (dimIndex: number, subIndex: number) => {
    setFormData(prev => {
      const nextMappings = [...prev.mappings];
      const subList = nextMappings[dimIndex].subdimensi.filter((_, i) => i !== subIndex);
      nextMappings[dimIndex] = { ...nextMappings[dimIndex], subdimensi: subList };
      return { ...prev, mappings: nextMappings };
    });
  };

  const handleAddDimensiColumn = () => {
    const nextIdx = formData.mappings.length;
    const colorPreset = DIMENSI_COLORS[nextIdx % DIMENSI_COLORS.length];
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newDim: KokurikulerDimensiMapping = {
      id: `dim-${uniqueSuffix}`,
      dimensi: `Dimensi Baru ${nextIdx + 1}`,
      warna: colorPreset.bg,
      subdimensi: ['indikator subdimensi 1']
    };
    setFormData(prev => ({
      ...prev,
      mappings: [...prev.mappings, newDim]
    }));
  };

  const handleRemoveDimensiColumn = (dimIndex: number) => {
    if (formData.mappings.length <= 1) {
      addToast('error', 'Tidak Dapat Dihapus', 'Minimal harus ada 1 Dimensi Profil Lulusan.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      mappings: prev.mappings.filter((_, i) => i !== dimIndex)
    }));
  };

  // Save Data Kokurikuler Settings
  const handleSaveDataKokurikuler = () => {
    updateProjekKokurikuler(currentProjek.id, {
      tema: formData.tema,
      namaKegiatan: formData.namaKegiatan,
      bentukKegiatan: formData.bentukKegiatan,
      tujuanRingkasDeskripsi: formData.tujuanRingkasDeskripsi,
      dimensiSubdimensiMapping: formData.mappings,
      judul: `${formData.namaKegiatan} (${formData.tema})`,
      updatedAt: new Date().toISOString()
    });
    addToast('success', 'Data Kokurikuler Disimpan', 'Konfigurasi tema, kegiatan, dan pemetaan subdimensi berhasil disimpan.');
  };

  // Switch to Penilaian and auto-save
  const handleNavigateToPenilaian = () => {
    handleSaveDataKokurikuler();
    setActiveTab('penilaian');
  };

  // Helper to get or build current student assessment
  const getStudentAssessment = (siswaId: string): SiswaDPLCapaianRecord => {
    const existing = dplAssessmentList.find(
      r => r.projekId === currentProjek.id && r.siswaId === siswaId
    );
    if (existing) return existing;

    // Default assessment
    const defaultCapaian: Record<string, { predikat: DPLPredikat; catatan?: string }> = {};
    activeSubdimensiColumns.forEach(col => {
      defaultCapaian[col.key] = { predikat: 'BSH' };
    });

    return {
      id: `dpl-gen-${currentProjek.id}-${siswaId}`,
      projekId: currentProjek.id,
      siswaId,
      capaianPerDimensi: defaultCapaian,
      catatanProses: generateKemendikdasmenDescription(siswaId, defaultCapaian),
      keaktifan: 'Aktif',
      waktuPenilaian: new Date().toISOString().split('T')[0]
    };
  };

  // Format Description Generator according to E-Rapor Kemendikdasmen standards
  function generateKemendikdasmenDescription(
    siswaId: string,
    capaianMap?: Record<string, { predikat: DPLPredikat }>
  ): string {
    const student = students.find(s => s.id === siswaId);
    const nama = student?.nama || student?.name || 'Peserta didik';
    const tujuan = formData.tujuanRingkasDeskripsi.trim() || 'memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga';

    // Retrieve or default capaian
    const currentCapaian = capaianMap || dplAssessmentList.find(
      r => r.projekId === currentProjek.id && r.siswaId === siswaId
    )?.capaianPerDimensi || {};

    const sbList: string[] = [];
    const bshList: string[] = [];
    const mbList: string[] = [];
    const bbList: string[] = [];

    activeSubdimensiColumns.forEach(col => {
      const pred = currentCapaian[col.key]?.predikat || currentCapaian[col.legacyKey]?.predikat || 'BSH';
      const cleanSub = col.subdimensi.trim();
      if (pred === 'SB') sbList.push(cleanSub);
      else if (pred === 'BSH') bshList.push(cleanSub);
      else if (pred === 'MB') mbList.push(cleanSub);
      else if (pred === 'BB') bbList.push(cleanSub);
    });

    let overallSentence = '';
    if (sbList.length >= Math.max(1, Math.ceil(activeSubdimensiColumns.length / 2))) {
      overallSentence = `Ananda ${nama} menunjukkan perkembangan yang sangat baik dalam ${tujuan}.`;
    } else if (mbList.length + bbList.length > bshList.length + sbList.length) {
      overallSentence = `Ananda ${nama} mulai berkembang dalam ${tujuan}.`;
    } else {
      overallSentence = `Ananda ${nama} berkembang sesuai harapan dalam ${tujuan}.`;
    }

    const details: string[] = [];
    if (sbList.length > 0) {
      details.push(`Sangat Berkembang dalam ${sbList.join(', ')}`);
    }
    if (bshList.length > 0) {
      details.push(`Berkembang Sesuai Harapan dalam ${bshList.join(', ')}`);
    }
    if (mbList.length > 0) {
      details.push(`Mulai Berkembang dalam ${mbList.join(', ')}`);
    }
    if (bbList.length > 0) {
      details.push(`Perlu Bimbingan dalam ${bbList.join(', ')}`);
    }

    if (details.length > 0) {
      return `${overallSentence} ${details.join('; ')}.`;
    }
    return overallSentence;
  }

  // Handle changing a student's grade for a specific subdimension
  const handleGradeChange = (siswaId: string, colKey: string, predikat: DPLPredikat) => {
    const existing = getStudentAssessment(siswaId);
    const updatedCapaian = {
      ...(existing.capaianPerDimensi || {}),
      [colKey]: { predikat }
    };
    const updatedDesc = generateKemendikdasmenDescription(siswaId, updatedCapaian);

    saveDPLAssessment({
      ...existing,
      projekId: currentProjek.id,
      siswaId,
      capaianPerDimensi: updatedCapaian,
      catatanProses: updatedDesc
    });
  };

  // Handle editing description manually
  const handleDescriptionChange = (siswaId: string, newDesc: string) => {
    const existing = getStudentAssessment(siswaId);
    saveDPLAssessment({
      ...existing,
      projekId: currentProjek.id,
      siswaId,
      catatanProses: newDesc
    });
  };

  // Quick Action: Set all students to BSH
  const handleSetAllBSH = () => {
    const updatedList: SiswaDPLCapaianRecord[] = students.map(student => {
      const existing = getStudentAssessment(student.id);
      const updatedCapaian: Record<string, { predikat: DPLPredikat }> = {};
      activeSubdimensiColumns.forEach(col => {
        updatedCapaian[col.key] = { predikat: 'BSH' };
      });
      const desc = generateKemendikdasmenDescription(student.id, updatedCapaian);
      return {
        ...existing,
        projekId: currentProjek.id,
        siswaId: student.id,
        capaianPerDimensi: updatedCapaian,
        catatanProses: desc
      };
    });

    bulkSaveDPLAssessments(updatedList);
    addToast('success', 'Semua Siswa Diset BSH', 'Seluruh subdimensi siswa berhasil diatur ke predikat Berkembang Sesuai Harapan (BSH).');
  };

  // Quick Action: Regenerate all descriptions
  const handleRegenerateAllDescriptions = () => {
    const updatedList: SiswaDPLCapaianRecord[] = students.map(student => {
      const existing = getStudentAssessment(student.id);
      const desc = generateKemendikdasmenDescription(student.id, existing.capaianPerDimensi);
      return {
        ...existing,
        projekId: currentProjek.id,
        siswaId: student.id,
        catatanProses: desc
      };
    });

    bulkSaveDPLAssessments(updatedList);
    addToast('info', 'Deskripsi E-Rapor Dibuat', 'Seluruh deskripsi capaian kokurikuler telah disinkronkan dengan formulasi Kemendikdasmen.');
  };

  // Reset to Gerakan 7KAIH Preset (matching screenshot)
  const handleResetToPreset7KAIH = () => {
    setFormData({
      tema: 'Hidup Sehat',
      namaKegiatan: 'Gerakan 7KAIH',
      bentukKegiatan: 'Pembiasaan Berolahraga dan Pola Hidup Bersih & Sehat (PHBS)',
      tujuanRingkasDeskripsi: 'memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga',
      mappings: DEFAULT_GERAKAN_7KAIH_MAPPINGS
    });
    addToast('info', 'Format Sesuai Gambar Diterapkan', 'Data kokurikuler telah diisi dengan tema Hidup Sehat & Gerakan 7KAIH.');
  };

  // Create New Project Handler
  const handleCreateNewProjek = () => {
    if (!newProjekJudul.trim()) {
      addToast('error', 'Judul Wajib Diisi', 'Silakan masukkan nama kegiatan kokurikuler.');
      return;
    }

    const newId = `prj-kokur-${Date.now()}`;
    const newProjek: ProjekKokurikuler = {
      id: newId,
      kodeProjek: `KOKUR-${Date.now().toString().slice(-4)}`,
      judul: `${newProjekJudul} (${newProjekTema})`,
      tema: newProjekTema,
      namaKegiatan: newProjekJudul,
      bentukKegiatan: 'Aksi Nyata & Pembiasaan',
      tujuanRingkasDeskripsi: `memahami dan mempraktikkan ${newProjekJudul.toLowerCase()}`,
      dimensiSubdimensiMapping: DEFAULT_GERAKAN_7KAIH_MAPPINGS,
      deskripsi: `Kegiatan kokurikuler ${newProjekJudul}`,
      fase: schoolInfo.phase || 'Fase B (Kelas IV)',
      kelas: schoolInfo.className || 'IV-A',
      semester: schoolInfo.semester?.includes('2') ? '2 (Genap)' : '1 (Ganjil)',
      tahunAjaran: schoolInfo.academicYear || '2024/2025',
      totalAlokasiJP: 36,
      koordinator: schoolInfo.homeroomTeacherName || 'Wali Kelas',
      fasilitator: [schoolInfo.homeroomTeacherName || 'Wali Kelas'],
      dimensiTargetIds: [],
      elemenTargetIds: [],
      tahapan: [],
      status: 'Sedang Berjalan'
    };

    addProjekKokurikuler(newProjek);
    setSelectedProjekId(newId);
    setFormData({
      tema: newProjek.tema,
      namaKegiatan: newProjek.namaKegiatan || '',
      bentukKegiatan: newProjek.bentukKegiatan || '',
      tujuanRingkasDeskripsi: newProjek.tujuanRingkasDeskripsi || '',
      mappings: DEFAULT_GERAKAN_7KAIH_MAPPINGS
    });
    setIsNewProjekModalOpen(false);
    setNewProjekJudul('');
    addToast('success', 'Kegiatan Baru Dibuat', `Kegiatan "${newProjek.judul}" siap dikonfigurasi.`);
  };

  // Export to Excel (Kemendikdasmen E-Rapor Format)
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: DATA KOKURIKULER (matching screenshot)
      const dataKokurikulerRows: any[] = [
        ['Data Kokurikuler'],
        [],
        ['Tema', ':', formData.tema],
        ['Nama Kegiatan', ':', formData.namaKegiatan],
        ['Bentuk Kegiatan', ':', formData.bentukKegiatan],
        ['Tujuan ringkas untuk deskripsi', ':', formData.tujuanRingkasDeskripsi],
        [],
        ['Dimensi Profil Lulusan', ':', ...formData.mappings.map(m => m.dimensi)],
        ['Subdimensi', ':']
      ];

      // Find max number of subdimensions across mappings
      const maxSubs = Math.max(...formData.mappings.map(m => m.subdimensi.length), 4);
      for (let sIdx = 0; sIdx < maxSubs; sIdx++) {
        const row = ['', (sIdx + 1).toString()];
        formData.mappings.forEach(m => {
          row.push(m.subdimensi[sIdx] || '');
        });
        dataKokurikulerRows.push(row);
      }

      const wsData = XLSX.utils.aoa_to_sheet(dataKokurikulerRows);
      XLSX.utils.book_append_sheet(wb, wsData, 'Data Kokurikuler');

      // Sheet 2: PENILAIAN SISWA
      const headerRow = ['No', 'NISN', 'Nama Peserta Didik', 'L/P'];
      activeSubdimensiColumns.forEach((col, i) => {
        headerRow.push(`[${col.dimensi}] ${col.subdimensi}`);
      });
      headerRow.push('Deskripsi Capaian Rapor');

      const nilaiRows: any[] = [
        [`NILAI KOKURIKULER - ${formData.namaKegiatan.toUpperCase()} (${formData.tema.toUpperCase()})`],
        [`Sekolah: ${schoolInfo.schoolName} | Kelas: ${schoolInfo.className} | Tahun Ajaran: ${schoolInfo.academicYear}`],
        [],
        headerRow
      ];

      students.forEach((student, index) => {
        const rec = getStudentAssessment(student.id);
        const row = [
          index + 1,
          student.nisn,
          student.nama,
          student.gender || student.jenisKelamin || 'L'
        ];

        activeSubdimensiColumns.forEach(col => {
          row.push(rec.capaianPerDimensi?.[col.key]?.predikat || rec.capaianPerDimensi?.[col.legacyKey]?.predikat || 'BSH');
        });

        row.push(rec.catatanProses || '');
        nilaiRows.push(row);
      });

      const wsNilai = XLSX.utils.aoa_to_sheet(nilaiRows);
      XLSX.utils.book_append_sheet(wb, wsNilai, 'Penilaian Kokurikuler');

      // Write file
      const fileName = `E-Rapor_Kokurikuler_${formData.namaKegiatan.replace(/\s+/g, '_')}_${schoolInfo.className}.xlsx`;
      XLSX.writeFile(wb, fileName);
      addToast('success', 'Excel Berhasil Diunduh', `File ${fileName} siap digunakan.`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Gagal Ekspor', 'Terjadi kesalahan saat membuat file Excel.');
    }
  };

  // Import from Excel handler
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        // Check if "Data Kokurikuler" sheet exists
        if (wb.SheetNames.includes('Data Kokurikuler')) {
          const ws = wb.Sheets['Data Kokurikuler'];
          const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
          // Parse header fields
          let importedTema = formData.tema;
          let importedNama = formData.namaKegiatan;
          let importedBentuk = formData.bentukKegiatan;
          let importedTujuan = formData.tujuanRingkasDeskripsi;

          rows.forEach(r => {
            if (!r || r.length < 2) return;
            const label = String(r[0] || '').toLowerCase().trim();
            const val = String(r[2] || r[1] || '').trim();
            if (label.includes('tema')) importedTema = val;
            if (label.includes('nama kegiatan')) importedNama = val;
            if (label.includes('bentuk kegiatan')) importedBentuk = val;
            if (label.includes('tujuan ringkas')) importedTujuan = val;
          });

          setFormData(prev => ({
            ...prev,
            tema: importedTema,
            namaKegiatan: importedNama,
            bentukKegiatan: importedBentuk,
            tujuanRingkasDeskripsi: importedTujuan
          }));
        }

        // Check if "Penilaian Kokurikuler" sheet exists
        if (wb.SheetNames.includes('Penilaian Kokurikuler')) {
          const wsNilai = wb.Sheets['Penilaian Kokurikuler'];
          const rows: any[][] = XLSX.utils.sheet_to_json(wsNilai, { header: 1 });

          // Look for row starting with 'No'
          const headerIdx = rows.findIndex(r => r && (r[0] === 'No' || r[0] === 'NO'));
          if (headerIdx >= 0) {
            const header = rows[headerIdx];
            const updatedAssessments: SiswaDPLCapaianRecord[] = [];

            for (let i = headerIdx + 1; i < rows.length; i++) {
              const row = rows[i];
              if (!row || row.length < 3) continue;
              const nisn = String(row[1] || '').trim();
              const student = students.find(s => s.nisn === nisn);
              if (student) {
                const capaian: Record<string, { predikat: DPLPredikat }> = {};
                activeSubdimensiColumns.forEach((col, cIdx) => {
                  const val = String(row[4 + cIdx] || 'BSH').toUpperCase().trim() as DPLPredikat;
                  capaian[col.key] = {
                    predikat: ['BB', 'MB', 'BSH', 'SB'].includes(val) ? val : 'BSH'
                  };
                });

                const desc = String(row[row.length - 1] || generateKemendikdasmenDescription(student.id, capaian));
                updatedAssessments.push({
                  id: `dpl-rec-${currentProjek.id}-${student.id}`,
                  projekId: currentProjek.id,
                  siswaId: student.id,
                  capaianPerDimensi: capaian,
                  catatanProses: desc,
                  waktuPenilaian: new Date().toISOString().split('T')[0]
                });
              }
            }

            if (updatedAssessments.length > 0) {
              bulkSaveDPLAssessments(updatedAssessments);
              addToast('success', 'Import Berhasil', `${updatedAssessments.length} data nilai kokurikuler berhasil diimpor.`);
            }
          }
        }

        addToast('success', 'File Excel Berhasil Dimuat', 'Data konfigurasi telah diperbarui dari file.');
      } catch (err) {
        console.error(err);
        addToast('error', 'Gagal Membaca Excel', 'Format file tidak sesuai dengan standar E-Rapor Kemendikdasmen.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Filtered students for assessment view
  const filteredStudents = useMemo(() => {
    if (!searchStudent.trim()) return students;
    const q = searchStudent.toLowerCase();
    return students.filter(
      s => s.nama.toLowerCase().includes(q) || s.nisn.includes(q)
    );
  }, [students, searchStudent]);

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Excel Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportExcel}
        accept=".xlsx, .xls"
        className="hidden"
      />

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-pink-500/15 to-purple-600/20 text-pink-600 dark:text-pink-400 rounded-2xl shrink-0">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Kokurikuler & Dimensi Profil Lulusan (DPL)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Format E-Rapor Kemendikdasmen RI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Pengelolaan tema, pemetaan dimensi profil kelulusan, dan asesmen capaian kokurikuler {schoolInfo.schoolName}
              </p>
            </div>
          </div>

          {/* Project Switcher & Actions */}
          <div className="flex items-center gap-2 flex-wrap self-end lg:self-center">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-2">Kegiatan:</span>
              <select
                value={selectedProjekId}
                onChange={e => handleSelectProjek(e.target.value)}
                className="bg-white dark:bg-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {projekKokurikulerList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.namaKegiatan || p.judul} ({p.tema})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsNewProjekModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-sm shadow-purple-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Kegiatan Baru
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('data_kokurikuler')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'data_kokurikuler'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            1. Data Kokurikuler (Format E-Rapor)
          </button>

          <button
            onClick={() => setActiveTab('penilaian')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'penilaian'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            2. Penilaian Kokurikuler Siswa
          </button>

          <button
            onClick={() => setActiveTab('cetak')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'cetak'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Printer className="w-4 h-4" />
            3. Cetak Lembar Rapor Kokurikuler
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DATA KOKURIKULER (PERSIS SEPERTI GAMBAR USER DARI E-RAPOR)         */}
      {/* ========================================================================= */}
      {activeTab === 'data_kokurikuler' && (
        <div className="space-y-6">
          {/* Main Excel-like Sheet Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Sheet Title Bar */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Data Kokurikuler
                </h2>
                <span className="text-xs text-slate-500 font-normal">
                  (Rujukan Format Aplikasi E-Rapor Kemendikdasmen)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToPreset7KAIH}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors"
                  title="Terapkan data default persis seperti contoh gambar user"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Format Contoh Gambar
                </button>
                <button
                  onClick={handleSaveDataKokurikuler}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Perubahan
                </button>
              </div>
            </div>

            {/* Excel Grid Layout */}
            <div className="p-6 overflow-x-auto">
              <div className="min-w-[700px] font-sans">
                {/* Upper Fields (Tema, Nama Kegiatan, Bentuk Kegiatan, Tujuan Ringkas) */}
                <div className="grid grid-cols-12 gap-y-3 gap-x-4 items-center mb-6">
                  {/* Row: Tema */}
                  <div className="col-span-3 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Tema
                  </div>
                  <div className="col-span-1 text-center font-bold text-slate-700 dark:text-slate-300">:</div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={formData.tema}
                      onChange={e => setFormData({ ...formData, tema: e.target.value })}
                      placeholder="Contoh: Hidup Sehat"
                      className="w-full bg-[#d9ead3] dark:bg-emerald-950/60 text-slate-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 px-3 py-2 rounded font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    />
                  </div>
                  {/* Purple 3D Button to Assessment Sheet (Matching Screenshot) */}
                  <div className="col-span-3 pl-4">
                    <button
                      onClick={handleNavigateToPenilaian}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-b from-[#7e3af2] to-[#581c87] hover:from-[#6c2bd9] hover:to-[#4a148c] text-white font-black text-sm rounded-lg shadow-md shadow-purple-900/30 border-t border-purple-400 hover:brightness-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                      title="Klik untuk membuka lembar penilaian peserta didik"
                    >
                      <span>Ke Penilaian</span>
                      <ArrowRight className="w-4 h-4 text-purple-200" />
                    </button>
                  </div>

                  {/* Row: Nama Kegiatan */}
                  <div className="col-span-3 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Nama Kegiatan
                  </div>
                  <div className="col-span-1 text-center font-bold text-slate-700 dark:text-slate-300">:</div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={formData.namaKegiatan}
                      onChange={e => setFormData({ ...formData, namaKegiatan: e.target.value })}
                      placeholder="Contoh: Gerakan 7KAIH"
                      className="w-full bg-[#d9ead3] dark:bg-emerald-950/60 text-slate-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 px-3 py-2 rounded font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    />
                  </div>
                  <div className="col-span-3"></div>

                  {/* Row: Bentuk Kegiatan */}
                  <div className="col-span-3 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Bentuk Kegiatan
                  </div>
                  <div className="col-span-1 text-center font-bold text-slate-700 dark:text-slate-300">:</div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={formData.bentukKegiatan}
                      onChange={e => setFormData({ ...formData, bentukKegiatan: e.target.value })}
                      placeholder="Contoh: Pembiasaan Berolahraga dan Pola Hidup Bersih & Sehat"
                      className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="col-span-3"></div>

                  {/* Row: Tujuan ringkas untuk deskripsi */}
                  <div className="col-span-3 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Tujuan ringkas untuk deskripsi
                  </div>
                  <div className="col-span-1 text-center font-bold text-slate-700 dark:text-slate-300">:</div>
                  <div className="col-span-8">
                    <textarea
                      rows={2}
                      value={formData.tujuanRingkasDeskripsi}
                      onChange={e => setFormData({ ...formData, tujuanRingkasDeskripsi: e.target.value })}
                      placeholder="Contoh: memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga"
                      className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      *Tujuan ini akan otomatis digabungkan dengan capaian subdimensi siswa untuk menghasilkan narasi deskripsi rapor resmi Kemendikdasmen.
                    </span>
                  </div>
                </div>

                {/* Dimension & Subdimension Spreadsheet Table (Matching Screenshot) */}
                <div className="border border-slate-400 dark:border-slate-700 rounded-lg overflow-hidden shadow-xs">
                  <table className="w-full border-collapse border border-slate-400 dark:border-slate-700 text-xs sm:text-sm">
                    <thead>
                      {/* Header Baris: Dimensi Profil Lulusan */}
                      <tr className="border-b border-slate-400 dark:border-slate-700">
                        <th className="w-48 bg-slate-100 dark:bg-slate-800/90 border-r border-slate-400 dark:border-slate-700 p-2.5 text-left font-bold text-slate-900 dark:text-slate-100">
                          Dimensi Profil Lulusan
                        </th>
                        <th className="w-8 bg-slate-100 dark:bg-slate-800/90 border-r border-slate-400 dark:border-slate-700 p-2.5 text-center font-bold text-slate-900 dark:text-slate-100">
                          :
                        </th>
                        {formData.mappings.map((mapping, mIdx) => (
                          <th
                            key={`dim-col-${mapping.id || `idx-${mIdx}`}`}
                            style={{ backgroundColor: mapping.warna || '#cfe2f3' }}
                            className="border-r border-slate-400 p-2.5 text-left font-extrabold text-slate-900 relative group min-w-[200px]"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <input
                                type="text"
                                value={mapping.dimensi}
                                onChange={e => handleDimensiNameChange(mIdx, e.target.value)}
                                className="w-full bg-transparent font-extrabold text-slate-900 text-sm focus:outline-none focus:underline"
                                title="Klik untuk mengedit nama dimensi"
                              />
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleAddSubdimensiRow(mIdx)}
                                  className="p-1 hover:bg-black/10 rounded text-slate-800"
                                  title="Tambah baris subdimensi"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                {formData.mappings.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveDimensiColumn(mIdx)}
                                    className="p-1 hover:bg-red-500/20 text-red-700 rounded"
                                    title="Hapus kolom dimensi ini"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {/* Subdimensi Rows (Numbered 1, 2, 3, 4, etc.) */}
                      {Array.from({
                        length: Math.max(
                          4,
                          ...formData.mappings.map(m => m.subdimensi.length)
                        )
                      }).map((_, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className="border-b border-slate-300 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        >
                          {/* Label Kolom Pertama (Hanya tampil kata 'Subdimensi' di baris 0) */}
                          <td className="bg-slate-50 dark:bg-slate-850 border-r border-slate-400 dark:border-slate-700 px-3 py-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                            {rowIdx === 0 ? 'Subdimensi' : ''}
                          </td>
                          {/* Nomor Urut 1, 2, 3, 4 */}
                          <td className="bg-slate-50 dark:bg-slate-850 border-r border-slate-400 dark:border-slate-700 px-2 py-2 text-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                            {rowIdx + 1}
                          </td>

                          {/* Data Subdimensi per Kolom Dimensi */}
                          {formData.mappings.map((mapping, mIdx) => {
                            const val = mapping.subdimensi[rowIdx] || '';
                            const isPresent = rowIdx < mapping.subdimensi.length;

                            return (
                              <td
                                key={`subdim-cell-${mapping.id || `idx-${mIdx}`}-${rowIdx}`}
                                style={{
                                  backgroundColor: val ? `${mapping.warna}25` : 'transparent'
                                }}
                                className="border-r border-slate-400 dark:border-slate-700 p-1.5 align-middle relative group"
                              >
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={val}
                                    placeholder={isPresent ? `Isi subdimensi ${rowIdx + 1}...` : ''}
                                    onChange={e => {
                                      if (!isPresent && e.target.value.trim()) {
                                        handleAddSubdimensiRow(mIdx);
                                      }
                                      handleSubdimensiChange(mIdx, rowIdx, e.target.value);
                                    }}
                                    className="w-full bg-transparent px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded"
                                  />
                                  {isPresent && val && (
                                    <button
                                      onClick={() => handleRemoveSubdimensiRow(mIdx, rowIdx)}
                                      className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Hapus baris subdimensi"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Controls */}
                <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
                  <button
                    onClick={handleAddDimensiColumn}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Tambah Kolom Dimensi
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportExcel}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      Unduh Excel Template
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      Impor dari Excel
                    </button>
                    <button
                      onClick={handleNavigateToPenilaian}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-lg shadow-sm hover:brightness-110 transition-all"
                    >
                      <span>Simpan & Buka Penilaian</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <p className="font-bold">Panduan Pengisian Data Kokurikuler E-Rapor Kemendikdasmen:</p>
              <p>
                1. <strong>Tema & Nama Kegiatan</strong> diisi sesuai program kokurikuler semester berjalan (contoh: <em>Hidup Sehat</em> dengan kegiatan <em>Gerakan 7KAIH</em>).
              </p>
              <p>
                2. <strong>Tujuan ringkas untuk deskripsi</strong> adalah kalimat inti capaian yang nantinya otomatis disusun bersama predikat siswa menjadi catatan rapor.
              </p>
              <p>
                3. Klik tombol ungu <strong>[Ke Penilaian]</strong> untuk menginput capaian perkembangan peserta didik (BB, MB, BSH, SB).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENILAIAN KOKURIKULER SISWA (HASIL DARI TOMBOL "KE PENILAIAN")      */}
      {/* ========================================================================= */}
      {activeTab === 'penilaian' && (
        <div className="space-y-6">
          {/* Header Ringkasan Kegiatan Aktif */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {formData.tema}
                </span>
                <span className="text-xs text-purple-200">
                  • {schoolInfo.className} ({schoolInfo.phase})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                {formData.namaKegiatan}
              </h2>
              <p className="text-xs text-purple-200 mt-1 max-w-3xl line-clamp-2">
                <strong>Tujuan:</strong> {formData.tujuanRingkasDeskripsi}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <button
                onClick={() => setActiveTab('data_kokurikuler')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors backdrop-blur-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Data Kokurikuler
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau NISN siswa..."
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Batch Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleSetAllBSH}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors shadow-xs"
                title="Atur semua nilai siswa menjadi Berkembang Sesuai Harapan (BSH)"
              >
                <Check className="w-3.5 h-3.5" />
                Isi Semua BSH
              </button>

              <button
                onClick={handleRegenerateAllDescriptions}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 transition-colors shadow-xs"
                title="Bangkitkan ulang kalimat deskripsi rapor otomatis untuk seluruh siswa"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Ulang Deskripsi
              </button>

              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Ekspor Excel
              </button>

              <button
                onClick={() => setActiveTab('cetak')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                Cetak Lembar Nilai
              </button>
            </div>
          </div>

          {/* Assessment Spreadsheet Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[700px] custom-scrollbar">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 sticky top-0 z-20 shadow-xs">
                  {/* Top Header: Dimensi Groups */}
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th className="p-3 w-12 text-center font-black border-r border-slate-300 dark:border-slate-700" rowSpan={2}>
                      No
                    </th>
                    <th className="p-3 w-28 font-black border-r border-slate-300 dark:border-slate-700" rowSpan={2}>
                      NISN
                    </th>
                    <th className="p-3 min-w-[180px] font-black border-r border-slate-300 dark:border-slate-700" rowSpan={2}>
                      Nama Peserta Didik
                    </th>
                    {formData.mappings.map((mapping, mIdx) => {
                      const activeSubs = mapping.subdimensi.filter(s => s.trim());
                      if (activeSubs.length === 0) return null;
                      return (
                        <th
                          key={`map-head-${mapping.id || mIdx}`}
                          colSpan={activeSubs.length}
                          style={{ backgroundColor: mapping.warna || '#cfe2f3' }}
                          className="p-2.5 text-center font-black uppercase tracking-wider text-slate-900 border-r border-slate-400"
                        >
                          {mapping.dimensi}
                        </th>
                      );
                    })}
                    <th className="p-3 min-w-[320px] font-black text-center" rowSpan={2}>
                      Deskripsi Capaian Rapor (E-Rapor Kemendikdasmen)
                    </th>
                  </tr>

                  {/* Sub Header: Individual Subdimensions */}
                  <tr className="border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850">
                    {activeSubdimensiColumns.map((col, idx) => (
                      <th
                        key={`sub-col-head-${col.key}-${idx}`}
                        className="p-2 border-r border-slate-300 dark:border-slate-700 min-w-[130px] text-center font-bold text-[11px] text-slate-800 dark:text-slate-200"
                      >
                        <div className="line-clamp-2" title={col.subdimensi}>
                          {col.subIndex + 1}. {col.subdimensi}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4 + activeSubdimensiColumns.length}
                        className="p-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        Tidak ditemukan peserta didik dengan kata kunci "{searchStudent}".
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, sIdx) => {
                      const rec = getStudentAssessment(student.id);

                      return (
                        <tr
                          key={`student-row-${student.id}`}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Number */}
                          <td className="p-3 text-center font-mono font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                            {sIdx + 1}
                          </td>

                          {/* NISN */}
                          <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                            {student.nisn}
                          </td>

                          {/* Student Name */}
                          <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                            <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                              {student.nama}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{student.gender === 'P' || student.jenisKelamin === 'P' ? 'Perempuan' : 'Laki-laki'}</span>
                              <span>•</span>
                              <span>NIS: {student.nis || '-'}</span>
                            </div>
                          </td>

                          {/* Subdimension Score Selectors */}
                          {activeSubdimensiColumns.map((col, colIdx) => {
                            const currentVal: DPLPredikat =
                              rec.capaianPerDimensi?.[col.key]?.predikat ||
                              rec.capaianPerDimensi?.[col.legacyKey]?.predikat ||
                              'BSH';

                            return (
                              <td
                                key={`score-cell-${student.id}-${col.key}-${colIdx}`}
                                className="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle"
                              >
                                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                  {(['BB', 'MB', 'BSH', 'SB'] as DPLPredikat[]).map(pred => {
                                    const isSelected = currentVal === pred;
                                    let badgeColor = '';
                                    if (isSelected) {
                                      if (pred === 'SB') badgeColor = 'bg-blue-600 text-white font-black shadow-xs';
                                      else if (pred === 'BSH') badgeColor = 'bg-emerald-600 text-white font-black shadow-xs';
                                      else if (pred === 'MB') badgeColor = 'bg-amber-500 text-white font-black shadow-xs';
                                      else badgeColor = 'bg-rose-600 text-white font-black shadow-xs';
                                    } else {
                                      badgeColor = 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200';
                                    }

                                    return (
                                      <button
                                        key={pred}
                                        type="button"
                                        onClick={() => handleGradeChange(student.id, col.key, pred)}
                                        className={`px-1.5 py-1 text-[10px] rounded transition-all cursor-pointer ${badgeColor}`}
                                        title={`${pred === 'BB' ? 'Belum Berkembang' : pred === 'MB' ? 'Mulai Berkembang' : pred === 'BSH' ? 'Berkembang Sesuai Harapan' : 'Sangat Berkembang'}`}
                                      >
                                        {pred}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>
                            );
                          })}

                          {/* Description Textarea */}
                          <td className="p-2.5 align-top">
                            <div className="relative">
                              <textarea
                                rows={2}
                                value={rec.catatanProses || ''}
                                onChange={e => handleDescriptionChange(student.id, e.target.value)}
                                className="w-full text-[11px] p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-y leading-relaxed"
                              />
                              <button
                                onClick={() => {
                                  const refreshed = generateKemendikdasmenDescription(student.id, rec.capaianPerDimensi);
                                  handleDescriptionChange(student.id, refreshed);
                                  addToast('info', 'Deskripsi Disinkronkan', `Deskripsi ${student.nama} diperbarui.`);
                                }}
                                className="absolute right-2 top-2 p-1 bg-white/80 dark:bg-slate-700/80 hover:bg-purple-100 dark:hover:bg-purple-900 text-slate-500 hover:text-purple-600 rounded text-[10px] shadow-xs"
                                title="Reset & regenerasi deskripsi siswa ini"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 flex-wrap gap-2">
              <div>
                Menampilkan <strong>{filteredStudents.length}</strong> dari {students.length} peserta didik kelas {schoolInfo.className}.
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
                  <strong>BB:</strong> Belum Berkembang
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <strong>MB:</strong> Mulai Berkembang
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <strong>BSH:</strong> Berkembang Sesuai Harapan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <strong>SB:</strong> Sangat Berkembang
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CETAK LEMBAR PENILAIAN / RAPOR KOKURIKULER RESMI KEMENDIKDASMEN    */}
      {/* ========================================================================= */}
      {activeTab === 'cetak' && (
        <div className="space-y-6">
          {/* Action Bar for Printing */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-3 no-print">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pratinjau Dokumen Resmi Penilaian Kokurikuler
                </h3>
                <p className="text-xs text-slate-500">
                  Siap cetak menggunakan Kop Resmi SDN 006 SUNGAI BULUH standar Kemendikdasmen RI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('penilaian')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-black text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all"
              >
                <Printer className="w-4 h-4" />
                Cetak Dokumen (Ctrl+P)
              </button>
            </div>
          </div>

          {/* Printable Official Sheet */}
          <div className="bg-white text-black p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-md print:p-0 print:border-none print:shadow-none printable-document-sheet">
            {/* Kop Resmi Sekolah */}
            <HeaderKopSekolah
              documentTitle="LEMBAR ASESMEN KOKURIKULER & DIMENSI PROFIL LULUSAN"
              subTitle="KURIKULUM MERDEKA PEMBELAJARAN MENDALAM • FORMAT E-RAPOR KEMENDIKDASMEN RI"
            />

            {/* Identitas Program Kokurikuler */}
            <div className="my-4 p-3.5 border border-black rounded-lg print:rounded-none text-xs leading-relaxed">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                <div className="flex">
                  <span className="w-36 font-bold">Tema Kokurikuler</span>
                  <span className="mr-2">:</span>
                  <span className="font-extrabold uppercase">{formData.tema}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold">Kelas / Semester</span>
                  <span className="mr-2">:</span>
                  <span>{schoolInfo.className} / {schoolInfo.semester}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold">Nama Kegiatan</span>
                  <span className="mr-2">:</span>
                  <span className="font-bold">{formData.namaKegiatan}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold">Fase / Tahun Ajaran</span>
                  <span className="mr-2">:</span>
                  <span>{schoolInfo.phase} / {schoolInfo.academicYear}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold">Wali Kelas</span>
                  <span className="mr-2">:</span>
                  <span className="font-bold">{schoolInfo.homeroomTeacherName || 'Sri Wahyuni, S.Pd.'}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold">NIP Wali Kelas</span>
                  <span className="mr-2">:</span>
                  <span>{schoolInfo.homeroomTeacherNip || '-'}</span>
                </div>
                <div className="flex col-span-2">
                  <span className="w-36 font-bold shrink-0">Tujuan Ringkas</span>
                  <span className="mr-2">:</span>
                  <span className="italic">{formData.tujuanRingkasDeskripsi}</span>
                </div>
              </div>
            </div>

            {/* Tabel Penilaian Resmi */}
            <table className="w-full border-collapse border border-black text-[10.5px] mb-6">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-100 text-center font-bold">
                  <th className="border border-black p-1.5 w-8">No</th>
                  <th className="border border-black p-1.5 w-24">NISN</th>
                  <th className="border border-black p-1.5 text-left min-w-[150px]">Nama Peserta Didik</th>
                  {activeSubdimensiColumns.map((col, idx) => (
                    <th key={`print-th-${col.key}-${idx}`} className="border border-black p-1.5 w-20 text-[9.5px]">
                      <div>{col.dimensi}</div>
                      <div className="font-normal text-[8.5px] line-clamp-1">{col.subdimensi}</div>
                    </th>
                  ))}
                  <th className="border border-black p-1.5 text-left min-w-[240px]">Catatan Capaian / Deskripsi Rapor</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const rec = getStudentAssessment(student.id);

                  return (
                    <tr key={`print-row-${student.id}`} className="print-avoid-break">
                      <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                      <td className="border border-black p-1 text-center font-mono">{student.nisn}</td>
                      <td className="border border-black p-1.5 font-bold uppercase">{student.nama}</td>
                      {activeSubdimensiColumns.map((col, colIdx) => {
                        const pred = rec.capaianPerDimensi?.[col.key]?.predikat || rec.capaianPerDimensi?.[col.legacyKey]?.predikat || 'BSH';
                        return (
                          <td key={`print-td-${student.id}-${col.key}-${colIdx}`} className="border border-black p-1 text-center font-black">
                            {pred}
                          </td>
                        );
                      })}
                      <td className="border border-black p-1.5 text-[9.5px] leading-tight">
                        {rec.catatanProses || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Keterangan Predikat */}
            <div className="text-[10px] text-slate-700 mb-6 flex items-center gap-4 flex-wrap print:text-black">
              <span><strong>Keterangan Predikat:</strong></span>
              <span><strong>BB:</strong> Belum Berkembang</span>
              <span><strong>MB:</strong> Mulai Berkembang</span>
              <span><strong>BSH:</strong> Berkembang Sesuai Harapan</span>
              <span><strong>SB:</strong> Sangat Berkembang</span>
            </div>

            {/* Tanda Tangan Resmi */}
            <div className="grid grid-cols-2 gap-8 text-xs pt-4 print-avoid-break">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {schoolInfo.schoolName}</p>
                <div className="h-20"></div>
                <p className="font-bold underline uppercase">{schoolInfo.headmasterName}</p>
                <p>NIP. {schoolInfo.headmasterNip}</p>
              </div>

              <div className="text-center">
                <p>{schoolInfo.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold">Guru Kelas / Wali Kelas</p>
                <div className="h-20"></div>
                <p className="font-bold underline uppercase">{schoolInfo.homeroomTeacherName || 'Sri Wahyuni, S.Pd.'}</p>
                <p>NIP. {schoolInfo.homeroomTeacherNip || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH KEGIATAN KOKURIKULER BARU                                   */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isNewProjekModalOpen}
        onClose={() => setIsNewProjekModalOpen(false)}
        title="Tambah Kegiatan Kokurikuler Baru"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tema Kokurikuler
            </label>
            <select
              value={newProjekTema}
              onChange={e => setNewProjekTema(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="Hidup Sehat">Hidup Sehat (Gerakan 7KAIH / PHBS)</option>
              <option value="Gaya Hidup Berkelanjutan">Gaya Hidup Berkelanjutan (Lingkungan & Kompos)</option>
              <option value="Kearifan Lokal">Kearifan Lokal (Budaya & Tradisi Nusantara)</option>
              <option value="Bhinneka Tunggal Ika">Bhinneka Tunggal Ika</option>
              <option value="Bangunlah Jiwa dan Raganya">Bangunlah Jiwa dan Raganya</option>
              <option value="Rekayasa dan Teknologi">Rekayasa dan Teknologi</option>
              <option value="Kewirausahaan">Kewirausahaan</option>
              <option value="Suara Demokrasi">Suara Demokrasi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Kegiatan Kokurikuler
            </label>
            <input
              type="text"
              placeholder="Contoh: Gerakan 7KAIH / Senam Ceria"
              value={newProjekJudul}
              onChange={e => setNewProjekJudul(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsNewProjekModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleCreateNewProjek}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm"
            >
              Buat Kegiatan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
