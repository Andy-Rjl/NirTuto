import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoniry from "./../../../../assets/image.png";
import { User, Calendar, ChevronDown, Award } from "lucide-react";

interface CertificationScProps {
  certifText: string;
  setCertifText: (val: string) => void;
}

const CertificationSc: React.FC<CertificationScProps> = ({ certifText, setCertifText }) => {
  
  // Fonction pour insérer des variables dynamiques
  const insertVar = (variable: string) => {
    const tag = ` [${variable}]`;
    const newText = certifText + tag;
    setCertifText(newText);
    
    // Mettre à jour aussi le DOM du contentEditable
    if (editorRef.current) {
      editorRef.current.innerHTML = newText;
    }
  };
  
    const editorRef = useRef<HTMLDivElement>(null);

    // États pour la couleur de fond des boutons actifs (Programme)
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

      const checkSelectionStyles = () => {
        // Styles Programme
        setIsBold(document.queryCommandState("bold"));
        setIsItalic(document.queryCommandState("italic"));
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            setCertifText(editorRef.current.innerHTML);
        }
        checkSelectionStyles();
    };

    const execCommand = (
        e: React.MouseEvent,
        command: string,
        ref: React.RefObject<HTMLDivElement | null>,
        onChange: () => void
    ) => {
        e.preventDefault();
        if (ref.current) {
            ref.current.focus();
        }
        document.execCommand(command, false, undefined);
        onChange();
    };

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div 
          key="certifs" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4"
        >
          {/* COLONNE DE GAUCHE : ÉDITEUR PROFESSIONNEL */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 italic">Paramètres Diplôme</h3>
            
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Texte officiel</label>
              
              {/* Conteneur Éditeur */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-inner bg-white">
                {/* Barre d'outils */}
                <div className="bg-slate-50/50 border-b border-slate-100 p-2 flex flex-wrap items-center gap-2">
                  <div className="flex bg-white rounded-xl p-1 border border-slate-100">
                    <button type="button" onMouseDown={(e) => execCommand(e, 'bold', editorRef, handleEditorChange)}
                        className={`p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors ${isBold ? 'bg-white text-[#AC77E9] shadow-sm' : 'text-gray-500 hover:bg-white'}`}>B</button>
                    <button type="button" onMouseDown={(e) => execCommand(e, 'italic', editorRef, handleEditorChange)}
                        className={`w-7 h-7 rounded text-xs italic flex items-center justify-center transition-all ${isItalic ? 'bg-white text-[#AC77E9] shadow-sm' : 'text-gray-500 hover:bg-white'}`}>I</button>
                    <button type="button" onMouseDown={(e) => execCommand(e, 'underline', editorRef, handleEditorChange)}
                        className="w-7 h-7 rounded text-xs underline flex items-center justify-center text-gray-500 hover:bg-white transition-all">U</button>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1 border border-slate-100 cursor-pointer">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Police</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </div>
                </div>

                {/* Textarea stylisé */}
                {/* <textarea 
                  value={certifText} 
                  onChange={(e) => setCertifText(e.target.value)} 
                  className="w-full p-6 bg-white text-sm leading-relaxed min-h-62.5 resize-none outline-none text-slate-700" 
                  placeholder="Rédigez le contenu du certificat ici..."
                /> */}

                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorChange}
                    onKeyUp={checkSelectionStyles}
                    onMouseUp={checkSelectionStyles}
                    className="w-full p-6 bg-white text-sm leading-relaxed min-h-62.5 resize-none outline-none text-slate-700"
                />
              </div>

              {/* Raccourcis de variables */}
              <div className="flex flex-wrap gap-2 pt-2">
                <VariableBtn label="Nom Étudiant" icon={<User size={12} />} onClick={() => insertVar('NOM ET PRENOM')} />
                <VariableBtn label="Date" icon={<Calendar size={12} />} onClick={() => insertVar('DATE DE NAISS')} />
                <VariableBtn label="Lieu" icon={<Calendar size={12} />} onClick={() => insertVar('LIEU DE NAISS')} />
                <VariableBtn label="Formation" icon={<Award size={12} />} onClick={() => insertVar('FORMATION')} />
              </div>
            </div>
          </div>

          {/* COLONNE DE DROITE : APERÇU DU CERTIFICAT */}
          <div className="space-y-6">
             <h3 className="text-xl font-black text-slate-800 italic opacity-0 pointer-events-none">Aperçu</h3>
             <motion.div 
              whileHover={{ scale: 1.02 }} 
              className="bg-white rounded-md shadow-2xl relative overflow-hidden border border-slate-200 aspect-[1.414/1] w-full max-w-lg mx-auto"
            >
              {/* Motifs de design */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#0056b3]" style={{ clipPath: 'polygon(100% 0, 30% 0, 100% 70%)' }} />
              <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0056b3]" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }} />
              
              <div className="relative z-10 p-6 md:p-10 h-full flex flex-col items-center justify-between text-[#1a1a1a]">
                <div className="w-full flex justify-start">
                  <img src={logoniry} alt="LogiNirInfo" className="w-24 h-auto" />
                </div>
                
                <div className="text-center px-4">
                  <h3 className="text-2xl md:text-3xl font-serif italic text-slate-800 mb-4 tracking-tight">Certification de formation</h3>
                  <div className="text-[10px] md:text-xs leading-relaxed text-slate-600 max-w-[80%] mx-auto font-medium">
                    <div 
                        className="text-xs text-gray-500 custom-editor"
                        dangerouslySetInnerHTML={{ __html: certifText }}
                    />
                  </div>
                </div>

                <div className="w-full flex justify-between items-end border-t border-slate-100 pt-4">
                  <div className="text-center">
                    <div className="w-20 h-px bg-slate-300 mb-1 mx-auto" />
                    <p className="text-[7px] uppercase tracking-widest text-slate-400 font-bold">Signature pédagogique</p>
                  </div>
                  <div className="text-[9px] text-blue-600 font-black tracking-tighter italic">
                    https://tuto-info.com
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const VariableBtn = ({ label, icon, onClick }: { label: string, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all shadow-sm"
  >
    {icon} {label}
  </button>
);

export default CertificationSc;