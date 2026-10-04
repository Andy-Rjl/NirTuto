import { useState, useRef } from "react";
import { BookOpen } from "lucide-react";
import { API_URL } from "../../../../lib/api";

import type {
  ArticleConfig,
  DetailsData,
} from "./types";

import { useArticles } from "./hooks/useArticles";
import { useCategories } from "./hooks/useCategories";
import ArticleForm from "./components/ArticleForm";
import ArticleList from "./components/ArticleList";

// ─── Re-exports pour BlogSc ───────────────────────────────────────────────────
export type {
  DetailsComment,
  DetailsCategory,
  DetailsRecentPost,
  ArticleConfig,
  DetailsData,
} from "./types";
export { defaultDetailsData } from "./types";

interface DetailsBlogScProps {
  detailsData: DetailsData;
  setDetailsData: (data: DetailsData) => void;
  EditCard: React.FC<any>;
}

const TAB_B = "px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ";
const TAB_A = TAB_B + "border-[#AC77E9] text-[#AC77E9]";
const TAB_I = TAB_B + "border-transparent text-gray-400 hover:text-gray-700";

export default function DetailsBlogSc({ detailsData, setDetailsData }: DetailsBlogScProps) {
  const { article } = detailsData;

  const setArticle = (updater: (a: ArticleConfig) => ArticleConfig) =>
    setDetailsData({ ...detailsData, article: updater(article) });

  const [activeTab, setActiveTab] = useState<"article" | "liste">("article");
  const [saved, setSaved] = useState(false);

  // Callback transmis au hook pour vider le DOM de l'éditeur sans passer le ref
  const editorResetRef = useRef<(() => void) | null>(null);
  const onResetEditor = () => editorResetRef.current?.();

  // ── Hooks métier ────────────────────────────────────────────────────────────
  const {
    articles,
    editingArticleId,
    fetchArticles,
    handleDeleteArticle,
    startEditArticle,
    resetArticleForm,
    toggleVisibility,
    formatDate,
  } = useArticles({ setArticle, onResetEditor, setActiveTab });

  const {
    categories,
    nom,
    setNom,
    editingId,
    handleSubmit,
    handleDelete,
    startEdit,
    resetForm,
  } = useCategories();

  // ── Sauvegarde article ──────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent, selectedFile: File | null) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("auteur", article.auteur);
    formData.append("date", article.date);
    formData.append("categorie", article.categorie);
    formData.append("bodyText", article.bodyText);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (editingArticleId) {
      formData.append("_method", "PUT");
    }

    const url = editingArticleId
      ? `${API_URL}/articles/${editingArticleId}`
      : `${API_URL}/articles`;

    try {
      const response = await fetch(url, { method: "POST", body: formData });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        fetchArticles();
        resetArticleForm();
        console.log("[DetailsBlogSc] Enregistré et réinitialisé !");
      } else {
        console.error("Erreur lors de la sauvegarde de l'article");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // ── Rendu ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="bg-[#f7f9fc] rounded-2xl overflow-hidden"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* FORCE LE RESET DE TAILWIND VIA UN INJECTEUR CSS LOCAL */}
      <style>{`
        .custom-editor ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .custom-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .custom-editor li {
          display: list-item !important;
          margin-bottom: 0.25rem !important;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a2340] flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Front Office · Blog
              </p>
              <h1 className="text-sm font-bold text-gray-900 leading-none">
                DetailsBlog — {editingArticleId ? "Modifier l'article" : "Éditeur d'article"}
              </h1>
            </div>
          </div>
          {editingArticleId && (
            <button
              type="button"
              onClick={resetArticleForm}
              className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg transition-colors"
            >
              Annuler la modification
            </button>
          )}
        </div>
        <div className="px-6 flex gap-1 border-t border-gray-100">
          {(["article", "liste"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={activeTab === t ? TAB_A : TAB_I}
            >
              {{ article: " Article", liste: " Liste Blog" }[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-8">
        {/* ══ ARTICLE ══ */}
        {activeTab === "article" && (
          <ArticleForm
            article={article}
            setArticle={setArticle}
            editingArticleId={editingArticleId}
            resetArticleForm={resetArticleForm}
            onSave={handleSave}
            saved={saved}
            categories={categories}
            editorResetRef={editorResetRef}
          />
        )}

        {/* ══ LISTE BLOG ══ */}
        {activeTab === "liste" && (
          <ArticleList
            articles={articles}
            categories={categories}
            nom={nom}
            setNom={setNom}
            editingId={editingId}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            startEdit={startEdit}
            resetForm={resetForm}
            startEditArticle={startEditArticle}
            handleDeleteArticle={handleDeleteArticle}
            toggleVisibility={toggleVisibility}
            formatDate={formatDate}
          />
        )}
      </div>

      <div className="border-t border-gray-200 bg-white py-3 text-center">
        <p className="text-[10px] text-gray-400">
          Modifications synchronisées en temps réel · BlogSc → DetailsBlogSc
        </p>
      </div>
    </div>
  );
}