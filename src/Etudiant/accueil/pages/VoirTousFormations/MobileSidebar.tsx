import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import { C } from "./types";
import { SidebarContent } from "./SidebarContent";
import type { SidebarProps } from "./SidebarContent";

interface MobileSidebarProps extends SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ open, onClose, ...sidebarProps }: MobileSidebarProps) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed left-0 top-0 bottom-0 z-50 w-72 overflow-y-auto lg:hidden p-5"
          style={{ background: C.surface, borderRight: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter size={13} style={{ color: C.primary }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: C.textDark }}>
                Filtres
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: C.textMuted, background: C.surfaceAlt }}
            >
              <X size={15} />
            </button>
          </div>
          <SidebarContent {...sidebarProps} />
        </motion.div>
      </>
    )}
  </AnimatePresence>
);