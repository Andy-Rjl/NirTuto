import { Search, Tag, X, LayoutGrid, Gift, Award } from "lucide-react";
import { C } from "./types";
import type { Categories, PriceFilter } from "./types";

export interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  priceFilter: PriceFilter;
  setPriceFilter: (v: PriceFilter) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  categories: Categories[];
  hasActiveFilters: boolean;
  resetAll: () => void;
}

export const SidebarContent = ({
  searchTerm, setSearchTerm,
  priceFilter, setPriceFilter,
  activeTab, setActiveTab,
  categories, hasActiveFilters, resetAll,
}: SidebarProps) => (
  <div className="flex flex-col gap-6">

    {/* Search */}
    <form>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2.5" style={{ color: C.accent }}>
        Rechercher
      </p>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={14} style={{ color: C.textMuted }} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="React, Java, Python…"
          className="w-full pl-10 pr-8 py-2.5 text-xs font-medium outline-none rounded-xl transition-all"
          style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textDark }}
        />
        {searchTerm && (
          <button type="button" onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-60" style={{ color: C.textMuted }}>
            <X size={12} />
          </button>
        )}
      </div>
    </form>

    <div style={{ height: '1px', background: C.border }} />

    {/* Price filter */}
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2.5" style={{ color: C.accent }}>
        Type d'accès
      </p>
      <div className="flex flex-col gap-1.5">
        {([
          { key: 'all',  label: 'Toutes',    icon: LayoutGrid, color: '#3b82f6', bg: '#eff6ff' },
          { key: 'free', label: 'Gratuites',  icon: Gift,       color: '#10b981', bg: '#ecfdf5' },
          { key: 'paid', label: 'Payantes',   icon: Award,      color: '#f59e0b', bg: '#fffbeb' },
        ] as const).map(({ key, label, icon: IconComponent, color, bg }) => (
          <button
            key={key}
            onClick={() => setPriceFilter(key)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all duration-150 group"
            style={{
              background: priceFilter === key ? C.primaryBg : C.surfaceAlt,
              border: `1px solid ${priceFilter === key ? C.primaryBorder : C.border}`,
              color: priceFilter === key ? C.primary : C.textMid,
            }}
          >
            <div className="p-1.5 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: bg }}>
              <IconComponent size={14} style={{ color }} />
            </div>
            <span className="flex-1">{label}</span>
          </button>
        ))}
      </div>
    </div>

    <div style={{ height: '1px', background: C.border }} />

    {/* Categories */}
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2.5" style={{ color: C.accent }}>
        Catégories
      </p>
      <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setActiveTab('all')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-150"
          style={{
            background: activeTab === 'all' ? C.primaryBg : C.surfaceAlt,
            border: `1px solid ${activeTab === 'all' ? C.primaryBorder : C.border}`,
            color: activeTab === 'all' ? C.primary : C.textMid,
          }}
        >
          <Tag size={10} className="flex-shrink-0" style={{ color: activeTab === 'all' ? C.primary : C.textMuted }} />
          Tous les categories
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.nom_cat)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-150"
            style={{
              background: activeTab === cat.nom_cat ? C.primaryBg : C.surfaceAlt,
              border: `1px solid ${activeTab === cat.nom_cat ? C.primaryBorder : C.border}`,
              color: activeTab === cat.nom_cat ? C.primary : C.textMid,
            }}
          >
            <Tag size={10} className="flex-shrink-0" style={{ color: activeTab === cat.nom_cat ? C.primary : C.textMuted }} />
            {cat.nom_cat}
          </button>
        ))}
      </div>
    </div>

    {hasActiveFilters && (
      <>
        <div style={{ height: '1px', background: C.border }} />
        <button
          onClick={resetAll}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:brightness-95"
          style={{ background: '#fef2f2', border: '1px solid #fecaca', color: C.danger }}
        >
          <X size={11} /> Réinitialiser
        </button>
      </>
    )}
  </div>
);