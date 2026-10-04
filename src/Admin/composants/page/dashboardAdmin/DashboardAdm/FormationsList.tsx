import { motion } from 'framer-motion';
import { Sparkles, Users } from 'lucide-react';
import { F_PALETTE, type FormationStats } from './types';

interface FormationsListProps {
  formationsStats: FormationStats[];
}

const FormationsList = ({ formationsStats }: FormationsListProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.35 }}
    className="rounded-2xl overflow-hidden bg-white"
    style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}
  >
    {/* Header principal */}
    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#eef2ff,#fdf2f8)' }}>
          <Sparkles size={15} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-800">Nos Formations</h3>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {formationsStats.length} formation{formationsStats.length > 1 ? 's' : ''} active{formationsStats.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>

    {/* Grille de cartes */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 p-5 bg-[#f8fafc]">
      {formationsStats.map((f, idx) => {
        const p = F_PALETTE[idx % F_PALETTE.length];
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.06 }}
            className="group relative rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            
            {/* En-tête de la carte : Icône et Titres */}
            <div className="flex items-start gap-3.5 mb-5">
              {/* Conteneur de l'icône basé sur votre palette */}
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${p.bar}15` }}
              >
                <Users size={18} style={{ color: p.bar }} />
              </div>
              
              <div className="pr-4">
                {/* Badge d'équipe */}
                <span 
                  className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1"
                  style={{ background: `${p.bar}10`, color: p.bar }}
                >
                  Formation Team
                </span>
                {/* Titre de la formation */}
                <h4 className="text-xs font-bold leading-snug text-slate-800 line-clamp-2">
                  {f.nom}
                </h4>
              </div>
            </div>

            {/* Section Étudiants Inscrits (remplace l'ancienne section des dates) */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mb-5">
              <span>Étudiants inscrits :</span>
              <span className="text-slate-700 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                {f.nbEtudiants}
              </span>
            </div>

            {/* Section de Progression et sa Barre */}
            <div className="space-y-2 pt-3 border-t border-slate-50">
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} 
                  animate={{ width: `${f.progression}%` }}
                  transition={{ duration: 0.9, delay: 0.4 + idx * 0.06 }}
                  className="h-full rounded-full"
                  style={{ background: p.bar }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-medium">Progression</span>
                <span className="font-bold text-slate-700">
                  {f.progression}% complété
                </span>
              </div>
            </div>

          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

export default FormationsList;