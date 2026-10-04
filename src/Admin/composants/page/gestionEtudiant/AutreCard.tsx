import { useMemo } from "react";
import { Bell, ArrowUpRight, Users, BookOpen, CalendarCheck } from "lucide-react";
import { API_URL } from "./../../../lib/api";

interface AutreCardProps {
  uniqueEtudiants: any[];
  demandes: any[];
  demande: any;
  filteredEtudiants: any[];
  formation: number;
  etudiants: any[];
}

const statCards = [
  {
    label: "Étudiants Actifs",
    icon: Users,
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    valueColor: "text-indigo-700",
    key: "actifs",
  },
  {
    label: "Formations",
    icon: BookOpen,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    valueColor: "text-emerald-700",
    key: "formations",
  },
  {
    label: "Sessions",
    icon: CalendarCheck,
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    border: "border-orange-100",
    valueColor: "text-orange-700",
    key: "sessions",
  },
];

const AutreCard = ({
  uniqueEtudiants,
  demandes,
  filteredEtudiants,
  formation,
  etudiants,
}: AutreCardProps) => {
  
  // ── AJOUT DU FILTRAGE DES INSCRIPTIONS ──
  const demandesValides = useMemo(() => {
    if (!Array.isArray(demandes)) return [];
    return demandes.filter(
      (d) => d.reference_transaction && d.numero_paiement && d.methode
    );
  }, [demandes]);

  const statValues: Record<string, number> = {
    actifs: filteredEtudiants.length,
    formations: formation,
    sessions: etudiants.length,
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* 3 Stat cards */}
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`${card.bg} border ${card.border} rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group cursor-default`}
            >
              <div className={`${card.iconBg} rounded-xl p-2.5 group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={card.iconColor} />
              </div>
              <div>
                <p className={`text-2xl font-black ${card.valueColor} leading-none`}>
                  {statValues[card.key]}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}

        {/* Card Récents */}
        <div className="bg-white border border-slate-100 rounded-2xl px-4 pt-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight size={13} className="text-indigo-400" /> Récents
            </h3>
            <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              {uniqueEtudiants.length}
            </span>
          </div>
          <div className="space-y-1">
            {uniqueEtudiants.length > 0 ? (
              uniqueEtudiants.slice(0, 2).map((user) => (
                <div key={user.id} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-black text-indigo-600 shrink-0 overflow-hidden">
                    {user.photo ? (
                      <img src={`${API_URL.replace("/api", "")}/${user.photo}`} alt={user.nom.charAt(0)} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.nom.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 truncate">{user.nom}</span>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">Aucun étudiant.</span>
            )}
          </div>
        </div>

        {/* Card Alertes */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Bell size={13} className="text-orange-400" /> Alertes
            </h3>
            {demandesValides.length > 0 && (
              <span className="text-[9px] font-black text-white bg-red-400 px-2 py-0.5 rounded-full">
                {demandesValides.length}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {demandesValides.length > 0 ? (
              <div className="flex items-start gap-2 p-2.5 bg-orange-50 border border-orange-100 rounded-xl">
                <Bell className="text-orange-400 mt-0.5 shrink-0" size={12} />
                <p className="text-[10px] font-bold text-orange-700 leading-snug">
                  {demandesValides.length} inscription{demandesValides.length > 1 ? "s" : ""} en attente
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-[10px] font-bold text-emerald-600">Tout est à jour</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AutreCard;