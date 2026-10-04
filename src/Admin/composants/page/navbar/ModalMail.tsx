import { useState, useEffect, useMemo } from 'react';
import { Mail, Bell, X, User, Settings, LogOut, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import { API_URL } from '../../../lib/api';

const ModalMail = ({ onClose }: { onClose: () => void }) => {
  const [selectedMail, setSelectedMail] = useState<any | null>(null);
  const [isReplyMode, setIsReplyMode] = useState(false);

  // Message Public
  const [contacts, setContacts] = useState([]);
  const [, setLoading] = useState(true);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts`);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logique de pagination
  const { currentItems, totalPages } = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return {
      currentItems: contacts.slice(firstIndex, lastIndex),
      totalPages: Math.ceil(contacts.length / itemsPerPage)
    };
  }, [contacts, currentPage]);


  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center md:justify-end md:pr-10 md:pt-20 bg-black/20 backdrop-blur-[2px] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        
        <div className="p-3 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            {(selectedMail || isReplyMode) && (
              <button onClick={() => isReplyMode ? setIsReplyMode(false) : setSelectedMail(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors dark:text-white">
                <ChevronLeft size={16} />
              </button>
            )}
            <span className="text-[10px] font-black text-[#1A234E] dark:text-indigo-400 uppercase tracking-wider px-2">
              {isReplyMode ? "Répondre" : selectedMail ? "Lecture" : "Messages"}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 cursor-pointer"><X size={16} /></button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!selectedMail ? (
            currentItems.map((contact: any) => (
              <div key={contact.id} onClick={() => setSelectedMail(contact)} className="p-3 border-b border-gray-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 cursor-pointer group">
                <div className={`w-1 h-6 rounded-full bg-indigo-600`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{contact.email}</span>
                    <span className="text-[9px] text-gray-400">{contact.created_at}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{contact.message}</p>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-500" />
              </div>
            ))
          ) : (
            <div className="p-5 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs border border-indigo-100 dark:border-indigo-800">{selectedMail.email[0]}</div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{selectedMail.email}</h4>
                  <p className="text-[9px] text-gray-400 font-medium">{selectedMail.created_at}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{selectedMail.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

          {/* Contrôles de Pagination */}
          <div className="p-5 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Page {currentPage} sur {totalPages || 1}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 transition-all shadow-sm"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 transition-all shadow-sm"
              >
                →
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ModalMail;