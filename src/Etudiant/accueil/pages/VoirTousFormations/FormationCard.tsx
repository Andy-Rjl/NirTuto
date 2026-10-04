import { motion } from "framer-motion";
import { Clock, User, ChevronRight } from "lucide-react";
import java from "./../../assets/jquery.jpg";
import { C } from "./types";
import { DiffBadge, CatPill } from "./Badges";
import type { Formation } from "./types";

export const FormationCard = ({ item, onClick }: { item: Formation; onClick: () => void }) => {
  const isFree = item.frais === 0 || item.frais === null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col overflow-hidden cursor-pointer"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '18px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(37,99,235,0.12), 0 4px 12px rgba(0,0,0,0.08)';
        (e.currentTarget as HTMLElement).style.borderColor = C.primaryBorder;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.borderColor = C.border;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
      onClick={onClick}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10"
        style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.accent})` }}
      />

      {/* Image */}
      <div className="relative overflow-hidden" style={{ borderRadius: '18px 18px 0 0' }}>
        <img
          src={item.image || java}
          className="w-full h-[200px] object-cover transition-transform duration-600 group-hover:scale-105"
          alt={item.titre}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 55%)' }}
        />

        {/* Badges top */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <CatPill label={item.categorie} />
          <span
            className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex-shrink-0"
            style={{
              backgroundColor: isFree ? '#f0fdf4' : '#fef2f2',
              color: isFree ? C.success : C.danger,
              border: `1px solid ${isFree ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            {isFree ? '✦ Gratuit' : `${item.frais?.toLocaleString()} Ar`}
          </span>
        </div>

        {/* Difficulty bottom-left */}
        <div className="absolute bottom-3 left-3">
          <DiffBadge diff={item.difficulte} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="text-sm text-left font-bold leading-snug mb-3 line-clamp-2 transition-colors duration-200"
          style={{ color: C.textDark }}
          onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
          onMouseLeave={e => (e.currentTarget.style.color = C.textDark)}
        >
          {item.titre}
        </h3>

        <div className="flex flex-col gap-1.5 mb-5">
          {item.nom_formateur && (
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: C.textMuted }}>
              <User size={10} style={{ color: C.accent }} />
              <span className="truncate">{item.nom_formateur}</span>
            </div>
          )}
          {item.duree && (
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: C.textMuted }}>
              <Clock size={10} style={{ color: C.accent }} />
              <span>{item.duree}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <div
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 group-hover:pl-5"
            style={{
              background: C.primaryBg,
              border: `1px solid ${C.primaryBorder}`,
              color: C.primary,
            }}
          >
            <span>Explorer</span>
            <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};