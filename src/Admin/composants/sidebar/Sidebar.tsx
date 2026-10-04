import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuType } from './../../types';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './../../lib/api';

interface SidebarProps {
  activeMenu: MenuType;
  setActiveMenu: (menu: MenuType) => void;
  unreadCount?: number; // <-- Ajout de la prop optionnelle ici
}

const menuIcons: Record<string, React.ReactNode> = {
  Dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Formations: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  'Front office': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  'Gestion etudiant': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Message: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Progression: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Recrutement: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  Cours: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
};

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, unreadCount = 0 }) => {
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  const menus: MenuType[] = [
    'Dashboard', 'Formations', 'Front office',
    'Gestion etudiant', 'Progression', 'Message', 'Recrutement', 'Cours'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Erreur logout', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/admin/login');
    }
  };

  return (
    <aside
      className="w-80 h-screen rounded-r-[2.5rem] text-white flex flex-col py-8 px-6 shadow-2xl overflow-visible relative shrink-0"
      style={{
        background: 'linear-gradient(160deg, #1e2a5e 0%, #1A234E 50%, #141c40 100%)',
        boxShadow: '4px 0 40px rgba(26,35,78,0.45)',
      }}
    >
      {/* Decorative top accent line */}
      <div
        className="absolute top-0 left-8 right-8 h-0.5 rounded-b-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,130,255,0.5), transparent)' }}
      />

      {/* Logo / Brand */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #6382ff 0%, #a78bfa 100%)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <span className="text-[16px] font-black tracking-[0.2em] text-white uppercase block">Admin</span>
          <p className="text-[11px] text-white/30 tracking-widest uppercase font-medium mt-0.5">Panneau de contrôle</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07] mb-6" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {menus.map((menu) => {
          const isActive = activeMenu === menu;
          const blockedForFormateur = [
            'Dashboard', 'Formations', 'Front office',
            'Gestion etudiant', 'Recrutement', 'Progression'
          ];
          const isFormateur = localStorage.getItem('adminRole') === 'formateur';
          const blocked = isFormateur && blockedForFormateur.includes(menu);
          return (
            <button
              key={menu}
              onClick={() => {
                if (blocked) return;
                setActiveMenu(menu);
              }}
              disabled={blocked}
              title={blocked ? "Accès non autorisé" : undefined}
              className={`w-full text-left rounded-2xl transition-all duration-200 flex items-center gap-4 group relative
                ${blocked
                  ? 'text-white/20 cursor-not-allowed opacity-50'
                  : isActive
                    ? 'text-[#1A234E] shadow-lg'
                    : 'text-white/50 hover:text-white'}`}
              style={
                isActive && !blocked
                  ? {
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f3ff 100%)',
                      padding: '13px 16px',
                    }
                  : { padding: '13px 16px' }
              }
            >
              {/* Active left accent bar */}
              {isActive && !blocked && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 rounded-r-full"
                  style={{
                    width: '3px',
                    background: 'linear-gradient(180deg, #6382ff, #a78bfa)',
                  }}
                />
              )}

              {/* Hover background */}
              {!isActive && !blocked && (
                <span
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              )}

              {/* Icon container */}
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 relative
                  ${isActive && !blocked
                    ? 'bg-[rgba(99,130,255,0.12)] text-[#3b52cc]'
                    : 'text-white/40 group-hover:text-white/80'
                  }`}
              >
                {menuIcons[menu]}
              </span>

              <span className="text-[14px] font-semibold tracking-wide relative z-10 flex-1 flex items-center justify-between">
                {menu}
                
                {/* Badge de Notification pour l'onglet Message */}
                {menu === "Message" && unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full border border-white/20 shadow-sm animate-bounce mr-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="pt-5 mt-4 border-t border-white/[0.07] relative" ref={logoutRef}>

        <AnimatePresence>
          {showLogout && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-4 left-0 right-0 bg-white shadow-2xl p-7 rounded-3xl border border-slate-100 z-50 flex flex-col items-center justify-center text-center"
            >
              <p className="text-[#1A234E] text-[13px] font-black uppercase mb-5 leading-tight">
                Êtes-vous sûr de <br /> vous déconnecter ?
              </p>
              <div className="flex flex-col w-full gap-2.5">
                <button
                  onClick={handleLogout}
                  className="bg-[#6382ff] text-white text-[12px] font-black py-3.5 rounded-xl uppercase hover:bg-[#4f6ee8] transition-colors"
                >
                  Oui, quitter
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  className="bg-slate-100 text-slate-500 text-[12px] font-black py-3.5 rounded-xl uppercase hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 -mt-2 shadow-sm" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowLogout(!showLogout)}
          className={`transition-all duration-200 w-full px-4 text-[12px] font-bold uppercase tracking-wider text-center py-3 rounded-xl flex items-center justify-center gap-2.5
            ${showLogout ? 'text-[#6382ff] bg-white/5' : 'text-white/30 hover:text-[#6382ff] hover:bg-white/5'}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;