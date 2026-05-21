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
  XCircle,
  Youtube
} from 'lucide-react';
// 마스터 데이터베이스에서 실시간 환자 정보를 동적 매핑합니다.
import { PATIENTS_DATABASE } from '../PatientList';

interface PatientDetailPageProps {
  patientId: number;
  onBack: () => void;
  onVitalsClick: (patientId: number) => void;
  onEducationClick: (patientId: number) => void;
}

export function PatientDetailPage({ patientId, onBack, onVitalsClick, onEducationClick }: PatientDetailPageProps) {
  const [newOrder, setNewOrder] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [hoveredSummaryItem, setHoveredSummaryItem] = useState<number | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<{ [key: number]: boolean }>({});

  // 💡 [동적 연동] 선택된 patientId로 데이터베이스에서 환자 객체를 실시간 추출
  const targetPatient = PATIENTS_DATABASE.find(p => p.id === patientId) || PATIENTS_DATABASE[0];
  const [orders, setOrders] = useState(targetPatient.doctorOrders);

  useEffect(() => {
    setOrders(targetPatient.doctorOrders);
  }, [patientId, targetPatient]);

  const toggleTaskStatus = (taskId: number) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleAddOrder = () => {
    if (newOrder.trim()) {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newOrderObj = {
        id: orders.length + 1,
        doctor: '추가된 오더',
        time: formattedTime,
        order: newOrder.trim()
      };

      targetPatient.doctorOrders = [...orders, newOrderObj];
      setOrders([...orders, newOrderObj]);
      setNewOrder('');
    }
  };

  // 모든 환자별 데이터베이스 조건 기반 AI 처방 분석 & 스펙 카드 완전 자동 매핑 로직
  const getPatientSpecificAI = () => {
    if (targetPatient.diagnosis.includes('심근경색') || targetPatient.id === 1) {
      return {
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
              precautions: ['aPTT 정기 모니터링 (목표: 정상의 1.5-2.5배)', '출혈 징후 관찰 (잇몸 출혈, 혈뇨, 흑색변 등)'],
              contraindications: ['활동성 출혈', '중증 혈소판 감소증', '최근 뇌출혈 또는 뇌수술'],
              youtubeGuide: 'https://youtube.com/watch?v=heparin-guide'
            }
          },
          { text: '활력징후 2시간마다 측정 필수', medicationGuide: null },
          { text: '엄격한 섭취량/배출량 기록', medicationGuide: null },
          { text: '침상 안정, 화장실 보행 허용', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '아스피린 투여 금지 - 알레르기 있음' },
          { type: 'warning', text: '혈압 >160/100 또는 HR >110 시 즉시 보고' },
          { type: 'info', text: '심전도 지속 모니터링 중' }
        ],
        autoTasks: [
          { id: 1, time: '14:00', task: '활력징후 측정', reason: '오더: "Monitor vital signs q2h" → 2시간마다 측정', supplies: ['혈압계', '체온계', '청진기'], guide: true },
          { id: 2, time: '14:00', task: '헤파린 5000 units IV 투여', reason: '오더: "Heparin 5000 units IV q4h" → 4시간마다 투여', supplies: ['헤파린 바이알', '주사기 (5mL)', 'IV 라인', '알코올 솜'], guide: true },
          { id: 3, time: '14:30', task: '섭취량/배출량 기록', reason: '오더: "Strict I&O" → 엄격한 수분 관리 필요', supplies: ['기록지', '측정 컵'], guide: false }
        ],
        statusAnalysis: [
          { type: 'danger', title: '수축기 혈압 위험 격상', detail: `현재 혈압 ${targetPatient.vitals.bp}로 목표치 상회. 심근 산소 요구량 증가 위험.`, action: 'PRN 오더 확인 및 침상 안정 유지' },
          { type: 'warning', title: '빈맥성 심박수 감지', detail: `현재 심박수 ${targetPatient.vitals.hr}bpm. 심근 허혈 증상 재발 모니터링 필요.`, action: '2시간 간격 EKG 리듬 체크 연속 수행' },
          { type: 'normal', title: '체온 안정 유지 상태', detail: `현재 체온 ${targetPatient.vitals.temp}°C로 정상 범위 내에서 통제되고 있습니다.`, action: '지속적인 린넨 관리 및 기초 바이탈 유지' }
        ]
      };
    } else if (targetPatient.diagnosis.includes('뇌졸중') || targetPatient.id === 4) {
      return {
        summary: [
          {
            text: '액티라제(rt-PA) 투여 후 24시간 출혈 위험도 정밀 관찰',
            medicationGuide: {
              name: 'rt-PA 지침 가이드',
              usage: '지정 용량 정맥 투여 후 카테터 부위 압박 집중 유지',
              precautions: ['지속적인 신경학적 상태 변화 모니터링', '잇몸 출혈 여부 체크'],
              contraindications: ['활동성 내부 출혈 환자', '최근 뇌수술 에피소드'],
              youtubeGuide: 'https://youtube.com/watch?v=rtpa-guide'
            }
          },
          { text: '신경학적 검진 (Pupil Reflex 및 사지 근력) 1시간 간격 체크', medicationGuide: null },
          { text: '음식물 섭취 전 연하곤란 선별 테스트 진행 필수', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '의식 수준(GCS Score) 저하 시 뇌신경 센터 즉시 노티' },
          { type: 'warning', text: '급격한 수축기 혈압 스파이크 방지 조치 유지' }
        ],
        autoTasks: [
          { id: 1, time: '14:00', task: '신경학적 동공 반사 및 GCS 측정', reason: '오더: "Neurological checks q4h" 지시사항 반영', supplies: ['펜라이트', '의식평가 도구표'], guide: true },
          { id: 2, time: '15:00', task: '침상 머리 각도 30도 거상 유지', reason: '뇌압(ICP) 상승 억제를 위한 상시 침상 포지셔닝 처방', supplies: ['각도계 계측기'], guide: false }
        ],
        statusAnalysis: [
          { type: 'danger', title: '뇌관류압 변동 주의', detail: `현재 혈압 ${targetPatient.vitals.bp}. 뇌부종 및 재출혈 방지를 위한 정밀 조절 구간입니다.`, action: '항고혈압제 투여 라인 개방성 확보' },
          { type: 'warning', title: '자율신경계 불안정 반응', detail: `심박수 ${targetPatient.vitals.hr}bpm. 쿠싱 반사(Cushing reflex) 동반 여부 확인 요망.`, action: '의식 수준과 병행 모니터링' }
        ]
      };
    } else {
      return {
        summary: [
          {
            text: '처방 항생제 정맥 주입 스케줄 유지 및 피부 반응 관찰',
            medicationGuide: {
              name: '정규 항생제 가이드',
              usage: '지정된 IV 수액 라인을 통해 점적 속도 유지하여 주입',
              precautions: ['주입 부위 발적, 통증 발생 여부 주기적 확인'],
              contraindications: ['해당 약물 성분 스킨 테스트 양성 반응자'],
              youtubeGuide: 'https://youtube.com/watch?v=antibio-guide'
            }
          },
          { text: '매 듀티별 정규 활력징후 추적 관리 수행', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '낙상 고위험군 환자 - 사이드레일 거상 상태 상시 점검 요망' }
        ],
        autoTasks: [
          { id: 1, time: '14:00', task: '정규 수액 라인 개방성(Patency) 점검', reason: '약물 유입 안정성 유지 확보', supplies: ['수액 세트 크램프'], guide: true }
        ],
        statusAnalysis: [
          { type: 'danger', title: '생체 징후 변화 주시', detail: `현재 혈압 수치 ${targetPatient.vitals.bp} 모니터링 구간 진입`, action: '안정 휴식 후 정규 타임 바이탈 재평가' },
          { type: 'normal', title: '체온 제어 상태 양호', detail: `현재 BT ${targetPatient.vitals.temp}°C로 정상 범위 안에서 안정적임`, action: '린넨 쾌적성 유지 및 수분 공급 관리 지속' }
        ]
      };
    }
  };

  const currentAI = getPatientSpecificAI();

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
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F1F5F9' }}>
                <User className="w-8 h-8" style={{ color: '#94A3B8' }} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>{targetPatient.name}</h1>
                  <span 
                    className="px-3 py-1 text-sm font-bold" 
                    style={{ 
                      borderRadius: '8px', 
                      backgroundColor: targetPatient.status === 'critical' ? '#FEE2E2' : targetPatient.status === 'monitoring' ? '#FEF3C7' : '#D1FAE5', 
                      color: targetPatient.status === 'critical' ? '#DC2626' : targetPatient.status === 'monitoring' ? '#D97706' : '#10B981' 
                    }}
                  >
                    {targetPatient.status === 'critical' ? '위험' : targetPatient.status === 'monitoring' ? '주의' : '안정'}
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
                className="px-4 py-2 flex items-center gap-2 bg-white border hover:bg-gray-50 transition-colors font-medium text-sm"
                style={{ borderRadius: '12px', borderColor: '#E2E8F0', color: '#0052CC' }}
              >
                <BookOpen className="w-5 h-5" />
                환자 교육
              </button>
              <button
                onClick={() => onVitalsClick(patientId)}
                className="px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity font-medium text-sm"
                style={{ borderRadius: '12px', backgroundColor: '#0052CC', color: 'white' }}
              >
                <Activity className="w-5 h-5" />
                바이탈 입력
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6 items-start">
          
          {/* Left Side Content Column */}
          <div className="col-span-2 space-y-6">
            
            {/* Doctor Orders Section */}
            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: '#0052CC' }} />
                    <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>의사 오더</h2>
                  </div>
                  <button
                    onClick={() => setShowAIPanel(!showAIPanel)}
                    className="text-sm px-3 py-1 border hover:bg-gray-50 transition-colors font-medium text-gray-500"
                    style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                  >
                    AI 용어 설명
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400">등록된 처방 오더 지시사항이 없습니다.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 border shadow-2xs" style={{ borderRadius: '12px', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm" style={{ color: '#1E293B' }}>{order.doctor}</span>
                        <div className="flex items-center gap-1 text-sm" style={{ color: '#94A3B8' }}>
                          <Clock className="w-4 h-4" />
                          <span>{order.time}</span>
                        </div>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed" style={{ color: '#64748B' }}>
                        {order.order}
                      </pre>
                    </div>
                  ))
                )}

                {/* Add New Order Card Form */}
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
                    placeholder="새로운 처방 오더 지시사항을 입력하세요... (Ctrl + Enter로 바로 추가)"
                    className="w-full p-3 border text-sm focus:outline-none bg-white"
                    style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
                    rows={3}
                  />
                  <button
                    onClick={handleAddOrder}
                    className="mt-2 px-4 py-1.5 flex items-center gap-2 hover:opacity-90 transition-opacity font-semibold text-xs text-white"
                    style={{ borderRadius: '8px', backgroundColor: '#0052CC' }}
                  >
                    <Plus className="w-4 h-4" />
                    오더 추가
                  </button>
                </div>
              </div>
            </div>

            {/* AI 오더 분석 */}
            <div className="p-6 border" style={{ borderRadius: '12px', backgroundColor: '#F0F7FF', borderColor: '#DBEAFE' }}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5" style={{ color: '#0052CC' }} />
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>AI 오더 분석</h2>
              </div>

              {/* Critical/Warning Highlights */}
              {currentAI.highlights.length > 0 && (
                <div className="mb-4 space-y-2">
                  {currentAI.highlights.map((hl, i) => (
                    <div 
                      key={i} 
                      className="p-3 flex items-center gap-2 text-sm font-bold shadow-2xs" 
                      style={{ 
                        borderRadius: '8px', 
                        backgroundColor: hl.type === 'critical' ? '#FEE2E2' : '#FEF3C7',
                        color: hl.type === 'critical' ? '#DC2626' : '#D97706',
                        borderColor: hl.type === 'critical' ? '#FCA5A5' : '#FDE68A',
                        borderWidth: '1px'
                      }}
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{hl.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Items with Popover Tooltip */}
              <div className="space-y-3">
                {currentAI.summary.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-blue-50/50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                      <span className="text-sm font-medium text-slate-700 leading-relaxed">{item.text}</span>
                    </div>
                    
                    {item.medicationGuide && (
                      <div
                        className="relative flex-shrink-0"
                        onMouseEnter={() => setHoveredSummaryItem(index)}
                        onMouseLeave={() => setHoveredSummaryItem(null)}
                      >
                        <Info className="w-5 h-5 cursor-pointer text-[#0052CC] hover:scale-110 transition-transform" />

                        {/* 피그마형 의학 정보 가이드 말풍선 툴팁 */}
                        {hoveredSummaryItem === index && (
                          <div 
                            className="absolute right-0 top-7 w-[350px] bg-white border-2 p-5 z-50 text-left cursor-default shadow-2xl" 
                            style={{ borderRadius: '14px', borderColor: '#0052CC' }}
                          >
                            <div className="flex items-center gap-2 mb-2 border-b pb-2" style={{ borderColor: '#F1F5F9' }}>
                              <Brain className="w-5 h-5 text-[#0052CC]" />
                              <h4 className="font-bold text-sm text-slate-800">{item.medicationGuide.name}</h4>
                            </div>
                            <div className="space-y-3 text-xs">
                              <div>
                                <span className="font-bold text-blue-600 block mb-0.5">[투여 방법]</span>
                                <p className="text-slate-600 font-medium">{item.medicationGuide.usage}</p>
                              </div>
                              <div>
                                <span className="font-bold text-amber-600 block mb-0.5">[주의 사항]</span>
                                <ul className="list-disc pl-4 text-slate-600 space-y-0.5 font-medium">
                                  {item.medicationGuide.precautions.map((p, idx) => <li key={idx}>{p}</li>)}
                                </ul>
                              </div>
                              <div>
                                <span className="font-bold text-red-600 block mb-0.5">[절대 금기]</span>
                                <ul className="list-disc pl-4 text-slate-600 space-y-0.5 font-medium">
                                  {item.medicationGuide.contraindications.map((c, idx) => <li key={idx}>{c}</li>)}
                                </ul>
                              </div>
                              
                              <a 
                                href={item.medicationGuide.youtubeGuide} 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-2.5 py-2 px-3 w-full flex items-center justify-center gap-2 bg-[#FF0000] text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-center text-xs"
                              >
                                <Youtube className="w-4 h-4" />
                                <span>투약 핵심 가이드 영상 시청</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 💡 [디자인 완전 롤백] 자동 생성 간호 업무 목록 (생성 이유 파란 상자, 필요 물품 그리드 태그 원본 복구) */}
            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>자동 생성 간호 업무</h2>
                <p className="text-sm mt-1 text-gray-500 font-medium">오더 기반으로 자동 생성된 업무 목록</p>
              </div>

              <div className="p-6 space-y-4">
                {currentAI.autoTasks.map((task) => (
                  <div key={task.id} className="border p-4" style={{ borderRadius: '12px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-bold font-mono text-sm text-gray-700">{task.time}</span>
                        </div>
                        <div className="text-lg font-bold text-slate-800">{task.task}</div>
                      </div>
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="px-3 py-1 border-2 transition-all text-sm font-bold"
                        style={{
                          borderRadius: '8px',
                          backgroundColor: taskStatuses[task.id] ? '#D1FAE5' : 'white',
                          borderColor: taskStatuses[task.id] ? '#10B981' : '#E2E8F0',
                          color: taskStatuses[task.id] ? '#047857' : '#64748B'
                        }}
                      >
                        {taskStatuses[task.id] ? '완료' : '미완료'}
                      </button>
                    </div>

                    {/* 💡 원본 파란색 생성 이유 메시지 박스 롤백 */}
                    <div className="border p-3 mb-3" style={{ borderRadius: '8px', backgroundColor: '#DBEAFE', borderColor: '#93C5FD' }}>
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                        <div>
                          <div className="text-sm font-bold text-[#1E3A8A] mb-0.5">생성 이유</div>
                          <div className="text-sm font-medium text-[#1E40AF]">{task.reason}</div>
                        </div>
                      </div>
                    </div>

                    {/* 💡 원본 물품 감싸기 태그 보드 구조 롤백 */}
                    <div className="p-3" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-[#1E293B] mb-2">필요 물품</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {task.supplies.map((supply, i) => (
                              <span key={i} className="px-2.5 py-1 bg-white border text-xs font-bold text-gray-600 rounded-md" style={{ borderColor: '#E2E8F0' }}>
                                {supply}
                              </span>
                            ))}
                          </div>
                          {task.guide && (
                            <button className="mt-1 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                              처치 가이드 보기 →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 💡 Right Side Content Column - 오른쪽 세션만 독단적으로 고정 내부 스크롤 조작 타겟팅 */}
          <div className="space-y-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
            
            {/* Realtime Vitals Summary Dashboard */}
            <div className="bg-white border p-6" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: '#0052CC' }} />
                <h2 className="text-md font-bold text-slate-800">환자 실시간 모니터링 스펙</h2>
              </div>
              <div className="space-y-3.5 text-sm text-gray-600">
                <div className="flex justify-between border-b pb-2.5">
                  <span className="font-semibold text-gray-400">혈압 (BP)</span>
                  <span className="font-bold text-slate-800 font-mono text-base">{targetPatient.vitals.bp}</span>
                </div>
                <div className="flex justify-between border-b pb-2.5">
                  <span className="font-semibold text-gray-400">심박수 (HR)</span>
                  <span className="font-bold text-slate-800 font-mono text-base">{targetPatient.vitals.hr} bpm</span>
                </div>
                <div className="flex justify-between border-b pb-2.5">
                  <span className="font-semibold text-gray-400">체온 (BT)</span>
                  <span className="font-bold text-slate-800 font-mono text-base">{targetPatient.vitals.temp} °C</span>
                </div>
              </div>
            </div>

            {/* AI 상태 분석 빨·노·파 리포트 세션 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Brain className="w-5 h-5 text-[#0052CC]" />
                <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase">실시간 이상 감지</h3>
              </div>
              
              {currentAI.statusAnalysis.map((analysis, index) => (
                <div
                  key={index}
                  className="p-4 border-2 shadow-2xs"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: analysis.type === 'danger' ? '#FEF2F2' : analysis.type === 'warning' ? '#FFFBEB' : '#F0FDF4',
                    borderColor: analysis.type === 'danger' ? '#FCA5A5' : analysis.type === 'warning' ? '#FDE68A' : '#93C5FD'
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: analysis.type === 'danger' ? '#EF4444' : analysis.type === 'warning' ? '#F59E0B' : '#10B981' }} />
                    <h4 className="font-bold text-xs" style={{ color: analysis.type === 'danger' ? '#991B1B' : analysis.type === 'warning' ? '#92400E' : '#14532D' }}>
                      {analysis.title}
                    </h4>
                  </div>
                  <p className="text-xs font-semibold mb-2.5 leading-relaxed" style={{ color: analysis.type === 'danger' ? '#B91C1C' : analysis.type === 'warning' ? '#B45309' : '#15803D' }}>
                    {analysis.detail}
                  </p>
                  <div className="text-xs font-bold" style={{ color: analysis.type === 'danger' ? '#7F1D1D' : analysis.type === 'warning' ? '#78350F' : '#166534' }}>
                    → {analysis.action}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}