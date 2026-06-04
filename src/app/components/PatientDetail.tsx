import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Activity,
  FileText,
  Brain,
  AlertTriangle,
  CheckCircle,
  Package,
  Info,
  Clock,
  Plus,
  BookOpen,
  XCircle
} from 'lucide-react';
//  대시보드와 데이터를 완벽하게 매핑 공유하기 위해 중앙 마스터 데이터베이스를 호출합니다.
import { PATIENTS_DATABASE } from './PatientList';

interface PatientDetailPageProps {
  patientId: number;
  onBack: () => void;
  onVitalsClick: (patientId: number) => void;
  onEducationClick: (patientId: number) => void;
  onHistoryClick?: (patientId: number) => void;
}

export function PatientDetailPage({ patientId, onBack, onVitalsClick, onEducationClick, onHistoryClick }: PatientDetailPageProps) {
  const [newOrder, setNewOrder] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [hoveredSummaryItem, setHoveredSummaryItem] = useState<number | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<{ [key: number]: 'pending' | 'completed' }>({});

  // 💡 [핵심 연동] 부모(App.tsx)에게 넘겨받은 고유 id와 일치하는 진짜 환자 데이터를 마스터 DB에서 실시간 탐색합니다.
  const targetPatient = PATIENTS_DATABASE.find(p => p.id === patientId) || PATIENTS_DATABASE[0];

  // 💡 [핵심 연동] 찾아낸 타겟 환자의 개별 의사 처방 오더 내역으로 동적 상태(State)를 초기화합니다.
  const [orders, setOrders] = useState(targetPatient.doctorOrders);

  // 대시보드에서 다른 환자를 클릭하여 진입할 때마다 페이지 안의 오더 상태값을 재동기화합니다.
  useEffect(() => {
    setOrders(targetPatient.doctorOrders);
  }, [patientId, targetPatient]);

  const toggleTaskStatus = (taskId: number) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: prev[taskId] === 'completed' ? 'pending' : 'completed'
    }));
  };

  const getTaskStatus = (taskId: number) => {
    return taskStatuses[taskId] || 'pending';
  };

  const aiAnalysis = {
    summary: [
      {
        text: '니트로글리세린 0.4mg 필요시 설하 투여 (흉통 발생 시)',
        medicationGuide: {
          name: '니트로글리세린 투약 가이드',
          usage: '흉통 발생 시 설하(혀 밑) 투여, 설탕이 없도록 주의',
          precautions: ['투여 전후 혈압 모니터링 필수 (저혈압 위험)'],
          contraindications: ['폐쇄형 치료제 복용 환자(저혈압 지혈장 발생)'],
          youtubeGuide: 'https://youtube.com/watch?v=nitro-guide'
        }
      },
      {
        text: '헤파린 5000 단위 정맥 주사, 4시간마다',
        medicationGuide: {
          name: '헤파린 투약 가이드',
          usage: '혈전 예방을 위해 5000 units을 4시간마다 정맥 주사',
          precautions: [
            'aPTT 정기 모니터링 (목표: 정상의 1.5-2.5배)',
            '출혈 징후 관찰 (잇몸 출혈, 혈뇨, 흑색변 등)'
          ],
          contraindications: [
            '활동성 출혈',
            '중증 혈소판 감소증',
            '최근 뇌출혈 또는 뇌수술'
          ],
          youtubeGuide: 'https://youtube.com/watch?v=heparin-guide'
        }
      },
      { text: '활력징후 2시간마다 측정 필수', medicationGuide: null },
      { text: '엄격한 섭취량/배출량 기록', medicationGuide: null },
      { text: '침상 안정, 화장실 보행 허용', medicationGuide: null }
    ],
    highlights: [
      {
        type: 'critical',
        text: '아스피린 투여 금지 - 알레르기 있음',
        medicationGuide: {
          name: '아스피린 (Aspirin)',
          usage: '혈전 예방 및 심근경색 재발 방지를 위해 하루 1회 100mg 경구 투여',
          precautions: [
            '식후 30분 이내 복용 권장',
            '위장 출혈 증상 모니터링',
            '다른 항혈소판제와 병용 시 출혈 위험 증가'
          ],
          contraindications: [
            '아스피린 또는 NSAID 알레르기',
            '활동성 출혈 또는 출혈 경향',
            '중증 간 또는 신장 기능 장애'
          ],
          youtubeGuide: 'https://youtube.com/watch?v=aspirin-guide'
        }
      },
      {
        type: 'warning',
        text: '혈압 >160/100 또는 HR >110 시 즉시 보고',
        medicationGuide: {
          name: '니트로글리세린 (Nitroglycerin)',
          usage: '흉통 발생 시 0.4mg 설하 투여, 5분 간격으로 최대 3회까지 반복 가능',
          precautions: [
            '투여 시 환자를 앉히거나 눕힌 상태 유지 (기립성 저혈압 예방)',
            '두통, 어지러움 발생 가능',
            '투여 후 혈압 및 심박수 모니터링'
          ],
          contraindications: [
            '수축기 혈압 90mmHg 미만',
            '최근 24시간 내 실데나필(비아그라) 복용',
            '우심실 경색'
          ],
          youtubeGuide: 'https://youtube.com/watch?v=nitro-guide'
        }
      },
      {
        type: 'info',
        text: '심전도 지속 모니터링 중',
        medicationGuide: {
          name: '헤파린 (Heparin)',
          usage: '혈전 예방을 위해 5000 units을 4시간마다 정맥 주사',
          precautions: [
            'aPTT 정기 모니터링 (목표: 정상의 1.5-2.5배)',
            '출혈 징후 관찰 (잇몸 출혈, 혈뇨, 흑색변 등)',
            '혈소판 감소증(HIT) 모니터링'
          ],
          contraindications: [
            '활동성 출혈',
            '중증 혈소판 감소증',
            '최근 뇌출혈 또는 뇌수술'
          ],
          youtubeGuide: 'https://youtube.com/watch?v=heparin-guide'
        }
      }
    ]
  };

  const autoTasks = [
    {
      id: 1,
      time: '14:00',
      task: '활력징후 측정',
      reason: '오더: "Monitor vital signs q2h" → 2시간마다 측정',
      status: 'pending',
      supplies: ['혈압계', '체온계', '청진기'],
      guide: true
    },
    {
      id: 2,
      time: '14:00',
      task: '헤파린 5000 units IV 투여',
      reason: '오더: "Heparin 5000 units IV q4h" → 4시간마다 투여',
      status: 'pending',
      supplies: ['헤파린 바이알', '주사기 (5mL)', 'IV 라인', '알코올 솜'],
      guide: true
    },
    {
      id: 3,
      time: '14:30',
      task: '섭취량/배출량 기록',
      reason: '오더: "Strict I&O" → 엄격한 수분 관리 필요',
      status: 'pending',
      supplies: ['기록지', '측정 컵'],
      guide: false
    },
    {
      id: 4,
      time: '16:00',
      task: '활력징후 측정',
      reason: '오더: "Monitor vital signs q2h" → 2시간마다 측정',
      status: 'pending',
      supplies: ['혈압계', '체온계', '청진기'],
      guide: true
    }
  ];

  const aiStatusAnalysis = [
    {
      type: 'danger',
      title: '혈압 상승 추세',
      detail: '지난 6시간 평균 혈압 158/94 → 160/95 상승 중',
      action: '계속 모니터링, 165/100 초과 시 의사 보고'
    },
    {
      type: 'warning',
      title: '심박수 정상 범위 상한',
      detail: '현재 HR 102, 정상 범위 내이나 높은 편',
      action: '2시간마다 측정 유지, 110 초과 시 보고'
    },
    {
      type: 'info',
      title: '니트로글리세린 효과',
      detail: '투여 후 흉통 완화 보고됨',
      action: '흉통 재발 시 즉시 투여 가능'
    }
  ];

  // 오더 추가 버튼 핸들러 수정: 입력한 데이터가 현재 선택된 매핑 환자의 데이터베이스 인덱스 캐시에 정상 누적되도록 세팅
  const handleAddOrder = () => {
    if (newOrder.trim()) {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newOrderObj = {
        id: orders.length + 1,
        doctor: '간호사 추가 오더', 
        time: formattedTime,
        order: newOrder.trim()
      };

      // 마스터 캐시 및 로컬 배열 동시 업데이트 수행
      targetPatient.doctorOrders = [...orders, newOrderObj];
      setOrders([...orders, newOrderObj]);
      setNewOrder('');
    }
  };

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
            <span>환자 목록으로 돌아가기</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onHistoryClick && onHistoryClick(patientId)}
                className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer border border-transparent hover:border-blue-300 group shadow-sm" 
                style={{ backgroundColor: '#F1F5F9' }}
                title="이전 진료 기록 및 차팅 보기"
              >
                <User className="w-8 h-8 group-hover:text-[#0052CC] transition-colors" style={{ color: '#94A3B8' }} />
              </button>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {/* 💡 동적 매핑 연동 구역: 타겟 환자의 이름 출력 */}
                  <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>{targetPatient.name}</h1>
                  <span 
                    className="px-3 py-1 text-sm font-bold" 
                    style={{ 
                      borderRadius: '8px', 
                      backgroundColor: targetPatient.status === 'critical' ? '#FEE2E2' : '#FEF3C7', 
                      color: targetPatient.status === 'critical' ? '#DC2626' : '#D97706' 
                    }}
                  >
                    {targetPatient.status === 'critical' ? '위험' : targetPatient.status === 'monitoring' ? '주의' : '대기'}
                  </span>
                </div>
                <div className="text-sm font-medium" style={{ color: '#64748B' }}>
                  {targetPatient.age}세 • {targetPatient.gender} • 병실 {targetPatient.room}호
                </div>
                <div className="mt-1 text-sm font-semibold text-blue-600">{targetPatient.diagnosis}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onEducationClick(patientId)}
                className="px-4 py-2 flex items-center gap-2 bg-white border hover:bg-gray-50 transition-colors text-sm font-medium"
                style={{ borderRadius: '12px', borderColor: '#E2E8F0', color: '#0052CC' }}
              >
                <BookOpen className="w-5 h-5" />
                환자 교육
              </button>
              <button
                onClick={() => onVitalsClick(patientId)}
                className="px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity text-sm font-medium"
                style={{ borderRadius: '12px', backgroundColor: '#0052CC', color: 'white' }}
              >
                <Activity className="w-5 h-5" />
                바이탈 입력
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Orders and Tasks */}
          <div className="col-span-2 space-y-6">
            {/* Doctor Orders */}
            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: '#0052CC' }} />
                    <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>의사 처방 오더 내역</h2>
                  </div>
                  <button
                    onClick={() => setShowAIPanel(!showAIPanel)}
                    className="text-xs px-3 py-1 border hover:bg-gray-50 transition-colors font-medium text-gray-500"
                    style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  >
                    AI 용어 설명
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400">등록된 지시사항 오더가 없습니다.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 border shadow-2xs" style={{ borderRadius: '12px', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm" style={{ color: '#1E293B' }}>{order.doctor}</span>
                        <div className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
                          <Clock className="w-4 h-4" />
                          <span>{order.time}</span>
                        </div>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed" style={{ color: '#475569' }}>
                        {order.order}
                      </pre>
                    </div>
                  ))
                )}

                {/* Add New Order */}
                <div className="p-4 border-2 border-dashed" style={{ borderRadius: '12px', borderColor: '#CBD5E1' }}>
                  <textarea
                    value={newOrder}
                    onChange={(e) => setNewOrder(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        handleAddOrder();
                      }
                    }}
                    placeholder="새 오더 입력... (Ctrl + Enter로 빠르게 오더 추가 가능)"
                    className="w-full p-3 border text-sm focus:outline-none resize-none bg-white"
                    style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                    rows={3}
                  />
                  <button
                    onClick={handleAddOrder}
                    className="mt-2 px-4 py-1.5 flex items-center gap-2 hover:opacity-90 transition-opacity text-xs font-semibold"
                    style={{ borderRadius: '8px', backgroundColor: '#0052CC', color: 'white' }}
                  >
                    <Plus className="w-4 h-4" />
                    오더 추가
                  </button>
                </div>
              </div>
            </div>

            {/* AI Order Analysis */}
            <div className="p-6 border" style={{ borderRadius: '12px', backgroundColor: '#F0F7FF', borderColor: '#DBEAFE' }}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5" style={{ color: '#0052CC' }} />
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>AI 자동화 오더 분석 요약</h2>
              </div>

              <div className="space-y-3 mb-4">
                {aiAnalysis.summary.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 relative">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                    <span className="flex-1 text-sm text-gray-700">{item.text}</span>
                    {item.medicationGuide && (
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredSummaryItem(index)}
                        onMouseLeave={() => setHoveredSummaryItem(null)}
                      >
                        <Info
                          className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                          style={{ color: '#0052CC' }}
                        />

                        {/* Medication Guide Tooltip */}
                        {hoveredSummaryItem === index && (
                          <div className="absolute right-0 top-8 w-96 bg-white border-2 z-50 p-5" style={{ borderRadius: '12px', borderColor: '#E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                            <div className="mb-4">
                              <h3 className="text-xl font-medium mb-1" style={{ color: '#0052CC' }}>
                                {item.medicationGuide.name}
                              </h3>
                            </div>

                            <div className="space-y-4 mb-5">
                              {/* Usage */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                                  <div className="text-sm font-medium" style={{ color: '#1E293B' }}>사용법</div>
                                </div>
                                <p className="text-sm ml-7" style={{ color: '#64748B' }}>{item.medicationGuide.usage}</p>
                              </div>

                              {/* Precautions */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-5 h-5" style={{ color: '#F59E0B' }} />
                                  <div className="text-sm font-medium" style={{ color: '#1E293B' }}>주의사항</div>
                                </div>
                                <ul className="space-y-1 ml-7">
                                  {item.medicationGuide.precautions.map((precaution, i) => (
                                    <li key={i} className="text-sm" style={{ color: '#64748B' }}>
                                      {precaution}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Contraindications */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <XCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
                                  <div className="text-sm font-medium" style={{ color: '#1E293B' }}>사용금지</div>
                                </div>
                                <ul className="space-y-1 ml-7">
                                  {item.medicationGuide.contraindications.map((contraindication, i) => (
                                    <li key={i} className="text-sm" style={{ color: '#64748B' }}>
                                      {contraindication}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* YouTube Guide Button */}
                            <button
                              onClick={() => window.open(item.medicationGuide.youtubeGuide, '_blank')}
                              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 font-medium"
                              style={{ borderRadius: '8px', backgroundColor: '#FF0000' }}
                            >
                              관련 지식 교육 영상 (YouTube)
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                            <p className="text-xs text-center mt-2" style={{ color: '#94A3B8' }}>
                              상세 간호사 교육 가이드 영상
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {aiAnalysis.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="p-3 flex items-start gap-2 border"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: highlight.type === 'critical' ? '#FEE2E2' :
                                       highlight.type === 'warning' ? '#FEF3C7' : '#DBEAFE',
                      borderColor: highlight.type === 'critical' ? '#FCA5A5' :
                                   highlight.type === 'warning' ? '#FDE68A' : '#93C5FD'
                    }}
                  >
                    <AlertTriangle
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{
                        color: highlight.type === 'critical' ? '#DC2626' :
                               highlight.type === 'warning' ? '#F59E0B' : '#0052CC'
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: highlight.type === 'critical' ? '#7F1D1D' :
                               highlight.type === 'warning' ? '#78350F' : '#1E3A8A'
                      }}
                    >
                      {highlight.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-Generated Tasks */}
            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>자동 생성 간호 업무</h2>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>오더 기반으로 자동 생성된 업무 목록</p>
              </div>

              <div className="p-6 space-y-4">
                {autoTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border p-4"
                    style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4" style={{ color: '#94A3B8' }} />
                          <span className="font-medium" style={{ color: '#1E293B' }}>{task.time}</span>
                        </div>
                        <div className="text-lg mb-2" style={{ color: '#1E293B' }}>{task.task}</div>
                      </div>
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="px-3 py-1 border-2 transition-all text-sm font-medium"
                        style={{
                          borderRadius: '8px',
                          backgroundColor: getTaskStatus(task.id) === 'completed' ? '#D1FAE5' : 'white',
                          borderColor: getTaskStatus(task.id) === 'completed' ? '#10B981' : '#E2E8F0',
                          color: getTaskStatus(task.id) === 'completed' ? '#047857' : '#64748B'
                        }}
                      >
                        {getTaskStatus(task.id) === 'completed' ? '완료' : '미완료'}
                      </button>
                    </div>

                    {/* Reason */}
                    <div className="border p-3 mb-3" style={{ borderRadius: '8px', backgroundColor: '#DBEAFE', borderColor: '#93C5FD' }}>
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0052CC' }} />
                        <div>
                          <div className="text-sm font-medium mb-1" style={{ color: '#1E3A8A' }}>생성 이유</div>
                          <div className="text-sm" style={{ color: '#1E40AF' }}>{task.reason}</div>
                        </div>
                      </div>
                    </div>

                    {/* Supplies */}
                    <div className="p-3" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#64748B' }} />
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-2" style={{ color: '#1E293B' }}>필요 물품</div>
                          <div className="flex flex-wrap gap-2">
                            {task.supplies.map((supply, i) => (
                              <span key={i} className="px-2 py-1 bg-white border text-sm" style={{ borderRadius: '6px', borderColor: '#E2E8F0', color: '#64748B' }}>
                                {supply}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Realtime Monitoring Specs */}
          <div>
            <div className="bg-white border p-6" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: '#0052CC' }} />
                <h2 className="text-md font-bold text-gray-800">환자 실시간 모니터링 스펙</h2>
              </div>
              {/* 💡 동적 매핑 연동 구역: 선택된 환자의 고유 임상 바이탈 출력 */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-400">혈압 (BP)</span>
                  <span className="font-bold text-gray-800 font-mono text-base">{targetPatient.vitals.bp}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-400">심박수 (HR)</span>
                  <span className="font-bold text-gray-800 font-mono text-base">{targetPatient.vitals.hr} bpm</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-400">체온 (BT)</span>
                  <span className="font-bold text-gray-800 font-mono text-base">{targetPatient.vitals.temp} °C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}