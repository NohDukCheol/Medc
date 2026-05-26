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
import { MASTER_HANDOFF_DB } from './HandoffPage';

interface HandoffDocumentProps {
  onBack: () => void;
  selectedPatientIds: number[];
  checkedTasks: string[]; 
}

export function HandoffDocument({ onBack, selectedPatientIds, checkedTasks }: HandoffDocumentProps) {
  const [isAiLoading, setIsAiLoading] = useState(true);

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

  const targetPatients = PATIENTS_DATABASE.filter(p => selectedPatientIds.includes(p.id));
  const displayPatients = targetPatients.length > 0 ? targetPatients : PATIENTS_DATABASE.slice(0, 2);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
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

          <div className="p-8 space-y-10 divide-y divide-gray-100">
            {displayPatients.map((patient, index) => {
              const detailedPatient = MASTER_HANDOFF_DB.find(p => p.id === patient.id);
              const allTasks = detailedPatient?.pendingTasks || [];
              const remainingTasks = allTasks.filter((_, idx) => !checkedTasks?.includes(`${patient.id}-${idx}`));
              const completedTasks = allTasks.filter((_, idx) => checkedTasks?.includes(`${patient.id}-${idx}`));

              return (
                <div key={patient.id} className={`pl-6 py-4 ${index > 0 ? 'pt-10' : ''}`} style={{ borderLeft: '4px solid #0052CC' }}>
                  
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

                  <div className="mb-6">
                    <div className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>AI 임상 상황 요약 브리핑 (Situation)</span>
                    </div>

                    {isAiLoading ? (
                      <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3 animate-pulse">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                          <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span>AI가 차트를 분석하여 요약을 생성하고 있습니다...</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                      </div>
                    ) : (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-2xs">
                        <p className="text-sm text-blue-900 leading-relaxed font-medium">
                          [자동 요약] {patient.summary}. 현재 지속적인 환자 케어가 진행 중이며 다음 근무자의 오더 연동 업무 인계가 필요합니다.
                        </p>
                      </div>
                    )}
                  </div>

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

                  {detailedPatient?.addedMemos && detailedPatient.addedMemos.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <h4>추가 특이사항 및 간호 메모 (Nursing Notes)</h4>
                      </div>
                      <div className="space-y-2">
                        {detailedPatient.addedMemos.map((memo, idx) => (
                          <div key={idx} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-gray-800 font-medium shadow-sm">
                            <span className="font-bold text-blue-600 mr-2">[{memo.time}]</span>
                            {memo.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h4>인계 대기 업무 및 권고사항 (Recommendation)</h4>
                    </div>
                    <div className="space-y-2">
                      {remainingTasks.length > 0 ? (
                        remainingTasks.map((task, idx) => (
                          <div key={`rem-${idx}`} className="p-3 rounded-lg border bg-amber-50/40 border-amber-200 text-sm font-medium text-amber-900 flex justify-between items-center">
                            <span>• [{task.time}] {task.task}</span>
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">미완료 연동됨</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-sm font-medium text-emerald-800">
                          • 예정된 모든 인계 대기 업무가 완료되었습니다.
                        </div>
                      )}

                      {completedTasks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                          <div className="text-xs font-bold text-gray-400 mb-2">이전 근무자 처리 완료 업무 내역</div>
                          {completedTasks.map((task, idx) => (
                            <div key={`comp-${idx}`} className="p-2 rounded-lg border bg-gray-50 border-gray-200 text-sm font-medium text-gray-500 flex justify-between items-center">
                              <span className="line-through">• [{task.time}] {task.task}</span>
                              <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3"/> 인계 전 조치 완료
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

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