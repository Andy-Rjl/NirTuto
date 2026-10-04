import React, { useState } from "react";
import { Search, Plus, X, Check } from "lucide-react";
import { COLORS, TECH_CATEGORIES } from "../constants_reel";

// ── Badge ─────────────────────────────────────────────────────────────────────

export const Badge = ({ text, color }: { text: string; color: string }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
    style={{ background: color + "20", color }}>
    {text}
  </span>
);

// ── IconPicker ────────────────────────────────────────────────────────────────

interface IconPickerProps {
  selected: string;
  onChange: (key: string) => void;
  registry: Record<string, { icon: React.FC<any>; label: string; category?: string }>;
}

export const IconPicker: React.FC<IconPickerProps> = ({ selected, onChange, registry }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const Ic = registry[selected]?.icon;
  const filtered = Object.entries(registry).filter(([, v]) =>
    v.label.toLowerCase().includes(search.toLowerCase()) ||
    (v.category || "").toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Icône</label>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-indigo-400 transition-all">
        {Ic && <Ic size={16} />}
        <span>{registry[selected]?.label || "Choisir"}</span>
        <span className="ml-auto text-slate-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-3">
          <div className="flex items-center gap-2 mb-2 px-2 py-1.5 bg-slate-50 rounded-lg">
            <Search size={13} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…" className="bg-transparent text-xs outline-none flex-1 text-slate-700" />
          </div>
          <div className="grid grid-cols-4 gap-1.5 max-h-44 overflow-y-auto pr-1">
            {filtered.map(([key, v]) => {
              const Icon = v.icon;
              return (
                <button key={key} type="button"
                  onClick={() => { onChange(key); setOpen(false); setSearch(""); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-center ${
                    selected === key ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-600"}`}>
                  <Icon size={18} />
                  <span className="text-[9px] font-bold leading-tight">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── ColorPicker ───────────────────────────────────────────────────────────────

interface ColorPickerProps {
  selected: string;
  onChange: (hex: string, bg: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selected, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Couleur</label>
    <div className="flex gap-2 flex-wrap">
      {COLORS.map(c => (
        <button key={c.hex} type="button" onClick={() => onChange(c.hex, c.bg)}
          className={`w-7 h-7 rounded-full border-2 transition-all ${selected === c.hex ? "border-slate-700 scale-110" : "border-transparent"}`}
          style={{ background: c.hex }} title={c.label} />
      ))}
    </div>
  </div>
);

// ── StackInput ────────────────────────────────────────────────────────────────

interface StackInputProps {
  stack: string[];
  onChange: (s: string[]) => void;
}

export const StackInput: React.FC<StackInputProps> = ({ stack, onChange }) => {
  const [val, setVal] = useState("");
  const add = () => { if (val.trim()) { onChange([...stack, val.trim()]); setVal(""); } };
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Stack / Technologies</label>
      <div className="flex gap-2 mb-2">
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Ex: React…"
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-medium text-slate-700" />
        <button type="button" onClick={add} className="px-3 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
          <Plus size={13} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {stack.map((t, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-lg">
            {t}
            <button type="button" onClick={() => onChange(stack.filter((_, j) => j !== i))}><X size={10} /></button>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── CategoryChecks ────────────────────────────────────────────────────────────

interface CategoryChecksProps {
  selected: string[];
  onChange: (cats: string[]) => void;
}

export const CategoryChecks: React.FC<CategoryChecksProps> = ({ selected, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Catégories technologiques</label>
    <div className="flex flex-wrap gap-2">
      {TECH_CATEGORIES.map(cat => {
        const active = selected.includes(cat);
        return (
          <button key={cat} type="button"
            onClick={() => onChange(active ? selected.filter(c => c !== cat) : [...selected, cat])}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
              active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"}`}>
            {active && <Check size={11} />}
            {cat}
          </button>
        );
      })}
    </div>
  </div>
);

// ── TagInput ──────────────────────────────────────────────────────────────────

interface TagInputProps {
  tags: string[];
  onChange: (t: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [val, setVal] = useState("");
  const add = () => { if (val.trim() && !tags.includes(val.trim())) { onChange([...tags, val.trim()]); setVal(""); } };
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Tags / Compétences</label>
      <div className="flex gap-2 mb-2">
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Ex: React…"
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-medium text-slate-700" />
        <button type="button" onClick={add} className="px-3 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
          <Plus size={13} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-lg">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))}><X size={10} /></button>
          </span>
        ))}
      </div>
    </div>
  );
};