import { useState } from "react";
import { Menu, X, UserPlus } from "lucide-react";
import logo from "../assets/logonirtuto.png"; 
import { useNavigate } from "react-router-dom";
import Inscription from "../../screen/inscription/Inscription";

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

// Scroll instantané vers la section (sans animation)
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const prev = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  el.scrollIntoView();
  document.documentElement.style.scrollBehavior = prev;
};

// NAVBAR 
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showEnroll, setShowEnroll] = useState(false);
  const [formation] = useState<Formation | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction centrale pour gérer le clic sur mobile et desktop
  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Bloque le comportement href par défaut
    if (window.location.pathname !== '/') {
      // Si on est sur une autre page, on navigue vers l'accueil + l'ancre
      navigate(`/#${id}`);
    } else {
      // Si on est déjà sur l'accueil, on scroll immédiatement
      scrollToSection(id);
    }
    setOpen(false); // Ferme le menu mobile si ouvert
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b-2 border-gray-100 shadow-md font-sans">
      
      <div className="w-full mx-auto px-8 h-[95px] flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center shrink-0">
          <img src={logo} alt="logo nir'info" className="object-contain h-[52px] w-auto" />
        </div>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-2 h-full">
           <NavLinks handleNavClick={handleNavClick} />
        </nav>

        {/* AUTH / ACTIONS */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigate('/connexion')} 
              className="text-[16px] font-bold text-gray-800 hover:text-black transition-colors px-2 py-1"
            >
              Se connecter
            </button>
            
            <button 
              onClick={() => setShowEnroll(true)} 
              className="flex items-center gap-2 px-8 py-3.5 bg-[#0FB184] hover:bg-[#0da077] text-white text-[16px] font-extrabold rounded-full transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-200"
            >
              <UserPlus size={18} strokeWidth={2.5} />
              S'inscrire
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

      </div>

      {/* MODIFICATION ICI : On s'assure que 'formation' n'est pas null avant d'afficher la modal */}
      {showEnroll && (
        <Inscription
          formation={
            formation 
              ? { id: formation.id, titre: formation.titre, frais: formation.frais, type: formation.type, nom_formateur: formation.nom_formateur}
              : { id: 0, titre: "Inscription générale", frais: null, type: "standard", nom_formateur: "" } // Valeurs par défaut si nul
          }
          onClose={() => setShowEnroll(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {/* NAVIGATION MOBILE */}
      {open && (
         <div className="md:hidden bg-white border-t-2 border-gray-100 p-8 flex flex-col gap-5 shadow-2xl">
            <a href="#accueil" onClick={(e) => handleNavClick(e, "accueil")} className="text-[18px] font-bold text-gray-800 hover:text-black py-1">Accueil</a>
            <a href="#catalogue" onClick={(e) => handleNavClick(e, "catalogue")} className="text-[18px] font-bold text-gray-800 hover:text-black py-1">Formations</a>
            <a href="#apropos" onClick={(e) => handleNavClick(e, "apropos")} className="text-[18px] font-bold text-gray-800 hover:text-black py-1">Blog</a>
            <a href="#recrutement" onClick={(e) => handleNavClick(e, "recrutement")} className="text-[18px] font-bold text-gray-800 hover:text-black py-1">Recrutement</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="text-[18px] font-bold text-gray-800 hover:text-black py-1">Contact</a>
            
            <div className="border-t-2 border-gray-100 pt-6 mt-2 flex flex-col gap-4">
              <button 
                onClick={() => { navigate('/connexion'); setOpen(false); }} 
                className="w-full py-3.5 text-center text-[17px] font-bold text-gray-800 border-2 border-gray-200 rounded-full hover:bg-gray-50"
              >
                Connexion
              </button>
              <button 
                onClick={() => { navigate('/connexion'); setOpen(false); }} 
                className="w-full py-3.5 text-center text-[17px] font-extrabold text-white bg-[#0FB184] rounded-full shadow-md"
              >
                GO !
              </button>
            </div>
         </div>
      )}
    </header>
  );
};

// Typage des propriétés pour NavLinks
interface NavLinksProps {
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const NavLinks = ({ handleNavClick }: NavLinksProps) => (
  <>
    <a href="#accueil" onClick={(e) => handleNavClick(e, "accueil")} className="flex items-center px-4 py-2 text-[16px] font-bold text-gray-700 hover:text-black rounded-full transition-colors">Accueil</a>
    <a href="#catalogue" onClick={(e) => handleNavClick(e, "catalogue")} className="flex items-center px-4 py-2 text-[16px] font-bold text-gray-700 hover:text-black rounded-full transition-colors">Formations</a>
    <a href="#apropos" onClick={(e) => handleNavClick(e, "apropos")} className="flex items-center px-4 py-2 text-[16px] font-bold text-gray-700 hover:text-black rounded-full transition-colors">Blog</a>
    <a href="#recrutement" onClick={(e) => handleNavClick(e, "recrutement")} className="flex items-center px-4 py-2 text-[16px] font-bold text-gray-700 hover:text-black rounded-full transition-colors">Recrutement</a>
    <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="flex items-center px-4 py-2 text-[16px] font-bold text-gray-700 hover:text-black rounded-full transition-colors">Contact</a>
  </>
);

export default Navbar;