import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDrawing } from '../context/DrawingContext';
import { Pencil, Plus, FolderOpen, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useDrawing();

  const isEditor = location.pathname.startsWith('/editor');

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#E4E1DA] px-4 md:px-8 py-3 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            id="brand-logo"
            className="flex items-center gap-2 text-[#1F1D1B] group hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-sm bg-[#1F1D1B] flex items-center justify-center text-white relative overflow-hidden">
              <span className="font-mono text-xs font-semibold text-[#4A90C4]">@</span>
              <span className="font-mono text-xs font-bold text-white">rtx</span>
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#4A90C4]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#1F1D1B] leading-none">
                @rtx
              </span>
              <span className="text-[10px] font-mono text-[#8B8479] tracking-wider uppercase">
                Guided Drawing
              </span>
            </div>
          </Link>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#E4E1DA]">
            <Link
              to="/"
              id="nav-link-home"
              className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-[#1F1D1B] bg-[#E4E1DA]/40 font-semibold'
                  : 'text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/20'
              }`}
            >
              Overview
            </Link>
            <Link
              to="/drawings"
              id="nav-link-drawings"
              className={`px-3 py-1.5 rounded-sm text-sm font-medium flex items-center gap-1.5 transition-colors ${
                location.pathname === '/drawings'
                  ? 'text-[#1F1D1B] bg-[#E4E1DA]/40 font-semibold'
                  : 'text-[#8B8479] hover:text-[#1F1D1B] hover:bg-[#E4E1DA]/20'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>My Drawings</span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isEditor && (
            <Link
              to="/new"
              id="nav-new-drawing-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1F1D1B] text-white hover:bg-[#1F1D1B]/90 rounded-sm text-sm font-medium transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#4A90C4]" />
              <span>New Drawing</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E4E1DA]">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#1F1D1B] leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] font-mono text-[#8B8479]">
                  {user.handle}
                </span>
              </div>
              <button
                id="user-logout-btn"
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-[#8B8479] hover:text-[#C1502E] hover:bg-[#E4E1DA]/30 rounded-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                id="nav-login-btn"
                className="px-3 py-1.5 text-sm font-medium text-[#1F1D1B] hover:bg-[#E4E1DA]/30 rounded-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                id="nav-signup-btn"
                className="px-3 py-1.5 text-sm font-medium bg-[#4A90C4] text-white hover:bg-[#4A90C4]/90 rounded-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
