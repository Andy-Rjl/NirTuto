import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, CheckCircle2, FileCheck, Briefcase, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import ImgCert from './../../assets/you welcome.jpg';
import bg from '../../../assets/images/certificate.png';
import { API_URL } from '../../../../lib/api';
import NavbarAcc from '../../components/NavbarAcc';
import logo from "./../../assets/logo-nir-info.png";

const PageCertifs: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/front-office/certification`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Erreur config", err));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const steps = [
    { icon: GraduationCap, title: "Apprentissage", desc: "Suivez l'intégralité des modules et validez les quiz de fin de section." },
    { icon: FileCheck, title: "Projet ", desc: "Réalisez un projet de synthèse comme stage en ligne évalué par nos mentors." },
    { icon: Award, title: "Certification", desc: "Recevez votre certificat numérique unique avec un lien de vérification." },
  ];

  return (
    <div id="certifications" className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
     {/* header */}
     <NavbarAcc />
    <header className="mt-[95px] relative overflow-hidden h-[400px]">
      {/* L'image sert de fond absolu unique, sans opacité réduite */}
      <img 
        src={ImgCert}
        alt="Background" 
        className="absolute w-full h-[400px] pointer-events-none"
      />
      
      {/* Contenu du header (avec z-10 pour passer au-dessus de l'image) */}
      <div className="w-full mx-auto px-6 pt-6 relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors font-bold text-xl"
        >
          <ArrowLeft size={25} />Retour
        </button>
        
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Bloc gauche */}
          <div className="w-full text-center flex-1">
            <h1 className="text-4xl md:text-6xl font-black text-sate-800 leading-[1.1] mb-6">
              Validez vos <span className="text-indigo-500">Compétences.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto font-medium">
              Chaque parcours réussi chez Tuto Info est couronné par une certification conçue pour propulser votre carrière.
            </p>
          </div>

          {/* Bloc droite */}
          <motion.div 
            initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center p-10 bg-slate-800/80 backdrop-blur-md rounded-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-700 shrink-0"
          >
            <Award size={140} className="text-indigo-400" strokeWidth={1.2} />
          </motion.div>
        </div>
      </div>
    </header>

      {/* processus  */}
      <section className="w-full mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">Le parcours de réussite</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-slate-200 -z-0" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative z-10 bg-slate-50 px-6 text-center"
            >
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)]">
                <step.icon size={30} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-950">{step.title}</h3>
              <p className="text-slate-600 text-base leading-relaxed max-w-sm mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* section */}
      <section className="bg-slate-950 py-24 md:py-32 px-6">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Un atout majeur pour votre <br/> <span className="text-indigo-400">LinkedIn.</span></h2>
            <ul className="space-y-8">
              {[
                { t: "Partage en un clic", d: "Intégrez facilement votre succès sur votre profil LinkedIn et votre CV." },
                { t: "Standard Industrie", d: "Nos certifications respectent les critères d'exigence du marché Tech." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <CheckCircle2 className="text-indigo-400 shrink-0 mt-1.5" size={24} strokeWidth={2.5}/>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.t}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-md">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Maquette Certificat  */}
          <motion.div 
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-xl shadow-[0_48px_96px_-24px_rgba(0,0,0,0.5)] relative overflow-hidden border border-slate-100 aspect-[1.414/1] w-full max-w-xl mx-auto"
            style={{backgroundImage: `url(${bg})`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`}}
          >
            <div className="relative z-10 p-10 md:p-12 h-full flex flex-col items-center justify-between text-[#1a1a1a]" >
              <div className="w-full flex justify-center">
                <div className="border border-slate-900 rounded p-1.5 flex items-center justify-center gap-2">
                  <span className="text-sm font-black tracking-tight pt-px">Nir'<span className="text-blue-600">Info</span></span>
                  <div className="w-2.5 h-3.5 bg-amber-400 rounded-full border border-slate-900" />
                </div>
              </div>

              <div className="text-center py-4">
                <h3 className="text-2xl font-serif text-slate-900 uppercase tracking-tight">Certificat</h3>
                <p className='text-sm mb-4 -mt-2'>DE REUSSITE</p>
                <div className="text-xs md:text-sm space-y-1.5 leading-relaxed text-slate-700 max-w-lg mx-auto">
                  <div 
                      className="custom-editor"
                      dangerouslySetInnerHTML={{ __html: config?.texte }}
                  />
                </div>
              </div>

              <div className="w-full flex justify-between items-end gap-4">
                <div className="text-center border-b border-slate-900 pt-6 pb-2 mb-4">
                  <p className="text-[10px] italic text-slate-900">L'impetrant(e)</p>
                </div>
                <div className="text-xs text-slate-700 font-semibold tracking-wide "><p className='border-b border-slate-900 pb-2'>Le Directeur</p><span>MAMINIRINA Miharisoa</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-24 md:py-32 text-center bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <Briefcase className="mx-auto text-indigo-100 mb-6" size={64} strokeWidth={1} />
          <h2 className="text-3xl font-black mb-5 text-slate-950">Prêt à obtenir le vôtre ?</h2>
          <p className="text-slate-600 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">Rejoignez des milliers d'apprenants qui ont déjà transformé leur vie professionnelle.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-10 py-4 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all active:scale-95"
          >
            Démarrer ma formation
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PageCertifs;