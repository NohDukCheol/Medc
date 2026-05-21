import { useState } from 'react';
import { LoginPage } from './components/medclaw-page/LoginPage';
import { MainDashboard as Dashboard } from './components/medclaw-page/MainDashboard';
import { PatientDetailPage } from './components/medclaw-page/PatientDetailPage';
import { VitalsInputPage } from './components/medclaw-page/VitalsInputPage';
import { PatientEducationPage } from './components/medclaw-page/PatientEducationPage';
import { HandoffPage } from './components/medclaw-page/HandoffPage';
import { HandoffDocument } from './components/medclaw-page/HandoffDocument';
import { NursingHandoffBriefing } from './components/medclaw-page/NursingHandoffBriefing';

type ViewState = 
  | 'login' 
  | 'dashboard' 
  | 'patient-detail' 
  | 'vitals-input' 
  | 'patient-education' 
  | 'handoff' 
  | 'handoff-document'
  | 'nursing-briefing';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [selectedPatientId, setSelectedPatientId] = useState<number>(1);
  const [handoffPatientIds, setHandoffPatientIds] = useState<number[]>([]);

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  const handlePatientClick = (patientId: number) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-detail');
  };

  const handleVitalsClick = (patientId: number) => {
    setSelectedPatientId(patientId);
    setCurrentView('vitals-input');
  };

  const handleEducationClick = (patientId: number) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-education');
  };

  const handleHandoffClick = () => {
    setCurrentView('handoff');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleBackToDetail = () => {
    setCurrentView('patient-detail');
  };

  const handleGenerateHandoffDocument = (selectedIds: number[]) => {
    setHandoffPatientIds(selectedIds || []);
    setCurrentView('handoff-document');
  };

  const handleBackToHandoff = () => {
    setCurrentView('handoff');
  };

  // 💡 간호 브리핑 모드 제어용 이벤트 액션 함수들
  const handleNursingBriefingClick = () => {
    setCurrentView('nursing-briefing');
  };

  const handleBackToDashboardFromBriefing = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. 로그인 화면 */}
      {currentView === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onNavigateToSignup={() => alert('회원가입 기능은 데모 버전에서 지원하지 않습니다.')} 
        />
      )}

      {/* 2. 메인 대시보드 화면 */}
      {currentView === 'dashboard' && (
        <Dashboard
          onLogout={handleLogout}
          onPatientClick={handlePatientClick}
          onHandoffClick={handleHandoffClick}
        />
      )}

      {/* 3. 환자 상세 정보 페이지 */}
      {currentView === 'patient-detail' && (
        <PatientDetailPage
          patientId={selectedPatientId}
          onBack={handleBackToDashboard}
          onVitalsClick={handleVitalsClick}
          onEducationClick={handleEducationClick}
        />
      )}

      {/* 4. 실시간 바이탈징후 입력 페이지 */}
      {currentView === 'vitals-input' && (
        <VitalsInputPage
          patientId={selectedPatientId}
          onBack={handleBackToDetail}
        />
      )}

      {/* 5. 맞춤형 환자 교육 페이지 */}
      {currentView === 'patient-education' && (
        <PatientEducationPage
          patientId={selectedPatientId}
          onBack={handleBackToDetail}
        />
      )}

      {/* 6. 스마트 인수인계 세션 준비 페이지 */}
      {currentView === 'handoff' && (
        <HandoffPage
          onBack={handleBackToDashboard}
          onGenerateDocument={handleGenerateHandoffDocument}
          onNursingBriefingClick={handleNursingBriefingClick} // 💡 브리핑 트리거 연동
        />
      )}

      {/* 7. 실시간 인계 최종 완성 문서 패널 */}
      {currentView === 'handoff-document' && (
        <HandoffDocument 
          onBack={handleBackToHandoff} 
          selectedPatientIds={handoffPatientIds} 
        />
      )}

      {/* 8. 간호 인계 타임라인 브리핑 화면 */}
      {currentView === 'nursing-briefing' && (
        <NursingHandoffBriefing
          onBack={handleBackToDashboardFromBriefing}
          onBackToHandoff={() => setCurrentView('handoff')}
        />
      )}
    </div>
  );
}