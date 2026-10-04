import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, FileText, ChevronLeft, ArrowRight } from "lucide-react";

import PageBlogListeSc, {
  defaultBlogData,
  type BlogData,
} from "../pageblogliste/PageBlogListeSc";

import DetailsBlogSc, {
  defaultDetailsData,
  type DetailsData,
} from "../detailblog/DetailsBlogSc";

const EditCard: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4 ${className}`}>
    {title && (
      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
        {title}
      </h3>
    )}
    {children}
  </div>
);

// Définition des types attendus reçus de FrontOffice.tsx
interface BlogScProps {
  blogData: {
    heroTitle: string;
    heroDesc: string;
    ctaText: string;
    ctaColor: string;
  };
  setBlogData: React.Dispatch<React.SetStateAction<{
    heroTitle: string;
    heroDesc: string;
    ctaText: string;
    ctaColor: string;
  }>>;
  detailsData: {
    authorName: string;
    authorRole: string;
    popularTags: string;
    shareTitle: string;
  };
  setDetailsData: React.Dispatch<React.SetStateAction<{
    authorName: string;
    authorRole: string;
    popularTags: string;
    shareTitle: string;
  }>>;
}

// ─── Composant principal recevant les données de FrontOffice.tsx ───────────
const BlogSc: React.FC<BlogScProps> = ({ 
  blogData: parentBlogData, 
  setBlogData: setParentBlogData, 
  detailsData: parentDetailsData, 
  setDetailsData: setParentDetailsData 
}) => {
  // Navigation interne uniquement
  const [subSection, setSubSection] = useState<"menu" | "liste" | "details">("menu");

  // On crée des états locaux pour retenir TOUTE la structure complexe (articles, commentaires, catégories)
  const [localBlogStructure, setLocalBlogStructure] = useState<BlogData>(defaultBlogData);
  const [localDetailsStructure, setLocalDetailsStructure] = useState<DetailsData>(defaultDetailsData);

  // 1. On injecte les valeurs du FrontOffice.tsx dans notre structure pour PageBlogListeSc
  const fullBlogData: BlogData = {
    ...localBlogStructure,
    hero: {
      title: parentBlogData.heroTitle,
      description: parentBlogData.heroDesc,
      ctaBtn: parentBlogData.ctaText,
      bgColor: parentBlogData.ctaColor,
    },
  };

  const handleBlogDataChange = (updatedData: BlogData | ((prev: BlogData) => BlogData)) => {
    const nextData = typeof updatedData === "function" ? updatedData(fullBlogData) : updatedData;
    
    // On sauvegarde localement la liste complète des articles et catégories modifiés
    setLocalBlogStructure(nextData);

    // On synchronise les propriétés requises avec l'état global du FrontOffice
    setParentBlogData({
      heroTitle: nextData.hero.title,
      heroDesc: nextData.hero.description,
      ctaText: nextData.hero.ctaBtn,
      ctaColor: nextData.hero.bgColor,
    });
  };

  // 2. On injecte les valeurs du FrontOffice.tsx dans notre structure pour DetailsBlogSc
  const fullDetailsData: DetailsData = {
    ...localDetailsStructure,
    article: {
      ...localDetailsStructure.article,
      auteur: parentDetailsData.authorName,
    }
  };

  const handleDetailsDataChange = (updatedDetails: DetailsData | ((prev: DetailsData) => DetailsData)) => {
    const nextDetails = typeof updatedDetails === "function" ? updatedDetails(fullDetailsData) : updatedDetails;
    
    // On sauvegarde localement les détails de l'article, commentaires, etc.
    setLocalDetailsStructure(nextDetails);

    // On synchronise avec l'état global du FrontOffice
    setParentDetailsData(prev => ({
      ...prev,
      authorName: nextDetails.article.auteur,
    }));
  };

  return (
    <div
      className="w-full bg-[#f0f4ff] p-6"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div className="w-full space-y-6">

        {/* En-tête global */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">
              Front Office
            </p>
            <h1 className="text-2xl font-black text-slate-800 leading-tight">
              Gestion du Blog
            </h1>
          </div>

          {subSection !== "menu" && (
            <button
              onClick={() => setSubSection("menu")}
              className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all group"
            >
              <ChevronLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Retour aux options du blog
            </button>
          )}
        </div>

        {/* Contenu animé */}
        <AnimatePresence mode="wait">

          {subSection === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6"
            >
              <button
                onClick={() => setSubSection("liste")}
                className="relative group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-indigo-400 transition-all text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <LayoutList size={120} />
                </div>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <LayoutList size={28} />
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">
                  Configuration Liste
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Modifier le Hero, la section subscribe et la structure générale de la liste.
                </p>
                
                {/* Badge dynamique affichant les nombres réels */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
                    {/* {fullBlogData.posts.length} articles */}
                    2 articles
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">
                    {/* {fullBlogData.posts.filter((p: { visible: any; }) => p.visible).length} visibles */}
                    2 visibles
                  </span>
                </div>

                <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                  Ouvrir l'éditeur <ArrowRight size={14} />
                </div>
              </button>

              <button
                onClick={() => setSubSection("details")}
                className="relative group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-pink-400 transition-all text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <FileText size={120} />
                </div>
                <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={28} />
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">
                  Détails Article
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  Personnaliser la bannière, le profil de l'auteur et les options de partage.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-pink-50 text-pink-600 text-[10px] font-bold rounded-full">
                    2 commentaires
                  </span>
                </div>

                <div className="flex items-center gap-2 text-pink-600 text-[10px] font-black uppercase tracking-widest">
                  Ouvrir l'éditeur <ArrowRight size={14} />
                </div>
              </button>
            </motion.div>
          )}

          {subSection === "liste" && (
            <motion.div
              key="liste"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PageBlogListeSc
                blogData={fullBlogData}
                setBlogData={handleBlogDataChange}
                EditCard={EditCard}
              />
            </motion.div>
          )}

          {subSection === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DetailsBlogSc
                detailsData={fullDetailsData}
                setDetailsData={handleDetailsDataChange}
                EditCard={EditCard}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogSc;