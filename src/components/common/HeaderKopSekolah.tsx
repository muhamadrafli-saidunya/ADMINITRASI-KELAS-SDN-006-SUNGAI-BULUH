import React from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolLogoRenderer } from './SchoolLogoRenderer';

interface HeaderKopSekolahProps {
  documentTitle?: string;
  subTitle?: string;
  hideBorder?: boolean;
  className?: string;
  equalizeLogos?: boolean;
  logoSize?: number;
}

export const HeaderKopSekolah: React.FC<HeaderKopSekolahProps> = ({
  documentTitle,
  subTitle,
  hideBorder = false,
  className = '',
  equalizeLogos = true,
  logoSize
}) => {
  const { schoolInfo } = useApp();

  const showLeft = schoolInfo.showLogoLeft !== false;
  const showRight = schoolInfo.showLogoRight !== false;
  
  // Ukuran dasar logo kiri dan kanan dari data sekolah
  const rawLeftWidth = schoolInfo.logoLeftWidth || 72;
  const rawRightWidth = schoolInfo.logoRightWidth || 72;

  // Samakan ukuran logo kiri dan kanan agar kop surat resmi berimbang, presisi, dan simetris
  const uniformSize = logoSize
    ? logoSize
    : (showLeft && showRight)
      ? Math.max(rawLeftWidth, rawRightWidth)
      : (rawLeftWidth || rawRightWidth || 72);

  // Batasi dalam rentang proporsional kop A4/F4 resmi
  const finalSize = Math.max(56, Math.min(uniformSize, 88));

  const leftWidth = equalizeLogos ? finalSize : rawLeftWidth;
  const rightWidth = equalizeLogos ? finalSize : rawRightWidth;

  const headerLine1 = schoolInfo.kopLine1 || 'PEMERINTAH KABUPATEN KUANTAN SINGINGI';
  const headerLine2 = schoolInfo.kopLine2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';

  const getBorderClass = () => {
    if (hideBorder) return '';
    const style = schoolInfo.kopBorderStyle || 'double';
    switch (style) {
      case 'double':
        return 'border-b-4 border-double border-slate-900 dark:border-slate-300 pb-3.5';
      case 'solid':
        return 'border-b-2 border-slate-900 dark:border-slate-300 pb-3.5';
      case 'dashed':
        return 'border-b-2 border-dashed border-slate-700 dark:border-slate-400 pb-3.5';
      case 'none':
        return 'pb-2';
      default:
        return 'border-b-4 border-double border-slate-900 dark:border-slate-300 pb-3.5';
    }
  };

  return (
    <div className={`mb-6 print:mb-2 pb-2 print:pb-1 text-center text-black print:text-black ${getBorderClass()} ${className}`}>
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
          {showLeft ? (
            <SchoolLogoRenderer
              preset={schoolInfo.logoLeftPreset || 'tutwuri'}
              customUrl={schoolInfo.logoLeft}
              width={leftWidth}
              alt="Logo Kiri Kop"
            />
          ) : (
            <div style={{ width: `${leftWidth}px`, height: `${leftWidth}px` }} className="print:block" />
          )}
        </div>

        {/* Text Header Kop Sekolah */}
        <div className="flex-1 text-center px-1 sm:px-2 min-w-0">
          {headerLine1 && (
            <h3 className="text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider text-black print:text-black leading-snug">
              {headerLine1}
            </h3>
          )}
          {headerLine2 && (
            <h3 className="text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider text-black print:text-black leading-snug">
              {headerLine2}
            </h3>
          )}
          <h1 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-blue-900 print:text-black leading-tight my-0.5">
            {schoolInfo.schoolName}
          </h1>
          <p className="text-[9.5px] sm:text-xs text-slate-700 print:text-black leading-tight">
            {schoolInfo.address}
            {schoolInfo.village ? `, Desa/Kel. ${schoolInfo.village}` : ''}
            {schoolInfo.subdistrict ? `, Kec. ${schoolInfo.subdistrict}` : ''}
            {schoolInfo.city ? `, ${schoolInfo.city}` : ''}
            {schoolInfo.postalCode ? `, Kode Pos ${schoolInfo.postalCode}` : ''}
          </p>
          <p className="text-[9px] sm:text-xs text-slate-700 print:text-black leading-tight mt-0.5">
            NPSN: <span className="font-semibold text-black print:text-black">{schoolInfo.npsn}</span> | Telp: {schoolInfo.phoneNumber} | Email: {schoolInfo.email}
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
          {showRight ? (
            <SchoolLogoRenderer
              preset={schoolInfo.logoRightPreset || 'merdeka'}
              customUrl={schoolInfo.logoRight}
              width={rightWidth}
              alt="Logo Kanan Kop"
            />
          ) : (
            <div style={{ width: `${rightWidth}px`, height: `${rightWidth}px` }} className="print:block" />
          )}
        </div>
      </div>

      {documentTitle && (
        <div className="mt-4 print:mt-2 border-t border-slate-300 print:border-black pt-3 print:pt-1.5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 print:text-black underline underline-offset-4">
            {documentTitle}
          </h2>
          {subTitle && (
            <p className="mt-0.5 text-xs font-medium text-slate-600 print:text-black">
              {subTitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
