import React from "react";
import {
  Code2, Palette, Languages, Megaphone, Globe, Users, Award,
  Heart, TrendingUp, CheckCircle2, Shield, Zap, Star, Cpu,
  Database, Layout, Smartphone, Cloud, Lock, BarChart2,
} from "lucide-react";
import type {  ValeurItem, OffreItem, PhotoItem } from "./types_reel";

// Icon registries 

export const SERVICE_ICONS: Record<string, { icon: React.FC<any>; label: string; category: string }> = {
  Code2:      { icon: Code2,      label: "Code",         category: "Dev" },
  Palette:    { icon: Palette,    label: "Design",       category: "Design" },
  Languages:  { icon: Languages,  label: "Langues",      category: "Com" },
  Megaphone:  { icon: Megaphone,  label: "Marketing",    category: "Marketing" },
  Globe:      { icon: Globe,      label: "Globe",        category: "Com" },
  Smartphone: { icon: Smartphone, label: "Mobile",       category: "Dev" },
  Database:   { icon: Database,   label: "Base données", category: "Dev" },
  Layout:     { icon: Layout,     label: "UI",           category: "Design" },
  Cloud:      { icon: Cloud,      label: "Cloud",        category: "Dev" },
  BarChart2:  { icon: BarChart2,  label: "Analytics",    category: "Marketing" },
};

export const VALEUR_ICONS: Record<string, { icon: React.FC<any>; label: string }> = {
  CheckCircle2: { icon: CheckCircle2, label: "Vérification" },
  Users:        { icon: Users,        label: "Équipe" },
  Globe:        { icon: Globe,        label: "Globe" },
  Award:        { icon: Award,        label: "Prix" },
  Heart:        { icon: Heart,        label: "Humain" },
  TrendingUp:   { icon: TrendingUp,   label: "Croissance" },
  Shield:       { icon: Shield,       label: "Sécurité" },
  Zap:          { icon: Zap,          label: "Rapidité" },
  Star:         { icon: Star,         label: "Excellence" },
  Cpu:          { icon: Cpu,          label: "Tech" },
  Lock:         { icon: Lock,         label: "Confiance" },
};

// ── Categories & Colors ───────────────────────────────────────────────────────

export const TECH_CATEGORIES = [
  "Dev", "Design", "Marketing", "Communication", "Data", "Mobile", "Cloud", "Sécurité",
];

export const COLORS = [
  { hex: "#3B82F6", bg: "#EFF6FF", label: "Bleu" },
  { hex: "#EC4899", bg: "#FDF2F8", label: "Rose" },
  { hex: "#10B981", bg: "#ECFDF5", label: "Vert" },
  { hex: "#F97316", bg: "#FFF7ED", label: "Orange" },
  { hex: "#8B5CF6", bg: "#F5F3FF", label: "Violet" },
  { hex: "#F59E0B", bg: "#FFFBEB", label: "Ambre" },
  { hex: "#06B6D4", bg: "#ECFEFF", label: "Cyan" },
  { hex: "#EF4444", bg: "#FEF2F2", label: "Rouge" },
];

// ── Offres ────────────────────────────────────────────────────────────────────

export const TYPE_OPTIONS = ["CDI", "CDD", "Freelance", "Stage", "Alternance"];

export const TYPE_COLORS: Record<string, string> = {
  CDI: "#10B981", CDD: "#3B82F6", Freelance: "#8B5CF6", Stage: "#F59E0B", Alternance: "#F97316",
};

// ── Initial data ──────────────────────────────────────────────────────────────

export const INIT_VALEURS: ValeurItem[] = [
  { id: "v1", iconKey: "CheckCircle2", color: "#10B981", title: "Projets 100% réels",          desc: "Chaque exercice est une commande réelle d'une entreprise.", categories: ["Dev","Design"] },
  { id: "v2", iconKey: "Users",        color: "#3B82F6", title: "Mentors actifs en entreprise", desc: "Tes formateurs travaillent en entreprise.", categories: ["Dev"] },
  { id: "v3", iconKey: "Globe",        color: "#8B5CF6", title: "Réseau international",         desc: "Accès à des opportunités en Afrique et dans la diaspora.", categories: ["Communication"] },
  { id: "v4", iconKey: "Award",        color: "#F59E0B", title: "Certification reconnue",       desc: "Ton certificat est connu par nos 40+ partenaires.", categories: ["Dev","Design","Marketing"] },
  { id: "v5", iconKey: "Heart",        color: "#EC4899", title: "Accompagnement humain",        desc: "Suivi individuel, support Slack, revues hebdomadaires.", categories: ["Communication"] },
  { id: "v6", iconKey: "TrendingUp",   color: "#F97316", title: "Résultats mesurables",         desc: "94% de nos diplômés trouvent un poste en 3 mois.", categories: ["Marketing","Data"] },
];

export const INIT_OFFRES: OffreItem[] = [
  { id: "o1", role: "Développeur Full Stack",   entreprise: "TechMada",   lieu: "Antananarivo", salaire: "800 000 – 1 200 000 Ar", type: "CDI",       tags: ["React","Node.js","PostgreSQL"] },
  { id: "o2", role: "UI/UX Designer",           entreprise: "PixelCraft", lieu: "Remote",       salaire: "600 000 – 900 000 Ar",   type: "Freelance", tags: ["Figma","Branding"] },
  { id: "o3", role: "Chargé Marketing Digital", entreprise: "GrowthLab",  lieu: "Toamasina",    salaire: "700 000 Ar",             type: "CDI",       tags: ["SEO","Meta Ads","Analytics"] },
  { id: "o4", role: "Développeur Mobile",       entreprise: "AppFactory", lieu: "Antananarivo", salaire: "900 000 – 1 400 000 Ar", type: "CDD",       tags: ["Flutter","Firebase"] },
];

export const INIT_PHOTOS: PhotoItem[] = [
  { id: "p1", label: "Hackathon 2024",       desc: "Équipe gagnante du challenge IA", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80" },
  { id: "p2", label: "Workshop React",       desc: "Formation avancée front-end",     img: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=80" },
  { id: "p3", label: "Remise de certificats",desc: "Promotion Janvier 2025",          img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80" },
  { id: "p4", label: "Lab DevOps",           desc: "Déploiement cloud en live",       img: "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=600&q=80" },
];

// ── Utility ───────────────────────────────────────────────────────────────────

export const uid = () => Math.random().toString(36).slice(2, 8);

export const ITEMS_PER_PAGE = 4;