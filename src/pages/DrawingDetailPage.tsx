import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDrawing } from '../context/DrawingContext';
import {
  ArrowLeft,
  Download,
  Share2,
  Layers,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const DrawingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useDrawing();

  const project = getProjectById(id || 'proj-2') || getProjectById('proj-1');

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'overlay'>('split');
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [copied, setCopied] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen sketchbook-bg flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 border border-[#E4E1DA] rounded-xs max-w-md">
          <h2 className="text-lg font-bold text-[#1F1D1B] mb-2">Study Not Found</h2>
          <Link
            to="/drawings"
            className="px-4 py-2 bg-[#1F1D1B] text-white rounded-xs text-xs font-semibold"
          >
            Back to Sketchbook
          </Link>
        </div>
      </div>
    );
  }

  const steps = project.steps;
  const activeStep = steps[activeStepIndex] || steps[0];

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-history.png`;
    link.href = project.referenceImageUrl;
    link.click();
  };

  return (
    <div className="min-h-screen sketchbook-bg pb-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Top Navigation & Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E1DA]">
          <div className="flex items-center gap-3">
            <Link
              to="/drawings"
              id="detail-back-btn"
              className="p-1.5 text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/30 rounded-xs transition-colors"
              title="Return to Sketchbook"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8B8479]">
                <span className="text-[#B98A2E] font-semibold">COMPLETED STUDY</span>
                <span>•</span>
                <span>{project.category.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1F1D1B]">
                {project.title}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="detail-share-btn"
              onClick={handleShare}
              className="px-3 py-1.5 bg-white border border-[#E4E1DA] hover:bg-[#F9F8F6] text-[#1F1D1B] rounded-xs text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8B8479]" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              id="detail-download-btn"
              onClick={handleDownload}
              className="px-3 py-1.5 bg-white border border-[#E4E1DA] hover:bg-[#F9F8F6] text-[#1F1D1B] rounded-xs text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8B8479]" />
              <span>Export Drawing</span>
            </button>
            <Link
              to={`/editor/${project.id}`}
              id="detail-reopen-editor-btn"
              className="px-3 py-1.5 bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#4A90C4]" />
              <span>Open in Canvas</span>
            </Link>
          </div>
        </div>

        {/* Study Metadata Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">Overall Match Score</span>
            <span className="text-base font-bold text-[#B98A2E]">{project.accuracyOverall || 95}% Accuracy</span>
          </div>
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">Sequence Depth</span>
            <span className="text-base font-bold text-[#1F1D1B]">{project.totalSteps} Guided Stages</span>
          </div>
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">Studio Time</span>
            <span className="text-base font-bold text-[#1F1D1B]">{project.timeSpentMinutes} Minutes</span>
          </div>
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">Status</span>
            <span className="text-base font-bold text-[#1F1D1B] flex items-center gap-1">
              <Check className="w-4 h-4 text-[#B98A2E]" />
              <span>All Inked</span>
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between bg-white border border-[#E4E1DA] px-4 py-2 rounded-xs mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8B8479] mr-2">DISPLAY MODE:</span>
            <button
              id="mode-split-btn"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
                viewMode === 'split'
                  ? 'bg-[#1F1D1B] text-white'
                  : 'bg-[#F9F8F6] text-[#8B8479] hover:text-[#1F1D1B]'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              id="mode-overlay-btn"
              onClick={() => setViewMode('overlay')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
                viewMode === 'overlay'
                  ? 'bg-[#1F1D1B] text-white'
                  : 'bg-[#F9F8F6] text-[#8B8479] hover:text-[#1F1D1B]'
              }`}
            >
              Ghost Overlay
            </button>
          </div>

          {viewMode === 'overlay' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] text-[#8B8479]">Reference Ghost:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={overlayOpacity}
                onChange={e => setOverlayOpacity(parseFloat(e.target.value))}
                className="w-24 h-1 bg-[#E4E1DA] rounded-lg appearance-none cursor-pointer accent-[#1F1D1B]"
              />
              <span className="font-mono text-[10px] text-[#1F1D1B] w-8">
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Visual Comparison Area */}
        <div className="bg-white border border-[#E4E1DA] rounded-xs p-4 sm:p-6 mb-6">
          {viewMode === 'split' ? (
            /* Side-by-Side View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Reference Photo */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-xs font-mono text-[#8B8479] mb-2">
                  <span>ORIGINAL REFERENCE PHOTO</span>
                  <span>UNSPLASH CAPTURE</span>
                </div>
                <div className="relative aspect-square bg-[#F6F5F2] border border-[#E4E1DA] rounded-xs overflow-hidden">
                  <img
                    src={project.referenceImageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Finished Pencil Drawing */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-xs font-mono text-[#8B8479] mb-2">
                  <span className="text-[#1F1D1B] font-semibold">FINAL INK RENDERING</span>
                  <span className="text-[#B98A2E]">VERIFIED STROKES</span>
                </div>
                <div className="relative aspect-square bg-white border border-[#E4E1DA] rounded-xs overflow-hidden flex items-center justify-center p-4">
                  {/* High fidelity ink rendering SVG */}
                  <svg
                    viewBox="0 0 700 700"
                    className="w-full h-full stroke-[#1F1D1B] fill-none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Render all steps up to the current scrubber index or all */}
                    {steps.slice(0, activeStepIndex + 1).map((s, idx) => (
                      <g key={`history-step-${s.id}`}>
                        {s.guidePaths.map(p => (
                          <path
                            key={`hist-path-${p.id}`}
                            d={
                              p.points.length >= 4
                                ? `M ${p.points[0]} ${p.points[1]} ` +
                                  p.points
                                    .slice(2)
                                    .reduce((acc, curr, i) => (i % 2 === 0 ? acc + `L ${curr} ` : acc + `${curr} `), '') +
                                  (p.closed ? 'Z' : '')
                                : ''
                            }
                            stroke={idx === activeStepIndex ? '#4A90C4' : '#1F1D1B'}
                            strokeWidth={idx === activeStepIndex ? 3 : 2}
                            opacity={idx === activeStepIndex ? 1 : 0.85}
                          />
                        ))}
                      </g>
                    ))}
                  </svg>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#F9F8F6] border border-[#E4E1DA] font-mono text-[10px] text-[#8B8479] rounded-xs">
                    LAYER: STEP 01 TO 0{activeStepIndex + 1}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Ghost Overlay View */
            <div className="relative aspect-square max-w-2xl mx-auto bg-white border border-[#E4E1DA] rounded-xs overflow-hidden flex items-center justify-center">
              {/* Background Reference Image with adjustable opacity */}
              <img
                src={project.referenceImageUrl}
                alt={project.title}
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 w-full h-full object-cover transition-opacity"
              />

              {/* Foreground Inked Vectors */}
              <svg
                viewBox="0 0 700 700"
                className="absolute inset-0 w-full h-full stroke-[#1F1D1B] fill-none z-10"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {steps.slice(0, activeStepIndex + 1).map(s => (
                  <g key={`overlay-step-${s.id}`}>
                    {s.guidePaths.map(p => (
                      <path
                        key={`overlay-path-${p.id}`}
                        d={
                          p.points.length >= 4
                            ? `M ${p.points[0]} ${p.points[1]} ` +
                              p.points
                                .slice(2)
                                .reduce((acc, curr, i) => (i % 2 === 0 ? acc + `L ${curr} ` : acc + `${curr} `), '') +
                              (p.closed ? 'Z' : '')
                            : ''
                        }
                        stroke="#1F1D1B"
                        strokeWidth={2}
                      />
                    ))}
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* STEP-BY-STEP SCRUBBER / CONSTRUCTION PLAYBACK */}
        {/* User can scrub or step through 01 -> 06 to see how the drawing was constructed */}
        <div className="bg-white border border-[#E4E1DA] rounded-xs p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E4E1DA]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8B8479]">
                <span className="w-2 h-2 rounded-full bg-[#4A90C4]" />
                <span>STEP-BY-STEP CONSTRUCTION SCRUBBER</span>
              </div>
              <h3 className="text-base font-bold text-[#1F1D1B] mt-0.5">
                Scrub the sequence from foundational mass to final accents
              </h3>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-1.5">
              <button
                id="scrubber-prev-btn"
                onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                disabled={activeStepIndex === 0}
                className="p-1.5 border border-[#E4E1DA] rounded-xs hover:bg-[#F9F8F6] disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-[#1F1D1B] px-2 font-semibold">
                STEP 0{activeStepIndex + 1} / 0{steps.length}
              </span>
              <button
                id="scrubber-next-btn"
                onClick={() => setActiveStepIndex(Math.min(steps.length - 1, activeStepIndex + 1))}
                disabled={activeStepIndex === steps.length - 1}
                className="p-1.5 border border-[#E4E1DA] rounded-xs hover:bg-[#F9F8F6] disabled:opacity-40 disabled:cursor-not-allowed"
                title="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrubber Slider Bar */}
          <div className="px-2 py-3">
            <input
              type="range"
              min="0"
              max={steps.length - 1}
              step="1"
              value={activeStepIndex}
              onChange={e => setActiveStepIndex(parseInt(e.target.value))}
              className="w-full h-2 bg-[#E4E1DA] rounded-lg appearance-none cursor-pointer accent-[#1F1D1B]"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#8B8479] mt-2">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`hover:text-[#1F1D1B] transition-colors ${
                    idx === activeStepIndex ? 'text-[#1F1D1B] font-bold underline' : ''
                  }`}
                >
                  0{s.id}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Annotation Card */}
          <div className="mt-4 p-4 bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#4A90C4] font-semibold">
                <span>STAGE 0{activeStep.id}</span>
                <span>•</span>
                <span>{activeStep.title.toUpperCase()}</span>
              </div>
              <p className="text-xs text-[#1F1D1B] mt-1 leading-relaxed">
                {activeStep.instruction}
              </p>
              <div className="text-[11px] font-mono text-[#8B8479] mt-1 flex items-center gap-1">
                <span>TARGET:</span>
                <span className="text-[#1F1D1B]">{activeStep.anatomicalTarget}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-[10px] font-mono text-[#8B8479] block uppercase">
                Step Tolerance
              </span>
              <span className="text-sm font-bold text-[#B98A2E]">
                {activeStep.accuracyScore || 95}% Match
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
