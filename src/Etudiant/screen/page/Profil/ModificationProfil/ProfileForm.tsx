import { Lock } from "lucide-react";
import { INPUT_CLASS } from "./types";
import type { FormData } from "./types";

interface ProfileFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  isUpdating: boolean;
  onSave: () => void;
  onOpenPasswordModal: () => void;
}

export const ProfileForm = ({
  formData, setFormData,
  isUpdating, onSave, onOpenPasswordModal,
}: ProfileFormProps) => (
  <div className="flex-[1.8] space-y-5 sm:space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
      <h3 className="text-[11px] sm:text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Informations du compte
      </h3>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {[
        { label: "Nom", key: "nom", type: "text" },
        { label: "Prenom", key: "prenom", type: "text" },
        { label: "Email Professionnel", key: "email", type: "email" },
        { label: "Téléphone / Contact", key: "contact", type: "text" },
      ].map(({ label, key, type }) => (
        <div key={key} className="space-y-1.5 sm:space-y-2">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase ml-2">{label}</label>
          <input
            type={type}
            value={(formData as any)[key]}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
      ))}
    </div>

    {/* Bouton sécurité */}
    <button
      onClick={onOpenPasswordModal}
      className="w-full bg-white border-2 border-slate-100 rounded-3xl px-4 sm:px-6 py-4 sm:py-5 text-[11px] font-black text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all flex items-center justify-between group"
    >
      <span className="tracking-widest uppercase italic">Paramètres de sécurité</span>
      <Lock size={16} className="group-hover:rotate-12 transition-transform flex-shrink-0" />
    </button>

    {/* Bouton sauvegarder */}
    <button
      onClick={onSave}
      disabled={isUpdating}
      className={`w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.96] flex items-center justify-center gap-2 ${
        isUpdating
          ? "bg-slate-400 cursor-not-allowed text-white"
          : "bg-indigo-600 hover:bg-[#1A234E] text-white hover:shadow-2xl hover:shadow-indigo-500/30"
      }`}
    >
      {isUpdating ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Traitement...
        </>
      ) : "Enregistrer les modifications"}
    </button>
  </div>
);