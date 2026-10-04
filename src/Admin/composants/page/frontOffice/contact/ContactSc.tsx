import React from "react";
import { Settings, MapPin, Phone, Mail, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

interface ContactScProps {
  contactInfo: { adresse: string; telephone: string; email: string };
  setContactInfo: (val: any) => void;
  EditCard: React.FC<any>;
}

const ContactSc: React.FC<ContactScProps> = ({ contactInfo, setContactInfo, EditCard }) => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-200 pb-4"><Settings className="text-indigo-600" /> Coordonnées</h2>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <EditCard label="Adresse" value={contactInfo.adresse} onChange={(v:any) => setContactInfo({...contactInfo, adresse: v})} icon={<MapPin size={18}/>} />
          <EditCard label="Téléphone" value={contactInfo.telephone} onChange={(v:any) => setContactInfo({...contactInfo, telephone: v})} icon={<Phone size={18}/>} />
          <EditCard label="Email" value={contactInfo.email} onChange={(v:any) => setContactInfo({...contactInfo, email: v})} icon={<Mail size={18}/>} />
        </div>
      </section>
      <section className="space-y-6">
        <h3 className="text-xl font-black text-slate-800 italic">Aperçu Footer</h3>
        <div className="bg-[#1e3a8a] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-blue-100/80 mb-6">
            <li className="flex items-center gap-2"><MapPin size={14}/> {contactInfo.adresse}</li>
            <li className="flex items-center gap-2"><Phone size={14}/> {contactInfo.telephone}</li>
            <li className="flex items-center gap-2"><Mail size={14}/> {contactInfo.email}</li>
          </ul>
          <div className="flex gap-4 opacity-70 border-t border-white/20 pt-8"><Facebook size={18}/> <Linkedin size={18}/> <Twitter size={18}/> <Youtube size={18}/></div>
        </div>
      </section>
    </div>
  );
};

export default ContactSc;