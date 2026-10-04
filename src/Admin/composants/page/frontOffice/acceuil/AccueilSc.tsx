import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, MessageSquare, MousePointer2, Users, 
  GraduationCap, Globe, Image as ImageIcon, Upload
} from "lucide-react";
import { GoPlus } from "react-icons/go";
import HeroImage from "./../../../../assets/backgroundImage.jpg";

interface AcceuilScProps {
  heroText: string;
  setHeroText: (val: string) => void;
  slogan: string;
  setSlogan: (val: string) => void;
  buttonText: string;
  setButtonText: (val: string) => void;
  imageFile: File | null;                      // ← nouveau
  setImageFile: (file: File | null) => void;   // ← nouveau
  savedImageUrl?: string;                      // ← URL de l'image déjà sauvegardée
  EditCard: React.FC<any>;
}

const AcceuilSc: React.FC<AcceuilScProps> = ({ 
  heroText, setHeroText, slogan, setSlogan, buttonText, setButtonText,
  imageFile, setImageFile, savedImageUrl, EditCard 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aperçu local : priorité au fichier sélectionné, sinon URL sauvegardée
  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : savedImageUrl || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-slate-800 italic">Édition Accueil Section</h3>
          <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full tracking-widest">
            Aperçu en temps réel
          </span>
        </div>

        <EditCard label="Grand Titre"           value={heroText}   onChange={setHeroText}   icon={<Edit3 size={18}/>}        type="text" />
        <EditCard label="Slogan de présentation" value={slogan}     onChange={setSlogan}     icon={<MessageSquare size={18}/>} type="text" />
        <EditCard label="Article"               value={buttonText} onChange={setButtonText} icon={<MousePointer2 size={18}/>} type="text" />

        {/*  Champ upload image */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group hover:border-indigo-600 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
              <ImageIcon size={18}/>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Image de fond
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  <Upload size={13}/> Choisir un fichier
                </button>
                {imageFile && (
                  <span className="text-[11px] text-slate-500 truncate max-w-35">
                    {imageFile.name}
                  </span>
                )}
                {!imageFile && savedImageUrl && (
                  <span className="text-[11px] text-emerald-600 font-bold">Image actuelle ✓</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Miniature de l'aperçu */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="aperçu"
                className="w-14 h-14 object-cover rounded-xl border border-slate-200"
              />
            )}
          </div>
        </div>
      </section>

      {/* Aperçu live */}
      <section className="sticky top-0 h-fit rounded-[2.5rem] border-2 overflow-hidden aspect-video bg-linear-to-br from-indigo-50 via-white to-purple-50 shadow-lg group">
        <div className="relative h-full w-full flex flex-col justify-center p-6 md:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key="bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-0">
              {/* On affiche l'aperçu choisi, sinon l'image par défaut */}
              <img src={previewUrl ?? HeroImage} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            </motion.div>
          </AnimatePresence>
          <div className="max-w-[65%] z-10 space-y-3">
            <div className="space-y-1 flex flex-col items-center">
              <h2 className="text-lg font-black text-white leading-[1.1] tracking-tight">
                {heroText || "Titre de la formation"}
              </h2>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
                <div className="text-lg bg-linear-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent animate-gradient italic">
                  {buttonText}
                </div>
              </motion.div>
              <p className="text-[9px] text-slate-400 font-medium leading-tight">
                {slogan || "Votre slogan ici..."}
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              {[
                { label: "Etudiants",      end: "+100", icon: Users },
                { label: "Formations",     end: "+50",  icon: GraduationCap },
                { label: "Instructeurs",   end: "+15",  icon: Globe },
                { label: "Ans d'experience", end: "10", icon: GoPlus },
              ].map((s, i) => (
                <div key={i} className="flex items-center bg-transparent gap-1 backdrop-blur-sm p-1.5 px-2 rounded-lg border border-indigo-50/50 shadow-xs">
                  <div className="p-1 bg-white/10 rounded-xl">
                    <s.icon size={20} className="text-blue-400" />
                  </div>
                  <div> 
                    <p className="text-sm font-black text-indigo-600 leading-none">{s.end}</p>
                    <p className="text-[5px] uppercase font-bold text-slate-400 mt-0.5 tracking-tighter">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcceuilSc;