import { useState, useRef } from "react";
import imgLearn  from "./../../assets/revision.jpg";
import imgMentor from "./../../assets/stud.jpg";
import imgCertif from "./../../assets/marketing.jpg";

interface Slide {
  title: string;
  subtitle: React.ReactNode;
  description: React.ReactNode;
  image: string;
  imageAlt: string;
}

const slides: Slide[] = [
  {
    title: "Notre Vision",
    subtitle: (
      <>
        Accompagner votre{" "}
        <strong className="font-bold text-slate-900">succès</strong> vers{" "}
        <strong className="font-bold text-slate-900">demain</strong>.
      </>
    ),
    description: (
      <>
        Nos formations certifiantes 100 % à distance permettent de vous former
        professionnellement au métier de votre choix sous les conseils avisés
        d'une ou d'un mentor individuel et d'une équipe pédagogique{" "}
        <span className="font-bold text-[#0f4c81]">Chez Nir'Info</span>.
      </>
    ),
    image: imgLearn,
    imageAlt: "Équipe travaillant sur un ordinateur",
  },
  {
    title: "Notre Méthode",
    subtitle: (
      <>
        Un accompagnement{" "}
        <strong className="font-bold text-slate-900">personnalisé</strong> à
        chaque étape.
      </>
    ),
    description: (
      <>
        Un mentor dédié vous suit tout au long de votre parcours, répond à vos
        questions et adapte son rythme au vôtre. Vous n'êtes jamais seul dans
        votre apprentissage{" "}
        <span className="font-bold text-[#0f4c81]">Chez Nir'Info</span>.
      </>
    ),
    image: imgMentor,
    imageAlt: "Mentor accompagnant un apprenant en ligne",
  },
  {
    title: "Nos Certifications",
    subtitle: (
      <>
        Des diplômes{" "}
        <strong className="font-bold text-slate-900">reconnus</strong> pour
        votre{" "}
        <strong className="font-bold text-slate-900">avenir</strong>.
      </>
    ),
    description: (
      <>
        Nos programmes aboutissent à des certifications professionnelles
        reconnues, ouvrant la voie à de nouvelles opportunités de carrière dans
        votre domaine Chez Nir'Info
      </>
    ),
    image: imgCertif,
    imageAlt: "Diplôme et certification professionnelle",
  },
];

/* Icônes SVG inline par slide */
const slideIcons = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>,
];

export default function Bip() {
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [next, setNext]           = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number, dir: "left" | "right" = "left") => {
    if (animating || index === current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDirection(dir);
    setNext(index);
    setAnimating(true);
    timeoutRef.current = setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 420);
  };

  const handleNext = () => goTo((current + 1) % slides.length, "left");
  const handlePrev = () => goTo((current - 1 + slides.length) % slides.length, "right");

  const slide     = slides[current];
  const nextSlide = slides[next];
  const enterFrom = direction === "left" ? "100%" : "-100%";
  const exitTo    = direction === "left" ? "-100%" : "100%";

  return (
    /* ── Fond gris page ── */
    <section className="w-full bg-gray-50 font-sans py-8 sm:py-10 md:py-14 px-3 sm:px-6">

      {/* ── Titre global ── */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0f4c81] tracking-tight">
          Pourquoi Tuto Info ?
        </h1>
        <p className="mt-1 text-slate-500 text-xs sm:text-sm max-w-xl mx-auto px-2">
          Des formations 100 % en ligne, certifiantes et accompagnées par des experts.
        </p>
      </div>

      {/* ── Carrousel ── */}
      <div className="relative max-w-9xl mx-auto flex items-center gap-2 sm:gap-4">

        {/* Bouton PREV */}
        <button
          onClick={handlePrev}
          aria-label="Slide précédent"
          className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow text-gray-400 hover:text-[#0f4c81] hover:border-[#0f4c81] transition-all duration-200"
        >
          <svg width="14" height="14" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 20 20" fill="none">
            <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Zone slide */}
        <div className="flex-1 relative overflow-hidden">

          {/* Slide ACTUEL */}
          <div
            key={`cur-${current}`}
            className="w-full transition-transform duration-[420ms] ease-in-out"
            style={{ transform: animating ? `translateX(${exitTo})` : "translateX(0%)" }}
          >
            <SlideCard slide={slide} icon={slideIcons[current]} />
          </div>

          {/* Slide SUIVANT */}
          {animating && (
            <div
              key={`next-${next}`}
              className="absolute inset-0 w-full"
              style={{ animation: `slideIn 420ms ease-in-out forwards` }}
            >
              <style>{`
                @keyframes slideIn {
                  from { transform: translateX(${enterFrom}); }
                  to   { transform: translateX(0%); }
                }
              `}</style>
              <SlideCard slide={nextSlide} icon={slideIcons[next]} />
            </div>
          )}
        </div>

        {/* Bouton NEXT */}
        <button
          onClick={handleNext}
          aria-label="Slide suivant"
          className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow text-gray-400 hover:text-[#0f4c81] hover:border-[#0f4c81] transition-all duration-200"
        >
          <svg width="14" height="14" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 20 20" fill="none">
            <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Dots pagination ── */}
      <div className="flex justify-center gap-2 mt-5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "left" : "right")}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-7 h-2 bg-[#0f4c81]"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* Carte slide  */
function SlideCard({ slide, icon }: { slide: Slide; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 md:gap-12 w-full px-5 sm:px-10 md:px-16 py-8 sm:py-10 md:py-14 min-h-0 sm:min-h-[420px] md:min-h-[480px]">

      {/* ── TEXTE gauche ── */}
      <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-5 md:gap-6 order-2 sm:order-1">

        {/* Icône verte + Titre */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#22c55e" }}
          >
            {icon}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            {slide.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-left sm:text-base md:text-lg text-slate-500 leading-relaxed">
          {slide.description}
        </p>
      </div>

      {/* ── IMAGE droite — dans le même div, avec coins arrondis ── */}
      <div className="w-full sm:w-[52%] flex-shrink-0 order-1 sm:order-2">
        <img
          src={slide.image}
          alt={slide.imageAlt}
          className="w-full object-cover object-center rounded-xl sm:rounded-2xl h-44 sm:h-64 md:h-80 lg:h-[440px]"
        />
      </div>
    </div>
  );
}