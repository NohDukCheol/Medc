import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  AlertCircle,
  Pill,
  Activity,
  FileText,
  Syringe,
  CheckCircle2,
  Circle
} from 'lucide-react';

interface Task {
  id: number;
  type: 'medication' | 'vitals' | 'documentation' | 'procedure';
  patient: string;
  room: string;
  description: string;
  dueTime: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  orderedBy: string;
  completed: boolean;
  minutesUntilDue: number;
}

const tasks: Task[] = [
  {
    id: 1,
    type: 'medication',
    patient: '윤지우',
    room: '412',
    description: '항생제 IV 투여',
    dueTime: '14:00',
    priority: 'urgent',
    orderedBy: '김철수 의사',
    completed: false,
    minutesUntilDue: 5
  },
  {
    id: 2,
    type: 'medication',
    patient: '박지민',
    room: '302',
    description: '니트로글리세린 투여',
    dueTime: '14:15',
    priority: 'urgent',
    orderedBy: '이영희 의사',
    completed: false,
    minutesUntilDue: 20
  },
  {
    id: 3,
    type: 'vitals',
    patient: '정태호',
    room: '501',
    description: '활력징후 측정',
    dueTime: '14:30',
    priority: 'high',
    orderedBy: '박민준 의사',
    completed: false,
    minutesUntilDue: 35
  },
  {
    id: 4,
    type: 'medication',
    patient: '김수연',
    room: '405',
    description: '해열제 경구 투여',
    dueTime: '15:00',
    priority: 'medium',
    orderedBy: '김철수 의사',
    completed: false,
    minutesUntilDue: 65
  },
  {
    id: 5,
    type: 'procedure',
    patient: '윤지우',
    room: '412',
    description: '드레싱 교체',
    dueTime: '15:30',
    priority: 'high',
    orderedBy: '이영희 의사',
    completed: false,
    minutesUntilDue: 95
  },
  {
    id: 6,
    type: 'documentation',
    patient: '최서연',
    room: '156',
    description: '수술 후 경과 기록',
    dueTime: '16:00',
    priority: 'medium',
    orderedBy: '박민준 의사',
    completed: false,
    minutesUntilDue: 125
  },
  {
    id: 7,
    type: 'medication',
    patient: '이민호',
    room: '218',
    description: '인슐린 주사',
    dueTime: '16:30',
    priority: 'high',
    orderedBy: '김철수 의사',
    completed: false,
    minutesUntilDue: 155
  },
  {
    id: 8,
    type: 'vitals',
    patient: '박지민',
    room: '302',
    description: '심전도 모니터링',
    dueTime: '17:00',
    priority: 'urgent',
    orderedBy: '이영희 의사',
    completed: false,
    minutesUntilDue: 185
  }
];

export function SmartTodoList() {
  const [taskList, setTaskList] = useState(tasks);

  const toggleTask = (id: number) => {
    setTaskList(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return Pill;
      case 'vitals':
        return Activity;
      case 'documentation':
        return FileText;
      case 'procedure':
        return Syringe;
      default:
        return Circle;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'medication':
        return '투약';
      case 'vitals':
        return '활력징후';
      case 'documentation':
        return '기록';
      case 'procedure':
        return '처치';
      default:
        return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#DC2626';
      case 'high':
        return '#F59E0B';
      case 'medium':
        return '#0052CC';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '긴급';
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

  const getTimeUrgencyColor = (minutes: number) => {
    if (minutes <= 15) return '#DC2626';
    if (minutes <= 30) return '#F59E0B';
    return '#6B7280';
  };

  const pendingTasks = taskList.filter(t => !t.completed);
  const completedTasks = taskList.filter(t => t.completed);

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg">스마트 작업 목록</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">완료:</span>
            <span className="font-medium" style={{ color: '#0052CC' }}>
              {completedTasks.length}/{taskList.length}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">의사 처방 기반 • 시간순 자동 정렬</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-3 px-2">대기 중 ({pendingTasks.length})</div>
            <div className="space-y-2">
              {pendingTasks.map((task, index) => {
                const Icon = getTypeIcon(task.type);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Circle className="w-5 h-5 text-gray-400 hover:text-[#0052CC] transition-colors" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${getPriorityColor(task.priority)}20`,
                              color: getPriorityColor(task.priority)
                            }}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }}
                          >
                            {getTypeLabel(task.type)}
                          </span>
                        </div>

                        <div className="mb-2">
                          <div className="font-medium mb-1">{task.description}</div>
                          <div className="text-sm text-gray-600">
                            {task.patient} • 병실 {task.room}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-500">처방: {task.orderedBy}</div>
                          <div
                            className="flex items-center gap-1 font-medium"
                            style={{ color: getTimeUrgencyColor(task.minutesUntilDue) }}
                          >
                            <Clock className="w-4 h-4" />
                            <span>{task.dueTime}</span>
                            {task.minutesUntilDue <= 30 && (
                              <span className="ml-1">({task.minutesUntilDue}분 남음)</span>
                            )}
                          </div>
                        </div>

                        {task.minutesUntilDue <= 15 && (
                          <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-red-50 rounded text-sm text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span>즉시 처리 필요</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 mb-3 px-2">완료 ({completedTasks.length})</div>
            <div className="space-y-2">
              {completedTasks.map((task) => {
                const Icon = getTypeIcon(task.type);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 rounded-lg p-4 bg-white opacity-60 cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium line-through text-gray-500 mb-1">
                          {task.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.patient} • 병실 {task.room}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
