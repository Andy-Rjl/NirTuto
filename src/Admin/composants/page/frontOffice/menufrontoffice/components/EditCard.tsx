import React from "react";

interface EditCardProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

const EditCard: React.FC<EditCardProps> = ({ label, value, onChange, icon }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group hover:border-indigo-600 transition-all flex items-center gap-4">
    <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-bold text-slate-700 outline-none bg-transparent"
      />
    </div>
  </div>
);

export default EditCard;