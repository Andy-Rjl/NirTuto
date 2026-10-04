import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Library, ArrowLeft, ChevronRight, RefreshCw, BookOpen, CheckCircle, Clock } from "lucide-react";
import { API_URL } from "./../../../lib/api";

interface Student {
  photo: any;
  nom: string;
  prenom: string;
  email: string;
  formation: string;
  formation_id?: number;
  progress: string;
  id?: number;
}

// Progress bar légère 
const ProgressBar = ({ percent }: { percent: number }) => {
  const gradient =
    percent < 30
      ? "from-red-400 to-rose-400"
      : percent < 70
      ? "from-orange-400 to-amber-400"
      : "from-emerald-400 to-green-500";
  const label =
    percent < 30 ? "text-rose-500" : percent < 70 ? "text-amber-500" : "text-emerald-500";

  return (
    <div className="space-y-1 mt-3">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Progression</span>
        <span className={`text-[10px] font-black ${label}`}>{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full bg-linear-to-r ${gradient}`}
        />
      </div>
    </div>
  );
};

// Badge statut 
const StatusBadge = ({ pct }: { pct: number }) => {
  if (pct === 100)
    return <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">Terminé</span>;
  if (pct >= 70)
    return <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full">Avancé</span>;
  if (pct >= 30)
    return <span className="text-[9px] font-black bg-orange-50 text-orange-500 border border-orange-100 px-2 py-0.5 rounded-full">En cours</span>;
  return <span className="text-[9px] font-black bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full">Débuté</span>;
};

const STUDENTS_PER_PAGE = 5;

interface FormationSuiviProps {
  allCategories: string[];
  etudiants: any[];
  categoryProgressions: Record<string, number>;
  progressionMap: Record<string, { completed: number; total: number; percent: number }>;
  loadingProgression: Record<string, boolean>;
  selectedFormation: { titre: string; isCategory: boolean } | null;
  setSelectedFormation: (f: { titre: string; isCategory: boolean } | null) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (s: Student | null) => void;
  loadStudentProgression: (student: Student, force?: boolean) => void;
}

const FormationSuivi = ({
  allCategories,
  etudiants,
  categoryProgressions,
  progressionMap,
  loadingProgression,
  selectedFormation,
  setSelectedFormation,
  selectedStudent,
  setSelectedStudent,
  loadStudentProgression,
}: FormationSuiviProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when formation changes
  const handleSetSelectedFormation = (f: { titre: string; isCategory: boolean } | null) => {
    setCurrentPage(1);
    setSelectedFormation(f);
  };

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">

        {/* ── Niveau 1 : liste des catégories ── */}
        {!selectedFormation && (
          <motion.div
            key="f-list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {allCategories.map((cat, index) => {
              const studentsInCat = etudiants.filter((etud) => {
                const etudCat = etud.categorie || etud.formation_categorie || "";
                return etudCat.trim().toLowerCase() === cat.trim().toLowerCase();
              });
              const avgProgress =
                studentsInCat.length > 0
                  ? Math.round(
                      studentsInCat.reduce((acc, s) => {
                        const k = `${s.id}-${s.formation_id}`;
                        return acc + (categoryProgressions[k] ?? 0);
                      }, 0) / studentsInCat.length
                    )
                  : 0;

              const accentColors = [
                { bg: "bg-indigo-50", icon: "text-indigo-500", iconBg: "bg-indigo-100" },
                { bg: "bg-emerald-50", icon: "text-emerald-500", iconBg: "bg-emerald-100" },
                { bg: "bg-orange-50", icon: "text-orange-500", iconBg: "bg-orange-100" },
                { bg: "bg-violet-50", icon: "text-violet-500", iconBg: "bg-violet-100" },
                { bg: "bg-cyan-50", icon: "text-cyan-500", iconBg: "bg-cyan-100" },
                { bg: "bg-rose-50", icon: "text-rose-500", iconBg: "bg-rose-100" },
              ];
              const accent = accentColors[index % accentColors.length];

              return (
                <div
                  key={index}
                  onClick={() => handleSetSelectedFormation({ titre: cat, isCategory: true })}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${accent.iconBg} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                      <Library size={18} className={accent.icon} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">En cours</span>
                    </div>
                  </div>

                  <h4 className="font-black text-slate-800 text-sm mb-1 truncate">{cat}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mb-2">
                    {studentsInCat.length} étudiant{studentsInCat.length !== 1 ? "s" : ""}
                  </p>

                  <ProgressBar percent={avgProgress} />

                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge pct={avgProgress} />
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── Niveau 2 : liste des étudiants de la catégorie ── */}
        {selectedFormation && !selectedStudent && (
          <motion.div
            key="s-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetSelectedFormation(null)}
                className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-wider hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
              >
                <ArrowLeft size={12} /> Catégories
              </button>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider truncate">{selectedFormation.titre}</span>
            </div>

            {/* Students list */}
            {(() => {
              const filteredStudents = etudiants.filter((etud) => {
                const etudCat = etud.categorie || etud.formation_categorie || "";
                return etudCat.trim().toLowerCase() === selectedFormation.titre.trim().toLowerCase();
              });

              const totalPages = Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);
              const paginatedStudents = filteredStudents.slice(
                (currentPage - 1) * STUDENTS_PER_PAGE,
                currentPage * STUDENTS_PER_PAGE
              );

              return (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    {paginatedStudents.map((st, i) => {
                      const pct = categoryProgressions[`${st.id}-${st.formation_id}`] ?? 0;
                      const barColor =
                        pct < 30 ? "bg-rose-400" : pct < 70 ? "bg-amber-400" : "bg-emerald-400";
                      return (
                        <div
                          key={i}
                          onClick={() => { setSelectedStudent(st); loadStudentProgression(st); }}
                          className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm shrink-0 overflow-hidden border-2 border-white shadow-sm group-hover:border-indigo-200 transition-colors">
                              {st.photo ? (
                                <img src={`${API_URL.replace("/api", "")}/${st.photo}`} alt={st.nom.charAt(0)} className="w-full h-full object-cover" />
                              ) : (
                                <span>{st.nom.charAt(0)}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate">{st.nom}</p>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{st.formation}</p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-[9px] font-black text-slate-400">{pct}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge pct={pct} />
                            <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                          </div>
                        </div>
                      );
                    })}

                    {filteredStudents.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-sm font-medium">
                        Aucun étudiant dans cette catégorie.
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {(currentPage - 1) * STUDENTS_PER_PAGE + 1}–{Math.min(currentPage * STUDENTS_PER_PAGE, filteredStudents.length)} sur {filteredStudents.length} étudiants
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-100 bg-white text-slate-400 hover:text-indigo-500 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight size={12} className="rotate-180" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all border ${
                              page === currentPage
                                ? "bg-indigo-500 text-white border-indigo-500"
                                : "bg-white text-slate-400 border-slate-100 hover:text-indigo-500 hover:border-indigo-200"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-100 bg-white text-slate-400 hover:text-indigo-500 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}

        {/* ── Niveau 3 : détail de l'étudiant ── */}
        {selectedStudent && (
          <motion.div
            key="s-detail"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-indigo-50 to-violet-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-wider hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 transition-all"
              >
                <ArrowLeft size={12} /> Retour
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Formation en cours</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profil */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-4xl bg-indigo-100 flex items-center justify-center text-2xl font-black text-indigo-600 shrink-0 overflow-hidden border-4 border-white shadow-md">
                  {selectedStudent.photo ? (
                    <img src={`${API_URL.replace("/api", "")}/${selectedStudent.photo}`} alt={selectedStudent.nom?.charAt(0) || "E"} className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedStudent.nom?.charAt(0) || "E"}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{selectedStudent.nom}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedStudent.email || "Pas d'email"}</p>
                  <span className="mt-1.5 inline-block text-[9px] font-black bg-pink-100 text-black border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {selectedStudent.formation || "Formation standard"}
                  </span>
                </div>
              </div>

              {/* Progression */}
              {(() => {
                const key = `${selectedStudent.id}-${(selectedStudent as any).formation_id}`;
                const prog = progressionMap[key];
                const isLoading = loadingProgression[key];
                const pct = prog?.percent ?? categoryProgressions[key] ?? 0;
                const completed = prog?.completed ?? 0;
                const total = prog?.total ?? 0;

                const gradient =
                  pct < 30 ? "from-rose-400 to-red-400" :
                  pct < 70 ? "from-amber-400 to-orange-400" :
                  "from-emerald-400 to-green-500";
                const textColor =
                  pct < 30 ? "text-rose-500" : pct < 70 ? "text-amber-500" : "text-emerald-500";
                const statusLabel =
                  pct === 0 ? "Pas encore commencé" :
                  pct < 50 ? "En début de formation" :
                  pct < 100 ? "En bonne progression" :
                  "Formation complétée !";

                return (
                  <div className="space-y-5">
                    {/* Score + label */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Progression globale</p>
                        <p className="text-xs font-semibold text-slate-500">{selectedStudent.formation || "Formation"}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-4xl font-black ${textColor} leading-none`}>{pct}%</span>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">
                          {isLoading ? (
                            <span className="animate-pulse">Chargement…</span>
                          ) : (
                            <>{completed} / {total} cours</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Barre */}
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isLoading ? "0%" : `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full bg-linear-to-r ${gradient}`}
                      />
                    </div>

                    {/* 3 metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
                        <BookOpen size={14} className="text-purple-400 mx-auto mb-1" />
                        <p className="text-lg font-black text-purple-700">{total}</p>
                        <p className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Total</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                        <CheckCircle size={14} className="text-emerald-400 mx-auto mb-1" />
                        <p className="text-lg font-black text-emerald-700">{completed}</p>
                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Terminés</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                        <Clock size={14} className="text-orange-400 mx-auto mb-1" />
                        <p className="text-lg font-black text-orange-700">{Math.max(0, total - completed)}</p>
                        <p className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Restants</p>
                      </div>
                    </div>

                    {/* Status pill */}
                    <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border
                      ${pct === 100 ? "bg-blue-50 text-blue-600 border-blue-100" :
                        pct >= 50 ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                        pct > 0 ? "bg-orange-50 text-orange-500 border-orange-100" :
                        "bg-slate-50 text-slate-400 border-slate-100"}`}>
                      {statusLabel}
                    </div>

                    {/* Refresh */}
                    <button
                      onClick={() => loadStudentProgression(selectedStudent, true)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-indigo-400 transition-colors disabled:opacity-40 py-1"
                    >
                      <RefreshCw size={10} className={isLoading ? "animate-spin" : ""} />
                      {isLoading ? "Mise à jour…" : "Actualiser la progression"}
                    </button>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormationSuivi;