import { useState } from 'react';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Info, FileText } from 'lucide-react';

interface NursingHandoffBriefingProps {
  onBack: () => void;
  onBackToHandoff: () => void;
}

interface TimelineItem {
  id: number;
  time: string;
  content: string;
  category: '간호 기록' | '미완료 업무';
  priority?: 'high' | 'normal';
  assignee?: string;
}

export function NursingHandoffBriefing({ onBack, onBackToHandoff }: NursingHandoffBriefingProps) {
  // 현재 시간을 이브닝번 인수인계 시점인 15:00로 설정
  const currentTime = '15:00';

  const [taskCompletionStatus, setTaskCompletionStatus] = useState<{ [key: number]: boolean }>({});

  const toggleTaskCompletion = (id: number) => {
    setTaskCompletionStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const timelineItems: TimelineItem[] = [
    {
      id: 1,
      time: '07:00',
      content: '[나이트 인수인계] 체온 37.6°C · HR 92 · RR 20 · BP 122/74 · SpO2 94% (O2 2L). 오더: Ceftriaxone 2g IV, 혈당 체크, Insulin sliding scale',
      category: '간호 기록'
    },
    {
      id: 2,
      time: '08:30',
      content: '[오전 활력징후 측정] 체온 38.5°C · HR 112 · RR 26 · SpO2 91% (O2 2L). 추가 오더: 흉부 X-ray 재촬영',
      category: '간호 기록'
    },
    {
      id: 3,
      time: '09:00',
      content: '[혈당 상승 확인] 혈당 248mg/dL. 오더: Regular insulin 4U SC 투여',
      category: '간호 기록'
    },
    {
      id: 4,
      time: '10:00',
      content: '[저혈당 발생] 혈당 62mg/dL (식이 섭취 감소 + 인슐린 투여 영향). 처치: 저혈당 처치 시행, 인슐린 일시 중단',
      category: '간호 기록',
      priority: 'high'
    },
    {
      id: 5,
      time: '11:20',
      content: '[저혈압/저산소혈증 발생] BP 92/58 · HR 118 · RR 28 · SpO2 89% (O2 2L). 처치: 산소 5L로 증량, 패혈증 가능성 평가 시작',
      category: '간호 기록',
      priority: 'high'
    },
    {
      id: 6,
      time: '11:40',
      content: '[의식/소변량 저하] 의식 명료하나 처진 모습, 소변량 감소. 추가 오더: Lactate, Blood culture x 2 set, Sputum culture',
      category: '간호 기록'
    },
    {
      id: 7,
      time: '12:10',
      content: '[처치 변경] BP 88/54. 오더: NS 500mL bolus, Ceftriaxone -> Piperacillin/Tazobactam 변경. Metformin continue 유지',
      category: '간호 기록'
    },
    {
      id: 8,
      time: '13:00',
      content: '[검사 결과 확인] Lactate 2.8mmol/L (정상 0.5~2.0) · 혈당 276mg/dL',
      category: '간호 기록'
    },
    {
      id: 9,
      time: '14:00',
      content: '[부분 안정화] SpO2 92% (O2 5L 유지) · BP 96/60 · HR 108',
      category: '간호 기록'
    },
    {
      id: 10,
      time: '15:00',
      content: '이브닝 교대 인수인계 (저혈당 및 젖산산증 모니터링 요망)',
      category: '미완료 업무',
      priority: 'high',
      assignee: '이브닝 근무자'
    }
  ];

  const getItemBorderColor = (item: TimelineItem) => {
    const itemHour = parseInt(item.time.split(':')[0]);
    const currentHour = parseInt(currentTime.split(':')[0]);
    const isCompleted = taskCompletionStatus[item.id];

    if (item.category === '간호 기록') {
      return 'border-blue-300';
    }

    if (itemHour < currentHour) {
      if (isCompleted) {
        return 'border-orange-400';
      } else {
        return 'border-red-400';
      }
    } else {
      if (isCompleted) {
        return 'border-blue-400';
      } else {
        return 'border-yellow-400';
      }
    }
  };

  const getItemBackgroundColor = (item: TimelineItem) => {
    const itemHour = parseInt(item.time.split(':')[0]);
    const currentHour = parseInt(currentTime.split(':')[0]);
    const isCompleted = taskCompletionStatus[item.id];

    if (item.category === '간호 기록') {
      return 'bg-blue-50';
    }

    if (itemHour < currentHour) {
      if (isCompleted) {
        return 'bg-orange-50';
      } else {
        return 'bg-red-50';
      }
    } else {
      if (isCompleted) {
        return 'bg-blue-50';
      } else {
        return 'bg-yellow-50';
      }
    }
  };

  const aiAnalysis = [
    {
      id: 1,
      type: 'caution',
      title: '젖산산증(Lactic Acidosis) 고위험 경고',
      content: 'Metformin 처방이 유지된 상태에서 패혈증 의심 소견 및 Lactate 수치(2.8)가 상승했습니다.',
      details: '메트포르민 투여 중 조직 저관류(BP 88/54) 발생 시 치명적인 젖산산증이 유발될 수 있습니다. ABGA 및 Lactate 추적 검사가 시급합니다.'
    },
    {
      id: 2,
      type: 'warning',
      title: '극심한 혈당 변동성 (Hypo/Hyperglycemia)',
      content: '09:00(248) -> 10:00(62) -> 13:00(276)으로 혈당 스파이크 및 크래시가 반복되고 있습니다.',
      details: '감염 스트레스와 식사량 감소가 혼재되어 있습니다. 인슐린 재투여 전 주치의와 Target BST 재설정이 필요합니다.'
    },
    {
      id: 3,
      type: 'warning',
      title: '패혈성 쇼크 진행 모니터링',
      content: '11:20부터 시작된 저혈압이 수액 bolus 및 항생제(Piperacillin/Tazobactam) 변경 후 14:00 기준 MAP 72로 부분 안정화 되었습니다.'
    }
  ];

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
            <span>대시보드로 돌아가기</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 text-sm font-medium" style={{ borderRadius: '8px', backgroundColor: '#DBEAFE', color: '#0052CC' }}>
                낮번 (07:00)
              </div>
              <h1 className="text-2xl" style={{ color: '#1E293B' }}>간호 인계 브리핑</h1>
            </div>

            <button
              onClick={onBackToHandoff}
              className="px-4 py-2 flex items-center gap-2 border hover:bg-gray-50 transition-colors"
              style={{ borderRadius: '12px', borderColor: '#E2E8F0', color: '#64748B' }}
            >
              <FileText className="w-5 h-5" />
              <span>인수인계</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm mt-2" style={{ color: '#64748B' }}>
            <span>김말순 (78세, 여) • 병실 305 • 지역사회획득폐렴(CAP) / 제2형 당뇨</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: '#0052CC' }} />
                  <h2 className="text-lg font-medium" style={{ color: '#1E293B' }}>간호 업무 타임라인</h2>
                </div>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>낮번 근무 시간 및 미완료 업무</p>
              </div>

              <div className="p-6 space-y-3">
                {timelineItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 border-2 transition-colors ${getItemBorderColor(item)} ${getItemBackgroundColor(item)}`}
                    style={{ borderRadius: '12px' }}
                  >
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <Clock className="w-4 h-4" style={{ color: '#0052CC' }} />
                      <span className="font-medium" style={{ color: '#0052CC' }}>{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ color: '#1E293B' }}>{item.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-xs font-medium"
                          style={{ color: item.category === '간호 기록' ? '#0052CC' : '#F59E0B' }}
                        >
                          {item.category}
                        </span>
                        {item.assignee && (
                          <>
                            <span className="text-xs" style={{ color: '#CBD5E1' }}>•</span>
                            <span className="text-xs" style={{ color: '#64748B' }}>{item.assignee}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {item.category === '미완료 업무' && (
                      <button
                        onClick={() => toggleTaskCompletion(item.id)}
                        className="px-3 py-1 text-sm font-medium transition-all border-2"
                        style={{
                          borderRadius: '8px',
                          backgroundColor: taskCompletionStatus[item.id] ? '#D1FAE5' : 'white',
                          color: taskCompletionStatus[item.id] ? '#047857' : '#64748B',
                          borderColor: taskCompletionStatus[item.id] ? '#10B981' : '#E2E8F0'
                        }}
                      >
                        {taskCompletionStatus[item.id] ? '완료' : '미완료'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border sticky top-24" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" style={{ color: '#0052CC' }} />
                  <h2 className="text-lg font-medium" style={{ color: '#1E293B' }}>AI 분석 결과</h2>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {aiAnalysis.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="p-4 border"
                    style={{
                      borderRadius: '12px',
                      backgroundColor: analysis.type === 'caution' ? '#FEE2E2' :
                                       analysis.type === 'warning' ? '#FEF3C7' : '#DBEAFE',
                      borderColor: analysis.type === 'caution' ? '#FCA5A5' :
                                   analysis.type === 'warning' ? '#FDE68A' : '#93C5FD'
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {analysis.type === 'caution' ? (
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                      ) : analysis.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                      ) : (
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0052CC' }} />
                      )}
                      <div className="flex-1">
                        <div
                          className="font-medium mb-1 text-sm"
                          style={{
                            color: analysis.type === 'caution' ? '#7F1D1D' :
                                   analysis.type === 'warning' ? '#78350F' : '#1E3A8A'
                          }}
                        >
                          {analysis.title}
                        </div>
                        <p
                          className="text-sm"
                          style={{
                            color: analysis.type === 'caution' ? '#991B1B' :
                                   analysis.type === 'warning' ? '#92400E' : '#1E40AF'
                          }}
                        >
                          {analysis.content}
                        </p>
                        {analysis.details && (
                          <p className="text-xs mt-2 pt-2 border-t" style={{ color: '#64748B', borderColor: '#E2E8F0' }}>
                            {analysis.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
