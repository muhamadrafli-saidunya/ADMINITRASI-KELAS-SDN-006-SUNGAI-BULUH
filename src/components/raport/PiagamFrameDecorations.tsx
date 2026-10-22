import React from 'react';

export type PiagamBorderStyle =
  | 'royal_baroque'
  | 'batik_nusantara'
  | 'guilloche_security'
  | 'laurel_honor'
  | 'geometric_star'
  | 'art_deco_luxury'
  | 'celestial_stars'
  | 'vintage_scroll'
  | 'diplomatic_classic';

export type PiagamColorTheme =
  | 'gold'
  | 'navy'
  | 'emerald'
  | 'ruby'
  | 'violet'
  | 'monochrome';

export type PiagamSealType =
  | 'ribbon_medal'
  | 'wax_seal'
  | 'star_excellence'
  | 'tutwuri_crest'
  | 'none';

export interface FrameStyleOption {
  id: PiagamBorderStyle;
  name: string;
  tagline: string;
  category: 'Klasik & Kerajaan' | 'Tradisi Nusantara' | 'Resmi & Kedinasan' | 'Modern & Prestisius';
  recommendedColor: PiagamColorTheme;
}

export const FRAME_STYLE_OPTIONS: FrameStyleOption[] = [
  {
    id: 'royal_baroque',
    name: 'Ukiran Emas Kerajaan (Royal Baroque)',
    tagline: 'Bingkai ukiran daun acanthus keemasan mewah bergaya ijazah kehormatan kerajaan',
    category: 'Klasik & Kerajaan',
    recommendedColor: 'gold'
  },
  {
    id: 'batik_nusantara',
    name: 'Batik Parang & Kawung Nusantara',
    tagline: 'Ornamen batik warisan luhur Indonesia dengan sulur canting dan aksen emas resmi',
    category: 'Tradisi Nusantara',
    recommendedColor: 'navy'
  },
  {
    id: 'guilloche_security',
    name: 'Gelombang Guilloché Ijazah Negara',
    tagline: 'Garis roset sekuriti matematis presisi tinggi standar ijazah & sertifikat nasional',
    category: 'Resmi & Kedinasan',
    recommendedColor: 'navy'
  },
  {
    id: 'laurel_honor',
    name: 'Karangan Daun Kemenangan (Laurel Wreath)',
    tagline: 'Daun laurel kejayaan olimpiade dengan pita akademik kehormatan juara',
    category: 'Modern & Prestisius',
    recommendedColor: 'emerald'
  },
  {
    id: 'geometric_star',
    name: 'Bintang Prestasi & Arabesque 8 Arah',
    tagline: 'Pola geometris bintang delapan (Rub el Hizb) simpul anyaman islami nan anggun',
    category: 'Tradisi Nusantara',
    recommendedColor: 'emerald'
  },
  {
    id: 'art_deco_luxury',
    name: 'Art Deco Luxury (Gatsby Gold)',
    tagline: 'Sudut geometris bertingkat (stepped corner) modern mewah beraksen chevron emas',
    category: 'Modern & Prestisius',
    recommendedColor: 'gold'
  },
  {
    id: 'celestial_stars',
    name: 'Rasi Bintang Kehormatan (Celestial Stars)',
    tagline: 'Sudut miring berhiaskan bintang kejora kemilau modern untuk siswa berprestasi',
    category: 'Modern & Prestisius',
    recommendedColor: 'violet'
  },
  {
    id: 'vintage_scroll',
    name: 'Renda Daun Victorian Kuno (Vintage Ornate)',
    tagline: 'Garis ganda dengan lekukan renda klasik dan titik-titik mutiara antik',
    category: 'Klasik & Kerajaan',
    recommendedColor: 'ruby'
  },
  {
    id: 'diplomatic_classic',
    name: 'Klasik Diplomatik (Greek Key Meander)',
    tagline: 'Garis tegas triple-border berornamen meander klasik formal dan hemat tinta cetak',
    category: 'Resmi & Kedinasan',
    recommendedColor: 'monochrome'
  }
];

export interface ColorThemeOption {
  id: PiagamColorTheme;
  name: string;
  primary: string;
  gold: string;
  bgLight: string;
  badgeBg: string;
  borderOuter: string;
  borderInner: string;
  titleColor: string;
  ribbonColor: string;
  accentText: string;
}

export const COLOR_THEME_OPTIONS: ColorThemeOption[] = [
  {
    id: 'gold',
    name: 'Royal Gold (Emas Kemewahan)',
    primary: '#92400e',
    gold: '#b45309',
    bgLight: 'from-amber-50/50 via-white to-yellow-50/40',
    badgeBg: 'from-amber-800 via-amber-900 to-yellow-950',
    borderOuter: 'border-[#92400e]',
    borderInner: 'border-[#b45309]',
    titleColor: '#854d0e',
    ribbonColor: '#b45309',
    accentText: 'text-amber-950'
  },
  {
    id: 'navy',
    name: 'Biru Dongker Kemendikbud & Emas',
    primary: '#1e3a8a',
    gold: '#b45309',
    bgLight: 'from-blue-50/40 via-white to-amber-50/30',
    badgeBg: 'from-blue-900 to-indigo-950',
    borderOuter: 'border-[#1e3a8a]',
    borderInner: 'border-[#b45309]',
    titleColor: '#1e3a8a',
    ribbonColor: '#b45309',
    accentText: 'text-blue-950'
  },
  {
    id: 'emerald',
    name: 'Hijau Zamrud Prestasi & Emas',
    primary: '#065f46',
    gold: '#d97706',
    bgLight: 'from-emerald-50/40 via-white to-amber-50/30',
    badgeBg: 'from-emerald-900 to-teal-950',
    borderOuter: 'border-[#065f46]',
    borderInner: 'border-[#d97706]',
    titleColor: '#065f46',
    ribbonColor: '#d97706',
    accentText: 'text-emerald-950'
  },
  {
    id: 'ruby',
    name: 'Merah Marun Mulia & Perunggu',
    primary: '#991b1b',
    gold: '#b45309',
    bgLight: 'from-rose-50/40 via-white to-amber-50/30',
    badgeBg: 'from-rose-900 to-red-950',
    borderOuter: 'border-[#991b1b]',
    borderInner: 'border-[#b45309]',
    titleColor: '#991b1b',
    ribbonColor: '#b45309',
    accentText: 'text-rose-950'
  },
  {
    id: 'violet',
    name: 'Ungu Keagungan & Emas Murni',
    primary: '#581c87',
    gold: '#d97706',
    bgLight: 'from-purple-50/40 via-white to-amber-50/30',
    badgeBg: 'from-purple-900 to-indigo-950',
    borderOuter: 'border-[#581c87]',
    borderInner: 'border-[#d97706]',
    titleColor: '#581c87',
    ribbonColor: '#d97706',
    accentText: 'text-purple-950'
  },
  {
    id: 'monochrome',
    name: 'Hitam Diplomatik Resmi (Hemat Tinta)',
    primary: '#0f172a',
    gold: '#475569',
    bgLight: 'from-slate-50 via-white to-slate-50',
    badgeBg: 'from-slate-800 to-slate-950',
    borderOuter: 'border-slate-900',
    borderInner: 'border-slate-600',
    titleColor: '#0f172a',
    ribbonColor: '#475569',
    accentText: 'text-slate-950'
  }
];

export function getColorTheme(themeId: PiagamColorTheme): ColorThemeOption {
  return COLOR_THEME_OPTIONS.find(t => t.id === themeId) || COLOR_THEME_OPTIONS[0];
}

// ===============================================================================
// KOMPONEN RENDER BINGKAI PIAGAM (LENGKAP SEMUA 9 MODEL BINGKAI)
// ===============================================================================

interface PiagamFrameDecoratorProps {
  style: PiagamBorderStyle;
  colorTheme: PiagamColorTheme;
}

export const PiagamFrameDecorator: React.FC<PiagamFrameDecoratorProps> = ({
  style,
  colorTheme
}) => {
  const theme = getColorTheme(colorTheme);

  switch (style) {
    case 'batik_nusantara':
      return <BatikNusantaraFrame theme={theme} />;
    case 'guilloche_security':
      return <GuillocheSecurityFrame theme={theme} />;
    case 'laurel_honor':
      return <LaurelHonorFrame theme={theme} />;
    case 'geometric_star':
      return <GeometricStarFrame theme={theme} />;
    case 'art_deco_luxury':
      return <ArtDecoLuxuryFrame theme={theme} />;
    case 'celestial_stars':
      return <CelestialStarsFrame theme={theme} />;
    case 'vintage_scroll':
      return <VintageScrollFrame theme={theme} />;
    case 'diplomatic_classic':
      return <DiplomaticClassicFrame theme={theme} />;
    case 'royal_baroque':
    default:
      return <RoyalBaroqueFrame theme={theme} />;
  }
};

// -------------------------------------------------------------------------------
// 1. MODEL: ROYAL BAROQUE (Ukiran Emas Kerajaan)
// -------------------------------------------------------------------------------
const RoyalBaroqueFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      {/* Garis Dalam Ganda dengan Sudut Inset */}
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.gold }}
      />
      <div
        className="absolute inset-3.5 sm:inset-4.5 border pointer-events-none"
        style={{ borderColor: theme.primary, opacity: 0.7 }}
      />
      <div
        className="absolute inset-5 sm:inset-6 border border-dashed pointer-events-none"
        style={{ borderColor: theme.gold, opacity: 0.55 }}
      />

      {/* Ornamen 4 Sudut Baroque Filigree */}
      <CornerBaroque position="top-left" theme={theme} />
      <CornerBaroque position="top-right" theme={theme} />
      <CornerBaroque position="bottom-left" theme={theme} />
      <CornerBaroque position="bottom-right" theme={theme} />

      {/* Ornamen Tengah Atas & Bawah */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 pointer-events-none">
        <svg viewBox="0 0 120 20" className="w-24 sm:w-28 h-5" fill="none">
          <path d="M60 2 L65 10 L75 10 L67 15 L70 24 L60 18 L50 24 L53 15 L45 10 L55 10 Z" fill={theme.gold} />
          <path d="M10 10 Q 35 15, 48 10" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M110 10 Q 85 15, 72 10" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="2" fill={theme.gold} />
          <circle cx="110" cy="10" r="2" fill={theme.gold} />
        </svg>
      </div>
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none">
        <svg viewBox="0 0 120 20" className="w-24 sm:w-28 h-5 scale-y-[-1]" fill="none">
          <path d="M60 2 L65 10 L75 10 L67 15 L70 24 L60 18 L50 24 L53 15 L45 10 L55 10 Z" fill={theme.gold} />
          <path d="M10 10 Q 35 15, 48 10" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M110 10 Q 85 15, 72 10" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="2" fill={theme.gold} />
          <circle cx="110" cy="10" r="2" fill={theme.gold} />
        </svg>
      </div>
    </>
  );
};

const CornerBaroque: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        {/* Sudut luar tebal ganda */}
        <path d="M4 4 L92 4 L92 10 L12 10 C10.9 10 10 10.9 10 12 L10 92 L4 92 Z" fill={theme.primary} />
        <path d="M6 6 L88 6 L88 8 L12 8 L12 88 L6 88 Z" fill={theme.gold} />

        {/* Sulur Acanthus Klasik */}
        <path
          d="M20 20 C20 12, 38 10, 44 20 C48 26, 42 34, 34 34 C26 34, 22 26, 28 20 C32 16, 38 18, 38 22"
          stroke={theme.gold}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M20 20 C12 20, 10 38, 20 44 C26 48, 34 42, 34 34 C34 26, 26 22, 20 28 C16 32, 18 38, 22 38"
          stroke={theme.gold}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Rosette Pusat Sudut */}
        <circle cx="22" cy="22" r="5" fill={theme.gold} />
        <circle cx="22" cy="22" r="2.5" fill="white" />
        {/* Daun Mahkota Sudut */}
        <path d="M48 12 L56 20 L48 28 L40 20 Z" fill={theme.primary} />
        <path d="M12 48 L20 56 L28 48 L20 40 Z" fill={theme.primary} />
        <circle cx="70" cy="8" r="2.5" fill={theme.gold} />
        <circle cx="8" cy="70" r="2.5" fill={theme.gold} />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 2. MODEL: BATIK NUSANTARA (Parang & Kawung Tradisional)
// -------------------------------------------------------------------------------
const BatikNusantaraFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-3.5 sm:inset-4.5 border border-dashed pointer-events-none"
        style={{ borderColor: theme.gold, opacity: 0.8 }}
      />
      <div
        className="absolute inset-5 sm:inset-6 border pointer-events-none"
        style={{ borderColor: theme.primary, opacity: 0.4 }}
      />

      <CornerBatik position="top-left" theme={theme} />
      <CornerBatik position="top-right" theme={theme} />
      <CornerBatik position="bottom-left" theme={theme} />
      <CornerBatik position="bottom-right" theme={theme} />

      {/* Pola Tepi Songket Batik Samping Atas & Bawah */}
      <div className="absolute top-2 left-24 right-24 h-1.5 border-b border-dotted pointer-events-none opacity-50" style={{ borderColor: theme.gold }} />
      <div className="absolute bottom-2 left-24 right-24 h-1.5 border-t border-dotted pointer-events-none opacity-50" style={{ borderColor: theme.gold }} />
    </>
  );
};

const CornerBatik: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        {/* Sudut Canting Luar */}
        <path d="M4 4 H92 V14 H22 C17.5 14 14 17.5 14 22 V92 H4 V4 Z" fill={theme.primary} />
        <path d="M6 6 H88 V10 H20 C14.5 10 10 14.5 10 20 V88 H6 V6 Z" fill={theme.gold} />

        {/* Motif Bunga Kawung Pusat */}
        <circle cx="30" cy="30" r="9" stroke={theme.gold} strokeWidth="2" fill="white" />
        <circle cx="30" cy="30" r="4.5" fill={theme.primary} />

        {/* Daun Sulur Batik Meliuk */}
        <path d="M30 21 C30 13 40 9 50 11 C48 20 40 28 30 28 Z" fill={theme.gold} />
        <path d="M21 30 C13 30 9 40 11 50 C20 48 28 40 28 30 Z" fill={theme.gold} />
        <path d="M36 36 C46 44 58 46 68 42 C70 32 58 24 36 36 Z" fill={theme.primary} opacity="0.85" />
        <circle cx="62" cy="18" r="3" fill={theme.gold} />
        <circle cx="18" cy="62" r="3" fill={theme.gold} />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 3. MODEL: GUILLOCHE SECURITY (Roset Sekuriti Ijazah Resmi)
// -------------------------------------------------------------------------------
const GuillocheSecurityFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-3 sm:inset-4 border pointer-events-none"
        style={{ borderColor: theme.gold }}
      />
      {/* Wave pattern effect on outer edge */}
      <div
        className="absolute inset-4.5 sm:inset-5.5 border-2 border-double pointer-events-none"
        style={{ borderColor: theme.primary, opacity: 0.7 }}
      />

      <CornerGuilloche position="top-left" theme={theme} />
      <CornerGuilloche position="top-right" theme={theme} />
      <CornerGuilloche position="bottom-left" theme={theme} />
      <CornerGuilloche position="bottom-right" theme={theme} />
    </>
  );
};

const CornerGuilloche: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        {/* Sudut bertingkat bevel */}
        <polygon points="4,4 92,4 82,14 14,14 14,82 4,92" fill={theme.primary} />
        <polygon points="8,8 86,8 80,14 14,14 14,80 8,86" fill={theme.gold} opacity="0.8" />

        {/* Guilloche Curves Intersecting */}
        <path d="M18 18 Q 45 35, 75 18" stroke={theme.gold} strokeWidth="1.5" fill="none" />
        <path d="M18 18 Q 35 45, 18 75" stroke={theme.gold} strokeWidth="1.5" fill="none" />
        <path d="M22 22 Q 45 42, 70 22" stroke={theme.primary} strokeWidth="1.2" fill="none" />
        <path d="M22 22 Q 42 45, 22 70" stroke={theme.primary} strokeWidth="1.2" fill="none" />

        {/* Rosette Bintang 8 arah Pusat Sudut */}
        <g transform="translate(32, 32)">
          <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" fill={theme.gold} />
          <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill={theme.primary} />
          <circle cx="0" cy="0" r="2" fill="white" />
        </g>
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 4. MODEL: LAUREL HONOR (Karangan Daun Kemenangan)
// -------------------------------------------------------------------------------
const LaurelHonorFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-3.5 sm:inset-4.5 border pointer-events-none"
        style={{ borderColor: theme.gold, opacity: 0.8 }}
      />
      <div
        className="absolute inset-5 sm:inset-6 border border-dashed pointer-events-none"
        style={{ borderColor: theme.primary, opacity: 0.4 }}
      />

      <CornerLaurel position="top-left" theme={theme} />
      <CornerLaurel position="top-right" theme={theme} />
      <CornerLaurel position="bottom-left" theme={theme} />
      <CornerLaurel position="bottom-right" theme={theme} />
    </>
  );
};

const CornerLaurel: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-22 h-22 sm:w-26 sm:h-26 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        <path d="M4 4 L94 4 L94 10 L10 10 L10 94 L4 94 Z" fill={theme.primary} />
        <path d="M6 6 L88 6 L88 8 L8 8 L8 88 L6 88 Z" fill={theme.gold} />

        {/* Rangkaian Daun Laurel Melengkung */}
        {/* Cabang melingkar */}
        <path d="M18 18 Q 50 20, 68 45" stroke={theme.gold} strokeWidth="2" strokeLinecap="round" />
        <path d="M18 18 Q 20 50, 45 68" stroke={theme.gold} strokeWidth="2" strokeLinecap="round" />

        {/* Pasangan Daun Laurel Emas */}
        <ellipse cx="26" cy="22" rx="4" ry="2" transform="rotate(-30 26 22)" fill={theme.gold} />
        <ellipse cx="36" cy="24" rx="4.5" ry="2.2" transform="rotate(-20 36 24)" fill={theme.primary} />
        <ellipse cx="46" cy="28" rx="5" ry="2.5" transform="rotate(-5 46 28)" fill={theme.gold} />
        <ellipse cx="56" cy="36" rx="5" ry="2.5" transform="rotate(20 56 36)" fill={theme.primary} />

        <ellipse cx="22" cy="26" rx="4" ry="2" transform="rotate(-60 22 26)" fill={theme.gold} />
        <ellipse cx="24" cy="36" rx="4.5" ry="2.2" transform="rotate(-70 24 36)" fill={theme.primary} />
        <ellipse cx="28" cy="46" rx="5" ry="2.5" transform="rotate(-85 28 46)" fill={theme.gold} />
        <ellipse cx="36" cy="56" rx="5" ry="2.5" transform="rotate(-110 36 56)" fill={theme.primary} />

        {/* Pita Pengikat di Pangkal Sudut */}
        <circle cx="18" cy="18" r="4" fill={theme.gold} />
        <path d="M14 16 L8 22 L12 26 L18 20" fill={theme.primary} />
        <path d="M16 14 L22 8 L26 12 L20 18" fill={theme.primary} />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 5. MODEL: GEOMETRIC STAR (Bintang Prestasi 8 Arah & Simpul Arabesque)
// -------------------------------------------------------------------------------
const GeometricStarFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-4 sm:inset-5 border pointer-events-none"
        style={{ borderColor: theme.gold }}
      />
      <div
        className="absolute inset-5.5 sm:inset-6.5 border pointer-events-none"
        style={{ borderColor: theme.primary, opacity: 0.5 }}
      />

      <CornerGeoStar position="top-left" theme={theme} />
      <CornerGeoStar position="top-right" theme={theme} />
      <CornerGeoStar position="bottom-left" theme={theme} />
      <CornerGeoStar position="bottom-right" theme={theme} />
    </>
  );
};

const CornerGeoStar: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        <path d="M4 4 H92 V12 H18 C14 12 12 14 12 18 V92 H4 V4 Z" fill={theme.primary} />
        <path d="M8 8 H86 V10 H16 C12.5 10 10 12.5 10 16 V86 H8 V8 Z" fill={theme.gold} />

        {/* Bintang Geometris Rub el Hizb (Dua Persegi Berputar 45 Derajat) */}
        <g transform="translate(36, 36)">
          <rect x="-14" y="-14" width="28" height="28" fill={theme.gold} stroke={theme.primary} strokeWidth="1.5" />
          <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" fill={theme.primary} stroke={theme.gold} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" fill={theme.gold} />
          <circle cx="0" cy="0" r="3" fill="white" />
        </g>

        {/* Simpul Jalinan Geometris Sudut */}
        <polygon points="68,12 76,20 68,28 60,20" fill={theme.gold} />
        <polygon points="12,68 20,76 28,68 20,60" fill={theme.gold} />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 6. MODEL: ART DECO LUXURY (Gatsby Gold Stepped Corners)
// -------------------------------------------------------------------------------
const ArtDecoLuxuryFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.gold }}
      />
      <div
        className="absolute inset-3.5 sm:inset-4.5 border pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-5 sm:inset-6 border pointer-events-none"
        style={{ borderColor: theme.gold, opacity: 0.6 }}
      />

      <CornerArtDeco position="top-left" theme={theme} />
      <CornerArtDeco position="top-right" theme={theme} />
      <CornerArtDeco position="bottom-left" theme={theme} />
      <CornerArtDeco position="bottom-right" theme={theme} />
    </>
  );
};

const CornerArtDeco: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        {/* Sudut Bertingkat Art Deco (Stepped Brackets) */}
        <polygon points="4,4 92,4 92,10 18,10 18,92 12,92 12,18 4,18" fill={theme.primary} />
        <polygon points="12,12 84,12 84,16 24,16 24,84 20,84 20,24 12,24" fill={theme.gold} />
        <polygon points="20,20 76,20 76,24 30,24 30,76 26,76 26,30 20,30" fill={theme.primary} />

        {/* Diamond Chevron Center */}
        <polygon points="48,32 58,42 48,52 38,42" fill={theme.gold} />
        <polygon points="48,36 54,42 48,48 42,42" fill={theme.primary} />
        <polygon points="48,40 50,42 48,44 46,42" fill="white" />
        <circle cx="70" cy="14" r="2.5" fill={theme.gold} />
        <circle cx="14" cy="70" r="2.5" fill={theme.gold} />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 7. MODEL: CELESTIAL STARS (Rasi Bintang & Lencana Modern)
// -------------------------------------------------------------------------------
const CelestialStarsFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-3.5 sm:inset-4.5 border pointer-events-none"
        style={{ borderColor: theme.gold }}
      />
      <div
        className="absolute inset-5 sm:inset-6 border border-dotted pointer-events-none"
        style={{ borderColor: theme.primary, opacity: 0.6 }}
      />

      <CornerCelestial position="top-left" theme={theme} />
      <CornerCelestial position="top-right" theme={theme} />
      <CornerCelestial position="bottom-left" theme={theme} />
      <CornerCelestial position="bottom-right" theme={theme} />
    </>
  );
};

const CornerCelestial: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        {/* Sudut Miring Faceted */}
        <path d="M4 24 L24 4 L92 4 L92 10 L28 10 L10 28 L10 92 L4 92 Z" fill={theme.primary} />
        <path d="M8 26 L26 8 L88 8 L88 10 L28 10 L10 28 L10 88 L8 88 Z" fill={theme.gold} />

        {/* Bintang Kejora 4 Poin Kemilau */}
        <g transform="translate(34, 34)">
          <path d="M0 -14 Q 2 -2, 14 0 Q 2 2, 0 14 Q -2 2, -14 0 Q -2 -2, 0 -14 Z" fill={theme.gold} />
          <path d="M0 -9 Q 1 -1, 9 0 Q 1 1, 0 9 Q -1 1, -9 0 Q -1 -1, 0 -9 Z" fill={theme.primary} />
          <circle cx="0" cy="0" r="2.5" fill="white" />
        </g>

        {/* Bintang-bintang kecil pendamping */}
        <circle cx="64" cy="18" r="2.5" fill={theme.gold} />
        <circle cx="18" cy="64" r="2.5" fill={theme.gold} />
        <circle cx="50" cy="10" r="1.5" fill={theme.primary} />
        <circle cx="10" cy="50" r="1.5" fill={theme.primary} />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 8. MODEL: VINTAGE SCROLL (Renda Daun Victorian Kuno)
// -------------------------------------------------------------------------------
const VintageScrollFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      <div
        className="absolute inset-2 sm:inset-3 border-2 border-double pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-4 sm:inset-5 border border-dashed pointer-events-none"
        style={{ borderColor: theme.gold, opacity: 0.8 }}
      />

      <CornerVintage position="top-left" theme={theme} />
      <CornerVintage position="top-right" theme={theme} />
      <CornerVintage position="bottom-left" theme={theme} />
      <CornerVintage position="bottom-right" theme={theme} />
    </>
  );
};

const CornerVintage: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        <path d="M4 4 Q 48 4, 92 4 L 92 10 Q 48 10, 10 10 L 10 92 L 4 92 Z" fill={theme.primary} />
        {/* Renda bunga mawar antik */}
        <circle cx="34" cy="34" r="10" stroke={theme.gold} strokeWidth="2" fill="white" />
        <circle cx="34" cy="22" r="3.5" fill={theme.primary} />
        <circle cx="34" cy="46" r="3.5" fill={theme.primary} />
        <circle cx="22" cy="34" r="3.5" fill={theme.primary} />
        <circle cx="46" cy="34" r="3.5" fill={theme.primary} />
        <circle cx="34" cy="34" r="2.5" fill={theme.gold} />
        {/* Garis lengkung sulur vintage */}
        <path d="M18 18 Q 34 8, 50 18" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 18 Q 8 34, 18 50" stroke={theme.gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------------------------
// 9. MODEL: DIPLOMATIC CLASSIC (Greek Key Meander Diplomat)
// -------------------------------------------------------------------------------
const DiplomaticClassicFrame: React.FC<{ theme: ColorThemeOption }> = ({ theme }) => {
  return (
    <>
      {/* Bingkai Triple Border Tajam */}
      <div
        className="absolute inset-2 sm:inset-3 border-2 pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div
        className="absolute inset-3.5 sm:inset-4.5 border pointer-events-none"
        style={{ borderColor: theme.gold }}
      />
      <div
        className="absolute inset-5 sm:inset-6 border pointer-events-none"
        style={{ borderColor: theme.primary, opacity: 0.6 }}
      />

      <CornerDiplomatic position="top-left" theme={theme} />
      <CornerDiplomatic position="top-right" theme={theme} />
      <CornerDiplomatic position="bottom-left" theme={theme} />
      <CornerDiplomatic position="bottom-right" theme={theme} />
    </>
  );
};

const CornerDiplomatic: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  theme: ColorThemeOption;
}> = ({ position, theme }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransform()} w-20 h-20 sm:w-24 sm:h-24 pointer-events-none select-none z-10`}>
      <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
        {/* Greek Key Meander Pattern */}
        <path
          d="M4 4 H92 V12 H24 V36 H40 V24 H30 V20 H44 V40 H20 V8 H88 V6 H8 V88 H40 V44 H36 V38 H44 V92 H4 Z"
          fill={theme.primary}
        />
        <rect x="22" y="22" width="6" height="6" fill={theme.gold} />
        <rect x="54" y="8" width="4" height="4" fill={theme.gold} />
        <rect x="8" y="54" width="4" height="4" fill={theme.gold} />
      </svg>
    </div>
  );
};

// ===============================================================================
// KOMPONEN LENCANA & STEMPEL EMAS PIAGAM (PREMIUM SEALS & BADGES)
// ===============================================================================

interface PiagamSealProps {
  sealType: PiagamSealType;
  theme: ColorThemeOption;
  academicYear: string;
}

export const PiagamSealDecorator: React.FC<PiagamSealProps> = ({
  sealType,
  theme,
  academicYear
}) => {
  if (sealType === 'none') return null;

  if (sealType === 'ribbon_medal') {
    return (
      <div className="flex flex-col items-center justify-center pb-1 relative">
        {/* Pita Menjuntai Emas & Warna Tema */}
        <div className="absolute -bottom-2 flex items-center justify-center gap-1 pointer-events-none">
          <div className="w-3.5 h-6 bg-gradient-to-b from-amber-600 to-amber-800 -rotate-12 shadow-xs" style={{ backgroundColor: theme.gold }} />
          <div className="w-3.5 h-6 bg-gradient-to-b from-amber-600 to-amber-800 rotate-12 shadow-xs" style={{ backgroundColor: theme.gold }} />
        </div>

        {/* Lingkaran Medali Emas Bergerigi */}
        <div
          className="w-18 h-18 rounded-full border-2 flex flex-col items-center justify-center p-1 relative shadow-md z-10"
          style={{
            borderColor: theme.gold,
            background: `radial-gradient(circle, #fffbeb 0%, #fef3c7 70%, #fde68a 100%)`
          }}
        >
          <div className="w-15 h-15 rounded-full border border-dashed flex flex-col items-center justify-center" style={{ borderColor: theme.gold }}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill={theme.gold}>
              <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1l-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z" />
            </svg>
            <span className="text-[7.5px] font-black uppercase tracking-wider text-amber-900 mt-0.5" style={{ color: theme.primary }}>
              TERBAIK
            </span>
            <span className="text-[6.5px] font-bold text-amber-800 font-mono">
              {academicYear}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (sealType === 'wax_seal') {
    return (
      <div className="flex flex-col items-center justify-center pb-1">
        <div
          className="w-18 h-18 rounded-full border-2 flex flex-col items-center justify-center p-1 relative shadow-inner"
          style={{
            borderColor: theme.gold,
            backgroundColor: `${theme.gold}20`
          }}
        >
          <div className="w-15 h-15 rounded-full border-2 border-double flex flex-col items-center justify-center" style={{ borderColor: theme.gold }}>
            <span className="text-[8px] font-black uppercase tracking-widest text-amber-950" style={{ color: theme.primary }}>
              ★ RESMI ★
            </span>
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-900 my-0.5" style={{ color: theme.gold }}>
              BERPRESTASI
            </span>
            <span className="text-[6.5px] font-bold text-slate-700 font-mono">
              {academicYear}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (sealType === 'star_excellence') {
    return (
      <div className="flex flex-col items-center justify-center pb-1">
        <div
          className="w-18 h-18 rounded-full border-2 flex flex-col items-center justify-center p-1 relative shadow-sm"
          style={{
            borderColor: theme.primary,
            background: `radial-gradient(circle, #ffffff 40%, ${theme.gold}20 100%)`
          }}
        >
          <svg viewBox="0 0 40 40" className="w-7 h-7" fill={theme.gold}>
            <polygon points="20,2 25,14 38,14 27,22 31,34 20,27 9,34 13,22 2,14 15,14" />
          </svg>
          <span className="text-[7px] font-black uppercase tracking-wider text-slate-800 mt-0.5">
            EXCELLENCE
          </span>
          <span className="text-[6.5px] font-bold text-slate-600 font-mono">
            {academicYear}
          </span>
        </div>
      </div>
    );
  }

  if (sealType === 'tutwuri_crest') {
    return (
      <div className="flex flex-col items-center justify-center pb-1">
        <div
          className="w-18 h-18 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1 relative shadow-xs"
          style={{
            borderColor: theme.primary,
            backgroundColor: `${theme.primary}10`
          }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={theme.primary} strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
          <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-900 mt-0.5">
            KEMENDIKBUD
          </span>
          <span className="text-[6.5px] font-bold text-slate-700 font-mono">
            KMPM SD
          </span>
        </div>
      </div>
    );
  }

  return null;
};
