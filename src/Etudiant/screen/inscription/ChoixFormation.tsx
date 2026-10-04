import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { API_URL } from '../../../lib/api';
import { useNavigate } from "react-router-dom";
import type { CatalogueProps, Formation, Categorie } from "./types";
import { CardFormation } from "./CardFormation";

interface ChoixFormationProps extends CatalogueProps {
  onSelectFormation?: (item: Formation) => void;
  // CHANGEMENT : Remplacement de selectedId par un tableau de nombres
  selectedIds?: number[]; 
}

const ChoixFormation = ({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm, 
  onSelectFormation,
  selectedIds = [] // CHANGEMENT : Valeur par défaut (tableau vide)
}: ChoixFormationProps) => {
  const [projects, setProjects] = useState<Formation[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/categories-liste`).then(res => res.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = `${API_URL}/formations?category=${activeTab}&search=${searchTerm}`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        setProjects(res.data || res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab, searchTerm]);

  const filteredFormations = projects.filter(i =>
    i.titre.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
  };

  const handleCardClick = (item: Formation) => {
    if (onSelectFormation) {
      onSelectFormation(item); // La fonction parente devra gérer le push/filter dans le tableau
    } else {
      navigate(`/formation/${item.id}`);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75; 
      
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div id="catalogue" className="w-full px-5 sm:px-8 bg-white">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Toutes nos formations disponibles</h2>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00A99D] transition-all shadow-sm"
              placeholder="Rechercher une formation..."
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="w-full mb-6 border-b border-gray-200">
          <div className="flex gap-x-7 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px] font-bold uppercase tracking-widest">
            <span
              onClick={() => handleTabChange('all')}
              className={`pb-3 flex-shrink-0 cursor-pointer relative transition-colors ${activeTab === 'all' ? 'text-[#00A99D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#00A99D] after:rounded' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Toutes les formations
            </span>
            {categories.map((cat) => (
              <span
                key={cat.id}
                onClick={() => handleTabChange(cat.nom_cat)}
                className={`pb-3 flex-shrink-0 cursor-pointer relative transition-colors ${activeTab === cat.nom_cat ? 'text-[#00A99D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#00A99D] after:rounded' : 'text-gray-400 hover:text-gray-700'}`}
              >
                {cat.nom_cat}
              </span>
            ))}
          </div>
        </div>

        {/* ── Section "Cours les plus suivis" ── */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Formations disponibles</h3>
            
            {filteredFormations.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className="p-1.5 rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className="p-1.5 rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {filteredFormations.length > 0 ? (
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth"
            >
              <AnimatePresence mode="popLayout">
                {filteredFormations.map((item) => {
                  // CHANGEMENT : On vérifie si l'id actuel est inclus dans le tableau
                  const isSelected = selectedIds.includes(item.id); 
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`flex-shrink-0 w-[260px] relative rounded-xl transition-all duration-200 ${
                        isSelected ? "ring-2 ring-indigo-800/30 border-indigo-800/30" : ""
                      }`}
                    >
                      {/* Badge vert avec coche si sélectionné */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 z-10 bg-white rounded-full shadow-md flex items-center justify-center animate-bounce">
                          <CheckCircle2 size={24} className="text-[#34c471] fill-[#34c471]/10" />
                        </div>
                      )}
                      
                      <CardFormation item={item} onClick={() => handleCardClick(item)} />
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 flex flex-col items-center">
              <h3 className="text-sm font-black text-gray-900 mb-1">Aucun résultat</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChoixFormation;