import { Edit3 } from "lucide-react";


export interface HeroConfig {
  title: string;
  description: string;
  ctaBtn: string;
  bgColor: string;
}

export interface BlogData {
  hero: HeroConfig;
}

// ─── Valeur initiale exportée — à utiliser comme useState par défaut dans BlogSc
export const defaultBlogData: BlogData = {
  hero: {
    title: "Notre Blog",
    description: "Apprendre l'informatique, ce n'est pas seulement accumuler des lignes de code ou des concepts théoriques, c'est avant tout se donner les moyens de concrétiser ses propres idées.",
    ctaBtn: "Rejoignez la communauté Tuto Info",
    bgColor: "#B1C9EF",
  },
};

// ─── Props reçues de BlogSc ───────────────────────────────────────────────────
interface PageBlogListeScProps {
  blogData: BlogData;
  setBlogData: React.Dispatch<React.SetStateAction<BlogData>>;
  EditCard: React.FC<any>;
}

// ─── Composant ────────────────────────────────────────────────────────────────
export default function PageBlogListeSc({ blogData, setBlogData }: PageBlogListeScProps) {
  // ── Styles ───────────────────────────────────────────────────────────────────
  const LBL   = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1";
  const INP   = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#4fc3c0]/40 focus:border-[#4fc3c0] transition-all bg-white";
  const TXT   = INP + " resize-none";

  return (
    <div className="bg-[#f7f9fc] rounded-2xl overflow-hidden" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4fc3c0] flex items-center justify-center">
              <Edit3 size={15} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Front Office · BlogSc</p>
              <h1 className="text-sm font-bold text-gray-900 leading-none">PageBlogListe — Éditeur</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire de configuration */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900"> Section d'accueil
                
              </h2>
              
              {/* Titre principal */}
              <div>
                <label className={LBL}>Titre principal</label>
                <input 
                  className={INP} 
                  value={blogData.hero.title} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setBlogData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: val }
                    }));
                  }} 
                />
              </div>

              {/* Description */}
              <div>
                <label className={LBL}>Description</label>
                <textarea 
                  className={TXT} 
                  rows={4} 
                  value={blogData.hero.description} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setBlogData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, description: val }
                    }));
                  }} 
                />
              </div>

              {/* Texte du bouton CTA */}
              <div>
                <label className={LBL}>Texte du bouton CTA</label>
                <input 
                  className={INP} 
                  value={blogData.hero.ctaBtn} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setBlogData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, ctaBtn: val }
                    }));
                  }} 
                />
              </div>

              {/* Couleur de fond */}
              <div>
                <label className={LBL}>Couleur de fond</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={blogData.hero.bgColor} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlogData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, bgColor: val }
                      }));
                    }} 
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" 
                  />
                  <input 
                    className={INP} 
                    value={blogData.hero.bgColor} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlogData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, bgColor: val }
                      }));
                    }} 
                    placeholder="#B1C9EF" 
                  />
                </div>
              </div>
            </div>

            {/* Aperçu temps réel */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Aperçu temps réel</p>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <div style={{ backgroundColor: blogData.hero.bgColor }} className="py-8 text-center px-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{blogData.hero.title}</h1>
                  <p className="text-gray-600 text-xs max-w-xs mx-auto leading-relaxed mb-4">{blogData.hero.description}</p>
                  <button className="px-5 py-1.5 bg-[#4fc3c0] text-white text-xs font-semibold rounded-sm">{blogData.hero.ctaBtn}</button>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className="border-t border-gray-200 bg-white py-3 text-center">
        <p className="text-[10px] text-gray-400">Modifications synchronisées en temps réel · BlogSc → PageBlogListeSc</p>
      </div>
    </div>
  );
}