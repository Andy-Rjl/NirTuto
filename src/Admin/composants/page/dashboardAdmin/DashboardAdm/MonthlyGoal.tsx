import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface MonthlyGoalProps {
  etudiantCount: number;
  objectif: number;
}

const MonthlyGoal = ({ etudiantCount, objectif }: MonthlyGoalProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
    className="relative rounded-2xl p-5 overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #ec4899 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
  >
    {/* Decorative circles */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />

    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <Award size={14} className="text-white/70" />
        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Objectif Mensuel</span>
      </div>
      <div className="flex items-end gap-2 mb-1">
        <h4 className="text-5xl font-black text-white tracking-tighter leading-none">{etudiantCount}</h4>
        <span className="text-white/50 font-black text-lg mb-1">/ {objectif}</span>
      </div>
      <p className="text-xs text-white/60 font-medium mb-5">Nouveaux inscrits ce mois</p>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Progression</span>
          <span className="text-[10px] font-black text-white">{Math.min((etudiantCount * 100) / objectif, 100).toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((etudiantCount * 100) / objectif, 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-full bg-white"
            style={{ boxShadow: '0 0 10px rgba(255,255,255,0.6)' }}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default MonthlyGoal;