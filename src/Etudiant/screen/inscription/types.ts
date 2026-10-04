export interface Formation {
  id: number;
  titre: string;
  categorie: string;
  difficulte: string;
  nom_formateur: string;
  photo_formateur: string | null;
  duree: string;
  type: string;
  frais: number | null;
  image: string | null;
}

export interface CatalogueProps {
  activeTab: string;
  setActiveTab: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectFormation?: (f: Formation) => void;
  selectedId?: number | null;
}

export interface Categorie {
  id: number;
  nom_cat: string;
}