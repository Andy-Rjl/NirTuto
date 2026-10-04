import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Lock, Gift } from "lucide-react";
import { API_URL } from './../../../../../lib/api';
import { useNavigate } from "react-router-dom";
import { FormationCard } from "./FormationCard";
import { HorizontalSection } from "./HorizontalSection";
import type { CatalogueProps, Formation, Categorie } from "./types";
import { slug } from './../../../../../lib/slug'; // Ta fonction utilitaire de slug

const CatalogueFormations = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }: CatalogueProps) => {
  const [projects, setProjects] = useState<Formation[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [payantes, setPayantes] = useState<Formation[]>([]);
  const [gratuites, setGratuites] = useState<Formation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/categories-liste`).then(res => res.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = `${API_URL}/formations?category=${activeTab}&search=${searchTerm}&page=${currentPage}`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        setProjects(res.data || []);
        setLastPage(res.last_page || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab, searchTerm, currentPage]);

  useEffect(() => {
    fetch(`${API_URL}/formations?page=1&per_page=12`)
      .then(res => res.json())
      .then(res => {
        const all: Formation[] = res.data || [];
        setPayantes(all.filter(f => f.frais && f.frais > 0));
        setGratuites(all.filter(f => !f.frais || f.frais === 0));
      })
      .catch(() => {});
  }, []);

  const filteredFormations = projects.filter(i =>
    i.titre.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentPage(1);
  };

  // ── MODIFICATION ICI ──
  // On prend maintenant l'objet entier (item) au lieu de juste l'id
  const handleCardClick = (item: Formation) => {
    const formationSlug = slug(item.titre); // Génère le slug lisible (ex: "initiation-a-react")
    
    // On pousse le slug dans l'URL et on transmet l'id via le state de React Router
    navigate(`/formation/${formationSlug}`, { state: { id: item.id } });
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div id="catalogue" className="w-full px-5 sm:px-8 min-h-screen pb-16" bg-white>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-10 mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Toutes nos formations disponibles</h2>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00A99D] focus:ring-2 focus:ring-[#00A99D]/10 transition-all shadow-sm"
              placeholder="Rechercher une formation..."
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="w-full mb-10 border-b border-gray-200">
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
         <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900">Cours les plus suivis</h3>
          <button
            className="text-xs font-semibold border border-gray-900 text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-900 hover:text-white transition-colors"
            onClick={() => {navigate('/voir-toutes-formations'); window.scrollTo({ top: 0, behavior: 'smooth' });}}
          >
            Voir plus
          </button>
        </div>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[1,2,3,4,5,6,7,8].map(n => (
                <div key={n} className="rounded-xl bg-gray-200 animate-pulse flex-shrink-0 w-[260px]" style={{ height: 340 }} />
              ))}
            </div>
          ) : filteredFormations.length > 0 ? (
            <>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                <AnimatePresence mode="popLayout">
                  {filteredFormations.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-[260px]">
                      {/* MODIFICATION ICI: On passe l'item complet à handleCardClick */}
                      <FormationCard item={item} onClick={() => handleCardClick(item)} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12 mb-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-200 disabled:opacity-25 hover:border-[#00A99D] hover:text-[#00A99D] transition-all bg-white text-gray-900"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          height: '10px',
                          width: p === currentPage ? '28px' : '10px',
                          background: p === currentPage ? '#00A99D' : '#d1d5db',
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                    disabled={currentPage === lastPage}
                    className="p-2 rounded-full border border-gray-200 disabled:opacity-25 hover:border-[#00A99D] hover:text-[#00A99D] transition-all bg-white text-gray-900"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 flex flex-col items-center shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-[#f0fffe]">
                <Search size={22} style={{ color: '#00A99D' }} />
              </div>
              <h3 className="text-base font-black text-gray-900 mb-1">Aucun résultat</h3>
              <p className="text-gray-400 text-sm">Essayez un autre mot-clé ou changez de catégorie.</p>
            </div>
          )}
        </div>

        {/* ── Sections horizontales ── */}
        {/* MODIFICATION ICI: on change onSelect pour envoyer l'objet complet f au lieu de f.id */}
        <div id="payant">
          <HorizontalSection
            title="Formations Payantes"
            subtitle="Contenu premium · Accès illimité · Certificat inclus"
            accent="#6366f1"
            icon={Lock}
            formations={payantes}
            onSelect={(f) => handleCardClick(f)} 
            bgClass=""
          />
        </div>
        <div id="gratuit">
          <HorizontalSection
            title="Formations Gratuites"
            subtitle="Commencez sans engagement · 100% gratuit"
            accent="#00A99D"
            icon={Gift}
            formations={gratuites}
            onSelect={(f) => handleCardClick(f)}
            bgClass=""
          />
        </div>

      </div>
    </>
  );
};

export default CatalogueFormations;