import {
  Trash2, Plus, Check,
  Edit3, GripVertical, Calendar,
  User, BookOpen, Edit,
} from "lucide-react";
import type { Article } from "../types";

interface ArticleListProps {
  articles: Article[];
  categories: any[];
  nom: string;
  setNom: (v: string) => void;
  editingId: any;
  handleSubmit: (e: any) => void;
  handleDelete: (id: any) => void;
  startEdit: (cat: any) => void;
  resetForm: () => void;
  startEditArticle: (art: Article) => void;
  handleDeleteArticle: (id: number) => void;
  toggleVisibility: (id: number) => void;
  formatDate: (dateStr: string) => string;
}

const INP = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#AC77E9]/40 focus:border-[#AC77E9] transition-all bg-white";

export default function ArticleList({
  articles,
  categories,
  nom,
  setNom,
  editingId,
  handleSubmit,
  handleDelete,
  startEdit,
  resetForm,
  startEditArticle,
  handleDeleteArticle,
  toggleVisibility,
  formatDate,
}: ArticleListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ── Catégories sidebar ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900">🗂 Catégories sidebar</h2>
        <div className="space-y-2">
          {categories.map((cat: any) => (
            <div key={cat.id} className="flex items-center gap-2">
              <GripVertical size={12} className="text-gray-300 shrink-0" />
              <div>
                <strong>{cat.nom}</strong>
              </div>
              <button
                onClick={() => startEdit(cat)}
                style={{ padding: "5px 10px", border: "none", cursor: "pointer" }}
              >
                <Edit size={13} />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-400 hover:text-red-600 shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
          <input
            className={INP}
            placeholder={editingId ? "Modifier la catégorie..." : "Nouvelle catégorie..."}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <button
            type="submit"
            disabled={!nom.trim()}
            className="px-4 py-2 bg-[#AC77E9] text-white text-xs font-bold rounded-lg hover:bg-[#9b60d8] shrink-0 disabled:opacity-50"
          >
            {editingId ? <Check size={13} /> : <Plus size={13} />}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-2 bg-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-400"
            >
              Annuler
            </button>
          )}
        </form>
      </div>

      {/* ── Liste des articles publiés ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="bg-[#f7f9fc] min-h-screen px-6 py-8" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          {/* En-tête */}
          <div className="mb-8 flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#AC77E9] flex items-center justify-center shadow-sm shadow-[#AC77E9]/40">
                <BookOpen size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                  Flux d'actualités
                </p>
                <h1 className="text-base font-bold text-gray-900 leading-none">Articles Publiés</h1>
              </div>
            </div>
            <span className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-full shadow-sm">
              {articles.length} au total
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm max-w-4xl mx-auto">
              <p className="text-xs text-gray-400 font-medium">Aucun article trouvé.</p>
            </div>
          ) : (
            <div className="space-y-4 w-100">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center gap-5 group relative"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 relative">
                    {art.image ? (
                      <img
                        src={art.image.replace("/storage/articles/", "/storage/public/articles/")}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BookOpen size={24} />
                      </div>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 bg-[#1a2340]/90 backdrop-blur-xs text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                      {art.categorie || "Info"}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="grow min-w-0 space-y-1.5">
                    <div className="flex flex-col items-start text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <span className="flex items-start gap-1 text-[#AC77E9]">
                        <User size={11} />
                        <span className="truncate max-w-30">{art.auteur}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[9px]">
                        <Calendar size={9} />
                        {formatDate(art.date)}
                      </span>
                    </div>
                    <h2 className="text-[12px] text-gray-900 group-hover:text-[#AC77E9] transition-colors leading-snug pr-16">
                      {art.title}
                    </h2>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 right-4 sm:static sm:flex flex-row items-center gap-1 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => startEditArticle(art)}
                      title="Modifier"
                      className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 text-gray-400 hover:text-orange-600 flex items-center justify-center transition-all mb-1 sm:mb-0"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id)}
                      title="Supprimer"
                      className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200 text-gray-400 hover:text-red-600 flex items-center justify-center transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(art.id)}
                      title={art.visible === 1 ? "Retirer du front" : "Afficher sur le front (Max 3)"}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                        art.visible == 1
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-600"
                          : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-300 hover:text-emerald-500"
                      }`}
                    >
                      <Check size={14} strokeWidth={art.visible == 1 ? 3 : 2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}