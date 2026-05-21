import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Send,
  Clock,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { PATIENTS_DATABASE } from '../PatientList';

interface HandoffDocumentProps {
  onBack: () => void;
  selectedPatientIds: number[]; // App.tsx에서 전달받은 실제 선택된 환자 ID 배열
}

export function HandoffDocument({ onBack, selectedPatientIds }: HandoffDocumentProps) {
  // 💡 UX 개선 핵심: AI 요약 연동 지연 대기를 표시하기 위한 로딩 상태값
  const [isAiLoading, setIsAiLoading] = useState(true);

  // 화면 진입 시 백엔드 비동기 API 수신을 시뮬레이션하기 위해 2.5초 후 로딩 해제
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAiLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handoffShiftInfo = {
    from: '낮번 (08:00-16:00)',
    to: '초번 (16:00-24:00)',
    date: '2026년 4월 11일 (금)',
    nurse: '김민지 간호사'
  };

  // 💡 [동적 매핑] 마스터 데이터베이스에서 선택된 환자 ID들과 일치하는 환자만 필터링합니다.
  const targetPatients = PATIENTS_DATABASE.filter(p => selectedPatientIds.includes(p.id));

  // 예외 처리: 만약 선택된 환자가 없다면 기본적으로 앞의 2명을 렌더링합니다.
  const displayPatients = targetPatients.length > 0 ? targetPatients : PATIENTS_DATABASE.slice(0, 2);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-[#0052CC] transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>인계 준비로 돌아가기</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">실시간 인수인계 문서 조회</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{handoffShiftInfo.date}</span>
                <span>•</span>
                <span>{handoffShiftInfo.from} → {handoffShiftInfo.to}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => alert('인계 문서를 PDF로 다운로드합니다.')} className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors font-medium text-sm">
                <Download className="w-5 h-5" />
                PDF 다운로드
              </button>
              <button onClick={() => alert('인계 문서를 다음 근무자에게 전송했습니다.')} className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm text-white" style={{ backgroundColor: '#0052CC' }}>
                <Send className="w-5 h-5" />
                인계 최종 전송
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Document Title Header */}
          <div className="p-8 border-b border-gray-200 bg-linear-to-b from-gray-50 to-white">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#0052CC' }}>간호 인수인계 보고서 </h2>
              <div className="text-sm text-gray-400 font-mono tracking-widest">MEDCLAW AI NURSING SUPPORT</div>
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto border p-4 rounded-xl bg-white">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#0052CC]" />
                <div>
                  <div className="text-xs text-gray-400">근무 교대 세션</div>
                  <div className="font-semibold text-sm text-gray-700">{handoffShiftInfo.from}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#0052CC]" />
                <div>
                  <div className="text-xs text-gray-400">책임 간호사</div>
                  <div className="font-semibold text-sm text-gray-700">{handoffShiftInfo.nurse}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 환자별 인계 리포트 출력 구역 */}
          <div className="p-8 space-y-10 divide-y divide-gray-100">
            {displayPatients.map((patient, index) => (
              <div key={patient.id} className={`pl-6 py-4 ${index > 0 ? 'pt-10' : ''}`} style={{ borderLeft: '4px solid #0052CC' }}>
                
                {/* 환자 인적 정보 라벨 */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-gray-800">{patient.name}</h3>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold" style={{ 
                      backgroundColor: patient.status === 'critical' ? '#FEE2E2' : '#FEF3C7',
                      color: patient.status === 'critical' ? '#991B1B' : '#92400E'
                    }}>
                      {patient.status === 'critical' ? '위험' : '주의'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {patient.age}세 • {patient.gender} • 병실 {patient.room}호 • <span className="text-blue-600 font-semibold">{patient.diagnosis}</span>
                  </div>
                </div>

                {/* 💡 UX 고도화 반영: AI 요약 로딩 전용 Skeleton UI 및 안내 구역 */}
                <div className="mb-6">
                  <div className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>AI 임상 상황 요약 브리핑 (Situation)</span>
                  </div>

                  {isAiLoading ? (
                    /* 반짝이는 흐릿한 막대 모양의 스켈레톤 컴포넌트 */
                    <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3 animate-pulse">
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>AI가 차트를 분석하여 요약을 생성하고 있습니다...</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  ) : (
                    /* 백엔드 데이터 수신 완료 후 실제 요약 내용 노출 */
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-2xs">
                      <p className="text-sm text-blue-900 leading-relaxed font-medium">
                        [자동 요약] {patient.summary}. 현재 지속적인 환자 케어가 진행 중이며 다음 근무자의 오더 연동 업무 인계가 필요합니다.
                      </p>
                    </div>
                  )}
                </div>

                {/* 최근 활력징후 데이터 구역 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <h4>마지막 측정된 임상 바이탈 (Assessment)</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3.5 bg-gray-50 rounded-lg border">
                      <div className="text-xs text-gray-400 font-medium mb-1">혈압 (BP)</div>
                      <div className="text-base font-mono font-bold text-gray-700">{patient.vitals.bp}</div>
                    </div>
                    <div className="p-3.5 bg-gray-50 rounded-lg border">
                      <div className="text-xs text-gray-400 font-medium mb-1">심박수 (HR)</div>
                      <div className="text-base font-mono font-bold text-gray-700">{patient.vitals.hr}회/분</div>
                    </div>
                    <div className="p-3.5 bg-gray-50 rounded-lg border">
                      <div className="text-xs text-gray-400 font-medium mb-1">체온 (BT)</div>
                      <div className="text-base font-mono font-bold text-gray-700">{patient.vitals.temp}°C</div>
                    </div>
                  </div>
                </div>

                {/* 인계 대기 업무 내역 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h4>인계 대기 업무 및 권고사항 (Recommendation)</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border bg-amber-50/40 border-amber-200 text-sm font-medium text-amber-900">
                      • 오더 기반 자동 생성된 {patient.pendingTasks}건의 미완료 업무 연동 확인 및 모니터링 프로토콜 지속 수행 요망
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Document Footer */}
          <div className="p-8 border-t border-gray-200 bg-gray-50 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /><span>인계 데이터 전자 검증 완료</span></div>
              <div>보고서 생성 시각: {new Date().toLocaleString('ko-KR')}</div>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg border text-xs text-gray-500 leading-normal">
              본 문서는 MedClaw AI 간호 지원 시스템에 의해 자동 작성되었습니다. 모든 데이터 기록은 전자 의무 기록(EMR) 시스템과 동기화되며 법적 효력을 가집니다.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}