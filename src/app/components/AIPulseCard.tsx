import { motion } from 'motion/react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function AIPulseCard() {
  const insights = [
    {
      type: 'urgent',
      icon: AlertTriangle,
      text: '3명의 환자 투약 예정',
      time: '다음 30분 이내',
      priority: 'high'
    },
    {
      type: 'alert',
      icon: TrendingUp,
      text: '병실 402 혈압 상승 추세 감지',
      time: '지난 2시간',
      priority: 'medium'
    },
    {
      type: 'success',
      icon: CheckCircle,
      text: '모든 위중 환자 최근 1시간 내 확인 완료',
      time: '45분 전',
      priority: 'low'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-[#0052CC] to-[#0043A8] rounded-lg p-6 text-white mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-medium">AI 펄스 브리핑</h2>
          <p className="text-sm text-white/80">실시간 상황 요약</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: insight.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                                 insight.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' :
                                 'rgba(16, 185, 129, 0.2)'
                }}
              >
                <insight.icon
                  className="w-5 h-5"
                  style={{
                    color: insight.priority === 'high' ? '#FEE2E2' :
                           insight.priority === 'medium' ? '#FEF3C7' :
                           '#D1FAE5'
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="mb-1">{insight.text}</p>
                <div className="flex items-center gap-1 text-sm text-white/70">
                  <Clock className="w-3 h-3" />
                  <span>{insight.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm">
        <span className="text-white/70">마지막 업데이트</span>
        <span className="font-medium">방금 전</span>
      </div>
    </motion.div>
  );
}
