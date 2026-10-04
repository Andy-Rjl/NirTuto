import React from "react";
import { Plus } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  badge: string;
  onAdd: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, badge, onAdd }) => (
  <div className="flex items-center justify-between px-1 mb-6">
    <div className="flex items-center gap-3">
      <h3 className="text-xl font-black text-slate-800 italic">{title}</h3>
      <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full tracking-widest">{badge}</span>
    </div>
    <button onClick={onAdd}
      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200">
      <Plus size={14} /> Ajouter
    </button>
  </div>
);

export default SectionHeader;