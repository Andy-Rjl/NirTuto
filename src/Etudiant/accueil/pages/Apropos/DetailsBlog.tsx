import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Calendar, Tag, Facebook, Linkedin, Twitter,
  Youtube, Send, MessageCircle,
  ChevronRight, Home
} from "lucide-react";
import blogPosts from "./BlogData";
import Footer from "../../components/Footer";
import { API_URL } from "../../../../lib/api";
import NavbarAcc from "./../../components/NavbarAcc";

// --- INTERFACES ---
interface Comment {
  id: number;
  nom: string;
  email: string;
  avatar: string;
  date: string;
  texte: string;
}

interface Blog {
  id: number;
  nom: string;
}

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

interface BlogPost {
  [x: string]: any;
  id: number;
  title: string;
  image: string;
  date: string;
  categorie: string;
  auteur: string;
  excerpt: string;
  description?: string;
}

// --- DONNÉES TRADUITES ---

export default function DetailBlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id }   = useParams();

  // Récupération de l'article (via l'état de navigation ou l'ID dans l'URL)
  const post: BlogPost | undefined =
    location.state?.post ?? blogPosts.find((p: BlogPost) => p.id === Number(id));

  const [comments, setComments]     = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ nom: "", email: "", texte: "" });

  // Charger les commentaires depuis le backend en fonction de l'id du blog
  const fetchComments = () => {
    fetch(`${API_URL}/commentaires?article_id=${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la récupération des commentaires");
        return response.json();
      })
      .then((data: Comment[]) => setComments(data))
      .catch((error) => console.error("Erreur commentaires :", error));
  };

  useEffect(() => { fetchComments(); }, [id]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-gray-500 text-lg">Article introuvable.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-3 bg-[#1a2340] text-white rounded text-sm font-bold hover:bg-orange-500 transition-all">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.nom.trim() || !newComment.email.trim() || !newComment.texte.trim()) return;
    try {
      const response = await fetch(`${API_URL}/commentaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: id,
          nom: newComment.nom,
          email: newComment.email,
          texte: newComment.texte,
        }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'envoi du commentaire");
      setNewComment({ nom: "", email: "", texte: "" });
      fetchComments();
    } catch (error) {
      console.error("Erreur envoi commentaire :", error);
    }
  };

  // categorie
  const [categories, setCategories] = useState<Blog[]>([]);

  const fetchCategories = () => {
    fetch(`${API_URL}/blogcategories`)
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error(error));
  };

  useEffect(() => {
      fetchCategories();
  }, []);

  // articles recents
  const [articlesRecents, setArticleRecent] = useState<Article[]>([]);

    const fetchArticles = () => {
    fetch(`${API_URL}/articles`)
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de la récupération");
        return response.json();
      })
      .then((data) => {
        setArticleRecent(data);
      })
      .catch((error) => {
        console.error("Erreur réseau :", error);
      });
  };

  // Récupération des articles depuis le backend Laravel
  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className=" min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <NavbarAcc />

      {/* BANNIÈRE HÉRO */}
      <div className="bg-[#1a2340] mt-[95px] py-12 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3 w-full mx-auto" style={{ fontFamily: "Georgia, serif" }}>
          Détails de l'Article
        </h1>
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-2">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:text-white transition-colors">
            <Home size={11} /> Accueil
          </button>
          <span>›</span>
          <button onClick={() => navigate(-1)} className="hover:text-white transition-colors">Notre Blog</button>
          <span>›</span>
          
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className=" mx-auto max-w-7xl px-4 md:px-6 py-10 flex flex-col lg:flex-row gap-8">

        <main className="flex-1 min-w-0">
          {/* Image de l'article */}
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-5">
            <img src={post.image.replace('/storage/articles/', '/storage/public/articles/')} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full border-2 border-dashed border-white/30 pointer-events-none" />
          </div>

          {/* Méta-données */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {post.auteur?.charAt(0) ?? "A"}
              </div>
              <span className="font-semibold text-gray-700">{post.auteur}</span>
            </div>
            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
            <span className="flex items-center gap-1"><Tag size={12} /> {post.categorie}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} /> {comments.length} Commentaires</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Georgia, serif" }}>
            {post.title}
          </h2>
          <div className="text-left text-sm text-gray-600 leading-relaxed mb-4 w-full">
            <div 
              className="text-xs text-gray-500 [&_ul]:list-disc [&_ul]:pl-2 [&_ul]:ml-10 [&_ol]:list-decimal [&_ol]:pl-2 [&_ol]:ml-10 [&_li]:mt-4"
              dangerouslySetInnerHTML={{ __html: post.bodyText }}
            />
          </div>

          {/* Tags et Partage */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-100 mb-8">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Partager :</span>
              {[ { icon: Facebook, bg: "bg-blue-600" }, { icon: Linkedin, bg: "bg-blue-700" }, { icon: Twitter, bg: "bg-sky-500" }, { icon: Youtube, bg: "bg-red-600" }].map(({ icon: Icon, bg }, i) => (
                <button key={i} className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center text-white hover:opacity-80 transition-opacity`}>
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>

          {/* COMMENTAIRES */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Commentaires ({comments.length})
            </h3>
            <div className="space-y-5 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-5 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {comment.nom.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900">{comment.nom}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-2">{comment.date}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{comment.texte}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulaire */}
            <div className="border border-gray-100 rounded-lg p-6 bg-gray-50">
              <h4 className="text-base font-bold text-gray-900 mb-5" style={{ fontFamily: "Georgia, serif" }}>
                Laissez un commentaire
              </h4>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Votre nom *"
                    value={newComment.nom}
                    onChange={(e) => setNewComment({ ...newComment, nom: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm outline-none focus:ring-1 ring-blue-500 bg-white"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Votre email *"
                    value={newComment.email}
                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm outline-none focus:ring-1 ring-blue-500 bg-white"
                    required
                  />
                </div>
                <textarea
                  placeholder="Votre message *"
                  rows={4}
                  value={newComment.texte}
                  onChange={(e) => setNewComment({ ...newComment, texte: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm outline-none focus:ring-1 ring-blue-500 bg-white resize-none"
                  required
                />
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-blue-300 transition-all">
                  Envoyer <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* SIDEBAR  */}
        <aside className="w-full lg:w-[30%] flex-shrink-0 space-y-6">
          {/* Catégories */}
          <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Catégories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button key={cat.id} className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${cat.nom == post.categorie ? "bg-[#AC77E9] text-white" : "border border-gray-200 text-gray-600 hover:border-[#3D087B] hover:text-[#ac77e9]"}`}>
                  <span>{cat.nom}</span>
                  <ChevronRight size={13} className={cat.nom == post.categorie ? "text-white" : "text-gray-400"} />
                </button>
              ))}
            </div>
          </div>

          {/* Articles Récents */}
          <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Articles Récents</h3>
            <div className="space-y-4">
              {articlesRecents
                .slice(0, 2) // Découpe le tableau pour ne garder que les 2 derniers/premiers éléments
                .map((Blog) => (
                  <div key={Blog.id} className="flex gap-3 cursor-pointer group" onClick={() => navigate(`/blog/${Blog.id}`, { state: { post: Blog } })}>
                    <div className="w-14 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                      <img src={Blog.image.replace('/storage/articles/', '/storage/public/articles/')} alt={Blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5">
                        <Calendar size={9} /> {Blog.date}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {Blog.title}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Auteur */}
          <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">L'Auteur</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2340] to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {post.auteur?.charAt(0) ?? "A"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{post.auteur}</p>
                <p className="text-[10px] text-gray-400">{post.categorie}</p>
              </div>
            </div>
          </div>

        </aside>
      </div>

      <Footer />
    </div>
  );
}