import { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Cours from './Cours';
import Qcm from './Qcm';
import type { MenuType } from './types';
import Message from './Message';
import { API_URL } from '../lib/api'; 
import AjoutCours from './AjoutCours';
import AjoutQcm from './AjoutQcm';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Formation {
  id: number;
  titre: string;
  cours: Array<{
    id: number;
    titre: string;
    video_path: string;
    duree: string;
    url_youtube?: string;
    description: string;
  }>;
}

interface Qcm {
  id: number;
  titre: string;
  cours?: { titre: string };
  questions: Question[];
}

interface Option {
  id: number;
  texte: string;
}

interface Question {
  question: any;
  id: number;
  enonce: string;
  correct_index: number;
  options: Option[];
}

function Formateur() {
  const [activeMenu, setActiveMenu] = useState<MenuType>('Cours');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [formations, setFormations] = useState<any[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [editingCoursId, setEditingCoursId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [formationSelectionneeId, setFormationSelectionneeId] = useState("");
  const [coursAssocieId, setCoursAssocieId] = useState("");

  // Système de polling global pour les messages non lus
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/notifications/unread`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          const contactsWithUnread = Object.keys(data.counts || {}).length;
          setUnreadCount(contactsWithUnread);
        }
      } catch (error) {
        console.error("Erreur notifications dans Apps.tsx:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // QCM États & Méthodes
  const [listeQcmEnregistres, setListeQcmEnregistres] = useState<Qcm[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQcmId, setExpandedQcmId] = useState<number | null>(null);

  const formationsGroupees = useMemo(() => {
    return listeQcmEnregistres.reduce((acc, qcm) => {
      const formationTitre = (qcm.cours as any)?.formation?.titre || "Formation non classée";
      const coursTitre = qcm.cours?.titre || "Cours divers";
      if (!acc[formationTitre]) acc[formationTitre] = {};
      if (!acc[formationTitre][coursTitre]) acc[formationTitre][coursTitre] = [];
      acc[formationTitre][coursTitre].push(qcm);
      return acc;
    }, {} as Record<string, Record<string, Qcm[]>>);
  }, [listeQcmEnregistres]);
  
  const deleteQcm = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce QCM ?")) return;
    try {
      const response = await fetch(`${API_URL}/qcms/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        setListeQcmEnregistres(prev => prev.filter(qcm => qcm.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQcms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/qcms`, { headers: { 'Accept': 'application/json' } });
      const data = await response.json();
      setListeQcmEnregistres(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQcms(); }, []);

  const [titreQcm, setTitreQcm] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  // Gestion des cours
  const [cours, setCours] = useState({
    titre: "",
    formation_id: "",
    description: "",
    duree: "",
    url_youtube: "",
    video_path: "" 
  });

  const fetchFormations = async () => {
    try {
      const response = await fetch(`${API_URL}/formations`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      const formationsArray = Array.isArray(data) ? data : (data.data || []);
      setFormations(formationsArray);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFormations();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setCours({ ...cours, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  // Nouvelle méthode pour réinitialiser proprement la vidéo chargée ou pré-existante
  const handleClearVideo = () => {
    setVideoFile(null);
    setCours(prev => ({ ...prev, video_path: "" }));
  };
  
  const handleEditCours = (coursSelectionne: any, formationId: number) => {
    setEditingCoursId(coursSelectionne.id);
    setCours({
      titre: coursSelectionne.titre,
      formation_id: String(formationId),
      description: coursSelectionne.description || "",
      duree: coursSelectionne.duree || "",
      url_youtube: coursSelectionne.url_youtube || "",
      video_path: coursSelectionne.video_path || ""
    });
    setVideoFile(null);
    setUploadProgress(0);
    setActiveMenu('Ajout Cours');
  };
  
  const handleDeleteCours = async (coursSelectionne: any) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le cours "${coursSelectionne.titre}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/cours/${coursSelectionne.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        setToast("Cours supprimé avec succès !");
        await refreshData();
      } else {
        const errorData = await response.json();
        setToast("Erreur : " + (errorData.message || "Échec de la suppression"));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setToast("Erreur réseau lors de la suppression.");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cours.formation_id) {
      setToast("Veuillez sélectionner une formation");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0); 

    let finalVideoPath = cours.video_path || null;
    const token = localStorage.getItem("token");

    // 1. Chunk Upload si un nouveau fichier vidéo est choisi
    if (videoFile) {
      try {
        const CHUNK_SIZE = 2 * 1024 * 1024;
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

          const chunkResponse = await fetch(`${API_URL}/cours/upload-chunk`, {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: chunkForm
          });

          if (!chunkResponse.ok) {
            const errData = await chunkResponse.json().catch(() => ({}));
            console.error("Détails erreur serveur :", errData);
            throw new Error(`Erreur lors du transfert du morceau ${chunkIndex + 1}/${totalChunks}`);
          }

          // Mise à jour de la barre de progression globale du téléversement
          const progressPercent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
          setUploadProgress(progressPercent);

          await new Promise((resolve) => setTimeout(resolve, 600));

          if (chunkIndex === totalChunks - 1) {
            const chunkResult = await chunkResponse.json();
            finalVideoPath = chunkResult.path;
          }
        }
      } catch (error) {
        console.error("Erreur Chunk Upload :", error);
        setToast("Impossible de téléverser la vidéo volumineuse. Vérifiez votre connexion.");
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Envoi final des métadonnées
    const formData = new FormData();
    formData.append("titre", cours.titre);
    formData.append("formation_id", cours.formation_id);
    formData.append("description", cours.description || "");
    formData.append("duree", cours.duree || "");
    formData.append("url_youtube", cours.url_youtube || "");
    
    // Si la vidéo a été supprimée (chaîne vide), on envoie une valeur vide au serveur ou on gère selon l'API
    formData.append("video_path", finalVideoPath || "");

    let url = `${API_URL}/admin/cours`.replace(/\/$/, "");
    
    if (editingCoursId) {
      url = `${API_URL}/admin/cours/${editingCoursId}`;
      formData.append("_method", "PUT"); 
    }

    try {
      const response = await fetch(url, {
        method: "POST", 
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: formData
      });

      if (response.ok) {
        setToast(editingCoursId ? "Cours mis à jour avec succès !" : "Cours enregistré avec succès !");
        
        setCours({ titre: "", formation_id: "", description: "", duree: "", video_path: "", url_youtube: "" });
        setVideoFile(null);
        setEditingCoursId(null);
        setUploadProgress(0);

        await refreshData();
      } else {
        const errorData = await response.json();
        setToast("Erreur : " + (errorData.message || "Échec de l'enregistrement"));
      }
    } catch (error) {
      console.error("Erreur d'envoi final:", error);
      setToast("Erreur réseau lors de la finalisation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [formation, setFormation] = useState<Formation[]>([]);
  const [, setLoadings] = useState(true);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const toggleFormation = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const refreshData = async () => {
    const A_URL = `${API_URL}/admin/formations-with-cours`;
    try {
      const response = await fetch(A_URL, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Accept": "application/json",
        }
      });
      if (!response.ok) throw new Error("Erreur réseau");
      const data = await response.json();
      setFormation(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur de chargement", error);
      setFormation([]);
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => { refreshData(); }, []);

  const handleSubmitQCM = async (e: React.FormEvent) => {
    e.preventDefault();
    const qcmData = {
      titre: titreQcm,
      cours_id: coursAssocieId,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex
      }))
    };

    try {
      const response = await fetch(`${API_URL}/qcms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(qcmData)
      });
      if (response.ok) {
        setToast("QCM enregistré avec succès !");
        setTitreQcm("");
        setCoursAssocieId("");
        setQuestions([]);
      }
    } catch (error) {
      setToast("Erreur réseau");
    }
  };

  const coursFiltrés = useMemo(() => {
    if (!formationSelectionneeId || !formation) return [];
    const f = formation.find(item => String(item.id) === String(formationSelectionneeId));
    return (f && f.cours) ? f.cours : [];
  }, [formationSelectionneeId, formation]);
  
  const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormationSelectionneeId(e.target.value);
    setCoursAssocieId("");
  };
  
  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), question: "", options: ["", "", "", ""], correctIndex: 0 }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Cours': 
        return <Cours 
          formation={formation}
          expandedId={expandedId}
          toggleFormation={toggleFormation}
          setShowDeleteModal={handleDeleteCours} 
          onEditCours={handleEditCours}
        />;
      case 'Ajout Cours':
        return <AjoutCours
          cours={cours}
          formations={formations}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleClearVideo={handleClearVideo} // Injection de la nouvelle prop
          handleSubmit={handleSubmit}
          isEditing={editingCoursId !== null} 
          videoFile={videoFile}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
        />;
      case 'Ajout QCM':
        return <AjoutQcm
          titreQcm={titreQcm}
          setTitreQcm={setTitreQcm}
          formations={formations}
          formationSelectionneeId={formationSelectionneeId}
          handleFormationChange={handleFormationChange}
          coursAssocieId={coursAssocieId}
          setCoursAssocieId={setCoursAssocieId}
          coursFiltrés={coursFiltrés}
          questions={questions}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
          updateOption={updateOption}
          handleSubmitQCM={handleSubmitQCM}
        />;
      case 'Qcm':
        return <Qcm 
          loading={loading}
          listeQcmEnregistres={listeQcmEnregistres}
          formationsGroupees={formationsGroupees}
          expandedQcmId={expandedQcmId}
          setExpandedQcmId={setExpandedQcmId}
          deleteQcm={deleteQcm}
        />;
      case 'Message': 
        return <Message />;

      default:
        return (
          <div className="p-10 flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-black text-slate-400">Section non trouvée</h1>
            <p className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mt-2 bg-slate-100 px-4 py-1 rounded-full">
              Valeur reçue : "{activeMenu}"
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        unreadCount={unreadCount} 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar currentMenu={activeMenu} />
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
           {renderContent()}
           {toast && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="fixed bottom-10 right-10 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-80 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">{toast}</span>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Formateur;