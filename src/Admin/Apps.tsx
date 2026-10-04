import { useState, useEffect } from 'react';
import Sidebar from './composants/sidebar/Sidebar';
import NavbarAdm from './composants/page/navbar/NavbarAdm';
import DashboardHome from './composants/page/dashboardAdmin/DashboardAdm'; 
import FrontOffice from './composants/page/frontOffice/menufrontoffice/FrontOffice'; 
import Formations from './composants/page/formation/FormationAdm'; 
import GestionEtud from './composants/page/gestionEtudiant/GestionEtud'; 
import Progression from './composants/page/progression/Progression';
import Recrutement from './composants/page/recrutement/Recrutement';
import Cours from './composants/page/cours/Cours';
import type { MenuType } from './types';
import Message from './composants/page/message/Message';
import { API_URL } from './lib/api'; // Vérifie bien le chemin de ton API_URL ici

function Apps() {
  const [activeMenu, setActiveMenu] = useState<MenuType>(
    localStorage.getItem('adminRole') === 'formateur' ? 'Cours' : 'Dashboard'
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);

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
    // Rafraîchit toutes les 15 secondes
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardHome />; 
      case 'Front office':
        return <FrontOffice />;
      case 'Formations':
        return <Formations />;
      case 'Gestion etudiant': 
        return <GestionEtud />;
      case 'Message':
        return <Message />;
      case 'Progression': 
        return <Progression />;
      case 'Recrutement': 
        return <Recrutement />;
      case 'Cours': 
        return <Cours />;

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
      {/* On passe le compteur à la Sidebar ici */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        unreadCount={unreadCount} 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <NavbarAdm currentMenu={activeMenu} />
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
           {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Apps;