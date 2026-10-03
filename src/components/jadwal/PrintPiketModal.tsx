import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { Printer, Crown } from 'lucide-react';

interface PrintPiketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintPiketModal: React.FC<PrintPiketModalProps> = ({ isOpen, onClose }) => {
  const { cleaningDuties, students, schoolInfo } = useApp();
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pratinjau Cetak Poster Regu Piket Kebersihan"
      maxWidth="5xl"
    >
      <div className="space-y-4">
        {/* Action Bar */}
        <div className="no-print flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Format poster dinding resmi untuk ditempel di papan pengumuman kelas.
          </p>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/30 hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Poster Piket</span>
          </button>
        </div>

        {/* Printable Poster */}
        <div
          ref={printAreaRef}
          id="printable-official-document"
          className="printable-document-sheet p-6 sm:p-8 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6 print:m-0 print:w-full"
        >
          {/* Official Kop Sekolah */}
          <HeaderKopSekolah
            documentTitle={`JADWAL REGU PIKET KEBERSIHAN KELAS ${schoolInfo.className.toUpperCase()}`}
            subTitle={`TAHUN AJARAN ${schoolInfo.academicYear} - ${schoolInfo.schoolName.toUpperCase()}`}
          />

          {/* Grid Piket Hari */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {cleaningDuties.map((duty, idx) => {
              return (
                <div
                  key={`print-duty-card-${duty.hari}-${idx}`}
                  className="rounded-xl border-2 border-slate-800 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="bg-slate-900 text-white py-1.5 px-3 rounded-lg text-center font-black text-sm uppercase tracking-wider mb-3">
                      HARI {duty.hari}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {duty.siswaIds.map((sId, sIdx) => {
                        const student = students.find(s => s.id === sId);
                        if (!student) return null;
                        const isKetua = duty.ketuaPiket === student.nama;

                        return (
                          <div
                            key={`print-duty-member-${sId}-${sIdx}`}
                            className={`flex items-center justify-between p-1.5 rounded ${
                              isKetua ? 'bg-amber-100 font-bold' : 'bg-slate-50'
                            }`}
                          >
                            <span className="truncate">
                              {sIdx + 1}. {student.nama}
                            </span>
                            {isKetua && (
                              <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-black">
                                KETUA
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {duty.areaTugas && duty.areaTugas.length > 0 && (
                    <div className="pt-2 border-t border-slate-300 text-[10px] text-slate-600">
                      <strong>Fokus:</strong> {duty.areaTugas.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs page-break-inside-avoid">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Sekolah</p>
              <div className="h-16" />
              <p className="font-bold underline">{schoolInfo.headmasterName}</p>
              <p className="text-[11px] text-slate-500">NIP. {schoolInfo.headmasterNip}</p>
            </div>

            <div>
              <p>{schoolInfo.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold">Wali Kelas {schoolInfo.className}</p>
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
