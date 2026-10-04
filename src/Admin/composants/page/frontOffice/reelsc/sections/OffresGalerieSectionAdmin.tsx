import React, { useState } from "react";
import { Plus, Pencil, Trash2, Image, Briefcase as BriefcaseIcon, MapPin, Clock, Link } from "lucide-react";
import type { OffreItem, PhotoItem } from "../types_reel";
import { INIT_OFFRES, INIT_PHOTOS, TYPE_OPTIONS, TYPE_COLORS, uid } from "../constants_reel";
import { Modal, DeleteConfirm, Field } from "../ui/Modal";
import { TagInput } from "../ui/FormControls";

// ── OffresAdmin ───────────────────────────────────────────────────────────────

const OffresAdmin: React.FC = () => {
  const [items, setItems] = useState<OffreItem[]>(INIT_OFFRES);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item: OffreItem } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyOffre = (): OffreItem => ({ id: uid(), role: "", entreprise: "", lieu: "", salaire: "", type: "CDI", tags: [] });
  const patch = (p: Partial<OffreItem>) => setModal(m => m ? { ...m, item: { ...m.item, ...p } } : null);

  const save = () => {
    if (!modal) return;
    if (modal.mode === "add") setItems(prev => [...prev, modal.item]);
    else setItems(prev => prev.map(o => o.id === modal.item.id ? modal.item : o));
    setModal(null);
  };

  const remove = (id: string) => { setItems(prev => prev.filter(o => o.id !== id)); setDeleteId(null); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-400 font-semibold">{items.length} débouchés</span>
        <button onClick={() => setModal({ mode: "add", item: emptyOffre() })}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200">
          <Plus size={14} /> Ajouter un débouché
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(o => {
          const typeColor = TYPE_COLORS[o.type] || "#6366F1";
          return (
            <div key={o.id} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <BriefcaseIcon size={18} className="text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-slate-800 text-sm leading-tight truncate">
                    {o.role || <span className="text-slate-300 italic">Sans titre</span>}
                  </h4>
                  <p className="text-slate-500 text-xs font-semibold mt-0.5">{o.entreprise}</p>
                </div>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0"
                  style={{ background: typeColor + "18", color: typeColor }}>
                  <Clock size={9} />{o.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] text-slate-500 font-semibold">
                {o.lieu    && <span className="flex items-center gap-1"><MapPin size={10} className="text-slate-400" />{o.lieu}</span>}
                {o.salaire && <span className="text-slate-400">{o.salaire}</span>}
              </div>
              {o.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {o.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-md font-bold">{t}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => setModal({ mode: "edit", item: { ...o } })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all">
                  <Pencil size={12} /> Modifier
                </button>
                <button onClick={() => setDeleteId(o.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all">
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Nouveau débouché" : "Modifier le débouché"} onClose={() => setModal(null)} onSave={save}>
          <Field label="Intitulé du poste"    value={modal.item.role}        onChange={v => patch({ role: v })}        placeholder="Ex: Développeur Full Stack" />
          <Field label="Entreprise"           value={modal.item.entreprise}  onChange={v => patch({ entreprise: v })}  placeholder="Ex: TechMada" />
          <Field label="Lieu"                 value={modal.item.lieu}        onChange={v => patch({ lieu: v })}        placeholder="Ex: Antananarivo" />
          <Field label="Fourchette salariale" value={modal.item.salaire}     onChange={v => patch({ salaire: v })}     placeholder="Ex: 800 000 – 1 200 000 Ar" />
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Type de contrat</label>
            <select value={modal.item.type} onChange={e => patch({ type: e.target.value })}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-medium text-slate-700">
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <TagInput tags={modal.item.tags} onChange={tags => patch({ tags })} />
        </Modal>
      )}

      {deleteId && (
        <DeleteConfirm label="Supprimer ce débouché ?" onCancel={() => setDeleteId(null)} onConfirm={() => remove(deleteId)} />
      )}
    </div>
  );
};

// ── GalerieAdmin ──────────────────────────────────────────────────────────────

const GalerieAdmin: React.FC = () => {
  const [items, setItems] = useState<PhotoItem[]>(INIT_PHOTOS);
  const [modal, setModal] = useState<{ item: PhotoItem } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyPhoto = (): PhotoItem => ({ id: uid(), label: "", desc: "", img: "" });
  const patch = (p: Partial<PhotoItem>) => setModal(m => m ? { item: { ...m.item, ...p } } : null);

  const save = () => {
    if (!modal) return;
    const exists = items.find(p => p.id === modal.item.id);
    if (exists) setItems(prev => prev.map(p => p.id === modal.item.id ? modal.item : p));
    else setItems(prev => [...prev, modal.item]);
    setModal(null);
  };

  const remove = (id: string) => { setItems(prev => prev.filter(p => p.id !== id)); setDeleteId(null); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-400 font-semibold">{items.length} photos</span>
        <button onClick={() => setModal({ item: emptyPhoto() })}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200">
          <Plus size={14} /> Ajouter une photo
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="group relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-100 hover:border-indigo-400 transition-all">
            {p.img ? (
              <img src={p.img} alt={p.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <Image size={24} className="text-slate-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
              <p className="text-white font-bold text-xs truncate">{p.label || <span className="opacity-40">Sans titre</span>}</p>
              <p className="text-gray-300 text-[10px] opacity-80 truncate">{p.desc}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-20">
              <button onClick={() => setModal({ item: { ...p } })}
                className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow">
                <Pencil size={12} className="text-indigo-600" />
              </button>
              <button onClick={() => setDeleteId(p.id)}
                className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow">
                <Trash2 size={12} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}

        <button onClick={() => setModal({ item: emptyPhoto() })}
          className="aspect-4/3 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
            <Plus size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <span className="text-xs text-slate-400 group-hover:text-indigo-600 font-bold transition-colors">Ajouter</span>
        </button>
      </div>

      {modal && (
        <Modal title="Photo / Galerie" onClose={() => setModal(null)} onSave={save}>
          <Field label="Titre / Légende"    value={modal.item.label} onChange={v => patch({ label: v })} placeholder="Ex: Hackathon 2024" />
          <Field label="Description courte" value={modal.item.desc}  onChange={v => patch({ desc: v })}  placeholder="Ex: Équipe gagnante du challenge IA" />
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">URL de l'image</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-indigo-400 transition-colors">
              <Link size={13} className="text-slate-400 shrink-0" />
              <input value={modal.item.img} onChange={e => patch({ img: e.target.value })}
                placeholder="https://…"
                className="bg-transparent text-sm outline-none flex-1 font-medium text-slate-700" />
            </div>
            {modal.item.img && (
              <div className="mt-2 rounded-xl overflow-hidden aspect-video bg-slate-100">
                <img src={modal.item.img} alt="preview" className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        </Modal>
      )}

      {deleteId && (
        <DeleteConfirm label="Supprimer cette photo ?" onCancel={() => setDeleteId(null)} onConfirm={() => remove(deleteId)} />
      )}
    </div>
  );
};

// ── OffresGalerieSectionAdmin ─────────────────────────────────────────────────

const OffresGalerieSectionAdmin: React.FC = () => {
  const [tab, setTab] = useState<"offres" | "galerie">("offres");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black text-slate-800 italic">Offres & Galerie</h3>
          <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full tracking-widest">Opportunités</span>
        </div>
      </div>
      <div className="flex bg-slate-100 rounded-2xl p-1 gap-1 w-fit">
        <button onClick={() => setTab("offres")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition-all ${tab === "offres" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
          <BriefcaseIcon size={14} /> Débouchés
        </button>
        <button onClick={() => setTab("galerie")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition-all ${tab === "galerie" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
          <Image size={14} /> Galerie
        </button>
      </div>
      {tab === "offres" ? <OffresAdmin /> : <GalerieAdmin />}
    </div>
  );
};

export default OffresGalerieSectionAdmin;