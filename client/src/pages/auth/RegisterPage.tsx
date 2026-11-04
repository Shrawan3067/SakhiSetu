import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await register({
        fullName,
        email,
        phone: phone || undefined,
        password,
      });
      navigate('/donor/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-[#E8EAE5] shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mx-auto font-bold text-xl font-hindi shadow-xs">
            स
          </div>
          <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
            {language === 'HI' ? 'दाता खाता पंजीकरण' : 'Create Donor Account'}
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Track your charitable contributions and download annual 80G statements.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-label-sm text-xs font-semibold text-on-surface">Full Legal Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ananya Verma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-[#E8EAE5] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-xs font-semibold text-on-surface">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-[#E8EAE5] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-xs font-semibold text-on-surface">Mobile Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-[#E8EAE5] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-xs font-semibold text-on-surface">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-[#E8EAE5] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Register Account'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-on-surface-variant">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-secondary hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
