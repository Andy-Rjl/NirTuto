import {
    Layers, Trash2, Plus, Search, X, Check,
    BookOpen, Code2, Briefcase, Heart, Star, Zap,
    Globe, Music, Camera, Coffee, Rocket, Shield,
    ShoppingBag, Leaf, Sun, Moon, Cloud, Flame,
    Diamond, Trophy, Palette, Bell, Map, Cpu,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../../../lib/api';

interface Categorie {
    id: number;
    nom_cat: string;
    icone: string;
    couleur: string;
}

// ─── Icônes disponibles ───────────────────────────────────────────────────────
const ICONS: { id: string; component: React.ElementType }[] = [
    { id: 'Layers',      component: Layers      },
    { id: 'BookOpen',    component: BookOpen    },
    { id: 'Code2',       component: Code2       },
    { id: 'Briefcase',   component: Briefcase   },
    { id: 'Heart',       component: Heart       },
    { id: 'Star',        component: Star        },
    { id: 'Zap',         component: Zap         },
    { id: 'Globe',       component: Globe       },
    { id: 'Music',       component: Music       },
    { id: 'Camera',      component: Camera      },
    { id: 'Coffee',      component: Coffee      },
    { id: 'Rocket',      component: Rocket      },
    { id: 'Shield',      component: Shield      },
    { id: 'ShoppingBag', component: ShoppingBag },
    { id: 'Leaf',        component: Leaf        },
    { id: 'Sun',         component: Sun         },
    { id: 'Moon',        component: Moon        },
    { id: 'Cloud',       component: Cloud       },
    { id: 'Flame',       component: Flame       },
    { id: 'Diamond',     component: Diamond     },
    { id: 'Trophy',      component: Trophy      },
    { id: 'Palette',     component: Palette     },
    { id: 'Bell',        component: Bell        },
    { id: 'Map',         component: Map         },
    { id: 'Cpu',         component: Cpu         },
];

// ─── Couleurs disponibles ─────────────────────────────────────────────────────
const COLORS = [
    { id: 'indigo',  hex: '#6366f1', label: 'Indigo',   bg: 'bg-indigo-500',  light: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-600',  glow: 'shadow-indigo-200'  },
    { id: 'violet',  hex: '#8b5cf6', label: 'Violet',   bg: 'bg-violet-500',  light: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-600',  glow: 'shadow-violet-200'  },
    { id: 'rose',    hex: '#f43f5e', label: 'Rose',     bg: 'bg-rose-500',    light: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-600',    glow: 'shadow-rose-200'    },
    { id: 'amber',   hex: '#f59e0b', label: 'Ambre',    bg: 'bg-amber-500',   light: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-600',   glow: 'shadow-amber-200'   },
    { id: 'teal',    hex: '#14b8a6', label: 'Teal',     bg: 'bg-teal-500',    light: 'bg-teal-50',    border: 'border-teal-200',    text: 'text-teal-600',    glow: 'shadow-teal-200'    },
    { id: 'sky',     hex: '#0ea5e9', label: 'Ciel',     bg: 'bg-sky-500',     light: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-600',     glow: 'shadow-sky-200'     },
    { id: 'emerald', hex: '#10b981', label: 'Émeraude', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', glow: 'shadow-emerald-200' },
    { id: 'pink',    hex: '#ec4899', label: 'Rose vif', bg: 'bg-pink-500',    light: 'bg-pink-50',    border: 'border-pink-200',    text: 'text-pink-600',    glow: 'shadow-pink-200'    },
    { id: 'orange',  hex: '#f97316', label: 'Orange',   bg: 'bg-orange-500',  light: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-600',  glow: 'shadow-orange-200'  },
    { id: 'cyan',    hex: '#06b6d4', label: 'Cyan',     bg: 'bg-cyan-500',    light: 'bg-cyan-50',    border: 'border-cyan-200',    text: 'text-cyan-600',    glow: 'shadow-cyan-200'    },
    { id: 'lime',    hex: '#84cc16', label: 'Lime',     bg: 'bg-lime-500',    light: 'bg-lime-50',    border: 'border-lime-200',    text: 'text-lime-600',    glow: 'shadow-lime-200'    },
    { id: 'slate',   hex: '#64748b', label: 'Ardoise',  bg: 'bg-slate-500',   light: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-600',   glow: 'shadow-slate-200'   },
];

const getIconComponent = (id: string): React.ElementType =>
    ICONS.find(i => i.id === id)?.component ?? Layers;

const getPalette = (colorId: string) =>
    COLORS.find(c => c.id === colorId) ?? COLORS[0];

// ─────────────────────────────────────────────────────────────────────────────
const GestionCategories = () => {
    const [categories, setCategories]     = useState<Categorie[]>([]);
    const [search, setSearch]             = useState('');
    const [deleting, setDeleting]         = useState<number | null>(null);

    // Modal
    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [nomCat, setNomCat]             = useState('');
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0].id);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].id);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState('');

    const openModal = () => {
        setNomCat(''); setSelectedIcon(ICONS[0].id);
        setSelectedColor(COLORS[0].id); setError('');
        setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); setError(''); };

    const chargerCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories-liste`);
            const data = await res.json();
            setCategories(data);
        } catch (err) { console.error('Erreur de chargement', err); }
    };

    useEffect(() => { chargerCategories(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nomCat.trim()) { setError('Le nom est requis.'); return; }
        setLoading(true); setError('');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/categories-ajout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom_cat: nomCat.trim(),
                    icone:   selectedIcon,
                    couleur: selectedColor,
                }),
            });
            if (res.ok) { closeModal(); chargerCategories(); }
            else {
                const err = await res.json().catch(() => null);
                setError(err?.message ?? 'Une erreur est survenue.');
            }
        } catch { setError('Impossible de contacter le serveur.'); }
        finally  { setLoading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Supprimer cette catégorie ?')) return;
        setDeleting(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) chargerCategories();
        } catch (err) { console.error('Erreur de suppression', err); }
        finally { setDeleting(null); }
    };

    const filtered = categories.filter(c =>
        c.nom_cat?.toLowerCase().includes(search.toLowerCase())
    );

    const activePalette = getPalette(selectedColor);
    const ActiveIcon    = getIconComponent(selectedIcon);

    // Classes stylisées copiées du design d'AjoutFormation
    const inputCls = "w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all";
    const labelCls = "block text-sm font-bold text-[#303972] mb-2";

    return (
        <div className="space-y-6">

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Mes Catégories</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ml-4">
                        {categories.length} catégorie{categories.length > 1 ? 's' : ''} au total
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        type="text" placeholder="Rechercher..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-8 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all w-44 shadow-sm"
                    />
                </div>
            </div>

            {/* ── BOUTON AJOUTER ──────────────────────────────────────────── */}
            <div className="bg-white border border-slate-100 shadow-sm p-4">
                <button onClick={openModal}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-sm shadow-indigo-200"
                >
                    <Plus size={13} /> Ajouter une catégorie
                </button>
            </div>

            {/* ── MODAL HARMONISÉ (STYLE AJOUTFORMATION.TSX) ─────────────────── */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-0 sm:p-4 font-sans antialiased"
                        style={{ backdropFilter: "blur(4px)" }}
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white w-full h-full sm:h-auto lg:w-[calc(100vw-220px)] xl:w-[calc(100vw-450px)] rounded-none sm:rounded-2xl shadow-xl border border-[#EBF0FF] overflow-hidden flex flex-col"
                            style={{ maxHeight: "95vh" }}
                        >
                            {/* Global Form Wrapper */}
                            <form onSubmit={handleSubmit} className="flex flex-col h-full sm:max-h-[92vh]">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between px-8 py-5 border-b border-[#EBF0FF] shrink-0">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[#303972]">
                                            Créer une nouvelle catégorie
                                        </h2>
                                        <p className="text-xs sm:text-sm text-[#A0A3BD] mt-0.5">
                                            Renseignez les attributs visuels et textuels de la catégorie
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="p-2 rounded-full text-[#A0A3BD] hover:text-[#303972] hover:bg-gray-100 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body: 2-column layout */}
                                <div className="flex flex-1 overflow-hidden bg-white">
                                    {/* Left: Form Content */}
                                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6" style={{ scrollbarWidth: "thin" }}>
                                        
                                        {/* Champ: Nom de la catégorie */}
                                        <div className="bg-white rounded-2xl border border-[#EBF0FF] p-6 shadow-sm space-y-2">
                                            <label className={labelCls}>Nom de la catégorie <span className="text-red-500">*</span></label>
                                            <input
                                                type="text" value={nomCat} autoFocus
                                                onChange={e => { setNomCat(e.target.value); if (error) setError(''); }}
                                                placeholder="Ex : Technologie, Marketing…"
                                                className={inputCls}
                                                disabled={loading}
                                            />
                                            {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
                                        </div>

                                        {/* Champ: Sélection d'icônes */}
                                        <div className="bg-white rounded-2xl border border-[#EBF0FF] overflow-hidden shadow-sm">
                                            <div className="bg-[#5A57D6] px-6 py-3.5">
                                                <h3 className="text-white font-semibold text-base">Icône représentative</h3>
                                            </div>
                                            <div className="p-6">
                                                <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                                                    {ICONS.map(({ id, component: Icon }) => {
                                                        const isSelected = selectedIcon === id;
                                                        return (
                                                            <button key={id} type="button" onClick={() => setSelectedIcon(id)} title={id}
                                                                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 ${
                                                                    isSelected
                                                                        ? `bg-[#5A57D6] text-white border-transparent shadow-md`
                                                                        : 'bg-white text-slate-400 border-transparent hover:bg-slate-100 hover:text-slate-600'
                                                                }`}
                                                            >
                                                                <Icon size={18} />
                                                                {isSelected && (
                                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                                                        <Check size={9} className="text-white" strokeWidth={3} />
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Champ: Sélection de couleurs */}
                                        <div className="bg-white rounded-2xl border border-[#EBF0FF] overflow-hidden shadow-sm">
                                            <div className="bg-[#5A57D6] px-6 py-3.5">
                                                <h3 className="text-white font-semibold text-base">Couleur thématique</h3>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex flex-wrap gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                    {COLORS.map(color => {
                                                        const isSelected = selectedColor === color.id;
                                                        return (
                                                            <button key={color.id} type="button"
                                                                onClick={() => setSelectedColor(color.id)} title={color.label}
                                                                className={`w-8 h-8 rounded-full transition-all border-4 ${
                                                                    isSelected ? 'border-white scale-110 shadow-lg ring-2 ring-[#5A57D6]' : 'border-transparent hover:scale-105'
                                                                }`}
                                                                style={{ backgroundColor: color.hex }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Right: Preview panel (Style Akademi) */}
                                    <div className="hidden lg:flex flex-col w-80 bg-[#FDFDFF] border-l border-[#EBF0FF] p-6 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-xs font-bold text-[#303972] uppercase tracking-wide">Aperçu en direct</p>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full animate-pulse">LIVE</span>
                                        </div>

                                        <div className="flex-1 bg-white rounded-2xl border border-[#EBF0FF] shadow-sm p-5 flex flex-col items-center justify-center text-center space-y-4">
                                            
                                            {/* Container badge icône dynamique avec la palette active */}
                                            <div className={`w-20 h-20 ${activePalette.bg} rounded-3xl flex items-center justify-center text-white shadow-xl ${activePalette.glow} transition-all duration-300 transform hover:scale-105`}>
                                                <ActiveIcon size={36} />
                                            </div>

                                            <div className="space-y-1 w-full px-2">
                                                <p className="text-[10px] font-bold text-[#A0A3BD] uppercase tracking-widest">Titre affiché</p>
                                                <p className="font-bold text-[#303972] text-base truncate max-w-full">
                                                    {nomCat || <span className="text-slate-300 font-normal italic text-sm">Nom de la catégorie…</span>}
                                                </p>
                                            </div>

                                            <div className="h-px bg-[#EBF0FF] w-full" />

                                            <div className="w-full bg-[#FDFDFF] border border-[#EBF0FF] rounded-xl p-3 text-left">
                                                <div className="flex justify-between items-center text-[11px]">
                                                    <span className="text-[#A0A3BD] font-semibold">Identifiant couleur :</span>
                                                    <span className={`font-bold ${activePalette.text} px-2 py-0.5 rounded-full ${activePalette.light}`}>
                                                        {activePalette.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer - Inside Form (Style Boutons ronds Akademi) */}
                                <div className="flex items-center justify-end gap-4 px-8 py-4 border-t border-[#EBF0FF] bg-white shrink-0">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={loading}
                                        className="px-6 py-2.5 border border-[#5A57D6] text-[#5A57D6] text-sm font-bold rounded-full hover:bg-[#5A57D6]/5 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !nomCat.trim()}
                                        className={`flex items-center gap-2 px-8 py-2.5 text-white text-sm font-bold rounded-full shadow-md transition-all ${
                                            loading || !nomCat.trim() ? "bg-slate-400 cursor-not-allowed shadow-none" : "bg-[#5A57D6] hover:bg-[#4845B4]"
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                                </svg>
                                                Ajout en cours...
                                            </>
                                        ) : (
                                            <><Plus size={14} /> Ajouter la catégorie</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── GRILLE ──────────────────────────────────────────────────── */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    <AnimatePresence>
                        {filtered.map((cat, idx) => {
                            const p    = getPalette(cat.couleur);
                            const Icon = getIconComponent(cat.icone);
                            return (
                                <motion.div key={cat.id}
                                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.88 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className={`group relative bg-white rounded-2xl border ${p.border} p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default overflow-hidden`}
                                >
                                    <div className={`absolute -top-4 -right-4 w-16 h-16 ${p.light} rounded-full opacity-60`} />
                                    <div className={`relative w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center text-white shadow-md ${p.glow} mb-3`}>
                                        <Icon size={18} />
                                    </div>
                                    <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-widest leading-tight pr-4">
                                        {cat.nom_cat}
                                    </h3>
                                    <span className={`inline-block mt-2 text-[9px] font-black ${p.text} ${p.light} px-2 py-0.5 rounded-full`}>
                                        #{String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id}
                                        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                                        {deleting === cat.id ? (
                                            <svg className="animate-spin h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                            </svg>
                                        ) : (
                                            <Trash2 size={13} className="text-slate-300 hover:text-red-500 transition-colors" />
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 py-16 flex flex-col items-center justify-center gap-3 shadow-sm">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <Layers size={22} className="text-slate-400" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        {search ? 'Aucun résultat trouvé' : 'Aucune catégorie pour le moment'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GestionCategories;