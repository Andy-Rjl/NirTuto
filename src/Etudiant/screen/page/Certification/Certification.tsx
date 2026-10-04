import { useEffect, useState, type ReactNode } from 'react';
import Sidebar from './../../Component/Sidebar';
import GraduationCapImg from './../../../assets/images/open.jpg';
import { API_URL } from '../../../../lib/api';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Importation des sous-composants divisés
import { StatCards } from './StatCards';
import { CertificatForm } from './CertificatForm';
import { CertificatCard } from './CertificatCard';
import { CertificatView } from './CertificatView';
import { SuccessAlert } from '../Profil/ModificationProfil/SuccessAlert';
import { useNavigate } from 'react-router-dom';

interface Certificat {
  date_de_delivrance: ReactNode;
  date_Naissance: ReactNode;
  lieu_Naissance: ReactNode;
  formation: ReactNode;
  prenom: ReactNode;
  nom: ReactNode;
  id: string;
  titre: string;
  date: string;
  score: number;
  formateur: string;
  code: string;
  statut?: string;
}

const Certification = () => {
  const navigate = useNavigate();
  const [viewDetail, setViewDetail] = useState<boolean>(false);
  const [selectedCert, setSelectedCert] = useState<Certificat | null>(null);
  const [certificats, setCertificats] = useState<any[]>([]);
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [progressions, setProgressions] = useState<Record<number, number>>({});
  const [qcmScores, setQcmScores] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_Naissance: '',
    lieu_Naissance: '',
    formation: ''
  });

  const openCertificate = (cert: Certificat) => {
    setSelectedCert(cert);
    setViewDetail(true);
  };

const handleDownload = async () => {
  const element = document.getElementById('certificat-a-imprimer');
  if (!element || !selectedCert) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 3,              // meilleure résolution (x3)
      useCORS: true,          // permet de charger les images locales/externes
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // Format A4 paysage (le certificat a un ratio 1.414/1, proche du A4 landscape)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();   // 297mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm

    // On calcule la taille de l'image pour qu'elle remplisse la page
    // en respectant le ratio du canvas
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;

    // Si l'image est plus haute que la page, on ajuste par la hauteur à la place
    if (imgHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    const xOffset = (pageWidth - finalWidth) / 2;
    const yOffset = (pageHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
    pdf.save(`Certificat_${selectedCert.nom}_${selectedCert.formation}.pdf`);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
  }
};

  useEffect(() => {
    const fetchCertificats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/certificats/mes-certificats`, {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
        });
        const data = await res.json();
        setCertificats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur:", error);
        setCertificats([]);
      }
    };
    fetchCertificats();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };
        const res = await fetch(`${API_URL}/etudiant/mes-formations`, { headers });
        const dataMes = await res.json();
        const liste = Array.isArray(dataMes) ? dataMes : (dataMes.data || []);
        setInscriptions(liste);
        if (liste.length > 0 && formData.formation === '') {
          setFormData(prev => ({ ...prev, formation: liste[0].titre }));
        }
        const progResults: Record<number, number> = {};
        await Promise.all(
          liste.map(async (item: any) => {
            try {
              const resProg = await fetch(`${API_URL}/etudiant/formation/${item.id}/progression`, {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
              });
              if (resProg.ok) {
                const progData = await resProg.json();
                progResults[item.id] = progData.percent ?? 0;
              } else {
                progResults[item.id] = 0;
              }
            } catch {
              progResults[item.id] = 0;
            }
          })
        );
        setProgressions(progResults);
        try {
          const resQcm = await fetch(`${API_URL}/etudiant/quiz/scores`, {
            headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
          });
          if (resQcm.ok) {
            const qcmData = await resQcm.json();
            setQcmScores(Array.isArray(qcmData) ? qcmData : []);
          }
        } catch {
          setQcmScores([]);
        }
      } catch (error) {
        console.error("Erreur Fetch:", error);
      }
    };
    fetchData();
  }, [inscriptions.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/certificats/demande`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  const formationSelectionnee = inscriptions.find(i => i.titre === formData.formation);
  const progressionFormation = formationSelectionnee ? (progressions[formationSelectionnee.id] ?? null) : null;

  const scoresFormation = formationSelectionnee
    ? qcmScores.filter(s => String(s.formation_id) === String(formationSelectionnee.id))
    : [];

  const moyenneQcm = scoresFormation.length > 0
    ? Math.round(
        scoresFormation.reduce((acc, s) => {
          const score = Number(s.score) || 0;
          const total = Number(s.total_questions) || 0;
          return acc + (total > 0 ? (score / total) * 100 : 0);
        }, 0) / scoresFormation.length
      )
    : null;

  const aPasseQcm = scoresFormation.length > 0;
  const aMoyenneSuffisante = moyenneQcm !== null && moyenneQcm >= 50;

  // 1. Vérification si la formation sélectionnée est déjà présente dans les certificats validés
  const dejaValidee = certificats.some(
    (cert) => String(cert.formation).trim().toLowerCase() === String(formData.formation).trim().toLowerCase()
  );

  // 2. Le bouton devient inactif si la formation est déjà validée
  const peutDemanderCertif = progressionFormation === 100 && aPasseQcm && aMoyenneSuffisante && !dejaValidee;

  const messageBlockage = (() => {
    if (dejaValidee) return "Formation déjà validée"; // Message prioritaire si validé
    if (progressionFormation !== 100) return `Formation incomplète (${progressionFormation ?? 0}%)`;
    if (!aPasseQcm) return "Aucun QCM passé pour cette formation";
    if (!aMoyenneSuffisante) return `Moyenne QCM insuffisante (${moyenneQcm}% / 50% requis)`;
    return null;
  })();

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 p-4 sm:p-6 md:p-8 pt-16 lg:pt-6">

        {/* ── BANNER ── */}
        {!viewDetail && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-200 p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200"
            >
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">🏆 Tableau de réussite</p>
                <h2 className="text-xl font-bold text-slate-800">Félicitations !</h2>
                <p className="text-slate-400 text-sm">
                  Tu as déjà validé <span className="text-slate-700 font-bold">{certificats.length} certification{certificats.length > 1 ? 's' : ''}</span>
                </p>
              </div>
              <div className="w-16 h-16 overflow-hidden border border-slate-100 flex-shrink-0">
                <img src={GraduationCapImg} alt="Diplôme" className="w-full h-full object-cover" />
              </div>
            </motion.section>

            {/* ── STATS CARDS ── */}
            <StatCards 
              inscriptionsLength={inscriptions.length} 
              qcmScoresLength={qcmScores.length} 
              certificatsLength={certificats.length} 
            />
          </>
        )}

        {/* ── MAIN LAYOUT ── */}
        {!viewDetail ? (
          <div className="bg-white border border-slate-200 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] shadow-2xs">
            {showSuccessAlert && (
              <SuccessAlert
                title="Demande de certification envoyer !"
                onClose={() => setShowSuccessAlert(false)}
                onContinue={() => { setShowSuccessAlert(false); navigate('/dash'); }}
              />
            )}
            {/* ── PARTIE GAUCHE (Formulaire) ── */}
            {/* 3. Injection de la prop dejaValidee ici */}
            <CertificatForm 
              formData={formData}
              setFormData={setFormData}
              inscriptions={inscriptions}
              progressions={progressions}
              formationSelectionnee={formationSelectionnee}
              progressionFormation={progressionFormation}
              aPasseQcm={aPasseQcm}
              moyenneQcm={moyenneQcm}
              aMoyenneSuffisante={aMoyenneSuffisante}
              peutDemanderCertif={peutDemanderCertif}
              messageBlockage={messageBlockage}
              handleSubmit={handleSubmit}
              dejaValidee={dejaValidee} 
            />

            {/* ── PARTIE DROITE (Liste & Résumé) ── */}
            <div className="bg-slate-50/60 p-6 sm:p-8 md:p-10 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">VOTRE CERTIFICAT</h4>
                
                <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                  {certificats.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      Aucun certificat disponible.
                    </div>
                  ) : (
                    certificats.map((cert) => (
                      <CertificatCard 
                        key={cert.id} 
                        cert={cert} 
                        onOpen={openCertificate} 
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6 space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Nombre de formation</span>
                  <span className="font-medium text-slate-800">{inscriptions.length} formations</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span>Défi du qcm</span>
                  <span className="font-medium text-slate-800">{qcmScores.length} QCM validés</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-800 pt-1">
                  <span>Certifié</span>
                  <span className="text-emerald-500">{certificats.length} Certifs</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ── VUE DÉTAIL CERTIFICAT ── */
          selectedCert && (
            <CertificatView 
              selectedCert={selectedCert} 
              setViewDetail={setViewDetail} 
              handleDownload={handleDownload} 
            />
          )
        )}
      </div>
    </div>
  );
};

export default Certification;