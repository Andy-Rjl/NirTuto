import { motion } from "framer-motion";
import { Clock, Users, Award, ArrowLeft } from "lucide-react";
import { API_URL } from "./../../../../../lib/api";
import { DynamicStarRating } from "./DynamicStarRating";
import type { Formation } from "./types";
import { EnrollSidebar } from "./EnrollSidebar";

interface HeroSectionProps {
  formation: Formation;
  moyenne: number | null;
  totalEvaluations: number;
  onBack: () => void;
  onEnroll: () => void;
}

// 1. Fonction magique pour extraire l'ID d'une URL YouTube (gère les formats watch?v= et youtu.be/)
const getYoutubeId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const HeroSection = ({ formation, moyenne, totalEvaluations, onBack, onEnroll }: HeroSectionProps) => {
  // 2. On vérifie si la vidéo locale existe
  const hasLocalVideo = formation.video && formation.video.trim() !== "";

  const videoSrc = hasLocalVideo
    ? (formation.video.startsWith('https')
        ? formation.video
        : `${API_URL}/storage/${formation.video.replace(/^\/?storage\//, '')}`)
    : null;

  // 3. On extrait l'ID de l'URL YouTube de la base de données
  const youtubeId = getYoutubeId(formation.url_youtube);

  const formateurImg = formation.admin?.photo
    ? (formation.admin.photo.startsWith('http')
        ? formation.admin.photo
        : `${API_URL.replace("api", "")}${formation.admin.photo}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(formation.nom_formateur)}&background=00A99D&color=fff`;

  return (
    <section className="relative w-full mt-[95px] pb-16 bg-gray-50 overflow-hidden">
      {/* Barre de navigation retour */}
      <div className="w-full bg-[#053F5C] border-b border-gray-200 py-5 mb-10 shadow-sm">
        <div className="w-full mx-auto px-6">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-3 px-5 py-2.5 text-white transition-all duration-300 font-black text-[10px] uppercase tracking-[0.15em] hover:gap-4"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Retour au catalogue
          </button>
        </div>
      </div>

      <div className="w-full mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Vidéo & Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-0">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100 border-2 border-white relative z-10 bg-black">
              
              {/* 4. CONDITION SANS ERREUR TYPESCRIPT */}
              {!hasLocalVideo ? (
                youtubeId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm">
                    Aucune vidéo disponible
                  </div>
                )
              ) : (
                <video
                  src={videoSrc!}
                  className="w-full h-full object-cover"
                  controls
                />
              )}

            </div>

            <div className="pt-8 px-4">
              <h3 className="text-[10px] 2xl:text-[20px] font-bold uppercase tracking-[0.2em] text-black mb-3">
                À propos de ce programme
              </h3>
              <div
                className="text-left text-xs 2xl:text-lg text-black leading-relaxed max-w-2xl [&_ul]:list-disc [&_ul]:pl-2 [&_ul]:ml-10 [&_ol]:list-decimal [&_ol]:pl-2 [&_ol]:ml-10 [&_li]:mt-4"
                dangerouslySetInnerHTML={{ __html: formation.programme }}
              />
            </div>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-5">
            {/* En-tête : badge + titre + note */}
            <div className="space-y-4">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full text-[10px] 2xl:text-sm font-bold uppercase tracking-widest text-white shadow-sm shadow-indigo-200">
                {formation.categorie}
              </span>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                {formation.titre}
              </h1>
            </div>

            {/* Stats : durée / avis / niveau */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              {moyenne !== null && (
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-100 w-fit shadow-sm">
                  <DynamicStarRating rating={moyenne} />
                  <span className="text-xs text-gray-400 font-medium">({totalEvaluations} avis)</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2.5 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Award size={15} className="text-gray-400" />
                  <p className="text-[10px] 2xl:text-base text-gray-500 font-bold">Niveau</p>
                </div>
                <p className="text-[10px] 2xl:text-base font-bold text-gray-500">{formation.difficulte}</p>
              </div>

              <div className="flex items-center justify-between py-2.5 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-gray-400" />
                  <p className="text-[10px] 2xl:text-base text-gray-500 font-bold">Durée</p>
                </div>
                <p className="text-[10px] 2xl:text-base font-bold text-gray-500">{formation.duree || "12h"}</p>
              </div>

              <div className="flex items-center justify-between py-2.5 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Users size={15} className="text-gray-400" />
                  <p className="text-[10px] 2xl:text-base text-gray-500 font-bold">Avis</p>
                </div>
                <p className="text-[10px] 2xl:text-base font-bold text-gray-500">{totalEvaluations}</p>
              </div>
            </div>

            {/* Formateur */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <img
                src={formateurImg}
                alt={formation.nom_formateur}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#00A99D]/20"
              />
              <div>
                <p className="text-[10px] 2xl:text-sm text-indigo-400 uppercase font-bold tracking-wide">
                  Formateur
                </p>
                <p className="text-sm font-bold text-gray-900">{formation.nom_formateur}</p>
              </div>
            </div>

            <EnrollSidebar
              formation={{ frais: formation.frais }}
              onEnroll={onEnroll}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};