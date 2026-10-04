import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBookOpen, 
  FaSyncAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaRegFileAlt,
  FaRegClock,
} from "react-icons/fa";

import { API_URL } from './../../../lib/api';

interface Etudiant {
  id: number;
  nom: string;
  formation: string;
  nb: number;
}

interface FormationStats {
  nom: string;
  progression: string;
  nbEtudiants: number;
}

const ACCENT_LIGHT = "#E1F5EE";
const ACCENT_DARK = "#085041";

const statCards = [
  { bg: "#EEF2FF", icon: <FaUserGraduate />, color: "#6366F1", label: "Étudiants" },
  { bg: "#FFF7ED", icon: <FaChalkboardTeacher />, color: "#F97316", label: "Formateurs" },
  { bg: "#F0FFF4", icon: <FaGraduationCap />,    color: "#22C55E", label: "Formations" },
  { bg: "#EFF6FF", icon: <FaBookOpen />,          color: "#3B82F6", label: "Progression" },
];

const courseColors = [
  { bar: "#6366F1", bg: "#EEF2FF", text: "#4338CA" },
  { bar: "#F97316", bg: "#FFF7ED", text: "#C2410C" },
  { bar: "#22C55E", bg: "#F0FFF4", text: "#15803D" },
  { bar: "#3B82F6", bg: "#EFF6FF", text: "#1D4ED8" },
  { bar: "#EC4899", bg: "#FDF2F8", text: "#BE185D" },
];

const Progression = () => {
  const [count, setCount] = useState({ etudiant: 0, formateur: 0, formation: 0 });
  const [formationsStats, setFormationsStats] = useState<FormationStats[]>([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`${API_URL}/stats/etudiants-count`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setCount({
          etudiant: data.total || 0,
          formateur: data.total_formateur || 0,
          formation: data.total_formation || 0
        });
      } catch (error) { console.error("Erreur stats:", error); }
    };
    fetchCount();
  }, []);

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
          const listeEtudiants = result.data || [];
          const groupes = listeEtudiants.reduce((acc: any, curr: Etudiant) => {
            const nomF = curr.formation || "Inconnue";
            acc[nomF] = (acc[nomF] || 0) + 1;
            return acc;
          }, {});
          const stats = Object.keys(groupes).map(nom => ({
            nom: nom,
            nbEtudiants: groupes[nom],
            progression: ((groupes[nom] / (count.etudiant || 1)) * 100).toFixed(0)
          }));
          setFormationsStats(stats);
        }
      } catch (error) { console.error("Erreur étudiants:", error); }
    };
    fetchEtudiants();
  }, [count.etudiant]);

  const totalProgressionMoyenne = useMemo(() => {
    if (formationsStats.length === 0) return 0;
    const somme = formationsStats.reduce((acc, f) => acc + Number(f.progression), 0);
    const moyenne = ((somme * 100) / (formationsStats.length * 100));
    return Number(moyenne.toFixed(2));
  }, []);

  const statValues = [
    count.etudiant,
    count.formateur,
    count.formation,
    `${totalProgressionMoyenne}%`
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <main>
      
        <div style={{ padding: "32px" }}>

          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>Vue d'ensemble des cours</h1>
            <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>Prête à suivre l'évolution de vos formations aujourd'hui ?</p>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
            {statCards.map((card, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "20px 22px",
                display: "flex", flexDirection: "column", gap: 14, cursor: "pointer",
                transition: "box-shadow 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 42, height: 42, background: card.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, fontSize: 18 }}>
                    {card.icon}
                  </div>
                  
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{statValues[i]}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6 }}>{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION HEADER  */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Formations inscrites ({formationsStats.length})
              </h2>
            </div>
          </div>

          {/* ── COURSE CARDS GRID ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            <AnimatePresence mode="wait">
              {formationsStats.map((f, idx) => {
                const palette = courseColors[idx % courseColors.length];
                const pct = Number(f.progression);
                const circumference = 2 * Math.PI * 28;
                const offset = circumference - (circumference * pct) / 100;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 18,
                      padding: "20px", display: "flex", flexDirection: "column", gap: 16,
                      cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderColor: palette.bar }}
                  >
                    {/* Card top */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      {/* SVG circle progress */}
                      <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                        <svg width={64} height={64} style={{ transform: "rotate(-90deg)" }}>
                          <circle cx={32} cy={32} r={28} stroke="#F1F5F9" strokeWidth={5} fill="none" />
                          <circle cx={32} cy={32} r={28} stroke={palette.bar} strokeWidth={5} fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.7s ease" }}
                          />
                        </svg>
                        <span style={{
                          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 800, color: "#0F172A"
                        }}>{f.progression}%</span>
                      </div>

                      {/* Name + info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                            background: palette.bg, color: palette.text, padding: "3px 8px", borderRadius: 20
                          }}>Formation</span>
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {f.nom}
                        </h3>
                        <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0", fontWeight: 500 }}>Formation chez Tuto Info</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div style={{ height: 5, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.progression}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ height: "100%", background: palette.bar, borderRadius: 99 }}
                        />
                      </div>
                    </div>

                    {/* Meta + action  */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                          <FaRegFileAlt size={10} /> {f.nbEtudiants} inscrits
                        </span>
                        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                          <FaRegClock size={10} /> Récent
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ background: ACCENT_LIGHT, color: ACCENT_DARK, padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Actif
                        </span>
                        
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Load more */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}>
            <button style={{
              background: "none", border: "none", color: "#94A3B8", fontSize: 12, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <FaSyncAlt size={11} style={{ transform: "rotate(90deg)" }} />
              Charger plus d'éléments
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Progression;