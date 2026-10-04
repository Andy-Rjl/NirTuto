import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {  offres, temoignages, photos } from './DataProjet';
import {  OffreCard, TestimonialCard } from './PageComposant';

/* ── HeroSection ── */
export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <header className="relative bg-gray-950 overflow-hidden">
      {/* BG texture */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, white 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, white 0 1px, transparent 1px 60px)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full mx-auto px-6 py-16 md:py-24">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors group text-sm font-semibold"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Retour
        </button>

        <div className="w-full flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Construis ton avenir<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                avec de vrais projets
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8">
              Chez Tuto Info, tu n'apprends pas sur des exercices fictifs. Tu livres des solutions utilisées par de vraies entreprises — et tu construis un portfolio qui te démarque.
            </p>
          </motion.div>
        </div>
      </div>
    </header>
  );
};




/* ── OffresGalerieSection ── */
export const OffresGalerieSection = ({ activeTab, setActiveTab }: {
  activeTab: 'offres' | 'galerie';
  setActiveTab: (tab: 'offres' | 'galerie') => void;
}) => (
  <section className="w-full mx-auto px-6 py-16">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-0.5 bg-indigo-600 rounded-full" />
      <span className="text-indigo-600 text-sm font-bold uppercase tracking-widest">Opportunités réelles</span>
    </div>
    <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
      <h2 className="text-3xl md:text-4xl font-black text-gray-900">
        Ce qui t'attend<br /> après la formation
      </h2>
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(['offres', 'galerie'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'offres' ? '💼 Debouchées apres la formation' : '📸 Galerie du tech'}
          </button>
        ))}
      </div>
    </div>

    <AnimatePresence mode="wait">
      {activeTab === 'offres' ? (
        <motion.div
          key="offres"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {offres.map((o, i) => <OffreCard key={o.role} o={o} index={i} />)}
        </motion.div>
      ) : (
        <motion.div
          key="galerie"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {photos.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="group relative bg-gray-900 rounded-2xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
            >
              <img
                src={p.img}
                alt={p.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <p className="text-white font-bold text-xs">{p.label}</p>
                <p className="text-gray-300 text-xs opacity-80">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </section>
);


/* ── TemoignagesSection ── */
export const TemoignagesSection = () => (
  <section className="bg-gray-50 py-16 border-y border-gray-100">
    <div className="w-full mx-auto px-6">
      <div className="text-center mb-10">
        <span className="text-indigo-600 text-sm font-bold uppercase tracking-widest">Témoignages</span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">
          Ils l'ont fait. <span className="text-indigo-600">Tu peux aussi.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {temoignages.map((t, i) => <TestimonialCard key={t.nom} t={t} index={i} />)}
      </div>
    </div>
  </section>
);

