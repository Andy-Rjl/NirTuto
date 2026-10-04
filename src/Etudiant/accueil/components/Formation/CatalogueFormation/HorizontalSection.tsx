import { useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as Arrow } from "lucide-react";
import { HorizontalCard } from "./HorizontalCard";
import type { Formation } from "./types";

interface HorizontalSectionProps {
  title: string;
  subtitle: string;
  accent: string;
  icon: React.ElementType;
  formations: Formation[];
  onSelect: (f: Formation) => void;
  bgClass: string;
}

export const HorizontalSection = ({
  title, accent, formations, onSelect, bgClass,
}: HorizontalSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <div className={`w-full mt-14 ${bgClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full bg-white text-gray-900 border border-gray-200 flex items-center justify-center hover:border-[#00A99D] hover:text-[#00A99D] transition-colors shadow">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full bg-white text-gray-900 border border-gray-200 flex items-center justify-center hover:border-[#00A99D] hover:text-[#00A99D] transition-colors shadow">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {formations.length === 0 ? (
        <p className="text-sm text-gray-400 italic px-1">Aucune formation disponible pour le moment.</p>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {formations.map((item) => (
            <div key={item.id} style={{ scrollSnapAlign: "start", flexShrink: 0, width: 300 }}>
              <HorizontalCard item={item} accent={accent} onSelect={() => onSelect(item)} />
            </div>
          ))}
          {/* Voir tout */}
          <div className="flex-shrink-0 w-[100px] flex items-center justify-center">
            <button className="flex flex-col items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors">
              <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-gray-200 bg-white text-gray-900">
                <Arrow size={20} />
              </div>
              Voir tout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};