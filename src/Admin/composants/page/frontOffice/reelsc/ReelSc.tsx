import React, { useState } from "react";

import ValeurSectionAdmin from "./sections/ValeurSectionAdmin";
import OffresGalerieSectionAdmin from "./sections/OffresGalerieSectionAdmin";

interface ReelScProps {
  reelData: {
    title: string;
    ctaTitle: string;
    ctaButton: string;
  };
  setReelData: (data: any) => void;
  EditCard: React.FC<any>;
}

const ReelSc: React.FC<ReelScProps> = ({  }) => {
  const [activeSection, setActiveSection] = useState<"valeurs" | "offresGalerie">("valeurs");

  return (
    <div className="space-y-6">

      {/* Tab switcher */}
      <div className="flex bg-slate-100 rounded-2xl p-1 gap-1 w-fit flex-wrap">
        {(["valeurs", "offresGalerie"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveSection(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${
              activeSection === tab ? "bg-white text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
            {tab === "valeurs" ? " Valeurs" : " Offres & Galerie"}
          </button>
        ))}
      </div>

      {activeSection === "valeurs"       && <ValeurSectionAdmin />}
      {activeSection === "offresGalerie" && <OffresGalerieSectionAdmin />}

    </div>
  );
};

export default ReelSc;