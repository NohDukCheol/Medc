import { useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  Activity,
  Heart,
  Thermometer,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Save,
  Clock
} from 'lucide-react';

interface VitalsInputPageProps {
  patientId: number;
  onBack: () => void;
}

export function VitalsInputPage({ patientId, onBack }: VitalsInputPageProps) {
  const [vitals, setVitals] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    painScore: '0',
    consciousness: 'normal',
    notes: ''
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  // Mock patient data
  const patient = {
    name: '박지민',
    age: 67,
    gender: '남',
    room: '301',
    diagnosis: '급성 심근경색'
  };

  // Mock previous vitals
  const previousVitals = {
    systolic: 160,
    diastolic: 95,
    heartRate: 102,
    temperature: 37.8,
    time: '12:00'
  };

  const handleChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
    checkWarnings({ ...vitals, [field]: value });
  };

  const checkWarnings = (currentVitals: typeof vitals) => {
    const newWarnings: string[] = [];

    // Blood pressure check
    const sys = parseInt(currentVitals.systolic);
    const dia = parseInt(currentVitals.diastolic);
    if (sys > 180 || dia > 110) {
      newWarnings.push('위험: 고혈압 위기 - 즉시 의사 보고 필요');
    } else if (sys > 160 || dia > 100) {
      newWarnings.push('경고: 혈압 상승 - 모니터링 필요');
    } else if (sys < 90 || dia < 60) {
      newWarnings.push('경고: 저혈압 - 확인 필요');
    }

    // Heart rate check
    const hr = parseInt(currentVitals.heartRate);
    if (hr > 120) {
      newWarnings.push('위험: 심박수 과다 - 즉시 확인 필요');
    } else if (hr > 100) {
      newWarnings.push('경고: 심박수 상승 - 모니터링 필요');
    } else if (hr < 50) {
      newWarnings.push('경고: 서맥 - 확인 필요');
    }

    // Temperature check
    const temp = parseFloat(currentVitals.temperature);
    if (temp >= 39) {
      newWarnings.push('위험: 고열 - 해열 조치 필요');
    } else if (temp >= 38) {
      newWarnings.push('경고: 발열 - 모니터링 필요');
    } else if (temp < 36) {
      newWarnings.push('경고: 저체온 - 확인 필요');
    }

    // Pain score check
    const pain = parseInt(currentVitals.painScore);
    if (pain >= 7) {
      newWarnings.push('경고: 심한 통증 - 통증 관리 필요');
    }

    setWarnings(newWarnings);
  };

  const handleSave = () => {
    if (!vitals.systolic || !vitals.diastolic || !vitals.heartRate || !vitals.temperature) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // Mock save
    toast.success('활력징후가 성공적으로 기록되었습니다', {
      description: `환자: ${patient.name} (${patient.room})`,
      duration: 3000,
    });

    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const getTrend = (current: string, previous: number): 'up' | 'down' | 'same' => {
    const curr = parseFloat(current);
    if (!current || isNaN(curr)) return 'same';
    if (curr > previous * 1.05) return 'up';
    if (curr < previous * 0.95) return 'down';
    return 'same';
  };

  const systolicTrend = getTrend(vitals.systolic, previousVitals.systolic);
  const diastolicTrend = getTrend(vitals.diastolic, previousVitals.diastolic);
  const hrTrend = getTrend(vitals.heartRate, previousVitals.heartRate);
  const tempTrend = getTrend(vitals.temperature, previousVitals.temperature);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-4"
            style={{ color: '#64748B' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>환자 정보로 돌아가기</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F1F5F9' }}>
              <User className="w-7 h-7" style={{ color: '#94A3B8' }} />
            </div>
            <div>
              <h1 className="text-2xl mb-1" style={{ color: '#1E293B' }}>바이탈 사인 입력</h1>
              <div className="text-sm" style={{ color: '#64748B' }}>
                {patient.name} • {patient.age}세 • 병실 {patient.room}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Previous Vitals */}
        <div className="bg-white border p-6 mb-6" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: '#64748B' }} />
            <h2 className="text-lg font-medium" style={{ color: '#1E293B' }}>이전 측정값</h2>
            <span className="text-sm" style={{ color: '#94A3B8' }}>({previousVitals.time})</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 text-center border" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
              <div className="text-sm mb-1" style={{ color: '#94A3B8' }}>혈압</div>
              <div className="text-lg font-medium" style={{ color: '#1E293B' }}>
                {previousVitals.systolic}/{previousVitals.diastolic}
              </div>
            </div>
            <div className="p-4 text-center border" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
              <div className="text-sm mb-1" style={{ color: '#94A3B8' }}>심박수</div>
              <div className="text-lg font-medium" style={{ color: '#1E293B' }}>{previousVitals.heartRate}</div>
            </div>
            <div className="p-4 text-center border" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
              <div className="text-sm mb-1" style={{ color: '#94A3B8' }}>체온</div>
              <div className="text-lg font-medium" style={{ color: '#1E293B' }}>{previousVitals.temperature}°C</div>
            </div>
            <div className="p-4 text-center border" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
              <div className="text-sm mb-1" style={{ color: '#94A3B8' }}>시간</div>
              <div className="text-lg font-medium" style={{ color: '#1E293B' }}>{previousVitals.time}</div>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="border-2 p-4 mb-6" style={{ borderRadius: '12px', backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" style={{ color: '#DC2626' }} />
              <h3 className="font-medium" style={{ color: '#7F1D1D' }}>경고 알림</h3>
            </div>
            <ul className="space-y-2">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm flex items-start gap-2" style={{ color: '#991B1B' }}>
                  <span style={{ color: '#DC2626' }}>•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white border p-6 mb-6" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
          <h2 className="text-lg font-medium mb-6" style={{ color: '#1E293B' }}>현재 측정값</h2>

          <div className="space-y-6">
            {/* Blood Pressure */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>
                혈압 (mmHg) *
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={vitals.systolic}
                    onChange={(e) => handleChange('systolic', e.target.value)}
                    placeholder="수축기"
                    className="w-full px-4 py-3 border focus:outline-none"
                    style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0052CC';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {systolicTrend === 'up' && <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#DC2626' }} />}
                  {systolicTrend === 'down' && <TrendingDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#10B981' }} />}
                  {systolicTrend === 'same' && <Minus className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#CBD5E1' }} />}
                </div>
                <span style={{ color: '#94A3B8' }}>/</span>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={vitals.diastolic}
                    onChange={(e) => handleChange('diastolic', e.target.value)}
                    placeholder="이완기"
                    className="w-full px-4 py-3 border focus:outline-none"
                    style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0052CC';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {diastolicTrend === 'up' && <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#DC2626' }} />}
                  {diastolicTrend === 'down' && <TrendingDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#10B981' }} />}
                  {diastolicTrend === 'same' && <Minus className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#CBD5E1' }} />}
                </div>
              </div>
              <div className="mt-1 text-sm" style={{ color: '#94A3B8' }}>
                이전: {previousVitals.systolic}/{previousVitals.diastolic}
              </div>
            </div>

            {/* Heart Rate */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>
                심박수 (회/분) *
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => handleChange('heartRate', e.target.value)}
                  placeholder="심박수 입력"
                  className="w-full pl-11 pr-12 py-3 border focus:outline-none"
                  style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0052CC';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {hrTrend === 'up' && <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#DC2626' }} />}
                {hrTrend === 'down' && <TrendingDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#10B981' }} />}
                {hrTrend === 'same' && <Minus className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#CBD5E1' }} />}
              </div>
              <div className="mt-1 text-sm" style={{ color: '#94A3B8' }}>
                이전: {previousVitals.heartRate}
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>
                체온 (°C) *
              </label>
              <div className="relative">
                <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  placeholder="체온 입력"
                  className="w-full pl-11 pr-12 py-3 border focus:outline-none"
                  style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0052CC';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 82, 204, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {tempTrend === 'up' && <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#DC2626' }} />}
                {tempTrend === 'down' && <TrendingDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#10B981' }} />}
                {tempTrend === 'same' && <Minus className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#CBD5E1' }} />}
              </div>
              <div className="mt-1 text-sm" style={{ color: '#94A3B8' }}>
                이전: {previousVitals.temperature}°C
              </div>
            </div>

            {/* Pain Score */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>
                통증 점수 (0-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={vitals.painScore}
                  onChange={(e) => handleChange('painScore', e.target.value)}
                  className="flex-1"
                  style={{ accentColor: '#0052CC' }}
                />
                <div
                  className="w-16 h-12 flex items-center justify-center text-xl font-bold"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: parseInt(vitals.painScore) >= 7 ? '#FEE2E2' :
                                   parseInt(vitals.painScore) >= 4 ? '#FEF3C7' : '#DBEAFE',
                    color: parseInt(vitals.painScore) >= 7 ? '#7F1D1D' :
                           parseInt(vitals.painScore) >= 4 ? '#78350F' : '#1E3A8A'
                  }}
                >
                  {vitals.painScore}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs" style={{ color: '#94A3B8' }}>
                <span>통증 없음</span>
                <span>견딜 수 없음</span>
              </div>
            </div>

            {/* Consciousness */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>
                의식 상태
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'normal', label: '정상', color: '#10B981' },
                  { value: 'drowsy', label: '혼미', color: '#F59E0B' },
                  { value: 'unresponsive', label: '무반응', color: '#DC2626' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('consciousness', option.value)}
                    className="py-3 px-4 border-2 transition-all"
                    style={{
                      borderRadius: '8px',
                      borderColor: vitals.consciousness === option.value ? '#0052CC' : '#E2E8F0',
                      backgroundColor: vitals.consciousness === option.value ? '#F0F7FF' : 'white',
                      color: '#1E293B'
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: '#1E293B' }}>
                특이사항
              </label>
              <textarea
                value={vitals.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="특이사항이나 관찰 내용을 입력하세요..."
                className="w-full px-4 py-3 border focus:outline-none resize-none"
                style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                rows={4}
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
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 flex items-center justify-center gap-2 text-lg hover:opacity-90 transition-opacity"
          style={{ borderRadius: '12px', backgroundColor: '#0052CC', color: 'white' }}
        >
          <Save className="w-5 h-5" />
          저장하기
        </button>
      </main>
    </div>
  );
}
