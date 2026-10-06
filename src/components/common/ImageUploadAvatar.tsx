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
  Smile,
  SwitchCamera,
  RotateCcw,
  Smartphone,
  Lock,
  HelpCircle,
  CameraOff
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
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [permissionErrorType, setPermissionErrorType] = useState<'denied' | 'notfound' | 'notsupported' | 'iframe_blocked' | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraFrontRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraBackRef = useRef<HTMLInputElement | null>(null);
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

  // Attach stream to video element when mounted or changed
  const attachStreamToVideo = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && mediaStreamRef.current) {
      if (el.srcObject !== mediaStreamRef.current) {
        el.srcObject = mediaStreamRef.current;
      }
      el.play().catch(err => {
        console.warn('Video auto play interrupted:', err);
      });
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && mediaStreamRef.current) {
      if (videoRef.current.srcObject !== mediaStreamRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
      }
      videoRef.current.play().catch(e => console.warn('Video play effect:', e));
    }
  }, [cameraActive]);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
    setIsCameraLoading(false);
  };

  const startCamera = async (targetFacing?: 'user' | 'environment') => {
    const selectedFacing = targetFacing || facingMode;
    setErrorMessage(null);
    setPermissionErrorType(null);
    setIsCameraLoading(true);

    stopCameraStream();

    // Verify if mediaDevices is supported in current browser / context
    if (!navigator?.mediaDevices?.getUserMedia) {
      setIsCameraLoading(false);
      setHasCameraPermission(false);
      setPermissionErrorType('notsupported');
      setErrorMessage(
        'Peramban tidak mendukung live stream webcam di lingkungan ini. Gunakan tombol "Buka Kamera HP / Bawaan" di bawah.'
      );
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: selectedFacing,
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        });
      } catch (firstErr) {
        // Fallback to simpler constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      mediaStreamRef.current = stream;
      setCameraActive(true);
      setHasCameraPermission(true);
      setPermissionErrorType(null);
      setIsCameraLoading(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Auto play:', e));
      }
    } catch (err: any) {
      console.warn('Camera getUserMedia error:', err);
      setIsCameraLoading(false);
      setCameraActive(false);
      setHasCameraPermission(false);

      const errName = err?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setPermissionErrorType('denied');
        setErrorMessage(
          'Izin kamera belum diberikan atau dibatasi oleh peramban/keamanan frame. Anda bisa klik "Buka Kamera HP / Bawaan" untuk langsung mengambil foto tanpa terhalang izin browser.'
        );
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setPermissionErrorType('notfound');
        setErrorMessage(
          'Perangkat kamera/webcam tidak terdeteksi pada sistem ini.'
        );
      } else if (errName === 'SecurityError') {
        setPermissionErrorType('iframe_blocked');
        setErrorMessage(
          'Akses kamera dibatasi oleh kebijakan frame/domain peramban.'
        );
      } else {
        setPermissionErrorType('denied');
        setErrorMessage(
          `Kamera tidak dapat diakses (${err.message || 'Izin ditolak'}). Silakan gunakan tombol Kamera Bawaan HP di bawah.`
        );
      }
    }
  };

  const toggleFacingMode = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    if (cameraActive) {
      startCamera(nextFacing);
    }
  };

  const triggerNativeCamera = (facing: 'user' | 'environment' = 'user') => {
    stopCameraStream();
    if (facing === 'environment') {
      nativeCameraBackRef.current?.click();
    } else {
      nativeCameraFrontRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    if (aspectRatio === '3:4') {
      const targetHeight = Math.min(vh, Math.round((vw * 4) / 3));
      const targetWidth = Math.round(targetHeight * 0.75);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const startX = Math.max(0, (vw - targetWidth) / 2);
      const startY = Math.max(0, (vh - targetHeight) / 2);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, startX, startY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    } else {
      const size = Math.min(vw, vh);
      canvas.width = size;
      canvas.height = size;
      const startX = Math.max(0, (vw - size) / 2);
      const startY = Math.max(0, (vh - size) / 2);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
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

          {/* Hidden File Input for Standard File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Hidden Native Device Camera Inputs (100% bypass for iframe / browser permission blocks) */}
          <input
            ref={nativeCameraFrontRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={nativeCameraBackRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* TAB 1: FILE UPLOAD (DRAG & DROP) */}
          {activeTab === 'upload' && (
            <div className="space-y-2.5">
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
                    Mendukung PNG, JPG, JPEG, WebP (Otomatis dikompresi & disesuaikan)
                  </p>
                </div>
              </div>

              {/* Quick Camera Action Shortcut */}
              <div className="flex items-center justify-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => triggerNativeCamera('user')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  title="Ambil pasfoto siswa langsung lewat kamera HP/Laptop"
                >
                  <Camera className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Ambil via Kamera Perangkat</span>
                </button>
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

          {/* TAB 3: WEBCAM PHOTO CAPTURE & NATIVE CAMERA */}
          {activeTab === 'camera' && (
            <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 shadow-xs">
              {/* STATE 1: LIVE WEBCAM ACTIVE */}
              {cameraActive ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-black border-2 border-blue-500 shadow-md">
                    <video
                      ref={attachStreamToVideo}
                      autoPlay
                      playsInline
                      muted
                      onLoadedMetadata={(e) => {
                        (e.target as HTMLVideoElement).play().catch(() => {});
                      }}
                      className="w-full h-full object-cover"
                    />

                    {/* Pasfoto Framing Guide Oval */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-3">
                      <div className="w-36 h-48 border-2 border-dashed border-white/60 rounded-[45%] shadow-[0_0_0_9999px_rgba(0,0,0,0.25)] flex items-end justify-center pb-2">
                        <span className="text-[9px] font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                          Posisikan Wajah Siswa
                        </span>
                      </div>
                    </div>

                    {/* Top Status Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold shadow-xs backdrop-blur-xs">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      <span>Live ({facingMode === 'user' ? 'Depan' : 'Belakang'})</span>
                    </div>

                    {/* Switch Camera Button (Depan / Belakang) */}
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold shadow-xs backdrop-blur-xs flex items-center gap-1"
                      title="Ganti kamera depan / belakang"
                    >
                      <SwitchCamera className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Camera Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/25 cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Jepret Pasfoto</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      <SwitchCamera className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{facingMode === 'user' ? 'Kamera Belakang' : 'Kamera Depan'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>

                  {/* Fallback to Native Camera while live camera is on */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => triggerNativeCamera('user')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>Gunakan kamera bawaan HP / perangkat (resolusi penuh)</span>
                    </button>
                  </div>
                </div>
              ) : isCameraLoading ? (
                /* STATE 2: CAMERA LOADING */
                <div className="text-center py-8 space-y-3">
                  <div className="h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Menghubungkan ke kamera perangkat...
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Harap klik "Izinkan" jika muncul dialog perizinan kamera di peramban Anda.
                  </p>
                </div>
              ) : permissionErrorType ? (
                /* STATE 3: PERMISSION ERROR / IFRAME BLOCKED */
                <div className="space-y-3 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/30">
                  <div className="flex items-start gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        {permissionErrorType === 'denied'
                          ? 'Izin Akses Kamera Ditolak / Dibatasi'
                          : permissionErrorType === 'notfound'
                          ? 'Perangkat Kamera Tidak Ditemukan'
                          : 'Akses Kamera Dibatasi oleh Peramban'}
                      </h4>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                        {errorMessage || 'Peramban memblokir akses langsung atau izin kamera belum diberikan.'}
                      </p>
                    </div>
                  </div>

                  {/* Solutions Section */}
                  <div className="pt-2 border-t border-amber-200/80 dark:border-amber-800/40 space-y-2">
                    <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                      Solusi Terbaik:
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Option 1: Native device camera bypass (100% works) */}
                      <button
                        type="button"
                        onClick={() => triggerNativeCamera('user')}
                        className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>Buka Kamera HP / Perangkat (Bypass Izin)</span>
                      </button>

                      {/* Option 2: Retry getUserMedia */}
                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Coba Izin Ulang</span>
                      </button>
                    </div>

                    {/* Expandable guide for enabling camera in browser */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPermissionGuide(!showPermissionGuide)}
                        className="text-[10.5px] font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>{showPermissionGuide ? 'Sembunyikan panduan izin browser' : 'Lihat cara mengizinkan kamera di browser'}</span>
                      </button>

                      {showPermissionGuide && (
                        <div className="mt-2 p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60 text-[10.5px] text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed">
                          <p className="font-bold text-slate-900 dark:text-white">Panduan Mengaktifkan Izin Kamera di Browser:</p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                            <li>Klik ikon <strong>Gembok (🔒)</strong> atau <strong>Ikon Setelan</strong> di sebelah kiri bilah URL peramban (browser).</li>
                            <li>Cari opsi <strong>Kamera (Camera)</strong> lalu pilih <strong>"Izinkan" (Allow)</strong>.</li>
                            <li>Setelah diizinkan, klik tombol <strong>"Coba Izin Ulang"</strong> di atas.</li>
                            <li>Jika Anda menggunakan HP/tablet atau mode pratinjau, Anda dapat langsung menekan tombol biru <strong>"Buka Kamera HP / Perangkat"</strong> tanpa perlu mengatur izin browser.</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* STATE 4: INITIAL CAMERA READY SCREEN */
                <div className="text-center py-4 px-2 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Ambil Pasfoto Siswa Menggunakan Kamera
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Gunakan webcam laptop/komputer untuk pratinjau live, atau buka kamera bawaan HP/tablet untuk mengambil pasfoto langsung.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Nyalakan Live Webcam</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerNativeCamera('user')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Smartphone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Buka Kamera HP / Bawaan</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Tips: Pastikan pencahayaan cukup dan seragam siswa terlihat rapi untuk pasfoto Dapodik.
                  </p>
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
