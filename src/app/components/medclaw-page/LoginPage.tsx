import { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { cn } from './utils'; // 아까 만든 유틸리티 활용

interface LoginPageProps {
  onLogin: () => void;
  onNavigateToSignup: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignup }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#0052CC] tracking-tight mb-2">MedClaw</h1>
          <p className="text-slate-500 font-medium">스마트 간호 업무 지원 시스템</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">아이디</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0052CC] transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052CC] focus:bg-white transition-all placeholder:text-slate-400"
                  placeholder="ID를 입력하세요"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">비밀번호</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0052CC] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052CC] focus:bg-white transition-all placeholder:text-slate-400"
                  placeholder="Password를 입력하세요"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0052CC] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
            >
              {loading ? '인증 중...' : (
                <>
                  <LogIn className="w-5 h-5" />
                  로그인
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-slate-400 font-medium uppercase tracking-widest">OR</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={() => onLogin()}
            className="w-full py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Google 계정으로 로그인</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-slate-500 text-sm">
          아직 회원이 아니신가요?{' '}
          <button
            onClick={onNavigateToSignup}
            className="text-[#0052CC] font-bold hover:underline underline-offset-4"
          >
            회원가입 하기
          </button>
        </p>
      </div>
    </div>
  );
}