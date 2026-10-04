import { useState, useEffect } from "react";
import { API_URL } from "../../../../../lib/api";
import { type Article, type ArticleConfig, defaultDetailsData } from "../types";

interface UseArticlesProps {
  setArticle: (updater: (a: ArticleConfig) => ArticleConfig) => void;
  onResetEditor: () => void;
  setActiveTab: (tab: "article" | "liste") => void;
}

export function useArticles({ setArticle, onResetEditor, setActiveTab }: UseArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);

  const fetchArticles = () => {
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
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDeleteArticle = async (id: number) => {
    if (window.confirm("Es-tu sûr de vouloir supprimer cet article ?")) {
      try {
        const response = await fetch(`${API_URL}/articles/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setArticles((prevArticles) => prevArticles.filter((art) => art.id !== id));
          if (editingArticleId === id) resetArticleForm();
          console.log(`Article ${id} supprimé avec succès.`);
        } else {
          console.error("Impossible de supprimer l'article côté serveur.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const startEditArticle = (art: Article) => {
    setEditingArticleId(art.id);

    setArticle(() => ({
      bannerTitle: "",
      title: art.title,
      auteur: art.auteur,
      date: art.date,
      categorie: art.categorie || "",
      bodyText: art.bodyText,
      image: art.image
        ? art.image.replace("/storage/articles/", "/storage/public/articles/")
        : "https://placehold.co/900x400/1a2340/white?text=Image+Article",
      showComments: true,
      showSidebar: true,
      showShare: true,
    }));

    setActiveTab("article");
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setArticle(() => ({
      ...defaultDetailsData.article,
      title: "",
      auteur: "",
      date: "",
      categorie: "",
      bodyText: "",
    }));
    onResetEditor();
  };

  const toggleVisibility = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/articles/${id}/toggle-visibility`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setArticles((prev) =>
          prev.map((art) =>
            art.id === id ? { ...art, visible: data.article.visible } : art
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Date(dateStr).toLocaleDateString("fr-FR", options);
    } catch {
      return dateStr;
    }
  };

  return {
    articles,
    editingArticleId,
    setEditingArticleId,
    fetchArticles,
    handleDeleteArticle,
    startEditArticle,
    resetArticleForm,
    toggleVisibility,
    formatDate,
  };
}