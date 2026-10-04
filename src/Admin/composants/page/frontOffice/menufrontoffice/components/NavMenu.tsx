import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout, Settings, Save, ChevronRight, Users, UserPlus, GraduationCap,
  Columns, PlayCircle, Library, FileText,
} from "lucide-react";

export const menuItems = [
  { name: "Accueil",        icon: Layout },
  { name: "Pilier",         icon: Columns },
  { name: "Réels",          icon: PlayCircle },
  { name: "Mentors",        icon: Users },
  { name: "Certifications", icon: GraduationCap },
  { name: "Thematique",     icon: Library },
  { name: "Blog",           icon: FileText },
  { name: "Recrutement",    icon: UserPlus },
  { name: "Contact",        icon: Settings },
];

interface NavMenuProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeSection: string;
  setActiveSection: (name: string) => void;
  isSaving: boolean;
  onSave: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({
  isOpen,
  setIsOpen,
  activeSection,
  setActiveSection,
  isSaving,
  onSave,
}) => (
  <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-40">
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#70B7BC] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-indigo-900 transition-all"
      >
        <Settings size={18} /> Menu Front Office
        <ChevronRight size={14} className={isOpen ? "rotate-90" : ""} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            onMouseLeave={() => setIsOpen(false)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200 p-3 rounded-3xl shadow-2xl z-50"
          >
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { setActiveSection(item.name); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${
                  activeSection === item.name
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon size={18} /> {item.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <button
      onClick={onSave}
      disabled={isSaving}
      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md"
    >
      {isSaving ? "Enregistrement..." : <><Save size={18} /> Enregistrer</>}
    </button>
  </div>
);

export default NavMenu;