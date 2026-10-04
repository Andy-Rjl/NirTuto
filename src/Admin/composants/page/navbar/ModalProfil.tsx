import { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { API_URL } from '../../../lib/api';
import { useNavigate } from 'react-router-dom';

const ModalProfil = ({ onClose, onEdit }: { onClose: () => void, onEdit: () => void, onSettings: () => void }) => {
  const [nom, setNom] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchAdminData = async () => {
      try { const response = await fetch(`${API_URL}/user`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); const data = await response.json(); setNom(data.nom); setPhotoUrl(data.photo); } catch (error) { console.error(error); }
    }; fetchAdminData();
  }, []);

  const navigate = useNavigate();
  const handleLogout = async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (token) {
          await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        console.error("Erreur logout", error);
      } finally {
      
        localStorage.removeItem("token");
  
        navigate("/admin/login");
      }
    };

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center md:justify-end md:pr-6 md:pt-20 bg-black/5 backdrop-blur-[1px] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-60 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 bg-[#1A234E] dark:bg-slate-800 text-white flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/10 overflow-hidden"><img src={photoUrl ? `${API_URL.replace("/api","")}/${photoUrl}` : `https://ui-avatars.com/api/?name=${nom}`} alt="Profil" className="w-full h-full object-cover" /></div>
          <p className="text-sm font-black">{nom || "Admin"}</p>
        </div>
        <div className="p-2">
          <button onClick={onEdit} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"><User size={16} /> Modifier profil</button>
          <div className="h-px bg-gray-100 dark:bg-slate-700 my-2 mx-2" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-xs font-black text-red-500 transition-colors"><LogOut size={16} /> Déconnexion</button>
        </div>
      </div>
    </div>
  );
};

export default ModalProfil;