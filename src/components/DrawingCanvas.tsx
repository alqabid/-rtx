import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Line, Image as KonvaImage, Rect, Circle, Text, Group } from 'react-konva';
import { DrawingStroke, DrawingStep, LayerVisibility } from '../types';
import Konva from 'konva';

interface DrawingCanvasProps {
  referenceImageUrl: string;
  currentStep: DrawingStep;
  completedSteps: DrawingStep[];
  userStrokes: DrawingStroke[];
  setUserStrokes: React.Dispatch<React.SetStateAction<DrawingStroke[]>>;
  pastStepStrokes: DrawingStroke[];
  layerVisibility: LayerVisibility;
  activeTool: 'pen' | 'eraser';
  strokeWidth: number;
  resolvingStepId: number | null;
  onStrokeDrawn?: () => void;
  zoom: number;
  stagePos: { x: number; y: number };
  setStagePos: (pos: { x: number; y: number }) => void;
  isPanMode: boolean;
}

export const CANVAS_WIDTH = 700;
export const CANVAS_HEIGHT = 700;

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  referenceImageUrl,
  currentStep,
  completedSteps,
  userStrokes,
  setUserStrokes,
  pastStepStrokes,
  layerVisibility,
  activeTool,
  strokeWidth,
  resolvingStepId,
  onStrokeDrawn,
  zoom,
  stagePos,
  setStagePos,
  isPanMode
}) => {
  const [currentLine, setCurrentLine] = useState<number[] | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const isDrawing = useRef(false);

  // Load reference image
  useEffect(() => {
    if (!referenceImageUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = referenceImageUrl;
    img.onload = () => {
      setImageObj(img);
    };
  }, [referenceImageUrl]);

  // Handle pointer down (Mouse or Touch)
  const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (isPanMode) return;

    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getRelativePointerPosition();
    if (!pointerPos) return;

    // Constrain inside canvas boundaries
    const clampedX = Math.max(0, Math.min(CANVAS_WIDTH, pointerPos.x));
    const clampedY = Math.max(0, Math.min(CANVAS_HEIGHT, pointerPos.y));

    setCurrentLine([clampedX, clampedY]);
  };

  // Handle pointer move
  const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || isPanMode) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getRelativePointerPosition();
    if (!pointerPos) return;

    const clampedX = Math.max(0, Math.min(CANVAS_WIDTH, pointerPos.x));
    const clampedY = Math.max(0, Math.min(CANVAS_HEIGHT, pointerPos.y));

    setCurrentLine(prev => (prev ? [...prev, clampedX, clampedY] : [clampedX, clampedY]));
  };

  // Handle pointer up
  const handlePointerUp = () => {
    if (!isDrawing.current || isPanMode) return;
    isDrawing.current = false;

    if (currentLine && currentLine.length >= 4) {
      const newStroke: DrawingStroke = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        points: currentLine,
        color: activeTool === 'pen' ? '#1F1D1B' : '#FFFFFF',
        strokeWidth: activeTool === 'pen' ? strokeWidth : strokeWidth * 2.5,
        tool: activeTool,
        stepId: currentStep.id,
        timestamp: Date.now()
      };

      setUserStrokes(prev => [...prev, newStroke]);
      if (onStrokeDrawn) onStrokeDrawn();
    }
    setCurrentLine(null);
  };

  // Drag stage for pan mode
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (isPanMode) {
      setStagePos({
        x: e.target.x(),
        y: e.target.y()
      });
    }
  };

  const isResolving = resolvingStepId === currentStep.id;

  return (
    <div
      id="canvas-container"
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-[#F6F5F2]"
      style={{ touchAction: 'none' }}
    >
      {/* Outer drafting border & shadow */}
      <div
        className="relative bg-white shadow-md border border-[#E4E1DA] rounded-xs"
        style={{
          width: CANVAS_WIDTH * zoom,
          height: CANVAS_HEIGHT * zoom
        }}
      >
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH * zoom}
          height={CANVAS_HEIGHT * zoom}
          scaleX={zoom}
          scaleY={zoom}
          x={stagePos.x}
          y={stagePos.y}
          draggable={isPanMode}
          onDragEnd={handleDragEnd}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{
            cursor: isPanMode ? 'grab' : activeTool === 'pen' ? 'crosshair' : 'cell'
          }}
        >
          {/* Base white surface without texture */}
          <Layer listening={false}>
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill="#FFFFFF"
            />
          </Layer>

          {/* Layer 1: Reference Photo (Ghosted / Dimmable) */}
          {layerVisibility.reference && imageObj && (
            <Layer listening={false}>
              <KonvaImage
                image={imageObj}
                x={0}
                y={0}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                opacity={layerVisibility.referenceOpacity}
              />
            </Layer>
          )}

          {/* Layer 2: Completed Previous Steps (Inked foundations) */}
          {layerVisibility.completedLayers && (
            <Layer listening={false}>
              {/* Previous steps' guide lines resolved to permanent warm ink */}
              {completedSteps.map(step => (
                <Group key={`completed-step-${step.id}`}>
                  {step.guidePaths.map(path => (
                    <Line
                      key={`guide-completed-${path.id}`}
                      points={path.points}
                      stroke="#1F1D1B"
                      strokeWidth={1.8}
                      tension={path.tension || 0.25}
                      closed={path.closed || false}
                      opacity={0.82}
                      lineCap="round"
                      lineJoin="round"
                    />
                  ))}
                </Group>
              ))}

              {/* User's past completed strokes from previous steps */}
              {pastStepStrokes.map(stroke => (
                <Line
                  key={`past-stroke-${stroke.id}`}
                  points={stroke.points}
                  stroke={stroke.color}
                  strokeWidth={stroke.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  tension={0.15}
                  opacity={stroke.tool === 'pen' ? 0.75 : 1}
                />
              ))}
            </Layer>
          )}

          {/* Layer 3: AI Guide Lines for Current Step */}
          {/* Deliberate motion moment: when resolvingStepId matches, stroke resolves from #4A90C4 to #1F1D1B */}
          {layerVisibility.guide && (
            <Layer listening={false}>
              {currentStep.guidePaths.map(path => {
                const strokeColor = isResolving ? '#1F1D1B' : '#4A90C4';
                const strokeW = isResolving ? 2.5 : 2;

                return (
                  <Group key={`current-guide-${path.id}`}>
                    <Line
                      points={path.points}
                      stroke={strokeColor}
                      strokeWidth={strokeW}
                      dash={isResolving ? [] : [6, 3]}
                      tension={path.tension || 0.25}
                      closed={path.closed || false}
                      opacity={isResolving ? 1 : 0.9}
                      lineCap="round"
                      lineJoin="round"
                    />
                    {/* Tiny technical endpoint anchors in Guide Blue */}
                    {!isResolving && path.points.length >= 2 && (
                      <Circle
                        x={path.points[0]}
                        y={path.points[1]}
                        radius={2.5}
                        fill="#4A90C4"
                      />
                    )}
                  </Group>
                );
              })}
            </Layer>
          )}

          {/* Layer 4: User's Active Drawing Layer */}
          {layerVisibility.userInk && (
            <Layer>
              {/* Existing strokes for the current step */}
              {userStrokes.map(stroke => (
                <Line
                  key={stroke.id}
                  points={stroke.points}
                  stroke={stroke.color}
                  strokeWidth={stroke.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  tension={0.2}
                  opacity={stroke.tool === 'pen' ? 0.95 : 1}
                />
              ))}

              {/* Real-time active drawing stroke */}
              {currentLine && (
                <Line
                  points={currentLine}
                  stroke={activeTool === 'pen' ? '#1F1D1B' : '#FFFFFF'}
                  strokeWidth={activeTool === 'pen' ? strokeWidth : strokeWidth * 2.5}
                  lineCap="round"
                  lineJoin="round"
                  tension={0.15}
                  opacity={0.95}
                />
              )}
            </Layer>
          )}

          {/* Layer 5: Technical Axis / Coordinate Watermark */}
          <Layer listening={false}>
            <Text
              x={12}
              y={CANVAS_HEIGHT - 22}
              text={`@RTX DRAFTING CANVAS • 700x700 • STEP 0${currentStep.id}`}
              fontSize={10}
              fontFamily="IBM Plex Mono"
              fill="#8B8479"
              opacity={0.4}
            />
          </Layer>
        </Stage>

        {/* Resolution Flash / Pulse Effect */}
        {isResolving && (
          <div className="absolute inset-0 border-2 border-[#B98A2E] pointer-events-none animate-pulse transition-opacity" />
        )}
      </div>

      {/* Canvas Dimensions & Status indicator */}
      <div className="absolute bottom-3 left-4 hidden sm:flex items-center gap-3 px-2.5 py-1 bg-white/90 border border-[#E4E1DA] rounded-xs text-[11px] font-mono text-[#8B8479]">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A90C4]" />
          <span>700×700 PX</span>
        </span>
        <span className="text-[#E4E1DA]">|</span>
        <span>ZOOM: {Math.round(zoom * 100)}%</span>
        <span className="text-[#E4E1DA]">|</span>
        <span>STROKES: {userStrokes.length}</span>
      </div>
    </div>
  );
};
