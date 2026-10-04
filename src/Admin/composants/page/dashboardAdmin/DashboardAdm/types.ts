import type { ReactNode } from "react";

export interface Etudiant {
  id: number;
  nom: string;
  formation: string;
  nb: number;
}

export interface FormationStats {
  addedDate: ReactNode;
  deadline: ReactNode;
  nom: string;
  progression: string;
  nbEtudiants: number;
}

export interface FinanceData {
  revenu_total: number;
  graphique: Array<{ mois: string; revenu: number; profit: number }>;
}

export const F_PALETTE = [
  { bar: '#6366f1', soft: '#eef2ff', text: '#6366f1', shadow: '0 4px 14px rgba(99,102,241,0.25)' },
  { bar: '#ec4899', soft: '#fdf2f8', text: '#db2777', shadow: '0 4px 14px rgba(236,72,153,0.25)' },
  { bar: '#f59e0b', soft: '#fffbeb', text: '#d97706', shadow: '0 4px 14px rgba(245,158,11,0.25)' },
  { bar: '#10b981', soft: '#ecfdf5', text: '#059669', shadow: '0 4px 14px rgba(16,185,129,0.25)' },
  { bar: '#06b6d4', soft: '#ecfeff', text: '#0891b2', shadow: '0 4px 14px rgba(6,182,212,0.25)' },
  { bar: '#8b5cf6', soft: '#f5f3ff', text: '#7c3aed', shadow: '0 4px 14px rgba(139,92,246,0.25)' },
];