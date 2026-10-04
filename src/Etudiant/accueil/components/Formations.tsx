import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import java from "../assets/jquery.jpg";

// IMPORTATION DES 3 FICHIERS INDÉPENDANTS
import Thematiques from "./Formation/Thematiques";
import Piliers from "./Formation/Piliers";
import CatalogueFormations from "./Formation/CatalogueFormation/CatalogueFormation";

interface FormationsProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

const Formations: React.FC<FormationsProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectTuto, setSelectTuto] = useState<any>(null);
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen bg-white pt-20 pb-10 overflow-hidden">
      <div className="w-full  box-border">
       <div id="pilier" className="w-full text-center mb-12">
    
       <Piliers />
       <Thematiques onSelectCategory={(cat) => setActiveTab(cat)} />
  </div>

      {/* UTILISATION DU COMPOSANT CATALOGUE */}
      <CatalogueFormations 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectFormation={(f: any) => setSelectTuto(f)}
      />

      {/* MODALE DE DÉTAILS  */}
      <AnimatePresence>
        {selectTuto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectTuto(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white rounded-[2.5rem] overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col md:flex-row z-[101]">
              <div className="md:w-5/12 h-56 md:h-auto overflow-hidden">
                <img src={selectTuto.image || java} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="md:w-7/12 p-10 relative">
                <button onClick={() => setSelectTuto(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-black text-gray-900 mb-4">{selectTuto.titre}</h2>
                <button onClick={() => navigate('/connexion')} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-700 transition-all">
                  S'inscrire
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
};

export default Formations;