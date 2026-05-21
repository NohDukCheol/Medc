import { ArrowLeft, BookOpen, Pill, Heart } from 'lucide-react';

interface PatientEducationPageProps {
  patientId: number;
  onBack: () => void;
}

export function PatientEducationPage({ patientId, onBack }: PatientEducationPageProps) {
  // Mock patient data
  const patient = {
    name: '박지민',
    age: 67,
    room: '301',
    diagnosis: '급성 심근경색'
  };

  const educationData = {
    dietary: [
      {
        title: '저염식 식단',
        description: '하루 소금 섭취량을 5g 이하로 제한하세요. 가공식품과 짠 음식을 피하고, 신선한 채소와 과일을 충분히 섭취하세요.',
        tips: ['소금 대신 허브와 향신료 사용', '가공식품 피하기', '식품 라벨 확인하기'],
        aiRecommended: true
      },
      {
        title: '건강한 지방 섭취',
        description: '포화지방과 트랜스지방을 피하고, 불포화지방산이 풍부한 식품을 선택하세요.',
        tips: ['올리브유, 견과류 섭취', '튀긴 음식 피하기', '생선 주 2회 이상 섭취'],
        aiRecommended: true
      },
      {
        title: '식사량 조절',
        description: '적절한 칼로리 섭취로 체중을 관리하세요. 소량씩 자주 드시는 것이 좋습니다.',
        tips: ['하루 5-6회 소량 식사', '과식 피하기', '천천히 씹어 먹기'],
        aiRecommended: false
      }
    ],
    medication: [
      {
        title: '아스피린 복용 지침',
        description: '혈전 예방을 위해 매일 정해진 시간에 복용하세요. 식후 30분 이내 복용을 권장합니다.',
        tips: ['매일 같은 시간 복용', '식후 복용', '임의로 중단하지 않기'],
        aiRecommended: true
      },
      {
        title: '스타틴 복용 관리',
        description: '콜레스테롤 조절을 위해 처방된 용량을 꾸준히 복용하세요.',
        tips: ['저녁 시간 복용', '자몽 주스 피하기', '정기 검사 받기'],
        aiRecommended: true
      },
      {
        title: '혈압약 복용 주의사항',
        description: '혈압 조절을 위해 매일 규칙적으로 복용하고, 정기적으로 혈압을 측정하세요.',
        tips: ['아침 기상 후 복용', '갑작스럽게 중단하지 않기', '가정혈압 기록하기'],
        aiRecommended: true
      }
    ],
    lifestyle: [
      {
        title: '규칙적인 운동',
        description: '의사와 상담 후 심장에 무리가 가지 않는 가벼운 유산소 운동을 시작하세요.',
        tips: ['하루 30분 걷기', '계단 대신 엘리베이터 사용', '과도한 운동 피하기'],
        aiRecommended: true
      },
      {
        title: '스트레스 관리',
        description: '스트레스는 심장 건강에 악영향을 줄 수 있습니다. 이완 기법을 배우고 실천하세요.',
        tips: ['명상이나 요가 시도', '충분한 수면', '긍정적 사고 유지'],
        aiRecommended: true
      },
      {
        title: '금연 및 절주',
        description: '흡연은 즉시 중단하고, 음주는 제한하거나 피하세요.',
        tips: ['금연 프로그램 참여', '음주 완전 제한', '유혹 피하기'],
        aiRecommended: false
      }
    ]
  };

  const renderEducationCard = (item: any, icon: React.ReactNode) => (
    <div className="bg-white border p-5 hover:border-gray-300 transition-all" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
      <div className="flex items-start mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium text-lg" style={{ color: '#1E293B' }}>{item.title}</h3>
        </div>
      </div>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: '#64748B' }}>{item.description}</p>
      <div className="space-y-2">
        <div className="text-xs font-medium mb-2" style={{ color: '#94A3B8' }}>주요 팁:</div>
        {item.tips.map((tip: string, index: number) => (
          <div key={index} className="flex items-start gap-2 text-sm" style={{ color: '#64748B' }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#0052CC' }} />
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );

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

          <div>
            <h1 className="text-2xl mb-2" style={{ color: '#1E293B' }}>환자 교육 자료</h1>
            <div className="text-sm" style={{ color: '#64748B' }}>
              {patient.name} ({patient.age}세) • 병실 {patient.room} • {patient.diagnosis}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Dietary Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2" style={{ borderRadius: '8px', backgroundColor: '#D1FAE5' }}>
                <BookOpen className="w-5 h-5" style={{ color: '#10B981' }} />
              </div>
              <h2 className="text-xl font-medium" style={{ color: '#1E293B' }}>식이요법</h2>
            </div>
            {educationData.dietary.map((item, index) => (
              <div key={index}>
                {renderEducationCard(item, <BookOpen className="w-5 h-5" style={{ color: '#10B981' }} />)}
              </div>
            ))}
          </div>

          {/* Medication Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2" style={{ borderRadius: '8px', backgroundColor: '#DBEAFE' }}>
                <Pill className="w-5 h-5" style={{ color: '#0052CC' }} />
              </div>
              <h2 className="text-xl font-medium" style={{ color: '#1E293B' }}>약물 관리</h2>
            </div>
            {educationData.medication.map((item, index) => (
              <div key={index}>
                {renderEducationCard(item, <Pill className="w-5 h-5" style={{ color: '#0052CC' }} />)}
              </div>
            ))}
          </div>

          {/* Lifestyle Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2" style={{ borderRadius: '8px', backgroundColor: '#FEE2E2' }}>
                <Heart className="w-5 h-5" style={{ color: '#DC2626' }} />
              </div>
              <h2 className="text-xl font-medium" style={{ color: '#1E293B' }}>생활습관</h2>
            </div>
            {educationData.lifestyle.map((item, index) => (
              <div key={index}>
                {renderEducationCard(item, <Heart className="w-5 h-5" style={{ color: '#DC2626' }} />)}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
