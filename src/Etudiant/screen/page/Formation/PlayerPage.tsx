import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Ajout de useLocation
import { ChevronLeft, Play, CheckCircle2, ChevronDown, ChevronUp, Download, Check, ArrowLeft } from 'lucide-react';
import Sidebar from '../../Component/Sidebar';
import { API_URL } from '../../../../lib/api';
 
const PlayerPage = () => {
  const { coursId: slugOrId } = useParams(); // Récupère le slug textuel de la barre d'adresse
  const navigate = useNavigate();
  const location = useLocation(); // Reçoit le state masqué { id: ... }
  
  const [formation, setFormation] = useState<any>(null);
  const [currentCours, setCurrentCours] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [justCompleted, setJustCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasMarkedRef = useRef(false);

  // États pour le look YouTube et les fonctionnalités
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fonction utilitaire pour générer un slug textuel propre
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        
      .replace(/[^\w\-]+/g, '')    
      .replace(/\-\-+/g, '-');     
  };

  // Extrait l'ID d'une vidéo YouTube à partir de différents formats d'URL
  // (watch?v=, youtu.be/, /embed/, /shorts/, /live/, avec ou sans paramètres additionnels)
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

  // La leçon en cours utilise-t-elle YouTube (pas de vidéo hébergée localement) ?
  const isYoutube = !currentCours?.video_path && !!currentCours?.url_youtube;
  const currentYoutubeId = isYoutube ? getYoutubeId(currentCours.url_youtube) : null;
 
  useEffect(() => {
    const fetchFullData = async () => {
      try {
        // 1. Récupération de l'ID masqué depuis le state de navigation
        let targetId = location.state?.id;

        // 2. Sécurité F5 : Si l'utilisateur a actualisé, le state est perdu.
        // Si votre API supporte les slugs, targetId prend la valeur brute. Sinon, on tente de l'isoler si présent.
        if (!targetId && slugOrId) {
          targetId = slugOrId; 
        }

        // Requête vers le cours
        const resCours = await fetch(`${API_URL}/cours/${targetId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const coursData = await resCours.json();
        setCurrentCours(coursData);

        // Requête vers la formation associée
        const resForm = await fetch(`${API_URL}/etudiant/formation/${coursData.formation_id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const formData = await resForm.json();
        setFormation(formData);

        // Requête de progression
        const resProg = await fetch(
          `${API_URL}/etudiant/formation/${coursData.formation_id}/progression`,
          { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
        );
        if (resProg.ok) {
          const progData = await resProg.json();
          setCompletedIds(progData.completed_ids || []);
        }
      } catch (error) {
        console.error("Erreur de chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [slugOrId, location.state]); // S'exécute à chaque changement de cours
 
  useEffect(() => {
    setPlaylistOpen(false);
    hasMarkedRef.current = false;
    setJustCompleted(false);
    setIsDescriptionExpanded(false); 
  }, [slugOrId]);
 
  const markAsCompleted = async (id: number) => {
    if (hasMarkedRef.current || completedIds.includes(id)) return;
    hasMarkedRef.current = true;
 
    try {
      const res = await fetch(`${API_URL}/etudiant/cours/${id}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        setCompletedIds(prev => [...prev, id]);
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 3000);
      }
    } catch (e) {
      console.error("Erreur marquage cours:", e);
    }
  };
 
  const handleVideoEnded = () => {
    if (currentCours?.id) markAsCompleted(currentCours.id);
  };
 
  const handleDownload = async () => {
    if (!currentCours || isDownloading || isYoutube) return;
    setIsDownloading(true);

    const videoUrl = `${API_URL.replace("/api", "")}/storage/${currentCours.video_path}`;
    
    try {
      const response = await fetch(videoUrl, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("Erreur lors du téléchargement");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      
      const fileName = `${currentCours.titre || "video"}`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `${fileName}.mp4`;
      
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      markAsCompleted(currentCours.id);
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      alert("Impossible de télécharger la vidéo. Le fichier est peut-être inaccessible.");
    } finally {
      setIsDownloading(false);
    }
  };
 
  const totalCours = formation?.cours?.length || 0;
  const progressPercent = totalCours > 0
    ? Math.round((completedIds.length / totalCours) * 100)
    : 0;

  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
 
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0f0f0f] font-sans">
      <Sidebar />
 
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-6 bg-white dark:bg-[#0f0f0f] min-w-0 pt-16 lg:pt-4">
        
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2.5 text-[#0f0f0f] dark:text-white hover:bg-slate-100 dark:hover:bg-[#272727] p-2 rounded-full transition-colors group"
            aria-label="Retour"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium pr-2 hidden sm:inline">Retour aux leçons</span>
          </button>
        </div>
 
        {/* Toast de confirmation */}
        {justCompleted && (
          <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-slate-800 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-4">
            <CheckCircle2 size={18} className="text-green-400" /> Leçon marquée comme terminée
          </div>
        )}
 
        {loading ? (
          <div className="flex flex-col lg:flex-row gap-6 animate-pulse mt-4">
            <div className="flex-[2.5] aspect-video bg-slate-200 dark:bg-[#272727] rounded-xl" />
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 dark:bg-[#272727] rounded-xl" />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-6">
 
            {/* COMPOSANT GAUCHE : LECTEUR & DETAILS YOUTUBE */}
            <div className="xl:flex-[2.8] space-y-4">
              
              {/* Aspect-Ratio Vidéo */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
                {isYoutube ? (
                  currentYoutubeId ? (
                    /* Lecteur YouTube (via ID détecté dans l'URL) */
                    <iframe
                      key={currentCours?.id}
                      src={`https://www.youtube.com/embed/${currentYoutubeId}?rel=0`}
                      title={currentCours?.titre}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    /* ID YouTube non détecté : YouTube refuse l'intégration des URLs "watch"
                       dans une iframe, donc on propose un lien externe plutôt qu'un embed cassé */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white">
                      <Play size={40} className="text-white/70" />
                      <p className="text-sm text-white/80">Impossible d'intégrer cette vidéo ici</p>
                      <a
                        href={currentCours?.url_youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                      >
                        Regarder sur YouTube
                      </a>
                    </div>
                  )
                ) : (
                  /* Vidéo hébergée localement */
                  <video
                    ref={videoRef}
                    key={currentCours?.video_path}
                    src={`${API_URL.replace("/api", "")}/storage/${currentCours?.video_path}`}
                    controls
                    autoPlay
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
 
              {/* Titre et Rangée des boutons */}
              <div className="flex flex-col pb-2 border-b border-slate-200 dark:border-slate-800/50">
                <h1 className="text-[20px] font-bold text-[#0f0f0f] dark:text-white leading-tight mb-3">
                  {currentCours?.titre}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Profil Formation */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {formation?.titre?.charAt(0).toUpperCase() || 'F'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#0f0f0f] dark:text-white text-[15px] truncate max-w-[200px] sm:max-w-[300px]">
                        {formation?.titre}
                      </span>
                      <span className="text-xs text-[#606060] dark:text-[#aaaaaa]">
                        Leçon {formation?.cours?.findIndex((c:any) => c.id === currentCours?.id) + 1} sur {totalCours}
                      </span>
                    </div>
                  </div>

                  {/* Actions Pilules */}
                  <div className="flex items-center gap-2">
                    {completedIds.includes(currentCours?.id) && (
                      <div className="hidden sm:flex items-center gap-1.5 bg-[#f2f2f2] dark:bg-[#272727] text-[#0f0f0f] dark:text-white px-4 py-2 rounded-full text-sm font-medium">
                        <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                        <span>Visionné</span>
                      </div>
                    )}
                    
                    {!isYoutube && (
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`flex items-center gap-2 bg-[#f2f2f2] dark:bg-[#272727] hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f] text-[#0f0f0f] dark:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors ${isDownloading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <Download size={18} className={isDownloading ? 'animate-bounce' : ''} />
                        <span>{isDownloading ? "Téléchargement..." : "Télécharger"}</span>
                      </button>
                    )}

                    {isYoutube && !completedIds.includes(currentCours?.id) && (
                      <button
                        onClick={() => markAsCompleted(currentCours.id)}
                        className="flex items-center gap-2 bg-[#f2f2f2] dark:bg-[#272727] hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f] text-[#0f0f0f] dark:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        <Check size={18} />
                        <span>Marquer comme terminé</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Boite description extensible */}
              <div 
                className="bg-[#f2f2f2] dark:bg-[#272727] rounded-xl p-3 sm:p-4 text-sm transition-all duration-200 cursor-pointer hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f]"
                onClick={() => !isDescriptionExpanded && setIsDescriptionExpanded(true)}
              >
                <div className="flex gap-2 font-medium text-[#0f0f0f] dark:text-white mb-1">
                  <span>{currentCours?.duree || '10:00'} min</span>
                  <span>•</span>
                  <span>{today}</span>
                </div>
                
                <div className={`text-[#0f0f0f] dark:text-white whitespace-pre-wrap leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                  {currentCours?.description || "Cette leçon fait partie du module complet. Suivez attentivement les instructions de la vidéo pour valider cette étape."}
                </div>

                <button 
                  className="font-medium mt-2 text-[#0f0f0f] dark:text-white hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDescriptionExpanded(!isDescriptionExpanded);
                  }}
                >
                  {isDescriptionExpanded ? "Moins" : "...plus"}
                </button>
              </div>

            </div>
 
            {/* COMPOSANT DROIT : PLAYLIST DE COURS */}
            <div className="xl:flex-1 lg:max-w-[400px]">
              <div className="border border-slate-200 dark:border-[#272727] rounded-xl overflow-hidden flex flex-col xl:max-h-[85vh]">
                
                <div className="p-4 bg-white dark:bg-[#0f0f0f] border-b border-slate-200 dark:border-[#272727]">
                  <h2 className="text-base font-bold text-[#0f0f0f] dark:text-white leading-tight mb-1">
                    Contenu de la formation
                  </h2>
                  <p className="text-xs text-[#606060] dark:text-[#aaaaaa]">
                    {formation?.titre} - {completedIds.length}/{totalCours} terminés
                  </p>
                  
                  {totalCours > 0 && (
                    <div className="h-1 w-full bg-slate-200 dark:bg-[#272727] mt-3">
                      <div
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
 
                <div className="overflow-y-auto p-2 bg-white dark:bg-[#0f0f0f] space-y-1">
                  {formation?.cours?.map((c: any, index: number) => {
                    const isActive = c.id === currentCours?.id;
                    const isDone = completedIds.includes(c.id);
                    const cYoutubeId = c.video_path ? null : getYoutubeId(c.url_youtube);

                    return (
                      <button
                        key={c.id}
                        onClick={() => navigate(`/player/${c.slug || slugify(c.titre)}`, { state: { id: c.id } })}
                        className={`w-full flex gap-2 p-2 rounded-lg transition-colors text-left group ${
                          isActive ? "bg-slate-100 dark:bg-[#272727]" : "hover:bg-slate-50 dark:hover:bg-[#272727]/50"
                        }`}
                      >
                        <div className="relative w-[100px] sm:w-[120px] aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-black">
                          {c.video_path ? (
                            <video src={`${API_URL.replace("/api", "")}/storage/${c.video_path}#t=10`} className="w-full h-full object-cover" />
                          ) : cYoutubeId ? (
                            <img
                              src={`https://img.youtube.com/vi/${cYoutubeId}/hqdefault.jpg`}
                              alt={c.titre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-800" />
                          )}

                          <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] font-medium text-white">
                            {c.duree || '10:00'}
                          </div>
                          
                          {(isActive || isDone) && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              {isActive ? <Play size={20} className="text-white fill-white" /> : <Check size={20} className="text-white" />}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col flex-1 py-0.5 overflow-hidden">
                          <h4 className="text-[13px] font-medium line-clamp-2 leading-tight text-[#0f0f0f] dark:text-white">
                            {c.titre}
                          </h4>
                          <span className="text-[12px] text-[#606060] dark:text-[#aaaaaa] mt-1">
                            Leçon {index + 1}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};
 
export default PlayerPage;