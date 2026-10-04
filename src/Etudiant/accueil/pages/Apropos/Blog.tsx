import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { API_URL } from "./../../../../lib/api";

interface Article {
  id: number;
  title: string;
  auteur: string;
  date: string;
  categorie: string;
  bodyText: string;
  image: string;
  visible: number;
  created_at: string;
}

export default function Blog() {
  const [blogVisible, setBlogVisible] = useState(false);
  const blogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBlogVisible(true); },
      { threshold: 0.1 }
    );
    if (blogRef.current) observer.observe(blogRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((res) => { if (!res.ok) throw new Error("Erreur"); return res.json(); })
      .then((data) => setArticles(data))
      .catch((err) => console.error("Erreur réseau :", err));
  }, []);

  const visibleArticles = articles.filter((a) => a.visible == 1).slice(0, 3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .blog-section { font-family: 'DM Sans', sans-serif; }
        .blog-display { font-family: 'Playfair Display', serif; }

        .blog-card {
          transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
        }
        .blog-card:hover {
          box-shadow: 0 20px 50px rgba(0,169,157,0.12);
          transform: translateY(-4px);
          border-color: #00A99D;
        }

        .divider-teal {
          width: 36px; height: 2px;
          background: #00A99D;
          border-radius: 2px;
          display: inline-block;
        }
      `}</style>

      <section id="apropos" ref={blogRef} className="blog-section py-12 sm:py-16 md:py-24 bg-white overflow-hidden">
        <div className="w-full mx-auto px-4 sm:px-6">

          {/* En-tête centré */}
          <div className={`text-center mb-8 sm:mb-10 md:mb-12 transition-all duration-700 ${blogVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="divider-teal" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#00A99D]">Blog & Ressources</span>
              <span className="divider-teal" />
            </div>
            <h2 className="blog-display text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2 sm:mb-3">
              Le Coin des Passionnés
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto px-2">
              Conseils stratégiques, tutoriels approfondis et tendances du développement — un espace pour rester à l'avant-garde.
            </p>
          </div>

          {/* Grille de cartes alignées */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {visibleArticles.map((post, index) => (
              <div
                key={post.id}
                className={`blog-card bg-white rounded-2xl border border-blue-100 shadow-sm flex flex-col transition-all duration-700
                  ${blogVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Header carte */}
                <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-gray-50">
                  <img
                    src={post.image.replace('/storage/articles/', '/storage/public/articles/')}
                    alt={post.title}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="blog-display font-bold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2">{post.title}</h3>
                    <span className="text-[9px] sm:text-[10px] text-gray-400">{post.date}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow gap-2 sm:gap-3">
                  <span
                    className="inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full w-fit"
                    style={{ background: 'rgba(0,169,157,0.12)', color: '#00A99D' }}
                  >
                    {post.categorie}
                  </span>
                  <div
                    className="text-sm text-left sm:text-base md:text-lg text-gray-500 leading-relaxed line-clamp-4 flex-grow [&_ul]:list-disc [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:pl-2"
                    dangerouslySetInnerHTML={{ __html: post.bodyText }}
                  />

                  {/* Bouton */}
                  <div className="flex justify-end pt-3 sm:pt-4 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
                      className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-white text-[10px] sm:text-[11px] font-bold rounded-full transition-all duration-300 active:scale-95 group"
                      style={{ background: '#00A99D' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#008f85')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#00A99D')}
                    >
                      Lire l'article
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton bas centré */}
          <div className={`flex justify-center mt-8 sm:mt-10 transition-all duration-700 delay-500 ${blogVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button
              onClick={() => { navigate('/blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium"
              style={{ border: '1.5px solid #00A99D', color: '#00A99D', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#00A99D'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00A99D'; }}
            >
              Explorez tous les articles
            </button>
          </div>

        </div>
      </section>
    </>
  );
}