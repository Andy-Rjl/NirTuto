import { useEffect, useState } from "react";
import { API_URL } from "./../../../../lib/api";
import * as Icons from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface ThematiquesProps {
  onSelectCategory?: (cat: string) => void;
}

const COLORS = [
    { id: 'indigo',  hex: '#6366f1', label: 'Indigo',   bg: 'bg-indigo-500',  light: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-600',  glow: 'shadow-indigo-200'  },
    { id: 'violet',  hex: '#8b5cf6', label: 'Violet',   bg: 'bg-violet-500',  light: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-600',  glow: 'shadow-violet-200'  },
    { id: 'rose',    hex: '#f43f5e', label: 'Rose',     bg: 'bg-rose-500',    light: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-600',    glow: 'shadow-rose-200'    },
    { id: 'amber',   hex: '#f59e0b', label: 'Ambre',    bg: 'bg-amber-500',   light: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-600',   glow: 'shadow-amber-200'   },
    { id: 'teal',    hex: '#14b8a6', label: 'Teal',     bg: 'bg-teal-500',    light: 'bg-teal-50',    border: 'border-teal-200',    text: 'text-teal-600',    glow: 'shadow-teal-200'    },
    { id: 'sky',     hex: '#0ea5e9', label: 'Ciel',     bg: 'bg-sky-500',     light: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-600',     glow: 'shadow-sky-200'     },
    { id: 'emerald', hex: '#10b981', label: 'Émeraude', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', glow: 'shadow-emerald-200' },
    { id: 'pink',    hex: '#ec4899', label: 'Rose vif', bg: 'bg-pink-500',    light: 'bg-pink-50',    border: 'border-pink-200',    text: 'text-pink-600',    glow: 'shadow-pink-200'    },
    { id: 'orange',  hex: '#f97316', label: 'Orange',   bg: 'bg-orange-500',  light: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-600',  glow: 'shadow-orange-200'  },
    { id: 'cyan',    hex: '#06b6d4', label: 'Cyan',     bg: 'bg-cyan-500',    light: 'bg-cyan-50',    border: 'border-cyan-200',    text: 'text-cyan-600',    glow: 'shadow-cyan-200'    },
    { id: 'lime',    hex: '#84cc16', label: 'Lime',     bg: 'bg-lime-500',    light: 'bg-lime-50',    border: 'border-lime-200',    text: 'text-lime-600',    glow: 'shadow-lime-200'    },
    { id: 'slate',   hex: '#64748b', label: 'Ardoise',  bg: 'bg-slate-500',   light: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-600',   glow: 'shadow-slate-200'   },
];

const getPalette = (colorId: string) =>
    COLORS.find(c => c.id === colorId) ?? COLORS[0];

const Thematiques = ({ onSelectCategory }: ThematiquesProps) => {
  const [thematiques, setThematiques] = useState<any>([]);
  const [config, setConfig] = useState<any>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const location = useLocation();

  const MOBILE_VISIBLE_COUNT = 4;

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as Record<string, any>)[iconName];
    return IconComponent ? IconComponent : Icons.HelpCircle;
  };

  const getThematiques = async () => {
    try {
      const response = await fetch(`${API_URL}/categories-liste`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) return;
      const data = await response.json();
      const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
      setThematiques(dataArray);
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    }
  };

  const getConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/front-office/thematique/config`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) return;
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      console.error("Erreur config", err);
    }
  };

  useEffect(() => {
    getThematiques();
    getConfig();
  }, [location.pathname]);

  return (
    <section
      className="w-full px-4 sm:px-6 py-12 sm:py-16 lg:py-20"
      style={{
        background: "linear-gradient(135deg, #fde8d0 0%, #fef3e8 30%, #eef0fb 70%, #e8eafd 100%)",
      }}
    >
      {/* En-tête */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12 relative">


        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-2 px-2 leading-tight"
          style={{ color: "#1a1d3d", fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}
        >
          {config?.title}
        </h2>
        {config?.subtitle && (
          <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3 max-w-2xl mx-auto leading-relaxed px-2">
            {config.subtitle}
          </p>
        )}
      </div>

      {/* Rangée - mobile : 2 rangées (4 catégories) visibles, le reste se déploie via la flèche */}
      <div className="sm:hidden max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {thematiques.slice(0, MOBILE_VISIBLE_COUNT).map((cat: any, idx: any) => {
            const p = getPalette(cat.couleur);
            const IconComponent = getIcon(cat.icone);
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                onClick={() => onSelectCategory?.(cat.nom_cat)}
                whileTap={{ scale: 0.97 }}
                className="bg-white flex items-center gap-2 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all text-left min-w-0"
                style={{ borderRadius: "50px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${p.hex}18` }}
                >
                  <IconComponent size={16} style={{ color: p.hex }} />
                </div>
                <span
                  className="font-semibold text-xs truncate"
                  style={{ color: p.hex, fontFamily: "'Poppins', sans-serif" }}
                >
                  {cat.nom_cat}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showAllMobile && thematiques.length > MOBILE_VISIBLE_COUNT && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 mt-3">
                {thematiques.slice(MOBILE_VISIBLE_COUNT).map((cat: any, idx: any) => {
                  const p = getPalette(cat.couleur);
                  const IconComponent = getIcon(cat.icone);
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onSelectCategory?.(cat.nom_cat)}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white flex items-center gap-2 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all text-left min-w-0"
                      style={{ borderRadius: "50px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${p.hex}18` }}
                      >
                        <IconComponent size={16} style={{ color: p.hex }} />
                      </div>
                      <span
                        className="font-semibold text-xs truncate"
                        style={{ color: p.hex, fontFamily: "'Poppins', sans-serif" }}
                      >
                        {cat.nom_cat}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flèche dropdown : visible seulement si plus de 4 catégories existent */}
        {thematiques.length > MOBILE_VISIBLE_COUNT && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setShowAllMobile(prev => !prev)}
              aria-expanded={showAllMobile}
              aria-label={showAllMobile ? "Voir moins de catégories" : "Voir toutes les catégories"}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white transition-all active:scale-95"
              style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <motion.span
                animate={{ rotate: showAllMobile ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center"
              >
                <ChevronDown size={18} style={{ color: "#6366f1" }} />
              </motion.span>
            </button>
          </div>
        )}
      </div>

      {/* Rangée - tablette et plus : ligne scrollable horizontale */}
      <div className="hidden sm:flex gap-4 overflow-x-auto pb-2 justify-center" style={{ scrollbarWidth: "none", flexWrap: "nowrap" }}>
        {thematiques.map((cat: any, idx: any) => {
          const p = getPalette(cat.couleur);
          const IconComponent = getIcon(cat.icone);
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => onSelectCategory?.(cat.nom_cat)}
              whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.12)" }}
              className="bg-white flex items-center gap-3 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all text-left flex-shrink-0"
              style={{ borderRadius: "50px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.8)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${p.hex}18` }}
              >
                <IconComponent size={20} style={{ color: p.hex }} />
              </div>
              <span
                className="font-semibold text-sm whitespace-nowrap"
                style={{ color: p.hex, fontFamily: "'Poppins', sans-serif" }}
              >
                {cat.nom_cat}
              </span>
            </motion.button>
          );
        })}
      </div>

    </section>
  );
};

export default Thematiques;