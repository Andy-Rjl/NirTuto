import { Star, ArrowLeft, BookOpen, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { API_URL } from '../../../../lib/api';
import bg from '../../../assets/images/feedbacks.jpg';

interface EvaluationProps {
  setShowEvaluation: (v: boolean) => void;
  rating: number;
  setRating: (r: number) => void;
  filteredInscriptions: any[];
}

/* ─────────────────────────────────────────
   Composant : Toast notification succès
───────────────────────────────────────── */
const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <>
    <div
      className="fixed top-5 right-5 z-[300] flex items-center gap-3 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3.5"
      style={{
        minWidth: 280,
        maxWidth: 360,
        animation: 'toastIn 0.4s cubic-bezier(.34,1.56,.64,1) both',
      }}
    >
      {/* Icône verte */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-xl"
        style={{
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        }}
      >
        <CheckCircle size={20} color="#059669" strokeWidth={2.5} />
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 leading-tight">Succès</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{message}</p>
      </div>

      {/* Bouton fermeture */}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors rounded-full"
        aria-label="Fermer"
      >
        <X size={14} />
      </button>
    </div>

    <style>{`
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(60px) scale(0.95); }
        to   { opacity: 1; transform: translateX(0)    scale(1); }
      }
    `}</style>
  </>
);

/* ─────────────────────────────────────────
   Composant principal : Evaluation
───────────────────────────────────────── */
const Evaluation = ({ setShowEvaluation, rating, setRating, filteredInscriptions }: EvaluationProps) => {
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 4000);
  };

  const handleSelectFormation = (f: any) => {
    setSelectedFormation(f);
    setRating(0);
  };

  const handleBack = () => {
    if (selectedFormation) {
      setSelectedFormation(null);
      setRating(0);
    } else {
      setShowEvaluation(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const nomComplet = `${user.prenom || ''} ${user.nom || ''}`.trim();

  const [nom, setNom] = useState(nomComplet);
  const [email, setEmail] = useState(user.email || '');
  const [commentaire, setCommentaire] = useState('');

  const handleSubmit = async () => {
    if (!nom || !email) return showToast('Nom et email requis');
    if (!rating && !commentaire) return showToast('Ajoutez au moins une note ou un commentaire');

    const res = await fetch(`${API_URL}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formation_id: selectedFormation.id,
        nom,
        email,
        note: rating || null,
        commentaire: commentaire || null,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast(data.message || 'Votre évaluation a bien été soumise !');
      setTimeout(() => setShowEvaluation(false), 1800);
    } else {
      showToast(data.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto px-2">

      {/* Toast */}
      {toast.visible && (
        <SuccessToast
          message={toast.message}
          onClose={() => setToast({ visible: false, message: '' })}
        />
      )}

      <button
        onClick={handleBack}
        className="mb-5 flex items-center gap-2 text-indigo-600 font-bold hover:underline text-sm"
      >
        <ArrowLeft size={18} />
        {selectedFormation ? 'Changer de formation' : 'Retour'}
      </button>

      {/* Bannière communauté */}
      <div className="p-6 flex flex-col items-center gap-2 mb-6">
        <div
          className="relative w-full min-h-[300px] rounded-xl flex flex-col items-center justify-center space-y-6 overflow-hidden shadow-inner"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 text-center p-6">
            <p className="text-black mt-2 font-medium drop-shadow-sm">
              Découvrez les expériences de notre communauté
            </p>
          </div>
        </div>
      </div>

      {/* ÉTAPE 1 — Choisir une formation */}
      {!selectedFormation ? (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Choisissez une formation à évaluer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredInscriptions.map((f: any) => (
              <button
                key={f.id}
                onClick={() => handleSelectFormation(f)}
                className="group p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-amber-300 hover:shadow-md text-left transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-400 text-white rounded-xl shadow-md flex-shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{f.titre}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{f.categorie || f.nom_formateur || 'Expert'}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className="text-amber-300 fill-amber-300 group-hover:text-amber-400 group-hover:fill-amber-400 transition-colors"
                    />
                  ))}
                </div>
                <span className="mt-3 inline-block text-xs font-bold text-amber-500 group-hover:underline">
                  Évaluer cette formation →
                </span>
              </button>
            ))}
          </div>
        </div>

      ) : (

        /* ÉTAPE 2 — Formulaire d'avis */
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <div className="p-2 bg-emerald-400 text-white rounded-xl flex-shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Formation sélectionnée</p>
              <p className="text-sm font-black text-slate-800 truncate">{selectedFormation.titre}</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-800">Ajouter un avis</h2>

          {/* Étoiles */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Votre note <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={30}
                  onClick={() => setRating(s)}
                  className={`cursor-pointer transition-all duration-150 ${
                    rating >= s
                      ? 'text-amber-400 fill-amber-400 scale-110'
                      : 'text-slate-300 hover:text-amber-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Nom */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="RAKOTO Randria"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="randriaRakoto@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Commentaire */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Votre avis <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Écrivez ici..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Bouton */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-amber-200 hover:shadow-lg text-sm tracking-wide"
          >
            Soumettre
          </button>
        </div>
      )}
    </div>
  );
};

export default Evaluation;