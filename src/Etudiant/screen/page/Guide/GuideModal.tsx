import { useEffect } from "react";
import { BookOpen, FileText, X } from "lucide-react";

interface GuideModalProps {
  guide: any | null;
  onClose: () => void;
  getAssetUrl: (path: string) => string;
}

const GuideModal = ({ guide, onClose, getAssetUrl }: GuideModalProps) => {
  if (!guide) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8 bg-slate-900/90 backdrop-blur-sm z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white dark:bg-slate-800 w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors text-slate-800 dark:text-slate-200"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col lg:flex-row overflow-hidden flex-1 min-h-0">

          {/* Zone Média */}
          <div
            className="lg:w-2/3 bg-black flex items-center justify-center relative"
            style={{ minHeight: '220px', maxHeight: '50vh' }}
          >
            {guide.video ? (
              <video
                src={getAssetUrl(guide.video)}
                controls
                autoPlay
                className="w-full h-full object-contain"
                style={{ maxHeight: '50vh' }}
              />
            ) : guide.image ? (
              <img
                src={getAssetUrl(guide.image)}
                className="w-full h-full object-contain"
                alt={guide.titre}
                style={{ maxHeight: '50vh' }}
              />
            ) : guide.pdf ? (
              <iframe
                src={getAssetUrl(guide.pdf)}
                className="w-full border-none"
                style={{ height: '50vh' }}
                title="PDF Viewer"
              />
            ) : (
              <div className="p-10 text-white text-center">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Contenu textuel de l'article</p>
              </div>
            )}
          </div>

          {/* Zone Détails */}
          <div className="lg:w-1/3 p-5 sm:p-8 overflow-y-auto bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700 flex flex-col">
            <div className="mb-4 sm:mb-6">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-lg">
                {guide.categorie || 'Général'}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-3 leading-tight">
                {guide.titre}
              </h2>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {guide.description || "Ce guide vous explique étape par étape comment utiliser cette fonctionnalité. Suivez attentivement les instructions visuelles pour optimiser votre flux de travail."}
              </p>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors text-sm"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;