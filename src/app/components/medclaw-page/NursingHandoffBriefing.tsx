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
  // 현재 시간을 14:00로 가정
  const currentTime = '14:00';

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
      time: '08:00',
      content: '활력징후 측정 - BP 165/95, HR 98, RR 18, SpO2 98%',
      category: '간호 기록'
    },
    {
      id: 2,
      time: '09:00',
      content: '아테놀올 50mg PO 투여',
      category: '간호 기록'
    },
    {
      id: 3,
      time: '09:30',
      content: '아침 식사 섭취 70%, 수분 섭취 200mL',
      category: '간호 기록'
    },
    {
      id: 4,
      time: '10:00',
      content: '활력징후 측정 - BP 160/92, HR 85, RR 36.7°C',
      category: '간호 기록'
    },
    {
      id: 5,
      time: '11:30',
      content: '신체 활동 - 병동 복도 10분 걷기',
      category: '간호 기록'
    },
    {
      id: 6,
      time: '12:00',
      content: '점심 식사 섭취 80%, 수분 섭취 250mL',
      category: '간호 기록'
    },
    {
      id: 7,
      time: '13:00',
      content: '활력징후 측정 - BP 158/90, HR 82, RR 36.8°C',
      category: '간호 기록'
    },
    {
      id: 8,
      time: '14:00',
      content: '배변시 기록 안함',
      category: '미완료 업무',
      priority: 'high',
      assignee: '기록 누락'
    },
    {
      id: 9,
      time: '15:00',
      content: '활력징후 측정',
      category: '미완료 업무',
      priority: 'high',
      assignee: '측정 필요'
    },
    {
      id: 10,
      time: '17:00',
      content: '저녁 투약 (아테놀올 50mg)',
      category: '미완료 업무',
      priority: 'normal',
      assignee: '밤번 A간 전근호'
    },
    {
      id: 11,
      time: '18:00',
      content: '거동 시 낙상 안전 확인',
      category: '미완료 업무',
      priority: 'normal',
      assignee: '야간근'
    }
  ];

  const getItemBorderColor = (item: TimelineItem) => {
    const itemHour = parseInt(item.time.split(':')[0]);
    const currentHour = parseInt(currentTime.split(':')[0]);
    const isCompleted = taskCompletionStatus[item.id];

    if (item.category === '간호 기록') {
      return 'border-blue-300';
    }

    // 미완료 업무인 경우
    if (itemHour < currentHour) {
      // 시간 지남
      if (isCompleted) {
        return 'border-orange-400'; // 시간 지났는데 완료 (늦게 완료)
      } else {
        return 'border-red-400'; // 시간 지났는데 미완료
      }
    } else {
      // 시간 안 지남
      if (isCompleted) {
        return 'border-blue-400'; // 시간 안 지났는데 완료
      } else {
        return 'border-yellow-400'; // 시간 안 지났는데 미완료
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

    // 미완료 업무인 경우
    if (itemHour < currentHour) {
      // 시간 지남
      if (isCompleted) {
        return 'bg-orange-50'; // 시간 지났는데 완료 (늦게 완료)
      } else {
        return 'bg-red-50'; // 시간 지났는데 미완료
      }
    } else {
      // 시간 안 지남
      if (isCompleted) {
        return 'bg-blue-50'; // 시간 안 지났는데 완료
      } else {
        return 'bg-yellow-50'; // 시간 안 지났는데 미완료
      }
    }
  };

  const aiAnalysis = [
    {
      id: 1,
      type: 'caution',
      title: '기록 누락',
      content: '15:00 활력징후 측정 기록 누락되어 작성 바랍니다.',
      details: '30분째 기록지 3시대 활력징후를 측정하지 않았으나, 13:00 시점 기록이 안되었습니다.'
    },
    {
      id: 2,
      type: 'warning',
      title: '수분 섭취량 불일치',
      content: '08:30 (300mL) + 13:00 (180mL) + 450mL여서, 섭취량 부족 섭취량(930mL)로 보면, 섭취는 하루 섭취 1500mL로 부족합니다.'
    },
    {
      id: 3,
      type: 'info',
      title: '혈압 양호 추세 모니터링',
      content: '08:00 (165/95) → 10:00 (160/92) → 13:00 (158/90)로 감소 중입니다.'
    },
    {
      id: 4,
      type: 'info',
      title: '환자의 약물 모니터링 상태',
      content: '아침 교대 주치의로, 주치의 도착약은 후에 복약 활동 영향'
    }
  ];

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
            <span>박지민 (67세, 남) • 병실 301 • 급성 심근경색</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Timeline */}
          <div className="col-span-2 space-y-6">
            {/* Timeline */}
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

          {/* Right Column - AI Analysis */}
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
