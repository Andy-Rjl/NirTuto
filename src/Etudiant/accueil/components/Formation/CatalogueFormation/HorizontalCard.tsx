import { useState, useEffect } from "react";
import { Clock, Play, Bookmark } from "lucide-react";
import { API_URL } from './../../../../../lib/api';
import java from "./../../../assets/jquery.jpg";
import { StarRating } from "./StarRating";
import type { Formation } from "./types";

export const HorizontalCard = ({ item, accent, onSelect }: { item: Formation; accent: string; onSelect: () => void }) => {
  const [moyenne, setMoyenne] = useState<number>(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/evaluations/${item.id}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setMoyenne(data.moyenne ?? 0))
      .catch(() => setMoyenne(0));
  }, [item.id]);

  const formateur_img = item.photo_formateur
    ? (item.photo_formateur.startsWith('http') ? item.photo_formateur : `${API_URL.replace("api", "")}${item.photo_formateur}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nom_formateur)}&background=e5e7eb&color=374151`;

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-200 cursor-pointer flex flex-col group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      onClick={onSelect}
    >
      <div className="relative h-[180px] overflow-hidden bg-gray-100">
        <img src={item.image || java} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.titre} />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-md">
            <Play size={16} className="text-gray-800 ml-0.5" fill="currentColor" />
          </div>
        </div>
        {(!item.frais || item.frais === 0) && (
          <div className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: accent }}>
            Gratuit
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <StarRating rating={moyenne} />
            <span className="text-[12px] font-bold text-yellow-500">{moyenne.toFixed(1)}</span>
          </div>
          <button onClick={e => { e.stopPropagation(); setBookmarked(b => !b); }} className="text-gray-400 hover:text-gray-700 transition-colors">
            <Bookmark size={16} className={bookmarked ? "fill-gray-800 text-gray-800" : ""} />
          </button>
        </div>
        <h4 className="text-[13px] text-left font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#00A99D] transition-colors">
          {item.titre}
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <img src={formateur_img} alt={item.nom_formateur} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
          <span className="text-[12px] text-gray-500 truncate">{item.nom_formateur}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
            <Clock size={12} className="text-gray-500" />
            <span className="text-[11px] font-semibold text-gray-700">{item.duree || "2h"}</span>
          </div>
          {(item.difficulte || item.type) && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase"
              style={{ background: `${accent}22`, color: accent }}>
              {item.difficulte || item.type}
            </span>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100">
          {item.frais && item.frais > 0 ? (
            <span className="text-[13px] font-black text-gray-900">{item.frais.toLocaleString()} Ar</span>
          ) : (
            <span className="text-[13px] font-black" style={{ color: accent }}>Gratuit</span>
          )}
        </div>
      </div>
    </div>
  );
};