import React from "react";
import { FaPlus, FaSave, FaClipboardCheck, FaTimes } from "react-icons/fa";

interface AjoutQcmProps {
  titreQcm: string;
  setTitreQcm: (v: string) => void;
  formations: any[];
  formationSelectionneeId: string;
  handleFormationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  coursAssocieId: string;
  setCoursAssocieId: (v: string) => void;
  coursFiltrés: any[];
  questions: any[];
  addQuestion: () => void;
  removeQuestion: (id: number) => void;
  updateQuestion: (index: number, field: string, value: any) => void;
  updateOption: (qIndex: number, oIndex: number, value: string) => void;
  handleSubmitQCM: (e: React.FormEvent) => void;
}

const AjoutQcm: React.FC<AjoutQcmProps> = ({
  titreQcm,
  setTitreQcm,
  formations,
  formationSelectionneeId,
  handleFormationChange,
  coursAssocieId,
  setCoursAssocieId,
  coursFiltrés,
  questions,
  addQuestion,
  removeQuestion,
  updateQuestion,
  updateOption,
  handleSubmitQCM,
}) => {
  return (
    <div className="ajout-qcm-page rounded-[2.5rem] overflow-hidden">
      <h1 className="ajout-qcm-title text-slate-800 font-black uppercase  tracking-widest text-lg p-6 flex items-center gap-3">
        <FaClipboardCheck className="text-indigo-600" /> Ajouter un QCM
      </h1>

      <form className="ajout-qcm-form mx-6 mb-8" onSubmit={handleSubmitQCM}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* TITRE DU QCM */}
          <div className="form-group">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Titre du QCM
            </label>
            <input
              type="text"
              name="titre QCM"
              className="w-full px-4 py-3 bg-slate-50 border border-blue-400 rounded-xl outline-none text-sm"
              placeholder="titre qcm"
              value={titreQcm}
              onChange={e => setTitreQcm(e.target.value)}
              required
            />
          </div>

          {/* SELECT FORMATION */}
          <div className="form-group">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              1. Choisir Formation
            </label>
            <select
              value={formationSelectionneeId}
              onChange={handleFormationChange}
              className="w-full px-4 py-3 bg-slate-50 border border-blue-400 rounded-xl outline-none text-sm"
              required
            >
              <option value="">Sélectionner </option>
              {formations.map(f => (
                <option key={f.id} value={f.id}>{f.titre}</option>
              ))}
            </select>
          </div>

          {/* SELECT COURS */}
          <div className="form-group md:col-start-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              2. Choisir Cours
            </label>
            <select
              value={coursAssocieId}
              onChange={e => setCoursAssocieId(e.target.value)}
              disabled={!formationSelectionneeId}
              className={`w-full px-4 py-3 bg-slate-50 border border-blue-400 rounded-xl outline-none text-sm ${
                !formationSelectionneeId ? 'bg-slate-100 opacity-50' : 'bg-slate-50/50'
              }`}
              required
            >
              <option value="">
                {formationSelectionneeId ? "-- Sélectionner le cours --" : "Sélectionnez d'abord une formation"}
              </option>
              {coursFiltrés.map((c: any) => (
                <option key={c.id} value={c.id}>{c.titre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="questions-section">
          <h3 className="text-xs font-black uppercase text-indigo-600 mb-6 flex items-center justify-between">
            Questions du questionnaire
            <span className="bg-indigo-50 px-3 py-1 rounded-full text-[9px]">{questions.length} questions</span>
          </h3>

          {questions.map((q, qIndex) => (
            <div className="question-card relative bg-slate-50 border-2 border-slate-100 mb-8 p-6 rounded-[2rem]" key={q.id}>
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <FaTimes size={12} />
              </button>

              <input
                type="text"
                placeholder={`Saisir la question n°${qIndex + 1}...`}
                className="w-full p-4 rounded-xl border-none shadow-sm font-bold text-sm mb-6 bg-white outline-none focus:ring-2 focus:ring-indigo-200"
                value={q.question}
                onChange={e => updateQuestion(qIndex, "question", e.target.value)}
                required
              />

              <div className="options grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt: string, oIndex: number) => (
                  <label key={oIndex} className={`flex items-center gap-3 p-4 bg-white rounded-2xl border-2 transition-all cursor-pointer ${q.correctIndex === oIndex ? 'border-green-500 bg-green-50/30' : 'border-transparent hover:border-slate-200'}`}>
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctIndex === oIndex}
                      onChange={() => updateQuestion(qIndex, "correctIndex", oIndex)}
                      className="w-4 h-4 accent-green-600"
                      required
                    />
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt}
                      onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                      className="bg-transparent border-none font-medium text-xs w-full outline-none"
                      required
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn-add-question w-full py-5 border-2  border-indigo-200 bg-indigo-50/50 text-indigo-600 font-black text-[10px] uppercase flex items-center justify-center gap-3 rounded-2xl hover:bg-indigo-100 transition-all mb-8"
            onClick={addQuestion}
          >
            <FaPlus /> Ajouter une question
          </button>
        </div>

        <button type="submit" className="btn-save-qcm w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-green-100 flex items-center justify-center gap-3 mt-4 hover:bg-green-700 transition-colors">
          <FaSave /> Enregistrer le QCM complet
        </button>
      </form>
    </div>
  );
};

export default AjoutQcm;