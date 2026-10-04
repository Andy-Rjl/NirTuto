import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaChevronDown, FaChevronUp, FaFlag } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";

interface Option {
  id: number;
  texte: string;
}

interface Question {
  question: any;
  id: number;
  enonce: string;
  correct_index: number;
  options: Option[];
}

interface Qcm {
  id: number;
  titre: string;
  cours?: { titre: string };
  questions: Question[];
}

interface TousQcmProps {
  loading: boolean;
  listeQcmEnregistres: Qcm[];
  formationsGroupees: Record<string, Record<string, Qcm[]>>;
  expandedQcmId: number | null;
  setExpandedQcmId: (id: number | null) => void;
  deleteQcm: (id: number) => void;
}

const TousQcm: React.FC<TousQcmProps> = ({
  loading,
  listeQcmEnregistres,
  formationsGroupees,
  expandedQcmId,
  setExpandedQcmId,
  deleteQcm,
}) => {
  const allEntries: { formation: string; cours: string; qcms: Qcm[] }[] = [];
  Object.entries(formationsGroupees).forEach(([formation, coursObj]) => {
    Object.entries(coursObj).forEach(([cours, qcms]) => {
      allEntries.push({ formation, cours, qcms });
    });
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selected = allEntries[selectedIndex] ?? null;

  // Lettres pour indexer les options comme sur l'image qcmetud.png
  const prefixeLettres = ["a", "b", "c", "d", "e", "f"];

  return (
    <div className="flex bg-[#f8f9fa]  border border-slate-200 shadow-sm overflow-hidden min-h-140 font-sans text-slate-700">

      {/* ── SIDEBAR ── */}
      <div className="w-64 min-w-[256px] bg-white border-r border-slate-200 flex flex-col">

        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Catalogue QCM</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Gérez vos questionnaires</p>
        </div>

        <div className="mx-4 my-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse inline-block" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {listeQcmEnregistres.length} questionnaires
          </span>
        </div>

        {loading ? (
          <div className="px-5 py-6 text-[12px] text-slate-400 animate-pulse">Chargement...</div>
        ) : allEntries.length === 0 ? (
          <div className="px-5 py-6 text-[12px] text-slate-400">Aucun QCM.</div>
        ) : (
          Object.entries(formationsGroupees).map(([formation, coursObj]) => (
            <div key={formation} className="py-2">
              <p className="px-4 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {formation}
              </p>
              {Object.entries(coursObj).map(([cours, qcms]) => {
                const idx = allEntries.findIndex(e => e.formation === formation && e.cours === cours);
                const isActive = selectedIndex === idx;
                return (
                  <button
                    key={cours}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-all border-l-4 ${
                      isActive
                        ? "bg-cyan-50/50 border-cyan-500 text-cyan-700"
                        : "border-transparent hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-cyan-500 text-white" : "bg-slate-100 border border-slate-200 text-slate-400"
                    }`}>
                      <CheckCircle2 size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-bold truncate ${isActive ? "text-cyan-700" : "text-slate-700"}`}>{cours}</p>
                      <p className="text-[10px] text-slate-400">{formation.split(" ").slice(-1)[0]}</p>
                    </div>
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isActive ? "bg-cyan-50 text-cyan-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {qcms.length}
                    </span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* ── MAIN PANEL ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">

        <div className="px-6 py-5 bg-white border-b border-slate-200">
          <h1 className="text-base font-bold text-slate-800">
            {selected ? selected.cours : "Sélectionnez un cours"}
          </h1>
          <p className="text-[12px] text-slate-400 mt-0.5">
            {selected
              ? `${selected.formation} · ${selected.qcms.length} QCM disponibles`
              : "Choisissez un cours dans la liste"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!selected ? (
            <div className="text-center py-20 text-slate-400 text-sm">Aucun cours sélectionné</div>
          ) : selected.qcms.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">Aucun QCM pour ce cours.</div>
          ) : (
            selected.qcms.map((qcm, idx) => (
              <div
                key={qcm.id}
                className={`group bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${
                  expandedQcmId === qcm.id
                    ? "border-cyan-200 ring-1 ring-cyan-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* En-tête cliquable du QCM */}
                <div
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedQcmId(expandedQcmId === qcm.id ? null : qcm.id)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 transition-colors ${
                    expandedQcmId === qcm.id
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-800">{qcm.titre}</p>
                    <p className="text-[11px] text-slate-400">
                      {qcm.questions.length} question{qcm.questions.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteQcm(qcm.id); }}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                    >
                      <FaTrash size={11} />
                    </button>
                    {expandedQcmId === qcm.id
                      ? <FaChevronUp size={12} className="text-cyan-500" />
                      : <FaChevronDown size={12} className="text-slate-400" />
                    }
                  </div>
                </div>

                {/* Contenu des questions stylisé comme sur qcmetud.png */}
                <AnimatePresence>
                  {expandedQcmId === qcm.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100 bg-[#f8f9fa]"
                    >
                      <div className="p-4 space-y-6">
                        {qcm.questions.map((q, i) => (
                          <div key={q.id} className="flex flex-col md:flex-row gap-4 items-start">
                            
                            {/* Colonne d'information de gauche (Moodle Style) */}
                            <div className="w-full md:w-36 text-[12px] text-slate-500 shrink-0 space-y-1">
                              <p className="font-bold text-slate-800 text-sm">Question <span className="text-base">{i + 1}</span></p>
                              <p className="text-[11px] text-slate-400">Pas encore répondu</p>
                              <p className="text-[11px] text-slate-400">Noté sur 1,00</p>
                              <button className="flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 pt-1 text-[11px]">
                                <FaFlag size={10} className="text-slate-400" /> Marquer la question
                              </button>
                            </div>

                            {/* Bloc de l'énoncé et des options à droite */}
                            <div className="flex-1 w-full bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                              {/* Énoncé de la question */}
                              <div className="bg-[#edf2f7] text-slate-800 p-3 rounded-md text-[13px] font-medium">
                                {q.enonce}
                              </div>

                              {/* Options */}
                              <div className="space-y-2.5 pl-2">
                                {q.options && q.options.map((option, opIdx) => {
                                  const estReponseCorrecte = opIdx === q.correct_index;
                                  return (
                                    <div key={option.id} className="flex items-start gap-3 text-[13px] text-slate-700">
                                      {/* Bouton radio simulé fidèle à l'image */}
                                      <div className="pt-0.5 shrink-0">
                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                          estReponseCorrecte 
                                            ? "border-cyan-500 ring-1 ring-cyan-500" 
                                            : "border-slate-400"
                                        }`}>
                                          {estReponseCorrecte && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                          )}
                                        </div>
                                      </div>
                                      <p className="leading-tight">
                                        <span className="font-medium text-slate-500 mr-1">
                                          {prefixeLettres[opIdx] || opIdx + 1}.
                                        </span>{" "}
                                        {option.texte}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Lien d'action factice du bas */}
                              <div className="pt-1 pl-2">
                                <button className="text-[12px] text-cyan-600 hover:underline">
                                  Effacer mon choix
                                </button>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TousQcm;