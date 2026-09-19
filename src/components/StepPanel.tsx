import React from 'react';
import { DrawingStep } from '../types';
import { Check, ChevronRight, Sparkles, HelpCircle } from 'lucide-react';

interface StepPanelProps {
  steps: DrawingStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  resolvingStepId: number | null;
  overallAccuracy?: number;
  totalCompleted: number;
}

export const StepPanel: React.FC<StepPanelProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
  resolvingStepId,
  overallAccuracy = 92,
  totalCompleted
}) => {
  const currentStep = steps[currentStepIndex];

  return (
    <aside
      id="editor-step-rail"
      className="w-full lg:w-80 bg-white border-l border-[#E4E1DA] flex flex-col h-full select-none"
    >
      {/* Rail Header */}
      <div className="p-4 border-b border-[#E4E1DA] bg-white">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4A90C4]" />
            <h2 className="text-sm font-semibold text-[#1F1D1B] tracking-tight">
              Guided Breakdown
            </h2>
          </div>
          <span className="font-mono text-xs text-[#8B8479]">
            {totalCompleted}/{steps.length} STEPS
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E4E1DA]/60 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className="bg-[#B98A2E] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(totalCompleted / steps.length) * 100}%` }}
          />
        </div>

        {/* Current Active Step Highlight Box */}
        {currentStep && (
          <div className="mt-3 p-2.5 bg-[#F9F8F6] border border-[#E4E1DA] rounded-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#4A90C4] font-semibold mb-1">
              <span>TARGET ANCHOR</span>
              <span>STEP 0{currentStep.id}</span>
            </div>
            <p className="text-xs text-[#1F1D1B] font-medium leading-snug">
              {currentStep.instruction}
            </p>
            <div className="mt-1 text-[11px] text-[#8B8479] flex items-center gap-1">
              <span className="text-[#4A90C4]">●</span>
              <span>{currentStep.anatomicalTarget}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sequential Numbered Steps List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[11px] font-mono text-[#8B8479] px-2 py-1 uppercase tracking-wider">
          Sequence Breakdown
        </div>

        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = step.isCompleted;
          const isResolving = resolvingStepId === step.id;

          return (
            <button
              key={step.id}
              id={`step-item-${step.id}`}
              onClick={() => onSelectStep(idx)}
              className={`w-full text-left p-3 rounded-xs border transition-all relative ${
                isResolving
                  ? 'border-[#B98A2E] bg-[#B98A2E]/10 ring-1 ring-[#B98A2E]'
                  : isCurrent
                  ? 'border-[#4A90C4] bg-white ring-1 ring-[#4A90C4]/30 shadow-xs'
                  : isCompleted
                  ? 'border-[#E4E1DA] bg-white/70 hover:bg-[#F9F8F6] text-[#1F1D1B]'
                  : 'border-transparent hover:border-[#E4E1DA] hover:bg-[#F9F8F6] opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Numbered Step Marker (IBM Plex Mono) */}
                <div
                  className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-[#B98A2E] text-white'
                      : isCurrent
                      ? 'bg-[#4A90C4] text-white'
                      : 'bg-[#E4E1DA] text-[#8B8479]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : `0${step.id}`}
                </div>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isCurrent
                          ? 'text-[#1F1D1B]'
                          : isCompleted
                          ? 'text-[#1F1D1B]'
                          : 'text-[#8B8479]'
                      }`}
                    >
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-[#4A90C4] font-medium bg-[#4A90C4]/10 px-1.5 py-0.5 rounded-xs">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8B8479] line-clamp-2 mt-0.5 leading-relaxed">
                    {step.instruction}
                  </p>

                  {/* Accuracy badge if recorded */}
                  {step.accuracyScore && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-[#B98A2E]">
                      <span>MATCH: {step.accuracyScore}%</span>
                    </div>
                  )}
                </div>

                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 mt-1 transition-transform ${
                    isCurrent ? 'text-[#4A90C4] translate-x-0.5' : 'text-[#E4E1DA]'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Notes & Drafting Advice */}
      <div className="p-3 border-t border-[#E4E1DA] bg-[#F9F8F6] text-xs">
        <div className="flex items-center gap-1.5 text-[#8B8479] mb-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#4A90C4]" />
          <span className="font-semibold text-[11px] text-[#1F1D1B]">Drafting Tip</span>
        </div>
        <p className="text-[11px] text-[#8B8479] leading-relaxed">
          Draw fluid, continuous lines along the blue pencil guides. You can erase or re-stroke freely before tapping &ldquo;Check My Step&rdquo;.
        </p>
      </div>
    </aside>
  );
};
