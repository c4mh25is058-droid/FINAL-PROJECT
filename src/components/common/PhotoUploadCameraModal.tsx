import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Image, RefreshCw, X, Check, AlertCircle, Trash2 } from 'lucide-react';

interface PhotoUploadCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected: (photoUrl: string) => void;
  currentPhoto?: string;
  employeeName: string;
}

const PRESET_AVATARS = [
  { name: 'Executive Navy', url: '/src/assets/images/avatar_ceo_elena_1793956014962.jpg' },
  { name: 'Engineering Lead', url: '/src/assets/images/avatar_vp_marcus_1793956016276.jpg' },
  { name: 'People Partner', url: '/src/assets/images/avatar_director_priya_1793956017190.jpg' },
  { name: 'Design Director', url: '/src/assets/images/avatar_lead_david_1793956019120.jpg' },
];

export const PhotoUploadCameraModal: React.FC<PhotoUploadCameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoSelected,
  currentPhoto,
  employeeName
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'presets'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera tracks helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user'
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser or upload a file.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No video camera device was detected on your system. Please upload a photo instead.');
      } else {
        setCameraError('Could not start video camera. Please use file upload instead.');
      }
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  // Capture snapshot from webcam
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Create a 500x500 square crop from the center of the video
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    // Draw square image
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 500, 500);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  // Process uploaded image file and resize via canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 500, 500);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        onPhotoSelected(resizedDataUrl);
        handleClose();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedPhoto(null);
    setCameraError(null);
    onClose();
  };

  const handleApplyCaptured = () => {
    if (capturedPhoto) {
      onPhotoSelected(capturedPhoto);
      handleClose();
    }
  };

  const handleRemovePhoto = () => {
    onPhotoSelected('');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Profile Photo & Headshot
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Update portrait for {employeeName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <button
            onClick={() => {
              setActiveTab('camera');
              setCapturedPhoto(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'camera'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take Photo (Camera)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('presets');
              stopCamera();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Executive Presets</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1">
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {capturedPhoto ? (
                /* Freeze Frame Captured State */
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-56 h-56 rounded-2xl overflow-hidden ring-4 ring-indigo-500 shadow-md">
                    <img 
                      src={capturedPhoto} 
                      alt="Captured employee headshot" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Photo captured successfully!
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={startCamera}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                    <button
                      onClick={handleApplyCaptured}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Use This Headshot</span>
                    </button>
                  </div>
                </div>
              ) : cameraError ? (
                /* Camera Error State */
                <div className="p-6 text-center rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                    {cameraError}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      Switch to File Upload
                    </button>
                  </div>
                </div>
              ) : (
                /* Live Video Viewfinder */
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-slate-900 ring-2 ring-indigo-500/40 shadow-inner flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder Target Guidelines */}
                    <div className="absolute inset-4 rounded-xl border border-dashed border-white/40 pointer-events-none" />
                    <div className="absolute bottom-2 text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded-full font-mono">
                      Center face in frame
                    </div>
                  </div>

                  <button
                    onClick={handleCapture}
                    disabled={!cameraActive}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click to select or drag & drop photo
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Supports PNG, JPG, or WEBP (auto-cropped to square headshot)
                </p>
              </div>
            </div>
          )}

          {/* PRESETS TAB */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select an official high-resolution corporate executive portrait:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onPhotoSelected(preset.url);
                      handleClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-white dark:bg-slate-800 flex items-center gap-3 text-left transition-all group"
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-12 h-12 rounded-lg object-cover ring-1 ring-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 truncate">
                        {preset.name}
                      </p>
                      <span className="text-[10px] text-slate-400">Use Portrait</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Remove Photo */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          {currentPhoto ? (
            <button
              onClick={handleRemovePhoto}
              className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo (Use Monogram)</span>
            </button>
          ) : (
            <span className="text-slate-400 text-[11px]">Currently using initials monogram</span>
          )}

          <button
            onClick={handleClose}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>

        {/* Hidden canvas for video snapshots */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
