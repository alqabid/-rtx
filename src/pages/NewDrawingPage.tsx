import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawing } from '../context/DrawingContext';
import { SAMPLE_PRESETS } from '../data/mockData';
import { Upload, Image as ImageIcon, ArrowRight, Check, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { DrawingProject } from '../types';

export const NewDrawingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProjectFromImage, createProjectFromPreset } = useDrawing();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DrawingProject['category']>('Portrait');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingSteps = [
    'Detecting silhouette boundaries & volumetric contours...',
    'Calculating cardinal symmetry axes and focal anchors...',
    'Synthesizing 6 ordered underdrawing vector stages...',
    'Calibrating stroke curvature tolerance metrics...'
  ];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
        if (!title) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setPreviewUrl(preset.imageUrl);
    setTitle(preset.title);
    setCategory(preset.category);
  };

  const handleStartDecomposition = () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    setProcessingStage(0);

    // Realistic simulated delay through the 4 stages (total ~2.4 seconds)
    const interval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(async () => {
            const newId = await createProjectFromImage(
              previewUrl,
              title || 'Study Project',
              category,
              imageFile ?? undefined
            );
            navigate(`/editor/${newId}`);
          }, 600);
          return prev;
        }
      });
    }, 600);
  };

  return (
    <div className="min-h-screen sketchbook-bg pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-[#E4E1DA]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B8479] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#4A90C4]" />
            <span>REFERENCE INTAKE • STEP 00</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1D1B] tracking-tight">
            New Drawing Setup
          </h1>
          <p className="text-xs text-[#8B8479] mt-1">
            Upload any photo to decompose it into artists’ underdrawing guides.
          </p>
        </div>

        {isProcessing ? (
          /* Processing State: Simulated ML decomposition */
          <div
            id="analyzing-state-panel"
            className="bg-white border border-[#E4E1DA] rounded-xs p-8 sm:p-12 text-center max-w-lg mx-auto my-12 shadow-sm animate-in fade-in"
          >
            <div className="w-16 h-16 rounded-xs bg-[#F9F8F6] border border-[#4A90C4] flex items-center justify-center mx-auto mb-6 relative">
              <div className="w-10 h-10 border-2 border-[#4A90C4] border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#4A90C4] font-bold">
                AI
              </div>
            </div>

            <h3 className="text-base font-bold text-[#1F1D1B] mb-2">
              Analyzing your image...
            </h3>

            {/* Current Processing Stage */}
            <p className="text-xs font-mono text-[#4A90C4] min-h-6 mb-6">
              {processingSteps[processingStage]}
            </p>

            {/* Stage Progress Bars */}
            <div className="space-y-2 text-left max-w-sm mx-auto mb-6">
              {processingSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-4 h-4 rounded-xs flex items-center justify-center font-mono text-[10px] shrink-0 ${
                      idx < processingStage
                        ? 'bg-[#B98A2E] text-white'
                        : idx === processingStage
                        ? 'bg-[#4A90C4] text-white animate-pulse'
                        : 'bg-[#E4E1DA] text-[#8B8479]'
                    }`}
                  >
                    {idx < processingStage ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] truncate ${
                      idx === processingStage
                        ? 'text-[#1F1D1B] font-semibold'
                        : idx < processingStage
                        ? 'text-[#8B8479] line-through opacity-70'
                        : 'text-[#8B8479]/60'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#8B8479]">
              PREPARING VECTOR DRAFTING CANVAS...
            </div>
          </div>
        ) : (
          /* Normal Upload & Setup Form */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Drag-Drop Upload Area */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div
                id="upload-dropzone"
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xs p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[340px] bg-white ${
                  dragOver
                    ? 'border-[#4A90C4] bg-[#4A90C4]/5 ring-4 ring-[#4A90C4]/10'
                    : previewUrl
                    ? 'border-[#8B8479]'
                    : 'border-[#E4E1DA] hover:border-[#8B8479]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                  id="image-file-input"
                />

                {previewUrl ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="relative aspect-square max-h-56 bg-[#F6F5F2] border border-[#E4E1DA] rounded-xs overflow-hidden mb-3">
                      <img
                        src={previewUrl}
                        alt="Reference Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1F1D1B]">
                      Reference Loaded
                    </span>
                    <span className="text-[11px] text-[#8B8479] mt-0.5">
                      Click or drop another file to replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xs bg-[#F9F8F6] border border-[#E4E1DA] flex items-center justify-center text-[#4A90C4] mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-[#1F1D1B]">
                      Drag and drop your reference photo here
                    </span>
                    <span className="text-xs text-[#8B8479] mt-1">
                      or click to browse from your device
                    </span>
                    <span className="mt-3 text-[10px] font-mono text-[#8B8479] px-2 py-0.5 bg-[#E4E1DA]/40 rounded-xs">
                      PNG, JPG, WEBP • PORTRAIT OR SINGLE OBJECT PREFERRED
                    </span>
                  </div>
                )}
              </div>

              {/* Sample Presets Quick-Select */}
              <div className="bg-white border border-[#E4E1DA] rounded-xs p-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#8B8479] mb-3">
                  <span>OR SELECT A STUDIO PRESET</span>
                  <span className="text-[#4A90C4]">QUICK START</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      id={`preset-btn-${preset.id}`}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xs border text-left transition-all ${
                        previewUrl === preset.imageUrl
                          ? 'border-[#4A90C4] bg-[#4A90C4]/10 ring-1 ring-[#4A90C4]'
                          : 'border-[#E4E1DA] hover:border-[#8B8479] bg-[#F9F8F6]'
                      }`}
                    >
                      <div className="aspect-square rounded-xs overflow-hidden mb-1.5 bg-white border border-[#E4E1DA]">
                        <img
                          src={preset.imageUrl}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#1F1D1B] block truncate">
                        {preset.title.split(':')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-[#8B8479]">
                        {preset.stepCount} STEPS
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Study Settings & Launch Button */}
            <div className="md:col-span-5 flex flex-col justify-between bg-white border border-[#E4E1DA] rounded-xs p-5">
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#E4E1DA]">
                  <h3 className="text-sm font-bold text-[#1F1D1B]">
                    Study Metadata
                  </h3>
                  <p className="text-xs text-[#8B8479] mt-0.5">
                    Define the subject parameters for guide generation.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8B8479] mb-1 uppercase">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    id="new-study-title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Portrait Study #4"
                    className="w-full px-3 py-2 text-sm border border-[#E4E1DA] rounded-xs focus:outline-hidden focus:border-[#4A90C4] text-[#1F1D1B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8B8479] mb-1 uppercase">
                    Subject Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Portrait', 'Still Life', 'Anatomy', 'Architecture'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        id={`category-btn-${cat}`}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-2 text-xs font-medium rounded-xs border transition-colors text-left ${
                          category === cat
                            ? 'bg-[#1F1D1B] text-white border-[#1F1D1B]'
                            : 'bg-white text-[#1F1D1B] border-[#E4E1DA] hover:bg-[#F9F8F6]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1F1D1B]">
                    <span className="text-[#4A90C4]">●</span>
                    <span>Decomposition Protocol</span>
                  </div>
                  <p className="text-[11px] text-[#8B8479] leading-relaxed">
                    Image will be parsed into 6 sequential underdrawing stages starting from foundational mass lines down to fine accents.
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 border-t border-[#E4E1DA] mt-4">
                <button
                  type="button"
                  id="start-decomposition-btn"
                  onClick={handleStartDecomposition}
                  disabled={!previewUrl}
                  className={`w-full py-3 rounded-xs text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
                    previewUrl
                      ? 'bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white cursor-pointer'
                      : 'bg-[#E4E1DA] text-[#8B8479] cursor-not-allowed'
                  }`}
                >
                  <span>Deconstruct Image & Enter Canvas</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4A90C4]" />
                </button>
                {!previewUrl && (
                  <p className="text-[11px] text-center text-[#8B8479] mt-2">
                    Upload a file or choose a studio preset above to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
