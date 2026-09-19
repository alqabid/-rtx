import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDrawing } from '../context/DrawingContext';
import { Plus, FolderOpen, Check, Clock, Trash2, ArrowRight, Sparkles, Filter, Layers, RotateCcw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { projects, deleteProject, resetToSampleData } = useDrawing();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Portrait' | 'Still Life'>('All');
  const [forceEmptyState, setForceEmptyState] = useState(false);

  const displayedProjects = forceEmptyState
    ? []
    : projects.filter(p => {
        if (filter === 'In Progress') return !p.isCompleted;
        if (filter === 'Completed') return p.isCompleted;
        if (filter === 'Portrait') return p.category === 'Portrait';
        if (filter === 'Still Life') return p.category === 'Still Life';
        return true;
      });

  const completedCount = projects.filter(p => p.isCompleted).length;
  const inProgressCount = projects.length - completedCount;

  return (
    <div className="min-h-screen sketchbook-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Dashboard Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E1DA]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8B8479] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#4A90C4]" />
              <span>SKETCHBOOK ARCHIVE • MY DRAWINGS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1D1B] tracking-tight">
              My Drawings
            </h1>
            <p className="text-xs text-[#8B8479] mt-1">
              Past and active studies deconstructed into guided underdrawing layers.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="toggle-empty-state-btn"
              onClick={() => setForceEmptyState(!forceEmptyState)}
              className="px-3 py-2 text-xs font-mono border border-[#E4E1DA] rounded-xs bg-white text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#F9F8F6] transition-colors"
              title="Toggle to preview the interface empty state"
            >
              {forceEmptyState ? 'Restore Sample Drawings' : 'Simulate Empty State'}
            </button>

            <Link
              to="/new"
              id="dashboard-new-drawing-btn"
              className="px-4 py-2 bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#4A90C4]" />
              <span>New Drawing</span>
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">Total Studies</span>
            <span className="text-lg font-bold text-[#1F1D1B]">{forceEmptyState ? 0 : projects.length}</span>
          </div>
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">In Progress</span>
            <span className="text-lg font-bold text-[#4A90C4]">{forceEmptyState ? 0 : inProgressCount}</span>
          </div>
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">Completed Pieces</span>
            <span className="text-lg font-bold text-[#B98A2E]">{forceEmptyState ? 0 : completedCount}</span>
          </div>
          <div className="p-3 bg-white border border-[#E4E1DA] rounded-xs">
            <span className="text-[10px] font-mono text-[#8B8479] uppercase block">Average Accuracy</span>
            <span className="text-lg font-bold text-[#1F1D1B]">{forceEmptyState ? '—' : '94%'}</span>
          </div>
        </div>

        {/* Filter Navigation */}
        {!forceEmptyState && projects.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-[#E4E1DA]/60">
            <span className="text-xs font-mono text-[#8B8479] mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>FILTER:</span>
            </span>
            {(['All', 'In Progress', 'Completed', 'Portrait', 'Still Life'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-xs text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === tab
                    ? 'bg-[#1F1D1B] text-white'
                    : 'bg-white border border-[#E4E1DA] text-[#8B8479] hover:text-[#1F1D1B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Content Section: Grid or Empty State */}
        {displayedProjects.length === 0 ? (
          /* Empty state for a new user: an invitation to act, in the interface's voice, not decorative filler */
          <div
            id="sketchbook-empty-state"
            className="bg-white border border-dashed border-[#8B8479]/40 rounded-xs p-8 sm:p-12 text-center max-w-2xl mx-auto my-8"
          >
            <div className="w-12 h-12 rounded-xs bg-[#F9F8F6] border border-[#E4E1DA] flex items-center justify-center mx-auto mb-4 text-[#4A90C4]">
              <Layers className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#1F1D1B]">
              Your sketchbook has no active studies yet.
            </h3>

            <p className="text-xs sm:text-sm text-[#8B8479] max-w-md mx-auto mt-2 leading-relaxed">
              Upload a reference photo — such as a portrait or a single still-life object. 
              The engine will extract its primary masses and guide your hand through every line.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link
                to="/new"
                id="empty-state-upload-btn"
                className="px-5 py-2.5 bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white rounded-xs text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#4A90C4]" />
                <span>Upload First Photo</span>
              </Link>
              {forceEmptyState && (
                <button
                  onClick={() => setForceEmptyState(false)}
                  className="px-4 py-2.5 bg-white border border-[#E4E1DA] text-[#1F1D1B] hover:bg-[#F9F8F6] rounded-xs text-xs font-medium transition-colors"
                >
                  Reload Sample Drawings
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Drawings Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedProjects.map(proj => {
              const completedStepsCount = proj.steps.filter(s => s.isCompleted).length;

              return (
                <div
                  key={proj.id}
                  id={`drawing-card-${proj.id}`}
                  className="group bg-white border border-[#E4E1DA] hover:border-[#8B8479] rounded-xs overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between"
                >
                  {/* Thumbnail and Overlay */}
                  <div>
                    <div className="relative aspect-4/3 bg-[#F6F5F2] border-b border-[#E4E1DA] overflow-hidden">
                      <img
                        src={proj.thumbnailUrl || proj.referenceImageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 grayscale contrast-110"
                      />
                      {/* Status Tag */}
                      <div className="absolute top-2.5 left-2.5">
                        {proj.isCompleted ? (
                          <span className="px-2 py-0.5 bg-[#B98A2E] text-white font-mono text-[10px] rounded-xs font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>COMPLETED</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#4A90C4] text-white font-mono text-[10px] rounded-xs font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>STEP 0{proj.currentStepIndex + 1} OF 0{proj.totalSteps}</span>
                          </span>
                        )}
                      </div>

                      {/* Category Tag */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/90 backdrop-blur-xs font-mono text-[10px] text-[#8B8479] rounded-xs border border-[#E4E1DA]">
                        {proj.category}
                      </div>

                      {/* Accuracy Score in corner */}
                      {proj.accuracyOverall && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white font-mono text-[10px] rounded-xs">
                          {proj.accuracyOverall}% MATCH
                        </div>
                      )}
                    </div>

                    {/* Card Meta */}
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#8B8479] mb-1">
                        <span>EDITED {proj.updatedAt.toUpperCase()}</span>
                        <span>{proj.timeSpentMinutes}M SPENT</span>
                      </div>

                      <h3 className="text-sm font-bold text-[#1F1D1B] group-hover:text-[#4A90C4] transition-colors line-clamp-1">
                        {proj.title}
                      </h3>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#8B8479] mb-1">
                          <span>Progress</span>
                          <span>{completedStepsCount}/{proj.totalSteps} Steps</span>
                        </div>
                        <div className="w-full bg-[#E4E1DA]/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              proj.isCompleted ? 'bg-[#B98A2E]' : 'bg-[#4A90C4]'
                            }`}
                            style={{
                              width: `${(completedStepsCount / proj.totalSteps) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-4 py-3 bg-[#F9F8F6] border-t border-[#E4E1DA] flex items-center justify-between">
                    <button
                      id={`delete-proj-${proj.id}`}
                      onClick={e => {
                        e.stopPropagation();
                        deleteProject(proj.id);
                      }}
                      className="text-[#8B8479] hover:text-[#C1502E] p-1 transition-colors"
                      title="Delete study"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {proj.isCompleted ? (
                        <Link
                          to={`/drawings/${proj.id}`}
                          id={`view-history-${proj.id}`}
                          className="px-3 py-1.5 bg-white border border-[#E4E1DA] hover:bg-[#E4E1DA]/30 rounded-xs text-xs font-medium text-[#1F1D1B] flex items-center gap-1 transition-colors"
                        >
                          <span>Review History</span>
                          <ArrowRight className="w-3 h-3 text-[#B98A2E]" />
                        </Link>
                      ) : (
                        <Link
                          to={`/editor/${proj.id}`}
                          id={`continue-proj-${proj.id}`}
                          className="px-3 py-1.5 bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white rounded-xs text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-3 h-3 text-[#4A90C4]" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
