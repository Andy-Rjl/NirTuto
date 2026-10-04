import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/images/logonirtutowhite.png";
import { API_URL } from "../../lib/api";
import Inscription from "./inscription/Inscription";

export interface Formation {
  id: number;
  titre: string;
  categorie: string;
  difficulte: string;
  nom_formateur: string;
  photo_formateur: string;
  duree: string;
  type: string;
  frais: number | null;
  image: string | null;
  video: string;
  description: string;
  prerequis: string;
  programme: string;
  cibles: string;
  admin: {
    id: number;
    nom: string;
    photo: string | null;
  } | null;
}

export default function Connexion() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showEnroll, setShowEnroll] = useState(false);
  const [formation] = useState<Formation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // États Connexion
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  // États d'erreurs pour les messages personnalisés sous les inputs
  const [emailError, setEmailError] = useState("");
  const [mdpError, setMdpError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Réinitialisation des erreurs à chaque tentative
    setEmailError("");
    setMdpError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, mdp }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        // Logique de détection du type d'erreur (à adapter selon les réponses exactes de votre API)
        const msg = data.message ? data.message.toLowerCase() : "";
        if (msg.includes("email") || msg.includes("utilisateur") || msg.includes("trouvé")) {
          setEmailError(data.message || "Email incorrect");
        } else if (msg.includes("mot de passe") || msg.includes("password") || msg.includes("incorrect")) {
          setMdpError(data.message || "Mot de passe incorrect");
        } else {
          // Si le backend renvoie un message général, on l'affiche par exemple sur l'email
          setEmailError(data.message || "Identifiants incorrects");
        }
      } else {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dash");
      }
    } catch {
      setEmailError("Erreur réseau. Impossible de se connecter.");
    }
  };

  function input(
    type: string,
    setValue: (v: string) => void,
    label = "Email",
    value: string = ""
  ) {
    const isPassword = type === "password";
    const isEmail = type === "email";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    // Récupérer l'erreur correspondante au champ actuel
    // On vérifie le label pour cibler l'input actif
    let fieldError = "";
    if (isEmail && (label === "Email")) {
      fieldError = emailError;
    } else if (isPassword && (label === "Mot de passe")) {
      fieldError = mdpError;
    }

    return (
      <div className="relative w-full mb-3">
        <div className="relative">
          <input
            type={inputType}
            value={value}
            required
            onChange={(e) => {
              setValue(e.target.value);
              // Efface l'erreur dès que l'utilisateur recommence à écrire
              if (isEmail && label === "Email") setEmailError("");
              if (isPassword && label === "Mot de passe") setMdpError("");
            }}
            autoComplete={isPassword ? "new-password" : "off"}
            name={`signup-${label.toLowerCase()}`}
            className={`w-full px-3 py-2.5 border rounded-xl outline-none peer transition-all focus:ring-2 bg-white text-sm ${
              fieldError 
                ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            }`}
          />
          <label className={`absolute left-3 top-2.5 bg-white px-1 transition-all text-sm peer-focus:-top-2 peer-focus:text-xs peer-valid:-top-2 peer-valid:text-xs pointer-events-none ${
            fieldError ? "text-red-500 peer-focus:text-red-500" : "text-gray-400 peer-focus:text-blue-500"
          }`}>
            {label}
          </label>
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {/* Message d'erreur affiché juste en dessous de l'input */}
        {fieldError && (
          <p className="text-red-500 text-xs mt-1 px-1 font-medium animate-fadeIn">
            {fieldError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center p-4"
      style={{
        backgroundColor: "#f0f4ff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blobs décoratifs */}
      <div style={{
        position: "fixed", top: "-80px", right: "-80px",
        width: "320px", height: "320px", borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, #a5b4fc 0%, #818cf8 40%, transparent 70%)",
        opacity: 0.55, pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-60px", right: "60px",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "radial-gradient(circle at 50% 50%, #93c5fd 0%, #60a5fa 50%, transparent 75%)",
        opacity: 0.45, pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", top: "30%", left: "-60px",
        width: "180px", height: "180px", borderRadius: "50%",
        background: "radial-gradient(circle, #bfdbfe 0%, transparent 70%)",
        opacity: 0.5, pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── MOBILE / TABLETTE ── */}
      <div
        className="lg:hidden w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: "360px",
          position: "relative", zIndex: 1,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 40px rgba(99,102,241,0.13), 0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col items-center py-5 px-4 text-white text-center"
          style={{ background: "linear-gradient(135deg, #4f46e5, #3b82f6)" }}
        >
          <img src={logo} className="w-28 mb-1.5" alt="Logo" />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
            Apprenez aujourd'hui les compétences de demain
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <span
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors text-blue-600`}
          >
            Login
          </span>
        </div>

        {/* Form */}
        <div className="px-5 py-4 bg-white">
          <form onSubmit={handleLogin} className="flex flex-col gap-0">
            {input("email", setEmail, "Email", email)}
            {input("password", setMdp, "Mot de passe", mdp)}
            <button
              className="w-full mt-2 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #4f46e5, #3b82f6)", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }}
            >
              Se connecter
            </button>
            <p className="mt-2.5 text-center text-xs text-gray-500">
              Pas de compte ?{" "}
              <span onClick={() => setShowEnroll(true)} className="text-blue-500 cursor-pointer font-semibold hover:underline">
                S'inscrire
              </span>
            </p>
          </form>
        </div>
      </div>
      {showEnroll && (
        <Inscription
          formation={
            formation 
              ? { id: formation.id, titre: formation.titre, frais: formation.frais, type: formation.type, nom_formateur: formation.nom_formateur }
              : { id: 0, titre: "Inscription générale", frais: null, type: "standard", nom_formateur: "" } // Valeurs par défaut si nul
          }
          onClose={() => setShowEnroll(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {/* ── DESKTOP ── */}
      <div
        className="hidden lg:block relative rounded-2xl overflow-hidden bg-white"
        style={{
          width: "min(820px, 125vw)",
          height: "auto",
          minHeight: "0",
          position: "relative", zIndex: 1,
          boxShadow: "0 8px 50px rgba(99,102,241,0.1), 0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex" style={{ minHeight: "550px" }}>

          {/* LOGIN FORM */}
          <div
            className={`absolute top-0 w-1/2 h-full flex flex-col justify-center items-center bg-white transition-all duration-700 z-10 translate-x-0`}
          >
            <h2 className="text-4xl font-normal mb-5 text-gray-800">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col items-center w-[260px]">
              {input("email", setEmail, "Email", email)}
              {input("password", setMdp, "Mot de passe", mdp)}
              <button
                className="w-full mt-3 py-2.5 rounded-xl text-white font-medium text-sm"
                style={{ background: "linear-gradient(135deg, #4f46e5, #3b82f6)", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }}
              >
                Se connecter
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-500">
              Pas de compte ?{" "}
              <span onClick={() => { setShowEnroll(true); setEmailError(""); setMdpError(""); }} className="text-blue-500 cursor-pointer font-semibold hover:underline">
                S'inscrire
              </span>
            </p>
          </div>

          {/* Spacer pour hauteur auto */}
          <div className="w-1/2 invisible py-10 flex flex-col justify-center items-center">
            <div className="text-3xl mb-3">Signup</div>
            <div style={{ width: "260px" }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="mb-3" style={{ height: "42px", borderRadius: "12px", background: "#f3f4f6" }} />
              ))}
              <div style={{ height: "38px", marginTop: "8px", borderRadius: "12px", background: "#f3f4f6" }} />
            </div>
            <div className="mt-3 text-sm" style={{ height: "20px" }} />
          </div>
        </div>

        {/* OVERLAY PANEL */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full text-white flex flex-col justify-center items-center text-center transition-all duration-700 z-30 translate-x-0`}
          style={{
            background: "linear-gradient(145deg, #4f46e5, #6366f1 40%, #818cf8 70%, #93c5fd)",
            clipPath: "polygon(40% 0,100% 0,100% 100%,0 70%)"
          }}
        >
          <img src={logo} className="w-[160px] mb-3" alt="Logo" />
          <p className="px-8 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
            Apprenez aujourd'hui les compétences de demain
          </p>
        </div>
      </div>
    </div>
  );
}