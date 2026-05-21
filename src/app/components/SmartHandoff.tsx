import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Send,
  Download,
  User,
  Calendar,
  Activity,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';

interface SmartHandoffProps {
  onBack: () => void;
}

export function SmartHandoff({ onBack }: SmartHandoffProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceMemo, setVoiceMemo] = useState('');
  const [selectedPatients, setSelectedPatients] = useState<number[]>([1, 2, 3]);

  const patients = [
    { id: 1, name: '박지민', room: '302', status: 'critical' },
    { id: 2, name: '김수연', room: '405', status: 'monitoring' },
    { id: 3, name: '윤지우', room: '412', status: 'critical' },
    { id: 4, name: '이민호', room: '218', status: 'stable' },
    { id: 5, name: '정태호', room: '501', status: 'monitoring' }
  ];

  const sbarReports = [
    {
      patientId: 1,
      name: '박지민',
      room: '302',
      situation: {
        priority: 'high',
        items: [
          '67세 남성, 급성 심근경색으로 04/08 입원',
          '현재 CCU 입원 3일차',
          '흉통 호소, 니트로글리세린 투여 후 증상 완화'
        ]
      },
      background: {
        priority: 'medium',
        items: [
          '기저질환: 고혈압, 당뇨병, 고지혈증',
          '알레르기: 페니실린, 아스피린',
          '과거력: 5년 전 협심증 진단'
        ]
      },
      assessment: {
        priority: 'high',
        items: [
          '활력징후: BP 160/95, HR 102, SpO2 94%, 체온 37.8°C',
          '지난 12시간 혈압 상승 추세 (평균 155/92)',
          '심박수 정상 범위 상한 유지 중',
          '산소포화도 저하 경향 (정상 범위 하한)'
        ]
      },
      recommendation: {
        priority: 'high',
        items: [
          '혈압 >165/100 또는 HR >110 시 즉시 의사 보고',
          '니트로글리세린 필요시 투여 (흉통 발생 시)',
          '활력징후 2시간마다 모니터링 지속',
          '산소포화도 <92% 시 산소 투여 고려',
          '다음 투약: 헤파린 IV 16:00 예정'
        ]
      },
      lastUpdate: '13:55',
      voiceNote: '환자분이 오늘 오전 가족과 통화 후 불안감을 많이 호소하셨습니다. 정서적 지지와 안심이 필요할 것 같습니다.'
    },
    {
      patientId: 2,
      name: '김수연',
      room: '405',
      situation: {
        priority: 'medium',
        items: [
          '45세 여성, 폐렴으로 04/07 입원',
          '일반 병동 입원 4일차',
          '발열 지속, 해열제 투여 중'
        ]
      },
      background: {
        priority: 'low',
        items: [
          '기저질환: 천식',
          '알레르기: 없음',
          '과거력: 특이사항 없음'
        ]
      },
      assessment: {
        priority: 'medium',
        items: [
          '활력징후: BP 135/85, HR 88, SpO2 96%, 체온 38.2°C',
          '지난 12시간 체온 37.8-38.5°C 범위 유지',
          '기침 감소, 객담 양상 호전',
          '식사 섭취량 증가 (50% → 70%)'
        ]
      },
      recommendation: {
        priority: 'medium',
        items: [
          '체온 >38.5°C 시 해열제 투여',
          '항생제 IV 계속 투여 (4시간마다)',
          '활력징후 4시간마다 체크',
          '수분 섭취 격려',
          '다음 투약: 항생제 IV 15:00 예정'
        ]
      },
      lastUpdate: '13:50',
      voiceNote: '항생제 투여 시작 후 상태가 꾸준히 호전되고 있습니다. 환자분도 많이 안정되었다고 하십니다.'
    },
    {
      patientId: 3,
      name: '윤지우',
      room: '412',
      situation: {
        priority: 'high',
        items: [
          '58세 남성, 패혈증으로 04/09 입원',
          'ICU 입원 2일차',
          '의식 명료, 전신 쇠약감 호소'
        ]
      },
      background: {
        priority: 'medium',
        items: [
          '기저질환: 당뇨병, 만성 신부전',
          '알레르기: 없음',
          '과거력: 투석 중 (주 3회)'
        ]
      },
      assessment: {
        priority: 'high',
        items: [
          '활력징후: BP 90/60, HR 115, SpO2 92%, 체온 39.1°C',
          '저혈압 지속, 승압제 투여 중',
          '고열 지속, 해열 조치 중',
          '산소포화도 저하, 산소 4L 투여 중'
        ]
      },
      recommendation: {
        priority: 'high',
        items: [
          'BP <85/55 또는 HR >120 시 즉시 의사 보고',
          '광범위 항생제 계속 투여',
          '활력징후 1시간마다 필수 모니터링',
          '수액 요법 지속, 시간당 소변량 체크',
          '다음 투약: 항생제 IV 14:00 (즉시)'
        ]
      },
      lastUpdate: '13:58',
      voiceNote: '새벽에 혈압이 급격히 떨어져서 승압제를 추가했습니다. 지금은 안정적이지만 면밀한 관찰이 필요합니다.'
    }
  ];

  const togglePatient = (id: number) => {
    setSelectedPatients(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return AlertCircle;
      case 'medium':
        return Info;
      case 'low':
        return CheckCircle;
      default:
        return Info;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0052CC] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>대시보드로 돌아가기</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl mb-2">스마트 인계 보고서</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>2026년 4월 10일 (금)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>낮번 → 초번 인계 (14:00)</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>인계자: 김민지 간호사</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>PDF 다운로드</span>
              </button>
              <button
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                style={{ backgroundColor: '#0052CC', color: 'white' }}
              >
                <Send className="w-4 h-4" />
                <span>인계 완료</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Patient Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
        >
          <h2 className="text-lg mb-4">인계 대상 환자 선택</h2>
          <div className="flex flex-wrap gap-3">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => togglePatient(patient.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedPatients.includes(patient.id)
                    ? 'border-[#0052CC] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedPatients.includes(patient.id) ? (
                    <CheckCircle className="w-4 h-4" style={{ color: '#0052CC' }} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="font-medium">{patient.name}</span>
                  <span className="text-sm text-gray-500">({patient.room})</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* SBAR Reports */}
        <div className="space-y-6">
          {sbarReports
            .filter(report => selectedPatients.includes(report.patientId))
            .map((report, index) => (
              <motion.div
                key={report.patientId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Report Header */}
                <div className="p-6 border-b border-gray-200" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl">{report.name}</h3>
                        <span className="px-2 py-1 rounded text-sm bg-gray-200 text-gray-700">
                          병실 {report.room}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        SBAR 형식 자동 생성 • 지난 12시간 데이터 기반
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>마지막 업데이트: {report.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Situation */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ backgroundColor: getPriorityColor(report.situation.priority) }}
                      />
                      <h4 className="text-lg font-medium">상황 (Situation)</h4>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: `${getPriorityColor(report.situation.priority)}20`,
                          color: getPriorityColor(report.situation.priority)
                        }}
                      >
                        {getPriorityLabel(report.situation.priority)}
                      </span>
                    </div>
                    <ul className="space-y-2 ml-4">
                      {report.situation.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-[#0052CC] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Background */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ backgroundColor: getPriorityColor(report.background.priority) }}
                      />
                      <h4 className="text-lg font-medium">배경 (Background)</h4>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: `${getPriorityColor(report.background.priority)}20`,
                          color: getPriorityColor(report.background.priority)
                        }}
                      >
                        {getPriorityLabel(report.background.priority)}
                      </span>
                    </div>
                    <ul className="space-y-2 ml-4">
                      {report.background.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-[#0052CC] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Assessment */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ backgroundColor: getPriorityColor(report.assessment.priority) }}
                      />
                      <h4 className="text-lg font-medium">평가 (Assessment)</h4>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: `${getPriorityColor(report.assessment.priority)}20`,
                          color: getPriorityColor(report.assessment.priority)
                        }}
                      >
                        {getPriorityLabel(report.assessment.priority)}
                      </span>
                    </div>
                    <div className="ml-4 space-y-3">
                      {report.assessment.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-3 rounded-lg"
                          style={{ backgroundColor: '#F8FAFC' }}
                        >
                          <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0052CC' }} />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ backgroundColor: getPriorityColor(report.recommendation.priority) }}
                      />
                      <h4 className="text-lg font-medium">권고사항 (Recommendation)</h4>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: `${getPriorityColor(report.recommendation.priority)}20`,
                          color: getPriorityColor(report.recommendation.priority)
                        }}
                      >
                        {getPriorityLabel(report.recommendation.priority)}
                      </span>
                    </div>
                    <div className="ml-4 space-y-2">
                      {report.recommendation.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#0052CC] transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voice Note */}
                  {report.voiceNote && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Mic className="w-5 h-5" style={{ color: '#0052CC' }} />
                        <h4 className="font-medium">음성 메모</h4>
                        <span className="text-sm text-gray-500">(데이터로 포착되지 않는 세부사항)</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-gray-700 italic">"{report.voiceNote}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        {/* Voice Memo Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-5 h-5" style={{ color: '#0052CC' }} />
            <h3 className="text-lg">추가 음성 메모 작성</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            데이터로 포착되지 않는 중요한 맥락이나 특이사항을 기록하세요.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>녹음 중지</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>음성 녹음 시작</span>
                </>
              )}
            </button>
            <textarea
              value={voiceMemo}
              onChange={(e) => setVoiceMemo(e.target.value)}
              placeholder="또는 직접 입력하세요..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
