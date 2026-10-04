import { Search, BookOpen, PlayCircle, Trophy, Clock, Check, GraduationCap, Sparkles, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ListeCoursEtudProps {
  user: any;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredInscriptions: any[];
  formationsEnAttente: any[];
  connectedDays: number[];
  setShowQcm: (v: boolean) => void;
  setShowEvaluation: (v: boolean) => void;
  onOpenPaymentModal: (formation: any) => void;
}

const ListeCoursEtud = ({
  user, loading, searchQuery, setSearchQuery, formationsEnAttente = [],
  filteredInscriptions = [], connectedDays, setShowQcm, setShowEvaluation,onOpenPaymentModal
}: ListeCoursEtudProps) => {
  const navigate = useNavigate();
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const isWeekComplete = connectedDays.length === 7;

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        
      .replace(/[^\w\-]+/g, '')    
      .replace(/\-\-+/g, '-');     
  };

  return (
    <div className="space-y-5 px-1 bg-white min-h-screen p-6">

      {/* Bannière de salutation */}
      <section className="relative overflow-hidden bg-blue-100 border border-slate-200 shadow-sm p-6 flex items-center justify-between gap-4">
        <div className="pl-4">
          <h2 className="text-2xl font-bold text-slate-800 leading-tight">
            Bonjour, {user?.nom} {user?.prenom} !
          </h2>
          <p className="text-black text-sm mt-1">
            Prête à continuer ton apprentissage aujourd'hui ?
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={28} className="text-indigo-600" />
        </div>
      </section>

      {/* Progressions */}
      <section>
        <h2 className="text-xs font-semibold mb-3 text-slate-500 uppercase tracking-widest">Mes Progressions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Défi révision */}
          <div className="bg-pink-50 border border-pink-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="2xl:text-[10px] text-[7px] font-semibold text-pink-400 uppercase tracking-widest mb-0.5">Challenge</p>
                <h3 className="font-bold text-slate-800 2xl:text-sm text-xs">Défi Révision</h3>
              </div>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover bg-pink-100"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                  alt="user"
                />
              ))}
              <span className="pl-3 text-[11px] text-slate-400 self-center">3 actifs</span>
            </div>
            <button
              onClick={() => setShowQcm(true)}
              className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
            >
              Lancer un QCM
            </button>
          </div>

          {/* Assiduité */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="2xl:text-[10px] text-[7px] font-semibold text-indigo-400 uppercase tracking-widest mb-0.5">Cette semaine</p>
                <h3 className="font-bold text-slate-800 2xl:text-sm text-xs">Assiduité</h3>
              </div>
              <Clock size={15} className="text-indigo-300" />
            </div>
            <div className="flex justify-between items-end">
              {days.map((d, i) => {
                const isGreen = connectedDays.includes(i);
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`2xl:w-8 2xl:h-8 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
                      ${isGreen
                        ? 'bg-indigo-600 shadow-sm'
                        : 'bg-white border border-indigo-200'}`}>
                      {isGreen
                        ? <Check size={11} strokeWidth={3} className="text-white" />
                        : <span className="text-[7px] 2xl:text-[12px] font-bold text-indigo-300">{d}</span>
                      }
                    </div>
                    <span className={`text-[7px] 2xl:text-[12px] font-bold ${isGreen ? 'text-indigo-600' : 'text-indigo-300'}`}>{d}</span>
                  </div>
                );
              })}
            </div>
            {isWeekComplete ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-100">
                <Sparkles size={12} className="text-green-500 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-green-600">Parfait ! Semaine complète 🔥</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-indigo-100">
                <Trophy size={12} className="text-amber-400 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-slate-500">Continue comme ça !</span>
              </div>
            )}
          </div>

          {/* Évaluation */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl shadow-sm p-5 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              💡
            </div>
            <div>
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-0.5">Auto-évaluation</p>
              <h3 className="font-bold text-slate-800 text-sm">Avez-vous compris ?</h3>
            </div>
            <button
              onClick={() => setShowEvaluation(true)}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
            >
              Évaluer le module
            </button>
          </div>
        </div>
      </section>

      {/* Continuer mes formations */}
      <section className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Formations suivies</h2>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_160px_250px] px-5 py-2.5 bg-slate-50 border-b border-slate-100">
          {['Formation', 'Formateur', 'Action'].map(h => (
            <span key={h} className="text-[10px] text-left font-semibold text-slate-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        <div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-14 rounded-xl animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : (() => {
            const q = searchQuery.toLowerCase().trim();
            const filteredEnAttente = searchQuery.trim()
              ? formationsEnAttente.filter(f =>
                  f.titre?.toLowerCase().includes(q) ||
                  f.nom_formateur?.toLowerCase().includes(q) ||
                  f.categorie?.toLowerCase().includes(q)
                )
              : formationsEnAttente;

            const totalItems = [...filteredInscriptions, ...filteredEnAttente];

            if (totalItems.length === 0) {
              return (
                <div className="flex flex-col items-center py-14 gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Search size={22} className="text-slate-400" />
                  </div>
                  <p className="text-center text-slate-400 text-sm leading-relaxed">
                    Aucune formation trouvée pour{' '}
                    <span className="font-semibold text-slate-500">"{searchQuery}"</span>
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors px-4 py-2 bg-indigo-50 rounded-lg"
                  >
                    Effacer la recherche
                  </button>
                </div>
              );
            }

            return (
              <>
                {/* RENDU 1 : Les formations confirmées */}
                {filteredInscriptions.map((item, idx) => {
                  const isLast = idx === filteredInscriptions.length - 1 && filteredEnAttente.length === 0;
                  return (
                    <div
                      key={`confirmed-${item.id}`}
                      className={`grid grid-cols-1 sm:grid-cols-[1fr_160px_250px] items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors duration-150
                        ${!isLast ? 'border-b border-slate-100' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                          <BookOpen size={16} className="text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-700 text-sm truncate leading-snug">{item.titre}</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium sm:hidden">{item.nom_formateur || 'Expert'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-medium hidden sm:block">{item.nom_formateur || 'Expert'}</p>
                      
                      <button
                        onClick={() => navigate(`/cour/${item.slug || slugify(item.titre)}`, { state: { id: item.id } })}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 w-full sm:w-auto border border-slate-200 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-sm"
                      >
                        <PlayCircle size={14} /> Commencez les cours
                      </button>
                    </div>
                  );
                })}

                {/* RENDU 2 : Les formations en attente */}
                {filteredEnAttente.map((item, idx) => {
                  const isLast = idx === filteredEnAttente.length - 1;
                  const pivot = item.pivot || {};
                  // Vérification si les informations de paiement sont manquantes/nulles
                  console.log("Structure d'une formation en attente :", item);
                  const isPaymentMissing = 
                    !item.methode?.trim() && 
                    !item.reference_transaction?.trim() && 
                    !item.numero_paiement?.trim();

                  return (
                    <div
                      key={`pending-${item.id}`}
                      className={`grid grid-cols-1 sm:grid-cols-[1fr_160px_250px] items-center gap-3 px-5 py-4 bg-slate-50/30 hover:bg-slate-50 transition-colors duration-150
                        ${!isLast ? 'border-b border-slate-100' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
                          <BookOpen size={16} className="text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-600 text-sm truncate leading-snug">{item.titre}</h3>
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">En attente</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium sm:hidden text-left">{item.nom_formateur || 'Expert'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-medium hidden sm:block">{item.nom_formateur || 'Expert'}</p>
                      
                      {/* Conteneur pour gérer un ou plusieurs boutons d'action */}
                      <div className="flex gap-2 w-full">
                        {isPaymentMissing && (
                          <button
                            onClick={() => onOpenPaymentModal(item)} // Redirection vers ton processus de paiement
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-sm"
                          >
                            <CreditCard size={14} /> Payer
                          </button>
                        )}
                        <button
                          disabled
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed shadow-none flex-1 sm:flex-initial"
                        >
                          <PlayCircle size={14} /> En attente
                        </button>
                      </div>

                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>
      </section>

    </div>
  );
};

export default ListeCoursEtud;