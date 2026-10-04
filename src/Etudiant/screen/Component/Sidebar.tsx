import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logonirtutowhite.png';
import { 
  LayoutDashboard, 
  GraduationCap, 
  MessageSquare, 
  Award, 
  FileText, 
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import Profil from '../page/Profil/Profile';
import { useState, useEffect } from 'react';
import { API_URL } from './../../../lib/api';

/* ─────────────────────────────────────────
   Composant : Alerte de blocage (style card)
───────────────────────────────────────── */
const BlockAlert = ({ onClose }: { onClose: () => void }) => (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="relative bg-white rounded-[2rem] shadow-2xl flex flex-col items-center px-8 py-10 mx-4"
        style={{ width: '100%', maxWidth: 320, animation: 'blockAlertIn 0.3s cubic-bezier(.34,1.56,.64,1) both' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {/* Icône rouge */}
        <div
          className="flex items-center justify-center rounded-full mb-6"
          style={{
            width: 72,
            height: 72,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #e53e3e 100%)',
            boxShadow: '0 8px 24px rgba(229,62,62,0.35)',
          }}
        >
          <AlertCircle size={36} color="white" strokeWidth={2.5} />
        </div>

        {/* Titre */}
        <h2 className="text-[#1a1a2e] text-xl font-bold mb-2 text-center" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
          Accès refusé
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm text-center leading-relaxed mb-8">
          Vous devez être inscrit à une formation pour accéder à cette rubrique.
        </p>
      </div>
    </div>

    {/* Keyframe injecté une seule fois */}
    <style>{`
      @keyframes blockAlertIn {
        from { opacity: 0; transform: scale(0.85) translateY(16px); }
        to   { opacity: 1; transform: scale(1)    translateY(0); }
      }
    `}</style>
  </>
);

/* ─────────────────────────────────────────
   Composant principal : Sidebar
───────────────────────────────────────── */
const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasTraining, setHasTraining] = useState(false);
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  // --- AJOUT : compteur de messages non lus ---
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/check-training`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        setHasTraining(data.has_training);
      } catch (error) {
        console.error("Erreur vérification formation", error);
      }
    };
    checkAccess();
  }, []);

  // --- AJOUT : récupération du nombre de notifications non lues ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${API_URL}/notifications/unread`, {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        });
        if (!response.ok) return;
        const data = await response.json();
        // contacts_count = nombre de personnes ayant envoyé au moins 1 message non lu
        // (et non le nombre total de messages non lus)
        setUnreadMessagesCount(data.contacts_count ?? 0);
      } catch (error) {
        console.error("Erreur notifications non lues", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard',      label: 'Mes cours',      icon: <LayoutDashboard size={20}/>, path: '/dash',          requireTraining: false },
    { id: 'formations',     label: 'Formations',     icon: <GraduationCap size={20}/>,   path: '/formations',    requireTraining: false },
    { id: 'messages',       label: 'Messages',       icon: <MessageSquare size={20}/>,   path: '/message',       requireTraining: true },
    { id: 'certifications', label: 'Certifications', icon: <Award size={20}/>,           path: '/certification', requireTraining: true },
    { id: 'factures',       label: 'Factures',       icon: <FileText size={20}/>,        path: '/facture',       requireTraining: true },
    { id: 'guides',         label: 'Guides',         icon: <BookOpen size={20}/>,        path: '/guides',        requireTraining: false },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item: any) => {
    if (item.requireTraining && !hasTraining) {
      setShowBlockAlert(true); // ← modal au lieu de alert()
      return;
    }
    navigate(item.path);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Erreur logout", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const SidebarContent = () => (
    <aside className="w-64 h-full rounded-r-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 flex flex-col">

      {/* Logo + bouton fermeture mobile */}
      <div className="flex items-center justify-between mb-10">
        <img src={logo} alt="Logo" style={{ width: 140, marginLeft: 20 }} />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 pl-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked = item.requireTraining && !hasTraining;
          // --- AJOUT : badge uniquement sur l'item "messages" ---
          const showBadge = item.id === 'messages' && unreadMessagesCount > 0;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`
                flex items-center gap-4 py-3.5 px-6 transition-all duration-200 group
                ${isActive
                  ? 'bg-[#F0F4F8] text-[#1E264F] hover:bg-white rounded-2xl'
                  : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5 rounded-2xl'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span className={`relative ${isActive ? 'text-blue-600' : 'group-hover:scale-110 transition-transform'}`}>
                {item.icon}
                {/* --- AJOUT : pastille badge sur l'icône --- */}
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}

        {/* Bas de sidebar : Profil + Déconnexion */}
        <div className="mt-auto pt-4 border-t border-white/20 space-y-2">

          {/* Profil */}
          <div className="relative">
            {isModalOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-60 bg-white/90 backdrop-blur-md rounded-[32px] shadow-xl border border-white/20 z-50">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 z-[999] right-2 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                  <span className="text-2xl font-medium leading-none">&times;</span>
                </button>
                <Profil />
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <User className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Profil</span>
            </button>
          </div>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </nav>
    </aside>
  );

  return (
    <>
      {/* Modal de blocage */}
      {showBlockAlert && <BlockAlert onClose={() => setShowBlockAlert(false)} />}

      {/* Bouton burger — mobile */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-indigo-500 text-white rounded-xl shadow-lg hover:bg-indigo-600 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu size={22} />
      </button>

      {/* DESKTOP : sidebar fixe */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-40">
        <SidebarContent />
      </div>

      {/* MOBILE : overlay + sidebar en drawer */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;