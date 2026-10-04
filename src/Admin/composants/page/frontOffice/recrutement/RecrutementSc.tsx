import React from "react";
import { Zap, UserPlus } from "lucide-react";

interface RecrutementScProps {
  ctaFormateur: { title: string; desc: string };
  setCtaFormateur: (val: any) => void;
}

const RecrutementSc: React.FC<RecrutementScProps> = ({ ctaFormateur, setCtaFormateur }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <section className="bg-indigo-950 p-10 rounded-[3rem] text-white relative overflow-hidden">
        <Zap className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
        <div className="relative z-10 space-y-6">
          <h3 className="text-xl font-black flex items-center gap-2"><UserPlus /> Devenir Formateur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Titre Principal</label>
              <input value={ctaFormateur.title} onChange={e => setCtaFormateur({...ctaFormateur, title: e.target.value})} className="w-full bg-white/10 p-4 rounded-xl outline-none border border-white/10 font-bold" />
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Description</label>
              <textarea value={ctaFormateur.desc} onChange={e => setCtaFormateur({...ctaFormateur, desc: e.target.value})} className="w-full bg-white/10 p-4 rounded-xl outline-none border border-white/10 text-sm h-24" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecrutementSc;