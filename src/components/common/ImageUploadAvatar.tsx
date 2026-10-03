import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Check,
  RefreshCw,
  Sparkles,
  User,
  AlertCircle,
  Eye,
  X,
  Smile
} from 'lucide-react';

export interface ImageUploadAvatarProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  type?: 'user' | 'student' | 'teacher';
  gender?: 'L' | 'P';
  shape?: 'rounded' | 'circle';
  aspectRatio?: '1:1' | '3:4';
  className?: string;
  maxDimension?: number; // max width/height in px for compression, default 600
}

// Preset avatars curated for Indonesian primary school context
export const PRESET_AVATARS = {
  user: [
    {
      id: 'guru_pria_1',
      label: 'Guru Pria Formal',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'guru_pria_2',
      label: 'Guru Pria Kasual',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'guru_wanita_1',
      label: 'Guru Wanita Berhijab',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'guru_wanita_2',
      label: 'Guru Wanita Formal',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'kepsek_1',
      label: 'Kepala Sekolah Pria',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'kepsek_2',
      label: 'Kepala Sekolah Wanita',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'admin_1',
      label: 'Operator / Admin Sekolah',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'wali_murid_1',
      label: 'Wali Murid / Orang Tua',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80'
    }
  ],
  student: [
    {
      id: 'siswa_putra_1',
      label: 'Siswa Putra 1',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'siswa_putra_2',
      label: 'Siswa Putra 2',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'siswa_putra_3',
      label: 'Siswa Putra Kacamata',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'siswa_putri_1',
      label: 'Siswi Putri Berhijab',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'siswa_putri_2',
      label: 'Siswi Putri Ceria',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'siswa_putri_3',
      label: 'Siswi Putri Rambut Pendek',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'siswa_putra_4',
      label: 'Siswa Putra Ceria',
      gender: 'L',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'siswa_putri_4',
      label: 'Siswi Putri 4',
      gender: 'P',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80'
    }
  ]
};

// Default fallback placeholder images
const DEFAULT_AVATARS = {
  user: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  student: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&auto=format&fit=crop&q=80',
  teacher: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
};

export const ImageUploadAvatar: React.FC<ImageUploadAvatarProps> = ({
  value,
  onChange,
  label = 'Foto Profil / Pasfoto',
  description = 'Unggah foto dari komputer/HP, ambil langsung via kamera, atau pilih avatar siap pakai.',
  type = 'user',
  gender,
  shape = 'rounded',
  aspectRatio = '1:1',
  className = '',
  maxDimension = 500
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'camera' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(value && value.startsWith('http') ? value : '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const fallbackAvatar = DEFAULT_AVATARS[type] || DEFAULT_AVATARS.user;
  const currentPhoto = value || fallbackAvatar;

  // Cleanup media stream on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setHasCameraPermission(true);
    } catch (err: any) {
      setHasCameraPermission(false);
      setErrorMessage('Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan di peramban (browser).');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth, video.videoHeight) || 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop to 1:1 square
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onChange(dataUrl);
    stopCameraStream();
    setActiveTab('upload');
  };

  // Compress & convert file to Base64
  const processImageFile = (file: File) => {
    setErrorMessage(null);

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Berkas yang dipilih bukan gambar. Harap pilih berkas JPG, PNG, WebP, atau GIF.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too big
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            onChange(e.target?.result as string);
            setIsProcessing(false);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } catch {
          // Fallback to original Base64
          onChange(e.target?.result as string);
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setErrorMessage('Gagal memuat format berkas gambar.');
        setIsProcessing(false);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setErrorMessage('Terjadi kesalahan saat membaca file.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customUrlInput.trim()) {
      onChange(customUrlInput.trim());
    }
  };

  const handleResetToDefault = () => {
    onChange(fallbackAvatar);
    setCustomUrlInput('');
    setErrorMessage(null);
  };

  // Get preset list based on type & gender
  const presetList = type === 'student' ? PRESET_AVATARS.student : PRESET_AVATARS.user;
  const sortedPresets = [...presetList].sort((a, b) => {
    if (gender && a.gender === gender && b.gender !== gender) return -1;
    if (gender && b.gender === gender && a.gender !== gender) return 1;
    return 0;
  });

  const isBase64 = value && value.startsWith('data:image');

  return (
    <div className={`space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {label}
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        {/* Reset button */}
        {value && value !== fallbackAvatar && (
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            title="Reset ke foto avatar standar"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Standar</span>
          </button>
        )}
      </div>

      {/* Main Layout: Left Preview + Right Selector/Tabs */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
        {/* Left: Interactive Preview Card */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative group">
            <img
              src={currentPhoto}
              alt="Foto Profil"
              className={`object-cover ring-2 ring-blue-500/30 dark:ring-blue-400/30 shadow-md bg-white dark:bg-slate-800 ${
                shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
              } ${
                aspectRatio === '3:4' ? 'w-24 h-32' : 'w-24 h-24 sm:w-28 sm:h-28'
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackAvatar;
              }}
            />

            {/* Hover overlay for fast upload trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs ${
                shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
              }`}
              title="Klik untuk memilih foto dari perangkat"
            >
              <Upload className="h-4 w-4" />
              <span className="text-[10px] font-bold">Ganti Foto</span>
            </button>

            {isProcessing && (
              <div
                className={`absolute inset-0 bg-black/60 text-white flex items-center justify-center ${
                  shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
                }`}
              >
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            {isBase64 ? '✓ Foto Kustom (Unggah)' : 'Foto Aktif'}
          </span>
        </div>

        {/* Right: Method Navigation Tabs & Controls */}
        <div className="flex-1 w-full space-y-3">
          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setActiveTab('upload');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Unggah Berkas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setActiveTab('preset');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                activeTab === 'preset'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Smile className="h-3.5 w-3.5" />
              <span>Pilihan Avatar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                activeTab === 'camera'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Kamera</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCameraStream();
                setActiveTab('url');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition-colors ${
                activeTab === 'url'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Tautan URL</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* TAB 1: FILE UPLOAD (DRAG & DROP) */}
          {activeTab === 'upload' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40'
                  : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 hover:border-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Upload className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Klik untuk pilih foto atau seret berkas ke sini
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                  Mendukung PNG, JPG, JPEG, WebP (Otomatis dikompresi agar ringan)
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRESET AVATARS GALLERY */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                {sortedPresets.map((preset) => {
                  const isSelected = value === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onChange(preset.url)}
                      className={`relative group rounded-xl p-1 border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-11 w-11 mx-auto rounded-lg object-cover"
                      />
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xs">
                          <Check className="h-2.5 w-2.5 stroke-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 text-center">
                Pilih salah satu karakter avatar resmi di atas untuk diterapkan langsung.
              </p>
            </div>
          )}

          {/* TAB 3: WEBCAM PHOTO CAPTURE */}
          {activeTab === 'camera' && (
            <div className="space-y-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
              {cameraActive ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-black border-2 border-blue-500 shadow-md">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Ambil Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Tutup Kamera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <Camera className="h-8 w-8 mx-auto text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Gunakan kamera perangkat untuk mengambil pasfoto langsung
                  </p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Nyalakan Kamera</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DIRECT IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/foto-profil.jpg"
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCustomUrl()}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                Tempel tautan URL gambar langsung dari internet atau Google Drive publik.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
