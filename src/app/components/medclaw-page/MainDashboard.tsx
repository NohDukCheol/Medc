import { useState } from 'react';
import {
  Bell,
  Search,
  Activity,
  Users,
  ClipboardList,
  LogOut,
  Heart,
  FileText,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { PatientList } from '../PatientList';

interface MainDashboardProps {
  onLogout: () => void;
  onPatientClick: (patientId: number) => void;
  onHandoffClick: () => void;
}

export type FilterStatus = 'all' | 'critical' | 'monitoring' | 'stable';

export function MainDashboard({ onLogout, onPatientClick, onHandoffClick }: MainDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // 독철님이 유지 요청하신 4개의 핵심 환자 현황 및 업무 필터링 단추 데이터
  const stats = [
    { type: 'all' as FilterStatus, label: '담당 환자 (전체)', value: '8', icon: Users, trend: '클릭 시 전체 보기' },
    { type: 'critical' as FilterStatus, label: '위험 업무 (위중)', value: '2', icon: Activity, trend: '클릭 시 위험 환자 필터링', color: '#EF4444' },
    { type: 'monitoring' as FilterStatus, label: '주의 업무 (관찰)', value: '2', icon: ClipboardList, trend: '클릭 시 주의 환자 필터링', color: '#F59E0B' },
    { type: 'stable' as FilterStatus, label: '대기 업무 (안정)', value: '4', icon: Heart, trend: '클릭 시 대기 환자 필터링', color: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold" style={{ color: '#0052CC' }}>MedClaw AI</h1>
            <div className="h-6 w-px bg-gray-300" />
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="환자, 병실, 약물 검색..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">간호사 김민지</div>
                <div className="text-xs text-gray-500">중환자실 B동</div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-8 space-y-6">
        {/* 상단 4개 필터 탭 (전체, 위험, 주의, 안정) */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const isSelected = activeFilter === stat.type;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveFilter(stat.type)}
                className="bg-white border-2 rounded-lg p-6 cursor-pointer transition-all shadow-xs relative overflow-hidden"
                style={{ 
                  borderColor: isSelected ? (stat.color || '#0052CC') : '#E5E7EB',
                  backgroundColor: isSelected ? `${stat.color || '#0052CC'}05` : '#FFFFFF',
                }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                {isSelected && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5" 
                    style={{ backgroundColor: stat.color || '#0052CC' }}
                  />
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: isSelected ? `${stat.color || '#0052CC'}20` : '#E6F0FF' }}>
                    <stat.icon className="w-5 h-5" style={{ color: isSelected && stat.color ? stat.color : '#0052CC' }} />
                  </div>
                  {isSelected && <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100" style={{ color: stat.color || '#0052CC' }}>선택됨</span>}
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: isSelected && stat.color ? stat.color : '#1F2937' }}>{stat.value}</div>
                <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.trend}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content 레이아웃 수정: 
          AI 펄스 브리핑 및 스마트 작업 목록을 완전히 폐기하고, 
          필터링 조건이 연동된 환자 마스터 대시보드 리스트를 단독 전체 화면 가로너비(12단 그리드 전체)로 넓혀 배치했습니다.
        */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <PatientList 
              activeFilter={activeFilter} 
              searchQuery={searchQuery} 
              onPatientClick={onPatientClick} 
            />
          </div>
        </div>

        {/* 하단 스마트 인계 문서 생성 스위칭 액션 패널 버튼 */}
        <div className="grid grid-cols-1">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onHandoffClick}
            className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-[#0052CC] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#E6F0FF' }}>
                <FileText className="w-6 h-6" style={{ color: '#0052CC' }} />
              </div>
              <div className="text-left">
                <div className="font-bold mb-1 text-gray-800">스마트 인계 통합 관리 시스템 이동</div>
                <div className="text-sm text-gray-500">인수인계 문서 및 AI 데이터 요약 생성 탭</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0052CC] transition-colors" />
          </motion.button>
        </div>
      </main>
    </div>
  );
}