import { FaClock, FaUserGraduate, FaLayerGroup } from "react-icons/fa";
import type { Data } from "./types";
import { API_URL } from "../../../../../lib/api";

interface FormationHeroProps {
  formation: Data;
  hasLocalVideo: string | boolean;
  youtubeId: string | null;
}

export const FormationHero = ({ formation, hasLocalVideo, youtubeId }: FormationHeroProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex flex-col sm:flex-row">

      {/* Vidéo */}
      <div className="sm:w-[55%] flex-shrink-0 bg-black" style={{ aspectRatio: '16/9' }}>
        {!hasLocalVideo ? (
          youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="w-full h-full object-cover"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                Aucune vidéo disponible
              </div>
            )
          ) : (
          <video
            src={hasLocalVideo ? (formation.video.startsWith('https') ? formation.video : `${API_URL}/storage/${formation.video.replace(/^\/?storage\//, '')}`) : undefined}
            className="w-full h-full object-cover"
            controls
            style={{ display: 'block' }}
          />
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-4 min-w-0">

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-[#5a4fcf]">
            {formation.categorie}
          </span>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
            formation.type === 'Gratuite' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'
          }`}>
            {formation.type}
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
          {formation.titre}
        </h1>

        <hr className="border-gray-100" />

        {/* Stats */}
        <div className="space-y-3">
          {[
            { icon: <FaClock size={11} className="text-blue-400" />,          label: 'Durée',     value: formation.duree,             bg: 'bg-blue-50'   },
            { icon: <FaUserGraduate size={11} className="text-indigo-400" />, label: 'Formateur', value: formation.nom_formateur,     bg: 'bg-indigo-50' },
            { icon: <FaLayerGroup size={11} className="text-orange-400" />,   label: 'Niveau',    value: formation.difficulte,        bg: 'bg-orange-50' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-400 font-semibold flex-shrink-0">{s.label}</span>
                <span className="text-[11px] font-bold text-gray-700 truncate text-right">{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);