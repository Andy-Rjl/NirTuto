
export interface ValeurItem {
  id: string;
  iconKey: string;
  color: string;
  title: string;
  desc: string;
  categories: string[];
}

export interface OffreItem {
  id: string;
  role: string;
  entreprise: string;
  lieu: string;
  salaire: string;
  type: string;
  tags: string[];
}

export interface PhotoItem {
  id: string;
  label: string;
  desc: string;
  img: string;
}