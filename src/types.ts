export interface Point {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  points: number[]; // [x1, y1, x2, y2, ...]
  color: string;
  strokeWidth: number;
  tool: 'pen' | 'eraser';
  stepId: number;
  timestamp: number;
}

export interface GuidePath {
  id: string;
  points: number[];
  label?: string;
  tension?: number;
  closed?: boolean;
}

export interface DrawingStep {
  id: number;
  title: string;
  instruction: string;
  anatomicalTarget: string;
  guidePaths: GuidePath[];
  isCompleted: boolean;
  accuracyScore?: number;
  feedbackText?: string;
}

export interface DrawingProject {
  id: string;
  title: string;
  category: 'Portrait' | 'Still Life' | 'Anatomy' | 'Architecture';
  referenceImageUrl: string;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  currentStepIndex: number;
  isCompleted: boolean;
  totalSteps: number;
  accuracyOverall?: number;
  timeSpentMinutes: number;
  steps: DrawingStep[];
  completedStrokes: DrawingStroke[]; // strokes from earlier steps
  thumbnailUrl?: string;
}

export type FeedbackType = 'match' | 'correction' | 'neutral';

export interface StepFeedback {
  type: FeedbackType;
  title: string;
  message: string;
  score: number;
  specificTip?: string;
  highlightCoordinates?: { x: number; y: number };
}

export interface LayerVisibility {
  reference: boolean;
  guide: boolean;
  userInk: boolean;
  completedLayers: boolean;
  referenceOpacity: number;
}
