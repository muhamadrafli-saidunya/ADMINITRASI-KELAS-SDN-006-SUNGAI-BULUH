import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { Printer, Download, BookOpen, Layers } from 'lucide-react';

interface PrintJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintJadwalModal: React.FC<PrintJadwalModalProps> = ({ isOpen, onClose }) => {
  const { schedule, subjects, schoolInfo } = useApp();
  const printAreaRef = useRef<HTMLDivElement>(null);
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pratinjau Cetak Jadwal Pelajaran Resmi"
      maxWidth="5xl"
    >
      <div className="space-y-4">
        {/* Print Action Bar */}
        <div className="no-print flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Format cetak standar A4 lanskap dengan kop sekolah dan tanda tangan resmi.
          </p>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/30 hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        {/* Printable Document Sheet */}
        <div
          ref={printAreaRef}
          id="printable-official-document"
          className="printable-document-sheet p-6 sm:p-8 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6 print:m-0 print:w-full"
        >
          {/* Official Kop Sekolah */}
          <HeaderKopSekolah
            documentTitle={`JADWAL PELAJARAN KELAS ${schoolInfo.className.toUpperCase()}`}
            subTitle={`TAHUN AJARAN ${schoolInfo.academicYear} - SEMESTER ${schoolInfo.semester.toUpperCase()}`}
          />

          {/* Timetable Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-900">
                  <th className="border border-slate-300 p-2 text-center w-12 font-bold">JP</th>
                  <th className="border border-slate-300 p-2 text-center w-24 font-bold">Waktu</th>
                  {daysOfWeek.map((day) => (
                    <th key={`th-day-${day}`} className="border border-slate-300 p-2 text-center font-bold">
                      Hari {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((jamKe) => {
                  return (
                    <tr key={`print-row-jam-${jamKe}`} className={jamKe % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                      <td className="border border-slate-300 p-2 text-center font-black bg-slate-100/70">
                        {jamKe}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-[11px] text-slate-600">
                        {(() => {
                          const anyItem = schedule.find(s => s.jamKe === jamKe);
                          return anyItem ? anyItem.waktu : `${(7 + Math.floor((jamKe - 1) * 35 / 60)).toString().padStart(2, '0')}:${(((jamKe - 1) * 35) % 60).toString().padStart(2, '0')}`;
                        })()}
                      </td>

                      {daysOfWeek.map((day) => {
                        const item = schedule.find(s => s.hari === day && s.jamKe === jamKe);
                        if (!item) {
                          return (
                            <td key={`cell-${day}-${jamKe}`} className="border border-slate-300 p-2 text-center text-slate-400 italic text-[11px]">
                              -
                            </td>
                          );
                        }

                        const sub = subjects.find(s => s.id === item.mapelId);
                        return (
                          <td key={`cell-${day}-${jamKe}`} className="border border-slate-300 p-2 align-top space-y-0.5">
                            <p className="font-bold text-slate-900 text-xs">
                              {sub?.nama || 'Upacara / Pembiasaan'}
                            </p>
                            <p className="text-[10px] text-slate-600 leading-tight">
                              {item.guruPengampu}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {item.ruang}
                            </p>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Daftar Kode Mata Pelajaran Legend */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Keterangan Mata Pelajaran & Alokasi Guru:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              {subjects.map((sub) => (
                <div key={`legend-${sub.id}`} className="flex items-center gap-1.5 p-1.5 rounded border border-slate-200">
                  <span className="font-mono font-bold bg-slate-100 px-1 py-0.5 rounded text-[10px]">
                    {sub.kode}
                  </span>
                  <div className="min-w-0 truncate">
                    <p className="font-bold truncate">{sub.nama}</p>
                    <p className="text-[10px] text-slate-500 truncate">{sub.guruPengampu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs page-break-inside-avoid">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Sekolah {schoolInfo.schoolName}</p>
              <div className="h-16" />
              <p className="font-bold underline">{schoolInfo.headmasterName}</p>
              <p className="text-[11px] text-slate-500">NIP. {schoolInfo.headmasterNip}</p>
            </div>

            <div>
              <p>{schoolInfo.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold">Guru Kelas {schoolInfo.className}</p>
              <div className="h-16" />
              <p className="font-bold underline">{schoolInfo.homeroomTeacherName}</p>
              <p className="text-[11px] text-slate-500">NIP. {schoolInfo.homeroomTeacherNip}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
