import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  unit: string;
  icon: React.ElementType;
  accent: string;
  soft: string;
  trend: string;
  grad: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
}

const StatsOverview = ({ stats }: StatsOverviewProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
    {stats.map((stat, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
        className="relative rounded-2xl p-4 sm:p-5 overflow-hidden group hover:-translate-y-1 transition-all duration-200"
        style={{ background: 'white', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}
      >
       
        
        <div className="relative">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.soft }}>
              <stat.icon size={18} style={{ color: stat.accent }} />
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: stat.soft, color: stat.accent }}>
              <TrendingUp size={8} />{stat.trend}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black leading-none mb-1" style={{ color: '#1e1b4b' }}>
            {stat.value}
            {stat.unit && <span className="text-sm font-bold text-slate-400 ml-1">{stat.unit}</span>}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export default StatsOverview;