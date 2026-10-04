import React from 'react';
import { Send, Lock } from 'lucide-react';

interface CertificatFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  inscriptions: any[];
  progressions: Record<number, number>;
  formationSelectionnee: any;
  progressionFormation: number | null;
  aPasseQcm: boolean;
  moyenneQcm: number | null;
  aMoyenneSuffisante: boolean;
  peutDemanderCertif: boolean;
  messageBlockage: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  // Nouvelle prop optionnelle pour indiquer si la formation est déjà validée/certifiée
  dejaValidee?: boolean; 
}

export const CertificatForm = ({
  formData,
  setFormData,
  inscriptions,
  progressions,
  formationSelectionnee,
  progressionFormation,
  aPasseQcm,
  moyenneQcm,
  aMoyenneSuffisante,
  peutDemanderCertif,
  messageBlockage,
  handleSubmit,
  dejaValidee = false, // Par défaut à faux si non renseigné
}: CertificatFormProps) => {
  const inputClass =
    "w-full px-4 py-3 bg-white border border-slate-200 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:ring-0 rounded-none";

  // Le bouton est actif UNIQUEMENT si l'utilisateur peut demander ET que la formation n'est pas déjà validée
  const estBoutonActif = peutDemanderCertif && !dejaValidee;

  // Détermination du message à afficher en cas de blocage
  const texteBlocage = dejaValidee 
    ? "Formation déjà certifiée" 
    : (messageBlockage || "Formulaire Bloqué");

  return (
    <div className="p-6 sm:p-8 md:p-10 lg:p-12">
      <h3 className="text-2xl font-medium text-slate-800 mb-8 tracking-tight">
        Remplir ce formulaire pour votre demande de certification
      </h3>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <select
            className={`${inputClass} appearance-none cursor-pointer pr-10`}
            value={formData.formation}
            onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
          >
            <option value="" disabled>Choisir une formation</option>
            {inscriptions.length > 0 ? (
              inscriptions.map((item: any) => {
                const pct = progressions[item.id] ?? null;
                const label = pct === null ? item.titre : `${item.titre} — ${pct}%`;
                return <option key={item.titre} value={item.titre}>{label}</option>;
              })
            ) : (
              <option disabled>Aucune formation disponible</option>
            )}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required type="text" placeholder="Nom"
            className={inputClass}
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          />
          <input
            required type="text" placeholder="Prénom"
            className={inputClass}
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required type="date"
            className={`${inputClass} text-slate-400`}
            value={formData.date_Naissance}
            onChange={(e) => setFormData({ ...formData, date_Naissance: e.target.value })}
          />
          <input
            required type="text" placeholder="Lieu de Naissance"
            className={inputClass}
            value={formData.lieu_Naissance}
            onChange={(e) => setFormData({ ...formData, lieu_Naissance: e.target.value })}
          />
        </div>

        {formationSelectionnee && progressionFormation !== null && (
          <div className="bg-slate-50 border border-slate-100 p-4 space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-500 mb-1">
                <span>Progression cours</span>
                <span className={progressionFormation === 100 ? "text-emerald-500 font-bold" : "text-orange-500"}>
                  {progressionFormation}%
                </span>
              </div>
              <div className="h-1 w-full bg-slate-200">
                <div className="h-full bg-slate-400 transition-all duration-500" style={{ width: `${progressionFormation}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-500 mb-1">
                <span>Moyenne QCM</span>
                <span className={aMoyenneSuffisante ? "text-emerald-500 font-bold" : "text-red-500"}>
                  {!aPasseQcm ? "—" : `${moyenneQcm}%`}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-200">
                <div className="h-full bg-slate-400 transition-all duration-500" style={{ width: aPasseQcm ? `${moyenneQcm}%` : "0%" }} />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="confirm"
            required
            className="w-4 h-4 rounded-none accent-emerald-500 border-slate-300"
          />
          <label htmlFor="confirm" className="text-xs text-slate-500 cursor-pointer select-none">
            Je confirme l'exactitude des informations saisies
          </label>
        </div>

        <button
          type="submit"
          disabled={!estBoutonActif}
          title={dejaValidee ? "Vous avez déjà obtenu cette certification" : (messageBlockage ?? "")}
          className={`w-full py-3.5 font-medium text-sm transition-all text-white tracking-wide rounded-xs ${
            estBoutonActif
              ? "bg-[#10b981] hover:bg-[#0ea5e9] cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {estBoutonActif ? (
            <span className="flex items-center justify-center gap-2">
               <Send size={18}/>Demander
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Lock size={13} /> {texteBlocage}
            </span>
          )}
        </button>
      </form>
    </div>
  );
};