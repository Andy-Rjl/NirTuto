import { ChevronRight } from "lucide-react";
import { SuggestionCard } from "./SuggestionCard";
import type { Formation } from "./types";

interface SuggestionsSectionProps {
  suggestions: Formation[];
  onSelect: (item: Formation) => void;
}

export const SuggestionsSection = ({ suggestions, onSelect }: SuggestionsSectionProps) => (
  <section className="py-20 bg-white text-gray-900">
    <div className="w-full mx-auto px-6">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Autres formations disponibles</h2>
          <div className="h-1 w-20 bg-[#00A99D] rounded-full" />
        </div>
        <button className="text-[#00A99D] text-xs font-black uppercase tracking-widest flex items-center gap-2">
          Voir tout <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-8 no-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
        {suggestions.map((item) => (
          <SuggestionCard
            key={item.id}
            item={item}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    </div>
  </section>
);