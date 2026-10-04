import React, { useState } from "react";

import { useFrontOfficeData } from "./hooks/useFrontOfficeData";
import { useGlobalSave } from "./hooks/useGlobalSave";
import NavMenu from "./components/NavMenu";
import Notifications from "./components/Notifications";
import EditCard from "./components/EditCard";

import AcceuilSc from "../acceuil/AccueilSc";
import RecrutementSc from "../recrutement/RecrutementSc";
import CertificationSc from "../certification/CertificationSc";
import ContactSc from "../contact/ContactSc";
import BlogSc from "../blog/BlogSc";
import PilierSc from "../pilier/PilierSc";
import ReelSc from "../reelsc/ReelSc";
import MentorSc from "../mentor/MentorSc";
import ThematiqueSc from "../thematique/ThematiqueSc";

const FrontOffice: React.FC = () => {
  const [isOpen,         setIsOpen]         = useState(false);
  const [activeSection,  setActiveSection]  = useState("Accueil");
  const [notifications,  setNotifications]  = useState<{ id: number; message: string }[]>([]);

  const notify = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const data   = useFrontOfficeData();
  const { isSaving, handleGlobalSave } = useGlobalSave(notify);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative font-sans overflow-hidden">

      <NavMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSaving={isSaving}
        onSave={() => handleGlobalSave(data)}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === "Accueil" && (
          <AcceuilSc
            heroText={data.heroText}         setHeroText={data.setHeroText}
            slogan={data.slogan}             setSlogan={data.setSlogan}
            buttonText={data.buttonText}     setButtonText={data.setButtonText}
            imageFile={data.imageFile}       setImageFile={data.setImageFile}
            savedImageUrl={data.savedImageUrl}
            EditCard={EditCard}
          />
        )}
        {activeSection === "Recrutement" && (
          <RecrutementSc
            ctaFormateur={data.ctaFormateur}
            setCtaFormateur={data.setCtaFormateur}
          />
        )}
        {activeSection === "Certifications" && (
          <CertificationSc
            certifText={data.certifText}
            setCertifText={data.setCertifText}
          />
        )}
        {activeSection === "Contact" && (
          <ContactSc
            contactInfo={data.contactInfo}
            setContactInfo={data.setContactInfo}
            EditCard={EditCard}
          />
        )}
        {activeSection === "Blog" && (
          <BlogSc
            blogData={data.blogData}       setBlogData={data.setBlogData}
            detailsData={data.detailsData} setDetailsData={data.setDetailsData}
          />
        )}
        {activeSection === "Thematique" && (
          <ThematiqueSc
            thematiqueData={data.thematiqueData}
            setThematiqueData={data.setThematiqueData}
            EditCard={EditCard}
          />
        )}
        {activeSection === "Pilier" && (
          <PilierSc
            pilierData={data.pilierData}
            setPilierData={data.setPilierData}
            EditCard={EditCard}
          />
        )}
        {activeSection === "Réels" && (
          <ReelSc
            reelData={data.reelData}
            setReelData={data.setReelData}
            EditCard={EditCard}
          />
        )}
        {activeSection === "Mentors" && (
          <MentorSc
            mentorData={data.mentorData}
            setMentorData={data.setMentorData}
            EditCard={EditCard}
          />
        )}
      </div>

      <Notifications notifications={notifications} />
    </div>
  );
};

export default FrontOffice;