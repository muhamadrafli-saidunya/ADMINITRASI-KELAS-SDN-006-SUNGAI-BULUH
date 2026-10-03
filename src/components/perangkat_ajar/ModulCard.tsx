import React from 'react';
import { ModulAjar } from '../../types';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Star,
  Printer,
  FileText,
  Copy,
  Edit,
  Trash2,
  Share2,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ModulCardProps {
  modul: ModulAjar;
  onView: (modul: ModulAjar) => void;
  onEdit: (modul: ModulAjar) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onPrintLKPD: (modul: ModulAjar) => void;
}

export const ModulCard: React.FC<ModulCardProps> = ({
  modul,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onPrintLKPD
}) => {
  const getFaseBadgeColor = (fase: string) => {
    switch (fase) {
      case 'Fase A':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Fase B':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'Fase C':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getMapelBadgeColor = (mapel: string) => {
    const m = mapel.toLowerCase();
    if (m.includes('ipas') || m.includes('alam')) {
      return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800';
    }
    if (m.includes('matematika')) {
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    }
    if (m.includes('indonesia')) {
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
    }
    if (m.includes('pancasila') || m.includes('ppkn')) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    }
    if (m.includes('agama') || m.includes('pai')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    }
    if (m.includes('p5') || m.includes('projek')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700">
      {/* Top Banner & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getFaseBadgeColor(modul.fase)}`}>
              {modul.fase} • Kelas {modul.kelas}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getMapelBadgeColor(modul.mataPelajaran)}`}>
              {modul.mapelKode || modul.mataPelajaran}
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
              {modul.kodeModul}
            </span>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(modul.id)}
            title={modul.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}
            className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-1"
          >
            <Star className={`h-4 w-4 ${modul.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Judul Modul */}
        <h3
          onClick={() => onView(modul)}
          className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors line-clamp-2 leading-snug"
        >
          {modul.judul}
        </h3>

        {/* Ringkasan CP / TP Snippet */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {modul.tujuanPembelajaran?.[0] || modul.capaianPembelajaran}
        </p>

        {/* Profil Pelajar Pancasila Chips */}
        <div className="mt-3 flex flex-wrap gap-1">
          {modul.profilPelajarPancasila?.slice(0, 2).map((p, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium"
            >
              <Sparkles className="h-2.5 w-2.5 text-indigo-500" />
              {p.split('(')[0].trim()}
            </span>
          ))}
          {(modul.profilPelajarPancasila?.length || 0) > 2 && (
            <span className="text-[10px] text-slate-400 font-medium self-center">
              +{(modul.profilPelajarPancasila?.length || 0) - 2} dimensi
            </span>
          )}
        </div>
      </div>

      {/* Meta Info & Alokasi Waktu */}
      <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate max-w-[130px]">{modul.alokasiWaktu}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate max-w-[120px] font-medium text-slate-700 dark:text-slate-300">
            {modul.penyusun.split(',')[0]}
          </span>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-3.5 flex items-center justify-between gap-2 bg-white dark:bg-slate-900">
        <button
          onClick={() => onView(modul)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Lihat & Cetak</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPrintLKPD(modul)}
            title="Cetak Lembar Kerja Siswa (LKPD)"
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDuplicate(modul.id)}
            title="Duplikat Modul Ajar"
            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(modul)}
            title="Edit Modul Ajar"
            className="p-2 rounded-xl text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(modul.id)}
            title="Hapus Modul"
            className="p-2 rounded-xl text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
