import { useEffect, useState } from 'react';
import {
  Users, BookOpen, GraduationCap, DollarSign,
} from 'lucide-react';
import { API_URL } from '../../../lib/api';
import type { Etudiant, FormationStats, FinanceData } from './DashboardAdm/types';
import BackgroundBlobs from './DashboardAdm/BackgroundDeco';
import DashboardHeader from './DashboardAdm/DashboardHeader';
import StatsOverview from './DashboardAdm/StatsOverview';
import MonthlyGoal from './DashboardAdm/MonthlyGoal';
import CourseUsageDonut from './DashboardAdm/CourseUsageDonut';
import RevenueChart from './DashboardAdm/RevenueChart';
import FormationsList from './DashboardAdm/FormationsList';

const DashboardHome = () => {
  const [count, setCount] = useState({ etudiant: 0, formateur: 0, formation: 0, certificat: 0 });
  const [, setEtudiants] = useState<Etudiant[]>([]);
  const [formationsStats, setFormationsStats] = useState<FormationStats[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [financeData, setFinanceData] = useState<FinanceData>({ revenu_total: 0, graphique: [] });
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  const handlePrevMonth = (e: React.MouseEvent) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); };
  const handleNextMonth = (e: React.MouseEvent) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); };
  const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(viewDate);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 6) % 7;

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats-financieres`, { headers: { "Accept": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        if (res.ok) setFinanceData(data);
      } catch (e) { console.error(e); }
    };
    fetchFinance();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_URL}/stats/etudiants-count`, { headers: { "Accept": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` } });
        const data = await res.json();
        setCount({ etudiant: data.total || 0, formateur: data.total_formateur || 0, formation: data.total_formation || 0, certificat: data.total_certificat || 0 });
      } catch (e) { console.error(e); }
    };
    fetchCount();
  }, []);

useEffect(() => {
  const fetchEtudiants = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/etudiants-inscrits`, { 
        headers: { 
          'Accept': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
      });
      const result = await res.json();
      
      if (res.ok) {
        const listeEtudiants = result.data || [];
        setEtudiants(listeEtudiants);
        
        // 1. On compte les étudiants par formation
        const groupes = listeEtudiants.reduce((acc: any, curr: Etudiant) => { 
          const nomF = curr.formation || "Inconnue"; 
          acc[nomF] = (acc[nomF] || 0) + 1; 
          return acc; 
        }, {});
        
        const nomsFormationsUnique = Object.keys(groupes);
        
        // 2. On récupère le nombre TOTAL d'étudiants (ex: 2)
        const totalEtudiantsGlobal = listeEtudiants.length || 1; 
        
        // 3. On calcule le pourcentage par rapport au total d'étudiants
        setFormationsStats(nomsFormationsUnique.map(nom => ({ 
          nom, 
          nbEtudiants: groupes[nom], 
          // Calcul : (2 étudiants dans ce cours / 2 étudiants au total) * 100 = 100%
          progression: ((groupes[nom] / totalEtudiantsGlobal) * 100).toFixed(0) 
        })));
      }
    } catch (e) { 
      console.error(e); 
    }
  };
  fetchEtudiants();
}, []);

  const objectif = 150;
  const maxVal = Math.max(...financeData.graphique.map(m => m.revenu), 1000000);

  const overviewStats = [
    { label: "Revenus Totaux",   value: financeData.revenu_total.toLocaleString(), unit: "Ar", icon: DollarSign,   accent: '#10b981', soft: '#ecfdf5', trend: '+12%', grad: 'linear-gradient(135deg,#10b981,#059669)' },
    { label: "Étudiants",        value: count.etudiant,   unit: "",  icon: Users,         accent: '#6366f1', soft: '#eef2ff', trend: '+8%',  grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { label: "Formations",       value: count.formation,  unit: "",  icon: BookOpen,      accent: '#06b6d4', soft: '#ecfeff', trend: '+3',   grad: 'linear-gradient(135deg,#06b6d4,#0284c7)' },
    { label: "Certificats",      value: count.certificat, unit: "",  icon: GraduationCap, accent: '#f59e0b', soft: '#fffbeb', trend: '+21',  grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  ];

  return (
    <div
      className="min-h-screen pt-16 lg:pt-6 p-4 sm:p-6 lg:p-8 space-y-6"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 40%, #f0fdf4 70%, #fff7ed 100%)' }}
    >
      <BackgroundBlobs />

      <div className="relative" style={{ zIndex: 1 }}>

        <DashboardHeader
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          viewDate={viewDate}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          monthName={monthName}
          daysInMonth={daysInMonth}
          firstDayOfMonth={firstDayOfMonth}
          today={today}
        />

        <StatsOverview stats={overviewStats} />

        {/* ── SECTION PRINCIPALE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">

          {/* Colonne gauche */}
          <div className="space-y-4">
            <MonthlyGoal etudiantCount={count.etudiant} objectif={objectif} />
            <CourseUsageDonut
              formationsStatsLength={formationsStats.length}
              formationCount={count.formation}
            />
          </div>

          <RevenueChart graphique={financeData.graphique} maxVal={maxVal} />
        </div>

        <FormationsList formationsStats={formationsStats} />

      </div>
    </div>
  );
};

export default DashboardHome;