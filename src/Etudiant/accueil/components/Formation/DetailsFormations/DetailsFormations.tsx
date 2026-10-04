import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Ajout de useLocation
import { API_URL } from "./../../../../../lib/api";
import Footer from "../../../components/Footer";
import EnrollModal from "./EnrollModal";
import { HeroSection } from "./HeroSection";
import { AvisSection } from "./ContentSections";
// import { EnrollSidebar } from "./EnrollSidebar";
import { SuggestionsSection } from "./SuggestionsSection";
import type { Formation, Evaluation } from "./types";
import NavbarAcc from "../../NavbarAcc";

const FormationDetails = () => {
  const { id: slugOrId } = useParams(); // Récupère le paramètre de l'URL
  const navigate = useNavigate();
  const location = useLocation(); // Permet d'accéder au state masqué

  const [formation, setFormation] = useState<Formation | null>(null);
  const [suggestions, setSuggestions] = useState<Formation[]>([]);
  const [showEnroll, setShowEnroll] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [moyenne, setMoyenne] = useState<number | null>(null);
  const [totalEvaluations, setTotalEvaluations] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setFormation(null);

    // ── STRATÉGIE DE RÉCUPÉRATION DE L'ID ──
    // 1. On regarde en priorité le state masqué transmis par le catalogue
    let targetId = location.state?.id;

    // 2. Sécurité Refresh (Optionnel mais recommandé) : 
    if (!targetId && slugOrId) {
      const match = slugOrId.match(/^(\d+)-/);
      if (match) {
        targetId = match[1];
      } else {
        // Si ton API supporte la recherche brute par texte/slug, utilise directement slugOrId
        targetId = slugOrId; 
      }
    }

    if (!targetId) {
      setLoading(false);
      return;
    }

    // 1. Charger la formation avec l'identifiant résolu
    fetch(`${API_URL}/formations/${targetId}`)
      .then(res => res.json())
      .then(data => {
        setFormation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement formation:", err);
        setLoading(false);
      });

    // 2. Charger les évaluations
    fetch(`${API_URL}/evaluations/${targetId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Données reçues de Laravel :", data);
        setEvaluations(data.evaluations || []);
        setMoyenne(data.moyenne);
        setTotalEvaluations(data.total || 0);
      })
      .catch((err) => {
        console.error("Erreur de liaison avec l'API Évaluations :", err);
      });

    // 3. Charger les suggestions
    fetch(`${API_URL}/formations?per_page=5`)
      .then(res => res.json())
      .then(res => setSuggestions(res.data || []))
      .catch(() => {});
  }, [slugOrId, location.state]); // Écoute les changements de l'URL ou du state

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

  if (loading) return <LoadingSpinner />;
  if (!formation) return <div className="min-h-screen flex items-center justify-center text-gray-500">Formation non trouvée ou lien expiré.</div>;

  return (
    <div className="min-h-screen w-full bg-white font-sans selection:bg-[#00A99D] selection:text-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .rich-content ol {
          list-style: none;
          counter-reset: item;
          padding-left: 0;
          margin: 0;
        }

        .rich-content ol li {
          counter-increment: item;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 16px;
          padding: 10px 16px;
          border: 1.5px solid rgba(128, 128, 128, 0.5);
          border-radius: 20px;
          background: white;
          position: relative;
        }

        .rich-content ol li::before {
          content: counter(item);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          background: gray;
          opacity: 0.5;
          color: white;
          font-weight: 800;
          font-size: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .rich-content ul {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }

        .rich-content ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 12px;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #a5b4fc;
          border-radius: 10px;
          background: #fafafa;
        }

        .rich-content ul li::before {
          content: "•";
          color: #00A99D;
          font-size: 18px;
          font-weight: 900;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .rich-content p {
          margin-top: 10px;
          color: #6b7280;
          font-size: 13px;
          line-height: 1.7;
        }
      `}</style>

      <NavbarAcc />

      {/* Hero Section */}
      <HeroSection
        formation={formation}
        moyenne={moyenne}
        totalEvaluations={totalEvaluations}
        onBack={() => navigate(-1)}
        onEnroll={() => setShowEnroll(true)}
      />

      {/* Contenu Principal Bas */}
      <section className="py-20 w-full mx-auto px-6">
        <div className="gap-16">
          <div className="lg:col-span-2 space-y-12">
            <AvisSection evaluations={evaluations} totalEvaluations={totalEvaluations} />
          </div>
        </div>

        {showEnroll && (
          <EnrollModal
            formation={{ id: formation.id, titre: formation.titre, frais: formation.frais, type: formation.type }}
            onClose={() => setShowEnroll(false)}
          />
        )}
      </section>

      {/* Suggestions */}
      <SuggestionsSection
        suggestions={suggestions}
        onSelect={(item: any) => {
          // Fonction intégrée pour générer un slug propre à partir du titre
          const formationSlug = item.slug || (item.titre ? item.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-') : item.id);
          
          // On navigue avec le texte lisible et on passe l'ID caché dans le state
          navigate(`/formation/${formationSlug}`, { state: { id: item.id } });
        }}
      />

      <Footer />
    </div>
  );
};

export default FormationDetails;