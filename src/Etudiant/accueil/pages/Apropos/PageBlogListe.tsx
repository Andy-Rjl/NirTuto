import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Search, 
  Facebook, Twitter, Linkedin, Youtube
} from "lucide-react";
import Footer from "./../../components/Footer";
import { API_URL } from "../../../../lib/api";
import NavbarAcc from "../../components/NavbarAcc";

interface Article {
  id: number;
  title: string;
  auteur: string;
  date: string;
  categorie: string;
  bodyText: string;
  image: string;
  created_at: string;
}

interface Blog {
  id: number;
  nom: string;
}

export default function PageBlogListe() {
  const [searchTerm, setSearchTerm]   = useState("");
  const [, setEmail]                  = useState("");
  // 1. Initialiser à "Toutes" pour voir tous les articles par défaut
  const [selectedCat, setSelectedCat] = useState("Toutes"); 
  const [config, setConfig]           = useState<any>(null);
  const navigate                      = useNavigate();
  const [articles, setArticles]       = useState<Article[]>([]);
  const [categories, setCategories]   = useState<Blog[]>([]);

  // Scroll en haut à chaque fois que la page est montée
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/blog`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Erreur config", err));
  }, []);

  // Récupération des articles depuis le backend Laravel
  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la récupération");
        return response.json();
      })
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => {
        console.error("Erreur réseau :", error);
      });
  }, []);

  // Récupération des catégories
  const fetchCategories = () => {
    fetch(`${API_URL}/blogcategories`)
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error(error));
  };

  useEffect(() => {
      fetchCategories();
  }, []);

  // 2. Filtrage des articles (par catégorie ET par barre de recherche en bonus)
  const filteredArticles = articles.filter((post) => {
    const matchesCategory = selectedCat === "Toutes" || post.categorie === selectedCat;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.bodyText.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      <NavbarAcc />

      {/* ── HERO ── */}
      <div 
        style={{ backgroundColor: config?.cta_color || "#B1C9EF" }} 
        className="mt-[95px] py-12 text-center border-b border-gray-200"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          {config?.hero_title}
        </h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed px-4">{config?.hero_desc}</p>
        <button onClick={() => navigate("/connexion", { state: { signup: true } })} className="mt-6 px-7 py-2 bg-[#4fc3c0] text-white text-sm font-semibold rounded-sm hover:bg-[#3aafac] transition-all">
          {config?.cta_text}
        </button>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-12 flex flex-col lg:flex-row gap-12 flex-grow">

        {/* LISTE ARTICLES — colonne gauche */}
        <section className="flex-1 min-w-0 divide-y divide-gray-100">
          {/* 3. Utilisation du tableau filtré ici au lieu de 'articles' */}
          {filteredArticles.length > 0 ? (
            filteredArticles.map((post) => (
              <article key={post.id} className="flex gap-5 py-8 first:pt-0">

                {/* Thumbnail */}
                <div
                  className="w-36 h-24 flex-shrink-0 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
                >
                  <img src={post.image.replace('/storage/articles/', '/storage/public/articles/')}
                    alt={post.title}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-300"
                  />
                </div>

                {/* Texte */}
                <div className="flex-1 min-w-0 text-left">
                  <h2
                    className="text-base font-bold text-gray-900 leading-snug mb-1 hover:text-[#279feaed] transition-colors cursor-pointer"
                    onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
                  >
                    {post.title}
                  </h2>
                  <p className="text-xs text-[#8b3601] font-medium mb-2">
                    by {post.auteur}&nbsp;&nbsp;|&nbsp;&nbsp;{post.date} <span className="text-gray-400">({post.categorie})</span>
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {post.bodyText.replace(/<[^>]*>/g, '')}
                  </p>
                  <button
                    onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
                    className="inline-block px-3 py-1 border border-[#4fc3c0] text-[#5B5BEB]] text-[11px] font-semibold hover:bg-[#5B5BEB] hover:text-white transition-all"
                  >
                    Read More
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500 py-8">Aucun article trouvé pour cette sélection.</p>
          )}

          {/* Older Entries */}
          <div className="pt-4">
            <button className="flex items-center gap-1 text-xs text-[#4fc3c0] hover:underline font-medium">
              « Older Entries
            </button>
          </div>
        </section>

        {/* SIDEBAR — colonne droite  */}
        <aside className="w-full lg:w-[30%] flex-shrink-0 space-y-7" style={{ fontFamily: "'Arial', sans-serif" }}>

          {/* Meet The Author */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest border-b border-gray-200 pb-2">
              Visiter l'auteur
            </h3>
            <div className="flex items-start gap-2.5">
              <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-sm bg-gray-200">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
              </div>
              <p className="text-[11px] text-left text-gray-500 leading-relaxed">
               "Passionné par le développement et les nouvelles technologies, j'ai passé des heures à tester ces plateformes pour ne retenir que celles qui offrent une réelle progression..." </p>
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-widest border-b border-gray-200 pb-2">
              Nous suivre
            </h3>
            <p className="text-[11px] text-gray-400 mb-2">Abonnez-vous</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Partager:</span>
              {[
                { icon: Facebook,  bg: "bg-blue-600" },
                { icon: Linkedin,  bg: "bg-blue-700" },
                { icon: Twitter,   bg: "bg-sky-500"  },
                { icon: Youtube,   bg: "bg-red-600"  },
              ].map(({ icon: Icon, bg }, i) => (
                <button key={i} className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center text-white hover:opacity-80 transition-opacity`}>
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-widest border-b border-gray-200 pb-2">
              Categories
            </h3>
            <div className="relative">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 text-xs text-gray-600 outline-none focus:ring-1 ring-[#4fc3c0] bg-white appearance-none cursor-pointer"
              >
                {/* 4. Option par défaut pour tout afficher */}
                <option value="Toutes">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                ))}
              </select>
              <ChevronRight size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest border-b border-gray-200 pb-2">
              Poste recent
            </h3>
            <ul className="space-y-2.5 flex items-start flex-col">
              {articles.slice(0, 5).map((post) => ( // Limité à 5 pour l'esthétique
                <li key={post.id}>
                  <button 
                    onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
                    className="text-[11px] text-gray-600 hover:text-[#4fc3c0] transition-colors text-left leading-snug"
                  >
                    {post.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Search widget */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-widest border-b border-gray-200 pb-2">
              Search
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-[1.5rem] border border-gray-300 text-xs outline-none focus:ring-1 ring-[#4195de]"
              />
              <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

        </aside>
      </main>

      {/* SUBSCRIBE */}
      <div className="bg-gray-100 border-t border-gray-200 py-14 text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
           Commencez à apprendre dès maintenant
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
           Rejoignez des passionnés d'informatique. L'inscription prend moins de 30 secondes.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
          className="flex flex-col sm:flex-row items-center justify-center max-w-sm mx-auto"
        >
          <button
            onClick={() => navigate("/connexion", { state: { signup: true } })}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#4fc3c0] text-white text-sm font-semibold hover:bg-[#3aafac] transition-all whitespace-nowrap"
          >
            c'est parti!
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}