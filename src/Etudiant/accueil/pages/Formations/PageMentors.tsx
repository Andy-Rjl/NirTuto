import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// Ajout de BookOpen et Users pour les stats, et des icônes sociales (Facebook, Instagram, Twitter)
import { 
   MessageCircle, Video, Code2, Coffee, 
  ShieldCheck, BookOpen, Users, Facebook, Instagram, Twitter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../lib/api';
import Footer from '../../components/Footer';
import BackimageMentor from './../../assets/backgroundImage.jpg';
import NavbarAcc from '../../components/NavbarAcc';

interface Admin {
  id: number;
  nom: string;
  photo: string;
  formation: string;
  contact: string;
  email: string;
}

const PageMentors: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/admins`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then(data => {
        setAdmins(data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération:", error);
      });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

 const features = [
    { icon: MessageCircle, title: "Chat Privé 24/7", desc: "Posez vos questions sur facebook/whatsapp et obtenez des réponses rapides." },
    { icon: Video, title: "Office d'heure", desc: "Sessions live chaque semaine pour débloquer vos points techniques." },
    { icon: Code2, title: "Révision du code", desc: "Vos projets sont relus ligne par ligne par des professionnels." },
  ];

  return (
    <div id="mentors" className="min-h-screen bg-indigo-200/40 font-sans text-slate-900 overflow-x-hidden">
      {/* Header Section */}
      <NavbarAcc />
      <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src={BackimageMentor} 
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px]" 
          alt="Background" 
        />
        
        <div className="relative z-10 px-6">
         
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter"
          >
            Apprenez avec les <span className="text-indigo-300">Meilleurs</span>
          </motion.h1>
          <p className="text-indigo-100 w-full mx-auto text-sm md:text-base font-medium">
            Une équipe d'experts passionnés pour vous accompagner dans votre réussite technologique.
          </p>
        </div>
      </div>

      {/* Features */}
       <section className="max-w-7xl mx-auto px-6 -mt-8 relative  z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 transition-transform hover:scale-[1.02]">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="font-black text-amber-400 text-lg mb-1.5">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Liste des Mentors */}
      <section className="w-full mx-auto px-6 py-16">
        <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-purple-900">
          <Coffee size={20} className="text-amber-900" /> Vos futurs mentors
        </h2> 
        <p className="text-slate-500 text-xs leading-relaxed italic line-clamp-3 mb-4">
                  "Un mentor n'est pas celui qui parcourt le chemin à votre place, mais celui qui tient la lanterne pour éclairer vos prochains pas."
                </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {admins.map(admin => (
            <motion.div 
              key={admin.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/40 flex flex-col"
            >
              <div className="p-6 flex-grow">
                {/* Image + Nom + Spécialité centrés */}
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden shadow-inner flex-shrink-0 mb-3">
                    {admin.photo ? (
                      <img
                        src={`${API_URL.replace('/api', '')}/${admin.photo}`}
                        alt={admin.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        {/* icône fallback */}
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-base leading-tight">{admin.nom}</h4>
                  <p className="text-indigo-600 text-xs font-bold mt-0.5">{admin.formation}</p>
                </div>

                {/* Badge spécialité centré */}
                <div className="flex justify-center mb-3">
                  <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-wide">
                    Spécialité : {admin.formation}
                  </div>
                </div>

                {/* Statistiques centrées */}
                <div className="flex justify-center items-center gap-4 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600">1.2k élèves</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600">8 cours</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  <ShieldCheck size={10} /> Mentor vérifié
                </span>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <a href="#" className="text-blue-600 transition-colors"><Facebook size={14} /></a>
                  <a href="#" className="text-pink-600 transition-colors"><Instagram size={14} /></a>
                  <a href="#" className="text-sky-500 transition-colors"><Twitter size={14} /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

     

      <Footer />
    </div>
  );
};

export default PageMentors;