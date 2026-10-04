import { useState, useEffect, useMemo } from 'react';
import Sidebar from './../../Component/Sidebar';
import { API_URL } from '../../../../lib/api';
import FactureDetail from './FactureDetail';

interface Cours {
  id: number;
  titre: string;
  prix: number;
}

interface FactureType {
  contact: string;
  numero: string;
  date_inscription: string;
  client: string;
  email: string;
  cours: Cours[];
  total: number;
  statut: "Payé" | "En attente";
  methode?: string;
}

const Facture = () => {
  const [isDetailView, setIsDetailView] = useState<boolean>(false);
  const [selectedFacture, setSelectedFacture] = useState<FactureType | null>(null);
  const [listeFactures, setListeFactures] = useState<FactureType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter] = useState<string>("all");
  const [, setEtudiant] = useState({ nom: "Chargement...", email: "..." , contact: "..."});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };

        const [resUser, resFormations, resInscriptions] = await Promise.all([
          fetch(`${API_URL}/user`, { headers }),
          fetch(`${API_URL}/etudiant/mes-formations`, { headers }),
          fetch(`${API_URL}/admin/etudiants-inscrits`, { headers })
        ]);

        const userData = await resUser.json();
        const formationsData = await resFormations.json();
        const inscriptionsData = await resInscriptions.json();

        setEtudiant({
          nom: userData.name || userData.nom || "Étudiant",
          email: userData.email || "non-renseigné",
          contact: userData.contact || "034 00 000 00",
        });

        if (Array.isArray(formationsData)) {
          const facturesTransformees: FactureType[] = formationsData.map((f: any) => {
            const detailBdd = inscriptionsData.data?.find((ins: any) => ins.formation === f.titre);
            return {
              numero: `FAC-2026-${f.id.toString().padStart(3, '0')}`,
              date_inscription: detailBdd
                ? detailBdd.date_inscription
                : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
              client: userData.name || userData.nom || "Étudiant",
              email: userData.email,
              cours: [{ id: f.id, titre: f.titre, prix: f.frais || 0 }],
              total: f.frais || 0,
              contact: userData.contact,
              statut: "Payé",
              methode: "Mobile Money"
            };
          });
          setListeFactures(facturesTransformees);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const totalPaid = listeFactures
    .filter(f => f.statut === "Payé")
    .reduce((sum, f) => sum + f.total, 0);

  const filteredInvoices = useMemo(() => {
    return listeFactures.filter(inv => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "paid") return inv.statut === "Payé";
      if (selectedFilter === "pending") return inv.statut === "En attente";
      return true;
    });
  }, [listeFactures, selectedFilter]);

  const openFacture = (facture: FactureType): void => {
    setSelectedFacture(facture);
    setIsDetailView(true);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 lg:ml-64 flex flex-col overflow-y-auto min-w-0 dark:bg-slate-900">

        {/* HEADER */}
        <header className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 sticky top-0 z-20 gap-3 shadow-sm pt-16 lg:pt-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {isDetailView ? "Détails du document" : "Factures & Paiements"}
            </h1>
            {!isDetailView && (
              <p className="text-slate-500 text-xs md:text-sm">Espace de gestion financière</p>
            )}
          </div>
        </header>

        {/* CONTENU */}
        <main className="p-4 md:p-6 lg:p-8">

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              <p className="text-slate-400 text-sm font-medium animate-pulse">Chargement...</p>
            </div>

          ) : !isDetailView ? (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 sm:mb-8">

                <div className="p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-300 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payé</p>
                      <p className="text-xl md:text-2xl font-black text-slate-800 truncate">{totalPaid.toLocaleString()} AR</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-300 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</p>
                      <p className="text-xl md:text-2xl font-black text-slate-800">{listeFactures.length} Payé</p>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-300 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documents</p>
                      <p className="text-2xl font-black text-slate-800">{listeFactures.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLEAU / CARTES */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">

                {/* Tableau — desktop uniquement */}
                <div className="hidden lg:block overflow-x-auto dark:bg-slate-800">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                      <tr>
                        {["N° Facture", "Date", "Description", "Montant", "Statut", "Paiement", "Action"].map(h => (
                          <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {filteredInvoices.map((f, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{f.numero}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{f.date_inscription}</td>
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-sm max-w-[200px] truncate">{f.cours[0].titre}</td>
                          <td className="px-6 py-4 font-black text-slate-900 dark:text-slate-100 text-sm">{f.total.toLocaleString()} AR</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              f.statut === "Payé"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                            }`}>{f.statut}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-medium">{f.methode}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openFacture(f)}
                              className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cartes — mobile & tablette */}
                <div className="lg:hidden divide-y divide-slate-100">
                  {filteredInvoices.length === 0 ? (
                    <p className="text-center text-slate-400 py-12 text-sm font-medium">Aucune facture.</p>
                  ) : (
                    filteredInvoices.map((f, index) => (
                      <div key={index} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate">{f.cours[0].titre}</p>
                            <p className="font-mono text-[10px] text-slate-400 font-bold mt-0.5">{f.numero}</p>
                          </div>
                          <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            f.statut === "Payé"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}>{f.statut}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-xs text-slate-500">{f.date_inscription}</p>
                            <p className="text-xs text-slate-400 font-medium">{f.methode}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-black text-slate-900 text-base">{f.total.toLocaleString()} AR</p>
                            <button
                              onClick={() => openFacture(f)}
                              className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                            >
                              Détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>

          ) : (
            /* VUE DÉTAIL — rendu par FactureDetail dans le main */
            selectedFacture && (
              <FactureDetail
                selectedFacture={selectedFacture}
                onBack={() => setIsDetailView(false)}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Facture;