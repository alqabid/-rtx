import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DrawingProvider } from './context/DrawingContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewDrawingPage } from './pages/NewDrawingPage';
import { EditorPage } from './pages/EditorPage';
import { DrawingDetailPage } from './pages/DrawingDetailPage';
import { AuthPage } from './pages/AuthPage';

export default function App() {
  return (
    <DrawingProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white text-[#1F1D1B] font-sans antialiased flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/drawings" element={<DashboardPage />} />
              <Route path="/drawings/:id" element={<DrawingDetailPage />} />
              <Route path="/new" element={<NewDrawingPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/editor/:id" element={<EditorPage />} />
              <Route path="/login" element={<AuthPage initialMode="signin" />} />
              <Route path="/signup" element={<AuthPage initialMode="signup" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DrawingProvider>
  );
}
