import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { API_URL } from "../../../lib/api";
import { useNavigate } from "react-router-dom";
import ChoixFormation from "./ChoixFormation";
import logo from "../../assets/images/logonirtuto.png";

interface FormationType {
  id: number;
  titre: string;
  nom_formateur: string;
  frais: number | null;
  type: string;
}

interface Props {
  formation: FormationType; 
  onClose: () => void;
}
interface FormationsProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

type StatutInscription = 'en_attente' | 'confirme' | null;

const SuccessAlert = ({ onClose, onContinue, isGratuit }: { onClose: () => void; onContinue: () => void; isGratuit: boolean }) => (
  <>
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[2rem] shadow-2xl flex flex-col items-center px-8 py-10 mx-4"
        style={{ width: "100%", maxWidth: 320, animation: "successIn 0.35s cubic-bezier(.34,1.56,.64,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500">
          <X size={14} />
        </button>
        <div className="flex items-center justify-center rounded-full mb-6"
          style={{ width: 72, height: 72, background: "linear-gradient(135deg,#6ee7a0,#34c471)", boxShadow: "0 8px 24px rgba(52,196,113,0.35)" }}>
          <CheckCircle size={34} color="white" />
        </div>
        <h2 className="text-gray-900 text-xl font-bold mb-2 text-center">Inscription réussie !</h2>
        
        <p className="text-gray-400 text-sm text-center leading-relaxed mb-8">
          {isGratuit 
            ? "Vos inscriptions gratuites ont été validées et confirmées automatiquement d'office. 🎉" 
            : "Votre demande d'inscription a bien été envoyée. Elle sera validée prochainement après vérification."
          }
        </p>
        
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-2xl text-sm font-semibold border-2 border-gray-200 text-gray-500 transition-all hover:border-[#34c471] hover:text-[#34c471]"
        >
          Continuer
        </button>
      </div>
    </div>
    <style>{`@keyframes successIn{from{opacity:0;transform:scale(.85) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
  </>
);

export default function Inscription({ onClose, searchTerm, setSearchTerm }: Props & FormationsProps) {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const [selectedFormations, setSelectedFormations] = useState<FormationType[]>([]);
  const [tempSelections, setTempSelections] = useState<FormationType[]>([]);

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd1, setShowPwd1] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dejaInscrit, setDejaInscrit] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Auth fields
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [contact, setContact] = useState("");
  const [email1, setEmail1] = useState("");
  const [mdp1, setMdp1] = useState("");
  const [cmdp1, setCmdp1] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [statutInscription, setStatutInscription] = useState<StatutInscription>(null);

  const totalFrais = selectedFormations.reduce((sum, item) => sum + (item.frais || 0), 0);
  const isGratuit = totalFrais === 0 || selectedFormations.every(f => f.type === "Gratuite");

  /* ── Vérifier les inscriptions existantes ── */
  const verifierInscription = async (token: string): Promise<boolean> => {
    try {
      for (const f of selectedFormations) {
        const res = await fetch(`${API_URL}/user/check-training?formation_id=${f.id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.has_training === true) return true; 
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const afterAuth = async (token: string) => {
    const dejainscrit = await verifierInscription(token);
    setDejaInscrit(dejainscrit);

    if (dejainscrit) {
      return;
    }

    if (isGratuit) {
      await inscrireGratuit(token);
    } else {
      await inscrirePayant(token);
    }
  };

  // Étape 2 -> Soumission pour envoi du code par mail
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mdp1 !== cmdp1) return setError("Les mots de passe ne correspondent pas");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/pre-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ nom, prenom, contact, email: email1, mdp: mdp1, cmdp: cmdp1 }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Erreur lors de la validation");
      
      setStep(3);
    } catch { 
      setError("Erreur réseau ou serveur inaccessible"); 
    } finally { 
      setSubmitting(false); 
    }
  };

  // Étape 3 -> Validation finale du code secret
  const handleFinalVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (verificationCode.length !== 6) {
      return setError("Le code doit contenir 6 chiffres.");
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/verify-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ nom, prenom, contact, email: email1, mdp: mdp1, code: verificationCode }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        return setError(data.message || "Le code est invalide ou expiré.");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      await afterAuth(data.access_token);
    } catch {
      setError("Erreur réseau lors de la validation définitive.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Inscription cours gratuits ── */
const inscrireGratuit = async (token: string) => {
  try {
    // On boucle sur chaque formation pour envoyer une requête unique
    for (const f of selectedFormations) {
      const res = await fetch(`${API_URL}/inscrire-gratuit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formation_id: f.id, // Envoie un ID unique (ex: 1) au lieu du tableau
          numero_paiement: "GRATUIT",
          reference_transaction: `GRATUIT-MULTI-${Date.now()}`,
          methode: "Gratuit",
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || JSON.stringify(data.errors));
        return; // On arrête tout s'il y a une erreur
      }
    }
    
    // Si toutes les requêtes ont réussi
    setStatutInscription('confirme');
    setShowSuccess(true);
  } catch { 
    setError("Erreur réseau"); 
  }
};

/* ── Inscription cours payants ── */
const inscrirePayant = async (token: string) => {
  try {
    // On boucle sur chaque formation pour envoyer une requête unique
    for (const f of selectedFormations) {
      const res = await fetch(`${API_URL}/inscrire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          formation_id: f.id, // Envoie un ID unique (ex: 1) au lieu du tableau
          numero_paiement: null,
          reference_transaction: null,
          methode: null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || JSON.stringify(data.errors));
        return;
      }
    }

    // Si toutes les requêtes ont réussi
    setShowSuccess(true);
  } catch { 
    setError("Erreur réseau"); 
  }
};

  const handleConfirmFormation = () => {
    if (tempSelections.length > 0) {
      setSelectedFormations(tempSelections);
      setStep(2);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "bg-gray-200" };
    let score = 0;
    if (password.length > 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Faible", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Moyen", color: "bg-orange-500" };
    return { score, label: "Fort", color: "bg-green-500" };
  };

  const strength = mdp1 ? getPasswordStrength(mdp1) : null;

  const Stepper = () => (
    <div className="flex items-center mb-6 mx-24">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${step >= n ? "bg-[#5a4fcf] text-white" : "bg-gray-100 text-gray-400"}`}>
              {n}
            </div>
            <span className="text-[10px] 2xl:text-[14px] font-bold text-gray-400 mt-1 whitespace-nowrap">
              {["Choix", "Inscription", "Validation Mail"][i]}
            </span>
          </div>
          {i < 2 && <div className={`flex-1 h-1 mx-2 mb-5 ${step > n ? "bg-[#5a4fcf]" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {showSuccess && (
        <SuccessAlert
          isGratuit={isGratuit}
          onClose={() => { setShowSuccess(false); onClose(); }}
          onContinue={() => { setShowSuccess(false); onClose(); navigate("/dash"); }}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-7xl rounded-[2rem] shadow-2xl h-[95vh] overflow-y-auto no-scrollbar">
          
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 ml-11">
                <span></span>
                <button onClick={onClose} className="text-gray-300 hover:text-gray-500 flex-shrink-0"><X size={18} /></button>
              </div>

              <Stepper />

              {/* ── Étape 1 : Choix de la formation ── */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-black text-gray-900 mb-1">Choisir des formations</h2>
                  <p className="text-sm text-gray-400 mb-6">Sélectionnez une ou plusieurs formations de votre choix ci-dessous, puis cliquez sur continuer.</p>
                  
                  <div className="space-y-3">
                    <ChoixFormation 
                      activeTab={activeTab} 
                      setActiveTab={setActiveTab}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      selectedIds={tempSelections.map(f => f.id)}
                      onSelectFormation={(formationSelectionnee) => {
                        setTempSelections((prev) => {
                          if (prev.some(f => f.id === formationSelectionnee.id)) {
                            return prev.filter(f => f.id !== formationSelectionnee.id);
                          }
                          return [...prev, formationSelectionnee];
                        });
                      }}
                    />
                  </div>

                  <div className="mt-6 p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 rounded-2xl">
                    <div className="text-sm text-gray-600 font-medium max-w-xl truncate">
                      {tempSelections.length > 0 ? (
                        <span>Panier : <strong className="text-[#5a4fcf]">{tempSelections.map(f => `"${f.titre}"`).join(', ')}</strong></span>
                      ) : (
                        <span className="text-gray-400 italic">Veuillez sélectionner au moins une formation dans la liste</span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={tempSelections.length === 0}
                      onClick={handleConfirmFormation}
                      className="w-full sm:w-auto px-8 py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:bg-gray-300 uppercase tracking-wide"
                    >
                      Continuer ({tempSelections.length}) →
                    </button>
                  </div>
                </div>
              )}

              {/* ── Étape 2 : Formulaire inscription ── */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-black text-gray-900 mb-1">Inscription</h2>
                  <p className="text-sm text-gray-400 mb-6">Veuillez remplir ce formulaire d'inscription, puis cliquez sur s'inscrire.</p>
                  
                  <form onSubmit={handleSignup}>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="mx-10 py-5 border-2 h-[300px] px-10 rounded-2xl grid col-span-2">
                        <div className="grid grid-cols-2 gap-7">
                          <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required
                            className="border border-gray-200 h-14 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#5a4fcf] bg-white"/>
                          <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required
                            className="border border-gray-200 h-14 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#5a4fcf] bg-white"/>
                        </div>
                        <div className="grid grid-cols-2 gap-7">
                          <input type="tel" placeholder="Contact (+261...)" value={contact} onChange={e => setContact(e.target.value)} required 
                            className="w-full h-14 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf] bg-white"/>
                          <input type="email" placeholder="Email" value={email1} onChange={e => setEmail1(e.target.value)} required
                            className="w-full h-14 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf] bg-white"/>
                        </div>
                        <div className="grid grid-cols-2 gap-7">
                          <div>
                            <div className="relative">
                              <input type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={mdp1} onChange={e => setMdp1(e.target.value)} required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf] bg-white"/>
                              <button type="button" onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs">
                                {showPwd ? "Cacher" : "Voir"}
                              </button>
                            </div>
                            {mdp1 && (
                              <div className="px-1 pt-1 transition-all duration-300">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] uppercase font-black text-gray-400">Sécurité :</span>
                                  <span className={`text-[10px] uppercase font-black ${strength?.color.replace('bg-', 'text-')}`}>
                                    {strength?.label}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${strength?.color}`}
                                    style={{ width: `${(strength!.score / 4) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <input type={showPwd1 ? "text" : "password"} placeholder="Confirmer le mot de passe" value={cmdp1} onChange={e => setCmdp1(e.target.value)} required
                              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf] bg-white"/>
                            <button type="button" onClick={() => setShowPwd1(!showPwd1)}
                              className="absolute right-3 top-1/4 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs">
                              {showPwd1 ? "Cacher" : "Voir"}
                            </button>
                          </div>
                          {error && <p className="text-red-500 text-xs col-span-2">{error}</p>}
                        </div>
                        <div className="flex items-center mt-2 gap-2">
                          <input type="checkbox" className="float-left" required/> 
                          <span className="text-xs text-gray-400">J'accepte les <a href="/terms" target="_blank" className="text-[#5a4fcf] hover:underline">conditions d'utilisation</a></span>
                        </div>
                      </div>

                      <div className="border-2 p-4 mr-10 rounded-2xl bg-slate-200 max-h-[500px] overflow-y-auto no-scrollbar">
                        <div className="flex flex-col items-center">
                          <img src={logo} alt="Logo" className="w-52 flex justify-center"/>
                        </div>
                        <span className="text-sm font-bold text-gray-700 pr-4 block mt-4 border-b pb-2">
                          Cours choisis ({selectedFormations.length}) :
                        </span>
                        
                        <div className="divide-y divide-gray-300 h-48 overflow-y-auto pr-1">
                          {selectedFormations.map((f) => (
                            <div key={f.id} className="py-2 text-xs">
                              <p className="font-bold text-gray-800 text-left">{f.titre}</p>
                              <p className="text-gray-500 text-[11px] text-left">Formateur : {f.nom_formateur}</p>
                              <div className="flex justify-between text-[11px] mt-1 text-slate-600">
                                <span>{f.type}</span>
                                <span className="font-semibold">{f.frais ? `${f.frais.toLocaleString()} Ar` : "Gratuit"}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between mt-4 border-t border-gray-400 pt-3">
                          <p className="font-black text-gray-800">Net à payer : </p> 
                          <span className="text-base font-black text-indigo-700">
                            {totalFrais > 0 ? `${totalFrais.toLocaleString()} Ar` : "0 Ar"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-20 p-4 border-t border-gray-100 flex flex-row items-center justify-between gap-4 bg-gray-50 rounded-2xl">
                      <button type="button" onClick={() => { setStep(1); setError(""); }}
                        className="px-8 py-3 rounded-xl text-xs text-gray-400 border-gray-300 border hover:text-gray-600 text-center">
                        ← Retour
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-8 py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:bg-gray-300 uppercase tracking-wide"
                      >
                        {submitting ? "Traitement..." : "S'inscrire →"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── Étape 3 : Confirmation E-mail intégrée ── */}
              {step === 3 && (
                <div className="flex flex-col items-center justify-center max-w-md mx-auto py-10">
                  {dejaInscrit ? (
                    <div className="text-center w-full">
                      <div className="flex items-center justify-center rounded-full mb-5 mx-auto"
                        style={{ width: 72, height: 72, background: "linear-gradient(135deg,#a5b4fc,#5a4fcf)", boxShadow: "0 8px 24px rgba(90,79,207,0.25)" }}>
                        <AlertCircle size={34} color="white" />
                      </div>
                      <h2 className="text-gray-900 text-xl font-bold mb-2">Déjà inscrit à l'un de ces cours</h2>
                      <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        Vous avez déjà soumis une demande d'inscription pour l'une des formations sélectionnées. 
                        Rendez-vous sur votre tableau de bord pour faire le tri ou vérifier vos accès.
                      </p>
                      <button
                        onClick={() => { onClose(); navigate("/dash"); }}
                        className="w-full py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white rounded-2xl font-bold text-sm transition-all"
                      >
                        Voir mon tableau de bord
                      </button>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <div className="flex items-center justify-center rounded-full mb-4 mx-auto"
                        style={{ width: 64, height: 64, background: "linear-gradient(135deg,#818cf8,#5a4fcf)", boxShadow: "0 8px 24px rgba(90,79,207,0.3)" }}>
                        <Mail size={28} color="white" />
                      </div>
                      
                      <h2 className="text-gray-900 text-lg font-black mb-1">Vérifiez votre e-mail</h2>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6">
                        Un e-mail de validation contenant un code de sécurité a été envoyé à <strong className="text-gray-600 break-all">{email1}</strong>.
                      </p>

                      <form onSubmit={handleFinalVerification} className="w-full space-y-4">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Code à 6 chiffres"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-lg outline-none focus:border-[#5a4fcf] focus:bg-white tracking-[0.3em] font-bold"
                          required
                        />
                        
                        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                        <div className="flex gap-4 pt-2">
                          <button 
                            type="button" 
                            onClick={() => { setStep(2); setError(""); }}
                            className="w-1/3 py-3 bg-gray-100 text-gray-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Retour
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-2/3 py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            {submitting ? "Vérification..." : "Vérifier le code"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}