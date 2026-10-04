import { useEffect, useState } from "react";
import { User, ShieldCheck, Sun, Moon } from "lucide-react";
import { getMe } from "../../service/Auth";
import EtudProfileEditModal from "./ModificationProfil/ModificationProfil";
import { API_URL } from "../../../../lib/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // État mode sombre
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Vérification initiale du thème 
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    getMe()
      .then(data => setUser(data))
      .catch((err) => console.error("Erreur Auth:", err));
  }, []);

  // Fonction basculer le thème
const toggleDarkMode = () => {
 
  const isCurrentlyDark = document.documentElement.classList.contains("dark");

  if (isCurrentlyDark) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setIsDarkMode(false);
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setIsDarkMode(true);
  }
};

  if (!user) return (
    <div className="flex items-center justify-center p-8">
      <p className="text-xs text-slate-400 animate-pulse font-black uppercase tracking-widest">
        Chargement...
      </p>
    </div>
  );

  const matricule = user.id < 10 ? `TM-00000${user.id}` : `TM-0000${user.id}`;
  const photoUrl = user.photo;

  return (
    <div className="bg-white dark:bg-slate-900 w-full max-w-64 rounded-[32px] shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-300 overflow-hidden">
      
      {/* SECTION HEADER */}
      <div className="p-6 bg-[#1A234E] dark:bg-slate-800 text-white flex flex-col items-center gap-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative group">
          <div className="w-16 h-16 rounded-full border-[3px] border-white/20 shadow-xl flex items-center justify-center bg-white/10 overflow-hidden transition-transform duration-500 group-hover:scale-105">
            <img 
              src={photoUrl ? `${API_URL.replace("/api","")}/${photoUrl}` : `https://ui-avatars.com/api/?name=${user.nom}&background=random`} 
              alt="Profil" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.nom}`; }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#1A234E] dark:border-slate-800" title="En ligne" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-sm font-black italic tracking-tight">{user.nom || "Étudiant"}</h2>
          <div className="flex items-center justify-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
            <ShieldCheck size={10} className="text-indigo-300" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-100">
              {matricule}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION INFOS */}
      <div className="p-4 space-y-3">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-2" />

        {/* SECTION ACTIONS */}
        <div className="space-y-1">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full flex items-center justify-between p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-[18px] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <User size={16} className="text-slate-400 group-hover:text-indigo-500" />
              <span>Modifier profil</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-400" />
          </button>

          {/* TOGGLE DARK MODE */}
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[18px] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all group active:scale-95"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Sun size={16} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              ) : (
                <Moon size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-transform" />
              )}
              <span>{isDarkMode ? "Mode Clair" : "Mode Sombre"}</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Rendu du Modal de modification */}
      {isModalOpen && (
        <EtudProfileEditModal
          user={user}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}