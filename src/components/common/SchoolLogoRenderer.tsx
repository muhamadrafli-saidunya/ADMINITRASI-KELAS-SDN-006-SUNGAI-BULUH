import React from 'react';

export interface LogoPresetItem {
  id: string;
  name: string;
  category: 'Kementerian & Lembaga' | 'Pemerintah Daerah' | 'Sekolah & Organisasi' | 'Kustom';
  description: string;
  previewBg?: string;
}

export const LOGO_PRESETS: LogoPresetItem[] = [
  {
    id: 'tutwuri',
    name: 'Tut Wuri Handayani (Kemendikbud)',
    category: 'Kementerian & Lembaga',
    description: 'Logo resmi Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    previewBg: 'bg-blue-900'
  },
  {
    id: 'kemdikbud',
    name: 'Kemendikbudristek RI',
    category: 'Kementerian & Lembaga',
    description: 'Lambang Resmi Garuda & Buku Pendidikan Nasional',
    previewBg: 'bg-blue-950'
  },
  {
    id: 'kemenag',
    name: 'Kementerian Agama (Kemenag RI)',
    category: 'Kementerian & Lembaga',
    description: 'Lambang Ikhlas Beramal untuk MI, MTs, MA, atau Sekolah Terpadu',
    previewBg: 'bg-emerald-800'
  },
  {
    id: 'garuda',
    name: 'Garuda Pancasila',
    category: 'Kementerian & Lembaga',
    description: 'Lambang Negara Republik Indonesia - Bhinneka Tunggal Ika',
    previewBg: 'bg-amber-600'
  },
  {
    id: 'pemda_dki',
    name: 'Pemerintah Provinsi DKI Jakarta',
    category: 'Pemerintah Daerah',
    description: 'Lambang Jaya Raya dengan Monumen Nasional & Padi Kapas',
    previewBg: 'bg-blue-800'
  },
  {
    id: 'pemda_jabar',
    name: 'Pemerintah Provinsi Jawa Barat',
    category: 'Pemerintah Daerah',
    description: 'Lambang Gemah Ripah Repeh Rapih dengan Senjata Kujang',
    previewBg: 'bg-emerald-900'
  },
  {
    id: 'pemda_jateng',
    name: 'Pemerintah Provinsi Jawa Tengah',
    category: 'Pemerintah Daerah',
    description: 'Lambang Prasetya Ulah Sakti dengan Candi Borobudur',
    previewBg: 'bg-teal-900'
  },
  {
    id: 'pemda_jatim',
    name: 'Pemerintah Provinsi Jawa Timur',
    category: 'Pemerintah Daerah',
    description: 'Lambang Jer Basuki Mawa Beya dengan Tugu Pahlawan',
    previewBg: 'bg-sky-900'
  },
  {
    id: 'sd_nasional',
    name: 'Logo Sekolah Dasar (SD)',
    category: 'Sekolah & Organisasi',
    description: 'Lambang Resmi Peserta Didik SD Merah Putih',
    previewBg: 'bg-red-700'
  },
  {
    id: 'merdeka',
    name: 'Kurikulum Merdeka / Kampus Mengajar',
    category: 'Sekolah & Organisasi',
    description: 'Lambang Transformasi Pendidikan Merdeka Belajar',
    previewBg: 'bg-orange-600'
  },
  {
    id: 'pramuka',
    name: 'Gerakan Pramuka (Tunas Kelapa)',
    category: 'Sekolah & Organisasi',
    description: 'Lambang Kepanduan Indonesia Tunas Kelapa Emas',
    previewBg: 'bg-amber-800'
  },
  {
    id: 'uks',
    name: 'UKS & Dokter Kecil',
    category: 'Sekolah & Organisasi',
    description: 'Lambang Usaha Kesehatan Sekolah & Trias UKS',
    previewBg: 'bg-rose-700'
  },
  {
    id: 'adiwiyata',
    name: 'Sekolah Adiwiyata',
    category: 'Sekolah & Organisasi',
    description: 'Lambang Peduli & Berbudaya Lingkungan Hidup di Sekolah',
    previewBg: 'bg-emerald-700'
  }
];

interface SchoolLogoRendererProps {
  preset?: string;
  customUrl?: string;
  width?: number;
  alt?: string;
  className?: string;
}

export const SchoolLogoRenderer: React.FC<SchoolLogoRendererProps> = ({
  preset = 'tutwuri',
  customUrl,
  width = 72,
  alt = 'Logo Sekolah',
  className = ''
}) => {
  // If custom URL is provided (base64 or http URL), render the image
  if (customUrl && customUrl.trim() !== '') {
    return (
      <div
        className={`flex items-center justify-center shrink-0 overflow-hidden aspect-square kop-logo-box ${className}`}
        style={{
          width: `${width}px`,
          height: `${width}px`,
          minWidth: `${width}px`,
          minHeight: `${width}px`,
          maxWidth: `${width}px`,
          maxHeight: `${width}px`
        }}
      >
        <img
          src={customUrl}
          alt={alt}
          className="w-full h-full object-contain p-0.5"
          style={{
            maxWidth: `${width}px`,
            maxHeight: `${width}px`,
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            // fallback if broken image URL
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Render Preset SVGs with exact square dimensions
  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${width}px`,
    minWidth: `${width}px`,
    minHeight: `${width}px`,
    maxWidth: `${width}px`,
    maxHeight: `${width}px`
  };

  switch (preset) {
    case 'tutwuri':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-blue-900 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Tut Wuri Handayani"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
            {/* Outer circle border */}
            <circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#fef08a" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="2,2" />
            
            {/* Sayap Kiri & Kanan */}
            <path
              d="M50 30 C32 30 18 42 16 62 C26 62 36 54 42 46 C40 56 46 68 50 72 C54 68 60 56 58 46 C64 54 74 62 84 62 C82 42 68 30 50 30 Z"
              fill="#fbbf24"
            />
            {/* Nyala Api / Obor Belajar */}
            <path
              d="M50 18 C46 24 44 28 47 34 C49 32 50 30 50 30 C50 30 51 32 53 34 C56 28 54 24 50 18 Z"
              fill="#ef4444"
            />
            {/* Buku Terbuka */}
            <path
              d="M32 72 Q50 68 50 74 Q50 68 68 72 L66 78 Q50 74 50 80 Q50 74 34 78 Z"
              fill="#ffffff"
            />
            {/* Belcong / Gagang Obor */}
            <rect x="48" y="34" width="4" height="34" rx="2" fill="#d97706" />

            {/* Tulisan Tut Wuri Handayani */}
            <text x="50" y="88" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#fef08a" letterSpacing="0.8">
              TUT WURI HANDAYANI
            </text>
          </svg>
        </div>
      );

    case 'kemdikbud':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Kemendikbudristek"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="50,15 58,32 76,32 62,44 67,61 50,51 33,61 38,44 24,32 42,32" fill="#fbbf24" />
            <circle cx="50" cy="42" r="10" fill="#0284c7" />
            {/* Buku dan Obor */}
            <path d="M30 68 Q50 63 50 70 Q50 63 70 68 L68 76 Q50 70 50 78 Q50 70 32 76 Z" fill="#ffffff" />
            <text x="50" y="88" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#38bdf8">
              KEMENDIKBUD
            </text>
          </svg>
        </div>
      );

    case 'kemenag':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Kementerian Agama RI"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#065f46" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="40" fill="#047857" />
            {/* 5 Sinar / Bintang */}
            <polygon points="50,18 53,28 63,28 55,34 58,44 50,38 42,44 45,34 37,28 47,28" fill="#fbbf24" />
            {/* Kitab Suci Terbuka */}
            <path d="M28 56 Q50 50 50 57 Q50 50 72 56 L70 66 Q50 60 50 68 Q50 60 30 66 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="0.5" />
            {/* Pita Ikhlas Beramal */}
            <rect x="25" y="72" width="50" height="9" rx="3" fill="#fbbf24" />
            <text x="50" y="78.5" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#065f46">
              IKHLAS BERAMAL
            </text>
            <text x="50" y="89" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#fef08a">
              KEMENAG RI
            </text>
          </svg>
        </div>
      );

    case 'garuda':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Garuda Pancasila"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#b45309" stroke="#fef08a" strokeWidth="2" />
            {/* Kepala Garuda & Mahkota */}
            <path d="M50 20 Q56 16 62 22 Q54 26 50 28 Q46 26 38 22 Q44 16 50 20 Z" fill="#fef08a" />
            {/* Sayap Garuda Kiri-Kanan */}
            <path d="M50 30 C30 25 15 38 18 64 C28 58 38 52 44 46 C42 56 46 64 50 68 C54 64 58 56 56 46 C62 52 72 58 82 64 C85 38 70 25 50 30 Z" fill="#facc15" />
            {/* Perisai 5 Sila */}
            <path d="M40 38 L60 38 L60 52 C60 60 50 66 50 66 C50 66 40 60 40 52 Z" fill="#dc2626" stroke="#fef08a" strokeWidth="1.5" />
            <polygon points="50,42 52,47 57,47 53,50 55,55 50,52 45,55 47,50 43,47 48,47" fill="#fef08a" />
            {/* Pita Bhinneka Tunggal Ika */}
            <rect x="22" y="74" width="56" height="9" rx="2" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
            <text x="50" y="80.5" textAnchor="middle" fontSize="4.5" fontWeight="900" fill="#b45309" letterSpacing="0.2">
              BHINNEKA TUNGGAL IKA
            </text>
          </svg>
        </div>
      );

    case 'pemda_dki':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-2xl bg-blue-800 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Pemprov DKI Jakarta"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Perisai Segilima */}
            <polygon points="50,8 90,26 80,82 50,94 20,82 10,26" fill="#1e40af" stroke="#facc15" strokeWidth="2.5" />
            {/* Monas */}
            <path d="M48 30 L52 30 L53 58 L57 66 L43 66 L47 58 Z" fill="#ffffff" />
            {/* Lidah Api Emas */}
            <polygon points="50,22 53,28 47,28" fill="#f59e0b" />
            {/* Padi Kapas & Ombak */}
            <path d="M30 68 Q50 60 70 68 Q50 74 30 68 Z" fill="#38bdf8" />
            {/* Tulisan Jaya Raya */}
            <rect x="28" y="74" width="44" height="8" rx="2" fill="#facc15" />
            <text x="50" y="80" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#1e3a8a">
              JAYA RAYA
            </text>
          </svg>
        </div>
      );

    case 'pemda_jabar':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-2xl bg-emerald-900 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Pemprov Jawa Barat"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,28 82,84 50,94 18,84 8,28" fill="#064e3b" stroke="#facc15" strokeWidth="2.5" />
            {/* Kujang Pusaka */}
            <path d="M48 24 Q56 22 56 34 Q50 44 54 58 L46 58 Q48 44 44 34 Z" fill="#facc15" />
            {/* Gunung & Bendungan */}
            <polygon points="28,66 50,48 72,66" fill="#047857" />
            <text x="50" y="82" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#facc15">
              JAWA BARAT
            </text>
          </svg>
        </div>
      );

    case 'pemda_jateng':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-2xl bg-teal-900 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Pemprov Jawa Tengah"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,28 82,84 50,94 18,84 8,28" fill="#134e4a" stroke="#facc15" strokeWidth="2.5" />
            {/* Candi Borobudur silhouette */}
            <polygon points="50,30 54,38 64,48 72,60 28,60 36,48 46,38" fill="#facc15" />
            <circle cx="50" cy="24" r="5" fill="#ef4444" stroke="#facc15" strokeWidth="1" />
            <text x="50" y="80" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#facc15">
              JAWA TENGAH
            </text>
          </svg>
        </div>
      );

    case 'pemda_jatim':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-2xl bg-sky-900 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Pemprov Jawa Timur"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,28 82,84 50,94 18,84 8,28" fill="#0c4a6e" stroke="#facc15" strokeWidth="2.5" />
            {/* Tugu Pahlawan */}
            <polygon points="48,22 52,22 54,62 46,62" fill="#ffffff" />
            {/* Bintang & Gunung */}
            <polygon points="50,14 52,18 56,18 53,21 54,25 50,23 46,25 47,21 44,18 48,18" fill="#facc15" />
            <text x="50" y="80" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#facc15">
              JAWA TIMUR
            </text>
          </svg>
        </div>
      );

    case 'sd_nasional':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Sekolah Dasar"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#b91c1c" stroke="#ffffff" strokeWidth="3" />
            {/* Badge SD */}
            <circle cx="50" cy="50" r="38" fill="#991b1b" />
            <text x="50" y="52" textAnchor="middle" fontSize="28" fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
              SD
            </text>
            <text x="50" y="74" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fef08a" letterSpacing="1">
              INDONESIA
            </text>
          </svg>
        </div>
      );

    case 'merdeka':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-orange-600 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Kurikulum Merdeka"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#ea580c" stroke="#fed7aa" strokeWidth="2.5" />
            {/* Daun / Api Inspirasi Dinamis */}
            <path d="M50 20 C65 24 76 40 70 60 C64 74 48 80 34 72 C22 64 24 46 36 34 C44 26 48 22 50 20 Z" fill="#ffffff" />
            <path d="M52 32 C60 36 66 46 62 58 C58 66 48 70 40 66 C32 60 34 48 42 40 C48 34 50 32 52 32 Z" fill="#0284c7" />
            <text x="50" y="88" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff" letterSpacing="0.5">
              MERDEKA BELAJAR
            </text>
          </svg>
        </div>
      );

    case 'pramuka':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-amber-900 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Gerakan Pramuka"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#78350f" stroke="#fef08a" strokeWidth="2.5" />
            {/* Tunas Kelapa */}
            <path
              d="M50 22 C52 30 56 38 64 46 C60 48 56 46 54 44 C54 56 58 66 62 74 L38 74 C42 66 46 56 46 44 C44 46 40 48 36 46 C44 38 48 30 50 22 Z"
              fill="#fbbf24"
            />
            <circle cx="50" cy="74" r="8" fill="#fbbf24" />
            <text x="50" y="90" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#fef08a">
              PRAMUKA
            </text>
          </svg>
        </div>
      );

    case 'uks':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-rose-700 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Usaha Kesehatan Sekolah"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#be123c" stroke="#ffffff" strokeWidth="2.5" />
            {/* Palang Merah */}
            <rect x="42" y="24" width="16" height="44" rx="3" fill="#ffffff" />
            <rect x="28" y="38" width="44" height="16" rx="3" fill="#ffffff" />
            <text x="50" y="85" textAnchor="middle" fontSize="8" fontWeight="900" fill="#ffffff">
              UKS
            </text>
          </svg>
        </div>
      );

    case 'adiwiyata':
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm p-1 print:border print:border-black ${className}`}
          title="Sekolah Adiwiyata"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#047857" stroke="#a7f3d0" strokeWidth="2.5" />
            {/* Daun Hijau & Bumi */}
            <circle cx="50" cy="50" r="22" fill="#0284c7" />
            <path d="M50 20 C64 30 70 50 56 68 C46 54 48 34 50 20 Z" fill="#4ade80" />
            <path d="M50 30 C40 40 36 54 44 68 C52 56 50 40 50 30 Z" fill="#86efac" />
            <text x="50" y="87" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#fef08a">
              ADIWIYATA
            </text>
          </svg>
        </div>
      );

    case 'custom':
      // If custom logo preset without an uploaded image, render a neat subtle placeholder
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-400 p-1 print:border-none ${className}`}
          title="Logo Kustom (Belum Diunggah)"
        >
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">LOGO</span>
        </div>
      );

    default:
      // Generic school crest
      return (
        <div
          style={style}
          className={`flex shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-sm p-2 print:border print:border-black ${className}`}
          title="Logo Sekolah"
        >
          <div className="text-center font-serif text-[10px] font-bold leading-tight">
            <span className="block text-[8px] tracking-wider text-amber-300">SEKOLAH</span>
            <span className="text-xs tracking-wider font-extrabold text-white">DASAR</span>
            <span className="block text-[8px] text-amber-200">NEGERI</span>
          </div>
        </div>
      );
  }
};
