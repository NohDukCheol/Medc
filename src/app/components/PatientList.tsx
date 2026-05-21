import { motion } from 'motion/react';
import { Activity, Thermometer, Heart, AlertTriangle } from 'lucide-react';
// 💡 상위 타입 경로 지정을 './MainDashboard.' 오타에서 './Dashboard'로 올바르게 교정했습니다.
import { FilterStatus } from './Dashboard';

export const PATIENTS_DATABASE = [
  {
    id: 1,
    name: '박지민',
    room: '301',
    status: 'critical',
    age: 67,
    gender: '남',
    diagnosis: '급성 심근경색',
    badge: '우선 처치 필요',
    summary: '혈압 상승 추세, 니트로글리세린 투여 후 안정',
    vitals: { bp: '160/95', hr: 102, temp: 37.8 },
    pendingTasks: 3,
    doctorOrders: [
      {
        id: 1,
        doctor: '김철수 의사',
        time: '2026-04-11 08:00',
        order: 'Nitroglycerin 0.4mg SL PRN for chest pain\nHeparin 5000 units IV q4h\nMonitor vital signs q2h\nStrict I&O\nBed rest with bathroom privileges'
      },
      {
        id: 2,
        doctor: '이영희 의사',
        time: '2026-04-10 14:00',
        order: 'Atorvastatin 40mg PO daily\nAspirin 100mg PO daily (알레르기 주의)\nECG monitoring continuous'
      }
    ]
  },
  {
    id: 2,
    name: '윤지우',
    room: '412',
    status: 'critical',
    age: 58,
    gender: '남',
    diagnosis: '패혈증',
    badge: '우선 처치 필요',
    summary: '저혈압 지속, 승압제 투여 중',
    vitals: { bp: '90/60', hr: 115, temp: 39.1 },
    pendingTasks: 5,
    doctorOrders: [
      {
        id: 1,
        doctor: '김철수 의사',
        time: '2026-04-11 09:30',
        order: 'Norepinephrine IV titration per protocol\nBlood culture follow-up\nHourly urine output check'
      }
    ]
  },
  {
    id: 3,
    name: '김수연',
    room: '405',
    status: 'monitoring',
    age: 45,
    gender: '여',
    diagnosis: '폐렴',
    badge: '주의',
    summary: '발열 지속 중, 항생제 투여 중',
    vitals: { bp: '135/85', hr: 88, temp: 38.2 },
    pendingTasks: 2,
    doctorOrders: [
      {
        id: 1,
        doctor: '이영희 의사',
        time: '2026-04-11 09:00',
        order: 'Ceftriaxone 2g IV q24h\nAcetaminophen 650mg PO q6h PRN for Temp >= 38.5'
      }
    ]
  },
  {
    id: 4,
    name: '정태호',
    room: '501',
    status: 'monitoring',
    age: 71,
    gender: '남',
    diagnosis: '뇌졸중',
    badge: '주의',
    summary: '활력징후 모니터링 중, 의식 명료',
    vitals: { bp: '145/90', hr: 85, temp: 37.1 },
    pendingTasks: 4,
    doctorOrders: [
      {
        id: 1,
        doctor: '홍길동 의사',
        time: '2026-04-11 06:00',
        order: 'Neurological checks q4h\nAspirin 100mg PO daily AC'
      }
    ]
  },
  {
    id: 5,
    name: '이민호',
    room: '218',
    status: 'stable',
    age: 52,
    gender: '남',
    diagnosis: '당뇨병 관리',
    badge: '정상',
    summary: '혈당 안정, 일반 관리 진행 중',
    vitals: { bp: '120/80', hr: 72, temp: 36.8 },
    pendingTasks: 1,
    doctorOrders: [
      {
        id: 1,
        doctor: '박민준 의사',
        time: '2026-04-11 07:00',
        order: 'Regular Insulin SQ per sliding scale before meals'
      }
    ]
  },
  {
    id: 6,
    name: '최서연',
    room: '116',
    status: 'stable',
    age: 38,
    gender: '여',
    diagnosis: '맹장 수술 후',
    badge: '정상',
    summary: '회복 양호, 통증 관리 중',
    vitals: { bp: '118/78', hr: 68, temp: 36.5 },
    pendingTasks: 2,
    doctorOrders: []
  },
  {
    id: 7,
    name: '강민지',
    room: '214',
    status: 'stable',
    age: 29,
    gender: '여',
    diagnosis: '제왕절개 후',
    badge: '정상',
    summary: '산후 회복 중, 상태 양호',
    vitals: { bp: '115/75', hr: 70, temp: 36.6 },
    pendingTasks: 1,
    doctorOrders: []
  },
  {
    id: 8,
    name: '한소희',
    room: '109',
    status: 'stable',
    age: 42,
    gender: '여',
    diagnosis: '골절 치료',
    badge: '정상',
    summary: '통증 관리 중, 재활 시작',
    vitals: { bp: '122/82', hr: 75, temp: 36.7 },
    pendingTasks: 2,
    doctorOrders: []
  }
];

interface PatientListProps {
  activeFilter: FilterStatus;
  searchQuery: string;
  onPatientClick: (patientId: number) => void;
}

export function PatientList({ activeFilter, searchQuery, onPatientClick }: PatientListProps) {
  const themeMap = {
    critical: { border: '#FCA5A5', bg: '#FFF5F5', dot: '#DC2626', text: '#DC2626', badgeBg: '#FEE2E2' },
    monitoring: { border: '#FDE68A', bg: '#FFFDF5', dot: '#F59E0B', text: '#D97706', badgeBg: '#FEF3C7' },
    stable: { border: '#E2E8F0', bg: '#FFFFFF', dot: '#10B981', text: '#10B981', badgeBg: '#D1FAE5' }
  };

  const filteredPatients = PATIENTS_DATABASE.filter(patient => {
    if (activeFilter !== 'all' && patient.status !== activeFilter) return false;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.room.toLowerCase().includes(query) ||
        patient.diagnosis.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500 font-medium">
          환자 카드를 클릭하여 상세 정보를 확인하세요
        </div>
        <div className="text-sm text-gray-600 font-semibold">
          조회 결과: {filteredPatients.length}명
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPatients.map((patient, index) => {
          const currentTheme = themeMap[patient.status as keyof typeof themeMap] || themeMap.stable;
          const isCritical = patient.status === 'critical';

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => onPatientClick(patient.id)}
              className="bg-white border rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all hover:shadow-md select-none relative"
              style={{
                borderColor: isCritical ? currentTheme.border : '#E2E8F0',
                boxShadow: isCritical ? '0 4px 18px rgba(220, 38, 38, 0.03)' : 'none'
              }}
              whileHover={{ y: -3 }}
            >
              <div>
                {isCritical && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-4 text-xs font-bold text-red-700" style={{ backgroundColor: '#FFF1F2' }}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{patient.badge}</span>
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-base text-gray-800">{patient.name}</span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.dot }} />
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{patient.age}세 • {patient.gender}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-blue-700">{patient.room}</div>
                    <div className="text-[11px] text-gray-400 font-medium">병실</div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="text-xs text-gray-500 font-medium">
                    <span className="text-gray-400 mr-1">진단:</span> {patient.diagnosis}
                  </div>
                  <div className="flex">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.text }}>
                      {patient.status === 'critical' ? '① 위험' : patient.status === 'monitoring' ? '주의' : '✓ 정상'}
                    </span>
                  </div>
                  <div className="mt-2 p-2.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100 leading-normal">
                    {patient.summary}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-gray-50/70 p-2 rounded-md text-center border border-gray-100">
                    <div className="text-[9px] text-gray-400 font-medium flex items-center justify-center gap-0.5"><Activity className="w-2.5 h-2.5" />혈압</div>
                    <div className="text-xs font-bold text-gray-700 mt-0.5">{patient.vitals.bp}</div>
                  </div>
                  <div className="bg-gray-50/70 p-2 rounded-md text-center border border-gray-100">
                    <div className="text-[9px] text-gray-400 font-medium flex items-center justify-center gap-0.5"><Heart className="w-2.5 h-2.5" />심박</div>
                    <div className="text-xs font-bold text-gray-700 mt-0.5">{patient.vitals.hr}</div>
                  </div>
                  <div className="bg-gray-50/70 p-2 rounded-md text-center border border-gray-100">
                    <div className="text-[9px] text-gray-400 font-medium flex items-center justify-center gap-0.5"><Thermometer className="w-2.5 h-2.5" />체온</div>
                    <div className="text-xs font-bold text-gray-700 mt-0.5">{patient.vitals.temp}°C</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-400">대기 업무</span>
                  <span className="px-2 py-0.5 rounded font-bold" style={{ 
                    backgroundColor: patient.pendingTasks >= 4 ? '#FFF1F2' : '#F8FAFC',
                    color: patient.pendingTasks >= 4 ? '#E11D48' : '#475569'
                  }}>
                    {patient.pendingTasks}건
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}