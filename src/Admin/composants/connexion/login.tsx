import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import blue from "./../../assets/blue.jpg";
import { API_URL } from "../../lib/api";
import logo from "./../../assets/logonirtuto.png";

// On sépare proprement le composant Alerte et on lui passe des props
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlertModal = ({ isOpen, onClose }: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Conteneur principal avec arrière-plan en grille */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f1616_1px,transparent_1px),linear-gradient(to_bottom,#1f1616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* La Modale */}
      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#ffe5e5] via-[#f7f9fc] to-[#ffffff] p-8 text-center shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Icône d'erreur Rouge */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4a4a] shadow-[0_8px_16px_rgba(255,74,74,0.3)]">
          <X className="h-8 w-8 text-white stroke-[2.5]" />
        </div>

        {/* Textes */}
        <h2 className="mb-2 text-[22px] font-bold text-[#2d3748] tracking-tight">
          Erreur
        </h2>
        <p className="mb-8 text-sm font-medium text-[#718096]">
          Email ou mot de passe incorrect
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setAlert] = useState(false); // Correction ici : nom de variable explicite
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/logins`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, mdp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert(true);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminNom", data.user.nom);
        localStorage.setItem("adminRole", data.user.role);
        
        if (data.user.role === "admin") navigate("/admin/dashboard");
        else if (data.user.role === "formateur") navigate("/admin/formateur");
      }
    } catch (err) {
      console.error(err);
      setAlert(true);
    }
  };

  return (
    <div 
      className="flex justify-center items-center w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${blue})` }}
    >
      {/* Rendu conditionnel de la modale d'alerte */}
      <AlertModal isOpen={showAlert} onClose={() => setAlert(false)} />

      <form 
        className="w-[450px] p-10 bg-white/95 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-center"
        onSubmit={handleLogin}
      >
        <div className="flex items-center justify-center mb-5">
          <img src={logo} className="w-52" alt="Logo" />
        </div>
        <div className="w-full bg-black h-1 mb-5"></div>
        <h2 className="mb-6 text-2xl font-bold text-[#0f172a]">Connexion</h2>

        {/* Champ Email */}
        <input 
          type="email" 
          placeholder="Email" 
          name="email" 
          value={email}
          onChange={e => setEmail(e.target.value)} 
          className="w-full px-3.5 py-3 mb-4 rounded-lg border border-[#cbd5e1] outline-none focus:border-[#1e40af] text-sm"
          required
        />

        {/* Champ Mot de passe avec Oeil */}
        <div className="relative mb-6">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Mot de passe" 
            name="mdp" 
            value={mdp}
            onChange={e => setMdp(e.target.value)} 
            className="w-full px-3.5 py-3 rounded-lg border border-[#cbd5e1] outline-none focus:border-[#1e40af] text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1e3a8a] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full p-3 bg-[#1e3a8a] text-white rounded-lg text-[15px] font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;