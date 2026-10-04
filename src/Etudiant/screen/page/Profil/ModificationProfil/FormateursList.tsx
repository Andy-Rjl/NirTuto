import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { API_URL } from "../../../../../lib/api";

interface FormateurColumnProps {
  formateurs: any[];
  isAnimating: boolean;
  selectedFormateur: any | null;
  onSelect: (f: any) => void;
  onDeselect: () => void;
  onPageChange: (dir: number) => void;
}

export const FormateurDesktopColumn = ({
  formateurs, isAnimating, selectedFormateur, onSelect, onDeselect, onPageChange,
}: FormateurColumnProps) => (
  <div className="hidden lg:block flex-1 border-l border-slate-100 pl-8 xl:pl-10 relative bg-slate-50/30 rounded-r-[2rem] -my-10 py-10">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Vos Formateurs</h3>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(-1)} className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:text-indigo-600 dark:text-slate-300 transition-all">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => onPageChange(1)} className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:text-indigo-600 dark:text-slate-300 transition-all">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>

    <div className={`space-y-3 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      {formateurs.map((f: any) => (
        <div
          key={f.id}
          onClick={() => onSelect(f)}
          className="flex items-center gap-3 p-3 rounded-3xl bg-white dark:bg-slate-700 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0">
            <img
              src={`${API_URL.replace('/api', '')}/${f.photo_formateur}`}
              alt={f.nom_formateur.charAt(0)}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-[11px] font-black text-slate-800 uppercase truncate tracking-tight">{f.nom_formateur}</p>
            <p className="text-[9px] text-indigo-500 font-bold italic">{f.categorie}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Popup formateur */}
    {selectedFormateur && (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-md p-6 rounded-r-[2rem]">
        <div className="bg-[#1A234E] text-white p-6 rounded-[2rem] shadow-2xl w-full text-center relative">
          <button onClick={onDeselect} className="absolute top-4 right-4 text-white/40 hover:text-white">
            <X size={18} />
          </button>
          <div className="w-16 h-16 rounded-3xl mx-auto mb-4 border-4 border-white/10 overflow-hidden">
            <img
              src={`${API_URL.replace('/api', '')}/${selectedFormateur.photo_formateur}`}
              alt={selectedFormateur.nom_formateur.charAt(0)}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-1">{selectedFormateur.nom_formateur}</h4>
          <p className="text-[10px] text-indigo-300 font-bold italic mb-5">{selectedFormateur.categorie}</p>
          <button className="text-[10px] bg-indigo-500 w-full py-3.5 rounded-2xl hover:bg-indigo-400 uppercase font-black tracking-widest transition-all shadow-xl shadow-indigo-500/20">
            Contacter
          </button>
        </div>
      </div>
    )}
  </div>
);

export const FormateurMobileStrip = ({ formateurs }: { formateurs: any[] }) => {
  if (formateurs.length === 0) return null;
  return (
    <div className="lg:hidden border-t border-slate-100 pt-5">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Vos Formateurs</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {formateurs.map((f: any) => (
          <div key={f.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100">
              <img
                src={`${API_URL.replace('/api', '')}/${f.photo_formateur}`}
                alt={f.nom_formateur.charAt(0)}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase max-w-[60px] text-center truncate">{f.nom_formateur}</p>
          </div>
        ))}
      </div>
    </div>
  );
};