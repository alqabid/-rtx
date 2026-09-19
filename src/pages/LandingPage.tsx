import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SAMPLE_PRESETS } from '../data/mockData';
import { useDrawing } from '../context/DrawingContext';
import { ArrowRight, Sparkles, Check, Compass, Cpu, Eye, Layers } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProjectFromPreset } = useDrawing();
  const [activeStepTab, setActiveStepTab] = useState<'photo' | 'guides' | 'ink'>('guides');

  const handleStartPreset = (presetId: string) => {
    const id = createProjectFromPreset(presetId);
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen sketchbook-bg text-[#1F1D1B] pb-24">
      {/* Top Banner / Hero Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12">
        {/* Title & Concept */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E4E1DA] rounded-xs text-xs font-mono text-[#8B8479] mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#4A90C4]" />
            <span>@RTX ARTIST UNDERDRAWING ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F1D1B] mb-4">
            Learn to draw by breaking any reference into ordered guides.
          </h1>

          <p className="text-base sm:text-lg text-[#8B8479] leading-relaxed max-w-2xl mx-auto">
            Upload any portrait or object. The engine generates artists’ non-photo blue
            underdrawing steps and checks your stroke angles in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              to="/new"
              id="landing-hero-cta"
              className="px-6 py-3 bg-[#1F1D1B] text-white hover:bg-[#1F1D1B]/90 rounded-xs text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Upload a Photo & Start</span>
              <ArrowRight className="w-4 h-4 text-[#4A90C4]" />
            </Link>
            <Link
              to="/drawings"
              id="landing-demo-cta"
              className="px-5 py-3 bg-white text-[#1F1D1B] hover:bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs text-sm font-medium transition-colors"
            >
              Browse Sample Sketchbook
            </Link>
          </div>
        </div>

        {/* HERO CORE MOMENT: The 3-Panel Strip */}
        {/* [Reference Photo] -> [Blue Guide-Line Breakdown] -> [Finished Pencil Drawing] */}
        <div
          id="hero-three-panel-strip"
          className="bg-white border border-[#E4E1DA] shadow-md rounded-xs p-3 sm:p-5 my-8"
        >
          <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-[#E4E1DA] text-xs font-mono text-[#8B8479]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1F1D1B]">THE DECONSTRUCTION SEQUENCE</span>
              <span>•</span>
              <span>FROM REFERENCE TO INK</span>
            </div>
            <span className="hidden sm:inline text-[#4A90C4]">
              PORTRAIT STUDY: MAYA (STEP 01–06)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* Panel 1: Reference Photo */}
            <div
              className={`p-3 bg-[#F9F8F6] border rounded-xs transition-all ${
                activeStepTab === 'photo'
                  ? 'border-[#1F1D1B] ring-1 ring-[#1F1D1B]/20'
                  : 'border-[#E4E1DA]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="font-semibold text-[#8B8479]">01 / REFERENCE</span>
                <span className="text-[#8B8479]">RAW INPUT</span>
              </div>
              <div className="relative aspect-square bg-white border border-[#E4E1DA] overflow-hidden rounded-xs">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
                  alt="Reference Portrait"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 text-white font-mono text-[9px] rounded-xs">
                  INPUT PHOTO
                </div>
              </div>
              <p className="text-xs text-[#8B8479] mt-2 leading-relaxed">
                Raw subject photo uploaded by the artist. Computer vision extracts contour volumes and cardinal axes.
              </p>
            </div>

            {/* Panel 2: Blue Guide-Line Breakdown */}
            <div
              className={`p-3 bg-[#F9F8F6] border rounded-xs transition-all relative ${
                activeStepTab === 'guides'
                  ? 'border-[#4A90C4] ring-2 ring-[#4A90C4]/20'
                  : 'border-[#E4E1DA]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="font-semibold text-[#4A90C4]">02 / BLUE GUIDES</span>
                <span className="text-[#4A90C4] bg-[#4A90C4]/10 px-1.5 py-0.5 rounded-xs">
                  NON-PHOTO BLUE
                </span>
              </div>
              <div className="relative aspect-square bg-white border border-[#4A90C4]/40 overflow-hidden rounded-xs flex items-center justify-center p-2">
                {/* SVG Illustration of Blue Guide Vectors */}
                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full stroke-[#4A90C4] fill-none"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  {/* Subtle faint reference outline */}
                  <ellipse cx="150" cy="140" rx="80" ry="105" strokeDasharray="5,4" />
                  <line x1="150" y1="30" x2="150" y2="250" strokeDasharray="3,3" />
                  <line x1="80" y1="135" x2="220" y2="135" strokeDasharray="3,3" />
                  <line x1="95" y1="115" x2="205" y2="115" strokeDasharray="3,3" />
                  <line x1="115" y1="180" x2="185" y2="180" strokeDasharray="3,3" />
                  <line x1="120" y1="210" x2="180" y2="210" strokeDasharray="3,3" />
                  {/* Facial landmarks */}
                  <path d="M 105 135 Q 125 125 140 135 Q 125 145 105 135" />
                  <path d="M 160 135 Q 175 125 195 135 Q 175 145 160 135" />
                  <path d="M 148 135 L 144 175 L 156 175 Z" />
                  <path d="M 130 208 Q 150 200 170 208" />
                  <path d="M 134 212 Q 150 222 166 212" />
                  {/* Jawline anchor */}
                  <path d="M 85 145 Q 95 215 150 245 Q 205 215 215 145" />
                </svg>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#4A90C4] text-white font-mono text-[9px] rounded-xs">
                  AI UNDERDRAWING
                </div>
              </div>
              <p className="text-xs text-[#1F1D1B] mt-2 font-medium leading-relaxed">
                Step-by-step vector guides in traditional non-photo blue. Draw each line with real-time feedback.
              </p>
            </div>

            {/* Panel 3: Finished Pencil Drawing */}
            <div
              className={`p-3 bg-[#F9F8F6] border rounded-xs transition-all ${
                activeStepTab === 'ink'
                  ? 'border-[#1F1D1B] ring-1 ring-[#1F1D1B]/20'
                  : 'border-[#E4E1DA]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="font-semibold text-[#1F1D1B]">03 / RESOLVED INK</span>
                <span className="text-[#B98A2E] font-semibold">100% MATCH</span>
              </div>
              <div className="relative aspect-square bg-white border border-[#E4E1DA] overflow-hidden rounded-xs flex items-center justify-center p-2">
                {/* SVG Illustration of Finished Graphite/Ink Drawing */}
                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full stroke-[#1F1D1B] fill-none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Hair Mass */}
                  <path d="M 80 150 C 70 80 110 30 150 30 C 200 30 230 80 220 150" strokeWidth="3" />
                  <path d="M 75 140 Q 60 200 80 240 Q 100 170 95 130" strokeWidth="2.5" />
                  <path d="M 225 140 Q 240 200 220 240 Q 200 170 205 130" strokeWidth="2.5" />
                  {/* Jawline & Chin */}
                  <path d="M 90 145 C 95 210 120 242 150 245 C 180 242 205 210 210 145" />
                  {/* Eyes & Brows */}
                  <path d="M 100 125 Q 120 120 135 125" strokeWidth="2.8" />
                  <path d="M 165 125 Q 180 120 200 125" strokeWidth="2.8" />
                  <path d="M 105 135 Q 122 130 138 135 Q 122 142 105 135" />
                  <path d="M 162 135 Q 178 130 195 135 Q 178 142 162 135" />
                  <circle cx="122" cy="135" r="3.5" fill="#1F1D1B" />
                  <circle cx="178" cy="135" r="3.5" fill="#1F1D1B" />
                  {/* Nose */}
                  <path d="M 148 135 L 144 175 Q 150 180 156 175" />
                  <path d="M 136 174 Q 144 176 148 174" />
                  <path d="M 164 174 Q 156 176 152 174" />
                  {/* Lips */}
                  <path d="M 130 204 Q 140 200 150 202 Q 160 200 170 204" strokeWidth="2.5" />
                  <path d="M 132 206 Q 150 218 168 206" />
                  {/* Neck Lines */}
                  <path d="M 115 240 L 95 285" />
                  <path d="M 185 240 L 205 285" />
                </svg>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#B98A2E] text-white font-mono text-[9px] rounded-xs">
                  RESOLVED PIECE
                </div>
              </div>
              <p className="text-xs text-[#8B8479] mt-2 leading-relaxed">
                As steps are verified, blue guides resolve into permanent solid ink. Your sketchbook stores every stroke layer.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Presets Bar */}
        <div className="mt-12 bg-white border border-[#E4E1DA] rounded-xs p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-[#E4E1DA]">
            <div>
              <h2 className="text-base font-bold text-[#1F1D1B]">
                Or Try a Pre-Structured Study
              </h2>
              <p className="text-xs text-[#8B8479]">
                Click any subject below to launch straight into the canvas workspace.
              </p>
            </div>
            <span className="text-xs font-mono text-[#4A90C4] mt-2 sm:mt-0">
              INSTANT START
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_PRESETS.map(preset => (
              <div
                key={preset.id}
                onClick={() => handleStartPreset(preset.id)}
                className="group p-3 bg-[#F9F8F6] hover:bg-white border border-[#E4E1DA] hover:border-[#4A90C4] rounded-xs cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square bg-white border border-[#E4E1DA] rounded-xs overflow-hidden mb-3">
                    <img
                      src={preset.imageUrl}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8B8479] mb-1">
                    <span>{preset.category}</span>
                    <span>{preset.stepCount} STEPS</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#1F1D1B] group-hover:text-[#4A90C4] transition-colors leading-snug">
                    {preset.title}
                  </h3>
                  <p className="text-[11px] text-[#8B8479] mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <button
                  id={`try-preset-${preset.id}`}
                  className="mt-3 w-full py-1.5 bg-white group-hover:bg-[#1F1D1B] group-hover:text-white border border-[#E4E1DA] rounded-xs text-xs font-medium flex items-center justify-center gap-1 transition-all"
                >
                  <span>Start Study</span>
                  <ArrowRight className="w-3 h-3 text-[#4A90C4]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* The Three-Technology Idea (Computer Vision / Machine Learning / AI) */}
        {/* Simple, non-cliche, strictly avoiding generic 01/02/03 cards */}
        <div className="mt-16 bg-white border border-[#E4E1DA] rounded-xs p-6 sm:p-8">
          <div className="max-w-2xl mb-8">
            <span className="font-mono text-xs text-[#8B8479] tracking-wider uppercase">
              How the System Breaks Down Form
            </span>
            <h2 className="text-2xl font-bold text-[#1F1D1B] mt-1">
              Underdrawing mechanics grounded in classical atelier practice.
            </h2>
            <p className="text-sm text-[#8B8479] mt-2 leading-relaxed">
              Traditional drafting teachers don&apos;t tell you to trace contours directly. They teach
              cranial blocking, plumb lines, and eye levels. @rtx replicates this progression using three foundational layers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-[#1F1D1B] text-white flex items-center justify-center mb-3">
                <Eye className="w-4 h-4 text-[#4A90C4]" />
              </div>
              <h3 className="text-sm font-bold text-[#1F1D1B]">
                Computer Vision Contour Extraction
              </h3>
              <p className="text-xs text-[#8B8479] mt-2 leading-relaxed">
                Edge filtering and semantic segmentation identify volumetric masses, planar intersections, and occlusion edges rather than flat pixel noise.
              </p>
            </div>

            <div className="p-4 bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-[#1F1D1B] text-white flex items-center justify-center mb-3">
                <Layers className="w-4 h-4 text-[#B98A2E]" />
              </div>
              <h3 className="text-sm font-bold text-[#1F1D1B]">
                Machine Learning Step Ordering
              </h3>
              <p className="text-xs text-[#8B8479] mt-2 leading-relaxed">
                Structural models sequence strokes from foundational anchors (egg oval, center axes) to secondary volumes and final accent hatching.
              </p>
            </div>

            <div className="p-4 bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-[#1F1D1B] text-white flex items-center justify-center mb-3">
                <Compass className="w-4 h-4 text-[#C1502E]" />
              </div>
              <h3 className="text-sm font-bold text-[#1F1D1B]">
                Real-Time Stroke Feedback
              </h3>
              <p className="text-xs text-[#8B8479] mt-2 leading-relaxed">
                As your stylus moves, curvature metrics compare stroke angle and arc divergence against the guide, giving you specific corrective cues.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Bar */}
        <div className="mt-14 text-center border-t border-[#E4E1DA] pt-10">
          <h2 className="text-xl font-bold text-[#1F1D1B]">
            Ready to fill your sketchbook?
          </h2>
          <p className="text-xs text-[#8B8479] mt-1 max-w-md mx-auto">
            Choose any photo from your camera roll or pick a portrait to begin step 01.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <Link
              to="/new"
              className="px-6 py-2.5 bg-[#1F1D1B] text-white hover:bg-[#1F1D1B]/90 rounded-xs text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <span>Create New Drawing</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#4A90C4]" />
            </Link>
            <Link
              to="/drawings"
              className="px-4 py-2.5 bg-white text-[#1F1D1B] hover:bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs text-xs font-medium transition-colors"
            >
              Open Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
