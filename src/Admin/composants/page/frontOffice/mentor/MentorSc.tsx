import React from "react";
import { MessageCircle, Zap, MousePointer2 } from "lucide-react";

interface MentorScProps {
  mentorData: {
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
  };
  setMentorData: (data: any) => void;
  EditCard: React.FC<any>;
}

const MentorSc: React.FC<MentorScProps> = ({ mentorData, setMentorData, EditCard }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-slate-800 italic">Configuration Mentors</h3>
          <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full tracking-widest">Page Mentors</span>
        </div>

        <div className="space-y-4">
          <EditCard 
            label="Titre du bloc d'aide" 
            value={mentorData.ctaTitle} 
            onChange={(v: string) => setMentorData({...mentorData, ctaTitle: v})} 
            icon={<Zap size={18}/>} 
          />
          <EditCard 
            label="Description d'accompagnement" 
            value={mentorData.ctaDesc} 
            onChange={(v: string) => setMentorData({...mentorData, ctaDesc: v})} 
            icon={<MessageCircle size={18}/>} 
          />
          <EditCard 
            label="Texte du bouton" 
            value={mentorData.ctaButton} 
            onChange={(v: string) => setMentorData({...mentorData, ctaButton: v})} 
            icon={<MousePointer2 size={18}/>} 
          />
        </div>
      </section>

      {/* Aperçu Card Mentor */}
      <section className="flex items-center justify-center">
        <div className="bg-indigo-400 rounded-[2.5rem] p-8 text-center text-white shadow-xl w-full">
           <h2 className="text-2xl font-black mb-2">{mentorData.ctaTitle}</h2>
           <p className="text-indigo-100 text-sm mb-6">{mentorData.ctaDesc}</p>
           <div className="bg-white text-indigo-600 px-6 py-2 rounded-full font-black text-[10px] uppercase inline-block">
             {mentorData.ctaButton}
           </div>
        </div>
      </section>
    </div>
  );
};

export default MentorSc;