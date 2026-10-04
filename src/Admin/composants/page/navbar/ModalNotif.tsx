import { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { API_URL } from '../../../lib/api';

interface UserDemande {
  id: number;
  nom: string;
  prenom?: string;
  formation?: string;
  date_Naissance?: string;
  formations: any[];
  // Ajout des propriétés de vérification financière reçues de l'API
  reference_transaction?: string | null;
  numero_paiement?: string | null;
  methode?: string | null;
  user?: {
    nom: string;
    prenom?: string;
  };
  created_at: string;
}

interface Certificat {
  id: number;
  nom: string;
  prenom?: string;
  formation?: string;
  date_Naissance?: string;
  user?: {
    nom: string;
    prenom?: string;
  };
  created_at: string;
}

type NotifItem = (UserDemande | Certificat) & { _type: 'inscription' | 'certificat' };

const ModalNotif = ({ onClose }: { onClose: () => void }) => {
  const [demandes, setDemandes] = useState<UserDemande[]>([]);
  const [demande, setDemande] = useState<Certificat[]>([]);
  const [, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const [inscRes, certRes] = await Promise.all([
          fetch(`${API_URL}/admin/inscriptions-en-attente`, { headers }),
          fetch(`${API_URL}/certificats/en-attente`, { headers }),
        ]);

        const inscData = await inscRes.json();
        const certData = await certRes.json();

        setDemandes(Array.isArray(inscData) ? inscData : []);
        setDemande(Array.isArray(certData.data) ? certData.data : []);
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    // Chargement immédiat
    fetchAll();

    // Correction de l'intervalle : passage de 1s à 15s pour éviter de saturer le serveur Laravel
    const interval = setInterval(fetchAll, 15000);

    return () => clearInterval(interval);
  }, []);

  // ── AJOUT DU FILTRAGE DANS LE USEMEMO ──
  const allItems: NotifItem[] = useMemo(() => {
    // 1. Filtrer uniquement les inscriptions complètes et valides
    const inscriptionsValides = demandes.filter(
      (d) => d.reference_transaction && d.numero_paiement && d.methode
    );

    // 2. Fusionner les deux listes typées
    return [
      ...demande.map(d => ({ ...d, _type: 'certificat' as const })),
      ...inscriptionsValides.map(d => ({ ...d, _type: 'inscription' as const })),
    ];
  }, [demande, demandes]);

  const { currentItems, totalPages } = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return {
      currentItems: allItems.slice(firstIndex, lastIndex),
      totalPages: Math.ceil(allItems.length / itemsPerPage)
    };
  }, [allItems, currentPage]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center md:justify-end md:pr-24 md:pt-20 bg-black/10 backdrop-blur-[1px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#1A234E] dark:text-indigo-400 uppercase tracking-wider px-2">
              Notifications ({allItems.length})
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Liste paginée */}
        <div className="max-h-96 overflow-y-auto">
          {allItems.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-slate-400 text-xs">Aucune notification en attente</p>
            </div>
          ) : (
            currentItems.map(item => (
              <div
                key={`${item._type}-${item.id}`}
                className="p-3 border-b border-gray-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 cursor-pointer group"
              >
                {/* Indicateur de type */}
                <div
                  className={`w-1 h-6 rounded-full ${
                    item._type === 'certificat' ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                />

                {/* Avatar initiale */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border shrink-0 ${
                    item._type === 'certificat'
                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                      : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800'
                  }`}
                >
                  {item.user?.nom?.[0]?.toUpperCase() ?? '?'}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.user?.nom ?? 'Étudiant'} {item.user?.prenom ?? ''}
                    </span>
                    <span
                      className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ml-1 shrink-0 ${
                        item._type === 'certificat'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                          : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                      }`}
                    >
                      {item._type === 'certificat' ? 'Certificat' : 'Inscription'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {(item as any).formation?.titre ?? (item as any).formation ?? '—'}
                    </p>
                    <span className='text-[9px] text-slate-400 mt-1'>
                      le {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>

                <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-500 shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Page {currentPage} sur {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 transition-all shadow-sm"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 transition-all shadow-sm"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNotif;