import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Filter, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { API_URL } from "./../../../../lib/api";
import { C } from "./types";
import type { Formation, Categories, PriceFilter } from "./types";
import { FormationCard } from "./FormationCard";
import { SidebarContent } from "./SidebarContent";
import type { SidebarProps } from "./SidebarContent";
import { MobileSidebar } from "./MobileSidebar";
import { ActiveFilterChips } from "./ActiveFilterChips";
import NavbarAcc from "../../components/NavbarAcc";

const VoirTousF = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Formation[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');

  useEffect(() => {
    fetch(`${API_URL}/categories-liste`)
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error("Erreur catégories:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/formations?category=${activeTab}&search=${searchTerm}`)
      .then(res => res.json())
      .then(res => { setProjects(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeTab, searchTerm]);

  const filtered = projects.filter(i => {
    const matchesSearch = i.titre.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
    const isFree = i.frais === 0 || i.frais === null;
    const matchesPrice = priceFilter === 'all' ? true : priceFilter === 'free' ? isFree : !isFree;
    return matchesSearch && matchesPrice;
  });

  const hasActiveFilters = activeTab !== 'all' || priceFilter !== 'all' || searchTerm !== '';
  const resetAll = () => { setSearchTerm(""); setPriceFilter('all'); setActiveTab('all'); };

  const sidebarProps: SidebarProps = {
    searchTerm, setSearchTerm,
    priceFilter, setPriceFilter,
    activeTab, setActiveTab,
    categories, hasActiveFilters, resetAll,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div id="voir" className="min-h-screen font-sans" style={{ background: C.bg }}>
      <NavbarAcc />
      {/* NAV */}
      <nav
        className="mt-[95px] z-50"
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${C.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div className="w-full mx-auto px-6 h-16 flex items-center justify-between" style={{ background: C.bgHead }}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all"
            style={{ color: C.textMuted }}
            onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
            onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Retour</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: C.textHead }}>
              Catalogue des formations
            </h1>
          </div>

          {/* Mobile filter button */}
          <button
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, color: C.primary }}
            onClick={() => setSidebarOpen(true)}
          >
            <Filter size={13} />
            Filtres
          </button>

          <div className="w-20 hidden lg:block" />
        </div>
      </nav>

      {/* HERO STRIP */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #eff6ff 0%, #f0fdfa 60%, ${C.bg} 100%)`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 py-10 relative">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2" style={{ color: C.textDark }}>
            Toutes les formations
          </h2>
          <p className="text-sm" style={{ color: C.textMuted }}>
            {loading
              ? 'Chargement…'
              : `${filtered.length} formation${filtered.length > 40 ? 's' : ''} disponible${filtered.length > 40 ? 's' : ''}`}
            {hasActiveFilters && (
              <span style={{ color: C.primary }} className="font-semibold"> · filtres actifs</span>
            )}
          </p>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-7">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div
              className="sticky top-24 rounded-2xl p-5"
              style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Filter size={13} style={{ color: C.primary }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: C.textDark }}>
                  Filtres
                </span>
              </div>
              <SidebarContent {...sidebarProps} />
            </div>
          </aside>

          {/* CONTENT */}
          <section className="flex-1 min-w-0">
            <ActiveFilterChips
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              priceFilter={priceFilter} setPriceFilter={setPriceFilter}
              activeTab={activeTab} setActiveTab={setActiveTab}
              hasActiveFilters={hasActiveFilters}
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}` }}>
                  <Loader2 className="animate-spin" size={24} style={{ color: C.primary }} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textMuted }}>
                  Chargement des formations…
                </p>
              </div>

            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                <AnimatePresence mode="popLayout">
                  {filtered.map(item => (
                    <FormationCard
                      key={item.id}
                      item={item}
                      onClick={() => navigate(`/formation/${item.id}`)}
                    />
                  ))}
                </AnimatePresence>
              </div>

            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center rounded-2xl"
                style={{ background: C.surface, border: `2px dashed ${C.border}` }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: C.surfaceAlt }}>
                  <Sparkles size={28} style={{ color: C.textMuted }} />
                </div>
                <h3 className="text-base font-black uppercase tracking-tight mb-2" style={{ color: C.textDark }}>
                  Aucun résultat
                </h3>
                <p className="text-sm mb-7 max-w-xs" style={{ color: C.textMuted }}>
                  Aucune formation ne correspond à vos critères actuels.
                </p>
                <button
                  onClick={resetAll}
                  className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:brightness-95"
                  style={{ background: C.primaryBg, border: `1px solid ${C.primaryBorder}`, color: C.primary }}
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} {...sidebarProps} />

      <Footer />
    </div>
  );
};

export default VoirTousF;