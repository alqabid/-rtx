import React, { createContext, useContext, useState, useEffect } from 'react';
import { DrawingProject, DrawingStep, DrawingStroke } from '../types';
import { INITIAL_PROJECTS, INITIAL_STEPS_PORTRAIT, INITIAL_STEPS_TEAPOT } from '../data/mockData';

interface DrawingContextType {
  projects: DrawingProject[];
  user: { name: string; email: string; handle: string } | null;
  activeProject: DrawingProject | null;
  setActiveProject: (project: DrawingProject | null) => void;
  createProjectFromImage: (imageUrl: string, title: string, category: DrawingProject['category']) => string;
  createProjectFromPreset: (presetId: string) => string;
  getProjectById: (id: string) => DrawingProject | undefined;
  updateProject: (updated: DrawingProject) => void;
  deleteProject: (id: string) => void;
  login: (email?: string) => void;
  logout: () => void;
  resetToSampleData: () => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

const STORAGE_KEY_PROJECTS = 'rtx_sketchbook_projects_v2';
const STORAGE_KEY_USER = 'rtx_sketchbook_user_v2';

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<DrawingProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECTS;
  });

  const [user, setUser] = useState<{ name: string; email: string; handle: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { name: 'Elena Vance', email: 'elena@art-drafting.studio', handle: '@elena_v' };
  });

  const [activeProject, setActiveProject] = useState<DrawingProject | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = (email = 'elena@art-drafting.studio') => {
    const handle = `@${email.split('@')[0]}`;
    setUser({
      name: email.split('@')[0].replace('.', ' '),
      email,
      handle
    });
  };

  const logout = () => {
    setUser(null);
  };

  const createProjectFromImage = (imageUrl: string, title: string, category: DrawingProject['category']): string => {
    const newId = `proj-${Date.now()}`;
    const newProject: DrawingProject = {
      id: newId,
      title: title || 'Untitled Study',
      category: category || 'Portrait',
      referenceImageUrl: imageUrl,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      progressPercentage: 0,
      currentStepIndex: 0,
      isCompleted: false,
      totalSteps: 6,
      accuracyOverall: 92,
      timeSpentMinutes: 1,
      steps: INITIAL_STEPS_PORTRAIT.map(s => ({ ...s, isCompleted: false })),
      completedStrokes: [],
      thumbnailUrl: imageUrl
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProject(newProject);
    return newId;
  };

  const createProjectFromPreset = (presetId: string): string => {
    const newId = `proj-${Date.now()}`;
    const isTeapot = presetId.includes('teapot') || presetId.includes('fern');
    const stepsTemplate = isTeapot ? INITIAL_STEPS_TEAPOT : INITIAL_STEPS_PORTRAIT;
    
    let title = 'Study Project';
    let img = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
    let cat: DrawingProject['category'] = 'Portrait';

    if (presetId.includes('teapot')) {
      title = 'Handmade Ceramic Teapot';
      img = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80';
      cat = 'Still Life';
    } else if (presetId.includes('bust')) {
      title = 'Classical Roman Bust';
      img = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
      cat = 'Anatomy';
    } else if (presetId.includes('fern')) {
      title = 'Botanical Monstera Leaf';
      img = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80';
      cat = 'Still Life';
    }

    const newProj: DrawingProject = {
      id: newId,
      title,
      category: cat,
      referenceImageUrl: img,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      progressPercentage: 0,
      currentStepIndex: 0,
      isCompleted: false,
      totalSteps: stepsTemplate.length,
      accuracyOverall: 94,
      timeSpentMinutes: 0,
      steps: stepsTemplate.map(s => ({ ...s, isCompleted: false })),
      completedStrokes: [],
      thumbnailUrl: img
    };

    setProjects(prev => [newProj, ...prev]);
    setActiveProject(newProj);
    return newId;
  };

  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const updateProject = (updated: DrawingProject) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (activeProject && activeProject.id === updated.id) {
      setActiveProject(updated);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject && activeProject.id === id) {
      setActiveProject(null);
    }
  };

  const resetToSampleData = () => {
    setProjects(INITIAL_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
  };

  return (
    <DrawingContext.Provider
      value={{
        projects,
        user,
        activeProject,
        setActiveProject,
        createProjectFromImage,
        createProjectFromPreset,
        getProjectById,
        updateProject,
        deleteProject,
        login,
        logout,
        resetToSampleData
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};
