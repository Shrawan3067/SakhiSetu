import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/donor/dashboard' : from);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdminDemo = () => {
    setEmail('admin@sakhisetu.org');
    setPassword('Admin@123456');
    setError(null);
  };

  const fillDonorDemo = () => {
    setEmail('priya.sharma@example.com');
    setPassword('Donor@123456');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-[#E8EAE5] shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mx-auto font-bold text-xl font-hindi shadow-xs">
            स
          </div>
          <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
            {language === 'HI' ? 'सखीसेतु पोर्टल लॉगिन' : 'Log In to SakhiSetu'}
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Access your donor 80G receipts or trust administration desk.
          </p>
        </div>

        {/* Quick-fill demo credentials bar */}
        <div className="p-3 bg-surface-container-low rounded-xl border border-[#E8EAE5] space-y-2">
          <span className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block text-center">
            Development Quick-Fill Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdminDemo}
              className="py-1.5 px-2 bg-surface-container-lowest border border-[#E8EAE5] rounded-lg text-xs font-semibold text-primary hover:border-primary flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">shield</span>
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={fillDonorDemo}
              className="py-1.5 px-2 bg-surface-container-lowest border border-[#E8EAE5] rounded-lg text-xs font-semibold text-on-surface hover:border-primary flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">person</span>
              <span>Donor Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-label-sm text-xs font-semibold text-on-surface">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@sakhisetu.org"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-[#E8EAE5] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-xs font-semibold text-on-surface">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-[#E8EAE5] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-on-surface-variant">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-secondary hover:underline">
            Register as a Donor
          </Link>
        </div>
      </div>
    </div>
  );
};
