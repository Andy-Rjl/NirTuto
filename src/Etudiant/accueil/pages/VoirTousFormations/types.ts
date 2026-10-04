export interface Formation {
  id: number;
  titre: string;
  categorie: string;
  difficulte: string;
  nom_formateur: string;
  duree: string;
  type: string;
  frais: number | null;
  image: string | null;
}

export interface Categories {
  id: number;
  nom_cat: string;
}

export type PriceFilter = 'all' | 'free' | 'paid';

export const C = {
  bg:            '#429EBD',
  surface:       '#ffffff',
  surfaceAlt:    '#f8fafc',
  border:        '#e2e8f0',
  borderHover:   '#cbd5e1',
  primary:       '#2563eb',
  primaryBg:     '#eff6ff',
  primaryBorder: '#bfdbfe',
  accent:        '#0d9488',
  accentBg:      '#f0fdfa',
  accentBorder:  '#99f6e4',
  textDark:      '#023047',
  textMid:       '#475569',
  textMuted:     '#94a3b8',
  danger:        '#ef4444',
  success:       '#10b981',
  warning:       '#f59e0b',
  bgHead:        '#053F5C',
  textHead:      '#E9F4FF',
};