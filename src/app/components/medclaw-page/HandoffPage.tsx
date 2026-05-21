import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Clock, User, Presentation, Check, Info, Package } from 'lucide-react';
import { cn } from './utils';

// --- 인터페이스 정의 ---
interface TaskDetail {
  time: string;
  task: string;
  reason: string;
  supplies: string[];
  guide: boolean;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  room: string;
  diagnosis: string;
  status: 'normal' | 'caution' | 'danger';
  lastVitals: { time: string; bp: string; hr: string; temp: string; };
  completedTasks: string[];
  pendingTasks: TaskDetail[];
  notes: string;
  addedMemos?: { time: string; text: string; }[]; // 업로드되는 새 메모들을 누적할 배열
}

interface HandoffPageProps {
  onBack: () => void;
  onGenerateDocument: (selectedIds: number[]) => void;
  onNursingBriefingClick: () => void;
}

// 💡 전역 런타임 캐시 데이터베이스
const MASTER_HANDOFF_DB: Patient[] = [
  {
    id: 1, name: '박지민', age: 67, room: '301', diagnosis: '급성 심근경색', status: 'danger',
    lastVitals: { time: '13:00', bp: '160/95', hr: '102', temp: '37.8' },
    completedTasks: ['활력징후 측정 (12:00)', '니트로글리세린 투여 (12:30)', 'IV 라인 교체 (13:00)'],
    pendingTasks: [
      { time: '14:00', task: '활력징후 측정', reason: '오더: "Monitor vital signs q2h" → 2시간마다 측정', supplies: ['혈압계', '체온계', '청진기'], guide: true },
      { time: '14:00', task: '헤파린 5000 units IV 투여', reason: '오더: "Heparin 5000 units IV q4h" → 4시간마다 투여', supplies: ['헤파린 바이알', '주사기 (5mL)', 'IV 라인', '알코올 솜'], guide: true },
      { time: '14:30', task: '섭취량/배출량 기록', reason: '오더: "Strict I&O" → 엄격한 수분 관리 필요', supplies: ['기록지', '측정 컵'], guide: false }
    ],
    notes: '혈압 상승 추세. 흉통 호소 시 니트로글리세린 투여 후 증상 완화됨.',
    addedMemos: []
  },
  {
    id: 2, name: '김수연', age: 45, room: '405', diagnosis: '폐렴', status: 'caution',
    lastVitals: { time: '12:30', bp: '135/85', hr: '88', temp: '38.2' },
    completedTasks: ['항생제 IV 투여 (11:00)', '활력징후 측정 (12:00)', '해열제 투여 (12:30)'],
    pendingTasks: [
      { time: '15:00', task: '항생제 IV 투여', reason: '오더: "Antibiotics IV q4h" 처방 준수', supplies: ['항생제 주사액', '수액 라인', '알코올 솜'], guide: true },
      { time: '16:00', task: '수분 섭취 격려 및 기침 양상 관찰', reason: '기도 개방성 유지 및 수분 공급 지시', supplies: ['기록지'], guide: false }
    ],
    notes: '발열 지속 중이나 항생제 투여 후 상태 호전 중.',
    addedMemos: []
  },
  {
    id: 3, name: '윤지우', age: 58, room: '412', diagnosis: '패혈증', status: 'danger',
    lastVitals: { time: '13:30', bp: '90/60', hr: '115', temp: '39.1' },
    completedTasks: ['광범위 항생제 IV 투여 (12:00)', '활력징후 측정 (13:00)', '승압제 투여 (13:30)'],
    pendingTasks: [
      { time: '14:00', task: '항생제 IV 투여 - 즉시', reason: '오더: "Stat Antibiotics IV" 긴급 지시', supplies: ['광범위 항생제', 'IV 키트'], guide: true },
      { time: '14:00', task: '소변량 체크 및 혈압 모니터링 지속', reason: '저혈압 쇼크 징후 감시용 Strict Check', supplies: ['유린 백', '기록지'], guide: false }
    ],
    notes: '새벽 저혈압으로 승압제 추가. 고열 지속. BP <85/55 시 즉시 보고.',
    addedMemos: []
  }
];

const StatusBadge = ({ status }: { status: Patient['status'] }) => {
  const styles = {
    danger: "bg-red-100 text-red-700",
    caution: "bg-amber-100 text-amber-700",
    normal: "bg-emerald-100 text-emerald-700",
  };
  const labels = { danger: "위험", caution: "주의", normal: "정상" };

  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold", styles[status])}>
      {labels[status]}
    </span>
  );
};

export function HandoffPage({ onBack, onGenerateDocument, onNursingBriefingClick }: HandoffPageProps) {
  // 컴포넌트 내부 통합 렌더링 상태
  const [patientsList, setPatientsList] = useState<Patient[]>(() => JSON.parse(JSON.stringify(MASTER_HANDOFF_DB)));
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [newMemos, setNewMemos] = useState<{ [key: number]: string }>({}); // 입력창 텍스트 버퍼

  // 💡 [요구사항 2 픽스] 페이지 렌더링 시 최상단으로 스크롤 강제 점프
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isAllSelected = selectedIds.length === patientsList.length;

  const handleToggleAll = () => {
    setSelectedIds(isAllSelected ? [] : patientsList.map(p => p.id));
  };

  const handleToggleTask = (patientId: number, taskIdx: number) => {
    const taskKey = `${patientId}-${taskIdx}`;
    setCheckedTasks(prev =>
      prev.includes(taskKey) ? prev.filter(key => key !== taskKey) : [...prev, taskKey]
    );
  };

  // Vitals 실시간 값 동기화
  const handleLiveInputChange = (patientId: number, field: 'bp' | 'hr' | 'temp', value: string) => {
    setPatientsList(prev =>
      prev.map(p => p.id === patientId ? { ...p, lastVitals: { ...p.lastVitals, [field]: value } } : p)
    );
  };

  // 메모 작성 버퍼 핸들러
  const handleMemoChange = (patientId: number, value: string) => {
    setNewMemos(prev => ({ ...prev, [patientId]: value }));
  };

  // 💡 [요구사항 1 픽스] 텍스트 업로드 시각화 및 4개 데이터 동시 저장 캐싱 완료본
  const handleSavePatientData = (patientId: number) => {
    const targetPatient = patientsList.find(p => p.id === patientId);
    if (!targetPatient) return;

    const memoText = newMemos[patientId]?.trim();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 1. 글로벌 마스터 DB 동기화
    const globalMatch = MASTER_HANDOFF_DB.find(p => p.id === patientId);
    if (globalMatch) {
      globalMatch.lastVitals = { ...targetPatient.lastVitals };
      if (memoText) {
        globalMatch.addedMemos = [...(globalMatch.addedMemos || []), { time: timeStr, text: memoText }];
      }
    }

    // 2. 화면 리스트 리렌더링 (블록 업로드 시각화 및 텍스트창 초기화)
    setPatientsList(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          lastVitals: { ...targetPatient.lastVitals },
          addedMemos: memoText ? [...(p.addedMemos || []), { time: timeStr, text: memoText }] : p.addedMemos
        };
      }
      return p;
    }));

    // 입력창 텍스트만 비워주어 업로드된 느낌 제공
    if (memoText) {
      setNewMemos(prev => ({ ...prev, [patientId]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-all text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>대시보드</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">인수인계 세션 준비</h1>
          </div>
          
          <div className="flex gap-3">
            <button onClick={onNursingBriefingClick} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Presentation className="w-4 h-4" />
              브리핑 모드
            </button>
            <button 
              onClick={() => onGenerateDocument(selectedIds)}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0052CC] text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-all shadow-md"
            >
              <FileText className="w-4 h-4" />
              문서 확정
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Selection Area */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-slate-800">대상 환자 선택 ({selectedIds.length}명)</h2>
            <button onClick={handleToggleAll} className="text-sm text-blue-600 font-medium hover:underline">
              {isAllSelected ? '전체 해제' : '전체 선택'}
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {patientsList.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                className={cn(
                  "px-4 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 font-medium",
                  selectedIds.includes(p.id) ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full", p.status === 'danger' ? "bg-red-500" : "bg-amber-500")} />
                {p.name} <span className="text-xs opacity-60">{p.room}호</span>
              </button>
            ))}
          </div>
        </section>

        {/* Patient Detail List */}
        <div className="grid gap-6">
          {patientsList.map(patient => (
            <div 
              key={patient.id} 
              className={cn(
                "bg-white rounded-2xl border border-slate-200 transition-all p-6 shadow-sm",
                selectedIds.includes(patient.id) ? "border-blue-600 ring-1 ring-blue-600/30" : ""
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200/60">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-slate-900">{patient.name}</span>
                      <StatusBadge status={patient.status} />
                    </div>
                    <p className="text-sm text-slate-500">{patient.age}세 · {patient.diagnosis} · {patient.room}호</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  최종 기록: {patient.lastVitals.time}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* 왼쪽 세션 영역 (바이탈 입력 및 💡업로드 시각화 블록) */}
                <div className="space-y-6">
                  {/* BP, HR, BT Inputs */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">BP (혈압)</p>
                      <input 
                        type="text"
                        value={patient.lastVitals.bp}
                        onChange={(e) => handleLiveInputChange(patient.id, 'bp', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-blue-500 font-mono font-bold text-slate-800 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">HR (심박수)</p>
                      <div className="flex items-center gap-0.5">
                        <input 
                          type="text"
                          value={patient.lastVitals.hr}
                          onChange={(e) => handleLiveInputChange(patient.id, 'hr', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-blue-500 font-mono font-bold text-slate-800 focus:outline-none text-sm"
                        />
                        <span className="text-xs text-slate-400 font-mono">bpm</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">BT (체온)</p>
                      <div className="flex items-center gap-0.5">
                        <input 
                          type="text"
                          value={patient.lastVitals.temp}
                          onChange={(e) => handleLiveInputChange(patient.id, 'temp', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-blue-500 font-mono font-bold text-slate-800 focus:outline-none text-sm"
                        />
                        <span className="text-xs text-slate-400 font-mono">°C</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 메모 기록 영역 */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">주요 특이사항 기록</h4>
                    
                    {/* 기본 인계 메모 (고정 출력) */}
                    {patient.notes && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-2 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">기본 인계 메모</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{patient.notes}</p>
                      </div>
                    )}

                    {/* 💡 사용자가 방금 업로드(저장)한 추가 메모들이 쌓이는 공간 */}
                    {patient.addedMemos && patient.addedMemos.map((memo, idx) => (
                      <div key={idx} className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-2 text-blue-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">{memo.time} 업로드됨</span>
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed">{memo.text}</p>
                      </div>
                    ))}

                    {/* 새로운 텍스트 입력창 및 입력 버튼 */}
                    <div className="pt-2">
                      <textarea 
                        value={newMemos[patient.id] || ''}
                        onChange={(e) => handleMemoChange(patient.id, e.target.value)}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052CC] transition-all shadow-sm"
                        placeholder="새로운 특이사항을 입력하고 아래 버튼을 눌러 업로드하세요..."
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => handleSavePatientData(patient.id)}
                        className="mt-3 px-4 py-2 bg-[#0052CC] hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        입력 완료 (저장 및 업로드)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 오른쪽 세션 영역: 💡 원본 피그마의 깔끔한 체크박스 형태로 디자인 롤백 */}
<div className="p-5 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-inner">
  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
    <Clock className="w-4 h-4 text-slate-400" /> 
    <span>인계 대기 업무</span>
  </h4>
  
  <div className="space-y-3">
    {patient.pendingTasks.map((task, idx) => {
      const taskKey = `${patient.id}-${idx}`;
      const isTaskChecked = checkedTasks.includes(taskKey);

      return (
        <div 
          key={idx} 
          onClick={() => handleToggleTask(patient.id, idx)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border shadow-2xs text-sm select-none transition-all cursor-pointer",
            isTaskChecked 
              ? "border-blue-600 bg-white font-semibold" 
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          )}
        >
          {/* 원본 사각형 체크박스 */}
          <div className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
            isTaskChecked ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-white"
          )}>
            <Check className={cn(
              "w-3 h-3 transition-all",
              isTaskChecked ? "text-blue-600 opacity-100" : "text-transparent opacity-0"
            )} />
          </div>
          
          {/* 업무 텍스트 (체크 시 취소선) */}
          <span className={cn(
            "text-slate-700 font-medium", 
            isTaskChecked && "line-through text-slate-400"
          )}>
            {task.task}
          </span>
        </div>
      );
    })}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}