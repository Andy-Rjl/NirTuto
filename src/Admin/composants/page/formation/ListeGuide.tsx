import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Trash2, Search, Plus } from "lucide-react";
import { API_URL } from "../../../lib/api";
import { useCallback, useEffect, useState } from "react";
import AjoutGuide from "./AjoutGuide";

const ListeGuide = () => {
    const token = localStorage.getItem('token');
    const [guides, setGuides] = useState<any[]>([]);
    const [activeTab] = useState("guides");
    const [, setToast] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [showGuideModal, setShowGuideModal] = useState(false);

    const fetchGuides = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/guides`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setGuides(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error("Erreur lors du chargement des guides:", error);
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === "guides") fetchGuides();
    }, [activeTab, fetchGuides]);

    const handleDeleteGuide = async (id: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce guide ?")) return;
        try {
            const response = await fetch(`${API_URL}/guides/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (response.ok) {
                setGuides(prev => prev.filter(guide => guide.id !== id));
                setToast("Guide supprimé avec succès !");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };

    const filteredGuides = guides.filter(g =>
        g.titre?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div 
            key="guides" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full space-y-4"
        >
            {/* ── TOOLBAR MISE À JOUR (Même style que Formateurs/Formations) ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 py-2">
                <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Bibliothèque des Guides</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {guides.length} ressources pédagogiques
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Recherche style Épuré */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un guide..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 w-60 transition-all shadow-sm"
                        />
                    </div>

                    <button onClick={() => setShowGuideModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-2xl transition-all shadow-md shadow-emerald-100">
                        <Plus size={14} strokeWidth={3} />
                        Nouveau Guide
                    </button>
                </div>
            </div>

            {/* ── CONTAINER TABLEAU (Design conservé selon votre demande) ── */}
            <div className="bg-white  border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400">Aperçu</th>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400">Titre du Guide</th>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400">Catégorie</th>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400">Description</th>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredGuides.length > 0 ? (
                            filteredGuides.map((guide) => (
                                <tr key={guide.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-3">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen size={16}/></div>
                                        </div>
                                    </td>
                                    <td className="p-5 font-bold text-slate-800 text-sm">{guide.titre}</td>
                                    <td className="p-5">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase">
                                            {guide.categorie}
                                        </span>
                                    </td>
                                    <td className="p-5 text-xs text-slate-500 max-w-xs">
                                        <div className="flex gap-1 flex-wrap">
                                            {guide.video && (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-pink-50 text-pink-600 border border-pink-100 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                    Vidéo
                                                </span>
                                            )}
                                            {!guide.video && guide.url_youtube && (
                                                <span className="px-2 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-md text-[9px] font-black uppercase">
                                                    Lien Youtube
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => handleDeleteGuide(guide.id)} 
                                            className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-slate-400 text-sm">
                                    Aucun guide trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <AnimatePresence>
                    {showGuideModal && (
                        <AjoutGuide onClose={() => setShowGuideModal(false)} />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default ListeGuide;