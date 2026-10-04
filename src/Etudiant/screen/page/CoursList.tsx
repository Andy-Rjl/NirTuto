import { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, User } from 'lucide-react'; 
import Sidebar from '../Component/Sidebar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../../lib/api';

const CourseList = () => {
  const { id: slugOrId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formation, setFormation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Génère un slug textuel pur (sans ID)
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

  useEffect(() => {
    setLoading(true);
    let targetId = location.state?.id;

    if (!targetId && slugOrId) {
      const match = slugOrId.match(/^(\d+)-/);
      if (match) {
        targetId = match[1];
      } else {
        targetId = slugOrId; 
      }
    }

    if (!targetId) {
      setLoading(false);
      return;
    }

    const fetchCours = async () => {
      try {
        const response = await fetch(`${API_URL}/etudiant/formation/${targetId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        setFormation(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCours();
  }, [slugOrId, location.state]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-w-0">
        <div className="px-4 sm:px-6 py-4">

          {/* Bouton retour */}
          <button
            onClick={() => navigate('/dash')}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Retour</span>
          </button>

          {/* Titre de la formation */}
          {!loading && formation && (
            <h1 className="text-base font-semibold text-slate-800 mb-4">
              {formation?.titre}
            </h1>
          )}

          {loading ? (
            /* Skeleton YouTube-style */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2 animate-pulse">
                  <div className="w-full aspect-video bg-slate-200 rounded-md" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                      <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Grille YouTube */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6">
                {formation?.cours?.map((c: any, index: number) => {
                  const youtubeId = c.video_path ? null : getYoutubeId(c.url_youtube);

                  return (
                    <div
                      key={c.id}
                      className="flex flex-col cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-500"
                      onClick={() => navigate(`/player/${c.slug || slugify(c.titre)}`, { state: { id: c.id } })}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full aspect-video bg-black overflow-hidden">
                        {c.video_path ? (
                          /* Vidéo hébergée localement */
                          <video
                            src={`${API_URL.replace('/api', '')}/storage/${c.video_path}#t=10`}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        ) : c.url_youtube ? (
                          /* Fallback : vidéo YouTube */
                          youtubeId ? (
                            <img
                              src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                              alt={c.titre}
                              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                            />
                          ) : (
                            /* ID non détecté : pas d'aperçu possible, on affiche un placeholder */
                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                              <BookOpen size={24} className="text-slate-500" />
                            </div>
                          )
                        ) : (
                          /* Aucun média disponible */
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <BookOpen size={24} className="text-slate-500" />
                          </div>
                        )}

                        {/* Badge YouTube */}
                        {!c.video_path && c.url_youtube && (
                          <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm leading-none">
                            YouTube
                          </span>
                        )}

                        {/* Durée badge */}
                        <span className="absolute bottom-1 right-1 bg-black/90 text-white text-[10px] font-semibold px-1 py-0.5 rounded-sm leading-none">
                          {c.duree || '10:00'}
                        </span>
                      </div>

                      {/* Meta sous la thumbnail */}
                      <div className="flex gap-2 items-start bg-white rounded-b-md px-3 py-2.5">
                        
                        {/* Avatar Style YouTube */}
                        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-600">
                          <User size={16} />
                        </div>

                        {/* Texte */}
                        <div className="flex-1 min-w-0">
                          {/* Titre vidéo */}
                          <p className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2">
                            {c.titre}
                          </p>
                          {/* Nom de la chaîne */}
                          <p className="text-[12px] text-slate-500 mt-0.5 leading-tight truncate">
                            {formation?.titre}
                          </p>
                          {/* Vues + date */}
                          <p className="text-[12px] text-slate-500 leading-tight">
                            Leçon {index + 1} · {c.duree || '10 min'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* État vide */}
              {(!formation?.cours || formation.cours.length === 0) && (
                <div className="py-20 text-center">
                  <BookOpen size={28} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    Aucune leçon disponible pour cette formation.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseList;