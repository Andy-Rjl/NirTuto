import { FaCheckCircle } from "react-icons/fa";
import type { Data, StatutInscription } from "./types";

interface EnrollSidebarProps {
  formation: Data;
  statut: StatutInscription;
  submitting: boolean;
  onInscriptionGratuite: () => void;
  onOpenModal: () => void;
}

export const EnrollSidebar = ({
  formation, statut, submitting,
  onInscriptionGratuite, onOpenModal,
}: EnrollSidebarProps) => (
  <div className="w-full xl:w-[320px] flex-shrink-0">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">

      {/* Prix */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50">
        <div className="flex items-end gap-3 mb-1">
          <span className="text-3xl font-extrabold text-gray-900">
            {formation.type === 'Gratuite' ? 'Gratuit' : `${formation.frais?.toLocaleString()} Ar`}
          </span>
          {formation.type !== 'Gratuite' && (
            <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
              Formation payante
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 font-medium">Accès complet à vie</p>
      </div>

      {/* Récapitulatif */}
      <div className="px-6 py-4 space-y-3 border-b border-gray-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Récapitulatif</p>
        {[
          { label: 'Durée',      value: formation.duree },
          { label: 'Formateur',  value: formation.nom_formateur },
          { label: 'Niveau',     value: formation.difficulte },
          { label: 'Catégorie',  value: formation.categorie },
          { label: 'Type',       value: formation.type },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium">{label}</span>
            <span className="font-bold text-gray-700 text-right max-w-[55%] truncate">{value}</span>
          </div>
        ))}

        {/* Total */}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-wider text-gray-700">Total</span>
          <span className="text-base font-extrabold text-[#5a4fcf]">
            {formation.type === 'Gratuite' ? 'Gratuit' : `${formation.frais?.toLocaleString()} Ar`}
          </span>
        </div>
      </div>

      {/* Bouton inscription */}
      <div className="px-6 py-5">
        {statut === 'confirme' && (
          <button disabled className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl text-sm cursor-not-allowed opacity-90 flex items-center justify-center gap-2">
            <FaCheckCircle /> Déjà inscrit
          </button>
        )}
        {statut === 'en_attente' && (
          <button disabled className="w-full py-3.5 bg-amber-400 text-white font-bold rounded-xl text-sm cursor-not-allowed opacity-90 flex items-center justify-center gap-2">
            <span className="animate-pulse">⏳</span> En attente de validation
          </button>
        )}
        {!statut && (
          <button
            onClick={() => formation.type === 'Gratuite' ? onInscriptionGratuite() : onOpenModal()}
            disabled={submitting}
            className="w-full py-3.5 bg-[#5a4fcf] hover:bg-[#493dbb] text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
          >
            {submitting ? "Inscription en cours..." : "S'inscrire maintenant"}
          </button>
        )}
      </div>
    </div>
  </div>
);