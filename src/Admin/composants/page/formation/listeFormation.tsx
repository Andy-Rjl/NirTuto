import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../../lib/api";
import AjoutFormation from "./AjoutFormation";

interface Formation {
    id: number;
    titre: string;
    type: string;
    cibles: string;
    categorie: string;
    frais: number;
    duree: string;
    nom_formateur: string;
    admin_id: number | null;
    difficulte: string;
}

const ListeFormation = () => {
    const token = localStorage.getItem('token');
    const A_URL = `${API_URL}/formations`;

    const [format, setFormat] = useState<Formation[]>([]);
    const [search, setSearch] = useState("");
    const [, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // Fonctions de récupération de données
    const fetchFormations = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const response = await fetch(`${A_URL}?page=${page}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            const dataToSet = result.data ? result.data : result;
            if (Array.isArray(dataToSet)) {
                setFormat(dataToSet);
                setLastPage(result.last_page || 1);
                setCurrentPage(result.current_page || 1);
            }
        } catch (error) {
            console.error("Erreur de chargement:", error);
        } finally {
            setLoading(false);
        }
    }, [token, A_URL]);

    useEffect(() => {
        fetchFormations(currentPage);
    }, [currentPage, fetchFormations]);

    const filteredFormations = format.filter(f =>
        f.titre?.toLowerCase().includes(search.toLowerCase())
    );

    const getDifficultyStyles = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'facile': return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case 'moyenne': return "bg-amber-50 text-amber-600 border-amber-100";
            case 'difficile': return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };
    
    const [, setErrors] = useState<{title?: string; trainer?: string}>({});
    
    // Remplacement des hooks anonymes par des states exploitables
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    
    const initialForm = {
        titre: "",
        categorie: "Bureautique",
        difficulte: "Facile",
        cibles: "",
        type: "Payante",
        prerequis: "",
        commission: "",
        frais: "",
        duree: "",
        programme: "",
        image: null,
        video: null,
    };
    const [formData, setFormData] = useState<any>(initialForm);

    // Ouvrir le modal en mode AJOUT pur
    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData(initialForm);
        setErrors({});
        setShowAddModal(true);
    };

    // Ouvrir le modal en mode MODIFICATION avec pré-remplissage
    const handleOpenEdit = (formation: Formation) => {
        setEditingId(formation.id);
        setFormData({
            titre: formation.titre || "",
            categorie: formation.categorie || "Bureautique",
            difficulte: formation.difficulte || "Facile",
            cibles: formation.cibles || "",
            type: formation.type || "Payante",
            frais: formation.frais ? formation.frais.toString() : "",
            duree: formation.duree || "",
            // Si ces champs ne sont pas présents dans la structure de la table principale, 
            // le modal ira chercher le complément ou les laissera vides pour l'instant
            prerequis: "",
            commission: "",
            programme: "",
            image: null,
            video: null,
        });
        setErrors({});
        setShowAddModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
            return;
        }

        try {
            const response = await fetch(`${A_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Si la page actuelle se vide et qu'on n'est pas à la première page, on recule d'une page
                if (format.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchFormations(currentPage);
                }
            } else {
                console.error("Échec de la suppression");
                alert("Une erreur est survenue lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur de connexion au serveur.");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full space-y-4"
        >
            {/* TOOLBAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 py-2">
                <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Catalogue de Formations</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {format.length} programmes disponibles
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une formation..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 w-60 transition-all shadow-sm"
                        />
                    </div>

                    <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-2xl transition-all shadow-md shadow-emerald-100">
                        <Plus size={14} strokeWidth={3} />
                        Nouvelle Formation
                    </button>
                </div>
            </div>

            {/* TABLEAU */}
            <div className="overflow-hidden  border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Formation</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Formateur</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Difficulté</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Durée</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredFormations.map((f, idx) => (
                            <motion.tr
                                key={f.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="group hover:bg-emerald-50/30 transition-all"
                            >
                                <td className="px-8 py-4">
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                                        {f.titre}
                                    </span>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                        {f.categorie}
                                    </span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                                            {f.nom_formateur?.charAt(0)}
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">{f.nom_formateur}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getDifficultyStyles(f.difficulte)}`}>
                                        {f.difficulte}
                                    </span>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="text-xs font-medium text-slate-500">{f.duree}</span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Attribution de la fonction handleOpenEdit au clic du Crayon */}
                                        <button 
                                            onClick={() => handleOpenEdit(f)}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(f.id)}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                <AnimatePresence>
                    {showAddModal && (
                        <AjoutFormation 
                            onClose={() => {
                                setShowAddModal(false);
                                fetchFormations(currentPage); // Rafraîchit les données après la fermeture
                            }} 
                            editingId={editingId}
                            initialData={formData}
                        />
                    )}
                </AnimatePresence>

                {/* PAGINATION */}
                {lastPage > 1 && (
                    <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Page {currentPage} sur {lastPage}
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"
                            >
                                <FaChevronLeft size={10} />
                            </button>
                            
                            {[...Array(lastPage)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                                        currentPage === i + 1 
                                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200" 
                                        : "text-slate-400 hover:bg-white border border-transparent hover:border-slate-100"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                                disabled={currentPage === lastPage}
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"
                            >
                                <FaChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ListeFormation;