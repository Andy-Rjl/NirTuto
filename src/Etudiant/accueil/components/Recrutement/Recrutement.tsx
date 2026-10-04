import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { UserPlus, CheckCircle } from "lucide-react";
import alb from "./../../assets/Albert.jpg";
import { API_URL } from "./../../../../lib/api";
import { RecruitmentModal } from "./ModalRecrutement";
import { RecruitmentStyles } from "./Recrutement.Style";

export default function Recrutement() {
  const [formateurVisible, setFormateurVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ 
    nom: "", 
    email: "", 
    formation: "Développement", 
    contact: "" 
  });
  const formateurRef = useRef<HTMLDivElement>(null);

  // Nombre de membres formateurs
  const [count, setCount] = useState({ etudiant: 0, formateur: 0, formation: 0 });
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/stats/etudiants-count`)
      .then(res => res.json())
      .then(data => setCount({
        etudiant: data.total || 0,
        formateur: data.total_formateur || 0,
        formation: data.total_formation || 0,
      }))
      .catch(err => console.error("Erreur stats", err));

    fetch(`${API_URL}/front-office/recrutement`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Erreur config", err));
    },[]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFormateurVisible(true); }, 
      { threshold: 0.1 }
    );
    if (formateurRef.current) observer.observe(formateurRef.current);
    return () => observer.disconnect();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, val]) => dataToSend.append(key, val));
    if (file) dataToSend.append("cv", file);

    try {
      const res = await fetch(`${API_URL}/postuler-formateur`, { 
        method: "POST", 
        body: dataToSend 
      });
      if (res.ok) { 
        setIsModalOpen(false); 
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <>
      <style>{RecruitmentStyles}</style>
      <section 
        id="recrutement"
        ref={formateurRef} 
        className="recr-root relative overflow-hidden py-20 bg-gradient-to-br from-[#eef0ff] via-[#c7caff] to-[#5457d4]"
      >
        {/* Décoration d'arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="w-full mx-auto px-5 relative z-10 flex flex-col md:flex-row items-center gap-16">
          
          {/* GAUCHE — Texte & CTA (Modifié pour tout centrer) */}
          <div className={`w-full md:w-1/2 flex flex-col items-center text-center transition-all duration-700 ${formateurVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            
            <p className="text-indigo-700 text-xs font-semibold tracking-widest mb-3 uppercase">
              Rejoignez Nir'Info
            </p>
            
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-[#1a1a2e]">
              {config?.cta_title}
            </h2>
            
            <p className="text-gray-600 mb-10 text-lg">
              {config?.cta_desc}
            </p>

            {/* BOUTON CENTRÉ */}
            <div className="flex justify-center">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="group relative flex items-center p-1.5 pr-8 bg-white border-2 border-[#5457d4] rounded-full transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <div className="w-8 h-8 bg-[#5457d4] rounded-full flex items-center justify-center text-white mr-4 transition-transform group-hover:rotate-12">
                  <UserPlus size={22} strokeWidth={2.5} />
                </div>
                <span className="text-[#1a1a2e] font-bold text-base whitespace-nowrap">
                  Postuler ici
                </span>
              </button>
            </div>
          </div>

          {/* DROITE — Image & Badge */}
          <div className={`hidden md:block w-1/2 transition-all duration-1000 delay-300 ${formateurVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <div className="relative">
              <div className="recr-img-frame w-full h-80 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/50">
                <img src={alb} alt="Formateur" className="w-full h-full object-cover" />
              </div>

              {/* Badge flottant dynamique */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-indigo-50 animate-bounce-slow">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-[#5457d4]" size={20} />
                </div>
                {[{end: count.formateur}].map((stat, idx) => (
                <div key={idx}>
                  <p className="text-sm font-bold text-[#1a1a2e]">{stat.end} membres</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Formateurs actifs</p>
                </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <RecruitmentModal 
            formData={formData} 
            setFormData={setFormData} 
            file={file} 
            setFile={setFile} 
            handleSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}