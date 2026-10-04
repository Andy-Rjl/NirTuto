// ─── Types exportés (réutilisables par BlogSc) ────────────────────────────────
export interface DetailsComment {
  id: number;
  nom: string;
  date: string;
  texte: string;
  visible: boolean;
}

export interface DetailsCategory {
  label: string;
  active: boolean;
}

export interface DetailsRecentPost {
  title: string;
  date: string;
  image: string;
}

export interface ArticleConfig {
  bannerTitle: string;
  title: string;
  image: string;
  auteur: string;
  date: string;
  categorie: string;
  bodyText: string;
  showComments: boolean;
  showSidebar: boolean;
  showShare: boolean;
}

export interface DetailsData {
  article: ArticleConfig;
}

export interface Article {
  id: number;
  title: string;
  auteur: string;
  date: string;
  categorie: string;
  bodyText: string;
  image: string | null;
  visible: number;
  created_at: string;
}

// ─── Valeur initiale exportée ────────────────────────────────────────────────
export const defaultDetailsData: DetailsData = {
  article: {
    bannerTitle: "",
    title: "",
    image: "https://placehold.co/900x400/1a2340/white?text=Image+Article",
    auteur: "",
    date: "",
    categorie: "",
    bodyText: "",
    showComments: true,
    showSidebar: true,
    showShare: true,
  },
};