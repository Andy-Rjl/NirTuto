import React, { useEffect, useState } from "react";
import * as Icons from 'lucide-react';
import { API_URL } from "./../../../../lib/api";

interface ThematiqueScProps {
  thematiqueData: {
    title: string;
    subtitle: string;
  };
  setThematiqueData: (data: any) => void;
  EditCard: React.FC<any>;
}

const COLORS = [
    { id: 'indigo',  hex: '#6366f1', label: 'Indigo',   bg: 'bg-indigo-500',  light: 'bg-indigo-100',  border: 'border-indigo-200',  text: 'text-indigo-600',  glow: 'shadow-indigo-200'  },
    { id: 'violet',  hex: '#8b5cf6', label: 'Violet',   bg: 'bg-violet-500',  light: 'bg-violet-100',  border: 'border-violet-200',  text: 'text-violet-600',  glow: 'shadow-violet-200'  },
    { id: 'rose',    hex: '#f43f5e', label: 'Rose',     bg: 'bg-rose-500',    light: 'bg-rose-100',    border: 'border-rose-200',    text: 'text-rose-600',    glow: 'shadow-rose-200'    },
    { id: 'amber',   hex: '#f59e0b', label: 'Ambre',    bg: 'bg-amber-500',   light: 'bg-amber-100',   border: 'border-amber-200',   text: 'text-amber-600',   glow: 'shadow-amber-200'   },
    { id: 'teal',    hex: '#14b8a6', label: 'Teal',     bg: 'bg-teal-500',    light: 'bg-teal-100',    border: 'border-teal-200',    text: 'text-teal-600',    glow: 'shadow-teal-200'    },
    { id: 'sky',     hex: '#0ea5e9', label: 'Ciel',     bg: 'bg-sky-500',     light: 'bg-sky-100',     border: 'border-sky-200',     text: 'text-sky-600',     glow: 'shadow-sky-200'     },
    { id: 'emerald', hex: '#10b981', label: 'Émeraude', bg: 'bg-emerald-500', light: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-600', glow: 'shadow-emerald-200' },
    { id: 'pink',    hex: '#ec4899', label: 'Rose vif', bg: 'bg-pink-500',    light: 'bg-pink-100',    border: 'border-pink-200',    text: 'text-pink-600',    glow: 'shadow-pink-200'    },
    { id: 'orange',  hex: '#f97316', label: 'Orange',   bg: 'bg-orange-500',  light: 'bg-orange-100',  border: 'border-orange-200',  text: 'text-orange-600',  glow: 'shadow-orange-200'  },
    { id: 'cyan',    hex: '#06b6d4', label: 'Cyan',     bg: 'bg-cyan-500',    light: 'bg-cyan-100',    border: 'border-cyan-200',    text: 'text-cyan-600',    glow: 'shadow-cyan-200'    },
    { id: 'lime',    hex: '#84cc16', label: 'Lime',     bg: 'bg-lime-500',    light: 'bg-lime-100',    border: 'border-lime-200',    text: 'text-lime-600',    glow: 'shadow-lime-200'    },
    { id: 'slate',   hex: '#64748b', label: 'Ardoise',  bg: 'bg-slate-500',   light: 'bg-slate-100',   border: 'border-slate-200',   text: 'text-slate-600',   glow: 'shadow-slate-200'   },
];

const getPalette = (colorId: string) =>
    COLORS.find(c => c.id === colorId) ?? COLORS[0];


const ThematiqueSc: React.FC<ThematiqueScProps> = ({ thematiqueData, setThematiqueData, EditCard }) => {
  const [] = useState({ name: '', icon: 'BookOpen', accent: '#7c3aed' });
  const [thematiques, setThematiques] = useState<any>([]);
  const [] = useState(false);
  
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as Record<string, any>)[iconName];
    return IconComponent ? IconComponent : Icons.HelpCircle;
  };

  // affichage
    useEffect(() => {
        getThematiques();
    }, []);

    const getThematiques = async () => {
        try {
            const response = await fetch(`${API_URL}/categories-liste`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();

            const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
            setThematiques(dataArray);
        } catch (error) {
            console.error("Erreur lors de la récupération:", error);
        }
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* ── COLONNE GAUCHE : ÉDITION & LISTE ── */}
      <section className="space-y-6 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-slate-800 italic">Gestion des Thématiques</h3>
          <span className="text-[10px] font-black uppercase text-purple-500 bg-purple-50 px-3 py-1 rounded-full tracking-widest italic">
            Configurateur
          </span>
        </div>

        {/* Champs de texte principaux */}
        <div className="space-y-4">
          <EditCard 
            label="Titre principal" 
            value={thematiqueData.title} 
            onChange={(v: string) => setThematiqueData({...thematiqueData, title: v})} 
            icon={<Icons.Layout size={18}/>} 
          />
          <EditCard 
            label="Sous-titre d'accroche" 
            value={thematiqueData.subtitle} 
            onChange={(v: string) => setThematiqueData({...thematiqueData, subtitle: v})} 
            icon={<Icons.AlignLeft size={18}/>} 
          />
        </div>
      </section>

      {/* ── COLONNE DROITE : APERÇU FRONT-OFFICE ── */}
      <section className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-2xl relative overflow-hidden">
        {/* Décoration d'arrière-plan discrète */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
        
        <div className="relative z-10">
          {/* En-tête dynamique du catalogue */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-3">
              {thematiqueData.title}
            </h2>
            <div className="h-1 w-12 bg-purple-500 mx-auto rounded-full mb-4" />
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-62.5 mx-auto italic">
              "{thematiqueData.subtitle}"
            </p>
          </div>

          {/* Grille miniature interactive */}
          <div className="grid grid-cols-3 gap-4">
            {thematiques.map((cat: any) => {
              const p             = getPalette(cat.couleur);
              const IconComponent = getIcon(cat.icone);
              return (
                <div
                  key={cat.id}
                  className={`flex items-center p-2 rounded-3xl border-2 transition-all shadow-sm ${p.light} ${p.border}`}
                  // style={{ backgroundColor: `color-mix(in srgb, ${cat.accent}, transparent 70%)`, borderColor: cat.accent}}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${p.bg}`}
                    // style={{ backgroundColor: cat.accent }}
                  >
                    <IconComponent size={20} />
                  </div>
                  <h3 className={`font-black ml-4 text-[16px] ${p.text}`}>
                    {cat.nom_cat}
                  </h3>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
             <span className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
               Voir tout le catalogue
             </span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ThematiqueSc;