import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Mail, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-card border border-[#E5E4DE] shadow-elevated p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#174C3C] text-white flex items-center justify-center mx-auto font-bold text-xl font-hindi shadow-soft">
            स
          </div>
          <h1 className="text-2xl font-bold text-[#103A30]">
            {language === 'HI' ? 'दाता खाता पंजीकरण' : 'Create Donor Account'}
          </h1>
          <p className="text-xs text-[#727B74]">
            Track your charitable contributions and download annual 80G statements.
          </p>
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
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#727B74] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Verma"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202923] mb-1">
              Email Address *
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
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#727B74] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 digit number"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202923] mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#727B74] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters, 1 uppercase & 1 number"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E4DE] rounded-btn focus:outline-hidden focus:border-[#174C3C]"
              />
            </div>
            <span className="text-[10px] text-[#727B74] mt-0.5 block">
              Must contain 8+ characters, one uppercase letter, and one number.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#174C3C] hover:bg-[#103A30] text-white text-xs font-bold rounded-btn transition-colors flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Donor Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#FAF9F5] text-xs text-[#727B74]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#174C3C] hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
