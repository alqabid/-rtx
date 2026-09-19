import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDrawing } from '../context/DrawingContext';
import { ArrowRight, Check, UserCheck } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useDrawing();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }
    login(email);
    navigate('/drawings');
  };

  const handleDemoLogin = () => {
    login('elena.vance@atelier.studio');
    navigate('/drawings');
  };

  return (
    <div className="min-h-screen sketchbook-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E4E1DA] shadow-lg rounded-xs p-6 sm:p-8 select-none">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1F1D1B] text-white rounded-xs text-xs font-mono mb-3">
            <span className="text-[#4A90C4]">@</span>
            <span>RTX ARTIST ACCESS</span>
          </div>
          <h2 className="text-xl font-bold text-[#1F1D1B]">
            {mode === 'signin' ? 'Sign in to your Sketchbook' : 'Create an Artist Account'}
          </h2>
          <p className="text-xs text-[#8B8479] mt-1">
            Access your reference libraries, active drawing steps, and stroke histories.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono text-[#8B8479] mb-1 uppercase">
                Artist Name
              </label>
              <input
                type="text"
                id="auth-name-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Elena Vance"
                className="w-full px-3 py-2 text-sm border border-[#E4E1DA] rounded-xs focus:outline-hidden focus:border-[#4A90C4] text-[#1F1D1B] placeholder-[#8B8479]/50"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[#8B8479] mb-1 uppercase">
              Email Address
            </label>
            <input
              type="email"
              id="auth-email-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="artist@sketchbook.studio"
              className="w-full px-3 py-2 text-sm border border-[#E4E1DA] rounded-xs focus:outline-hidden focus:border-[#4A90C4] text-[#1F1D1B] placeholder-[#8B8479]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8B8479] mb-1 uppercase">
              Password
            </label>
            <input
              type="password"
              id="auth-password-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-[#E4E1DA] rounded-xs focus:outline-hidden focus:border-[#4A90C4] text-[#1F1D1B] placeholder-[#8B8479]/50"
            />
          </div>

          {error && (
            <div className="text-xs text-[#C1502E] font-medium bg-[#C1502E]/10 p-2 rounded-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-2.5 bg-[#1F1D1B] hover:bg-[#1F1D1B]/90 text-white rounded-xs text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs mt-2"
          >
            <span>{mode === 'signin' ? 'Open Sketchbook' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#4A90C4]" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-4 pt-4 border-t border-[#E4E1DA]">
          <button
            type="button"
            id="auth-demo-btn"
            onClick={handleDemoLogin}
            className="w-full py-2 bg-[#F9F8F6] hover:bg-[#E4E1DA]/40 text-[#1F1D1B] border border-[#E4E1DA] rounded-xs text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#4A90C4]" />
            <span>Use Demo Artist Account (@elena_v)</span>
          </button>
        </div>

        {/* Mode Switch */}
        <div className="text-center mt-4 text-xs text-[#8B8479]">
          {mode === 'signin' ? (
            <span>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-[#1F1D1B] hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-semibold text-[#1F1D1B] hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
