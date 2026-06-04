import { ArrowLeft, User, FileText, Calendar, Clock, Activity, FolderOpen, AlertTriangle } from 'lucide-react';
import { PATIENTS_DATABASE } from '../PatientList';

interface PatientHistoryPageProps {
  patientId: number;
  onBack: () => void;
}

// 💡 환자별 동적 과거 진료 기록(차팅) 팩토리
const getPatientHistoryData = (id: number) => {
  switch (id) {
    case 1: // 박지민 (급성 심근경색)
      return {
        pastHistory: ['고혈압 (5년전 진단)', '고지혈증 (3년전 진단)', '당뇨병 (식이조절 중)'],
        allergies: ['페니실린', '아스피린 (두드러기 발현)'],
        charting: [
          { date: '2026-04-08 10:20', department: '응급의학과', doctor: '최민영', note: '가슴을 쥐어짜는 듯한 통증(NRS 8) 주소로 ER 내원. EKG 상 ST 분절 상승 확인됨. 즉시 CCU 입원 결정.' },
          { date: '2023-11-15 14:00', department: '순환기내과', doctor: '김철수', note: '외래 정기진료. 고혈압 약제 처방 유지 (Amlodipine 5mg). 최근 계단 오를 때 숨참 증상 호소하여 운동부하검사 예약함.' },
          { date: '2021-05-10 09:30', department: '일반외과', doctor: '이준호', note: '급성 충수돌기염으로 복강경 하 충수절제술 시행. 합병증 없이 퇴원함.' }
        ]
      };
    case 2: // 최서연 (맹장 수술 후)
      return {
        pastHistory: ['위염 (만성)', '특이 기저질환 없음'],
        allergies: ['없음'],
        charting: [
          { date: '2026-05-25 22:15', department: '일반외과', doctor: '박준형', note: '우하복부 통증(RLQ pain) 및 반발통 양성으로 응급 수술 시행. 복강경 하 충수절제술(Laparoscopic appendectomy) 성공적 완료.' },
          { date: '2024-02-11 11:00', department: '소화기내과', doctor: '정지훈', note: '속쓰림 및 소화불량으로 내시경 시행. 가벼운 표재성 위염 관찰되어 제산제 처방.' }
        ]
      };
    case 3: // 강민지 (인플루엔자 폐렴)
      return {
        pastHistory: ['소아 천식 (현재는 증상 미미)', '알레르기 비염'],
        allergies: ['복숭아'],
        charting: [
          { date: '2026-05-24 15:30', department: '호흡기내과', doctor: '최세진', note: '3일 전부터 시작된 39도 고열 및 기침, 화농성 객담 주소로 내원. 독감 검사 A형 양성. 흉부 X-ray 상 우하엽 경화 소견(폐렴)으로 입원.' },
          { date: '2025-10-05 10:00', department: '이비인후과', doctor: '김재현', note: '환절기 알레르기 비염 악화로 항히스타민제 2주 분량 처방.' }
        ]
      };
    case 4: // 정태호 (뇌졸중 회복기)
      return {
        pastHistory: ['고혈압 (15년전 진단)', '심방세동 (10년전 진단)', '전립선 비대증'],
        allergies: ['NSAIDs (소화불량)'],
        charting: [
          { date: '2026-04-01 08:45', department: '신경과', doctor: '홍길동', note: '기상 직후 우측 편마비 및 구음장애 발생하여 119 통해 내원. Brain MRI 상 좌측 중대뇌동맥(MCA) 영역 뇌경색 확인됨. tPA 혈전용해제 골든타임 내 투여.' },
          { date: '2025-12-10 14:20', department: '순환기내과', doctor: '이명수', note: '심방세동 정기 팔로우업. 항응고제(NOAC) 처방 및 복약 순응도 양호함.' },
          { date: '2015-08-22 10:00', department: '비뇨기과', doctor: '최영환', note: '전립선 비대증 진단. 투약 치료 시작.' }
        ]
      };
    default:
      return {
        pastHistory: ['특이 기저질환 없음'],
        allergies: ['알려진 알레르기 없음'],
        charting: [
          { date: '2026-01-15 09:00', department: '가정의학과', doctor: '김원장', note: '건강검진 시행. 혈압, 혈당 정상 소견. 경미한 피로감 호소하여 생활 습관 교정 교육함.' },
          { date: '2024-07-10 16:30', department: '정형외과', doctor: '박원장', note: '우측 발목 염좌(Sprain)로 반깁스(Splint) 1주 적용.' }
        ]
      };
  }
};

export function PatientHistoryPage({ patientId, onBack }: PatientHistoryPageProps) {
  const currentPatient = PATIENTS_DATABASE.find(p => p.id === patientId) || PATIENTS_DATABASE[0];
  const historyData = getPatientHistoryData(currentPatient.id);

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
            <span>환자 상세 정보로 돌아가기</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <FolderOpen className="w-8 h-8" style={{ color: '#0052CC' }} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>이전 진료 및 차팅 기록</h1>
              </div>
              <div className="text-sm font-medium" style={{ color: '#64748B' }}>
                {currentPatient.name} ({currentPatient.age}세) • 병실 {currentPatient.room}호 • <span className="text-blue-600 font-bold">{currentPatient.diagnosis}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          
          {/* Left Column: Basic Medical History */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white border p-6" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                <Activity className="w-5 h-5" style={{ color: '#0052CC' }} />
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>과거 병력 (Past Medical History)</h2>
              </div>
              <ul className="space-y-3">
                {historyData.pastHistory.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-medium" style={{ color: '#475569' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#0052CC' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border p-6" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#DC2626' }} />
                <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>알레르기 (Allergies)</h2>
              </div>
              <ul className="space-y-3">
                {historyData.allergies.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-bold" style={{ color: item === '없음' || item === '알려진 알레르기 없음' ? '#10B981' : '#DC2626' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item === '없음' || item === '알려진 알레르기 없음' ? '#10B981' : '#DC2626' }} />
                    {item}
                  </li>
                ))}
              </ul> {/* 💡 </div>를 </ul>로 수정하여 React 컴파일 에러 해결 */}
            </div>
          </div>

          {/* Right Column: Historical Charting Timeline */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white border" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: '#0052CC' }} />
                  <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>과거 차팅 및 진료 기록</h2>
                </div>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>최근 기록부터 역순으로 정렬됩니다.</p>
              </div>

              <div className="p-6 space-y-6">
                {historyData.charting.map((chart, idx) => (
                  <div key={idx} className="relative pl-6 pb-2" style={{ borderLeft: idx === historyData.charting.length - 1 ? 'none' : '2px solid #E2E8F0' }}>
                    {/* Timeline Dot */}
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: '#0052CC' }}></div>
                    
                    <div className="bg-gray-50 border p-5 transition-shadow hover:shadow-md" style={{ borderRadius: '12px', borderColor: '#E2E8F0' }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-lg" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                            {chart.department}
                          </span>
                          <span className="text-sm font-bold text-gray-700">담당의: {chart.doctor}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#64748B' }}>
                          <Calendar className="w-3.5 h-3.5" />
                          {chart.date}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white border rounded-lg text-sm font-medium leading-relaxed" style={{ borderColor: '#F1F5F9', color: '#334155' }}>
                        {chart.note}
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