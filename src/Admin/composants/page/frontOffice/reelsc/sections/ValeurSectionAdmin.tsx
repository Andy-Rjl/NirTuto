import React, { useState } from "react";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import type { ValeurItem } from "../types_reel";
import { INIT_VALEURS, VALEUR_ICONS, uid } from "../constants_reel";
import SectionHeader from "../ui/SectionHeader";
import { IconPicker, ColorPicker, CategoryChecks } from "../ui/FormControls";
import { Modal, DeleteConfirm, Field } from "../ui/Modal";

const emptyValeur = (): ValeurItem => ({
  id: uid(), iconKey: "CheckCircle2", color: "#10B981",
  title: "", desc: "", categories: [],
});

const ValeurSectionAdmin: React.FC = () => {
  const [items, setItems] = useState<ValeurItem[]>(INIT_VALEURS);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item: ValeurItem } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd  = () => setModal({ mode: "add",  item: emptyValeur() });
  const openEdit = (item: ValeurItem) => setModal({ mode: "edit", item: { ...item } });
  const closeModal = () => setModal(null);

  const save = () => {
    if (!modal) return;
    if (modal.mode === "add") setItems(prev => [...prev, modal.item]);
    else setItems(prev => prev.map(v => v.id === modal.item.id ? modal.item : v));
    closeModal();
  };

  const remove = (id: string) => { setItems(prev => prev.filter(v => v.id !== id)); setDeleteId(null); };

  const updateModal = (patch: Partial<ValeurItem>) =>
    setModal(m => m ? { ...m, item: { ...m.item, ...patch } } : null);

  return (
    <div className="space-y-6">
      <SectionHeader title="Section Valeurs" badge="Promesses" onAdd={openAdd} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(v => {
          const Ic = VALEUR_ICONS[v.iconKey]?.icon || CheckCircle2;
          return (
            <div key={v.id} className="group bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: v.color + "18" }}>
                  <Ic size={18} style={{ color: v.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 text-sm mb-1 leading-tight">
                    {v.title || <span className="text-slate-300 italic">Sans titre</span>}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{v.desc}</p>
                </div>
              </div>
              {v.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {v.categories.map(c => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: v.color + "15", color: v.color }}>{c}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(v)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all">
                  <Pencil size={12} /> Modifier
                </button>
                <button onClick={() => setDeleteId(v.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all">
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Nouvelle valeur" : "Modifier la valeur"} onClose={closeModal} onSave={save}>
          <IconPicker selected={modal.item.iconKey} onChange={iconKey => updateModal({ iconKey })} registry={VALEUR_ICONS} />
          <ColorPicker selected={modal.item.color} onChange={(hex) => updateModal({ color: hex })} />
          <Field label="Titre" value={modal.item.title} onChange={v => updateModal({ title: v })} placeholder="Ex: Projets 100% réels" />
          <Field label="Description" value={modal.item.desc} onChange={v => updateModal({ desc: v })} placeholder="Description de la valeur…" multiline />
          <CategoryChecks selected={modal.item.categories} onChange={categories => updateModal({ categories })} />
        </Modal>
      )}

      {deleteId && (
        <DeleteConfirm label="Supprimer cette valeur ?" onCancel={() => setDeleteId(null)} onConfirm={() => remove(deleteId)} />
      )}
    </div>
  );
};

export default ValeurSectionAdmin;