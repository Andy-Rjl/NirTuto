import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL } from "../../../lib/api";
import { Loader2, X, ChevronDown, Calendar, Image as ImageIcon, Video } from "lucide-react";

interface Formation {
  id: number;
  titre: string;
  type: string;
  cibles: string;
  categorie: string;
  prerequis: string;
  commission: number;
  frais: number;
  duree: string;
  nom_formateur: string;
  admin_id: number | null;
  url_youtube: string | null;
}

interface AjoutFormationProps {
    onClose: () => void;
    editingId?: number | null;
    initialData?: any;
}

const AjoutFormation = ({ onClose, editingId = null }: AjoutFormationProps) => {
    const nomAdmin = localStorage.getItem("adminNom") || "Admin";
    const A_URL = `${API_URL}/formations`;
    const token = localStorage.getItem('token');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // État pour la barre de progression
    const [, setToast] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const initialForm = {
      titre: "",
      nom_formateur: "",
      categorie: "Bureautique",
      difficulte: "Facile",
      type: "Payante",
      commission: "",
      frais: "",
      duree: "",
      admin_id: 1,
      programme: "",
      image: null,
      video: null,
      url_youtube: "",
    };
    const [formData, setFormData] = useState(initialForm);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [existingVideo, setExistingVideo] = useState<string | null>(null);
    const [, setLoading] = useState(true);
    const [, setFormat] = useState<Formation[]>([]);
    const [, setLastPage] = useState(1);

    const editorRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);

    // États pour la couleur de fond des boutons actifs (Programme)
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isBulletList, setIsBulletList] = useState(false);
    const [isOrderedList, setIsOrderedList] = useState(false);

    useEffect(() => {
        if (editingId) {
            fetch(`${A_URL}/${editingId}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setFormData({
                    titre: data.titre || "",
                    nom_formateur: data.nom_formateur || "",
                    categorie: data.categorie || "Bureautique",
                    difficulte: data.difficulte || "Facile",
                    type: data.type || "Payante",
                    commission: data.commission || "",
                    frais: data.frais || "",
                    duree: data.duree || "",
                    programme: data.programme || "",
                    admin_id: data.admin_id || 1,
                    image: null,
                    video: null,
                    url_youtube: data.url_youtube || "",
                });
                setExistingImage(data.image || null);
                setExistingVideo(data.video || null);
                
                setTimeout(() => {
                    if (editorRef.current) editorRef.current.innerHTML = data.programme || "";
                }, 0);
            })
            .catch(err => console.error("Erreur chargement formation:", err));
        } else {
            setFormData(initialForm);
            setTimeout(() => {
                if (editorRef.current) editorRef.current.innerHTML = "";
                if (descRef.current) descRef.current.innerHTML = "";
            }, 0);
        }
    }, [editingId]);

    const fetchFormations = useCallback(async (page: number) => {
        setLoading(true);
        try {
          const response = await fetch(`${A_URL}?page=${page}`, {
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          const result = await response.json();
          const dataToSet = result.data ? result.data : result;
          if (Array.isArray(dataToSet)) {
            setFormat(dataToSet);
            setLastPage(result.last_page || 1);
            setCurrentPage(result.current_page || 1);
          }
        } catch (error) {
          console.error("Erreur de chargement:", error);
        } finally {
          setLoading(false);
        }
    }, [token, A_URL]);

    useEffect(() => {
        fetchFormations(currentPage);
    }, [currentPage, fetchFormations]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadProgress(0);

        let videoPathOnServer = existingVideo;

        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // 1. Gestion du Chunk Upload si une NOUVELLE vidéo est présente
        if (formData.video) {
            try {
                const videoFile = formData.video as any as File;
                
                if (typeof formData.video !== 'string' && videoFile.size) {
                    const CHUNK_SIZE = 2 * 1024 * 1024; // Blocs stables de 2 Mo
                    const totalChunks = Math.ceil(videoFile.size / CHUNK_SIZE);
                    const uniqueFileName = `${Date.now()}-${videoFile.name.replace(/\s+/g, '_')}`;

                    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                        const start = chunkIndex * CHUNK_SIZE;
                        const end = Math.min(start + CHUNK_SIZE, videoFile.size);
                        const chunk = videoFile.slice(start, end);

                        const chunkForm = new FormData();
                        chunkForm.append('video_chunk', chunk);
                        chunkForm.append('chunk_index', chunkIndex.toString());
                        chunkForm.append('total_chunks', totalChunks.toString());
                        chunkForm.append('filename', uniqueFileName);

                        const chunkResponse = await fetch(`${API_URL}/formations/upload-chunk`, {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: chunkForm
                        });

                        if (!chunkResponse.ok) {
                            throw new Error(`Échec de l'envoi du morceau ${chunkIndex + 1}/${totalChunks}`);
                        }

                        // Progression calculée dynamiquement
                        const percentCompleted = Math.round(((chunkIndex + 1) / totalChunks) * 100);
                        setUploadProgress(percentCompleted);

                        if (chunkIndex === totalChunks - 1) {
                            const chunkResult = await chunkResponse.json();
                            videoPathOnServer = chunkResult.path; 
                        }

                        await sleep(1000); // Laisse respirer PlanetHoster pour éviter le 429
                    }
                }
            } catch (error) {
                console.error("Erreur lors du téléversement par morceaux :", error);
                setToast("Le serveur de l'entreprise limite le débit d'envoi. Veuillez réessayer.");
                setIsSubmitting(false);
                setUploadProgress(0);
                return;
            }
        }

        // 2. Préparation du reste du formulaire
        const dataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'video') return; // On ignore TOUJOURS l'objet File brut ici

                if ((key === 'programme') && typeof value === 'string') {
                    const encodedValue = btoa(encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
                        return String.fromCharCode(parseInt(p1, 16));
                    }));
                    dataToSend.append(key, encodedValue);
                } else {
                    dataToSend.append(key, value as any);
                }
            }
        });

        // REMPLACEZ VOTRE LOGIQUE VIDÉO PAR CELLE-CI :
        if (formData.video && videoPathOnServer) {
    // On envoie le chemin texte de la vidéo téléversée sous la clé 'video' attendue par l'API
            dataToSend.append('video', videoPathOnServer); 
        } else if (existingVideo) {
            // Si édition sans changement, on garde l'ancienne vidéo
            dataToSend.append('video', existingVideo);
        }
        
        if (editingId) {
            dataToSend.append('_method', 'PUT');
        }

        try {
            const url = editingId ? `${A_URL}/${editingId}` : A_URL;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: dataToSend,
            });

            if (response.ok) {
                setToast(editingId ? "Formation modifiée !" : "Formation enregistrée !");
                setFormData(initialForm);
                if (editorRef.current) editorRef.current.innerHTML = "";
                if (descRef.current) descRef.current.innerHTML = "";
                onClose();
            } else {
                const result = await response.json();
                setToast("Erreur : " + (result.message || "Vérifiez les champs"));
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            setToast("Impossible de contacter le serveur.");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files ? fileInput.files[0] : null;
            setFormData(prev => ({ ...prev, [name]: file }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch(`${API_URL}/categories-liste`)
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);

    const checkSelectionStyles = () => {
        setIsBold(document.queryCommandState("bold"));
        setIsItalic(document.queryCommandState("italic"));
        setIsBulletList(document.queryCommandState("insertUnorderedList"));
        setIsOrderedList(document.queryCommandState("insertOrderedList"));
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            setFormData(prev => ({ ...prev, programme: editorRef.current!.innerHTML }));
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

    const inputCls = "w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all";
    const labelCls = "block text-sm font-bold text-[#303972] mb-2";
    
      const [collaborators, setCollaborators] = useState<any[]>([]);

      useEffect(() => {
        const fetchAdminData = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            const collabRes = await fetch(`${API_URL}/trainers`, { headers: { 'Authorization': `Bearer ${token}` } });
            const collabData = await collabRes.json();
            setCollaborators(collabData);
          } catch (error) { console.error(error); }
        };
        fetchAdminData();
      }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-0 sm:p-4 font-sans antialiased"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <style>{`
                .custom-editor ul {
                  list-style-type: disc !important;
                  padding-left: 1.5rem !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .custom-editor ol {
                  list-style-type: decimal !important;
                  padding-left: 1.5rem !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .custom-editor li {
                  display: list-item !important;
                  margin-bottom: 0.25rem !important;
                }
            `}</style>
            
            <motion.div
                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full h-full sm:h-auto lg:w-[calc(100vw-120px)] xl:w-[calc(100vw-256px)] rounded-none sm:rounded-2xl shadow-xl border border-[#EBF0FF] overflow-hidden flex flex-col"
                style={{ maxHeight: "95vh" }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full sm:max-h-[92vh]">
                    
                    <div className="flex items-center justify-between px-8 py-5 border-b border-[#EBF0FF] shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-[#303972]">
                                {editingId ? "Modifier la formation" : "Créer une nouvelle formation"}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#A0A3BD] mt-0.5">
                                {editingId ? "Ajustez les paramètres et contenus de la formation" : "Renseignez les informations de la nouvelle formation"}
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

                    <div className="flex flex-1 overflow-hidden bg-white">
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8" style={{ scrollbarWidth: "thin" }}>
                            
                            <div className="bg-white rounded-2xl border border-[#EBF0FF] overflow-hidden shadow-sm">
                                <div className="bg-[#5A57D6] px-6 py-3.5">
                                    <h3 className="text-white font-semibold text-base">Médias de la formation</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className={labelCls}>
                                            Image couverture {editingId && <span className="font-normal text-[#A0A3BD]">(optionnel)</span>}
                                        </label>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#C1BBEB] rounded-2xl transition-all group ${isSubmitting ? "cursor-not-allowed opacity-50 bg-[#F3F4F9]" : "cursor-pointer hover:border-[#5A57D6] hover:bg-[#5A57D6]/5"}`}>
                                                <div className="flex flex-col items-center gap-1 text-center p-3">
                                                    <ImageIcon className="w-7 h-7 text-[#A0A3BD] group-hover:text-[#5A57D6] transition-colors" />
                                                    <span className="text-xs font-medium text-[#303972] group-hover:text-[#5A57D6] text-center line-clamp-2">
                                                        {formData.image ? (formData.image as File).name : "Sélectionner une image"}
                                                    </span>
                                                </div>
                                                <input name="image" onChange={handleInputChange} type="file" accept="image/*" className="hidden" disabled={isSubmitting} />
                                            </label>

                                            <div className="w-full h-32 border border-[#EBF0FF] rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
                                                {formData.image ? (
                                                    <img src={URL.createObjectURL(formData.image as File)} alt="Nouvelle" className="w-full h-full object-cover" />
                                                ) : existingImage ? (
                                                    <div className="relative w-full h-full">
                                                        <img src={existingImage.startsWith('http') ? existingImage : `${API_URL.replace("api","")}storage/${existingImage.replace(/^\/?storage\//, '')}`} alt="Actuelle" className="w-full h-full object-cover" />
                                                        <span className="absolute bottom-1 right-1 bg-[#303972] text-white text-[9px] px-2 py-0.5 rounded-full">Actuelle</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-[#A0A3BD]">Aucun aperçu</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className={labelCls}>
                                            Vidéo démo {editingId && <span className="font-normal text-[#A0A3BD]">(optionnel)</span>}
                                        </label>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#C1BBEB] rounded-2xl transition-all group ${isSubmitting ? "cursor-not-allowed opacity-50 bg-[#F3F4F9]" : "cursor-pointer hover:border-[#5A57D6] hover:bg-[#5A57D6]/5"}`}>
                                                <div className="flex flex-col items-center gap-1 text-center p-3">
                                                    <Video className="w-7 h-7 text-[#A0A3BD] group-hover:text-[#5A57D6] transition-colors" />
                                                    <span className="text-xs font-medium text-[#303972] group-hover:text-[#5A57D6] text-center line-clamp-2">
                                                        {formData.video ? (formData.video as any as File).name : "Sélectionner une vidéo"}
                                                    </span>
                                                </div>
                                                <input name="video" onChange={handleInputChange} type="file" accept="video/*" className="hidden" disabled={isSubmitting} />
                                            </label>

                                            <div className="w-full h-32 border border-[#EBF0FF] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-inner">
                                                {formData.video ? (
                                                    <video src={URL.createObjectURL(formData.video as any as File)} controls className="w-full h-full object-contain" />
                                                ) : existingVideo ? (
                                                    <video src={existingVideo.startsWith('http') ? existingVideo : `${API_URL.replace("api","")}storage/${existingVideo.replace(/^\/?storage\//, '')}`} controls className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs text-[#A0A3BD]">Aucun aperçu</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Lien youtube {editingId && <span className="font-normal text-[#A0A3BD]">(optionnel)</span>}</label>
                                            <input name="url_youtube" value={formData.url_youtube} onChange={handleInputChange} type="text" placeholder="Ex : https://www.youtube.com/watch?v=..." className={inputCls} disabled={isSubmitting} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-[#EBF0FF] overflow-hidden shadow-sm">
                                <div className="bg-[#5A57D6] px-6 py-3.5">
                                    <h3 className="text-white font-semibold text-base">Informations Générales</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className={labelCls}>Titre de la formation <span className="text-red-500">*</span></label>
                                        <input name="titre" value={formData.titre} onChange={handleInputChange} type="text" required placeholder="Ex : Formation Excel avancé" className={inputCls} disabled={isSubmitting} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelCls}>Catégorie</label>
                                            <div className="relative">
                                                <select name="categorie" value={formData.categorie} onChange={handleInputChange} className={inputCls + " appearance-none pr-10"} disabled={isSubmitting}>
                                                    <option value="">Sélectionner une catégorie</option>
                                                    {categories.map((cat: any) => (
                                                        <option key={cat.id} value={cat.nom_cat}>{cat.nom_cat}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#303972]">
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Difficulté</label>
                                            <div className="relative">
                                                <select name="difficulte" value={formData.difficulte} onChange={handleInputChange} className={inputCls + " appearance-none pr-10"} disabled={isSubmitting}>
                                                    <option>Facile</option>
                                                    <option>Moyenne</option>
                                                    <option>Difficile</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#303972]">
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelCls}>Formateur</label>
                                            <div className="relative">
                                                <select 
                                                    name="admin_id" // 1. Doit correspondre à la clé dans initialForm
                                                    value={formData.admin_id} // 2. Doit être lié à l'état dynamique du formulaire
                                                    onChange={handleInputChange} 
                                                    className={inputCls + " appearance-none pr-10"} 
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="">Sélectionner un formateur</option>
                                                    {collaborators.map((coll: any) => (
                                                        // Utilisez coll.nom ou coll.id selon ce que votre API attend en base de données
                                                        <option key={coll.id} value={coll.id}>{coll.nom}</option> 
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#303972]">
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Type de tarification</label>
                                            <div className="relative">
                                                <select name="type" value={formData.type} onChange={handleInputChange} className={inputCls + " appearance-none pr-10"} disabled={isSubmitting}>
                                                    <option>Payante</option>
                                                    <option>Gratuite</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#303972]">
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-[#EBF0FF] overflow-hidden shadow-sm">
                                <div className="bg-[#5A57D6] px-6 py-3.5">
                                    <h3 className="text-white font-semibold text-base">Détails de l'Offre</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelCls}>Frais (Ariary)</label>
                                        <input name="frais" value={formData.frais} onChange={handleInputChange} type="number" placeholder="0" className={inputCls} disabled={isSubmitting} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Commission (%)</label>
                                        <input name="commission" value={formData.commission} onChange={handleInputChange} type="number" placeholder="0" className={inputCls} disabled={isSubmitting} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Durée estimée</label>
                                        <div className="relative">
                                            <input name="duree" value={formData.duree} onChange={handleInputChange} type="text" placeholder="Ex : 4 semaines" className={inputCls + " pr-10"} disabled={isSubmitting} />
                                            <div className="absolute inset-y-0 right-0 flex items-center px-4 text-[#A0A3BD] pointer-events-none">
                                                <Calendar size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-[#EBF0FF] overflow-hidden shadow-sm">
                                <div className="bg-[#5A57D6] px-6 py-3.5">
                                    <h3 className="text-white font-semibold text-base">Descriptifs du Programme</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className={labelCls}>Programme détaillé</label>
                                        <div className="flex items-center gap-1 px-4 py-2 bg-[#FDFDFF] border border-[#C1BBEB] border-b-0 rounded-t-xl">
                                            <button type="button" onMouseDown={(e) => execCommand(e, 'bold', editorRef, handleEditorChange)}
                                                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${isBold ? 'bg-[#5A57D6] text-white shadow-sm' : 'text-[#303972] hover:bg-gray-100'}`}>B</button>
                                            <button type="button" onMouseDown={(e) => execCommand(e, 'italic', editorRef, handleEditorChange)}
                                                className={`w-8 h-8 rounded-lg text-xs italic flex items-center justify-center transition-all ${isItalic ? 'bg-[#5A57D6] text-white shadow-sm' : 'text-[#303972] hover:bg-gray-100'}`}>I</button>
                                            <button type="button" onMouseDown={(e) => execCommand(e, 'underline', editorRef, handleEditorChange)}
                                                className="w-8 h-8 rounded-lg text-xs underline flex items-center justify-center text-[#303972] hover:bg-gray-100 transition-all">U</button>
                                            <div className="w-px h-5 bg-[#C1BBEB] mx-1" />
                                            <button type="button" onMouseDown={(e) => execCommand(e, 'insertUnorderedList', editorRef, handleEditorChange)}
                                                className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${isBulletList ? 'bg-[#5A57D6] text-white shadow-sm' : 'text-[#303972] hover:bg-gray-100'}`}>•≡</button>
                                            <button type="button" onMouseDown={(e) => execCommand(e, 'insertOrderedList', editorRef, handleEditorChange)}
                                                className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all ${isOrderedList ? 'bg-[#5A57D6] text-white shadow-sm' : 'text-[#303972] hover:bg-gray-100'}`}>1.≡</button>
                                        </div>
                                        <div
                                            ref={editorRef}
                                            contentEditable
                                            onInput={handleEditorChange}
                                            onKeyUp={checkSelectionStyles}
                                            onMouseUp={checkSelectionStyles}
                                            className="w-full px-4 py-3 text-left bg-white border border-[#C1BBEB] rounded-b-xl text-sm text-[#303972] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all min-h-32 custom-editor resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col w-80 bg-[#FDFDFF] border-l border-[#EBF0FF] p-6 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-[#303972] uppercase tracking-wide">Aperçu en direct</p>
                                <span className="text-[10px] bg-emerald-100 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full animate-pulse">LIVE</span>
                            </div>

                            <div className="flex-1 bg-white rounded-2xl border border-[#EBF0FF] shadow-sm p-5 text-xs text-[#333333] space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] text-[#A0A3BD]">
                                        <span>Par : {nomAdmin}</span>
                                        <span>{new Date().toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div className="h-px bg-[#EBF0FF] mt-2" />
                                </div>

                                <div className="text-center py-1">
                                    <p className="text-sm font-bold text-[#303972] line-clamp-2">{formData.titre || "Titre de la formation"}</p>
                                </div>

                                <div className="space-y-2 bg-[#FDFDFF] p-3 rounded-xl border border-[#EBF0FF]">
                                    {[
                                        { label: "Catégorie", val: formData.categorie },
                                        { label: "Difficulté", val: formData.difficulte },
                                        { label: "Tarification", val: formData.type },
                                        { label: "Durée", val: formData.duree ? `${formData.duree}` : "0 min"},
                                        { label: "Frais", val: formData.frais ? `${formData.frais} Ar` : "0 Ar" },
                                        { label: "Commission", val: formData.commission ? `${formData.commission} %` : "0 %" },
                                        // { label: "Cibles", val: formData.cibles },
                                    ].map((item, i) => (
                                        item.val && (
                                            <div key={i} className="flex justify-between gap-2">
                                                <span className="text-[10px] font-semibold text-[#A0A3BD] whitespace-nowrap">{item.label}</span>
                                                <span className="text-[10px] text-[#303972] font-bold text-right truncate">{item.val}</span>
                                            </div>
                                        )
                                    ))}
                                </div>

                                {formData.programme && (
                                    <>
                                        <div className="bg-[#EBF0FF]" />
                                        <div>
                                            <p className="text-[10px] font-bold text-[#5A57D6] mb-1">Programme</p>
                                            <div 
                                                className="text-[11px] text-[#333333] custom-editor overflow-y-auto"
                                                dangerouslySetInnerHTML={{ __html: formData.programme }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 px-8 py-4 border-t border-[#EBF0FF] bg-white shrink-0">
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
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" /> 
                                    {uploadProgress > 0 && uploadProgress < 100 
                                        ? `Vidéo : ${uploadProgress}%` 
                                        : "Enregistrement en cours..."
                                    }
                                </>
                            ) : editingId ? (
                                "Mettre à jour"
                            ) : (
                                "Créer la formation"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default AjoutFormation;