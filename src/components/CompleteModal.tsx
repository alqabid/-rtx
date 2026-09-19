import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DrawingProject } from '../types';
import { Check, Download, Share2, Eye, Award, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface CompleteModalProps {
  project: DrawingProject;
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const CompleteModal: React.FC<CompleteModalProps> = ({
  project,
  isOpen,
  onClose,
  onRestart
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    // Generate a mock canvas download link
    const link = document.createElement('a');
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-drawing.png`;
    link.href = project.referenceImageUrl; // In a production setup, stage.toDataURL()
    link.click();
  };

  return (
    <div
      id="completion-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1F1D1B]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="completion-dialog"
        className="bg-white border border-[#E4E1DA] shadow-2xl rounded-xs max-w-lg w-full p-6 select-none animate-in zoom-in-95 duration-200"
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E1DA]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xs bg-[#B98A2E] flex items-center justify-center text-white">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F1D1B]">
                Drawing Complete
              </h3>
              <p className="text-[11px] font-mono text-[#8B8479]">
                ALL {project.totalSteps} STEPS RESOLVED TO INK
              </p>
            </div>
          </div>
          <span className="font-mono text-xs px-2 py-1 bg-[#E4E1DA]/40 text-[#1F1D1B] rounded-xs font-semibold">
            {project.accuracyOverall || 94}% MATCH
          </span>
        </div>

        {/* Thumbnail Preview Split View */}
        <div className="relative aspect-square max-h-64 mx-auto bg-[#F6F5F2] border border-[#E4E1DA] rounded-xs overflow-hidden mb-5">
          <img
            src={project.referenceImageUrl}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-90 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent flex items-end p-3">
            <div>
              <span className="text-xs font-bold text-[#1F1D1B] block">
                {project.title}
              </span>
              <span className="text-[11px] font-mono text-[#8B8479]">
                {project.category} • Completed in ~24 min
              </span>
            </div>
          </div>
        </div>

        {/* Score & Session Summary */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs mb-5 text-center">
          <div>
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">
              Steps Inked
            </span>
            <span className="text-sm font-bold text-[#1F1D1B]">
              {project.totalSteps} / {project.totalSteps}
            </span>
          </div>
          <div className="border-x border-[#E4E1DA]">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">
              Overall Accuracy
            </span>
            <span className="text-sm font-bold text-[#B98A2E]">
              {project.accuracyOverall || 94}%
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">
              Time
            </span>
            <span className="text-sm font-bold text-[#1F1D1B]">24m</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            id="modal-view-detail-btn"
            onClick={() => navigate(`/drawings/${project.id}`)}
            className="w-full py-2.5 bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white rounded-xs text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Eye className="w-4 h-4 text-[#4A90C4]" />
            <span>Open Step-by-Step History View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="modal-download-btn"
              onClick={handleDownload}
              className="py-2 px-3 border border-[#E4E1DA] hover:bg-[#F9F8F6] text-[#1F1D1B] rounded-xs text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8B8479]" />
              <span>Export PNG</span>
            </button>
            <button
              id="modal-share-btn"
              onClick={handleShare}
              className="py-2 px-3 border border-[#E4E1DA] hover:bg-[#F9F8F6] text-[#1F1D1B] rounded-xs text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8B8479]" />
              <span>{copied ? 'Link Copied!' : 'Share Piece'}</span>
            </button>
          </div>

          <div className="flex justify-between pt-2">
            <button
              id="modal-restart-btn"
              onClick={onRestart}
              className="text-xs text-[#8B8479] hover:text-[#1F1D1B] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Redraw from Step 01</span>
            </button>
            <button
              id="modal-sketchbook-btn"
              onClick={() => navigate('/drawings')}
              className="text-xs text-[#8B8479] hover:text-[#1F1D1B]"
            >
              Return to Sketchbook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
