import { useState } from 'react';
import { User, Phone, Mail, Lock, CheckCircle, XCircle, Building } from 'lucide-react';

interface SignupPageProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
}

export function SignupPage({ onSignup, onNavigateToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    hospitalCode: '',
    name: '',
    phone: '',
    username: '',
    password: '',
    passwordConfirm: ''
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'username') {
      setUsernameAvailable(null);
    }
  };

  const checkUsername = () => {
    if (!formData.username) return;

    setCheckingUsername(true);
    // Mock username check
    setTimeout(() => {
      // Random availability for demo
      setUsernameAvailable(Math.random() > 0.3);
      setCheckingUsername(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (usernameAvailable !== true) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    setLoading(true);
    // Mock signup
    setTimeout(() => {
      onSignup();
    }, 1000);
  };

  const passwordsMatch = formData.password && formData.passwordConfirm &&
                        formData.password === formData.passwordConfirm;
  const passwordsDontMatch = formData.password && formData.passwordConfirm &&
                            formData.password !== formData.passwordConfirm;

  return (
    <div className="min-h-screen flex items-center justify-center py-12" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2" style={{ color: '#0052CC' }}>MedClaw</h1>
          <p style={{ color: '#64748B' }}>간호 업무 지원 시스템</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border p-8 mb-6" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
          <h2 className="text-2xl mb-6 text-center" style={{ color: '#1E293B' }}>회원가입</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hospital Code */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>병원 내부 계정</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="text"
                  value={formData.hospitalCode}
                  onChange={(e) => handleChange('hospitalCode', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border focus:outline-none"
                  style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  placeholder="병원 코드를 입력하세요"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0052CC';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>이름</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border focus:outline-none"
                  style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  placeholder="이름을 입력하세요"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0052CC';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>전화번호</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border focus:outline-none"
                  style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  placeholder="010-0000-0000"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0052CC';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Username with check button */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>아이디</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border focus:outline-none"
                    style={{
                      borderRadius: '8px',
                      borderColor: usernameAvailable === true ? '#10B981' :
                                   usernameAvailable === false ? '#DC2626' : '#E2E8F0'
                    }}
                    placeholder="아이디를 입력하세요"
                    required
                    onFocus={(e) => {
                      if (usernameAvailable === null) {
                        e.target.style.borderColor = '#0052CC';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (usernameAvailable === null) {
                        e.target.style.borderColor = '#E2E8F0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {usernameAvailable === true && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#10B981' }} />
                  )}
                  {usernameAvailable === false && (
                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#DC2626' }} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={checkUsername}
                  disabled={!formData.username || checkingUsername}
                  className="px-4 py-3 border hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ borderRadius: '8px', borderColor: '#E2E8F0', color: '#64748B' }}
                >
                  {checkingUsername ? '확인 중...' : '중복 확인'}
                </button>
              </div>
              {usernameAvailable === true && (
                <p className="mt-1 text-sm" style={{ color: '#10B981' }}>사용 가능한 아이디입니다.</p>
              )}
              {usernameAvailable === false && (
                <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>이미 사용 중인 아이디입니다.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border focus:outline-none"
                  style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  placeholder="비밀번호를 입력하세요"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0052CC';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Confirm */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => handleChange('passwordConfirm', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border focus:outline-none"
                  style={{
                    borderRadius: '8px',
                    borderColor: passwordsMatch ? '#10B981' :
                                 passwordsDontMatch ? '#DC2626' : '#E2E8F0'
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  onFocus={(e) => {
                    if (!passwordsMatch && !passwordsDontMatch) {
                      e.target.style.borderColor = '#0052CC';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!passwordsMatch && !passwordsDontMatch) {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                {passwordsMatch && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#10B981' }} />
                )}
                {passwordsDontMatch && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#DC2626' }} />
                )}
              </div>
              {passwordsDontMatch && (
                <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch || usernameAvailable !== true}
              className="w-full py-3 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ borderRadius: '8px', backgroundColor: '#0052CC', color: 'white' }}
            >
              {loading ? '회원가입 중...' : '회원가입'}
            </button>
          </form>
        </div>

        {/* Login link */}
        <div className="text-center">
          <span style={{ color: '#64748B' }}>이미 계정이 있으신가요? </span>
          <button
            onClick={onNavigateToLogin}
            className="font-medium hover:underline"
            style={{ color: '#0052CC' }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
