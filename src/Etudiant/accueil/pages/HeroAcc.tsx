import React, { useEffect, useState } from "react";
import { 
  GraduationCap, Users, 
  ArrowUp, BookOpen,Award,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "./../../../lib/api";

//  COMPOSANT COUNTER 
const Counter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <span>{count.toLocaleString()}</span>;
};

//  COMPOSANT HERO PRINCIPAL 
const HeroAcc: React.FC<{ setSearchTerm: (v: string) => void }> = ({ setSearchTerm }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [count, setCount] = useState({ etudiant: 0, formateur: 0, formation: 0 });
  const [config, setConfig] = useState<any>(null);
  const [heroSearch, setHeroSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dans HeroAcc.tsx
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    try {
      const resStats = await fetch(`${API_URL}/stats/etudiants-count`);
      const dataStats = await resStats.json();
      if (isMounted) {
        setCount({
          etudiant: dataStats.total || 0,
          formateur: dataStats.total_formateur || 0,
          formation: dataStats.total_formation || 0,
        });
      }

      const resConfig = await fetch(`${API_URL}/front-office/accueil`);
      const dataConfig = await resConfig.json();
      if (isMounted) setConfig(dataConfig);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  fetchData();

  return () => {
    isMounted = false; // Bloque les mises à jour si le composant se démonte brutalement
  };
}, []); // <-- Remets impérativement un tableau vide ici pour stopper la boucle infinie !
  
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchTerm(heroSearch); // ← met à jour le state AVANT le scroll
      
      setTimeout(() => {
        const section = document.getElementById('catalogue');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50); // délai réduit, pas besoin de navigate
    }
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen overflow-hidden font-sans">
      
      <style>{`
        .btn-gradient-play {
          background: linear-gradient(90deg, #ec4899 0%, #f97316 100%);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
          transition: all 0.3s ease;
        }
        .btn-gradient-play:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
          filter: brightness(1.1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* BOUTON RETOUR EN HAUT  */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 p-2.5 sm:p-3 rounded-full shadow-2xl transition-all duration-500 ${
          showBackToTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-0 pointer-events-none"
        }`}
        style={{ backgroundColor: '#7c3aed', color: '#fff' }}
      >
        <ArrowUp size={18} className="sm:hidden" />
        <ArrowUp size={20} className="hidden sm:block" />
      </button>

      {/* SECTION ACCUEIL */}
      <section id="accueil" className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">

        {/* GRILLE DE CONTENU  */}
        <div className="relative z-10 mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 pt-24 pb-48 sm:pb-44 md:pb-40 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center overflow-visible">
          
          {/* COLONNE GAUCHE  */}
          <div className="flex flex-col items-start text-left space-y-5 sm:space-y-7 lg:space-y-8 z-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-7xl font-extrabold leading-[1.15] sm:leading-[1.1]" style={{ color: '#1e1b4b' }}>
              {config?.titre || "La plateforme de cours en ligne"} <br />
              <span className="bg-gradient-to-r  bg-clip-text text-transparent italic" style={{ color: '#1e1b4b' }}>
                {config?.sous_titre || "qui booste vos compétences"}
              </span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-lg 2xl:text-xl leading-relaxed">
              {config?.slogan || "Apprenez les métiers du futur avec une plateforme conçue pour votre réussite numérique."}
            </p>

            <div className="w-full max-w-md 2xl:max-w-lg">
              <form onSubmit={handleHeroSearch} className="flex items-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg">
                <div className="group relative flex items-center justify-center w-10 sm:w-12 2xl:w-16 h-10 sm:h-12 2xl:h-16 shrink-0 border-r border-gray-100 ml-1">
                  <span className="absolute inset-1 rounded-full border border-yellow-800 animate-ping opacity-30" />
                  <span className="relative flex items-center justify-center w-7 sm:w-8 2xl:w-12 h-7 sm:h-8 2xl:h-12 rounded-full bg-indigo-50 border-2 border-yellow-400">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 2xl:w-10 2xl:h-10 fill-black-600 ml-0.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Que souhaitez-vous apprendre ?"
                  className="flex-1 min-w-0 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-xs sm:text-sm px-2 sm:px-4 py-2.5 sm:py-3"
                />
                <button
                  type="submit"
                  className="mr-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm 2xl:text-xl font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  Rechercher
                </button>
              </form>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="relative h-full w-full hidden lg:flex items-center justify-center overflow-visible">
            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
              <img 
                src={!config?.image_path ? "https://via.placeholder.com/400x600?text=Formation" : `${API_URL.replace("/api","")}/storage/${config.image_path}`} 
                alt="Illustration de fond" 
                className="object-contain z-10 "
                style={{
                  width: 'clamp(420px, 55vw, 820px)',
                  height: 'clamp(520px, 70vw, 980px)',
                  maxHeight: '90vh',
                  transform: 'translateY(8%) translateX(6%)',
                }}
              />
              <div className="absolute right-0 bottom-0 w-[80%] h-[80%] bg-white/20 blur-3xl rounded-full -z-10" />
            </div>
          </div>
        </div>

        {/* STATISTIQUES  */}
        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-0 lg:left-1/2 lg:-translate-x-1/2 z-30 w-full px-3 sm:px-5 lg:px-6">
          {/* Mobile / tablette : grille 2 colonnes compacte, tout visible sans coupure */}
          <div className="grid grid-cols-2 sm:hidden gap-2 max-w-md mx-auto">
            {[
              { label: "Inscrits",         value: count.etudiant,  pre: "+", suf: "",  icon: Users,        iBg: "#ede9fe", iClr: "#7c3aed" },
              { label: "Ans d'expérience", value: 10,              pre: "+", suf: "",  icon: BookOpen,     iBg: "#d1fae5", iClr: "#059669" },
              { label: "Formations",       value: count.formation, pre: "+", suf: "",  icon: GraduationCap,iBg: "#dbeafe", iClr: "#2563eb" },
              { label: "Instructeur",      value: count.formateur, pre: "+",  suf: "", icon: Users,        iBg: "#fef9c3", iClr: "#d97706" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="stat-card flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/90 backdrop-blur-md"
                style={{
                  boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                  border: '1px solid rgba(255,255,255,0.85)',
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: stat.iBg }}
                >
                  <stat.icon size={13} style={{ color: stat.iClr }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-gray-900 text-[13px] font-black leading-tight truncate">
                    {stat.pre}<Counter end={Number(stat.value)} />{stat.suf}
                  </p>
                  <p className="text-gray-700 text-[9px] font-medium mt-0.5 leading-none truncate">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
            {/* Carte Satisfaction : même taille que les autres, centrée seule sur sa ligne */}
            <div className="col-span-2 flex justify-center">
              <div
                className="stat-card flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/90 backdrop-blur-md w-1/2"
                style={{
                  boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                  border: '1px solid rgba(255,255,255,0.85)',
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: "#fce7f3" }}
                >
                  <Award size={13} style={{ color: "#db2777" }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-gray-900 text-[13px] font-black leading-tight truncate">
                    <Counter end={100} />%
                  </p>
                  <p className="text-gray-700 text-[9px] font-medium mt-0.5 leading-none truncate">
                    Satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tablette et plus : ligne scrollable horizontale */}
          <div className="hidden sm:flex flex-row gap-3 overflow-x-auto no-scrollbar max-w-9xl justify-center pb-1">
            {[
              { label: "Inscrits",         value: count.etudiant,  pre: "+", suf: "",  icon: Users,        iBg: "#ede9fe", iClr: "#7c3aed" },
              { label: "Ans d'expérience", value: 10,              pre: "+", suf: "",  icon: BookOpen,     iBg: "#d1fae5", iClr: "#059669" },
              { label: "Formations",       value: count.formation, pre: "+", suf: "",  icon: GraduationCap,iBg: "#dbeafe", iClr: "#2563eb" },
              { label: "Instructeur",      value: count.formateur, pre: "+",  suf: "", icon: Users,        iBg: "#fef9c3", iClr: "#d97706" },
              { label: "Satisfaction",     value: 100,             pre: "",  suf: "%", icon: Award,        iBg: "#fce7f3", iClr: "#db2777" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="stat-card flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl bg-white/80 backdrop-blur-md flex-shrink-0 min-w-[150px] sm:min-w-[170px] lg:min-w-[200px] 2xl:min-w-[250px] 3xl:h-[100px]"
                style={{
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  border: '1px solid rgba(255,255,255,0.85)',
                }}
              >
                <div
                  className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: stat.iBg }}
                >
                  <stat.icon size={16} className="sm:hidden" style={{ color: stat.iClr }} />
                  <stat.icon size={18} className="hidden sm:block" style={{ color: stat.iClr }} />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-900 text-sm sm:text-base font-black leading-tight">
                    {stat.pre}<Counter end={Number(stat.value)} />{stat.suf}
                  </p>
                  <p className="text-gray-900 text-[10px] sm:text-[11px] font-medium mt-0.5 leading-none whitespace-nowrap">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default HeroAcc;