import { useState, useEffect, useCallback } from "react";
import { BookOpen, Layers, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../../lib/api";
import ListeFormation from "./listeFormation";
import ListeFormateur from "./ListeFormateur";
import ListeGuide from "./ListeGuide";
import AjoutFormation from "./AjoutFormation";
import AjoutGuide from "./AjoutGuide";
import Categorie from "./categorie";

interface Formation {
  id: number;
  titre: string;
  type: string;
  cibles: string;
  categorie: string;
  prerequis: string;
  commission: number;
  frais: number;
  duree: string;
  url_youtube: string;
  nom_formateur: string;
  admin_id: number | null;
}

const FormationAdm = () => {
  const token = localStorage.getItem('token');
  const A_URL = `${API_URL}/formations`;

  // etats
  const [activeTab, setActiveTab] = useState("formations");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedFormation] = useState<any>(null);

  // États pour le Guide
  const [showGuideModal, setShowGuideModal] = useState(false);

  const confirmDelete = async () => {
    try {
        const response = await fetch(`${A_URL}/${selectedFormation.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        if(response.ok) {
            setFormat(format.filter(f => f.id !== selectedFormation.id));
            setToast("Formation supprimée !");
            setShowDeleteModal(false);
        }
    } catch (error) {
        console.error(error);
    }
  };

  // fetch data
  const [, setLoading] = useState(true);
  const [format, setFormat] = useState<Formation[]>([])
  const [, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFormations = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${A_URL}?page=${page}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      const dataToSet = result.data ? result.data : result;
      if (Array.isArray(dataToSet)) {
        setFormat(dataToSet);
        setLastPage(result.last_page || 1);
        setCurrentPage(result.current_page || 1);
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  }, [token, A_URL]);

  useEffect(() => {
    fetchFormations(currentPage);
  }, [currentPage, fetchFormations]);
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const navItems = [
    { tab: "formations", icon: <BookOpen size={16} />, label: "Formations",  sublabel: "Toutes les formations" },
    { tab: "guides",     icon: <BookOpen size={16} />, label: "Guides",      sublabel: "Documents & supports" },
    { tab: "categories", icon: <Layers size={16} />,   label: "Catégories",  sublabel: "Organiser les thèmes" },
    { tab: "formateurs", icon: <Users size={16} />,    label: "Formateurs",  sublabel: "Équipe pédagogique" },
  ];

  return (
    <div className="p-6 lg:p-8 bg-[#F0F4FF] min-h-screen font-sans">

      {/* BARRE DE NAVIGATION */}
      <div className="relative flex flex-col md:flex-row md:items-stretch gap-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">

        <nav className="flex flex-wrap gap-1 p-3 pl-5 flex-1">
          {navItems.map(({ tab, icon, label, sublabel }) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  group relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200
                  ${active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}
                `}
              >
                <span className={`
                  flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200
                  ${active ? "bg-white/20" : "bg-slate-100 group-hover:bg-indigo-50"}
                `}>
                  <span className={active ? "text-white" : "text-indigo-400 group-hover:text-indigo-600"}>
                    {icon}
                  </span>
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${active ? "text-white" : "text-slate-600 group-hover:text-indigo-700"}`}>
                    {label}
                  </span>
                  <span className={`text-[10px] font-medium ${active ? "text-indigo-100" : "text-slate-400"}`}>
                    {sublabel}
                  </span>
                </span>
                
              </button>
            );
          })}
        </nav>
      </div>

      {/* CONTENU */}
      <AnimatePresence mode="wait">
        {activeTab === "formations" ? (
          <ListeFormation />
        ) : activeTab === "categories" ? (
          <Categorie />
        ) : activeTab === "guides" ? (
          <ListeGuide />
        ) : (
          <ListeFormateur />
        )}
      </AnimatePresence>

      {/* mod ajout/modif */}
      <AnimatePresence>
        {showAddModal && (
          <AjoutFormation onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>

      {/* MODAL AJOUT GUIDE  */}
      <AnimatePresence>
        {showGuideModal && (
          <AjoutGuide onClose={() => setShowGuideModal(false)} />
        )}
      </AnimatePresence>

      {/* mod suppr*/}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-white z-70 flex items-center justify-center p-4" 
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm"><AlertTriangle size={32} /></div>
              <h2 className="text-xl font-black text-slate-900 uppercase mb-2 tracking-tight">Supprimer ?</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Voulez-vous supprimer <span className="font-bold text-slate-800">"{selectedFormation?.titre}"</span> ?</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Confirmer</button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Annuler</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="fixed bottom-10 right-10 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-80 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FormationAdm;