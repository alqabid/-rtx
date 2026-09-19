import React from 'react';
import { StepFeedback } from '../types';
import { CheckCircle2, AlertTriangle, Info, ArrowRight, RotateCcw, X } from 'lucide-react';

interface FeedbackBannerProps {
  feedback: StepFeedback | null;
  onDismiss: () => void;
  onAdvanceStep: () => void;
  onRetryStep: () => void;
  hasNextStep: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  feedback,
  onDismiss,
  onAdvanceStep,
  onRetryStep,
  hasNextStep
}) => {
  if (!feedback) return null;

  const isMatch = feedback.type === 'match';
  const isCorrection = feedback.type === 'correction';

  // Palette compliance:
  // Match Gold: #B98A2E
  // Correction Red: #C1502E
  // Neutral: #1F1D1B / #8B8479

  return (
    <div
      id="step-feedback-banner"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl p-4 rounded-xs border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 duration-200 ${
        isMatch
          ? 'bg-white border-[#B98A2E] text-[#1F1D1B] ring-2 ring-[#B98A2E]/20'
          : isCorrection
          ? 'bg-white border-[#C1502E] text-[#1F1D1B] ring-2 ring-[#C1502E]/20'
          : 'bg-white border-[#8B8479] text-[#1F1D1B]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div
            className={`w-7 h-7 rounded-xs flex items-center justify-center shrink-0 mt-0.5 ${
              isMatch
                ? 'bg-[#B98A2E] text-white'
                : isCorrection
                ? 'bg-[#C1502E] text-white'
                : 'bg-[#1F1D1B] text-white'
            }`}
          >
            {isMatch ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : isCorrection ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4
                className={`text-sm font-bold ${
                  isMatch
                    ? 'text-[#B98A2E]'
                    : isCorrection
                    ? 'text-[#C1502E]'
                    : 'text-[#1F1D1B]'
                }`}
              >
                {feedback.title}
              </h4>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-xs bg-[#E4E1DA]/40 text-[#8B8479]">
                SCORE: {feedback.score}%
              </span>
            </div>

            <p className="text-xs text-[#1F1D1B] mt-1 leading-relaxed">
              {feedback.message}
            </p>

            {feedback.specificTip && (
              <div className="mt-1.5 text-[11px] font-mono text-[#8B8479] flex items-center gap-1.5">
                <span className="text-[#4A90C4]">GUIDANCE:</span>
                <span>{feedback.specificTip}</span>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          id="dismiss-feedback-btn"
          onClick={onDismiss}
          className="text-[#8B8479] hover:text-[#1F1D1B] p-1 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action CTA Bar */}
      <div className="mt-3 pt-3 border-t border-[#E4E1DA] flex items-center justify-end gap-2">
        {isCorrection && (
          <button
            id="feedback-retry-btn"
            onClick={onRetryStep}
            className="px-3 py-1.5 rounded-xs text-xs font-medium border border-[#E4E1DA] text-[#1F1D1B] hover:bg-[#F9F8F6] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Adjust Stroke</span>
          </button>
        )}

        <button
          id="feedback-advance-btn"
          onClick={onAdvanceStep}
          className={`px-4 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 text-white transition-all shadow-xs ${
            isMatch
              ? 'bg-[#B98A2E] hover:bg-[#A37825]'
              : isCorrection
              ? 'bg-[#1F1D1B] hover:bg-[#1F1D1B]/90'
              : 'bg-[#4A90C4] hover:bg-[#3E80B2]'
          }`}
        >
          <span>{hasNextStep ? 'Next Step' : 'View Completed Drawing'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
