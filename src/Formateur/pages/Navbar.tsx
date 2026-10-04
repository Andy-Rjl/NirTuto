import React, { useEffect, useState } from 'react';
import { Mail, Bell, X, User, Settings, Lock, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import logo from './../assets/logonirtuto.png';
import { API_URL } from './../lib/api';

// Imports des sous-composants
import ModalProfil from './ModalProfil';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentMenu: string;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const AlertModal = ({ isOpen, onClose, message }: AlertModalProps) => {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="fixed top-5 right-5 p-6 w-112.5 font-sans z-[200]"
    >
      <div className="bg-white rounded-[20px] px-5 py-6 flex items-center justify-between shadow-xl relative border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 border-2 border-[#2ccba0] rounded-full flex items-center justify-center shrink-0">
            <Check className="text-[#2ccba0]" size={14} strokeWidth={3} />
          </div>
          <span className="text-[#2ccba0] font-semibold text-[15px]">{message}</span>
        </div>
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-[#2ccba0] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#23b58e] transition-colors shadow-lg"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
};

const AdminProfileEditModal = ({ onClose }: { onClose: () => void }) => {
  const [collabPage, setCollabPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setDirection] = useState(0);
  const [, setSelectedCollab] = useState<any | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null); 
  const [photoFile, setPhotoFile] = useState<File | null>(null); 
  const [preview, setPreview] = useState<string | null>(null);   

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const triggerAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(collaborators.length / itemsPerPage) || 1;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setNom(data.nom); setEmail(data.email); setContact(data.contact); setPhotoUrl(data.photo);
        const collabRes = await fetch(`${API_URL}/trainers`, { headers: { 'Authorization': `Bearer ${token}` } });
        const collabData = await collabRes.json();
        setCollaborators(collabData.filter((c: any) => c.id !== data.id));
      } catch (error) { console.error(error); }
    };
    fetchAdminData();
  }, []);

  const handlePageChange = (newDir: number) => {
    if (isAnimating) return;
    setIsAnimating(true); setDirection(newDir);
    setTimeout(() => {
      setCollabPage((prev) => {
        const next = prev + newDir;
        if (next < 0) return totalPages - 1;
        if (next >= totalPages) return 0;
        return next;
      });
      setIsAnimating(false);
    }, 200);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('nom', nom); formData.append('email', email); formData.append('contact', contact);
    if (photoFile) formData.append('photo', photoFile);
    
    const res = await fetch(`${API_URL}/admin/update-profile`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: formData
    });

    if (res.ok) { 
      triggerAlert("Profil mis à jour !"); 
      // Petit délai pour permettre de lire la notification avant l'actualisation
      setTimeout(() => {
        onClose(); 
        window.location.reload(); 
      }, 1500);
    } else {
      triggerAlert("Une erreur est survenue.");
    }
  };

  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  return (
    <div className="fixed inset-0 z-110 flex items-start justify-center md:justify-end md:pr-10 md:pt-20 bg-black/20 backdrop-blur-[2px] p-4" onClick={onClose}>
      {/* Alerte montée en z-index pour s'afficher par-dessus l'overlay */}
      <AlertModal 
        isOpen={showAlert} 
        onClose={() => setShowAlert(false)} 
        message={alertMessage} 
      />

      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl min-h-125 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-300 relative" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#1A234E] dark:bg-slate-800 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2"><User size={16} /><h2 className="text-sm font-black italic">Modifier Profil</h2></div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-8"> 
          <div className="flex flex-col items-center gap-3 min-w-37.5 group"> 
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#FFB800] border-[6px] border-white dark:border-slate-800 shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {preview || photoUrl ? (
                  <img src={preview ? preview : `${API_URL.replace("/api","")}/${photoUrl}`} alt="Profil" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + nom; }} />
                ) : <User size={35} className="text-indigo-400" />}
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[1px]"><span className="text-[8px] font-black uppercase text-white">Changer</span></label>
              </div>
              <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setPhotoFile(file); setPreview(URL.createObjectURL(file)); } }} />
            </div>
            <div className="text-center">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">{nom}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Administrateur</p>
            </div>      
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-2">Nom</label><input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" /></div>
            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-2">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" /></div>
            <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase ml-2">Contact</label><input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" /></div>
            <button onClick={() => setShowPasswordModal(true)} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-between group"><span>MODIFIER LE MOT DE PASSE</span><Lock size={14} /></button>
          </div>

          <div className="flex-1 border-l bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 pl-8 relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3"><h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Collaborateurs</h3><span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">{collabPage + 1} / {totalPages}</span></div>
              <div className="flex gap-1"><button onClick={() => handlePageChange(-1)} className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-indigo-600 transition-all"><ChevronLeft size={18} /></button><button onClick={() => handlePageChange(1)} className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={18} /></button></div>
            </div>
            <div className={`flex flex-wrap gap-5 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              {collaborators.slice(collabPage * itemsPerPage, (collabPage * itemsPerPage) + itemsPerPage).map((collab) => (
                <div key={collab.id} onClick={() => setSelectedCollab(collab)} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden group-hover:scale-110 transition-transform"><img src={collab.photo ? `${API_URL.replace("/api","")}/${collab.photo}` : `https://ui-avatars.com/api/?name=${collab.nom}`} alt={collab.nom} className="w-full h-full object-cover" /></div>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{collab.nom.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex gap-2">
          <button onClick={handleSave} className="flex-1 bg-[#1A234E] dark:bg-indigo-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md">Enregistrer</button>
          <button onClick={onClose} className="px-4 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-200 py-3.5 rounded-2xl text-[10px] font-black uppercase border border-slate-200 dark:border-slate-600">Annuler</button>
        </div>

        {showPasswordModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[28px] shadow-xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
              <div className="flex justify-between items-start"><div className="dark:text-white"><h3 className="text-lg font-semibold">Sécurité</h3><p className="text-[11px] text-slate-500 uppercase">Modifier votre accès</p></div><button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full dark:text-white"><X size={20} /></button></div>
              <div className="space-y-3">
                <input type="password" placeholder="Ancien mdp" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" onChange={(e) => setPasswords({...passwords, old: e.target.value})} />
                <input type="password" placeholder="Nouveau mdp" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                <input type="password" placeholder="Confirmer mdp" className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
              </div>
              <button 
                onClick={async () => { 
                  const res = await fetch(`${API_URL}/admin/update-password`, { 
                    method: 'POST', 
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ old_mdp: passwords.old, new_mdp: passwords.new, confirm_mdp: passwords.confirm }) 
                  }); 
                  if(res.ok) { 
                    triggerAlert("Mot de passe modifié !"); 
                    setShowPasswordModal(false); 
                  } else {
                    triggerAlert("Erreur lors de la modification.");
                  }
                }} 
                className="w-full bg-[#20b461] text-white py-3.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
              > 
                Mettre à jour 
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="fixed inset-0 z-110 flex items-start justify-center md:justify-end md:pr-10 md:pt-20 bg-black/20 backdrop-blur-[2px] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#1A234E] dark:bg-slate-800 p-4 text-white flex justify-between items-center"><div className="flex items-center gap-2"><Settings size={16} /><h2 className="text-sm font-black italic">Paramètres</h2></div><button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full"><X size={18} /></button></div>
        <div className="p-6 space-y-6"><div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700"><span className="text-xs font-bold dark:text-white">Mode Sombre</span><button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${darkMode ? 'left-6' : 'left-1'}`} /></button></div></div>
        <div className="p-4 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700"><button onClick={onClose} className="w-full bg-[#1A234E] dark:bg-indigo-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Appliquer</button></div>
      </div>
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ currentMenu }) => {
  const [activeModal, setActiveModal] = useState<'mail' | 'notif' | 'profile' | 'editProfile' | 'settings' | null>(null);
  const [nom, setNom] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const toggleModal = (type: 'mail' | 'notif' | 'profile' | 'editProfile' | 'settings') => setActiveModal(activeModal === type ? null : type);

  useEffect(() => {
    const fetchAdminData = async () => {
      try { const response = await fetch(`${API_URL}/user`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); const data = await response.json(); setNom(data.nom); setPhotoUrl(data.photo); } catch (error) { console.error(error); }
    };
    fetchAdminData();
  }, []);

  return (
    <nav className="bg-[#eeeaea] dark:bg-slate-800/80 rounded-[20px] p-4 flex justify-between items-center px-4 md:px-6 mt-4 mx-4 border border-white/40 dark:border-slate-700 backdrop-blur-md shadow-sm relative z-50">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Nir Info" className="w-20 md:w-24 object-contain brightness-100 dark:brightness-125" />
        <span className="text-xs md:text-sm font-black text-[#1A234E] dark:text-white uppercase">{currentMenu}</span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-5 pr-6 border-r border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400">
          <button onClick={() => toggleModal('mail')} className="relative transition-transform active:scale-90 hover:text-indigo-600 dark:hover:text-indigo-400"><Mail size={22} /></button>
          <button onClick={() => toggleModal('notif')} className="relative transition-transform active:scale-90"><Bell size={22} className="text-yellow-500" /> 
          </button>
        </div>
        <div onClick={() => toggleModal('profile')} className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-all">
          <div className="flex flex-col text-right"><span className="text-[12px] font-black text-[#1A234E] dark:text-white leading-none">{nom || "Admin"}</span><span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Admin</span></div>
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border-2 border-white dark:border-slate-600 shadow-sm overflow-hidden"><img src={photoUrl ? `${API_URL.replace("/api","")}/${photoUrl}` : `https://ui-avatars.com/api/?name=${nom}`} alt="Profil" className="w-full h-full object-cover" /></div>
        </div>
      </div>

      {activeModal === 'profile' && <ModalProfil onClose={() => setActiveModal(null)} onEdit={() => setActiveModal('editProfile')} onSettings={() => setActiveModal('settings')} />}
      {activeModal === 'editProfile' && <AdminProfileEditModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'settings' && <SettingsModal onClose={() => setActiveModal(null)} />}
    </nav>
  );
};

export default Navbar;