import { ArrowLeft, BookOpen, Pill, Heart } from 'lucide-react';
import { PATIENTS_DATABASE } from '../PatientList'; // 마스터 DB 연동

interface PatientEducationPageProps {
  patientId: number;
  onBack: () => void;
}

export function PatientEducationPage({ patientId, onBack }: PatientEducationPageProps) {
  // 선택된 patientId 기반 동적 환자 추출
  const currentPatient = PATIENTS_DATABASE.find(p => p.id === patientId) || PATIENTS_DATABASE[0];

  // 💡 [데이터 고도화] 78세 김말순 환자의 '지역사회획득폐렴(CAP)' 및 '제2형 당뇨/고혈압'에 맞춤화된 3오 3열 스펙
  const getEducationDataByDiagnosis = (diagnosis: string) => {
    switch (diagnosis) {
      case '지역사회획득폐렴(CAP)':
        return {
          dietary: [
            { 
              title: '수분 섭취 대폭 증량 (가래 배출)', 
              description: '기도 점막의 건조함을 막고 폐 내 끈적한 염증성 가래를 묽게 만들어 쉽게 뱉어낼 수 있도록 미온수를 수시로 음용해야 합니다.', 
              tips: ['따뜻한 물을 텀블러로 상시 소지', '하루 최소 1.5L~2L 수분 확보', '식간마다 조금씩 자주 마시기'] 
            },
            { 
              title: '고단백·고칼로리 영양죽 식단', 
              description: '감염과 싸우느라 신체 에너지 소모가 극심하고 호흡 곤란으로 식사가 불편할 수 있으므로, 소화 부담이 적고 열량이 높은 영양식 위주로 섭취합니다.', 
              tips: ['소고기죽, 전복죽 등 부드러운 형태', '입맛이 없을 땐 영양보충음료 대체', '한 번에 과식하지 않고 소량씩 자주 섭취'] 
            },
            { 
              title: '적정 혈당 유지를 위한 당질 제한', 
              description: '당뇨 기저질환이 있어 염증 반응으로 혈당이 급격히 오를 수 있으므로 믹스커피, 주스, 흰쌀밥 등 단순 당질 섭취를 엄격히 제한합니다.', 
              tips: ['정제당 및 탄산음료 완전 차단', '간식은 규칙적인 저혈당 예방용으로 제한', '잡곡이나 채소 위주의 부드러운 유동식 선호'] 
            }
          ],
          medication: [
            { 
              title: '신규 광범위 항생제(타조신) 지침', 
              description: 'Ceftriaxone에서 스텝업된 Piperacillin/Tazobactam 정맥 주사가 정시에 투여 중입니다. 임의로 라인을 잠그거나 움직이지 않도록 주의합니다.', 
              tips: ['8시간 간격 정시 투약 스케줄 준수', '주사 부위 발적, 통증, 붓기 발생 시 즉시 보고', '메디컬 알레르기 쇼크 상시 감시'] 
            },
            { 
              title: '메트포르민 유지와 젖산산증 감시', 
              description: '당뇨약인 Metformin continue 오더가 유지 중이나, 패혈증 쇼크 등으로 조직 저관류가 오면 치명적인 젖산산증이 올 수 있으므로 주의 깊게 약물 부작용을 사정합니다.', 
              tips: ['근육통, 호흡곤란, 구토 등 전조증상 확인', 'Lactate 수치 f/u 랩 검사 철저 준수', '주치의 가이드라인에 따른 정량 복용 확인'] 
            },
            { 
              title: '인슐린 보류 및 저혈당 응급 대처', 
              description: '오전 중 저혈당(62mg/dL) 쇼크 발생으로 Regular Insulin sliding scale 투여가 일시 중단되었습니다. 저혈당 재발 징후를 상시 모니터링합니다.', 
              tips: ['식은땀, 떨림, 어지러움 발생 시 즉시 보고', '의식이 있을 때만 설탕물이나 주스 공급', '임의로 인슐린을 재투여하는 행위 절대 금지'] 
            }
          ],
          lifestyle: [
            { 
              title: '효과적인 기침 및 객담 배출법', 
              description: '폐포 허탈 및 무기폐를 방지하기 위해 가슴이나 배에 무리를 주지 않으면서 기관지 깊숙한 곳의 염증 가래를 상체를 세워 뱉어내는 훈련을 합니다.', 
              tips: ['상체를 약간 앞으로 세운 포지션 고수', '심호흡을 크게 한 뒤 짧고 강하게 기침', '필요 시 강화폐활량계(Incentive Spirometer) 활용'] 
            },
            { 
              title: '침상 난간 고정 및 낙상 극고위험 방지', 
              description: '78세 고령에 오전 중 저혈당 및 저혈압(88/54)으로 인한 의식 처짐 양상이 관찰되었습니다. 거동 시 낙상 위험이 극도로 높으므로 침상 난간을 항시 고정합니다.', 
              tips: ['침상 사이드레일 상시 거상 및 고정', '혼자서 절대 움직이지 않기 (보호자/간호사 동반)', '취침 전 화장실 미리 다녀오기 및 동선 정리'] 
            },
            { 
              title: '실내 적정 습도 및 격리 위생 유지', 
              description: '호흡기 점막 자극을 최소화하기 위해 병실 습도를 40~60%로 유지하고, 면역력이 극도로 저하된 상태이므로 철저한 손 위생과 마스크 착용을 실시합니다.', 
              tips: ['실내 습도 40% ~ 60% 상시 가습 유지', '의료진 및 보호자 진입 전후 손 소독 필수', '오한 발생 시 보온 유지 및 환기 주기 통제'] 
            }
          ]
        };

      case '급성 심근경색':
        return {
          dietary: [
            { title: '저염식 식단', description: '하루 소금 섭취량을 5g 이하로 제한하세요. 가공식품과 짠 음식을 피하고, 신선한 채소와 과일을 충분히 섭취하세요.', tips: ['소금 대신 허브와 향신료 사용', '가공식품 피하기', '식품 라벨 확인하기'] },
            { title: '건강한 지방 섭취', description: '포화지방과 트랜스지방을 피하고, 불포화지방산이 풍부한 식품을 선택하세요.', tips: ['올리브유, 견과류 섭취', '튀긴 음식 피하기', '생선 주 2회 이상 섭취'] },
            { title: '식사량 조절', description: '적절한 칼로리 섭취로 체중을 관리하세요. 소량씩 자주 드시는 것이 좋습니다.', tips: ['하루 5-6회 소량 식사', '과식 피하기', '천천히 씹어 먹기'] }
          ],
          medication: [
            { title: '아스피린 복용 지침', description: '혈전 예방을 위해 매일 정해진 시간에 복용하세요. 식후 30분 이내 복용을 권장합니다.', tips: ['매일 같은 시간 복용', '식후 복용', '임의로 중단하지 않기'] },
            { title: '스타틴 복용 관리', description: '콜레스테롤 조절을 위해 처방된 용량을 꾸준히 복용하세요.', tips: ['저녁 시간 복용', '자몽 주스 피하기', '정기 검사 받기'] },
            { title: '혈압약 복용 주의사항', description: '혈압 조절을 위해 매일 규칙적으로 복용하고, 정기적으로 혈압을 측정하세요.', tips: ['아침 기상 후 복용', '갑작스럽게 중단하지 않기', '가정혈압 기록하기'] }
          ],
          lifestyle: [
            { title: '규칙적인 운동', description: '의사와 상담 후 심장에 무리가 가지 않는 가벼운 유산소 운동을 시작하세요.', tips: ['하루 30분 걷기', '계단 대신 엘리베이터 사용', '과도한 운동 피하기'] },
            { title: '스트레스 관리', description: '스트레스는 심장 건강에 악영향을 줄 수 있습니다. 이완 기법을 배우고 실천하세요.', tips: ['명상이나 요가 시도', '충분한 수면', '긍정적 사고 유지'] },
            { title: '금연 및 절주', description: '흡연은 즉시 중단하고, 음주는 제한하거나 피하세요.', tips: ['금연 프로그램 참여', '음주 완전 제한', '유혹 피하기'] }
          ]
        };

      default:
        return {
          dietary: [
            { title: '균형 잡힌 균등 식단', description: '신체 전반의 대사 기능 향상을 위해 5대 영양소가 조화롭게 배치된 규칙적인 식사를 제공합니다.', tips: ['하루 3끼 정시 정량 식사 시행', '가공식품 및 과도한 염분 차단'] },
            { title: '충분한 수분 공급', description: '체내 노폐물 배출과 혈류 순환 개선을 위해 하루 일정한 미온수 섭취를 유지합니다.', tips: ['맹물 위주 상시 복용', '카페인 및 이뇨 작용 음료 제한'] },
            { title: '비타민 및 미네랄 공급', description: '면역력 증진 및 피로 회복을 위해 신선한 제철 과일과 녹황색 채소를 곁들여 드세요.', tips: ['인공 감미료 제한', '자연식 위주 반찬 세팅'] }
          ],
          medication: [
            { title: '정시 정량 복약 준수', description: '약물의 체내 일정 농도 유지를 위해 처방된 정확한 용량과 복용 타임 알람을 맞춰 복용합니다.', tips: ['임의로 복용량을 늘리거나 줄이지 않기', '거르는 약이 없도록 전용 약통 활용'] },
            { title: '약물 상호작용 체크', description: '기존 복용 약물과 새로 처방된 약물 간의 흡수 방해나 부작용 상승 요인을 사전 차단합니다.', tips: ['종합비타민이나 건강기능식품 복용 시 의료진 사전 확인', '한약재 등 임의 혼용 전면 금지'] },
            { title: '부작용 발현 시 대처법', description: '복약 후 가려움증, 두드러기, 극심한 속 쓰림, 소화 불량 증상 발현 시 즉각 의료진과 상의합니다.', tips: ['발진 발생 시 즉시 복용 홀딩 후 내원', '약물 변경 상담 연계'] }
          ],
          lifestyle: [
            { title: '규칙적인 일상 활동', description: '신체 근육 연약화 및 관절 구축을 예방하기 위해 몸에 무리가 없는 범위의 가벼운 움직임을 생활화합니다.', tips: ['아침/저녁 가벼운 스트레칭', '식후 15분 평지 걷기 운동'] },
            { title: '충분한 수면 환경', description: '신체 자가 치유 면역 세포가 가장 활발히 분비되는 야간 시간대의 깊은 수면을 확보합니다.', tips: ['하루 7-8시간 규칙적 수면 리듬', '취침 전 스마트폰 등 전자기기 차단'] },
            { title: '낙상 고위험 상시 방지', description: '거동 시 균형 감각 저하로 인한 넘어짐이나 부상을 막기 위해 주변 환경 위험 요소를 차단합니다. ', tips: ['침상 사이드레일 상시 거상 고정', '야간 거동 시 보조 조명 완전 확보'] }
          ]
        };
    }
  };

  const educationData = getEducationDataByDiagnosis(currentPatient.diagnosis);

  const renderEducationCard = (item: any, icon: React.ReactNode) => (
    <div className="bg-white border p-5 hover:border-gray-300 transition-all relative overflow-hidden" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
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
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>환자 맞춤형 AI 교육 자료</h1>
            <div className="text-sm" style={{ color: '#64748B' }}>
              {currentPatient.name} ({currentPatient.age}세) • 병실 {currentPatient.room}호 • <span className="text-blue-600 font-bold">{currentPatient.diagnosis}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3오 3열 그리드 레이아웃 유지 */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dietary Column (식이요법) */}
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

          {/* Medication Column (약물 관리) */}
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

          {/* Lifestyle Column (생활습관) */}
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