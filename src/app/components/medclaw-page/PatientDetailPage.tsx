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
  ChevronDown,
  BookOpenCheck
} from 'lucide-react';

import { PATIENTS_DATABASE } from '../PatientList';

interface PatientDetailPageProps {
  patientId: number;
  onBack: () => void;
  onVitalsClick: (patientId: number) => void;
  onEducationClick: (patientId: number) => void;
  onHistoryClick?: (patientId: number) => void;
}

interface MedicationGuide {
  name: string;
  usage: string;
  precautions: string[];
  contraindications: string[];
  youtubeGuide?: string;
}

interface SummaryItem {
  text: string;
  medicationGuide: MedicationGuide | null;
}

interface HighlightItem {
  type: 'critical' | 'warning' | 'info';
  text: string;
}

interface AnalysisItem {
  type: 'danger' | 'warning' | 'stable';
  title: string;
  detail: string;
  action?: string;
}

interface AutoTask {
  id: number;
  time: string;
  task: string;
  reason: string;
  status: 'pending' | 'completed';
  supplies: string[];
  guide: boolean;
}

interface ClinicalEvidenceItem {
  title: string;
  section: string;
  quote: string;
  reason: string;
}

interface ClinicalEvidence {
  decisionType: string;
  sourceLabel: string;
  confidence: string;
  documents: ClinicalEvidenceItem[];
}

const getClinicalEvidence = (patientId: number): ClinicalEvidence => {
  if (patientId === 2) {
    return {
      decisionType: 'RAG 기반 문서 참조',
      sourceLabel: '패혈증 · 저혈당 · 젖산산증 위험 기준',
      confidence: '92%',
      documents: [
        {
          title: 'Sepsis 초기 대응 Bundle',
          section: '혈액배양 및 항생제 투여 기준',
          quote:
            '패혈증 의심 시 혈액배양 2세트 채취 후 경험적 광범위 항생제 투여를 우선 고려한다.',
          reason:
            'Blood culture 2세트 완료 후 Piperacillin/Tazobactam으로 항생제 스텝업이 이루어졌기 때문에 해당 기준을 참조했습니다.'
        },
        {
          title: '당뇨 환자 저혈당 대응 프로토콜',
          section: 'BST 70mg/dL 미만 대응',
          quote:
            'BST 70mg/dL 미만은 저혈당으로 판단하며, 인슐린 투여 전 혈당 재확인 및 보류 여부 확인이 필요하다.',
          reason:
            '환자에게 BST 62mg/dL 저혈당 이력이 있어 인슐린 투여 보류 및 수시 BST 확인 항목을 강조했습니다.'
        },
        {
          title: 'Metformin 안전 투약 기준',
          section: '저관류 및 Lactate 상승 시 주의',
          quote:
            'Metformin 투여 중 저혈압, 조직 저관류, Lactate 상승이 동반되면 젖산산증 가능성을 추적해야 한다.',
          reason:
            'Lactate 2.8 상승과 Metformin continue 오더가 함께 있어 젖산산증 감시 필요성을 표시했습니다.'
        },
        {
          title: '산소요법 모니터링 기준',
          section: 'SpO2 저하 및 산소 증량 후 평가',
          quote:
            '산소 투여 후에도 SpO2가 92% 전후에 머무르면 지속적인 호흡 상태 관찰이 필요하다.',
          reason:
            'O2 5L 적용 후 SpO2 92%로 부분 안정화된 상태라 지속 관찰 항목으로 분류했습니다.'
        }
      ]
    };
  }

  if (patientId === 1) {
    return {
      decisionType: 'RAG 기반 문서 참조',
      sourceLabel: '급성 심근경색 간호 기준',
      confidence: '87%',
      documents: [
        {
          title: '급성 관상동맥증후군 간호 지침',
          section: '흉통 및 니트로글리세린 투여 후 관찰',
          quote:
            '흉통 발생 시 니트로글리세린 투여 후 혈압, 심박수, 흉통 재발 여부를 지속 관찰한다.',
          reason:
            '니트로글리세린 PRN 오더와 혈압 상승 추세가 있어 해당 기준을 참조했습니다.'
        },
        {
          title: '항응고제 투약 안전 지침',
          section: 'Heparin 투여 후 출혈 징후 확인',
          quote:
            '헤파린 투여 환자는 출혈 징후, 혈뇨, 흑색변, aPTT 추적 여부를 확인한다.',
          reason:
            'Heparin 5000 units IV q4h 오더가 있어 출혈 감시 필요성을 표시했습니다.'
        }
      ]
    };
  }

  return {
    decisionType: 'RAG 기반 문서 참조',
    sourceLabel: '일반 간호 업무 우선순위 기준',
    confidence: '84%',
    documents: [
      {
        title: '간호 업무 우선순위 분류 기준',
        section: '위험 · 주의 · 안정 환자 분류',
        quote:
          '활력징후 이상, 투약 지연 가능성, 진단명을 함께 고려하여 간호 우선순위를 산정한다.',
        reason:
          '환자의 상태값, 활력징후, pendingTasks를 기반으로 업무 우선순위를 계산했습니다.'
      },
      {
        title: '활력징후 이상징후 대응 기준',
        section: '혈압 · 심박수 · 체온 기준',
        quote:
          '혈압, 심박수, 체온이 정상 범위를 벗어나면 재측정 및 보고 필요성을 판단한다.',
        reason:
          '환자별 바이탈 수치를 기준으로 이상징후 가능성을 표시했습니다.'
      }
    ]
  };
};

const getDynamicAIContent = (patientId: number) => {
  switch (patientId) {
    case 2:
      return {
        summary: [
          {
            text: '항생제 Piperacillin/Tazobactam 4.5g IV q8h 로 스텝업 변경',
            medicationGuide: {
              name: '광범위 항생제(타조신) 가이드',
              usage: '패혈증 의심 시 8시간 간격 정맥 투여',
              precautions: ['페니실린계 아나필락시스 쇼크 주의', '정맥염 발생 부위 관찰'],
              contraindications: ['페니실린 쇼크 과거력'],
              youtubeGuide: 'https://youtube.com/watch?v=antibiotics'
            }
          },
          {
            text: '패혈증 처치 묶음: Blood culture 2세트 완료 후 항생제 투여됨',
            medicationGuide: null
          },
          {
            text: 'Metformin continue 오더에 따른 젖산산증 발생 징후 관찰',
            medicationGuide: null
          }
        ] as SummaryItem[],
        highlights: [
          {
            type: 'critical',
            text: '저혈당(62) 과거력: 인슐린 투여 보류 중, 수시 BST 확인 요망'
          },
          {
            type: 'warning',
            text: '패혈증성 저혈압: SBP 90 미만 강하 시 신속 노티'
          },
          {
            type: 'info',
            text: 'O2 5L 적용 하에 SpO2 92%로 부분 안정화'
          }
        ] as HighlightItem[],
        analysis: [
          {
            type: 'danger',
            title: '패혈성 쇼크 전조 징후',
            detail:
              '의식 저하 및 핍뇨 동반 가능성이 있어 중심정맥압 또는 시간당 소변량 모니터링이 필요합니다.',
            action: 'SBP 90 미만 재하강 시 즉시 보고'
          },
          {
            type: 'danger',
            title: '메트포르민 연관 젖산산증 위험',
            detail:
              'Lactate 2.8 상승 상태에서 Metformin continue 오더가 유지되어 젖산산증 추적 검사가 필요합니다.',
            action: 'Follow-up Lactate 및 ABGA 확인'
          }
        ] as AnalysisItem[],
        tasks: [
          {
            id: 21,
            time: '15:00',
            task: 'BST(간이혈당) 추적 측정',
            reason: '10:00 저혈당 쇼크 및 13:00 혈당 276 반등에 따른 혈당 변동성 감시',
            status: 'pending',
            supplies: ['혈당계', '채혈침', '알코올 솜'],
            guide: true
          },
          {
            id: 22,
            time: '15:00',
            task: '시간당 소변량(U/O) 체크',
            reason: '11:40 소변량 감소 기록, 패혈증성 신손상(AKI) 가능성 평가',
            status: 'pending',
            supplies: ['소변계량컵', '기록지'],
            guide: false
          },
          {
            id: 23,
            time: '16:00',
            task: 'Follow-up Lactate Lab',
            reason: '젖산산증 진행 여부 확인을 위한 추적 혈액 검사',
            status: 'pending',
            supplies: ['채혈관', '토니켓', '알코올 솜'],
            guide: true
          }
        ] as AutoTask[]
      };

    case 1:
      return {
        summary: [
          {
            text: '니트로글리세린 0.4mg 필요시 설하 투여 (흉통 발생 시)',
            medicationGuide: {
              name: '니트로글리세린 투약 가이드',
              usage: '흉통 발생 시 설하 투여, 투여 전후 혈압 확인',
              precautions: ['투여 전후 혈압 모니터링 필수', '어지러움 및 두통 관찰'],
              contraindications: ['수축기 혈압 90mmHg 미만', '최근 PDE-5 억제제 복용']
            }
          },
          {
            text: '헤파린 5000 단위 정맥 주사, 4시간마다',
            medicationGuide: {
              name: '헤파린 투약 가이드',
              usage: '혈전 예방을 위해 5000 units을 4시간마다 정맥 주사',
              precautions: ['aPTT 정기 모니터링', '출혈 징후 관찰'],
              contraindications: ['활동성 출혈', '중증 혈소판 감소증']
            }
          },
          {
            text: '활력징후 2시간마다 측정 필수',
            medicationGuide: null
          }
        ] as SummaryItem[],
        highlights: [
          {
            type: 'critical',
            text: '아스피린 투여 금지 - 알레르기 있음'
          },
          {
            type: 'warning',
            text: '혈압 >160/100 또는 HR >110 시 즉시 보고'
          },
          {
            type: 'info',
            text: '심전도 지속 모니터링 중'
          }
        ] as HighlightItem[],
        analysis: [
          {
            type: 'warning',
            title: '혈압 상승 추세',
            detail: '현재 혈압 160/95로 경계값에 근접하여 흉통 재발 여부와 함께 관찰이 필요합니다.',
            action: '혈압 및 흉통 재사정'
          },
          {
            type: 'warning',
            title: '항응고제 투여 후 출혈 감시',
            detail: '헤파린 투여 예정으로 출혈 징후와 응고검사 추적이 필요합니다.',
            action: '혈뇨, 흑색변, 잇몸 출혈 확인'
          }
        ] as AnalysisItem[],
        tasks: [
          {
            id: 1,
            time: '14:00',
            task: '활력징후 측정',
            reason: '오더: Monitor vital signs q2h → 2시간마다 측정',
            status: 'pending',
            supplies: ['혈압계', '체온계', '청진기'],
            guide: true
          },
          {
            id: 2,
            time: '14:00',
            task: '헤파린 5000 units IV 투여',
            reason: '오더: Heparin 5000 units IV q4h → 4시간마다 투여',
            status: 'pending',
            supplies: ['헤파린 바이알', '주사기', 'IV 라인', '알코올 솜'],
            guide: true
          },
          {
            id: 3,
            time: '14:30',
            task: '섭취량/배출량 기록',
            reason: '오더: Strict I&O → 엄격한 수분 관리 필요',
            status: 'pending',
            supplies: ['기록지', '측정 컵'],
            guide: false
          }
        ] as AutoTask[]
      };

    default:
      return {
        summary: [
          {
            text: '현재 진단명과 의사 오더를 기반으로 간호 업무를 자동 요약했습니다.',
            medicationGuide: null
          },
          {
            text: '활력징후와 대기 업무를 기준으로 우선순위를 분류했습니다.',
            medicationGuide: null
          }
        ] as SummaryItem[],
        highlights: [
          {
            type: 'info',
            text: '환자 상태에 따라 간호 업무 우선순위를 자동 계산했습니다.'
          }
        ] as HighlightItem[],
        analysis: [
          {
            type: 'stable',
            title: '현재 상태 기반 모니터링',
            detail: '환자 상태와 활력징후를 기반으로 지속 관찰이 필요합니다.',
            action: '정기 재평가'
          }
        ] as AnalysisItem[],
        tasks: [
          {
            id: 100,
            time: '14:00',
            task: '환자 상태 재확인',
            reason: '환자별 대기 업무와 활력징후 기반 자동 생성 업무',
            status: 'pending',
            supplies: ['기록지', 'EMR'],
            guide: false
          }
        ] as AutoTask[]
      };
  }
};

export function PatientDetailPage({
  patientId,
  onBack,
  onVitalsClick,
  onEducationClick,
  onHistoryClick
}: PatientDetailPageProps) {
  const [newOrder, setNewOrder] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [hoveredSummaryItem, setHoveredSummaryItem] = useState<number | null>(null);
  const [showClinicalEvidence, setShowClinicalEvidence] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<{ [key: number]: 'pending' | 'completed' }>({});

  const targetPatient = PATIENTS_DATABASE.find((p) => p.id === patientId) || PATIENTS_DATABASE[0];
  const [orders, setOrders] = useState(targetPatient.doctorOrders);

  const dynamicAI = getDynamicAIContent(targetPatient.id);
  const clinicalEvidence = getClinicalEvidence(targetPatient.id);

  const aiAnalysis = {
    summary: dynamicAI.summary,
    highlights: dynamicAI.highlights,
    analysis: dynamicAI.analysis
  };

  const autoTasks = dynamicAI.tasks;

  useEffect(() => {
    setOrders(targetPatient.doctorOrders);
    setShowClinicalEvidence(false);
    setHoveredSummaryItem(null);
  }, [patientId, targetPatient]);

  const toggleTaskStatus = (taskId: number) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [taskId]: prev[taskId] === 'completed' ? 'pending' : 'completed'
    }));
  };

  const getTaskStatus = (taskId: number) => {
    return taskStatuses[taskId] || 'pending';
  };

  const handleAddOrder = () => {
    if (newOrder.trim()) {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newOrderObj = {
        id: orders.length + 1,
        doctor: '간호사 추가 오더',
        time: formattedTime,
        order: newOrder.trim()
      };

      targetPatient.doctorOrders = [...orders, newOrderObj];
      setOrders([...orders, newOrderObj]);
      setNewOrder('');
    }
  };

  const getStatusLabel = () => {
    if (targetPatient.status === 'critical') return '위험';
    if (targetPatient.status === 'monitoring') return '주의';
    return '정상';
  };

  const getStatusStyle = () => {
    if (targetPatient.status === 'critical') {
      return {
        backgroundColor: '#FEE2E2',
        color: '#DC2626'
      };
    }

    if (targetPatient.status === 'monitoring') {
      return {
        backgroundColor: '#FEF3C7',
        color: '#D97706'
      };
    }

    return {
      backgroundColor: '#D1FAE5',
      color: '#10B981'
    };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
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
                <User
                  className="w-8 h-8 group-hover:text-[#0052CC] transition-colors"
                  style={{ color: '#94A3B8' }}
                />
              </button>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>
                    {targetPatient.name}
                  </h1>
                  <span className="px-3 py-1 text-sm font-bold" style={{ borderRadius: '8px', ...getStatusStyle() }}>
                    {getStatusLabel()}
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
          <div className="col-span-2 space-y-6">
            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: '#0052CC' }} />
                    <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>
                      의사 처방 오더 내역
                    </h2>
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

              {showAIPanel && (
                <div
                  className="mx-6 mt-6 p-4 border bg-blue-50"
                  style={{ borderRadius: '12px', borderColor: '#BFDBFE' }}
                >
                  <div className="font-bold text-sm text-blue-900 mb-2">AI 용어 설명</div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    RAG는 관련 문서를 검색하여 근거로 활용하는 방식이며, 검색된 문서 기준을 바탕으로 위험도와 업무
                    우선순위를 표시합니다.
                  </p>
                </div>
              )}

              <div className="p-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400">등록된 지시사항 오더가 없습니다.</div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border shadow-sm"
                      style={{ borderRadius: '12px', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm" style={{ color: '#1E293B' }}>
                          {order.doctor}
                        </span>
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

            <div className="p-6 border" style={{ borderRadius: '12px', backgroundColor: '#F0F7FF', borderColor: '#DBEAFE' }}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5" style={{ color: '#0052CC' }} />
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>
                  AI 자동화 오더 분석 요약
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                {aiAnalysis.summary.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 relative">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                    <span className="flex-1 text-sm text-gray-700 font-medium">{item.text}</span>

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

                        {hoveredSummaryItem === index && (
                          <div className="absolute right-0 top-5 pt-3 w-96 z-50">
                            <div
                              className="bg-white border-2 p-5"
                              style={{
                                borderRadius: '12px',
                                borderColor: '#E2E8F0',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <div className="mb-4">
                                <h3 className="text-xl font-bold mb-1" style={{ color: '#0052CC' }}>
                                  {item.medicationGuide.name}
                                </h3>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                                    <div className="text-sm font-medium" style={{ color: '#1E293B' }}>
                                      사용법
                                    </div>
                                  </div>
                                  <p className="text-sm ml-7" style={{ color: '#64748B' }}>
                                    {item.medicationGuide.usage}
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5" style={{ color: '#F59E0B' }} />
                                    <div className="text-sm font-medium" style={{ color: '#1E293B' }}>
                                      주의사항
                                    </div>
                                  </div>
                                  <ul className="text-sm ml-7 space-y-1" style={{ color: '#64748B' }}>
                                    {item.medicationGuide.precautions.map((precaution, idx) => (
                                      <li key={idx}>• {precaution}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
                                    <div className="text-sm font-medium" style={{ color: '#1E293B' }}>
                                      금기사항
                                    </div>
                                  </div>
                                  <ul className="text-sm ml-7 space-y-1" style={{ color: '#64748B' }}>
                                    {item.medicationGuide.contraindications.map((contraindication, idx) => (
                                      <li key={idx}>• {contraindication}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {aiAnalysis.highlights.map((highlight, index) => {
                  const isCritical = highlight.type === 'critical';
                  const isWarning = highlight.type === 'warning';

                  return (
                    <div
                      key={index}
                      className="p-4 border"
                      style={{
                        borderRadius: '8px',
                        backgroundColor: isCritical ? '#FEE2E2' : isWarning ? '#FEF3C7' : '#DBEAFE',
                        borderColor: isCritical ? '#FCA5A5' : isWarning ? '#FDE68A' : '#93C5FD'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: isCritical ? '#DC2626' : isWarning ? '#F59E0B' : '#0052CC' }}
                        />
                        <span
                          className="text-sm font-bold"
                          style={{
                            color: isCritical ? '#991B1B' : isWarning ? '#92400E' : '#1E40AF'
                          }}
                        >
                          {highlight.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t pt-4" style={{ borderColor: '#BFDBFE' }}>
                <button
                  type="button"
                  onClick={() => setShowClinicalEvidence((prev) => !prev)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border hover:bg-blue-50 transition-colors"
                  style={{ borderRadius: '12px', borderColor: '#BFDBFE', color: '#0052CC' }}
                >
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-sm font-bold">임상 근거 및 출처 보기</div>
                      <div className="text-xs text-slate-500">RAG 참조 문서와 핵심 구절을 확인합니다</div>
                    </div>
                  </div>

                  <ChevronDown
                    className="w-5 h-5 transition-transform"
                    style={{
                      transform: showClinicalEvidence ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>

                {showClinicalEvidence && (
                  <div
                    className="mt-3 bg-white border overflow-hidden"
                    style={{ borderRadius: '12px', borderColor: '#BFDBFE' }}
                  >
                    <div className="p-4 border-b bg-blue-50" style={{ borderColor: '#DBEAFE' }}>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-xs font-bold text-slate-400 mb-1">판단 방식</div>
                          <div className="text-sm font-bold text-slate-800">{clinicalEvidence.decisionType}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 mb-1">관련 기준</div>
                          <div className="text-sm font-bold text-slate-800">{clinicalEvidence.sourceLabel}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 mb-1">근거 신뢰도</div>
                          <div className="text-sm font-bold text-blue-700">{clinicalEvidence.confidence}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {clinicalEvidence.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="p-4 border bg-slate-50"
                          style={{ borderRadius: '10px', borderColor: '#E2E8F0' }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="text-sm font-bold text-slate-800">{doc.title}</div>
                              <div className="text-xs text-blue-600 font-semibold mt-0.5">{doc.section}</div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                              RAG 참조
                            </span>
                          </div>

                          <div
                            className="p-3 bg-white border text-sm leading-relaxed mb-2"
                            style={{ borderRadius: '8px', borderColor: '#E2E8F0', color: '#334155' }}
                          >
                            “{doc.quote}”
                          </div>

                          <div className="text-xs leading-relaxed text-slate-500">
                            <span className="font-bold text-slate-700">적용 이유: </span>
                            {doc.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>
                  자동 생성 간호 업무
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {autoTasks.map((task) => (
                  <div key={task.id} className="border p-4" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4" style={{ color: '#94A3B8' }} />
                          <span className="font-bold text-sm" style={{ color: '#1E293B' }}>
                            {task.time}
                          </span>
                        </div>
                        <div className="text-base font-bold mb-2" style={{ color: '#1E293B' }}>
                          {task.task}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="px-3 py-1 border-2 transition-all text-xs font-bold"
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

                    <div
                      className="border p-3 mb-3"
                      style={{ borderRadius: '8px', backgroundColor: '#DBEAFE', borderColor: '#93C5FD' }}
                    >
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0052CC' }} />
                        <div>
                          <div className="text-xs font-bold mb-1" style={{ color: '#1E3A8A' }}>
                            생성 이유
                          </div>
                          <div className="text-xs font-semibold leading-relaxed" style={{ color: '#1E40AF' }}>
                            {task.reason}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#64748B' }} />
                        <div className="flex-1">
                          <div className="text-xs font-bold mb-2" style={{ color: '#1E293B' }}>
                            필요 물품
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {task.supplies.map((supply, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white border text-xs font-semibold"
                                style={{ borderRadius: '6px', borderColor: '#E2E8F0', color: '#64748B' }}
                              >
                                {supply}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {task.guide && (
                      <button
                        className="mt-3 w-full px-3 py-2 text-sm font-semibold border hover:bg-gray-50 transition-colors"
                        style={{ borderRadius: '8px', borderColor: '#E2E8F0', color: '#0052CC' }}
                      >
                        상세 가이드 보기
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border p-6 shadow-sm" style={{ borderRadius: '16px', borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl" style={{ backgroundColor: '#EFF6FF' }}>
                  <Activity className="w-5 h-5" style={{ color: '#0052CC' }} />
                </div>
                <h2 className="text-base font-bold text-gray-800">환자 실시간 모니터링 스펙</h2>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div
                  className="flex justify-between items-center p-3 rounded-xl border"
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}
                >
                  <span className="font-semibold text-gray-500">혈압 BP</span>
                  <span className="font-bold text-gray-800 font-mono text-lg">{targetPatient.vitals.bp}</span>
                </div>

                <div
                  className="flex justify-between items-center p-3 rounded-xl border"
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}
                >
                  <span className="font-semibold text-gray-500">심박수 HR</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-gray-800 font-mono text-lg">{targetPatient.vitals.hr}</span>
                    <span className="font-semibold text-gray-400 text-xs">bpm</span>
                  </div>
                </div>

                <div
                  className="flex justify-between items-center p-3 rounded-xl border"
                  style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}
                >
                  <span className="font-semibold text-gray-500">체온 BT</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-gray-800 font-mono text-lg">{targetPatient.vitals.temp}</span>
                    <span className="font-semibold text-gray-400 text-xs">°C</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border sticky top-28" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" style={{ color: '#0052CC' }} />
                  <h2 className="text-lg font-medium" style={{ color: '#1E293B' }}>
                    AI 실시간 이상 징후 분석
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {aiAnalysis.analysis.map((analysisItem, idx) => {
                  const isDanger = analysisItem.type === 'danger';
                  const isWarning = analysisItem.type === 'warning';

                  return (
                    <div
                      key={idx}
                      className="p-4 border"
                      style={{
                        borderRadius: '12px',
                        backgroundColor: isDanger ? '#FEE2E2' : isWarning ? '#FEF3C7' : '#D1FAE5',
                        borderColor: isDanger ? '#FCA5A5' : isWarning ? '#FDE68A' : '#A7F3D0'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {isDanger ? (
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                        ) : (
                          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                        )}

                        <div className="flex-1">
                          <div
                            className="font-medium mb-1 text-sm"
                            style={{
                              color: isDanger ? '#7F1D1D' : isWarning ? '#78350F' : '#064E3B'
                            }}
                          >
                            {analysisItem.title}
                          </div>
                          <p
                            className="text-sm"
                            style={{
                              color: isDanger ? '#991B1B' : isWarning ? '#92400E' : '#065F46'
                            }}
                          >
                            {analysisItem.detail}
                          </p>

                          {analysisItem.action && (
                            <div
                              className="mt-2 text-xs font-semibold"
                              style={{
                                color: isDanger ? '#7F1D1D' : isWarning ? '#78350F' : '#065F46'
                              }}
                            >
                              권고: {analysisItem.action}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}