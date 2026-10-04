import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { API_URL } from "./../../lib/api";
import blue from "./../../assets/blue.jpg";
import logo from "./../../assets/logonirtuto.png";

// Composant AlertModal réutilisable et dynamique
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const AlertModal = ({ isOpen, onClose, message }: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Conteneur principal avec arrière-plan en grille */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f1616_1px,transparent_1px),linear-gradient(to_bottom,#1f1616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* La Modale */}
      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#ffe5e5] via-[#f7f9fc] to-[#ffffff] p-8 text-center shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Bouton pour fermer la modale */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icône d'erreur Rouge */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4a4a] shadow-[0_8px_16px_rgba(255,74,74,0.3)]">
          <X className="h-8 w-8 text-white stroke-[2.5]" />
        </div>

        {/* Textes Dynamiques */}
        <h2 className="mb-2 text-[22px] font-bold text-[#2d3748] tracking-tight">
          Erreur
        </h2>
        <p className="mb-8 text-sm font-medium text-[#718096] whitespace-pre-line">
          {message}
        </p>

        {/* Bouton Action OK */}
        <button
          onClick={onClose}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#64e5ed] px-6 py-3.5 text-xs font-bold tracking-wider text-[#1a202c] uppercase shadow-[0_4px_12px_rgba(100,229,237,0.3)] transition-all duration-200 hover:bg-[#4cdde6] hover:shadow-[0_6px_20px_rgba(100,229,237,0.4)] active:scale-[0.98]"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const Signup = () => {
  const [nom, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [cmdp, setCmdp] = useState("");
  
  // États pour la visibilité des mots de passe
  const [showMdp, setShowMdp] = useState(false);
  const [showCmdp, setShowCmdp] = useState(false);

  // États pour gérer l'affichage de l'alerte customisée
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate();

  // Fonction utilitaire pour déclencher l'alerte proprement
  const triggerAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mdp !== cmdp) {
      triggerAlert("Les mots de passe ne correspondent pas.");
      return;
    }

    const payload = { nom, contact, email, mdp, cmdp };

    try {
      const res = await fetch(`${API_URL}/registers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Affiche l'erreur spécifique renvoyée par l'API (ex: "Cet email est déjà utilisé")
        triggerAlert(data.message || "Une erreur est survenue lors de l'inscription.");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      triggerAlert("Erreur réseau.\nVeuillez vérifier votre connexion internet.");
    }
  };

  return (
    <div 
      className="flex justify-center items-center w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${blue})` }}
    >
      {/* Inclusion de la modale d'alerte customisée */}
      <AlertModal 
        isOpen={showAlert} 
        onClose={() => setShowAlert(false)} 
        message={alertMessage} 
      />

      <form 
        className="w-[500px] p-10 bg-white/95 flex items-center flex-col rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-center"
        onSubmit={handleSubmit}
      >
        <img src={logo} className="w-40 h-16 text-center mb-4" alt="Logo" />
        <div className="w-[420px] h-[2px] bg-black mb-4" />
        <h2 className="mb-6 text-2xl font-bold text-[#0f172a]">Ajout formateur</h2>

        {/* Champs standards */}
        <input 
          type="text" placeholder="Nom et Prenom" 
          onChange={e => setName(e.target.value)}
          className="w-full px-3.5 py-3 mb-4 rounded-lg border border-[#cbd5e1] outline-none focus:border-[#1e40af] text-sm"
          required
        />
        <input 
          type="tel" placeholder="Contact" 
          onChange={e => setContact(e.target.value)}
          className="w-full px-3.5 py-3 mb-4 rounded-lg border border-[#cbd5e1] outline-none focus:border-[#1e40af] text-sm"
          required
        />
        <input 
          type="email" placeholder="Email" 
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3.5 py-3 mb-4 rounded-lg border border-[#cbd5e1] outline-none focus:border-[#1e40af] text-sm"
          required
        />

        {/* Mot de passe */}
        <div className="relative mb-4 w-full">
          <input 
            type={showMdp ? "text" : "password"} 
            placeholder="Mot de passe" 
            onChange={e => setMdp(e.target.value)}
            className="w-full px-3.5 py-3 rounded-lg border border-[#cbd5e1] outline-none focus:border-[#1e40af] text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowMdp(!showMdp)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1e3a8a]"
          >
            {showMdp ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirmation Mot de passe */}
        <div className="relative mb-6 w-full">
          <input 
            type={showCmdp ? "text" : "password"} 
            placeholder="Confirmation mot de passe" 
            onChange={e => setCmdp(e.target.value)}
            className="w-full px-3.5 py-3 rounded-lg border border-[#cbd5e1] outline-none focus:border-[#1e40af] text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowCmdp(!showCmdp)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1e3a8a]"
          >
            {showCmdp ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full p-3 bg-[#1e3a8a] text-white rounded-lg text-[15px] font-medium transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default Signup;