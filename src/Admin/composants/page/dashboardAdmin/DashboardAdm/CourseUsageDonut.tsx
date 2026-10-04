import { motion } from 'framer-motion';

interface CourseUsageDonutProps {
  formationsStatsLength: number;
  formationCount: number;
}

const CourseUsageDonut = ({ formationsStatsLength, formationCount }: CourseUsageDonutProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
    className="rounded-2xl p-5"
    style={{ background: 'white', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}
  >
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Utilisation Cours</p>
    <div className="flex items-center justify-between">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
          <circle
            cx="40" cy="40" r="32"
            stroke="url(#donutGrad2)" strokeWidth="8" fill="transparent"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 32}
            strokeDashoffset={formationCount > 0
              ? ((2 * Math.PI * 32) - ((formationsStatsLength / formationCount)) * (2 * Math.PI * 32))
              : (2 * Math.PI * 32)}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="donutGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <span className="text-lg font-black" style={{ color: '#1e1b4b' }}>
            {formationCount > 0 ? ((formationsStatsLength / formationCount) * 100).toFixed(0) : 0}%
          </span>
        </div>
      </div>
      <div className="space-y-3 pr-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(90deg,#6366f1,#ec4899)' }} />
            <span className="text-[9px] font-black text-slate-400 uppercase">Actifs</span>
          </div>
          <span className="text-sm font-black ml-4" style={{ color: '#1e1b4b' }}>{formationsStatsLength}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span className="text-[9px] font-black text-slate-400 uppercase">Total</span>
          </div>
          <span className="text-sm font-black ml-4" style={{ color: '#1e1b4b' }}>{formationCount}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default CourseUsageDonut;