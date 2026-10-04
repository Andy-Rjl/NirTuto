import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import Sidebar from './../../../Component/Sidebar';
import { API_URL } from '../../../../../lib/api';
import { SuccessAlert } from './SuccessAlert';
import { FormationHero } from './FormationHero';
import { ContentTabs } from './ContentTabs';
import { EnrollSidebar } from './EnrollSidebar';
import { PaymentModal } from './PayementModal';
import { RICH_CONTENT_STYLES } from './types';
import type { Data, PaymentData, StatutInscription } from './types';

const getYoutubeId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const LoadingSpinner = () => {
  const bars = Array.from({ length: 12 });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-white">
      <div className="relative h-20 w-20">
        {bars.map((_, i) => {
          const rotation = i * 30; 
          const opacity = 0.25 + (i / bars.length) * 0.75; 
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-7 w-2 -translate-x-1/2 -translate-y-full rounded-full bg-blue-500"
              style={{
                transform: `rotate(${rotation}deg) translateY(-150%)`,
                opacity,
                animation: 'spin-fade 1s linear infinite',
                animationDelay: `${(i / bars.length) * 1}s`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes spin-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
};

const DetailFormation = () => {
  const { id: slugOrId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // On récupère en priorité l'id passé via l'état de navigation de React Router
  const [formationId, setFormationId] = useState<string | number | undefined>(location.state?.id);
  const [formation, setFormation] = useState<Data>();
  const [loading, setLoading] = useState(true);
  const [statutInscription, setStatutInscription] = useState<StatutInscription>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    numero_paiement: '',
    reference_transaction: '',
    methode: 'Mvola',
  });

  // Étape 1 : Si on n'a pas reçu l'ID dans le "state" (ex: rafraîchissement ou lien direct), 
  // et que le paramètre d'URL n'est pas un nombre pur, on cherche la formation par son slug.
  useEffect(() => {
    if (!formationId && slugOrId) {
      if (!isNaN(Number(slugOrId))) {
        setFormationId(slugOrId);
      } else {
        // Recherche de la formation à l'aide de son slug textuel
        fetch(`${API_URL}/formations/by-slug/${slugOrId}`)
          .then(res => res.json())
          .then(data => {
            if (data?.id) {
              setFormationId(data.id);
            } else {
              setLoading(false);
            }
          })
          .catch(err => {
            console.error('Erreur récupération slug:', err);
            setLoading(false);
          });
      }
    }
  }, [slugOrId, formationId]);

  // Étape 2 : Chargement des données complètes de la formation et du statut d'inscription dès que l'ID est connu
  useEffect(() => {
    if (!formationId) return;

    setLoading(true);
    fetch(`${API_URL}/formations/${formationId}`)
      .then(res => res.json())
      .then(data => {
        setFormation(data);
        setLoading(false);
        const token = localStorage.getItem('token');
        if (token) {
          fetch(`${API_URL}/inscriptions/statut/${formationId}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          })
            .then(res => res.json())
            .then(statusData => setStatutInscription(statusData.statut_inscription))
            .catch(err => console.error('Erreur statut:', err));
        }
      })
      .catch(err => { 
        console.error('Erreur formation:', err); 
        setLoading(false); 
      });
  }, [formationId]);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const handleInscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/inscrire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ formation_id: formationId, ...paymentData }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowModal(false);
        setShowSuccessAlert(true);
      } else {
        alert("Erreur : " + (data.message || JSON.stringify(data.errors)));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInscriptionGratuite = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/inscrire-gratuit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          formation_id: formationId,
          numero_paiement: 'GRATUIT',
          reference_transaction: `GRATUIT-${formationId}-${Date.now()}`,
          methode: 'Gratuit',
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatutInscription('confirme');
        setShowSuccessAlert(true);
      } else {
        alert("Erreur : " + (data.message || JSON.stringify(data.errors)));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <LoadingSpinner />
  );
  if (!formation) return (
    <div className="flex justify-center items-center h-screen text-slate-500 font-medium">Formation non trouvée.</div>
  );

  const youtubeId = getYoutubeId(formation.url_youtube);
  const hasLocalVideo = formation.video && formation.video.trim() !== "";

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] font-sans">
      <Sidebar />

      {showSuccessAlert && (
        <SuccessAlert
          onClose={() => setShowSuccessAlert(false)}
          onContinue={() => { setShowSuccessAlert(false); navigate('/dash'); }}
        />
      )}

      <main className="flex-1 lg:ml-64 2xl:ml-64 p-4 sm:p-6 md:p-8 min-w-0">

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#5a4fcf] mb-5 font-semibold transition-all pt-14 lg:pt-0 text-sm"
        >
          <FaArrowLeft size={13} /> Voir la liste des formations
        </button>

        <style>{RICH_CONTENT_STYLES}</style>

        {/* Layout principal */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">

          {/* Colonne gauche */}
          <div className="flex-1 min-w-0 space-y-5">
            <FormationHero formation={formation} hasLocalVideo={hasLocalVideo} youtubeId={youtubeId} />
            <ContentTabs
              formation={formation}
            />
          </div>

          {/* Colonne droite */}
          <EnrollSidebar
            formation={formation}
            statut={statutInscription}
            submitting={submitting}
            onInscriptionGratuite={handleInscriptionGratuite}
            onOpenModal={() => setShowModal(true)}
          />
        </div>

        {/* Modal paiement */}
        {showModal && formation.type !== 'Gratuite' && (
          <PaymentModal
            formation={formation}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            submitting={submitting}
            onSubmit={handleInscriptionSubmit}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default DetailFormation;