import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../lib/api';

/* Types */
interface RightSidebarProps {
  user: any;
  inscriptions: any[];
  recommandations: any[];
}

/* Mini Calendar  */
const MiniCalendar = () => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString('fr-FR', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells = Array.from({ length: offset + daysInMonth }, (_, i) =>
    i < offset ? null : i - offset + 1
  );

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="select-none">
      {/* Header mois */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={14} className="text-slate-500" />
        </button>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">
          {monthName} {year}
        </span>
        <button
          onClick={next}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronRight size={14} className="text-slate-500" />
        </button>
      </div>

      {/* Entêtes jours */}
      <div className="grid grid-cols-7 mb-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Cellules jours */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d ? (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors cursor-default
                  ${isToday(d)
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700'
                  }`}
              >
                {d}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

/* RightSidebar */
const RightSidebar = ({ user, inscriptions, recommandations }: RightSidebarProps) => {
  const navigate = useNavigate();

  const uniqueFormateurs = [...new Map(inscriptions.map(i => [i.nom_formateur, i])).values()];

  return (
    <aside className="hidden xl:flex flex-col w-[300px] 2xl:w-[320px] flex-shrink-0 bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 p-5 gap-5 overflow-y-auto">

      {/* Profil */}
      <div className="flex flex-col items-center gap-3 p-5 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-2xl border border-indigo-50 dark:border-slate-700">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden shadow-md">
          {user?.photo ? (
            <img
              src={`${API_URL.replace('/api', '')}/${user.photo}`}
              alt={user?.nom}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={28} className="text-indigo-500" />
          )}
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">
            {user?.nom || 'Étudiant'} {user?.prenom}
          </p>
          <p className="text-xs text-indigo-500 font-semibold mt-0.5">Étudiant</p>
        </div>
       
      </div>

      {/* Calendrier */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Calendrier</h3>
        <MiniCalendar />
      </div>  

      {/* Séparateur */}
      <div className="h-px bg-slate-100 dark:bg-slate-700" />

      {/* Mes Formateurs */}
      <div className="bg-[#D8C9F3] dark:bg-indigo-900/40 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800 shadow-sm">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-300 mb-3">Mes Formateurs</h3>
        <div className="space-y-2.5">
          {uniqueFormateurs.map((f: any) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-2 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-all cursor-default"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex-shrink-0 overflow-hidden border-2 border-white/50 shadow-sm">
                <img
                  src={`${API_URL.replace('/api', '')}/${f.photo_formateur}`}
                  alt={f.nom_formateur?.charAt(0)}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{f.nom_formateur}</p>
                <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-tighter truncate">
                  {f.categorie}
                </p>
              </div>
            </div>
          ))}
          {inscriptions.length === 0 && (
            <p className="text-xs text-indigo-400 text-center py-2">Aucun formateur pour l'instant</p>
          )}
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-indigo-50 dark:border-slate-700 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Star size={14} className="text-yellow-500 fill-yellow-500" /> Recommandations
        </h3>
        <div className="space-y-2">
          {recommandations.slice(0, 3).map((f: any) => (
            <div
              key={f.id}
              onClick={() => navigate(`/detailformation/${f.id}`)}
              className="p-3 border border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-100 cursor-pointer transition-all"
            >
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-snug text-left">{f.titre}</h4>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase text-left">{f.categorie}</span>
                <span className="text-indigo-600 text-[9px] font-bold text-left">Voir →</span>
              </div>
            </div>
          ))}
          {recommandations.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">Aucune recommandation</p>
          )}
        </div>
      </div>

    </aside>
  );
};

export default RightSidebar;