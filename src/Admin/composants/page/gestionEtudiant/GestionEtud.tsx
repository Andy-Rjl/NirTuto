import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserCheck, Library, Plus} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./../../../lib/api";

import ModalInscriptionCertif from "./ModalInscr_Certif";
import Tous from "./Tous";
import FormationSuivi from "./FormationSuivi";
import AutreCard from "./AutreCard";

interface Formation {
  id: number;
  titre: string;
  pivot: {
      id: number;
      numero_paiement: string;
      reference_transaction: string;
      methode: string;
      statut: string;
  };
  categorie: string; 
  etudiants_count: number;
  type: string,
  frais: number
}

interface UserDemande {
  id: number;
  nom: string;
  formations: Formation[];
}

interface Student {
  photo: any;
  nom: string;
  prenom: string;
  email: string;
  formation: string;
  formation_id?: number;
  progress: string;
  id?: number;
}

const GestionEtud = () => {
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [, setLoading] = useState(true);
  const [, setTotalInscrits] = useState(0);
  const [activeTab, setActiveTab] = useState("tous");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"validation" | "formulaire">("validation");
  const [selectedFormation, setSelectedFormation] = useState<{titre: string, isCategory: boolean} | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [progressionMap, setProgressionMap] = useState<Record<string, { completed: number; total: number; percent: number }>>({});
  const [categoryProgressions, setCategoryProgressions] = useState<Record<string, number>>({});
  const [loadingProgression, setLoadingProgression] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/etudiants-inscrits`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (response.ok) {
          setEtudiants(result.data);
          setTotalInscrits(result.count);
        } else {
          console.error("Erreur API:", result);
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEtudiants();
  }, []);

  useEffect(() => {
    if (etudiants.length === 0) return;
    const validStudents = etudiants.filter(s => s.id && s.formation_id);
    if (validStudents.length === 0) return;

    const loadAll = async () => {
      const results: Record<string, number> = {};
      const detailResults: Record<string, { completed: number; total: number; percent: number }> = {};
      await Promise.all(
        validStudents.map(async (st) => {
          const key = `${st.id}-${st.formation_id}`;
          try {
            const res = await fetch(
              `${API_URL}/admin/etudiant/${st.id}/formation/${st.formation_id}/progression`,
              { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            if (res.ok) {
              const data = await res.json();
              const percent = data.percent ?? 0;
              const completed = data.completed_count ?? 0;
              const total = data.total_count ?? 0;
              results[key] = percent;
              detailResults[key] = { completed, total, percent };
            }
          } catch (e) {
            results[key] = 0;
            detailResults[key] = { completed: 0, total: 0, percent: 0 };
          }
        })
      );
      setCategoryProgressions(results);
      setProgressionMap(prev => ({ ...prev, ...detailResults }));
    };
    loadAll();
  }, [etudiants]);

  const loadStudentProgression = async (student: Student, force = false) => {
    const formationId = student.formation_id;
    const studentId = student.id;
    if (!formationId || !studentId) return;

    const key = `${studentId}-${formationId}`;
    if (!force && progressionMap[key]) return;
    setLoadingProgression(prev => ({ ...prev, [key]: true }));

    try {
      const res = await fetch(`${API_URL}/admin/etudiant/${studentId}/formation/${formationId}/progression`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        const completed = data.completed_count ?? 0;
        const total = data.total_count ?? 0;
        const percent = data.percent ?? (total > 0 ? Math.round((completed / total) * 100) : 0);
        setProgressionMap(prev => ({ ...prev, [key]: { completed, total, percent } }));
        setCategoryProgressions(prev => ({ ...prev, [key]: percent }));
      }
    } catch (e) {
      console.error("Erreur progression:", e);
    } finally {
      setLoadingProgression(prev => ({ ...prev, [key]: false }));
    }
  };

  const navigate = useNavigate();
  const [demandes, setDemandes] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/admin/inscriptions-en-attente`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => { setDemandes(data); });
  }, []);

  const handleValider = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/admin/inscriptions/${id}/valider`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setDemandes(demandes.filter((ins: any) => ins.id !== id));
        navigate("/admin/dashboard");
      } else {
        const error = await response.json();
        alert("Erreur : " + (error.message || "Impossible de valider"));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/categories-uniques`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAllCategories(data));
  }, []);

  // Message 
  const [selectedContact] = useState<any>(null);
  const [, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (selectedContact) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`${API_URL}/messages/${selectedContact.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Erreur messages:", error);
        }
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);


  const [searchTerm] = useState("");

  const uniqueEtudiants: any[] = Array.from(
    etudiants.reduce((acc, current) => {
      const key = current.email;
      const existing = acc.get(key);
      const realId = current.authentification_id || current.user_id || current.id;
      if (!existing) {
        return acc.set(key, { 
          ...current, 
          id: realId, 
          allFormations: [current.formation] 
        });
      } else {
        return acc.set(key, { 
          ...existing, 
          allFormations: [...existing.allFormations, current.formation] 
        });
      }
    }, new Map()).values()
  );

  const filteredEtudiants = uniqueEtudiants.filter((etud) =>
    etud.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Stats 
  const [count, setCount] = useState({ etudiant: 0, formateur: 0, formation: 0 });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`${API_URL}/stats/etudiants-count`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setCount({ etudiant: data.total || 0, formateur: data.total_formateur || 0, formation: data.total_formation || 0 });
      } catch (error) {
        console.error("Erreur lors de la récupération du compte:", error);
      }
    };
    fetchCount();
  }, []);

  // Certification
  const [demande, setDemande] = useState<any[]>([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/certificats/en-attente`, {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
        });
        const result = await response.json();
        setDemande(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, []);

  const handleValide = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/certificats/valider/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json", "Content-Type": "application/json" }
      });
      if (response.ok) {
        setDemande(prev => prev.filter(d => d.id !== id));
      }
    } catch (error) {
      alert("Erreur lors de la validation");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "confirm", onConfirm?: () => void) => {
    if (type === "confirm") {
      if (window.confirm(message)) {
        onConfirm?.();
      }
    } else {
      alert(message);
    }
  };

  const handleRefuse = async (idInscription: number) => {
    try {
      const response = await fetch(`${API_URL}/admin/inscriptions/${idInscription}/refuser`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          'Accept': 'application/json', 
          'Content-Type': 'application/json' 
        }
      });
      if (response.ok) {
        setDemandes(prev => prev.filter((r: any) => r.id !== idInscription));
      } else {
        showToast("Une erreur est survenue lors du refus.", "error");
      }
    } catch (error) {
      showToast("Impossible de joindre le serveur.", "error");
    }
  };

  const handleRejeterCertif = async (idCertif: number) => {
    try {
      const response = await fetch(`${API_URL}/certificats/refuser/${idCertif}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          'Accept': 'application/json', 
          'Content-Type': 'application/json' 
        }
      });
      if (response.ok) {
        setDemande(prev => prev.filter(d => d.id !== idCertif));
      } else {
        showToast("Une erreur est survenue lors du rejet du certificat.", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "formations suivi":
        return (
          <FormationSuivi
            allCategories={allCategories}
            etudiants={etudiants}
            categoryProgressions={categoryProgressions}
            progressionMap={progressionMap}
            loadingProgression={loadingProgression}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            loadStudentProgression={loadStudentProgression}
          />
        );

      default:
        return (
          <Tous uniqueEtudiants={uniqueEtudiants} />
        );
    }
  };

  const [, setUnreadIds] = useState<number[]>([]);
  const [, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/notifications/unread`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setUnreadIds(data.sender_ids || []);
        setUnreadCount(data.total_count || 0);
      } catch (error) {
        console.error("Erreur notifications:", error);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // ── AJOUT : Filtrer les demandes d'inscriptions valides au niveau du parent ──
  const demandesValidesCount = demandes.filter(
    (ins) => ins.reference_transaction && ins.numero_paiement && ins.methode
  ).length;

  // Calcul du total combiné des notifications (Inscriptions filtrées + Certifications)
  const totalNotifications = demandesValidesCount + demande.length;

  return (
    <div className="w-full mx-auto p-8 space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="flex gap-4 p-1.5 bg-slate-100 w-fit rounded-2xl">
          {[{ id: "tous", label: "Tous", icon: <Users size={16}/> }, { id: "formations suivi", label: "Formations suivi", icon: <Library size={16}/> }].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedFormation(null); setSelectedStudent(null); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all relative ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="relative flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
          <Plus size={18} /> Inscription/Certification
          
          {/* ── Modification ici : On utilise la valeur filtrée pour le badge rouge ── */}
          {totalNotifications > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
              {totalNotifications}
            </span>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 ">
          <UserCheck size={22} className="text-indigo-600"/> Section <span className="text-indigo-500 uppercase text-xs tracking-widest underline decoration-2 underline-offset-4">{activeTab}</span>
        </h2>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>{renderContent()}</motion.div>
        </AnimatePresence>
      </div>

      <AutreCard
        uniqueEtudiants={uniqueEtudiants}
        demandes={demandes}
        demande={demande}
        filteredEtudiants={filteredEtudiants}
        formation={count.formation}
        etudiants={etudiants}
      />

      <ModalInscriptionCertif
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        setModalMode={setModalMode}
        demandes={demandes}
        demande={demande}
        handleValider={handleValider}
        handleValide={handleValide}
        handleRefuse={handleRefuse}
        handleRejeterCertif={handleRejeterCertif}
        setPendingRequests={setDemandes}
        setDemande={setDemande} 
        showToast={showToast}      
      />
    </div>
  );
};

export default GestionEtud;