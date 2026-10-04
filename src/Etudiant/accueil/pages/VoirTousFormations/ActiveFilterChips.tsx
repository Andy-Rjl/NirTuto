import { X } from "lucide-react";
import { C } from "./types";
import type { PriceFilter } from "./types";

interface ActiveFilterChipsProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  priceFilter: PriceFilter;
  setPriceFilter: (v: PriceFilter) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  hasActiveFilters: boolean;
}

export const ActiveFilterChips = ({
  searchTerm, setSearchTerm,
  priceFilter, setPriceFilter,
  activeTab, setActiveTab,
  hasActiveFilters,
}: ActiveFilterChipsProps) => {
  if (!hasActiveFilters) return null;

  const chipStyle = {
    background: C.primaryBg,
    border: `1px solid ${C.primaryBorder}`,
    color: C.primary,
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textMuted }}>
        Actifs :
      </span>
      {searchTerm && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold" style={chipStyle}>
          "{searchTerm}"
          <button onClick={() => setSearchTerm('')}><X size={10} /></button>
        </span>
      )}
      {priceFilter !== 'all' && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold" style={chipStyle}>
          {priceFilter === 'free' ? 'Gratuites' : 'Payantes'}
          <button onClick={() => setPriceFilter('all')}><X size={10} /></button>
        </span>
      )}
      {activeTab !== 'all' && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold" style={chipStyle}>
          {activeTab}
          <button onClick={() => setActiveTab('all')}><X size={10} /></button>
        </span>
      )}
    </div>
  );
};