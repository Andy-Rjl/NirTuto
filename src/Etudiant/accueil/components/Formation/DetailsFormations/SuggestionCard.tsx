import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { API_URL } from "./../../../../../lib/api";
import java from "./../../../assets/jquery.jpg";

export const SuggestionCard = ({ item, onClick }: { item: any; onClick: () => void }) => {
  const [moyenne, setMoyenne] = useState<number>(0);

  useEffect(() => {
    fetch(`${API_URL}/evaluations/${item.id}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setMoyenne(data.moyenne ?? 0))
      .catch(() => setMoyenne(0));
  }, [item.id]);

  const full = Math.floor(moyenne);
  const isEmpty = moyenne === 0;

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[260px] bg-white rounded-2xl overflow-hidden border border-gray-100 group flex flex-col cursor-pointer"
      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", transition: "box-shadow 0.3s, transform 0.3s", scrollSnapAlign: "start" }}
    >
      <div className="h-36 relative overflow-hidden">
        <img
          src={item.image || java}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={item.titre}
        />
        <div className="absolute bottom-2 left-2 text-[10px] 2xl:text-lg font-black px-2 py-0.5 rounded-md text-white bg-[#00A99D]">
          {item.frais && item.frais > 0 ? `${item.frais.toLocaleString()} Ar` : "Gratuit"}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 w-fit mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={isEmpty ? "fill-white text-gray-200" : i < full ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
            />
          ))}
          <span className={`text-xs 2xl:text-lg font-bold ml-1 ${isEmpty ? "text-gray-400" : "text-yellow-600"}`}>
            {moyenne.toFixed(1)}
          </span>
        </div>
        <h4 className="text-sm 2xl:text-lg font-bold text-gray-900 mt-2 mb-1 line-clamp-2 leading-snug">
          {item.titre}
        </h4>
        <p className="text-[11px] 2xl:text-lg text-gray-400 mb-3">Par {item.nom_formateur}</p>
      </div>
    </div>
  );
};