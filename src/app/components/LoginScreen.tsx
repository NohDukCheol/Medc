import { useState } from 'react';
import { Fingerprint, CreditCard, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock authentication - in production this would connect to Supabase
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  const handleBiometric = () => {
    setLoading(true);
    // Mock biometric authentication
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  const handleNFC = () => {
    setLoading(true);
    // Mock NFC badge tap
    setTimeout(() => {
      onLogin();
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-2" style={{ color: '#0052CC' }}>MediCare AI</h1>
          <p className="text-gray-600">Nursing Support System</p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl mb-6 text-center">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  placeholder="nurse@hospital.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ backgroundColor: '#0052CC', color: 'white' }}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-gray-600 hover:text-[#0052CC] transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Quick Access Methods */}
        <div className="space-y-3">
          <div className="text-center text-sm text-gray-500 mb-4">Or use quick access</div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBiometric}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:border-[#0052CC] transition-all disabled:opacity-50"
          >
            <Fingerprint className="w-6 h-6" style={{ color: '#0052CC' }} />
            <span>Biometric Login</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNFC}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:border-[#0052CC] transition-all disabled:opacity-50"
          >
            <CreditCard className="w-6 h-6" style={{ color: '#0052CC' }} />
            <span>NFC Badge Tap</span>
          </motion.button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center text-xs text-gray-500">
          HIPAA Compliant • End-to-End Encrypted
        </div>
      </motion.div>
    </div>
  );
}
