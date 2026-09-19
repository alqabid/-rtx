import React from 'react';
import {
  Pen,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  Sliders,
  Layers
} from 'lucide-react';
import { LayerVisibility } from '../types';

interface ToolbarProps {
  activeTool: 'pen' | 'eraser';
  setActiveTool: (tool: 'pen' | 'eraser') => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  layerVisibility: LayerVisibility;
  setLayerVisibility: React.Dispatch<React.SetStateAction<LayerVisibility>>;
  zoom: number;
  setZoom: (zoom: number) => void;
  isPanMode: boolean;
  setIsPanMode: (pan: boolean) => void;
  resetView: () => void;
  onCheckStep: () => void;
  isChecking: boolean;
  hasStrokes: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  strokeWidth,
  setStrokeWidth,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  layerVisibility,
  setLayerVisibility,
  zoom,
  setZoom,
  isPanMode,
  setIsPanMode,
  resetView,
  onCheckStep,
  isChecking,
  hasStrokes
}) => {
  const [showLayerPanel, setShowLayerPanel] = React.useState(false);

  const toggleLayer = (layer: keyof Omit<LayerVisibility, 'referenceOpacity'>) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleZoom = (delta: number) => {
    setZoom(Math.min(2.0, Math.max(0.6, Math.round((zoom + delta) * 10) / 10)));
  };

  return (
    <div
      id="canvas-toolbar"
      className="bg-white border-b border-[#E4E1DA] px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none"
    >
      {/* Left section: Drawing tools (Pen, Eraser, Widths) */}
      <div className="flex items-center gap-2">
        {/* Pen Tool */}
        <button
          id="tool-pen-btn"
          onClick={() => {
            setActiveTool('pen');
            setIsPanMode(false);
          }}
          className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 text-xs font-medium transition-all ${
            activeTool === 'pen' && !isPanMode
              ? 'bg-[#1F1D1B] text-white shadow-xs'
              : 'text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/30'
          }`}
          title="Pen (P)"
        >
          <Pen className="w-3.5 h-3.5" />
          <span>Ink Pen</span>
        </button>

        {/* Eraser Tool */}
        <button
          id="tool-eraser-btn"
          onClick={() => {
            setActiveTool('eraser');
            setIsPanMode(false);
          }}
          className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 text-xs font-medium transition-all ${
            activeTool === 'eraser' && !isPanMode
              ? 'bg-[#1F1D1B] text-white shadow-xs'
              : 'text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/30'
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Eraser</span>
        </button>

        {/* Stroke Weight Selector */}
        <div className="flex items-center gap-1 pl-2 border-l border-[#E4E1DA]">
          <span className="text-[11px] font-mono text-[#8B8479] mr-1 hidden sm:inline">
            WT:
          </span>
          {[2, 4, 7].map(w => (
            <button
              key={w}
              id={`stroke-width-${w}`}
              onClick={() => setStrokeWidth(w)}
              className={`w-6 h-6 rounded-xs flex items-center justify-center transition-all ${
                strokeWidth === w
                  ? 'bg-[#E4E1DA] text-[#1F1D1B] font-bold ring-1 ring-[#1F1D1B]/40'
                  : 'text-[#8B8479] hover:bg-[#E4E1DA]/30'
              }`}
              title={`Stroke width ${w}px`}
            >
              <div
                className="rounded-full bg-[#1F1D1B]"
                style={{ width: Math.max(2, w), height: Math.max(2, w) }}
              />
            </button>
          ))}
        </div>

        {/* Undo / Redo / Clear */}
        <div className="flex items-center gap-1 pl-2 border-l border-[#E4E1DA]">
          <button
            id="tool-undo-btn"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-xs transition-colors ${
              canUndo
                ? 'text-[#1F1D1B] hover:bg-[#E4E1DA]/40'
                : 'text-[#8B8479]/40 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            id="tool-redo-btn"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-xs transition-colors ${
              canRedo
                ? 'text-[#1F1D1B] hover:bg-[#E4E1DA]/40'
                : 'text-[#8B8479]/40 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            id="tool-clear-btn"
            onClick={onClear}
            disabled={!hasStrokes}
            className={`p-1.5 rounded-xs transition-colors ${
              hasStrokes
                ? 'text-[#8B8479] hover:text-[#C1502E] hover:bg-[#E4E1DA]/40'
                : 'text-[#8B8479]/40 cursor-not-allowed'
            }`}
            title="Clear Step Strokes"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right section: Layer Toggles, Zoom, and "Check My Step" */}
      <div className="flex items-center gap-3">
        {/* Layer Visibility Popup / Quick buttons */}
        <div className="relative">
          <button
            id="toggle-layers-dropdown"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 text-xs font-medium border transition-colors ${
              showLayerPanel
                ? 'bg-[#E4E1DA]/60 border-[#8B8479] text-[#1F1D1B]'
                : 'border-[#E4E1DA] text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>

          {/* Layer Controls Dropdown */}
          {showLayerPanel && (
            <div
              id="layers-popover"
              className="absolute right-0 top-full mt-1 w-64 bg-white border border-[#E4E1DA] shadow-lg rounded-xs p-3 z-50 text-xs"
            >
              <div className="font-mono text-[11px] font-semibold text-[#8B8479] pb-2 mb-2 border-b border-[#E4E1DA] uppercase tracking-wider">
                Drafting Layers
              </div>

              {/* Reference Photo Toggle */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8B8479]" />
                  <span className="text-[#1F1D1B] font-medium">Reference Photo</span>
                </div>
                <button
                  id="toggle-layer-reference"
                  onClick={() => toggleLayer('reference')}
                  className="p-1 text-[#8B8479] hover:text-[#1F1D1B]"
                >
                  {layerVisibility.reference ? (
                    <Eye className="w-3.5 h-3.5 text-[#1F1D1B]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#8B8479]/50" />
                  )}
                </button>
              </div>

              {/* Reference Opacity Slider */}
              {layerVisibility.reference && (
                <div className="pl-4 pr-1 pb-2">
                  <div className="flex justify-between text-[10px] font-mono text-[#8B8479] mb-1">
                    <span>Opacity</span>
                    <span>{Math.round(layerVisibility.referenceOpacity * 100)}%</span>
                  </div>
                  <input
                    id="reference-opacity-slider"
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={layerVisibility.referenceOpacity}
                    onChange={e =>
                      setLayerVisibility(prev => ({
                        ...prev,
                        referenceOpacity: parseFloat(e.target.value)
                      }))
                    }
                    className="w-full h-1 bg-[#E4E1DA] rounded-lg appearance-none cursor-pointer accent-[#1F1D1B]"
                  />
                </div>
              )}

              {/* AI Guide Line (Blue Pencil) */}
              <div className="flex items-center justify-between py-1.5 border-t border-[#E4E1DA]/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4A90C4]" />
                  <span className="text-[#1F1D1B] font-medium">AI Guide Blue</span>
                </div>
                <button
                  id="toggle-layer-guide"
                  onClick={() => toggleLayer('guide')}
                  className="p-1 text-[#8B8479] hover:text-[#1F1D1B]"
                >
                  {layerVisibility.guide ? (
                    <Eye className="w-3.5 h-3.5 text-[#4A90C4]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#8B8479]/50" />
                  )}
                </button>
              </div>

              {/* User Ink */}
              <div className="flex items-center justify-between py-1.5 border-t border-[#E4E1DA]/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1F1D1B]" />
                  <span className="text-[#1F1D1B] font-medium">Current Step Ink</span>
                </div>
                <button
                  id="toggle-layer-user-ink"
                  onClick={() => toggleLayer('userInk')}
                  className="p-1 text-[#8B8479] hover:text-[#1F1D1B]"
                >
                  {layerVisibility.userInk ? (
                    <Eye className="w-3.5 h-3.5 text-[#1F1D1B]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#8B8479]/50" />
                  )}
                </button>
              </div>

              {/* Previous Completed Steps */}
              <div className="flex items-center justify-between py-1.5 border-t border-[#E4E1DA]/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B98A2E]" />
                  <span className="text-[#1F1D1B] font-medium">Underlying Steps</span>
                </div>
                <button
                  id="toggle-layer-completed"
                  onClick={() => toggleLayer('completedLayers')}
                  className="p-1 text-[#8B8479] hover:text-[#1F1D1B]"
                >
                  {layerVisibility.completedLayers ? (
                    <Eye className="w-3.5 h-3.5 text-[#B98A2E]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#8B8479]/50" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pan Hand Mode */}
        <button
          id="tool-pan-btn"
          onClick={() => setIsPanMode(!isPanMode)}
          className={`p-1.5 rounded-xs transition-colors ${
            isPanMode
              ? 'bg-[#1F1D1B] text-white'
              : 'text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/30'
          }`}
          title="Pan Canvas (Hold Space)"
        >
          <Hand className="w-4 h-4" />
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-l border-[#E4E1DA] pl-2">
          <button
            id="zoom-out-btn"
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/30 rounded-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-[#1F1D1B] w-9 text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            id="zoom-in-btn"
            onClick={() => handleZoom(0.15)}
            className="p-1.5 text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/30 rounded-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="zoom-reset-btn"
            onClick={resetView}
            className="p-1.5 text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/30 rounded-xs ml-0.5"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Action: "Check my step" button */}
        <button
          id="check-step-primary-btn"
          onClick={onCheckStep}
          disabled={isChecking}
          className={`px-4 py-1.5 rounded-xs font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs ${
            isChecking
              ? 'bg-[#8B8479] text-white cursor-wait'
              : hasStrokes
              ? 'bg-[#4A90C4] hover:bg-[#3E80B2] text-white ring-2 ring-[#4A90C4]/20'
              : 'bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white'
          }`}
        >
          {isChecking ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing strokes...</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>Check My Step</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
