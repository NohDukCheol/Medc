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

// 각 환자의 진단명과 처방에 어우러지는 AI 분석 데이터를 동적 반환하는 마스터 명세 팩토리
const getDynamicAIContent = (id: number) => {
  switch (id) {
    case 1: // 박지민 (급성 심근경색)
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
          { type: 'critical', text: '아스피린 투여 금지 - 알레르기 있음' },
          { type: 'warning', text: '혈압 >160/100 또는 HR >110 시 즉시 보고' },
          { type: 'info', text: '심전도 지속 모니터링 중' }
        ],
        analysis: [
          { title: '심전도(EKG) ST 분절 상승 지속', detail: 'V2-V4 리드에서 ST 분절의 경미한 상승이 유지되고 있어 추가적인 심근 손상 가능성 모니터링 요망.', type: 'danger' },
          { title: '심박수(HR) 보상성 빈맥 국면', detail: '현재 HR 102bpm으로 심박출량 유지를 위한 보상성 빈맥 양상 보임. NRS 흉통 수치와 연동 사정 필요.', type: 'warning' }
        ],
        tasks: [
          { id: 1, time: '14:00', task: '활력징후 측정', reason: '오더: "Monitor vital signs q2h" → 2시간마다 측정', supplies: ['혈압계', '체온계', '청진기'], guide: true },
          { id: 2, time: '14:00', task: '헤파린 5000 units IV 투여', reason: '오더: "Heparin 5000 units IV q4h" → 4시간마다 투여', supplies: ['헤파린 바이알', '주사기 (5mL)', 'IV 라인', '알코올 솜'], guide: true },
          { id: 3, time: '14:30', task: '섭취량/배출량 기록', reason: '오더: "Strict I&O" → 엄격한 수분 관리 필요', supplies: ['기록지', '측정 컵'], guide: false },
          { id: 4, time: '16:00', task: '활력징후 측정', reason: '오더: "Monitor vital signs q2h" → 2시간마다 측정', supplies: ['혈압계', '체온계', '청진기'], guide: true }
        ]
      };
    case 2: // 최서연 (맹장 수술 후)
      return {
        summary: [
          {
            text: 'Ibuprofen 400mg PO TID 처방에 따른 수술 통증 조절',
            medicationGuide: {
              name: '이부프로펜 투약 가이드',
              usage: '수술 부위 통증 경감을 위해 400mg PO 식후 경구 투여',
              precautions: ['위장관계 부작용을 줄이기 위해 식후 복용 권장', '출혈 경향성 증가 및 빈혈 징후 감시'],
              contraindications: ['활동성 소화성 궤양 환자', '아스피린 천식 병력 환자'],
              youtubeGuide: 'https://youtube.com/watch?v=ibuprofen-guide'
            }
          },
          { text: '장폐색 예방 및 장운동 촉진을 위해 매 4시간마다 조기 이상(Ambulation) 수행 격려', medicationGuide: null },
          { text: '저녁 근무(Evening Shift) 시 수술 절개 부위 감염 및 삼출물 양상 정밀 관찰', medicationGuide: null },
          { text: '수술 후 가스 배출(Flatus) 여부 및 식이 진행 단계 모니터링', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '수술 절개 부위 거즈에 선홍색 급격한 배액이나 출혈 발견 시 즉시 보고' },
          { type: 'warning', text: '통증 점수(NRS) 7점 이상 돌파 시 담당의에게 추가 조절 진통제 협의' },
          { type: 'info', text: '수술 후 초기 배뇨 기능 안정적으로 회복 완료 확인됨' }
        ],
        analysis: [
          { title: '수술 피크기 통증 조절 안정세', detail: '수술 후 NRS 통증 점수 3점으로 안정적이나, 조기 이상 시 기립성 저혈압 및 어지러움 사정 요망.', type: 'stable' },
          { title: '장운동(Bowel Sound) 감소 상태', detail: '수술 후 전신마취 영향으로 장음이 감소되어 있음. 가스 배출(Flatus) 전까지 지속적인 NPO 유지 및 조기 보행 격려.', type: 'warning' }
        ],
        tasks: [
          { id: 21, time: '14:00', task: '조기 이상(Ambulation) 보행 수행 지원', reason: '오더: "Encourage early ambulation q4h" 조기 보행을 통한 유착 및 혈전 합병증 차단', supplies: ['보행 보조기', '미끄럼방지 양말'], guide: true },
          { id: 22, time: '16:00', task: '수술 부위 감염(Wound Check) 징후 확인', reason: '오더: 저녁 근무 인계에 따른 절개선 발적, 열감, 화농성 삼출물 검사', supplies: ['멸균 장갑', '소독솜 세트', '드레싱 거즈'], guide: true },
          { id: 23, time: '18:00', task: '이부프로펜 400mg PO 식후 투여', reason: '오더: "Ibuprofen 400mg PO TID PRN" 정시 위장 보호식 연동 처방 준수', supplies: ['처방 약품', '물컵'], guide: false }
        ]
      };
    case 3: // 강민지 (인플루엔자 A형 합병증 폐렴)
      return {
        summary: [
          {
            text: 'Tamiflu 75mg PO BID 타미플루 항바이러스제 정시 투여',
            medicationGuide: {
              name: '타미플루 투약 가이드',
              usage: '12시간 간격으로 1일 2회, 총 5일간 중단 없이 경구 투여',
              precautions: ['오심, 구토 등의 위장 장애 경감을 위해 식사와 병용 고려', '신경정신계 이상행동 유발 가능성 상시 추적 관찰'],
              contraindications: ['오셀타미비르 성분에 과민증 병력이 있는 환자'],
              youtubeGuide: 'https://youtube.com/watch?v=tamiflu-guide'
            }
          },
          {
            text: 'Acetaminophen 650mg PO q6h 처방 (체온 > 38.0°C 시 적용)',
            medicationGuide: {
              name: '아세트아미노펜 가이드',
              usage: '발열 돌파 시 650mg PO 투여, 최소 4~6시간 간격 필수 유지',
              precautions: ['1일 최대 복용량 4,000mg 초과 금지', '간독성 위험성 평가를 위한 복합제 중복 여부 확인'],
              contraindications: ['중증 간기능 불전 환자', '아세트아미노펜 과민 환자'],
              youtubeGuide: 'https://youtube.com/watch?v=acetaminophen-guide'
            }
          },
          { text: 'SpO2 > 95% 타겟 유지를 위한 비강 캐뉼라 산소 2L/min 관리 및 산소포화도 체크', medicationGuide: null },
          { text: '무기폐 방지를 위한 강화폐활량계(Incentive Spirometer) 호흡 운동 지도', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '산소 주입 중에도 SpO2 < 93% 강하 또는 부호흡근 활용 호흡 시 즉시 노티' },
          { type: 'warning', text: '현재 체온 38.2°C로 발열 지속 중이며 오한 증상 동반 여부 관찰 요망' },
          { type: 'info', text: '화농성 노란 객담 배출 빈도가 전일 대비 다소 감소 추세' }
        ],
        analysis: [
          { title: '지속적인 고열 양상 (BT 38.2°C)', detail: '폐렴 염증 반응으로 인한 발열 지속. 오한 호소 시 보온 유지 및 처방된 해열제 투여 후 30분 단위 재측정.', type: 'warning' },
          { title: '산소 포화도 경계선 모니터링', detail: '비강 캐뉼라 2L 유지 상태에서 SpO2 95% 수준. 기침 및 다량의 객담 배출 시 일시적 저산소증 주의 필요.', type: 'warning' }
        ],
        tasks: [
          { id: 31, time: '14:00', task: '산소 포화도 및 호흡수 집중 사정', reason: '오더: 비강 캐뉼라 2L/min 요법의 효용성 검증 및 호흡 곤란 수치 감시', supplies: ['Pulse Oximeter'], guide: true },
          { id: 32, time: '15:00', task: '타미플루 75mg PO 항바이러스제 투여', reason: '오더: "Tamiflu 75mg PO BID" 혈중 농도 유지를 위한 12시간 정시 투약', supplies: ['타미플루 캡슐', '급수컵'], guide: true },
          { id: 33, time: '16:00', task: '강화폐활량계(Incentive Spirometer) 수행 격려', reason: '오더: "Encourage incentive spirometry use" 폐포 허탈 차단 및 분비물 배출 증진', supplies: ['Incentive Spirometer 장치'], guide: false }
        ]
      };
    case 4: // 정태호 (뇌졸중 회복기)
      return {
        summary: [
          {
            text: 'Aspirin 100mg PO QD 항혈소판 요법',
            medicationGuide: {
              name: '아스피린 투약 가이드',
              usage: '이차 뇌경색 예방을 위해 하루 1회 100mg 경구 투여',
              precautions: ['위장관 점막 손상 방지를 위해 식후 즉시 투여 권장', '토혈, 흑색변, 뇌출혈 연동 신경학적 이상 징후 상시 감시'],
              contraindications: ['활동성 소화성 위궤양 환자', '중증 지혈 장애 환자'],
              youtubeGuide: 'https://youtube.com/watch?v=aspirin-guide'
            }
          },
          { text: '급격한 재폐색 징후 조기 포착을 위한 4시간마다 신경학적 사정(GCS 의식, Pupil Check)', medicationGuide: null },
          { text: '뇌관류압 유지를 위한 수축기 혈압(SBP) 140-160 mmHg 타겟 가이드라인 준수', medicationGuide: null },
          { text: '흡인성 폐렴(Aspiration) 예방을 위해 연하 스크리닝 통과 전까지 Strict NPO(금식) 고수', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: 'Strict NPO 유지 - 연하 기능 저하 상태로 소량의 물 흡인도 치명적 폐렴 유발 가능' },
          { type: 'warning', text: '우측 편마비(Hemiplegia) 운동 능력 저하로 휠체어 이동 시 낙상 위험 극도로 높음' },
          { type: 'info', text: '현재 SBP 130/80, HR 72회로 혈압 프로토콜 안정 하한선 유지 중' }
        ],
        analysis: [
          { title: '편마비측 관리 및 낙상 극고위험', detail: '우측 편마비로 인한 신체 불균형 상태. 침상 난간(Side Rail) 상시 고정 및 보행/휠체어 보조 시 전방위 지지 필수.', type: 'danger' },
          { title: '뇌관류압 관리를 위한 혈압 감시', detail: '현재 SBP 130mmHg로 목표 하한선에 도달. 수축기 혈압이 140 이하로 유지될 경우 의식 수준(GCS) 정밀 재사정 요망.', type: 'warning' }
        ],
        tasks: [
          { id: 41, time: '14:00', task: '신경학적 사정 (GCS / 동공 반사)', reason: '오더: "Neurological checks q4h" 의식 저하, 동공 크기 부동 등 비정상 지표 감시', supplies: ['진료용 펜라이트', '신경학적 기록지'], guide: true },
          { id: 42, time: '15:00', task: '연하 선별 기능 검사(Swallowing Screen) 지원', reason: '오더: "Maintain NPO until swallowing screen functionality check completed" 식이 변경 평가', supplies: ['점도 증진제', '설압자', 'EMR 평가표'], guide: true },
          { id: 43, time: '16:00', task: '마비측 지지 및 피부 압박 상태 확인', reason: '편마비 환자의 욕창 예방을 위한 포지셔닝 및 체위 변경 프로토콜 수행', supplies: ['체위변경 쿠션'], guide: false }
        ]
      };
    case 5: // 김수연 DKA 회복기 / 폐렴
      return {
        summary: [
          {
            text: 'Ceftriaxone 2g IV q24h 주요 광범위 항생제 주입',
            medicationGuide: {
              name: '세프트리아손 투약 가이드',
              usage: '2g을 생리식염수 수액에 혼합하여 1일 1회 정맥 주사로 거치',
              precautions: ['페니실린 및 세팔로스포린계 항생제 쇼크/알레르기 이력 더블 체크', '위막성 대장염 유발성 극심한 설사 발현 여부 모니터링'],
              contraindications: ['세팔로스포린계 약물 과민증 병력자'],
              youtubeGuide: 'https://youtube.com/watch?v=ceftriaxone-guide'
            }
          },
          { text: 'DKA 회복 프로토콜에 의거한 인슐린 sliding 주입용 2시간 단위 간이 혈당(BST) 기록', medicationGuide: null },
          { text: '전해질 쇼크 예방 및 포타슘 교정을 위한 매 6시간마다 전해질(Serum Potassium) 랩 확인', medicationGuide: null },
          { text: '혈당 수치 250 mg/dL 미만 하강 시 5% 포도당 혼합 수액으로 즉시 전환 교체', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '인슐린 지속 투여에 의한 급격한 저혈당(BST < 70) 징후(식은땀, 빈맥, 떨림) 포착 시 즉시 50% DW 보고 및 투여' },
          { type: 'warning', text: '체온 38.2°C 지속 중, 38.5°C 돌파 시 아세트아미노펜 PO 처방 대기' },
          { type: 'info', text: '전해질 랩 결과 Potassium 4.1 mEq/L로 정상 안정 범위 내 안착 확인' }
        ],
        analysis: [
          { title: 'BST 변동성 및 인슐린 매핑 관리', detail: 'DKA 회복기로 혈당 수치 수시 변동 가능성 존재. 2시간 간격 BST 프로토콜 및 수액 전환 가이드라인 철저 준수.', type: 'warning' },
          { title: '폐렴 호흡기 염증 및 발열 반응', detail: 'BT 38.2°C 및 기침 증상 지속 중. 항생제 주입 라인 개방성 확보 및 정시 투약 스케줄 관리.', type: 'warning' }
        ],
        tasks: [
          { id: 51, time: '14:00', task: 'BST(간이 혈당) 측정 및 인슐린 스케일 확인', reason: '오더: DKA 프로토콜 준수를 위한 2시간 간격 BST 추적 및 슬라이딩 양 조절', supplies: ['혈당 측정기', '란셋', '알코올 솜', 'BST 기록지'], guide: true },
          { id: 52, time: '15:00', task: '세프트리아손 2g IV 정맥 주입', reason: '오더: "Ceftriaxone 2g IV q24h" 폐렴 포커스 항생제 정시 투약 스케줄', supplies: ['세프트리아손 믹스 수액', 'IV 수액 세트'], guide: true },
          { id: 53, time: '16:00', task: '전해질 검사용 채혈(Electrolyte Lab)', reason: '오더: "Monitor serum potassium and electrolytes q6h" 정량 검사 시행 오더 이행', supplies: ['주사기', '화학 검체 튜브', '토니켓'], guide: false }
        ]
      };
    case 6: // 한소희 (골절 치료 및 자궁근종 절제술 후)
      return {
        summary: [
          {
            text: 'IV PCA 통증 조절 주입 장치 부작용 모니터링',
            medicationGuide: {
              name: 'IV PCA(자가통증조절) 가이드',
              usage: '통증 발생 시 환자가 스스로 주입 버튼을 눌러 미세 용량 볼루스 주입',
              precautions: ['마약성 진통제 축적으로 인한 호흡수 저하(RR < 12회) 상시 감시', '극심한 어지러움, 오심, 구토 등의 부작용 발생 시 잠금 알고리즘 적용'],
              contraindications: ['의식 수준 저하 환자', '심각한 호흡 억제 기저 환자'],
              youtubeGuide: 'https://youtube.com/watch?v=pca-guide'
            }
          },
          { text: '수술 후 빈혈 징후 모니터링을 위한 오늘 아침 CBC(Hemoglobin/Hematocrit) 검사 결과 추적', medicationGuide: null },
          { text: '금일 14:00 Foley Catheter(유치도뇨관) 제거 및 제거 후 6시간 이내 자발 배뇨(Voiding) 여부 확인', medicationGuide: null },
          { text: '매 4시간마다 무통주사 카테터 자리에 발적, 누출 또는 침윤 유무 사정', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '14:00 폴리 카테터 제거 완료 후, 20:00까지 자발 배뇨 실패 시 단순도뇨(Nelaton) 오더 이행 검토' },
          { type: 'warning', text: '수술 및 장기 침상 안정 후 첫 보행 시 기립성 저혈압에 따른 낙상 위험 주의' },
          { type: 'info', text: '현재 환자 NRS 통증 점수 3점 수준으로 양호하며 PCA 순응도 높음' }
        ],
        analysis: [
          { title: '유치도뇨관 발거 후 자발 배뇨 감시', detail: '14:00 Foley Catheter 제거 처방에 따라 발거 후 6시간 이내(20:00 전) 자발 배뇨(Voiding) 성립 여부 집중 추적.', type: 'warning' },
          { title: '마약성 진통제(PCA) 부작용 사정', detail: 'IV PCA 투여 중으로 약물 축적에 의한 오심/구토 및 호흡수(RR) 12회 미만 강하 유무 매 시프트 정밀 감시.', type: 'warning' }
        ],
        tasks: [
          { id: 61, time: '14:00', task: 'Foley Catheter(유치도뇨관) 제거', reason: '오더: "Keep Foley catheter until 14:00 today" 발거 및 배뇨 타임라인 시작', supplies: ['10cc 주사기', '일회용 장갑', '위생 티슈'], guide: true },
          { id: 62, time: '15:00', task: 'IV PCA 기기 점검 및 오심 사정', reason: '오더: 무통주사 펌프 오더 라인 체크 및 부작용 스크리닝 프로토콜 q4h 준수', supplies: ['통증 사정지'], guide: true },
          { id: 63, time: '16:00', task: 'CBC 혈액 랩 결과 추적 및 분석', reason: '오더: "Check CBC follow-up this morning" 출혈성 빈혈 수치 저하 감시', supplies: ['EMR 결과조회 화면'], guide: false }
        ]
      };
    case 7: // 윤지우 (패혈증)
      return {
        summary: [
          {
            text: 'Norepinephrine IV Titration 승압제 정밀 infusion',
            medicationGuide: {
              name: '노르에피네프린 투약 가이드',
              usage: '중심정맥관(C-line)을 연동하여 실시간 혈압을 추적하며 Infusion Pump로 미세 titration 주입',
              precautions: ['강력한 혈관 수축으로 인한 사지 말단 괴사(Ischemia) 유무 주기적 사정', '라인 침윤(Infiltration) 시 심각한 조직 괴사 우려, 라인 개방성 상시 유지'],
              contraindications: ['혈량 결핍성 저혈압 환자(수액 보충 선행 필수)'],
              youtubeGuide: 'https://youtube.com/watch?v=norepinephrine-guide'
            }
          },
          { text: '패혈성 쇼크 진행 예방 및 신관류 평가를 위한 시간당 소변량(Strict Hourly I/O) 측정', medicationGuide: null },
          { text: '혈액 배양 검사(Blood Culture) 최종 결과 모니터링 및 항생제 감수성 일치 여부 매핑', medicationGuide: null },
          { text: '평균 동맥압(MAP) > 65 mmHg 타겟 충족을 위한 공격적 수액 요법 지속 관리', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '수축기 혈압 BP < 85/55 mmHg 미만으로 급락하거나 HR > 120 bpm 돌파 시 즉시 메디컬 노티' },
          { type: 'warning', text: '현재 체온 39.1°C 극심한 패혈성 고열 상태로 해열제 주입 및 30분 단위 재측정 관리 필요' },
          { type: 'info', text: 'Norepinephrine 메인 승압제 라인 끊김이나 폐색 없이 인퓨전 펌프 정상 가동 중' }
        ],
        analysis: [
          { title: '패혈성 쇼크 징후군 (BP 90/60)', detail: '평균동맥압(MAP) 70mmHg 수준으로 저혈압 지속 국면. 승압제(Norepinephrine) 정밀 주입 및 조직 관류 저하 지표 상시 사정.', type: 'danger' },
          { title: '중증 패혈성 고열 (BT 39.1°C)', detail: '극심한 고열로 인한 빈맥 가속화 및 탈수 위험 가중. Ice pack 적용 및 처방된 Stat 광범위 항생제 즉시 투여 완료 요망.', type: 'danger' }
        ],
        tasks: [
          { id: 71, time: '14:00', task: '시간당 소변량(Hourly U/O) Strict 체크', reason: '오더: "Hourly urine output check" 패혈증성 급성 신손상(AKI) 및 쇼크 진행 차단 모니터링', supplies: ['Urometer 정밀 측정백', '위생 장갑'], guide: true },
          { id: 72, time: '14:00', task: '광범위 항생제 IV 긴급 투여', reason: '오더: "Stat Antibiotics IV" 처방에 의거한 유효 항생제 신속 주입 스케줄', supplies: ['처방 항생제 바이알', '정맥 수액 라트'], guide: true },
          { id: 73, time: '15:00', task: '승압제 주입 속도 및 MAP 적정성 사정', reason: '오더: "Norepinephrine IV titration per protocol" 혈압 변동에 따른 속도 피드백 확인', supplies: ['Infusion Pump 기기', '혈압 커프'], guide: false }
        ]
      };
    case 8: // 이민호 (당뇨병 관리)
      return {
        summary: [
          {
            text: 'Regular Insulin SQ Sliding Scale 주사 관리',
            medicationGuide: {
              name: '속효성 인슐린(Regular Insulin) 가이드',
              usage: '매 식전 간이 혈당 측정값 스케일 범주에 매핑된 용량을 계산하여 피하주사(SQ) 시행',
              precautions: ['인슐린 주입 완료 후 30분 이내에 반드시 탄수화물 식사가 공급 완료되는지 검증', '지방 조직 증식을 방지하기 위해 상완, 복부 등 주사 위치를 매번 로테이션 교대'],
              contraindications: ['현재 BST 측정값이 70 mg/dL 미만인 저혈당 국면인 경우 주사 보류 후 보고'],
              youtubeGuide: 'https://youtube.com/watch?v=insulin-guide'
            }
          },
          { text: '당뇨병성 대사 추적을 위한 매 식사 전 정시 BST(혈당 검사) 시행 및 차트 기록', medicationGuide: null },
          { text: '식사 거부 혹은 섭취량 50% 미만 하강 시 sliding 인슐린 보류 유무 주치의 확인 프로세스', medicationGuide: null }
        ],
        highlights: [
          { type: 'critical', text: '인슐린 작용 피크 시점의 저혈당 쇼크(식은땀, 떨림, 의식 혼미) 유무 상시 감시 요망' },
          { type: 'warning', text: '만성 당뇨 합병증 예방을 위한 하지 말단 발 상처(Diabetic Foot) 및 피부 찰과상 정기 검진' },
          { type: 'info', text: '현재 당뇨 전문 관리식 섭취 중이며 환자의 식이 조절 순응도 매우 양호' }
        ],
        analysis: [
          { title: '식전/식후 혈당 완만한 제어세', detail: 'Sliding scale 정시 인슐린 투여로 혈당 스파이크 없이 안정적 관리 중. 저혈당 식은땀/떨림 증상 상시 스크리닝.', type: 'stable' }
        ],
        tasks: [
          { id: 81, time: '14:00', task: '식후 2시간 혈당(BST) 추적 측정', reason: '인슐린 투여 이후 도달하는 혈당 피크 제어력 및 췌장 대사 수치 평가 기록', supplies: ['혈당 측정기', '란셋 시험지', '알코올 솜'], guide: true },
          { id: 82, time: '17:00', task: '저녁 식사 전 BST 측정 및 슬라이딩 주사', reason: '오더: "Regular Insulin SQ per sliding scale before meals" 지 지 사항 스케줄 정시 준수', supplies: ['인슐린 전용 주사기', 'Regular Insulin 바이알'], guide: true }
        ]
      };
    default:
      return { summary: [], highlights: [], analysis: [], tasks: [] };
  }
};

export function PatientDetailPage({ patientId, onBack, onVitalsClick, onEducationClick }: PatientDetailPageProps) {
  const [newOrder, setNewOrder] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [hoveredSummaryItem, setHoveredSummaryItem] = useState<number | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<{ [key: number]: boolean }>({});

  const targetPatient = PATIENTS_DATABASE.find(p => p.id === patientId) || PATIENTS_DATABASE[0];
  const [orders, setOrders] = useState(targetPatient.doctorOrders);

  const dynamicAI = getDynamicAIContent(targetPatient.id);
  const aiAnalysis = {
    summary: dynamicAI.summary,
    highlights: dynamicAI.highlights,
    analysis: dynamicAI.analysis || []
  };
  const autoTasks = dynamicAI.tasks;

  useEffect(() => {
    setOrders(targetPatient.doctorOrders);
  }, [patientId, targetPatient]);

  const toggleTaskStatus = (taskId: number) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getTaskStatus = (taskId: number) => {
    return taskStatuses[taskId] ? 'completed' : 'pending';
  };

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
                    {targetPatient.status === 'critical' ? '위험' : targetPatient.status === 'monitoring' ? '주의' : '정상'}
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
                {orders.map((order) => (
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
                ))}

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

                        {/* Medication Guide Tooltip */}
                        {hoveredSummaryItem === index && (
                          <div className="absolute right-0 top-5 pt-3 w-96 z-50">
                            <div className="bg-white border-2 p-5" style={{ borderRadius: '12px', borderColor: '#E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                              <div className="mb-4">
                                <h3 className="text-xl font-bold mb-1" style={{ color: '#0052CC' }}>
                                  {item.medicationGuide.name}
                                </h3>
                              </div>

                              <div className="space-y-4 mb-5">
                                {/* Usage */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                                    <div className="text-sm font-bold" style={{ color: '#1E293B' }}>사용법</div>
                                  </div>
                                  <p className="text-sm ml-7 font-medium" style={{ color: '#64748B' }}>{item.medicationGuide.usage}</p>
                                </div>

                                {/* Precautions */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5" style={{ color: '#F59E0B' }} />
                                    <div className="text-sm font-bold" style={{ color: '#1E293B' }}>주의사항</div>
                                  </div>
                                  <ul className="space-y-1 ml-7 list-disc">
                                    {item.medicationGuide.precautions.map((precaution, i) => (
                                      <li key={i} className="text-sm font-medium" style={{ color: '#64748B' }}>
                                        {precaution}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Contraindications */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
                                    <div className="text-sm font-bold" style={{ color: '#1E293B' }}>사용금지</div>
                                  </div>
                                  <ul className="space-y-1 ml-7 list-disc">
                                    {item.medicationGuide.contraindications.map((contraindication, i) => (
                                      <li key={i} className="text-sm font-medium" style={{ color: '#64748B' }}>
                                        {contraindication}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => window.open(item.medicationGuide?.youtubeGuide, '_blank')}
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
                      className="text-sm font-bold"
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
                          <span className="font-bold text-sm" style={{ color: '#1E293B' }}>{task.time}</span>
                        </div>
                        <div className="text-base font-bold mb-2" style={{ color: '#1E293B' }}>{task.task}</div>
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

                    {/* Reason */}
                    <div className="border p-3 mb-3" style={{ borderRadius: '8px', backgroundColor: '#DBEAFE', borderColor: '#93C5FD' }}>
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0052CC' }} />
                        <div>
                          <div className="text-xs font-bold mb-1" style={{ color: '#1E3A8A' }}>생성 이유</div>
                          <div className="text-xs font-semibold leading-relaxed" style={{ color: '#1E40AF' }}>{task.reason}</div>
                        </div>
                      </div>
                    </div>

                    {/* Supplies */}
                    <div className="p-3" style={{ borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#64748B' }} />
                        <div className="flex-1">
                          <div className="text-xs font-bold mb-2" style={{ color: '#1E293B' }}>필요 물품</div>
                          <div className="flex flex-wrap gap-2">
                            {task.supplies.map((supply, i) => (
                              <span key={i} className="px-2 py-1 bg-white border text-xs font-semibold" style={{ borderRadius: '6px', borderColor: '#E2E8F0', color: '#64748B' }}>
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

          {/* 💡 우측 컬럼: 모니터링 카드 디자인 복구 및 Sticky 적용 */}
          <div className="space-y-6">
            
            {/* 1. 환자 실시간 모니터링 스펙 (둥근 파스텔 카드 스타일로 롤백 수정됨) */}
            <div className="bg-white border p-6 shadow-sm transition-shadow" style={{ borderRadius: '16px', borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl" style={{ backgroundColor: '#EFF6FF' }}>
                  <Activity className="w-5 h-5" style={{ color: '#0052CC' }} />
                </div>
                <h2 className="text-base font-bold text-gray-800">환자 실시간 모니터링 스펙</h2>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between items-center p-3 rounded-xl border" style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}>
                  <span className="font-semibold text-gray-500">혈압 (BP)</span>
                  <span className="font-bold text-gray-800 font-mono text-lg">{targetPatient.vitals.bp}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl border" style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}>
                  <span className="font-semibold text-gray-500">심박수 (HR)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-gray-800 font-mono text-lg">{targetPatient.vitals.hr}</span>
                    <span className="font-semibold text-gray-400 text-xs">bpm</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl border" style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}>
                  <span className="font-semibold text-gray-500">체온 (BT)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-gray-800 font-mono text-lg">{targetPatient.vitals.temp}</span>
                    <span className="font-semibold text-gray-400 text-xs">°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. AI 실시간 이상 징후 분석 컴포넌트 구역 (간호인계 페이지와 완벽하게 동일한 디자인 및 Sticky 적용) */}
            <div className="bg-white border sticky top-28" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" style={{ color: '#0052CC' }} />
                  <h2 className="text-lg font-medium" style={{ color: '#1E293B' }}>AI 실시간 이상 징후 분석</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                {aiAnalysis.analysis.map((analysisItem: any, idx: number) => {
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