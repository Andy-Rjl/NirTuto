import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./../../Component/Sidebar";
import { Play, BookOpen, FileText, BookMarked, Video } from "lucide-react";
import { API_URL } from "../../../../lib/api";

// ── Card helper ──
const StatCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 rounded-xl border shadow-sm ${className}`}>{children}</div>
);

// ── Composant Principal ──
const Guide = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const token = localStorage.getItem("token");

  const categories = ["Tous", ...Array.from(new Set(guides.map((g) => g.categorie || "Général")))];

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await fetch(`${API_URL}/guides`, {
          headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setGuides(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Erreur lors du chargement des guides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, [token]);

  const filteredGuides = selectedCategory === "Tous"
    ? guides
    : guides.filter(g => (g.categorie || "Général") === selectedCategory);

  const getAssetUrl = (path: string) =>
    `${API_URL.replace("/api", "")}/storage/${path}`;

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


  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 lg:ml-64 flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0 pt-16 lg:pt-8">

        {/* En-tête */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase flex items-baseline gap-2 flex-wrap">
            Guides
            <span className="text-indigo-500 text-sm font-bold">({guides.length})</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Apprenez à maîtriser la plateforme en quelques minutes.
          </p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <BookMarked className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-tighter">Lien YouTube</p>
                  <p className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-100 text-left">{guides.filter(g => g.url_youtube).length}</p>
                </div>
              </div>
            </StatCard>

            <StatCard className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <Video className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase tracking-tighter">Vidéos</p>
                  <p className="text-xl sm:text-2xl font-black text-purple-900 dark:text-purple-100 text-left">{guides.filter(g => g.video).length}</p>
                </div>
              </div>
            </StatCard>
          </div>
        )}

        {/* Filtres catégories */}
        {!loading && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 py-2 h-8 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${
                  category === selectedCategory
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Grille guides */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <>
            {/* Modification  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredGuides.map((guide) => {
                const youtubeId = getYoutubeId(guide.url_youtube);
                return (
                <div
                  key={guide.id}
                  onClick={() => navigate(`/playerguide/${guide.id}`)}
                  className={`relative group  p-3 shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 ${
                    guide.url_youtube
                      ? "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      : guide.video
                      ? "bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      : "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-[180px] sm:h-[200px] w-full rounded-2xl overflow-hidden bg-slate-900">
                    {guide.video ? (
                      <video src={`${getAssetUrl(guide.video)}#t=1`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : guide.url_youtube && (
                      <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt={guide.titre} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all">
                      <div className="bg-white/20 backdrop-blur-md p-3 sm:p-4 rounded-full">
                        <Play size={26} fill="white" className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="mt-3 px-2 pb-2">
                    <h4 className="text-slate-800 dark:text-slate-100 font-bold text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {guide.titre}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">
                      {guide.categorie || 'Général'}
                    </p>
                  </div>
                </div>
                );
})}
            </div>

            {filteredGuides.length === 0 && (
              <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-4">
                <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">Aucun guide disponible.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Guide;