import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch, FaTrash, FaFilePdf, FaComments, FaUserCircle,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { API_URL } from "./../../../lib/api";

interface Candidat {
  id: number;
  nom: string;
  email: string;
  contact: string;
  formation: string;
  cv: string;
  cv_url?: string;
  statut?: "Accepté" | "Refusé" | "En attente";
}


/* Génère des initiales colorées par avatar */
const avatarColors = [
  "bg-violet-500","bg-sky-500","bg-emerald-500","bg-rose-500",
  "bg-amber-500","bg-indigo-500","bg-teal-500","bg-pink-500",
];
const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];
const getInitials    = (nom: string) =>
  nom.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const Recrutement = () => {
  const [searchTerm, setSearchTerm]     = useState("");
  const [showCV, setShowCV]             = useState(false);
  const [showEntretien, setShowEntretien] = useState(false);
  const [selected, setSelected]         = useState<any>(null);
  const [selectedCV, setSelectedCV]     = useState<string | null>(null);
  const [candidats, setCandidats]       = useState<Candidat[]>([]);
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch(`${API_URL}/candidatures`)
      .then((r) => r.json())
      .then(setCandidats)
      .catch(console.error);
  }, []);

  const filtered = candidats.filter(
    (c) =>
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages     = Math.ceil(filtered.length / itemsPerPage);
  const indexOfFirst   = (currentPage - 1) * itemsPerPage;
  const currentItems   = filtered.slice(indexOfFirst, indexOfFirst + itemsPerPage);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cette candidature ?")) return;
    const res = await fetch(`${API_URL}/candidatures/${id}`, { method: "DELETE" });
    if (res.ok) setCandidats((prev) => prev.filter((c) => c.id !== id));
    else alert("Erreur lors de la suppression");
  };


  return (
    <div
      className="min-h-full p-6 space-y-6"
      style={{ background: "#F4F6FA", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── TOPBAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Recrutement
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
            <input
              type="text"
              placeholder="Rechercher un candidat…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 font-medium placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 w-56 shadow-sm"
            />
          </div>

        </div>
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-white  shadow-sm border border-slate-100 overflow-hidden">
        

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3 w-8">
                <input type="checkbox" className="rounded accent-indigo-600" />
              </th>
              <th className="px-4 py-3">Candidat</th>
              <th className="px-4 py-3">Formation</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {currentItems.map((c, i) => {
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Checkbox */}
                    <td className="px-6 py-3.5">
                      <input type="checkbox" className="rounded accent-indigo-600" />
                    </td>

                    {/* Candidat */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 ${getAvatarColor(c.id)}`}
                        >
                          {getInitials(c.nom)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{c.nom}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Formation */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-slate-600">{c.formation}</span>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5 text-sm text-slate-500 font-medium">
                      0{c.contact}
                    </td>

                    

                    {/* Date fictive */}
                    <td className="px-4 py-3.5 text-[12px] text-slate-400 font-medium">
                      {new Date().toLocaleDateString("fr-FR")}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedCV(c.cv_url || null); setShowCV(true); }}
                          title="Voir le CV"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all"
                        >
                          <FaFilePdf size={11} /> CV
                        </button>
                        <button
                          onClick={() => { setSelected(c); setShowEntretien(true); }}
                          title="Entretien"
                          className="p-1.5 bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white rounded-lg transition-all"
                        >
                          <FaComments size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          title="Supprimer"
                          className="p-1.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>

            {currentItems.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-300 text-sm font-semibold">
                  <FaUserCircle size={36} className="mx-auto mb-3 opacity-30" />
                  Aucun candidat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ── PAGINATION ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Page {currentPage} / {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={13} /> Précédent
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Suivant <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL CV ── */}
      <AnimatePresence>
        {showCV && selectedCV && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCV(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="relative bg-white w-full max-w-5xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <FaFilePdf className="text-red-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600">
                    Curriculum Vitae
                  </span>
                </div>
                <button onClick={() => setShowCV(false)} className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 bg-slate-100">
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedCV)}&embedded=true`}
                  className="w-full h-full border-none"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL ENTRETIEN ── */}
      <AnimatePresence>
        {showEntretien && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Entretien</p>
                  <h3 className="text-lg font-black text-slate-800">{selected?.nom}</h3>
                </div>
                <button onClick={() => setShowEntretien(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date</label>
                  <input type="date" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Note /10</label>
                  <input type="number" min={0} max={10} placeholder="—" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Décision</label>
                <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none">
                  <option>En attente</option>
                  <option>Accepté</option>
                  <option>Refusé</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Commentaire RH</label>
                <textarea className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 h-20 resize-none" placeholder="Observations…" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEntretien(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                  Annuler
                </button>
                <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recrutement;