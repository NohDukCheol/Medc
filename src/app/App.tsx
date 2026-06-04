import { useState, useEffect } from 'react';
import { LoginPage } from './components/medclaw-page/LoginPage';
import { MainDashboard as Dashboard } from './components/medclaw-page/MainDashboard';
import { PatientDetailPage } from './components/medclaw-page/PatientDetailPage';
import { VitalsInputPage } from './components/medclaw-page/VitalsInputPage';
import { PatientEducationPage } from './components/medclaw-page/PatientEducationPage';
import { HandoffPage } from './components/medclaw-page/HandoffPage';
import { HandoffDocument } from './components/medclaw-page/HandoffDocument';
import { NursingHandoffBriefing } from './components/medclaw-page/NursingHandoffBriefing';
import { PatientHistoryPage } from './components/medclaw-page/PatientHistoryPage';

// 💡 중간에 있던 세미콜론 오류 수정 완료
type ViewState = 
  | 'login' 
  | 'dashboard' 
  | 'patient-detail' 
  | 'vitals-input' 
  | 'patient-education' 
  | 'handoff' 
  | 'handoff-document'
  | 'nursing-briefing'
  | 'patient-history';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [selectedPatientId, setSelectedPatientId] = useState<number>(1);
  const [handoffPatientIds, setHandoffPatientIds] = useState<number[]>([]);
  const [handoffCheckedTasks, setHandoffCheckedTasks] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleLogin = () => setCurrentView('dashboard');
  const handleLogout = () => setCurrentView('login');

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

  // 💡 히스토리 페이지 이동을 위한 핸들러 추가
  const handleHistoryClick = (patientId: number) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-history');
  };

  const handleHandoffClick = () => setCurrentView('handoff');
  const handleBackToDashboard = () => setCurrentView('dashboard');
  const handleBackToDetail = () => setCurrentView('patient-detail');
  const handleBackToHandoff = () => setCurrentView('handoff');
  const handleNursingBriefingClick = () => setCurrentView('nursing-briefing');
  const handleBackToDashboardFromBriefing = () => setCurrentView('dashboard');

  const handleGenerateHandoffDocument = (selectedIds: number[], checkedTasks: string[]) => {
    setHandoffPatientIds(selectedIds || []);
    setHandoffCheckedTasks(checkedTasks || []);
    setCurrentView('handoff-document');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {currentView === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onNavigateToSignup={() => alert('회원가입 기능은 데모 버전에서 지원하지 않습니다.')} 
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard 
          onLogout={handleLogout} 
          onPatientClick={handlePatientClick} 
          onHandoffClick={handleHandoffClick} 
        />
      )}

      {currentView === 'patient-detail' && (
        <PatientDetailPage
          patientId={selectedPatientId}
          onBack={handleBackToDashboard}
          onVitalsClick={handleVitalsClick}
          onEducationClick={handleEducationClick}
          onHistoryClick={handleHistoryClick} /* 💡 새로 추가한 핸들러 전달 */
        />
      )}

      {currentView === 'vitals-input' && (
        <VitalsInputPage
          patientId={selectedPatientId}
          onBack={handleBackToDetail}
        />
      )}

      {currentView === 'patient-education' && (
        <PatientEducationPage
          patientId={selectedPatientId}
          onBack={handleBackToDetail}
        />
      )}

      {/* 💡 새로 추가된 히스토리 페이지 렌더링 구역 */}
      {currentView === 'patient-history' && (
        <PatientHistoryPage 
          patientId={selectedPatientId} 
          onBack={handleBackToDetail} 
        />
      )}

      {currentView === 'handoff' && (
        <HandoffPage
          onBack={handleBackToDashboard}
          onGenerateDocument={handleGenerateHandoffDocument}
          onNursingBriefingClick={handleNursingBriefingClick}
        />
      )}

      {currentView === 'handoff-document' && (
        <HandoffDocument 
          onBack={handleBackToHandoff} 
          selectedPatientIds={handoffPatientIds} 
          checkedTasks={handoffCheckedTasks} 
        />
      )}

      {currentView === 'nursing-briefing' && (
        <NursingHandoffBriefing
          onBack={handleBackToDashboardFromBriefing}
          onBackToHandoff={() => setCurrentView('handoff')}
        />
      )}
    </div>
  );
}