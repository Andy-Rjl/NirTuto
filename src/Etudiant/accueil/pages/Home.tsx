import NavbarAcc from "../components/NavbarAcc";
import HeroAcc from "../pages/HeroAcc";
import Footer from "../components/Footer";
import Apropos from "./Apropos/Apropos";
import Formations from "../components/Formations"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

useEffect(() => {
  // Si l'URL contient une ancre (ex: #catalogue)
  if (location.hash) {
    const id = location.hash.replace("#", "");
    const element = document.getElementById(id);
    
    if (element) {
      // Un léger timeout pour laisser le temps au DOM de s'afficher complètement
      setTimeout(() => {
        element.scrollIntoView({ behavior: "auto" }); // "auto" pour respecter ton choix de scroll instantané
      }, 100);
    }
  }
}, [location]);
  return (
    <div className="w-full" key={location.key}>
      <NavbarAcc />
      <HeroAcc setSearchTerm={setSearchTerm} />
      <Formations
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Apropos />
      <Footer />
    </div>
  );
};

export default Home;
