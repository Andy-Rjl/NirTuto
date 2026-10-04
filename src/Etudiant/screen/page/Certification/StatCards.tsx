import { BookOpen, CheckCircle, Trophy } from 'lucide-react';

interface StatCardsProps {
  inscriptionsLength: number;
  qcmScoresLength: number;
  certificatsLength: number;
}

export const StatCards = ({ inscriptionsLength, qcmScoresLength, certificatsLength }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formations</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{inscriptionsLength}</p>
        </div>
        <div className="text-indigo-500 bg-indigo-50 p-2.5">
          <BookOpen size={20} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Validés</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{qcmScoresLength}</p>
        </div>
        <div className="text-emerald-500 bg-emerald-50 p-2.5">
          <CheckCircle size={20} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certifications</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{certificatsLength}</p>
        </div>
        <div className="text-amber-500 bg-amber-50 p-2.5">
          <Trophy size={20} />
        </div>
      </div>
    </div>
  );
};