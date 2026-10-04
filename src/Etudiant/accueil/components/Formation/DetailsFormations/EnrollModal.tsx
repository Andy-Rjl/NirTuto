// EnrollModal.tsx
import { useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { API_URL } from "./../../../../../lib/api";
import { useNavigate } from "react-router-dom";

interface Props {
  formation: { id: number; titre: string; frais: number | null; type: string };
  onClose: () => void;
}

/* ── Alerte succès ── */
const SuccessAlert = ({ onClose, onContinue }: { onClose: () => void; onContinue: () => void }) => (
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
          Votre demande d'inscription a bien été envoyée. Elle sera validée prochainement.
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

/* ── Modal principale ── */
export default function EnrollModal({ formation, onClose }: Props) {
  const navigate = useNavigate();

  // Étape 1 = choix connexion/inscription
  // Étape 2 = formulaire auth
  // Étape 3 = résultat (déjà inscrit OU paiement)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dejaInscrit, setDejaInscrit] = useState(false);

  // Auth fields
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [contact, setContact] = useState("");
  const [email1, setEmail1] = useState("");
  const [mdp1, setMdp1] = useState("");
  const [cmdp1, setCmdp1] = useState("");

  // Paiement
  const [paymentData, setPaymentData] = useState({
    numero_paiement: "",
    reference_transaction: "",
    methode: "Mvola",
  });

  const isGratuit = !formation.frais || formation.frais === 0 || formation.type === "Gratuite";

  /* ── Vérifier si déjà inscrit via GET /user/check-training?formation_id=X ── */
  const verifierInscription = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/user/check-training?formation_id=${formation.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.has_training === true;
    } catch {
      return false;
    }
  };

  /* ── Après authentification réussie ── */
  const afterAuth = async (token: string) => {
    const dejainscrit = await verifierInscription(token);
    setDejaInscrit(dejainscrit);

    if (dejainscrit) {
      setStep(3);
      return;
    }

    if (isGratuit) {
      await inscrireGratuit(token);
    } else {
      setStep(3);
    }
  };

  /* ── Login ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, mdp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Identifiants incorrects");
      const token = data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await afterAuth(token);
    } catch { setError("Erreur réseau"); }
    finally { setSubmitting(false); }
  };

  /* ── Inscription compte ── */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mdp1 !== cmdp1) return setError("Les mots de passe ne correspondent pas");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ nom, prenom, contact, email: email1, mdp: mdp1, cmdp: cmdp1 }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Erreur lors de l'inscription");
      const token = data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await afterAuth(token);
    } catch { setError("Erreur réseau"); }
    finally { setSubmitting(false); }
  };

  /* ── Inscription gratuite ── */
  const inscrireGratuit = async (token?: string) => {
    const t = token ?? localStorage.getItem("token") ?? "";
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/inscrire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({
          formation_id: formation.id,
          numero_paiement: "GRATUIT",
          reference_transaction: `GRATUIT-${formation.id}-${Date.now()}`,
          methode: "Gratuit",
        }),
      });
      const data = await res.json();
      if (res.ok) { setShowSuccess(true); }
      else setError(data.message || JSON.stringify(data.errors));
    } catch { setError("Erreur réseau"); }
    finally { setSubmitting(false); }
  };

  /* ── Inscription payante ── */
  const handleInscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/inscrire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ formation_id: formation.id, ...paymentData }),
      });
      const data = await res.json();
      if (res.ok) { setShowSuccess(true); }
      else setError(data.message || JSON.stringify(data.errors));
    } catch { setError("Erreur réseau"); }
    finally { setSubmitting(false); }
  };

  /* ── Stepper ── */
  const Stepper = () => (
    <div className="flex items-center mb-6">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${step >= n ? "bg-[#5a4fcf] text-white" : "bg-gray-100 text-gray-400"}`}>
              {n}
            </div>
            <span className="text-[10px]  2xl:text-[14px] font-bold text-gray-400 mt-1 whitespace-nowrap">
              {["Choix", "Auth", "Paiement"][i]}
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
          onClose={() => { setShowSuccess(false); onClose(); }}
          onContinue={() => { setShowSuccess(false); onClose(); navigate("/dash"); }}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[95vh] overflow-y-auto">

          {/* ── Étape 3 : Déjà inscrit ── */}
          {step === 3 && dejaInscrit && (
            <div className="p-6 flex flex-col items-center text-center">
              <div className="flex justify-between items-center w-full mb-6">
                <span className="text-sm font-bold text-gray-700 truncate pr-4">"{formation.titre}"</span>
                <button onClick={onClose} className="text-gray-300 hover:text-gray-500 flex-shrink-0"><X size={18} /></button>
              </div>
              <Stepper />
              <div
                className="flex items-center justify-center rounded-full mb-5"
                style={{ width: 72, height: 72, background: "linear-gradient(135deg,#a5b4fc,#5a4fcf)", boxShadow: "0 8px 24px rgba(90,79,207,0.25)" }}
              >
                <AlertCircle size={34} color="white" />
              </div>
              <h2 className="text-gray-900 text-xl font-bold mb-2">Vous êtes déjà inscrit</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Vous avez déjà soumis une inscription pour la formation{" "}
                <span className="font-semibold text-[#5a4fcf]">"{formation.titre}"</span>.
                Rendez-vous sur votre tableau de bord pour suivre son statut.
              </p>
              <div className="w-full space-y-3">
                <button
                  onClick={() => { onClose(); navigate("/dash"); }}
                  className="w-full py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white rounded-2xl font-bold text-sm transition-all"
                >
                  Voir mon tableau de bord
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 3 : Paiement ── */}
{/* ── Étape 3 : Paiement ── */}
{step === 3 && !dejaInscrit && (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <span className="text-sm font-bold text-gray-700 truncate pr-4">"{formation.titre}"</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500"><X size={18} /></button>
    </div>

    <Stepper />

    <p className="text-[10px] 2xl:text-[14px] font-bold uppercase tracking-widest text-gray-400 mb-4">Méthode de paiement</p>

    {/* Layout 2 colonnes : gauche infos | droite formulaire */}
    <div className="flex gap-4">

      {/* ── Colonne gauche : méthode + infos paiement ── */}
      <div className="flex flex-col gap-3 w-[45%]">

        {/* Carte Mvola */}
        <div
          onClick={() => setPaymentData({ ...paymentData, methode: "Mvola" })}
          className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-2xl border-2 border-[#5a4fcf] shadow-sm bg-white"
        >
          <div className="w-12 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-black">M</span>
          </div>
          <span className="text-sm font-black text-[#5a4fcf]">Mvola</span>
          <CheckCircle size={15} className="ml-auto text-[#5a4fcf]" />
        </div>

        {/* Infos : numéro destinataire + montant */}
        <div className="bg-[#f0eeff] rounded-2xl px-4 py-4 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-[9px] 2xl:text-[14px] font-bold text-[#5a4fcf] tracking-widest mb-1">Envoyer vers</p>
            <p className="text-sm font-black text-gray-800 font-mono">034 70 840 46</p>
          </div>
          <div className="border-t border-[#d6cfff] pt-3">
            <p className="text-[9px] 2xl:text-[14px] font-bold text-[#5a4fcf] tracking-widest mb-1">Montant à payer</p>
            <p className="text-lg font-black text-gray-900">
              {formation.frais?.toLocaleString()}
              <span className="text-xs text-gray-400 ml-1">Ar</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Colonne droite : champs numéro + référence ── */}
      <div className="flex-1 flex flex-col justify-between">
        <form onSubmit={handleInscriptionSubmit} className="flex flex-col gap-3 h-full">
          <div>
            <label className="block text-[9px] 2xl:text-[14px] text-gray-400 mb-1">
              Votre numéro
            </label>
            <input
              type="text"
              placeholder="03X XX XXX XX"
              required
              className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-[#5a4fcf]/10 focus:border-[#5a4fcf] outline-none"
              onChange={(e) => setPaymentData({ ...paymentData, numero_paiement: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[9px] 2xl:text-[14px] text-gray-400 mb-1">
              Référence
            </label>
            <input
              type="text"
              placeholder="Ex: 1234ABCD"
              required
              className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-[#5a4fcf]/10 focus:border-[#5a4fcf] outline-none"
              onChange={(e) => setPaymentData({ ...paymentData, reference_transaction: e.target.value })}
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Boutons */}
          <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
            <button type="button" onClick={() => setStep(2)}
              className="py-3 bg-gray-100 text-gray-500 text-xs 2xl:text-[16px] rounded-xl hover:bg-gray-200 transition-all uppercase tracking-tighter">
              Retour
            </button>
            <button type="submit" disabled={submitting}
              className="py-3 bg-[#5a4fcf] text-white text-xs 2xl:text-[16px] rounded-xl shadow-lg hover:bg-[#493dbb] transition-all disabled:bg-gray-300 uppercase tracking-tighter">
              {submitting ? "Envoi..." : "C o n f i r m e r"}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
)}

          {/* ── Étapes 1 & 2 ── */}
          {(step === 1 || step === 2) && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-700 truncate pr-4">"{formation.titre}"</span>
                <button onClick={onClose} className="text-gray-300 hover:text-gray-500 flex-shrink-0"><X size={18} /></button>
              </div>

              <Stepper />

              {/* ── Étape 1 : Choix connexion ou inscription ── */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-black text-gray-900 mb-1">Rejoindre la formation</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    {isGratuit
                      ? "Gratuit • Créez un compte ou connectez-vous pour accéder."
                      : `${formation.frais?.toLocaleString()} Ar • Connectez-vous puis finalisez le paiement.`}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => { setTab("login"); setStep(2); setError(""); }}
                      className="w-full py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white rounded-2xl font-bold text-sm transition-all"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={() => { setTab("signup"); setStep(2); setError(""); }}
                      className="w-full py-3 border-2 border-gray-200 hover:border-[#5a4fcf] text-gray-700 hover:text-[#5a4fcf] rounded-2xl font-bold text-sm transition-all"
                    >
                      Créer un compte
                    </button>
                  </div>
                </div>
              )}

              {/* ── Étape 2 : Formulaire auth ── */}
              {step === 2 && (
                <div>
                  <div className="flex border-b border-gray-100 mb-5">
                    {(["login", "signup"] as const).map((t) => (
                      <button key={t} onClick={() => { setTab(t); setError(""); }}
                        className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors
                          ${tab === t ? "border-[#5a4fcf] text-[#5a4fcf]" : "border-transparent text-gray-400"}`}>
                        {t === "login" ? "Connexion" : "Inscription"}
                      </button>
                    ))}
                  </div>

                  {tab === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-3">
                      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf] focus:ring-2 focus:ring-[#5a4fcf]/10"/>
                      <div className="relative">
                        <input type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={mdp} onChange={e => setMdp(e.target.value)} required
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf] focus:ring-2 focus:ring-[#5a4fcf]/10"/>
                        <button type="button" onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs">
                          {showPwd ? "Cacher" : "Voir"}
                        </button>
                      </div>
                      {error && <p className="text-red-500 text-xs">{error}</p>}
                      <button type="submit" disabled={submitting}
                        className="w-full py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white rounded-xl text-sm font-black transition-all disabled:opacity-70 uppercase tracking-wide">
                        {submitting ? "Vérification..." : "Se connecter →"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required
                          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#5a4fcf]"/>
                        <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required
                          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#5a4fcf]"/>
                      </div>
                      <input type="tel" placeholder="Contact (+261...)" value={contact} onChange={e => setContact(e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf]"/>
                      <input type="email" placeholder="Email" value={email1} onChange={e => setEmail1(e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf]"/>
                      <input type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={mdp1} onChange={e => setMdp1(e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf]"/>
                      <input type="password" placeholder="Confirmer le mot de passe" value={cmdp1} onChange={e => setCmdp1(e.target.value)} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5a4fcf]"/>
                      {error && <p className="text-red-500 text-xs">{error}</p>}
                      <button type="submit" disabled={submitting}
                        className="w-full py-3 bg-[#5a4fcf] hover:bg-[#493dbb] text-white rounded-xl text-sm font-black transition-all disabled:opacity-70 uppercase tracking-wide">
                        {submitting ? "Inscription..." : "S'inscrire →"}
                      </button>
                    </form>
                  )}
                  <button onClick={() => { setStep(1); setError(""); }}
                    className="mt-3 text-xs text-gray-400 hover:text-gray-600">
                    ← Retour
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}