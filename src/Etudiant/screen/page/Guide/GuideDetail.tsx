import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./../../Component/Sidebar";
import {
  ChevronLeft,
  Play,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  BookMarked,
} from "lucide-react";
import { API_URL } from "../../../../lib/api";

// ── Helpers ──
const getAssetUrl = (path: string) =>
  `${API_URL.replace("/api", "")}/storage/${path}`;

const mediaType = (guide: any): "video" | "Youtube" | "Aucun type" => {
  if (guide?.video) return "video";
  if (guide?.url_youtube) return "Youtube";
  return "Aucun type";
};

const MediaIcon = ({ guide, size = 18 }: { guide: any; size?: number }) => {
  const type = mediaType(guide);
  if (type === "video")   return <Video size={size} />;
  if (type === "Youtube")   return <Video size={size} />;
  return <BookMarked size={size} />;
};

const typeColor = (guide: any) => {
  const type = mediaType(guide);
  if (type === "video")   return "text-purple-500 bg-purple-50 dark:bg-purple-900/30 border-purple-200";
  if (type === "Youtube")   return "text-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-200";
  return "text-green-500 bg-green-50 dark:bg-green-900/30 border-green-200";
};

// ── Composant ──
const GuideDetail = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();

  const [currentGuide, setCurrentGuide] = useState<any>(null);
  const [allGuides, setAllGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const token = localStorage.getItem("token");

  // Charger guide courant + liste
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { "Accept": "application/json", "Authorization": `Bearer ${token}` };

        // Guide courant
        const resCurrent = await fetch(`${API_URL}/guides/${guideId}`, { headers });
        const currentData = await resCurrent.json();
        setCurrentGuide(currentData);

        // Tous les guides (pour la playlist latérale)
        const resAll = await fetch(`${API_URL}/guides`, { headers });
        const allData = await resAll.json();
        setAllGuides(Array.isArray(allData) ? allData : (allData.data || []));
      } catch (error) {
        console.error("Erreur chargement guide:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [guideId, token]);

  // Fermer playlist mobile à chaque changement de guide
  useEffect(() => {
    setPlaylistOpen(false);
  }, [guideId]);

  // Guides de la même catégorie (pour la playlist)
  const relatedGuides = currentGuide
    ? allGuides.filter(g => (g.categorie || "Général") === (currentGuide.categorie || "Général"))
    : allGuides;

        const getYoutubeId = (url: string) => {
    if (!url) return null;

    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.slice(1).split('/')[0] || null;
      }
      if (u.hostname.includes('youtube.com')) {
        if (u.searchParams.get('v')) return u.searchParams.get('v');
        const parts = u.pathname.split('/').filter(Boolean);
        const idx = parts.findIndex(p => ['embed', 'shorts', 'live', 'v'].includes(p));
        if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
      }
    } catch {
      // url n'est pas une URL valide, on tente le regex/l'ID brut ci-dessous
    }

    // Chaîne stockée directement sous forme d'ID (11 caractères)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

    // Filet de sécurité pour les formats non standards
    const match = url.match(/(?:v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const currentYoutubeId = getYoutubeId(currentGuide?.url_youtube);

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-900 min-w-0 pt-16 lg:pt-8">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex-shrink-0"
          >
            <ChevronLeft size={18} />
            <span className="text-xs sm:text-sm font-medium">Retour aux guides</span>
          </button>

          {currentGuide && (
            <div className="text-[10px] sm:text-xs font-mono text-slate-400 bg-slate-900 dark:bg-slate-700 px-2.5 sm:px-3 py-1 rounded-full border border-slate-800 dark:border-slate-600 truncate max-w-[160px] sm:max-w-xs">
              {currentGuide.categorie || "Général"}
            </div>
          )}
        </div>

        {/* ── Loading skeleton ── */}
        {loading ? (
          <div className="flex flex-col lg:flex-row gap-6 animate-pulse">
            <div className="flex-[2.5] aspect-video bg-slate-100 dark:bg-slate-700 rounded-3xl" />
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl" />)}
            </div>
          </div>
        ) : currentGuide ? (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">

            {/* ── Zone principale : Media + Détails ── */}
            <div className="lg:flex-[2.5] space-y-4 sm:space-y-6">

              {/* Lecteur media */}
              <div className="relative aspect-video bg-black rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10">
                {currentGuide.video ? (
                  <video
                    key={currentGuide.video}
                    src={getAssetUrl(currentGuide.video)}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : currentGuide.url_youtube ? (
                  <iframe
                    key={currentGuide?.id}
                    src={`https://www.youtube.com/embed/${currentYoutubeId}?rel=0`}
                    title={currentGuide?.titre}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
                    <BookOpen size={52} className="opacity-20" />
                    <p className="text-sm opacity-40">Contenu textuel de l'article</p>
                  </div>
                )}
              </div>

              {/* Infos du guide */}
              <div className="bg-white dark:bg-slate-800 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-xl sm:text-3xl font-bold text-slate-700 dark:text-slate-100 leading-tight">
                    {currentGuide.titre}
                  </h1>
                  {/* Badge type */}
                  <span className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${typeColor(currentGuide)}`}>
                    <MediaIcon guide={currentGuide} size={12} />
                    {mediaType(currentGuide)}
                  </span>
                </div>

                {/* Catégorie + meta */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                  <span className="flex items-center gap-1.5 bg-indigo-500 text-indigo-100 px-3 py-1 rounded-lg">
                    <BookMarked size={13} /> {currentGuide.categorie || "Général"}
                  </span>
                  {currentGuide.created_at && (
                    <>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">
                        Publié le {new Date(currentGuide.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                    <span className="text-black dark:text-white font-bold border-b-2 border-black dark:border-white mr-2">
                      Description :
                    </span>
                    {currentGuide.description ||
                      "Ce guide vous explique étape par étape comment utiliser cette fonctionnalité. Suivez attentivement les instructions visuelles pour optimiser votre flux de travail."}
                  </p>
                </div>

                {/* Contenu article si pas de media */}
                {!currentGuide.video && !currentGuide.image && !currentGuide.pdf && currentGuide.article && (
                  <div className="mt-4 prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-4">
                    {currentGuide.article}
                  </div>
                )}
              </div>
            </div>

            {/* ── Playlist latérale ── */}
            <div className="lg:flex-1 rounded-[20px] border-2 border-slate-100 dark:border-slate-700 lg:max-h-[80vh] flex flex-col overflow-hidden">

              {/* Header playlist */}
              <button
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-t-[18px] w-full text-left lg:cursor-default"
                onClick={() => setPlaylistOpen(prev => !prev)}
              >
                <h2 className="text-base sm:text-lg font-bold text-black dark:text-white">
                  Guides similaires
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-800 dark:bg-slate-700 text-slate-400 px-2 py-1 rounded-md uppercase tracking-wider font-bold">
                    {relatedGuides.length} guides
                  </span>
                  <span className="lg:hidden text-slate-500 dark:text-slate-400">
                    {playlistOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </button>

              {/* Liste */}
              <div className={`overflow-y-auto space-y-3 p-3 sm:p-4 lg:flex-1 bg-white dark:bg-slate-800 ${playlistOpen ? 'block' : 'hidden lg:block'}`}>
                {relatedGuides.map((g: any) => {
                  const isActive = g.id === currentGuide?.id;
                  const type = mediaType(g);
                  
                  const youtubeId = getYoutubeId(g.url_youtube);
                  return (
                    <button
                      key={g.id}
                      onClick={() => navigate(`/guides/${g.id}`)}
                      className={`w-full flex gap-2 sm:gap-3 p-2 rounded-2xl transition-all border text-left group ${
                        isActive
                          ? "bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/20"
                          : "bg-slate-100 dark:bg-slate-700 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-24 sm:w-32 h-16 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-black border border-white/5">
                        {g.video ? (
                          <video
                            src={`${getAssetUrl(g.video)}#t=1`}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                        ) : g.url_youtube && (
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt={g.titre}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                        )}

                        {/* Overlay play / actif */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isActive ? (
                            <div className="flex gap-1 items-end h-3">
                              <div className="w-1 bg-white animate-bounce" style={{ animationDuration: '0.5s' }} />
                              <div className="w-1 bg-white animate-bounce" style={{ animationDuration: '0.8s' }} />
                              <div className="w-1 bg-white animate-bounce" style={{ animationDuration: '0.6s' }} />
                            </div>
                          ) : (
                            <Play size={14} className="text-white opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100" />
                          )}
                        </div>

                        {/* Badge type */}
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 rounded text-[9px] font-bold text-white">
                          {type}
                        </div>
                      </div>

                      {/* Infos */}
                      <div className="flex flex-col justify-start py-1 overflow-hidden min-w-0">
                        <span className={`text-[10px] font-bold uppercase mb-0.5 flex items-center gap-1 ${isActive ? 'text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                          <MediaIcon guide={g} size={10} />
                          {g.categorie || "Général"}
                        </span>
                        <h4 className={`text-xs sm:text-sm font-bold truncate leading-tight ${
                          isActive
                            ? 'text-slate-800 dark:text-slate-100'
                            : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-100'
                        }`}>
                          {g.titre}
                        </h4>
                        {isActive && (
                          <span className="flex items-center gap-1 mt-1 text-[10px] text-indigo-500 font-medium">
                            <Play size={10} fill="currentColor" /> En lecture...
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {relatedGuides.length === 0 && (
                  <p className="text-slate-400 text-xs text-center py-8">Aucun guide similaire.</p>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Guide introuvable.</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-indigo-500 font-bold text-xs underline">
              ← Retour
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuideDetail;