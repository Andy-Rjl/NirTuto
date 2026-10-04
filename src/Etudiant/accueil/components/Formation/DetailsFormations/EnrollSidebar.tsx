import { ShieldCheck, Award } from "lucide-react";
import type { Formation } from "./types";

interface EnrollSidebarProps {
  formation: Pick<Formation, "frais">;
  onEnroll: () => void;
}

export const EnrollSidebar = ({ formation, onEnroll }: EnrollSidebarProps) => (
  <div className="p-8 bg-white text-center rounded-[28px] shadow-sm border border-gray-100 sticky top-6">
    <div className="w-24 h-24 bg-gray-50 rounded-full mx-auto mb-5 flex items-center justify-center">
      <svg width="44" height="44" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#E6F1FB"/>
        <path d="M18 27l6 6 10-12" stroke="#378ADD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="14" r="4" fill="#5DCAA5"/>
        <circle cx="14" cy="16" r="3" fill="#85B7EB"/>
        <circle cx="40" cy="34" r="2.5" fill="#FAC775"/>
      </svg>
    </div>

    <span className="inline-flex items-center gap-1.5 text-[10px] 2xl:text-lg font-medium text-blue-700 bg-blue-50 rounded-full px-3 py-1 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
      Accès complet
    </span>

    <div className="text-3xl font-medium text-[#1D9E75] mb-1">
      {formation.frais ? `${formation.frais.toLocaleString()} Ar` : "Gratuit"}
    </div>
    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-5">Paiement unique</p>

    <hr className="border-gray-100 mb-5" />

    <div className="space-y-3 mb-6 text-left">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <ShieldCheck size={15} className="text-[#1D9E75] shrink-0" /> Accès illimité à vie
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Award size={15} className="text-[#1D9E75] shrink-0" /> Certificat inclus
      </div>
    </div>

    <button
      onClick={onEnroll}
      className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-medium text-xs 2xl:text-lg uppercase tracking-widest transition-colors"
    >
      Rejoindre la formation
    </button>
  </div>
);