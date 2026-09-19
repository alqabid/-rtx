import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDrawing } from '../context/DrawingContext';
import { DrawingCanvas, CANVAS_WIDTH, CANVAS_HEIGHT } from '../components/DrawingCanvas';
import { Toolbar } from '../components/Toolbar';
import { StepPanel } from '../components/StepPanel';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { CompleteModal } from '../components/CompleteModal';
import { DrawingStroke, StepFeedback, LayerVisibility, DrawingStep } from '../types';
import { ArrowLeft, Save, Sparkles, Check, HelpCircle, Layers, CheckCircle } from 'lucide-react';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, updateProject } = useDrawing();

  // Load project or fallback to first project
  const project = getProjectById(id || 'proj-1');

  // Step state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [resolvingStepId, setResolvingStepId] = useState<number | null>(null);

  // Drawing strokes
  const [currentStepStrokes, setCurrentStepStrokes] = useState<DrawingStroke[]>([]);
  const [strokeHistory, setStrokeHistory] = useState<DrawingStroke[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingStroke[][]>([]);
  const [pastCompletedStrokes, setPastCompletedStrokes] = useState<DrawingStroke[]>([]);

  // Tools & Canvas settings
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoom, setZoom] = useState(1.0);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);

  // Layers
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    reference: true,
    guide: true,
    userInk: true,
    completedLayers: true,
    referenceOpacity: 0.35
  });

  // Feedback & Modal
  const [feedback, setFeedback] = useState<StepFeedback | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // Sync project data on mount or step change
  useEffect(() => {
    if (project) {
      // Find first uncompleted step or keep current
      const firstIncomplete = project.steps.findIndex(s => !s.isCompleted);
      if (firstIncomplete !== -1 && !project.isCompleted) {
        setCurrentStepIndex(firstIncomplete);
      }
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="min-h-screen sketchbook-bg flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 border border-[#E4E1DA] rounded-xs max-w-md">
          <h2 className="text-lg font-bold text-[#1F1D1B] mb-2">Study Not Found</h2>
          <p className="text-xs text-[#8B8479] mb-4">
            The requested drawing study could not be loaded from local storage.
          </p>
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
  const currentStep = steps[currentStepIndex] || steps[0];
  const completedSteps = steps.filter(s => s.isCompleted);

  // Undo / Redo logic
  const handleUndo = () => {
    if (currentStepStrokes.length === 0) return;
    setRedoStack(prev => [...prev, [...currentStepStrokes]]);
    setCurrentStepStrokes(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextStrokes = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setCurrentStepStrokes(nextStrokes);
  };

  const handleClearStrokes = () => {
    if (currentStepStrokes.length === 0) return;
    setRedoStack(prev => [...prev, [...currentStepStrokes]]);
    setCurrentStepStrokes([]);
  };

  const resetView = () => {
    setZoom(1.0);
    setStagePos({ x: 0, y: 0 });
  };

  // Check Step Feedback Logic
  const handleCheckStep = () => {
    setIsChecking(true);
    setFeedback(null);

    setTimeout(() => {
      setIsChecking(false);

      if (currentStepStrokes.length === 0) {
        // Neutral Guidance State
        setFeedback({
          type: 'neutral',
          title: 'No strokes detected yet',
          message:
            'Use the ink pen on the canvas to block in the blue guide line before checking.',
          score: 0,
          specificTip: `Follow the ${currentStep.title} guide lines visible in blue pencil.`
        });
        return;
      }

      // Check stroke complexity or slight correction simulation
      // If user drew only 1 stroke on a complex step, suggest adjustment
      const isSingleShortStroke = currentStepStrokes.length === 1 && (currentStepStrokes[0].points.length < 10);

      if (isSingleShortStroke) {
        // Correction Red state
        setFeedback({
          type: 'correction',
          title: 'Try adjusting the stroke curvature',
          message:
            'Your line terminates prematurely and pulls slightly too far inwards. Extend the arc along the outer blue guide line.',
          score: 68,
          specificTip: 'Keep your stroke loose and match the continuous sweep from top anchor to base.'
        });
      } else {
        // Match Gold state!
        const score = Math.floor(91 + Math.random() * 8); // 91% - 98%
        
        // Trigger deliberate motion moment:
        // Guide line visibly resolves from blue guide to solid ink!
        setResolvingStepId(currentStep.id);

        setFeedback({
          type: 'match',
          title: 'Well matched — stroke angle verified',
          message: `Stroke contour aligns within ${score}% precision. The blue guide has resolved to permanent solid ink.`,
          score: score,
          specificTip: `Step 0${currentStep.id} structural foundation anchored.`
        });

        // Resolve guide and mark completed after motion moment
        setTimeout(() => {
          const updatedSteps = project.steps.map((s, idx) =>
            idx === currentStepIndex
              ? { ...s, isCompleted: true, accuracyScore: score }
              : s
          );

          const allCompleted = updatedSteps.every(s => s.isCompleted);
          const newCompletedCount = updatedSteps.filter(s => s.isCompleted).length;

          // Save current strokes to past strokes
          setPastCompletedStrokes(prev => [...prev, ...currentStepStrokes]);

          const updatedProject = {
            ...project,
            steps: updatedSteps,
            isCompleted: allCompleted,
            progressPercentage: Math.round((newCompletedCount / project.totalSteps) * 100),
            updatedAt: 'Just now'
          };

          updateProject(updatedProject);
          setResolvingStepId(null);

          if (allCompleted) {
            setIsCompleteModalOpen(true);
          }
        }, 1100);
      }
    }, 700);
  };

  // Step advancement
  const handleAdvanceStep = () => {
    setFeedback(null);
    setCurrentStepStrokes([]);
    setRedoStack([]);

    if (currentStepIndex < project.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleteModalOpen(true);
    }
  };

  const handleRetryStep = () => {
    setFeedback(null);
  };

  const handleSelectStep = (idx: number) => {
    if (idx === currentStepIndex) return;
    setFeedback(null);
    setCurrentStepStrokes([]);
    setRedoStack([]);
    setCurrentStepIndex(idx);
  };

  const handleRestartStudy = () => {
    const resetSteps = project.steps.map(s => ({ ...s, isCompleted: false, accuracyScore: undefined }));
    updateProject({
      ...project,
      steps: resetSteps,
      isCompleted: false,
      progressPercentage: 0
    });
    setCurrentStepIndex(0);
    setCurrentStepStrokes([]);
    setPastCompletedStrokes([]);
    setIsCompleteModalOpen(false);
  };

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col bg-[#F6F5F2] overflow-hidden select-none">
      {/* Top Drafting Bar (Workspace header) */}
      <div className="bg-white border-b border-[#E4E1DA] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/drawings"
            id="editor-back-link"
            className="p-1 text-[#8B8479] hover:text-[#1F1D1B] rounded-xs hover:bg-[#E4E1DA]/30 transition-colors"
            title="Back to Sketchbook"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1F1D1B]">{project.title}</span>
            <span className="text-[#E4E1DA]">•</span>
            <span className="text-[11px] font-mono text-[#8B8479]">
              {project.category}
            </span>
          </div>
        </div>

        {/* Center Progress Cue */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#8B8479]">
          <span>STEP 0{currentStepIndex + 1} OF 0{steps.length}:</span>
          <span className="font-semibold text-[#1F1D1B]">{currentStep.title}</span>
          {currentStep.isCompleted && (
            <span className="text-[#B98A2E] flex items-center gap-0.5">
              <Check className="w-3 h-3" />
              <span>INKED</span>
            </span>
          )}
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-2">
          {project.isCompleted && (
            <button
              onClick={() => setIsCompleteModalOpen(true)}
              className="px-2.5 py-1 bg-[#B98A2E] text-white rounded-xs text-xs font-medium flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Completed</span>
            </button>
          )}
          <span className="font-mono text-[11px] text-[#8B8479] px-2 py-0.5 bg-[#E4E1DA]/30 rounded-xs">
            {completedSteps.length}/{steps.length} RESOLVED
          </span>
        </div>
      </div>

      {/* Main Drafting Table: Asymmetric Layout with Dominant Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Dominant Canvas Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Drafting Toolbar */}
          <Toolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
            canUndo={currentStepStrokes.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClearStrokes}
            layerVisibility={layerVisibility}
            setLayerVisibility={setLayerVisibility}
            zoom={zoom}
            setZoom={setZoom}
            isPanMode={isPanMode}
            setIsPanMode={setIsPanMode}
            resetView={resetView}
            onCheckStep={handleCheckStep}
            isChecking={isChecking}
            hasStrokes={currentStepStrokes.length > 0}
          />

          {/* Konva Canvas Surface */}
          <div className="flex-1 relative overflow-hidden">
            <DrawingCanvas
              referenceImageUrl={project.referenceImageUrl}
              currentStep={currentStep}
              completedSteps={completedSteps}
              userStrokes={currentStepStrokes}
              setUserStrokes={setCurrentStepStrokes}
              pastStepStrokes={pastCompletedStrokes}
              layerVisibility={layerVisibility}
              activeTool={activeTool}
              strokeWidth={strokeWidth}
              resolvingStepId={resolvingStepId}
              zoom={zoom}
              stagePos={stagePos}
              setStagePos={setStagePos}
              isPanMode={isPanMode}
            />
          </div>

          {/* Feedback Toast / Banner */}
          <FeedbackBanner
            feedback={feedback}
            onDismiss={() => setFeedback(null)}
            onAdvanceStep={handleAdvanceStep}
            onRetryStep={handleRetryStep}
            hasNextStep={currentStepIndex < steps.length - 1}
          />
        </div>

        {/* Right Rail: Sequential Step Panel */}
        <StepPanel
          steps={steps}
          currentStepIndex={currentStepIndex}
          onSelectStep={handleSelectStep}
          resolvingStepId={resolvingStepId}
          overallAccuracy={project.accuracyOverall}
          totalCompleted={completedSteps.length}
        />
      </div>

      {/* Completion Modal */}
      <CompleteModal
        project={project}
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onRestart={handleRestartStudy}
      />
    </div>
  );
};
