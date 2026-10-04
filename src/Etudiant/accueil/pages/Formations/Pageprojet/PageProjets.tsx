import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import {
  HeroSection,
  OffresGalerieSection,
  TemoignagesSection,
} from './PageSection';
import NavbarAcc from '../../../components/NavbarAcc';

/* ── PAGE ── */
const PageProjets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offres' | 'galerie'>('offres');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900">
      <NavbarAcc />
      <HeroSection />
      <OffresGalerieSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <TemoignagesSection />
      <Footer />
    </div>
  );
};

export default PageProjets;