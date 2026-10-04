import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { API_URL } from "../../../lib/api";
import { Loader2, X, Video } from "lucide-react";

interface AjoutGuidesProps {
  onClose: () => void; 
}

const AjoutGuide = ({onClose}: AjoutGuidesProps) => {
    const token = localStorage.getItem('token');
    const [, setShowGuideModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, setToast] = useState<string | null>(null);
    const [editingId] = useState<number | null>(null);

    const initialGuideForm = {
        titre       : "",
        categorie   : "",
        description : "", 
        video       : null as File | null,
        url_youtube : "",
        admin_id    : 1, 
      };
    
    const [guideFormData, setGuideFormData] = useState(initialGuideForm);
    const handleGuideInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === "file") {
          const fileInput = e.target as HTMLInputElement;
          const file = fileInput.files ? fileInput.files[0] : null;
          
          setGuideFormData(prev => ({
            ...prev,
            [name]: file
          }));
        } else {
          setGuideFormData(prev => ({
            ...prev,
            [name]: value
          }));
        }
      };
    
      const handleGuideSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const data = new FormData();
        data.append("titre", guideFormData.titre);
        data.append("description", guideFormData.description || "");
        data.append("categorie", guideFormData.categorie || "Général");
        data.append("url_youtube", guideFormData.url_youtube);
        data.append("admin_id", "1");
    
        if (guideFormData.video instanceof File) {
          data.append("video", guideFormData.video);
        }
      
        try {
            const response = await fetch(`${API_URL}/guides`, { 
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: data, 
            });
      
            if (response.ok) {
                setToast("Guide ajouté avec succès !");
                setShowGuideModal(false);
                setGuideFormData(initialGuideForm);
            } else {
                const errorData = await response.json();
                alert("Erreur : " + (errorData.message || "Vérifiez les champs"));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
      };

      
      const [categories, setCategories] = useState([]);
      useEffect(() => {
          fetch(`${API_URL}/categories-liste`)
              .then(res => res.json())
              .then(data => setCategories(data));
      }, []);

    const labelCls = "block text-sm font-bold text-[#303972] mb-2";
    const selectCls = "w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all appearance-none";

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 font-sans antialiased"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={onClose}
          >
            <motion.div 
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-7xl rounded-2xl shadow-xl border border-[#EBF0FF] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-[#EBF0FF]">
                <div>
                  <h2 className="text-2xl font-bold text-[#303972]">
                    Ajouter un nouveau Guide
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A0A3BD] mt-0.5">
                    Renseignez les fichiers et informations du guide pratique
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={onClose} 
                  className="p-2 rounded-full text-[#A0A3BD] hover:text-[#303972] hover:bg-gray-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleGuideSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]" style={{ scrollbarWidth: "thin" }}>
                
                {/* SECTION : Médias & Documents */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#EBF0FF] overflow-hidden">
                  <div className="bg-[#5A57D6] px-6 py-3.5">
                    <h3 className="text-white font-semibold text-base">Fichiers liés au guide</h3>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vidéo */}
                    <div className="space-y-1">
                       <label className={labelCls}>Vidéo Démonstration {editingId && <span className="font-normal text-[#A0A3BD]">(Optionnel)</span>}</label>
                       <label className={`flex items-center gap-2 w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl cursor-pointer hover:bg-gray-50 transition text-sm text-[#303972] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                          <Video size={18} className="text-[#A0A3BD] shrink-0" />
                          <span className="truncate placeholder-[#A0A3BD]">{guideFormData.video ? (guideFormData.video as File).name : "Choisir une vidéo..."}</span>
                          <input name="video" onChange={handleGuideInputChange} type="file" accept="video/*" className="hidden" disabled={isSubmitting} />
                       </label>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Lien Youtube</label>
                      <input 
                        name="url_youtube" 
                        value={guideFormData.url_youtube} 
                        onChange={handleGuideInputChange} 
                        type="text" 
                        placeholder="Ex : https://youtube.com?..."
                        className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION : Formulaire descriptif */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className={labelCls}>Titre <span className="text-red-500">*</span></label>
                    <input 
                      name="titre" 
                      value={guideFormData.titre} 
                      onChange={handleGuideInputChange} 
                      type="text" 
                      placeholder="Ex : Guide de démarrage Git"
                      className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className={labelCls}>Catégorie</label>
                    <div className="relative">
                      <select 
                        name="categorie" 
                        value={guideFormData.categorie} 
                        onChange={handleGuideInputChange} 
                        className={selectCls}
                        disabled={isSubmitting}
                      >
                        <option value="General">Général</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.nom_cat}>{cat.nom_cat}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#303972]">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>Programme / Description</label>
                  <textarea 
                    name="description" 
                    value={guideFormData.description} 
                    rows={4} 
                    onChange={handleGuideInputChange} 
                    placeholder="Détaillez le contenu ou l'objectif de ce guide..."
                    className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#EBF0FF]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 border border-[#5A57D6] text-[#5A57D6] text-sm font-bold rounded-full hover:bg-[#5A57D6]/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-2.5 text-white text-sm font-bold rounded-full shadow-md transition-all ${
                      isSubmitting ? "bg-slate-400 cursor-not-allowed shadow-none" : "bg-[#5A57D6] hover:bg-[#4845B4]"
                    }`}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="animate-spin" size={16}/> Enregistrement...</>
                    ) : (
                      "Enregistrer le Guide"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
    );
}

export default AjoutGuide;