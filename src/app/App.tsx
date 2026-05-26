import { useState, useEffect } from 'react';
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
  // 체크된 업무 목록을 저장할 상태 추가
  const [handoffCheckedTasks, setHandoffCheckedTasks] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);
  
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

  // 💡 HandoffPage에서 확정 시 체크된 업무 배열(checkedTasks)도 함께 받아옴
  const handleGenerateHandoffDocument = (selectedIds: number[], checkedTasks: string[]) => {
    setHandoffPatientIds(selectedIds || []);
    setHandoffCheckedTasks(checkedTasks || []);
    setCurrentView('handoff-document');
  };

  const handleBackToHandoff = () => {
    setCurrentView('handoff');
  };

  const handleNursingBriefingClick = () => {
    setCurrentView('nursing-briefing');
  };

  const handleBackToDashboardFromBriefing = () => {
    setCurrentView('dashboard');
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
          checkedTasks={handoffCheckedTasks} // 💡 최종 문서 컴포넌트로 전달
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