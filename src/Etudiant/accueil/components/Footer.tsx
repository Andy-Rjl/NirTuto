import { useState, useEffect } from "react";
import message from "./../assets/message.jpg";
import facebookPage from "./../assets/TUTOFB.png";
import logoMvola from './../../assets/images/mvola.jpg';
import { Facebook, Linkedin, Twitter, Youtube,
         Mail, Phone, MapPin, Users, ChevronRight, X,
      } from "lucide-react";
import { API_URL } from "./../../../lib/api";

// Facebook Banner 
function FacebookBanner() {
  return (
    <a
      href="https://www.facebook.com/Niry.info"
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full overflow-hidden relative cursor-pointer"
      style={{ background: '#0d1b2a' }}
    >
     
      <div className="flex items-center justify-between gap-4 px-6 py-3" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #152535 100%)', borderTop: '1px solid rgba(24,119,242,0.3)' }}>
       <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-3" style={{ color: '#00c9b1' }}>
            <span className="w-8 h-px inline-block" />
            Nous suivre
          </h4>
        <div className="flex items-center gap-3">
          <Facebook size={15} style={{ color: '#1877f2' }} />
          <span className="text-white font-semibold text-xs">Tuto-Info.com</span>
          <span className="flex items-center gap-1 text-xs" style={{ color: '#8a9baa' }}>
            <Users size={11} style={{ color: '#00c9b1' }} />
            6 K followers
          </span>
        </div>
        <span className="text-xs font-medium transition-colors group-hover:text-white" style={{ color: '#1877f2' }}>
          Cliquez pour visiter →
        </span>
      </div>
    </a>
  );
}

// Footer 
export default function Footer() {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [config, setConfig] = useState<any>(null);

  useEffect(() => { setYear(new Date().getFullYear()); }, []);
  useEffect(() => {
    fetch(`${API_URL}/front-office/contact`)
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Erreur de chargement", err));
  }, []);

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/Niry.info", color: '#1877f2', label: 'Facebook' },
    { icon: Linkedin, href: "https://www.linkedin.com/company/nir-info/", color: '#0a66c2', label: 'LinkedIn' },
    { icon: Twitter, href: "#", color: '#1da1f2', label: 'Twitter' },
    { icon: Youtube, href: "https://www.youtube.com/@niryinfo9800", color: '#ff0000', label: 'YouTube' },
  ];

  const formations = [
    { label: "Toutes les formations", href: "/voir-toutes-formations" },
    { label: "Formations gratuites", href: "#gratuit" },
    { label: "Formations certifiantes", href: "#payant" },
    { label: "Thematiques", href: "#form?type=pro" },
    { label: "Devenir formateur", href: "#apropos" },
  ];

  const entreprise = [
    { label: "À propos", href: "#apropos" },
    { label: "Piliers", href: "#apropos" },
    { label: "Communauté", href: "#apropos?section=postuler" },
    { label: "Réels", href: "#apropos?section=temoignage" },
    { label: "Certification", href: "#contact" },
    { label: "Apprentissage", href: "#contact" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <footer id="contact" style={{ backgroundColor: '#080f17', color: '#fff', fontFamily: 'sans-serif' }}>
      
        <FacebookBanner />

        <div className="w-full mx-auto px-6 pt-14 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            {/* COL 1 — Brand */}
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#00c9b1' }}>NIR-INFO</span>
                <h3 className="text-xl flex flex-col items-start font-extrabold text-white leading-tight tracking-tight">
                  Plateforme de
                  <span style={{ color: '#00c9b1' }}>Formation Digitale</span>
                </h3>
              </div>
              <div>
                <p className="text-xs leading-relaxed flex items-start" style={{ color: '#8a9baa' }}>
                  Apprenez les métiers du numérique avec des experts passionnés.
                </p>
                <p className="text-xs leading-relaxed flex items-start" style={{ color: '#8a9baa' }}>
                  Formations en ligne, certifiantes et accessibles à tous.
                </p>
              </div>
              <ul className="space-y-2.5 flex flex-col items-start">
                {config?.adresse && (
                  <li className="flex items-start gap-2.5 text-xs" style={{ color: '#8a9baa' }}>
                    <MapPin size={13} className="mt-0.5 shrink-0" style={{ color: '#00c9b1' }} />
                    {config.adresse}
                  </li>
                )}
                {config?.telephone && (
                  <li>
                    <a href={`tel:${config.telephone}`} className="flex items-center gap-2.5 text-xs transition-colors hover:text-white" style={{ color: '#8a9baa' }}>
                      <Phone size={13} style={{ color: '#00c9b1' }} />
                      {config.telephone}
                    </a>
                  </li>
                )}
                {config?.email && (
                  <li>
                    <a href={`mailto:${config.email}`} className="flex items-center gap-2.5 text-xs transition-colors hover:text-white" style={{ color: '#8a9baa' }}>
                      <Mail size={13} style={{ color: '#00c9b1' }} />
                      {config.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* COL 2 — Formations + entreprise + Paiement déplacé ici */}
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 space-x-4">
                <div className="flex items-start flex-col w-52">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: '#00c9b1' }}>
                    <span className="w-2 h-px inline-block"  />
                    Formations
                  </h4>
                  <ul className="space-y-4">
                    {formations.map((item, i) => (
                      <li key={i}>
                        <a href={item.href} className="group flex items-start gap-1.5 text-xs transition-colors hover:text-white" style={{ color: '#8a9baa' }}>
                          <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" style={{ color: '#00c9b1' }} />
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: '#00c9b1' }}>
                    <span className="w-2 h-px inline-block"  />
                    Entreprise
                  </h4>
                  <ul className="space-y-2.5">
                    {entreprise.map((item, i) => (
                      <li key={i}>
                        <a href={item.href} className="group flex items-start gap-1.5 text-xs transition-colors hover:text-white" style={{ color: '#8a9baa' }}>
                          <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" style={{ color: '#00c9b1' }} />
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Paiement */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#00c9b1' }}>
                    Paiement accepté
                  </h4>
                  <div className="flex gap-2">
                    {[ { name: 'MVola', src: logoMvola } ].map((method, i) => (
                      <div key={i} className="flex items-center justify-center p-4 rounded-lg" >
                        <img src={method.src} alt={method.name} className="h-10 w-auto object-contain opacity-80" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* COL 3 — LA CARTE Google Maps */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: '#00c9b1' }}>
                    <span className="w-2 h-px inline-block"  />
                    Localisation
                  </h4>
                  <div className="w-full 2xl:w-[200px] rounded-2xl overflow-hidden border border-white/5 h-[200px]">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1834.6279693623478!2d47.51482535201216!3d-18.912120994328852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07fba0ca8b907%3A0xb6dec0eb83cad72f!2sMadplus%20Company!5e0!3m2!1sfr!2smg!4v1777294921508!5m2!1sfr!2smg" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            {/* COL 4 — Contactez-nous */}
            <div className="flex flex-col gap-8 mt-5 lg:ml-24">
              {/* Bloc "Contactez-nous"  */}
              <div className="rounded-xl p-12" style={{ background: 'linear-gradient(135deg, #0d2233 0%, #0f2840 100%)', border: '1px solid rgba(0,201,177,0.15)' }}>
                <h4 className="text-xs font-bold text-white mb-2">Votre question</h4>
                <button onClick={() => setOpen(true)} className="w-full flex items-center justify-center gap-2 text-[10px] font-bold py-2 rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#00c9b1', color: '#080f17' }}>
                  <Mail size={11} /> Écrivez-nous
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col items-center justify-between gap-6">
            <div className="flex items-center gap-6 order-1 md:order-2">
              {socialLinks.map(({ icon: Icon, href, color, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-all duration-300 hover:scale-125"
                  style={{ color: '#8a9baa' }}
                  onMouseEnter={e => (e.currentTarget.style.color = color)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#8a9baa')}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-xs order-2 md:order-1" style={{ color: '#8a9baa' }}>
              © {year} <span className="font-bold text-white">NIR-INFO</span>. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {open && <MessageModal onClose={() => setOpen(false)} />}
    </>
  );
}

// Modal 
function MessageModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Une erreur est survenue");
      setStatus({ type: 'success', msg: 'Votre message a été envoyé avec succès !' });
      setFormData({ email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', msg: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-auto max-h-[90vh] rounded-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 flex">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-teal-600 p-2 z-20 bg-white/80 hover:bg-white rounded-full border border-gray-100 transition-all">
          <X size={24} />
        </button>

        <div className="hidden lg:block lg:w-1/2 relative group">
          <div className="absolute inset-0 bg-teal-600/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <img src={message} alt="Contactez-nous" className="object-cover h-full w-full transform group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute bottom-10 left-10 z-20 text-white">
            <h3 className="text-2xl font-semibold">Toujours à votre écoute.</h3>
            <p className="text-white/80 text-sm">Réponse moyenne en moins de 2h.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-gray-50/30">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Parlons-nous</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Remplissez ce formulaire et un expert vous recontactera.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Votre adresse e-mail</label>
                <input
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nom@exemple.com"
                  className="w-full border-b-2 border-gray-200 focus:border-teal-500 outline-none text-sm text-gray-800 py-2 bg-transparent transition-colors placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-teal-600 uppercase tracking-widest mb-1">Détail de votre demande</label>
                <textarea
                  required rows={3} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez votre besoin..."
                  className="w-full border-b-2 border-gray-200 focus:border-teal-500 outline-none text-sm text-gray-800 py-2 bg-transparent transition-colors resize-none placeholder:text-gray-300"
                />
              </div>

              {status && (
                <div className={`text-sm px-3 py-2 rounded-lg ${status.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {status.msg}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}