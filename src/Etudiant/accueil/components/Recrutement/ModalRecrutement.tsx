import { motion } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import fe from "./../../assets/fe.jpg";

interface ModalProps {
  formData: any;
  setFormData: (data: any) => void;
  setFile: (file: File | null) => void;
  file: File | null;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

export const RecruitmentModal = ({ formData, setFormData, setFile, file, handleSubmit, isSubmitting, onClose }: ModalProps) => (
  <div className="recr-root fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-[#f8f9ff]">
      <button onClick={onClose} className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors">
        <X size={16} className="text-[#5457d4]" />
      </button>

      <div className="hidden md:block w-5/12 relative overflow-hidden">
        <img src={fe} alt="Recrutement" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#5457d4]/25" />
      </div>

      <div className="w-full md:w-7/12 p-8">
        <div className="mb-6 slide-up slide-up-d1">
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Devenir Formateur</h2>
          <p className="text-gray-400 text-sm">Réponse sous 48h après réception.</p>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Nom" className="field-base" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
            <input type="email" placeholder="Email" className="field-base" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <input type="tel" placeholder="Contact" className="field-base" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
          <div className="relative">
            <select className="field-base appearance-none pr-10" value={formData.formation} onChange={e => setFormData({...formData, formation: e.target.value})}>
              <option value="Développement">Secteur : Développement</option>
              <option value="Design">Secteur : Design</option>
              <option value="Marketing">Secteur : Marketing</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <input type="file" id="file-input" className="hidden" accept=".pdf,.doc" onChange={e => e.target.files && setFile(e.target.files[0])} />
          <label htmlFor="file-input" className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-1.5 border-dashed cursor-pointer ${file ? 'border-[#5457d4]' : 'border-[#c7caff]'}`}>
            <span className="text-xs truncate text-gray-400">{file ? file.name : "Joindre votre CV (PDF)..."}</span>
            <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-[#5457d4] rounded">Parcourir</span>
          </label>
          <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl text-white text-sm font-semibold bg-[#5457d4] disabled:opacity-70 mt-2">
            {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
          </button>
        </form>
      </div>
    </motion.div>
  </div>
);