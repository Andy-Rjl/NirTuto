import React from "react";
import { Columns, AlignLeft, Layout, Edit3, MessageSquare } from "lucide-react";

interface PilierScProps {
  pilierData: {
    title: string;
    subtitle: string;
    titre1: string;
    desc1: string;
    titre2: string;
    desc2: string;
    titre3: string;
    desc3: string;
  };
  setPilierData: (data: any) => void;
  EditCard: React.FC<any>;
}

const PilierSc: React.FC<PilierScProps> = ({ pilierData, setPilierData, EditCard }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-slate-800 italic">Configuration des Piliers</h3>
          <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1 rounded-full tracking-widest">Section Accueil</span>
        </div>

        <div className="space-y-4">
          {/* Nouveaux champs ajoutés */}
          <EditCard 
            label="Grand Titre" 
            value={pilierData.title || ""} 
            onChange={(v: string) => setPilierData({...pilierData, title: v})} 
            icon={<Edit3 size={18}/>} 
          />
          <EditCard 
            label="Sous-titre" 
            value={pilierData.subtitle || ""} 
            onChange={(v: string) => setPilierData({...pilierData, subtitle: v})} 
            icon={<MessageSquare size={18}/>} 
          />

          {/* Champs carte */}
          <EditCard 
            label="Titre de la carte 1" 
            value={pilierData.titre1} 
            onChange={(v: string) => setPilierData({...pilierData, titre1: v})} 
            icon={<Layout size={18}/>} 
          />
          <EditCard 
            label="Description 1" 
            value={pilierData.desc1} 
            onChange={(v: string) => setPilierData({...pilierData, desc1: v})} 
            icon={<AlignLeft size={18}/>} 
          />
           <EditCard 
            label="Titre de la carte 2" 
            value={pilierData.titre2} 
            onChange={(v: string) => setPilierData({...pilierData, titre2: v})} 
            icon={<Layout size={18}/>} 
          />
          <EditCard 
            label="Description 2" 
            value={pilierData.desc2} 
            onChange={(v: string) => setPilierData({...pilierData, desc2: v})} 
            icon={<AlignLeft size={18}/>} 
          />
           <EditCard 
            label="Titre de la carte 3" 
            value={pilierData.titre3} 
            onChange={(v: string) => setPilierData({...pilierData, titre3: v})} 
            icon={<Layout size={18}/>} 
          />
          <EditCard 
            label="Description 3" 
            value={pilierData.desc3} 
            onChange={(v: string) => setPilierData({...pilierData, desc3: v})} 
            icon={<AlignLeft size={18}/>} 
          />
        </div>
      </section>

      {/* Aperçu visuel simplifié */}
      <section className="flex flex-col items-center justify-center space-y-6">
        
        {/* En-tête de l'aperçu  */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {pilierData.title || "Titre Principal"}
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">
            {pilierData.subtitle || "Votre slogan s'affichera ici"}
          </p>
        </div>

        {/* Carte (Piliers 1) */}
        <div className="bg-white border-2 border-blue-400 rounded-[2.5rem] p-10 w-full text-center shadow-sm">
          <div className="inline-block p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <Columns size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            {pilierData.titre1 || "Titre de la section"}
          </h2>
          <p className="text-slate-400 text-sm italic">
            "{pilierData.desc1 || "Description des piliers"}"
          </p>
        </div>

         {/* Carte (Piliers 2) */}
        <div className="bg-white border-2 border-pink-400 rounded-[2.5rem] p-10 w-full text-center shadow-sm">
          <div className="inline-block p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <Columns size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            {pilierData.titre2 || "Titre de la section"}
          </h2>
          <p className="text-slate-400 text-sm italic">
            "{pilierData.desc2 || "Description des piliers"}"
          </p>
        </div>

         {/* Carte (Piliers 3) */}
        <div className="bg-white border-2 border-amber-400 rounded-[2.5rem] p-10 w-full text-center shadow-sm">
          <div className="inline-block p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <Columns size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            {pilierData.titre3 || "Titre de la section"}
          </h2>
          <p className="text-slate-400 text-sm italic">
            "{pilierData.desc3 || "Description des piliers"}"
          </p>
        </div>

      </section>
    </div>
  );
};

export default PilierSc;