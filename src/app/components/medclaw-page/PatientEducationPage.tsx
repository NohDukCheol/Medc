
import { ArrowLeft, BookOpen, Pill, Heart } from 'lucide-react';
import { PATIENTS_DATABASE } from '../PatientList'; // 마스터 DB 연동

interface PatientEducationPageProps {
  patientId: number;
  onBack: () => void;
}

export function PatientEducationPage({ patientId, onBack }: PatientEducationPageProps) {
  // 선택된 patientId 기반 동적 환자 추출
  const currentPatient = PATIENTS_DATABASE.find(p => p.id === patientId) || PATIENTS_DATABASE[0];

  // 💡 [데이터 고도화] 디자인 레이아웃 유지를 위해 모든 진단명별 3오 3열 데이터 스펙 구축 (AI 추천 마크 제외)
  const getEducationDataByDiagnosis = (diagnosis: string) => {
    switch (diagnosis) {
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

      case '패혈증':
        return {
          dietary: [
            { title: '고단백 영양 공급', description: '면역 세포 재생과 신체 손상 복구를 위해 살코기, 달걀 등 고단백 식품 위주로 섭취하세요.', tips: ['매 끼니 단백질 반찬 포함', '두부 및 콩류 적극 활용'] },
            { title: '충분한 칼로리 섭취', description: '감염과 싸우느라 소모된 에너지를 보충하기 위해 규칙적이고 고열량의 식사가 권장됩니다.', tips: ['입맛이 없을 땐 영양보충음료 섭취', '소량씩 자주 자주 먹기'] },
            { title: '철저한 위생 관리', description: '면역력이 저하된 상태이므로 날음식을 피하고 완전히 익힌 음식을 신선하게 조리해 드세요.', tips: ['익히지 않은 생선/고기 금지', '조리 전후 손 씻기 필수'] }
          ],
          medication: [
            { title: '처방 항생제 완복 지침', description: '감염 원인균을 완전히 박멸하기 위해 증상이 호전되어도 처방된 항생제는 끝까지 복용하세요.', tips: ['정해진 시간 복용 주기 준수', '임의로 복용 중단 금지'] },
            { title: '해열진통제 주의사항', description: '오한이나 발열 증상 관리를 위해 처방된 약을 올바르게 복용하되 과다 복용을 피하세요.', tips: ['복용 간격 최소 4-6시간 유지', '간 기능 저하 시 의료진 사전 상담'] },
            { title: '동반 처방약 관리', description: '위장 보호제나 기타 동반된 약물도 항생제 흡수를 방해하지 않는 선에서 지침대로 복용하세요.', tips: ['식전/식후 복용 타이밍 준수', '임의 처방 외 약물 혼용 금지'] }
          ],
          lifestyle: [
            { title: '절대 침상 안정', description: '신체 피로도를 낮추고 면역 체계가 회복에 집중할 수 있도록 무리한 활동을 엄격히 제한합니다.', tips: ['하루 8시간 이상 충분한 수면', '가벼운 가동범위 스트레칭 위주'] },
            { title: '감염 징후 상시 모니터링', description: '퇴원 후에도 재발 위험성이 상존하므로 일일 바이탈 및 신체 변화를 밀착 확인합니다.', tips: ['매일 아침/저녁 체온 계측', '피부 발적이나 상처 부위 관찰'] },
            { title: '이상 증상 즉시 보고', description: '38도 이상의 고열이 발생하거나 오한, 호흡곤란, 전신 무기력증 발현 시 즉시 대처해야 합니다.', tips: ['가까운 응급의료센터 연계 확인', '자가 해열제 대처로 시간 지체 금지'] }
          ]
        };

      case '폐렴':
        return {
          dietary: [
            { title: '수분 섭취 대폭 증량', description: '기도 점막을 촉촉하게 유지하여 가래를 가볍고 묽게 배출할 수 있도록 미온수를 자주 드세요.', tips: ['따뜻한 물을 텀블러로 상시 음용', '하루 최소 1.5L~2L 수분 확보'] },
            { title: '항산화 비타민 식단', description: '폐 조직의 염증 반응을 완화하고 점막 세포를 재생하기 위해 비타민 C, A가 풍부한 음식을 먹습니다.', tips: ['신선한 과일 및 녹황색 채소 구성', '자극적인 매운 음식 제한'] },
            { title: '소화가 잘되는 유동식', description: '호흡 곤란으로 인해 식사가 불편할 수 있으므로 소화 부담이 적은 부드러운 죽 형태로 열량을 보충하세요.', tips: ['영양죽, 계란찜 등 부드러운 섭취', '천천히 씹어 먹기 조절'] }
          ],
          medication: [
            { title: '경구 항생제 정시 복용', description: '폐 내 염증성 세균의 내성을 방지하기 위해 처방 항생제 스케줄을 완벽히 소화해야 합니다.', tips: ['매일 동일한 시간에 알람 설정', '밀크나 유제품과 혼용 주의'] },
            { title: '진해거담제 복용 관리', description: '기침을 무작정 참지 말고 가래 배출을 원활하게 해주는 처방약을 복용 가이드라인에 맞춰 먹습니다.', tips: ['가래가 잘 나오도록 복용 후 물 한 컵', '임의로 복용 중단하지 않기'] },
            { title: '흡입기 약물 주의사항', description: '기관지 확장 목적의 호흡기 흡입 약물이 처방된 경우 정확한 사용 횟수와 흡입법을 숙지합니다.', tips: ['흡입 완료 후 반드시 입안 물 헹구기', '정량 분사 횟수 엄격 준수'] }
          ],
          lifestyle: [
            { title: '효과적인 기침/객담 배출', description: '폐에 과도한 압력을 주지 않으면서 기관지 깊숙한 가래를 효율적으로 배출하는 방법을 시행합니다.', tips: ['심호흡을 크게 한 후 짧고 강하게 기침', '상체를 약간 앞으로 세운 포지션'] },
            { title: '실내 적정 습도 유지', description: '건조한 공기는 호흡기를 쉽게 자극하므로 가습 환경 및 깨끗한 공기 정화 상태를 유지하세요.', tips: ['실내 습도 40% ~ 60% 상시 유지', '공기청정기 가동 및 주기적 환기'] },
            { title: '금연 및 분진 차단', description: '폐포와 기관지 점막을 직접적으로 자극하는 흡연을 전면 중단하고 간접흡연 환경도 완벽히 피해야 합니다.', tips: ['금연 보조 치료 연계 고려', '외출 시 미세먼지 차단 마스크 필수'] }
          ]
        };

      case '뇌졸중':
        return {
          dietary: [
            { title: '엄격한 저염·저콜레스테롤식', description: '혈관벽 손상과 혈압 스파이크를 예방하기 위해 소금과 포화지방 섭취를 최소화하세요.', tips: ['국물 요리 섭취 시 건더기 위주 식사', '동물성 기름 대신 식물성 불포화유 적용'] },
            { title: '연하장애 예방 안전 식단', description: '음식물 주입 시 기도로 오인 흡인되어 흡인성 폐렴을 일으키지 않도록 점도가 있는 식사를 제공합니다.', tips: ['물 형태보다 점도 증진제를 섞은 식단', '식사 시 턱을 아래로 당긴 자세 유지'] },
            { title: '식이섬유 보충 식단', description: '복압 상승으로 인한 뇌압 증가를 방지하기 위해 변비를 예방하는 식이섬유를 충분히 섭취합니다.', tips: ['통곡물, 삶은 채소류 규칙적 배정', '충분한 수반 섭취 결합'] }
          ],
          medication: [
            { title: '항혈소판제/항응고제 복용', description: '뇌혈관의 재폐색 및 혈전 형성을 막기 위해 처방된 아스피린, 플라빅스 등을 매일 복용합니다.', tips: ['임의로 복용 중단 시 재경색 위험 폭증', '식후 일정 시간에 복용 생활화'] },
            { title: '출혈 경향 주의사항', description: '항응고 성분 약물 복용 시 가벼운 상처에도 지혈이 지연될 수 있으므로 전신 출혈 징후를 감시합니다.', tips: ['부드러운 미세모 칫솔 사용', '잇몸 출혈, 혈뇨, 흑색변 발생 시 즉시 내원'] },
            { title: '혈압 및 고지혈증약 관리', description: '뇌혈관 가해 압력을 조절하기 위해 혈압 조절제와 스타틴계 약물을 빼먹지 않고 꾸준히 복용합니다.', tips: ['가정 혈압계 상시 계측 연계', '저녁 타임 복용 원칙 준수'] }
          ],
          lifestyle: [
            { title: '신경학적 마비 상태 체크', description: '안면 마비, 한쪽 사지 위약감, 구음 장애 등 뇌졸중 재발 조기 경보 증상을 상시 자가 체크합니다.', tips: ['FAST 법칙 숙지 (Face, Arm, Speech, Time)', '증상 발현 시 민간요법 금지, 즉시 응급실'] },
            { title: '안전한 포지셔닝 및 거상', description: '뇌압 상승을 통제하고 마비 측 관절 손상을 방지하기 위한 올바른 자세를 유지합니다.', tips: ['침상 머리 각도 상시 30도 유지', '마비된 팔다리 아래에 베개 받쳐주기'] },
            { title: '단계적 재활 운동 진행', description: '운동 신경 회복과 근위축 방지를 위해 신체 무리가 없는 범위에서 지속적인 재활 치료를 유도합니다.', tips: ['침상 내 수동 관절 가동 운동', '낙상 방지를 위한 보호자 동반 거동'] }
          ]
        };

      case '당뇨병 관리':
        return {
          dietary: [
            { title: '정량 단당류 제한 식단', description: '급격한 혈당 스파이크를 방지하기 위해 설탕, 액상과당 등 단순 당질 섭취를 금하고 복합 당질을 선택합니다.', tips: ['흰쌀밥 대신 잡곡밥, 현미밥 대체', '주스나 탄산음료 완전 차단'] },
            { title: '일정한 식사 시간 조절', description: '인슐린 투여 및 경구 혈당강하제 작용 시간과의 싱크를 위해 매일 일정한 시간에 정량 식사를 시행합니다.', tips: ['과식 및 불규칙한 결식 절대 금지', '간식은 규칙적인 저혈당 방지용 제한'] },
            { title: '영양소 골고루 배분', description: '탄수화물, 단백질, 지방 비율을 적정 배분하여 췌장 세포의 인슐린 분비 부담을 경감시킵니다.', tips: ['나물, 채소류 선 섭취 후 육류 먹기', '기름진 튀김 요리 제한 조절'] }
          ],
          medication: [
            { title: '인슐린 주사 투여 공정', description: '처방된 시간과 주사 단위를 엄격히 준수하여 피하주사를 시행하며, 주사 부위를 매번 순환 변경합니다.', tips: ['배꼽 주위 2cm 반경 외 구역 순환', '투여 전 유효기간 및 약물 혼탁도 점검'] },
            { title: '경구 혈당강하제 정시 복용', description: '식후 혈당 강하 및 인슐린 감수성 개선 약물을 식전/식후 복용 가이드라인대로 투약합니다.', tips: ['약 복용 후 식사 거를 시 저혈압/저혈당 위험', '약물 임의 증감 절대 금지'] },
            { title: '저혈당 쇼크 대처 보충약', description: '식사량 부족이나 과도한 운동으로 혈당이 급격히 떨어질 때를 대비하여 응급 당분을 항시 소지합니다.', tips: ['식은땀, 떨림 발생 시 설탕물 음용', '의식 불명 시에는 절대 입으로 먹이지 말 것'] }
          ],
          lifestyle: [
            { title: '자가 혈당 측정 생활화', description: '공복 혈당 및 식후 2시간 혈당 수치를 규칙적으로 기록하여 복약 조절 데이터로 활용합니다.', tips: ['혈당 기록 수첩 매일 작성', '연속혈당측정기 사용 시 센서 관리'] },
            { title: '당뇨병성 족부 질환 관리', description: '말초 신경 무감각으로 인한 상처 및 괴사를 방지하기 위해 매일 발 상태를 정밀 진찰합니다.', tips: ['맨발 보행 금지, 무조건 푹신한 양말 착용', '발 씻은 후 발가락 사이 완벽 건조'] },
            { title: '식후 규칙적인 유산소 운동', description: '말초 조직의 포도당 소모를 촉진하기 위해 식후 30분~1시간 사이에 가벼운 유산소 운동을 시행합니다.', tips: ['하루 30분~40분 빠르게 걷기', '공복 상태에서의 고강도 운동 제한'] }
          ]
        };

      case '맹장 수술 후':
        return {
          dietary: [
            { title: '점진적 식이 단계 이행', description: '장 마비 상태 회복 및 수술 부위 자극 최소화를 위해 가스(방귀) 확인 후 미음, 죽 순으로 이행합니다.', tips: ['장음 확인 전까지 철저한 금식 유지', '초기 섭취 시 자극적이거나 기름진 음식 차단'] },
            { title: '충분한 단백질/수분 공급', description: '수술로 손상된 복벽 및 장 조직의 신속한 생성을 돕기 위해 단백질 위주의 영양을 보충합니다.', tips: ['부드러운 두부죽, 계란찜 위주 식단', '미온수로 장 유착 예방 수분 섭취'] },
            { title: '가스 유발 식품 제한', description: '복부 팽만감 및 수술 부위 압박 통증을 방지하기 위해 장내 가스를 많이 생성하는 음식을 제한합니다.', tips: ['콩류, 양배추, 탄산음료 일시 금지', '유제품 섭취 과다 제한'] }
          ],
          medication: [
            { title: '처방 진통제 규칙 복용', description: '수술 부위 통증으로 인한 호흡 제한 및 신체 스트레스를 제어하기 위해 처방 진통제를 적시에 복용합니다.', tips: ['통증이 심해지기 전 PRN 약물 요청', '소화성 궤양 예방 위장약 동반 투약'] },
            { title: '경구 항생제 완복 가이드', description: '복막염 등 수술 후 2차 감염증을 방지하기 위해 처방 항생제 일수를 누락 없이 채워 복용합니다.', tips: ['설사, 구토 등 부작용 발현 시 보고', '복용 정시 시간대 세팅'] },
            { title: '소화 기능 보조제 관리', description: '마취약 및 수술 여파로 저하된 장 연동 운동을 유도하는 약물을 지침대로 복용합니다.', tips: ['식후 즉시 복용', '장폐색 징후 모니터링 연계'] }
          ],
          lifestyle: [
            { title: '조기 이상(Ambulation) 독려', description: '장 유착 방지 및 폐 합병증을 막기 위해 수술 후 신체 무리가 없는 선에서 조기 보행 운동을 시행합니다.', tips: ['복대를 튼튼히 착용 후 복도 걷기', '하루 3-4회 규칙적인 짧은 산책'] },
            { title: '수술 상처 부위 위생 관리', description: '복강경 또는 개복 부위의 감염을 예방하기 위해 드레싱 유지 상태를 깨끗이 보존합니다.', tips: ['상처 부위 발적, 진물, 열감 발생 시 보고', '실밥 제거 전까지 통목욕 금지'] },
            { title: '복압 상승 행위 제한', description: '복벽 봉합 부위의 벌어짐이나 탈장을 예방하기 위해 배에 과도한 힘이 들어가는 행위를 엄격히 제한합니다.', tips: ['무거운 물건 들기 일체 금지', '기침이나 재채기 시 베개로 수술 부위 지지'] }
          ]
        };

      case '제왕절개 후':
        return {
          dietary: [
            { title: '자궁 회복을 위한 고철분식', description: '수술 중 발생한 실혈을 보충하고 빈혈을 방지하기 위해 철분과 단백질이 풍부한 식단을 구성합니다.', tips: ['미역국, 살코기, 시금치 적극 섭취', '철분 흡수를 돕는 비타민 C 병행'] },
            { title: '부종 감소 및 수분 대사', description: '산후 몸에 고인 노폐물 배출과 모유 수유 환경 조성을 위해 맑은 수분을 충분히 공급합니다.', tips: ['미온수 자주 마시기', '붓기 완화를 위한 호박즙 등 자극 없는 섭취'] },
            { title: '부드러운 배변 유도 식단', description: '복부 절개 부위 통증으로 배변 시 힘주기가 어려우므로 변비를 막는 부드러운 유동식을 먹습니다.', tips: ['식이섬유가 풍부한 과일 주스 가볍게 섭취', '자극적인 매운 음식이나 가스 유발 식품 차단'] }
          ],
          medication: [
            { title: '자궁 수축제/오로 배출약', description: '수술 후 자궁이 정상 크기로 수축하고 고인 혈액(오로)이 원활히 나오도록 처방약을 규칙적으로 복용합니다.', tips: ['복용 후 훗배앓이(통증)가 일시적으로 증가할 수 있음', '출혈량이 비정상적으로 많을 시 보고'] },
            { title: '산후 소염진통제 복용', description: '복부 절개 통증 및 복벽 근육통을 완화하여 원활한 산후 거동과 수유가 가능하도록 정시 투약합니다.', tips: ['모유 수유에 안전한 성분 위주 처방 확인', '임의로 복용 중단하여 통증 참지 않기'] },
            { title: '철분제 및 복합 영양제', description: '산후 혈액 수치 정상화 및 골밀도 보존을 위해 처방된 철분 및 칼슘 영양제를 규칙적으로 섭취합니다.', tips: ['철분제 복용 시 변비 예방 수분 증량 필수', '공복 투여가 흡수율에 좋으나 위장 장애 시 식후 변경'] },
          ],
          lifestyle: [
            { title: '오로 양상 및 색상 관찰', description: '산후 합병증인 자궁 내 감염 및 대량 출혈을 예방하기 위해 오로의 양, 색, 냄새를 패드로 상시 매핑합니다.', tips: ['덩어리진 피가 쏟아지거나 악취 발생 시 보고', '회음부 및 패드 교체 시 위생 철저'] },
            { title: '복대 착용 및 거동 지침', description: '수술 부위 지지와 복벽 근육 회복을 위해 거동 시 복대를 바르게 착용하되, 누워있을 땐 느슨하게 해 줍니다.', tips: ['앉고 일어설 때 침대 바를 잡고 천천히 거동', '일어서기 전 어지러움증(기립성 저혈압) 선 체크'] },
            { title: '수술 부위 무자극 유지', description: '하복부 절개선 부위가 쓸리거나 감염되지 않도록 통풍이 잘 되는 넉넉한 의류를 입고 청결히 건조합니다.', tips: ['샤워 후 드라이기 찬바람으로 상처 건조', '수술 부위가 당기는 격렬한 스트레칭 금지'] }
          ]
        };

      case '골절 치료':
        return {
          dietary: [
            { title: '골융합 촉진 고칼슘 식단', description: '골절된 뼈 조직의 신속한 결합과 골진 분비를 돕기 위해 칼슘 함량이 높은 식품을 적극 매핑합니다.', tips: ['우유, 요플레, 멸치, 뱅어포 섭취', '칼슘 흡수를 제어하는 카페인/커피 전면 제한'] },
            { title: '비타민 D 및 뼈 건강 영양', description: '섭취한 칼슘이 뼈에 정상적으로 흡착될 수 있도록 비타민 D와 복합 미네랄을 충분히 공급합니다.', tips: ['버섯류, 달걀노른자 식단 포함', '하루 15분 가벼운 햇빛 쬐기 유도'] },
            { title: '체중 증가 방지 조절식', description: '깁스 및 고정 장치로 인해 활동량이 급감하므로 불필요한 체중 증가로 관절 압박이 가지 않게 칼로리를 조절합니다.', tips: ['고탄수화물 야식 및 간식 제한', '양질의 단백질과 채소 위주 포만감 형성'] }
          ],
          medication: [
            { title: '소염진통제 정시 복용', description: '골절 부위 염증성 통증과 주변 근육 경직을 줄이기 위해 처방된 소염진통제를 정해진 타임에 투약합니다.', tips: ['위점막 자극 완화를 위해 가급적 식후 즉시 복용', '진통 완화 시에도 소염 목적 지속 복용 권장'] },
            { title: '근이완제 주의사항 관리', description: '골절 손상 주변부의 보호성 근육 경련 및 쥐 내림을 통제하는 약물을 복용 가이드대로 사용합니다.', tips: ['약물 성분상 졸음이나 복시, 어지러움증 동반 가능', '약 복용 후 즉시 거동 시 낙상 절대 주의'] },
            { title: '골다공증 치료제 및 영양제', description: '골밀도 저하로 인한 2차 골절을 방지하기 위해 처방된 골다공증 예방 치료제 및 칼슘제를 복용합니다.', tips: ['골다공증 약물(비스포스포네이트)은 아침 공복 복용 후 30분간 눕지 않기', '충분한 양의 맹물과 함께 복용'] }
          ],
          lifestyle: [
            { title: '말초 신경/혈류(CSM) 감시', description: '석고붕대(깁스)나 압박 붕대가 너무 조여 신경 손상이나 구획증후군을 유발하지 않는지 사지 말초를 수시 진찰합니다.', tips: ['Color(피부색 푸르게 변함), Sensation(저림, 감각 저하), Movement(발가락/손가락 안 움직임) 즉시 보고', '통증 강도가 약으로 제어 안 되고 극심할 시 구획증후군 의심'] },
            { title: '환부 거상 포지셔닝', description: '골절 부위의 부종 및 혈류 정체를 방지하기 위해 심장보다 높은 위치로 다리/팔 포지션을 유지합니다.', tips: ['안정 시 환부 아래에 베개 2-3개 받쳐두기', '깁스 내부로 물이 들어가거나 젖지 않게 관리'] },
            { title: '등척성 운동(Isometric) 유도', description: '깁스로 고정된 내부 근육의 위축과 혈전을 방지하기 위해 관절을 움직이지 않고 근육에 힘만 주는 운동을 시행합니다.', tips: ['깁스 속 다리/팔 근육에 5초간 힘주었다 빼기 반복', '움직임이 가능한 손발가락은 수시로 꼼지락거리며 순환 유도'] }
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

  // 💡 [디자인 100% 보존 렌더러] 상단 AI 맞춤 추천 플래그 및 마크 로직 완전 박멸
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

      {/* 💡 [3오 3열 그리드 레이아웃 완전 고수] */}
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