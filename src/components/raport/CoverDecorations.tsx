import React from 'react';

export type CoverBorderStyle =
  | 'classic'
  | 'batik_nusantara'
  | 'certificate_royal'
  | 'geometric_art'
  | 'vintage_ornate'
  | 'minimal_clean';

export type CoverBorderColor = 'monochrome' | 'navy' | 'gold' | 'emerald';

interface CoverFrameDecoratorProps {
  style: CoverBorderStyle;
  colorTheme?: CoverBorderColor;
}

export const getBorderColorClasses = (theme: CoverBorderColor | string = 'monochrome') => {
  switch (theme) {
    case 'navy':
      return {
        border: 'border-[#1e3a8a] print:border-[#1e3a8a]',
        stroke: '#1e3a8a',
        fill: '#1e3a8a',
        accentBg: 'bg-blue-50/50',
        text: 'text-[#1e3a8a]'
      };
    case 'gold':
      return {
        border: 'border-[#92400e] print:border-[#92400e]',
        stroke: '#92400e',
        fill: '#92400e',
        accentBg: 'bg-amber-50/50',
        text: 'text-[#92400e]'
      };
    case 'emerald':
      return {
        border: 'border-[#065f46] print:border-[#065f46]',
        stroke: '#065f46',
        fill: '#065f46',
        accentBg: 'bg-emerald-50/50',
        text: 'text-[#065f46]'
      };
    case 'monochrome':
    default:
      return {
        border: 'border-slate-900 print:border-black',
        stroke: '#0f172a',
        fill: '#0f172a',
        accentBg: 'bg-slate-50/50',
        text: 'text-slate-900'
      };
  }
};

export const CoverFrameDecorator: React.FC<CoverFrameDecoratorProps> = ({
  style,
  colorTheme = 'monochrome'
}) => {
  const color = getBorderColorClasses(colorTheme);

  if (style === 'minimal_clean') {
    return (
      <div className="absolute inset-2 sm:inset-3 border border-slate-300 print:border-slate-400 pointer-events-none rounded-sm">
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: color.stroke }} />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: color.stroke }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: color.stroke }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: color.stroke }} />
      </div>
    );
  }

  if (style === 'classic') {
    return (
      <div className="absolute inset-3 sm:inset-4 border border-dashed opacity-70 pointer-events-none" style={{ borderColor: color.stroke }}>
        {/* Sudut Geometris Klasik */}
        <div className="absolute -top-3 -left-3 w-6 h-6 border-2" style={{ borderColor: color.stroke, backgroundColor: 'white' }}>
          <div className="w-full h-full p-0.5 flex items-center justify-center">
            <div className="w-2 h-2" style={{ backgroundColor: color.stroke }} />
          </div>
        </div>
        <div className="absolute -top-3 -right-3 w-6 h-6 border-2" style={{ borderColor: color.stroke, backgroundColor: 'white' }}>
          <div className="w-full h-full p-0.5 flex items-center justify-center">
            <div className="w-2 h-2" style={{ backgroundColor: color.stroke }} />
          </div>
        </div>
        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-2" style={{ borderColor: color.stroke, backgroundColor: 'white' }}>
          <div className="w-full h-full p-0.5 flex items-center justify-center">
            <div className="w-2 h-2" style={{ backgroundColor: color.stroke }} />
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-2" style={{ borderColor: color.stroke, backgroundColor: 'white' }}>
          <div className="w-full h-full p-0.5 flex items-center justify-center">
            <div className="w-2 h-2" style={{ backgroundColor: color.stroke }} />
          </div>
        </div>
      </div>
    );
  }

  if (style === 'batik_nusantara') {
    // Sudut Ornamen Batik Motif Ukir Nusantara Tradisional
    const BatikCorner = ({ className }: { className?: string }) => (
      <svg
        viewBox="0 0 80 80"
        className={`w-16 h-16 sm:w-20 sm:h-20 absolute pointer-events-none ${className || ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4H76V16H24C19.5817 16 16 19.5817 16 24V76H4V4Z"
          fill={color.stroke}
          fillOpacity="0.15"
        />
        <path
          d="M2 2H78V8H18C12.4772 8 8 12.4772 8 18V78H2V2Z"
          fill={color.stroke}
        />
        {/* Motif Bunga / Kawung Tengah Sudut */}
        <circle cx="28" cy="28" r="7" stroke={color.stroke} strokeWidth="2" fill="white" />
        <circle cx="28" cy="28" r="3.5" fill={color.stroke} />
        {/* Daun Ukir Melengkung */}
        <path
          d="M28 21C28 15 36 12 44 12C44 20 37 28 28 28Z"
          fill={color.stroke}
        />
        <path
          d="M21 28C15 28 12 36 12 44C20 44 28 37 28 28Z"
          fill={color.stroke}
        />
        <path
          d="M33 33C40 40 52 42 60 40C62 30 50 24 33 33Z"
          fill={color.stroke}
          fillOpacity="0.75"
        />
        <circle cx="56" cy="18" r="3" fill={color.stroke} />
        <circle cx="18" cy="56" r="3" fill={color.stroke} />
      </svg>
    );

    return (
      <>
        {/* Garis Dalam Berpola */}
        <div className="absolute inset-4 sm:inset-5 border border-dashed pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.6 }} />
        <div className="absolute inset-6 sm:inset-7 border pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.4 }} />
        
        {/* 4 Sudut Motif Batik */}
        <BatikCorner className="top-1 left-1" />
        <BatikCorner className="top-1 right-1 -scale-x-100" />
        <BatikCorner className="bottom-1 left-1 -scale-y-100" />
        <BatikCorner className="bottom-1 right-1 -scale-x-100 -scale-y-100" />
      </>
    );
  }

  if (style === 'certificate_royal') {
    // Ornamen Sudut Piagam Formal / Ijazah Kerajaan (Baroque Filigree)
    const RoyalCorner = ({ className }: { className?: string }) => (
      <svg
        viewBox="0 0 100 100"
        className={`w-20 h-20 sm:w-24 sm:h-24 absolute pointer-events-none ${className || ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Garis Sudut Utama */}
        <path d="M4 4 L96 4 L96 12 L16 12 C13.79 12 12 13.79 12 16 L12 96 L4 96 Z" fill={color.stroke} />
        <path d="M8 8 L90 8 L90 10 L14 10 L14 90 L8 90 Z" fill="white" />
        
        {/* Filigree Spirals */}
        <path
          d="M24 24 C 24 16, 40 16, 44 26 C 46 32, 40 38, 34 38 C 28 38, 24 32, 28 26 C 30 22, 36 22, 38 25"
          stroke={color.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 24 C 16 24, 16 40, 26 44 C 32 46, 38 40, 38 34 C 38 28, 32 24, 26 28 C 22 30, 22 36, 25 38"
          stroke={color.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="4" fill={color.stroke} />
        <path d="M48 16 L56 24 L48 32 L40 24 Z" fill={color.stroke} />
        <path d="M16 48 L24 56 L32 48 L24 40 Z" fill={color.stroke} />
        <circle cx="70" cy="8" r="2.5" fill={color.stroke} />
        <circle cx="8" cy="70" r="2.5" fill={color.stroke} />
      </svg>
    );

    return (
      <>
        {/* Double border layer inside */}
        <div className="absolute inset-4 sm:inset-5 border-2 pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.85 }} />
        <div className="absolute inset-7 sm:inset-8 border pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.5 }} />

        {/* 4 Sudut Royal */}
        <RoyalCorner className="top-1 left-1" />
        <RoyalCorner className="top-1 right-1 -scale-x-100" />
        <RoyalCorner className="bottom-1 left-1 -scale-y-100" />
        <RoyalCorner className="bottom-1 right-1 -scale-x-100 -scale-y-100" />
      </>
    );
  }

  if (style === 'geometric_art') {
    // Geometris Modern Bertingkat (Deco Art / Diamond Corners)
    const GeoCorner = ({ className }: { className?: string }) => (
      <svg
        viewBox="0 0 80 80"
        className={`w-16 h-16 sm:w-20 sm:h-20 absolute pointer-events-none ${className || ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 4H76V10H14C11.79 10 10 11.79 10 14V76H4V4Z" fill={color.stroke} />
        <path d="M16 16H66V20H22C20.89 20 20 20.89 20 22V66H16V16Z" fill={color.stroke} />
        <path d="M28 28H56V31H32C31.45 31 31 31.45 31 32V56H28V28Z" fill={color.stroke} />
        
        {/* Diamond Center */}
        <polygon points="40,24 48,32 40,40 32,32" fill={color.stroke} />
        <polygon points="40,28 44,32 40,36 36,32" fill="white" />
      </svg>
    );

    return (
      <>
        <div className="absolute inset-3 sm:inset-4 border pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.7 }} />
        <div className="absolute inset-5 sm:inset-6 border pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.4 }} />

        <GeoCorner className="top-1 left-1" />
        <GeoCorner className="top-1 right-1 -scale-x-100" />
        <GeoCorner className="bottom-1 left-1 -scale-y-100" />
        <GeoCorner className="bottom-1 right-1 -scale-x-100 -scale-y-100" />
      </>
    );
  }

  if (style === 'vintage_ornate') {
    // Sudut Renda Klasik Bunga
    const FloralCorner = ({ className }: { className?: string }) => (
      <svg
        viewBox="0 0 90 90"
        className={`w-16 h-16 sm:w-20 sm:h-20 absolute pointer-events-none ${className || ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 6 Q 45 6, 84 6 L 84 10 Q 45 10, 10 10 L 10 84 L 6 84 Z" fill={color.stroke} />
        <circle cx="36" cy="36" r="10" stroke={color.stroke} strokeWidth="2" fill="white" />
        {/* Kelopak Bunga */}
        <circle cx="36" cy="20" r="4.5" fill={color.stroke} />
        <circle cx="36" cy="52" r="4.5" fill={color.stroke} />
        <circle cx="20" cy="36" r="4.5" fill={color.stroke} />
        <circle cx="52" cy="36" r="4.5" fill={color.stroke} />
        <circle cx="36" cy="36" r="3" fill={color.stroke} />
        {/* Tangkai dekoratif */}
        <path d="M16 16 C 24 8, 38 8, 46 16" stroke={color.stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M16 16 C 8 24, 8 38, 16 46" stroke={color.stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );

    return (
      <>
        <div className="absolute inset-4 border-2 border-double pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.8 }} />
        <div className="absolute inset-7 border border-dotted pointer-events-none" style={{ borderColor: color.stroke, opacity: 0.6 }} />

        <FloralCorner className="top-1 left-1" />
        <FloralCorner className="top-1 right-1 -scale-x-100" />
        <FloralCorner className="bottom-1 left-1 -scale-y-100" />
        <FloralCorner className="bottom-1 right-1 -scale-x-100 -scale-y-100" />
      </>
    );
  }

  return null;
};
