export interface Evaluation {
  id: number;
  formation_id: number;
  nom: string;
  email: string;
  note: number | null;
  commentaire: string | null;
  created_at: string;
}

export interface Formation {
  slug: string | number;
  id: number;
  titre: string;
  categorie: string;
  difficulte: string;
  nom_formateur: string;
  photo_formateur: string;
  duree: string;
  type: string;
  frais: number | null;
  image: string | null;
  video: string;
  url_youtube: string | null;
  description: string;
  prerequis: string;
  programme: string;
  cibles: string;
  admin: {
    id: number;
    nom: string;
    photo: string | null;
  } | null;
}