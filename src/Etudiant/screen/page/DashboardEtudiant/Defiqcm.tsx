import { FileText, ArrowLeft } from 'lucide-react';

interface DefiQcmProps {
  filteredInscriptions: any[];
  loading: boolean;
  selectedFormation: any;
  setSelectedFormation: (f: any) => void;
  selectedCours: any;
  setSelectedCours: (c: any) => void;
  selectedQcm: any;
  setSelectedQcm: (q: any) => void;
  userAnswers: any;
  setUserAnswers: (a: any) => void;
  formation: any;
  setFormation: (f: any) => void;
  fetchFormationDetails: (id: number) => void;
  closeQcmMode: () => void;
  isSubmitted: boolean;
  setIsSubmitted: (v: boolean) => void;
  score: number;
  isLoading: boolean;
  scores: any[];
  handleSubmit: () => void;
}

const DefiQcm = ({
  filteredInscriptions, loading, selectedFormation, setSelectedFormation,
  selectedCours, setSelectedCours, selectedQcm, setSelectedQcm,
  userAnswers, setUserAnswers, formation, setFormation,
  fetchFormationDetails, closeQcmMode, isSubmitted, setIsSubmitted,
  score, isLoading, handleSubmit,
}: DefiQcmProps) => {

  const prefixeLettres = ["a", "b", "c", "d", "e", "f"];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-slate-700 bg-[#f4f7f6] p-4 sm:p-8 rounded-3xl min-h-[85vh]">
      
      {/* Fil d'ariane / Retour style Braive LMS */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#00bcd4] mb-6">
        <button onClick={closeQcmMode} className="flex items-center gap-1 hover:underline">
          <ArrowLeft size={14} /> Tableau de bord
        </button>
        {selectedFormation && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400 truncate max-w-[150px]">{selectedFormation.titre}</span>
          </>
        )}
        {selectedQcm && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 truncate max-w-[150px]">{selectedQcm.titre}</span>
          </>
        )}
      </div>

      {/* ── ÉTAPE 1 : CHOIX DE LA FORMATION ── */}
      {!selectedFormation && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Choisissez une formation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredInscriptions.map((f: any) => (
              <button
                key={f.id}
                onClick={() => { setSelectedFormation(f); fetchFormationDetails(f.id); }}
                className="p-5 bg-[#f4f7f6]/50 rounded-xl text-left border border-slate-200 hover:border-[#00bcd4] hover:bg-white transition-all group"
              >
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#00bcd4] transition-colors">{f.titre}</h3>
                <p className="text-xs text-slate-400 mt-1">{f.categorie}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ÉTAPE 2 : LISTE DES COURS ── */}
      {selectedFormation && !selectedQcm && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <button
            onClick={() => { setSelectedFormation(null); setFormation(null); }}
            className="text-[#00bcd4] font-bold text-xs hover:underline"
          >
            ← Changer de formation
          </button>
          {loading ? (
            <div className="flex justify-center py-10 text-sm text-slate-400 animate-pulse">Chargement des cours...</div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 border-b pb-3 border-slate-100">Cours de : {selectedFormation.titre}</h2>
              <div className="grid gap-4">
                {formation?.cours?.map((cours: any) =>
                  cours.qcm && cours.qcm.length > 0 && (
                    <div key={cours.id} className="p-4 bg-[#f4f7f6]/30 rounded-xl border border-slate-100">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{cours.titre}</h3>
                      <div className="space-y-2">
                        {cours.qcm.map((q: any) => (
                          <div
                            key={q.id}
                            onClick={() => { setSelectedQcm(q); setSelectedCours(cours); }}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00bcd4] cursor-pointer transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="text-[#00bcd4]" size={16} />
                              <span className="font-bold text-sm text-slate-700 group-hover:text-[#00bcd4] transition-colors">{q.titre}</span>
                            </div>
                            <span className="text-xs font-bold text-[#00bcd4] opacity-0 group-hover:opacity-100 transition-opacity">Démarrer →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── ÉTAPE 3 : EVALUATION / INTERFACE BRAIVE LMS ── */}
      {selectedQcm && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          
          {/* Titre du Questionnaire Principal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <button
                onClick={() => setSelectedQcm(null)}
                className="text-xs font-bold text-slate-400 hover:text-[#00bcd4] mb-1 block transition-colors"
              >
                ← Retour aux cours
              </button>
              <h1 className="text-2xl font-bold text-slate-800">{selectedQcm.titre} : Évaluation</h1>
            </div>
          </div>

          {!isSubmitted ? (
            <>
              {/* Zone principale des questions */}
              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
                {selectedQcm.questions?.map((q: any, idx: number) => (
                  <div key={q.id} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm space-y-5">
                    
                    {/* En-tête de question style Braive */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400">Question {idx + 1} sur {selectedQcm.questions.length}</p>
                        <h4 className="text-base font-medium text-slate-800 leading-snug">{q.enonce}</h4>
                      </div>
                      
                      {/* Bouton secondaire d'état simulé */}
                      <div className="shrink-0">
                        <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 bg-[#f4f7f6] text-slate-500 rounded-full">
                          {userAnswers[q.id] !== undefined ? "Coché" : "À répondre"}
                        </span>
                      </div>
                    </div>

                    {/* Consigne Braive LMS */}
                    <div className="bg-[#00bcd4]/10 text-[#0097a7] text-xs font-medium px-4 py-2.5 rounded-lg">
                      Choisissez une option qui correspond le mieux à votre réponse.
                    </div>

                    {/* Liste des options style Braive (Boutons radio circulaires colorés) */}
                    <div className="divide-y divide-slate-100 pt-2">
                      {q.options?.map((opt: any, opIdx: number) => {
                        const estSelectionne = userAnswers[q.id] === opt.id;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: opt.id })}
                            className="w-full flex items-center gap-4 py-3.5 text-left text-sm transition-colors group first:pt-0 last:pb-0"
                          >
                            {/* Cercle de la lettre (Rose fuchsia si sélectionné, gris si vide) */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border transition-all ${
                              estSelectionne
                                ? "bg-[#f50057] border-[#f50057] text-white shadow-sm ring-2 ring-[#f50057]/20"
                                : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-400"
                            }`}>
                              {prefixeLettres[opIdx] || opIdx + 1}
                            </div>

                            {/* Texte de l'option */}
                            <span className={`text-sm font-medium transition-colors ${
                              estSelectionne ? "text-[#f50057] font-bold" : "text-slate-600 group-hover:text-slate-900"
                            }`}>
                              {opt.texte}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>

              {/* Bouton de soumission général en bas de page */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || Object.keys(userAnswers).length < selectedQcm.questions.length}
                  className="w-full sm:w-auto px-8 py-3 bg-[#00bcd4] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#0097a7] transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Chargement...' : 'Soumettre mes réponses'}
                </button>
              </div>
            </>
          ) : (
            /* ── INTERFACE DES RÉSULTATS FINAUX ── */
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto border border-slate-200 shadow-sm text-center space-y-6 animate-in zoom-in duration-300">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Résultat de l'exercice</p>
                <div className="w-24 h-24 rounded-full border-4 border-[#00bcd4] flex items-center justify-center mx-auto my-4">
                  <span className="text-2xl font-bold text-slate-800">{score}/{selectedQcm.questions.length}</span>
                </div>
              </div>
              
              <div>
                {score === selectedQcm.questions.length ? (
                  <p className="text-sm font-bold text-[#0097a7]">Parfait ! Un sans-faute remarquable. 🏆</p>
                ) : score >= selectedQcm.questions.length / 2 ? (
                  <p className="text-sm font-bold text-slate-700">Félicitations, objectif atteint ! 🎉</p>
                ) : (
                  <p className="text-sm font-bold text-slate-500">Courage, repassez le test pour progresser ! 💪</p>
                )}
              </div>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2.5 bg-[#f4f7f6] text-slate-600 rounded-full text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200"
              >
                Refaire le quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DefiQcm;