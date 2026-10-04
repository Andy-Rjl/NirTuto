import { useState, useEffect, useMemo } from 'react';
import Sidebar from './../../Component/Sidebar';
import MainContent from './MainContent';
import RightSidebar from './RightSidebar';
import { getMe } from './../../service/Auth';
import { API_URL } from '../../../../lib/api';
import { PaymentModal } from '../Formation/DetailFormation/PayementModal';
import { SuccessAlert } from '../Formation/DetailFormation/SuccessAlert';
import { useNavigate } from 'react-router-dom';

interface PaymentData {
  numero_paiement: string;
  reference_transaction: string;
  methode: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  /* ── Données ── */
  const [inscriptions, setInscriptions]     = useState<any[]>([]);
  const [allFormations, setAllFormations]   = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState('');
  const [user, setUser]                     = useState<any>(null);

  /* ── Vues ── */
  const [showQcm, setShowQcm]               = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [rating, setRating]                 = useState(0);

  /* ── QCM ── */
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [selectedCours, setSelectedCours]         = useState<any>(null);
  const [selectedQcm, setSelectedQcm]             = useState<any>(null);
  const [userAnswers, setUserAnswers]             = useState<any>({});
  const [formation, setFormation]                 = useState<any>(null);
  const [isSubmitted, setIsSubmitted]             = useState(false);
  const [score, setScore]                         = useState(0);
  const [isLoading, setIsLoading]                 = useState(false);
  const [scores, setScores]                       = useState<any[]>([]);

  /* ── Assiduité ── */
  const [connectedDays, setConnectedDays] = useState<number[]>([]);

  const token = localStorage.getItem('token');

  // Fonction isolée pour recharger uniquement les inscriptions (réutilisable)
  const refreshInscriptions = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };
      const resMes = await fetch(`${API_URL}/etudiant/mes-formations`, { headers });
      const dataMes = await resMes.json();
      setInscriptions(Array.isArray(dataMes) ? dataMes : dataMes.data || []);
    } catch (err) {
      console.error("Erreur rafraîchissement inscriptions :", err);
    }
  };

  /* FETCH — formations inscrites + toutes formations */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        };
        const [resMes, resAll] = await Promise.all([
          fetch(`${API_URL}/etudiant/mes-formations`, { headers }),
          fetch(`${API_URL}/formations-all`, { headers }),
        ]);
        const dataMes = await resMes.json();
        const dataAll = await resAll.json();
        
        setInscriptions(Array.isArray(dataMes) ? dataMes : dataMes.data || []);
        setAllFormations(Array.isArray(dataAll) ? dataAll : dataAll.data || []);
      } catch (error) {
        console.error('Erreur Fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Utilisateur courant */
  useEffect(() => {
    getMe()
      .then((data: any) => { setUser(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  /* Récupérer les Scores QCM */
  const fetchScores = () => {
    if (!token) return;
    fetch(`${API_URL}/etudiant/quiz/scores`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setScores(data);
        } else if (data && Array.isArray(data.data)) {
          setScores(data.data);
        } else if (data && Array.isArray(data.scores)) {
          setScores(data.scores);
        } else {
          setScores([]);
        }
      })
      .catch(err => console.error("Erreur chargement scores:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScores();
  }, [token]);

  /* Score du QCM sélectionné */
  useEffect(() => {
    const fetchResult = async () => {
      if (!selectedQcm || !token) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/quiz/result/${selectedQcm.id}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const data = await res.json();
        if (data.completed) { setScore(data.score); setIsSubmitted(true); }
      } catch (error) {
        console.error('Erreur réseau:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [selectedQcm, token]);

  /* Assiduité hebdomadaire */
  useEffect(() => {
    const STORAGE_KEY = 'assiduite_semaine';
    const getCurrentWeekKey = () => {
      const now = new Date();
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      return monday.toISOString().split('T')[0];
    };

    const currentWeekKey = getCurrentWeekKey();
    const stored = localStorage.getItem(STORAGE_KEY);
    let data = { weekKey: currentWeekKey, days: [] as number[] };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.weekKey === currentWeekKey) data = parsed;
      } catch { }
    }

    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;
    if (!data.days.includes(todayIndex)) {
      data.days = [...data.days, todayIndex].sort((a, b) => a - b);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setConnectedDays(data.days);
  }, []);

  /* ── DÉRIVÉS FILTRÉS ── */
  const filteredInscriptions = inscriptions.filter(f => f.statut === 'confirme');
  const formationsEnAttente = inscriptions.filter(f => f.statut === 'en_attente');

  const recommandations = useMemo(() => {
    if (!allFormations.length) return [];
    const idsInscrits = inscriptions.map(f => Number(f.formation_id || f.id));

    if (!filteredInscriptions.length) {
      return allFormations.filter(f => !idsInscrits.includes(Number(f.id)));
    }

    const catsSuivies = filteredInscriptions.map(f => f.categorie?.toString().toLowerCase().trim() || '');

    return allFormations.filter(f => {
      const cat = f.categorie?.toString().toLowerCase().trim() || '';
      const estDejaInscrit = idsInscrits.includes(Number(f.id));
      return catsSuivies.includes(cat) && !estDejaInscrit;
    });
  }, [filteredInscriptions, inscriptions, allFormations]);

  /* HANDLERS */
  const closeQcmMode = () => {
    setShowQcm(false);
    setSelectedFormation(null);
    setSelectedCours(null);
    setSelectedQcm(null);
    setUserAnswers({});
  };

  const fetchFormationDetails = async (formationId: number) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
      const [resFormation, resQcm] = await Promise.all([
        fetch(`${API_URL}/etudiant/formation/${formationId}`, { headers }),
        fetch(`${API_URL}/qcms`, { headers }),
      ]);
      const dataFormation = await resFormation.json();
      const allQcms = await resQcm.json();
      if (dataFormation.cours && Array.isArray(allQcms)) {
        dataFormation.cours = dataFormation.cours.map((cours: any) => ({
          ...cours,
          qcm: allQcms.filter((q: any) => Number(q.cours_id) === Number(cours.id)),
        }));
      }
      setFormation(dataFormation);
    } catch (error) {
      console.error('Erreur détails formation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    let totalCorrect = 0;
    selectedQcm.questions.forEach((q: any) => {
      if (userAnswers[q.id] == q.correctOptionId) totalCorrect++;
    });
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/quiz/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          qcm_id: selectedQcm.id,
          score: totalCorrect,
          total: selectedQcm.questions.length,
          answers: userAnswers,
        }),
      });
      const data = await res.json();
      if (res.ok) { 
        setScore(data.score); 
        setIsSubmitted(true); 
        fetchScores(); 
      }
    } catch {
      alert('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── États pour la Modal de Paiement ── */
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    methode: 'mvola',
    reference_transaction: '',
    numero_paiement: ''
  });

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Soumission du formulaire de paiement
  const handleInscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Récupération sécurisée de l'ID de la formation
    const targetId = selectedFormation?.formation_id || selectedFormation?.id;

    try {
      const res = await fetch(`${API_URL}/etudiant/payer-formation/${targetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (res.ok) {
        setShowModal(false);
        setShowSuccessAlert(true);
        // Rechargement immédiat de la liste
        await refreshInscriptions();
      } else {
        alert("Erreur lors de la soumission du paiement.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Déclenché au clic sur "Payer" depuis ListeCoursEtud
  const openPaymentModal = (formationItem: any) => {
    setSelectedFormation(formationItem); 
    setPaymentData({ 
      methode: 'mvola', // Forcé sur mvola d'office
      reference_transaction: '', 
      numero_paiement: '' 
    }); 
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      {showSuccessAlert && (
        <SuccessAlert
          onClose={() => setShowSuccessAlert(false)}
          onContinue={() => { setShowSuccessAlert(false); navigate('/dash'); }}
        />
      )}
      <main className="flex-1 lg:ml-64 2xl:ml-64 min-w-0 flex gap-0">
        <MainContent
          user={user}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredInscriptions={filteredInscriptions} 
          inscriptions={filteredInscriptions}
          formationsEnAttente={formationsEnAttente}     
          connectedDays={connectedDays}
          showQcm={showQcm}
          setShowQcm={setShowQcm}
          showEvaluation={showEvaluation}
          setShowEvaluation={setShowEvaluation}
          rating={rating}
          setRating={setRating}
          selectedFormation={selectedFormation}
          setSelectedFormation={setSelectedFormation}
          selectedCours={selectedCours}
          setSelectedCours={setSelectedCours}
          selectedQcm={selectedQcm}
          setSelectedQcm={setSelectedQcm}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          formation={formation}
          setFormation={setFormation}
          fetchFormationDetails={fetchFormationDetails}
          closeQcmMode={closeQcmMode}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          score={score}
          isLoading={isLoading}
          scores={scores}
          handleSubmit={handleSubmit}
          onOpenPaymentModal={openPaymentModal}
        />
        <RightSidebar
          user={user}
          inscriptions={filteredInscriptions} 
          recommandations={recommandations}
        />
      </main>

      {/* ── Modal de Paiement réajustée (retrait du filtre strict .type) ── */}
      {showModal && selectedFormation && (
        <PaymentModal
          formation={selectedFormation}
          paymentData={paymentData}
          setPaymentData={setPaymentData}
          submitting={submitting}
          onSubmit={handleInscriptionSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;