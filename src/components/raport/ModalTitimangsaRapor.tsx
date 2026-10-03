import React, { useState } from 'react';
import { Calendar, CheckCircle2, Users, Sparkles, X, Info, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ModalTitimangsaRaporProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalTitimangsaRapor: React.FC<ModalTitimangsaRaporProps> = ({
  isOpen,
  onClose
}) => {
  const { schoolInfo, students, updateGlobalReportDate } = useApp();

  const currentCity = schoolInfo.city || 'Kota Jakarta Selatan';
  const defaultSemesterDate = schoolInfo.tanggalRapor || (schoolInfo.semester?.includes('2')
    ? `${currentCity}, 20 Juni 2027`
    : `${currentCity}, 19 Desember 2026`);
  const defaultMidDate = schoolInfo.tanggalRaporMid || (schoolInfo.semester?.includes('2')
    ? `${currentCity}, 28 Maret 2027`
    : `${currentCity}, 10 Oktober 2026`);

  const [tanggalSemester, setTanggalSemester] = useState<string>(defaultSemesterDate);
  const [tanggalMid, setTanggalMid] = useState<string>(defaultMidDate);

  if (!isOpen) return null;

  // Format today in Indonesian: e.g. "Kota Jakarta Selatan, 21 September 2026"
  const getTodayFormatted = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const now = new Date();
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `${currentCity}, ${day} ${month} ${year}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalReportDate('both', tanggalSemester.trim(), tanggalMid.trim());
    onClose();
  };

  return (
    <div
      id="modal-titimangsa-rapor-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="modal-titimangsa-rapor-container"
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Penanggalan / Titimangsa Rapor
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                  <Users className="h-3 w-3" />
                  Semua Siswa
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tanggal pengesahan yang akan dicetak pada seluruh lembar rapor kelas {schoolInfo.className}
              </p>
            </div>
          </div>
          <button
            id="btn-close-modal-titimangsa"
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Information Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 text-xs text-blue-900 dark:text-blue-200">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Pemberitahuan Otomatis</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Mengubah penanggalan di sini akan otomatis <strong>berlaku serentak untuk seluruh {students.length} siswa</strong> di kelas ini. Anda tidak perlu mengedit satu per satu lembar rapor siswa.
              </p>
            </div>
          </div>

          {/* SECTION 1: RAPOR AKHIR SEMESTER (SAS) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-bold">1</span>
                <span>Rapor Akhir Semester (SAS / Kenaikan Kelas)</span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Mode: {schoolInfo.semester}
              </span>
            </div>

            <div>
              <input
                id="input-tanggal-rapor-semester"
                type="text"
                value={tanggalSemester}
                onChange={e => setTanggalSemester(e.target.value)}
                placeholder={`Contoh: ${currentCity}, 20 Juni 2027`}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                Format umum: <code>[Tempat/Kota], [Tanggal] [Bulan] [Tahun]</code>
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pilihan Cepat Kalender Pendidikan:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setTanggalSemester(`${currentCity}, 20 Juni 2027`)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Akhir Smt 2 (20 Juni 2027)
                </button>
                <button
                  type="button"
                  onClick={() => setTanggalSemester(`${currentCity}, 19 Desember 2026`)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Akhir Smt 1 (19 Des 2026)
                </button>
                <button
                  type="button"
                  onClick={() => setTanggalSemester(getTodayFormatted())}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Hari Ini
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: RAPOR MID SEMESTER (ASTS) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[11px] font-bold">2</span>
                <span>Rapor Tengah Semester (ASTS)</span>
              </label>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Asesmen Sumatif Tengah Semester
              </span>
            </div>

            <div>
              <input
                id="input-tanggal-rapor-mid"
                type="text"
                value={tanggalMid}
                onChange={e => setTanggalMid(e.target.value)}
                placeholder={`Contoh: ${currentCity}, 10 Oktober 2026`}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none transition-all"
              />
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                Format umum: <code>[Tempat/Kota], [Tanggal] [Bulan] [Tahun]</code>
              </p>
            </div>

            {/* Quick Preset Buttons Mid */}
            <div className="pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pilihan Cepat Kalender Pendidikan:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setTanggalMid(`${currentCity}, 28 Maret 2027`)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Mid Smt 2 (28 Maret 2027)
                </button>
                <button
                  type="button"
                  onClick={() => setTanggalMid(`${currentCity}, 10 Oktober 2026`)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Mid Smt 1 (10 Okt 2026)
                </button>
                <button
                  type="button"
                  onClick={() => setTanggalMid(getTodayFormatted())}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Hari Ini
                </button>
              </div>
            </div>
          </div>

          {/* Penandatangan Verification */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-[11px] text-slate-600 dark:text-slate-400 flex flex-col gap-1 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span>Wali Kelas:</span>
              <strong className="text-slate-800 dark:text-slate-200">{schoolInfo.homeroomTeacherName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Kepala Sekolah:</span>
              <strong className="text-slate-800 dark:text-slate-200">{schoolInfo.headmasterName}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              id="btn-submit-titimangsa-semua-siswa"
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simpan & Terapkan ke Semua Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
