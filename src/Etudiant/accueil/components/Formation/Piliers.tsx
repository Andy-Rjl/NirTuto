import { useLocation, useNavigate } from "react-router-dom";
import { Rocket, GraduationCap, Users, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL } from "./../../../../lib/api";
import studentImg from "./../../assets/aire.jpg";

const Piliers = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<any>(null);
  const [count, setCount] = useState({ etudiant: 0, formateur: 0, formation: 0 });
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_URL}/stats/etudiants-count`)
      .then(res => res.json())
      .then(data => setCount({
        etudiant: data.total || 0,
        formateur: data.total_formateur || 0,
        formation: data.total_formation || 0,
      }))
      .catch(err => console.error("Erreur stats", err));

    fetch(`${API_URL}/front-office/pilier`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Erreur config", err));
  }, [location.pathname]);

  const pillars = [
    {
      id: 1,
      icon: Rocket,
      title: config?.titre1 || "Les Réels",
      slug: "projets",
      description: config?.desc1 || "Accès à 120 formations de qualité",
      color: "#3b5bdb",
      lightColor: "#e8eeff",
    },
    {
      id: 2,
      icon: Users,
      title: config?.titre2 || "Mentors Experts",
      slug: "mentors",
      description: config?.desc2 || "Sujets populaires adaptés à votre niveau",
      color: "#7950f2",
      lightColor: "#f0ebff",
    },
    {
      id: 3,
      icon: GraduationCap,
      title: config?.titre3 || "Certifications",
      slug: "certifications",
      description: config?.desc3 || "Trouvez le formateur idéal pour vous",
      color: "#e67700",
      lightColor: "#fff4e6",
    },
  ];

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      

      <div className="w-full px-4 sm:px-6 md:px-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 leading-tight px-2"
            style={{ color: "#1a1d3d", fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}
          >
            {config?.title || "Nos 3 Piliers d'Excellence"}
          </h2>
          {config?.subtitle && (
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* partie */}
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-14">

          {/* colonne gauche */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-[260px] sm:max-w-sm lg:max-w-md">
              <div
                className="absolute -inset-3 sm:-inset-5 lg:-inset-6 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] -rotate-3 opacity-30"
                style={{ background: "linear-gradient(135deg, #748ffc, #b197fc, #ffa94d)" }}
              />
              <div
                className="relative rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden"
                style={{ boxShadow: "0 24px 60px rgba(59,91,219,0.18)" }}
              >
                <img
                  src={studentImg}
                  alt="Étudiante"
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "500px", objectPosition: "top" }}
                />
                <div
                  className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 lg:bottom-5 lg:left-5 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8eeff" }}>
                    <GraduationCap size={14} className="sm:hidden" style={{ color: "#3b5bdb" }} />
                    <GraduationCap size={20} className="hidden sm:block" style={{ color: "#3b5bdb" }} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-black font-medium whitespace-nowrap"><span className="font-black">{count.etudiant}</span> Apprenants</p>
                    <p className="text-sm font-black" style={{ color: "#1a1d3d" }}>  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*colonne droite */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 sm:gap-7 lg:gap-8 text-left">
            <div>
              <h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-3 sm:mb-4"
                style={{ color: "#1a1d3d", fontFamily: "'Poppins', sans-serif" }}
              >
                Nous offrons une approche<br />
                <span style={{ color: "#3b5bdb" }}>nouvelle de l'apprentissage</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Choisissez parmi une large gamme d'options d'apprentissage et acquérez de nouvelles compétences grâce à nos experts en activité.
              </p>
            </div>

            {/* 3 Piliers  */}
            <ul className="flex flex-col gap-4 sm:gap-5">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.id} className="flex items-start gap-3 sm:gap-4">
                    <div
                      className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mt-0.5"
                      style={{ background: p.lightColor }}
                    >
                      <Icon size={16} className="sm:hidden" style={{ color: p.color }} />
                      <Icon size={18} className="hidden sm:block" style={{ color: p.color }} />
                    </div>
                    <div>
                      <p className="font-black text-xs sm:text-sm uppercase tracking-wide mb-0.5" style={{ color: "#1a1d3d", fontFamily: "'Poppins', sans-serif" }}>
                        {p.title}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm leading-snug">{p.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Bouton */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-2">
              {pillars.map(p => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/formations/${p.slug}`)}
                    className="group flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
                    style={{
                      background: p.color,
                      color: "#fff",
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: `0 4px 16px ${p.color}44`,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${p.color}66`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${p.color}44`;
                    }}
                  >
                    <Icon size={16} />
                    {p.title}
                    <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Piliers;