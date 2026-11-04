import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
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
      // Redirect based on role or original destination
      // We read from localStorage or wait for context update
      const token = localStorage.getItem('sakhisetu_token');
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-card border border-[#E5E4DE] shadow-elevated p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#174C3C] text-white flex items-center justify-center mx-auto font-bold text-xl font-hindi shadow-soft">
            स
          </div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'सखीसेतु पोर्टल लॉगिन' : 'Log In to SakhiSetu'}
          </h1>
          <p className="text-xs text-[#727B74]">
            Access your donor receipts or trust administration desk.
          </p>
        </div>

        {/* Quick-fill demo credentials bar */}
        <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E4DE] space-y-2">
          <span className="text-[10px] font-bold text-[#727B74] uppercase tracking-wider block text-center">
            Development Quick-Fill Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdminDemo}
              className="py-1.5 px-2 bg-white border border-[#E5E4DE] rounded-btn text-[11px] font-semibold text-[#174C3C] hover:border-[#174C3C] flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={fillDonorDemo}
              className="py-1.5 px-2 bg-white border border-[#E5E4DE] rounded-btn text-[11px] font-semibold text-[#202923] hover:border-[#174C3C] flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Donor Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-btn text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202923] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#727B74] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202923] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#727B74] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#FAF9F5] text-xs text-[#727B74]">
          Don't have a donor account yet?{' '}
          <Link to="/register" className="font-bold text-[#174C3C] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
