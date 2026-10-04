import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, X, Paperclip, SendHorizonal, Phone, FileText, ImageIcon, Mail, ArrowLeft, MailWarning } from "lucide-react";
import { API_URL } from "./../../../lib/api";
import Avatar from "./Avatar";

const Message = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const baseUrl = API_URL.replace("/api", "");
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [etudiants, setEtudiants] = useState<any[]>([]);
    const [, setLoading] = useState(true);
    const [, setTotalInscrits] = useState(0);
    const [lastMessageTimes, setLastMessageTimes] = useState<Record<string, string>>({});
    

const handleSelectContact = (etud: any) => {
  setSelectedContact(etud);

  const key = String(etud.id);
  const removedCount = unreadCounts[key] || 0;

  if (removedCount > 0) {
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setUnreadCount((prev) => Math.max(0, prev - removedCount));
  }
};

    useEffect(() => {
    const fetchEtudiants = async () => {
        try {
        const response = await fetch(`${API_URL}/admin/etudiants-inscrits`, {
            headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const result = await response.json();
        if (response.ok) {
            setEtudiants(result.data);
            setTotalInscrits(result.count);
        } else {
            console.error("Erreur API:", result);
        }
        } catch (error) {
        console.error("Erreur réseau:", error);
        } finally {
        setLoading(false);
        }
    };
    fetchEtudiants();
    }, []);
    
    useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/unread`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();

      if (data.counts) {
        // Format A : backend renvoie déjà un compte par expéditeur
        setUnreadCounts(data.counts);
      } else if (data.sender_ids) {
        // Format B : on compte les occurrences (ne fonctionne que si
        // sender_ids contient un id par message non lu, avec doublons)
        const counts: Record<string, number> = {};
        (data.sender_ids as (number | string)[]).forEach((id) => {
          const key = String(id);
          counts[key] = (counts[key] || 0) + 1;
        });
        setUnreadCounts(counts);
      } else {
        setUnreadCounts({});
      }

      setUnreadCount(data.total_count || 0);
    } catch (error) {
      console.error("Erreur notifications:", error);
    }
  };
  fetchNotifications();
  const interval = setInterval(fetchNotifications, 15000);
  return () => clearInterval(interval);
}, []);
    
    const isOnline = (lastSeen: string | null) => {
        if (!lastSeen) return false;
        const diffMinutes = (new Date().getTime() - new Date(lastSeen).getTime()) / (1000 * 60);
        return diffMinutes < 5;
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedContact) return;
        const formData = new FormData();
        formData.append("receiver_id", selectedContact.id.toString());
        formData.append("content", newMessage);
        if (selectedFile) formData.append("file", selectedFile);
        try {
        const response = await fetch(`${API_URL}/messages`, {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Accept": "application/json"
            },
            body: formData
        });
        if (response.ok) {
            const sentMsg = await response.json();
            setMessages(prev => [...prev, sentMsg]);
            setNewMessage("");
            setSelectedFile(null);

            setLastMessageTimes(prev => ({
              ...prev,
              [String(selectedContact.id)]: sentMsg.created_at || new Date().toISOString()
            }));
        } else {
            console.error("Erreur serveur:", response.status);
        }
        } catch (error) {
        console.error("Erreur envoi:", error);
        }
    };

    useEffect(() => {
        if (selectedContact) {
        const fetchMessages = async () => {
          try {
            const response = await fetch(`${API_URL}/messages/${selectedContact.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setMessages(data);

            // 👉 Prend la date du tout dernier message de l'historique
            if (data && data.length > 0) {
                const lastMsg = data[data.length - 1];
                setLastMessageTimes(prev => ({
                    ...prev,
                    [String(selectedContact.id)]: lastMsg.created_at
                }));
            }
          } catch (error) {
            console.error("Erreur messages:", error);
          }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
        }
    }, [selectedContact]);

    const uniqueEtudiants: any[] = Array.from(
        etudiants.reduce((acc, current) => {
          const key = current.email;
          const existing = acc.get(key);
          const realId = current.authentification_id || current.user_id || current.id;
          if (!existing) {
            return acc.set(key, { 
              ...current, 
              id: realId, 
              allFormations: [current.formation] 
            });
          } else {
            return acc.set(key, { 
              ...existing, 
              allFormations: [...existing.allFormations, current.formation] 
            });
          }
        }, new Map()).values()
    );

const filteredEtudiants = uniqueEtudiants
  .filter((etud) =>
    etud.nom.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    // Si aucun message n'a été envoyé, on donne une date très ancienne (0)
    const timeA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
    const timeB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;

    // Strictement du plus récent au plus ancien
    return timeB - timeA;
  });

  return (
    <div className="w-full h-[85vh] flex gap-2.5 bg-[#E7EEFE] overflow-hidden p-2.5 font-sans">
      {/* --- Colonne 1: Liste des Conversations (Redesign) --- */}
      <div className="w-102.5 min-w-102.5 bg-transparent flex flex-col overflow-hidden">
        {/* En-tête de la liste */}
        <div className="p-4 flex flex-col gap-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C8DB5]"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#E0E8F9] border border-[#CBD7E9] rounded-2xl py-3 pl-12 pr-4 text-[16px] text-[#2F3E5A] outline-none placeholder:text-[#A0AEC0] focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          
        </div>

        {/* Liste des contacts (Cartes distinctes) */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5 scrollbar-thin scrollbar-thumb-[#CBD7E9] scrollbar-track-transparent">
          <AnimatePresence>
            {filteredEtudiants.length === 0 && (
              <p className="text-[#7C8DB5] text-center py-4">
                Aucun étudiant trouvé
              </p>
            )}
            {filteredEtudiants.map((etud, index) => {
              const active = selectedContact?.id === etud.id;
              const contactUnreadCount = unreadCounts[String(etud.id)] || 0;
              const hasUnread = contactUnreadCount > 0;
              return (
                <motion.div
                  key={etud.id ?? index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, type: "spring", stiffness: 100, damping: 20 }}
                  onClick={() => handleSelectContact(etud)}
                  className={`flex items-center justify-between my-5 p-3 rounded-3xl cursor-pointer transition-all duration-200 shadow-sm ${
                    active 
                      ? "bg-[#1E56FB] text-white shadow-lg" 
                      : "bg-white hover:bg-[#F0F5FF]"
                  }`}
                >
                  {/* Gauche: Avatar + Infos */}
                  <div className="flex items-center gap-4.5 flex-1 min-w-0">
                    <div className="relative shrink-0">
                        <Avatar
                          src={etud.photo}
                          baseUrl={baseUrl}
                          alt={etud.nom}
                          size={24}
                          className="w-14 h-14 rounded-full border-[3px] border-white/50 text-xl font-bold uppercase shadow-inner-sm"
                          iconClassName={active ? "text-white" : "text-[#7C8DB5]"}
                        />
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-[2.5px] border-white shadow-md ${
                          isOnline(etud.last_seen) ? "bg-[#34D399]" : "bg-[#A0AEC0]"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 ml-4">
                      <p className={`text-[17px] text-left font-bold truncate tracking-tight mb-0.5 ${active ? "text-white" : "text-[#1A1D2E]"}`}>
                        {etud.nom} {etud.prenom}
                      </p>
                      <p className={`text-[14px] text-left truncate leading-tight ${active ? "text-indigo-100" : "text-[#7C8DB5]"}`}>
                        {(etud.allFormations || []).join(" • ")}
                      </p>
                    </div>
                  </div>

                  {/* Droite: Temps + Statut */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0 ml-3">
                    <span className={`text-[12px] font-medium ${active ? "text-indigo-200" : "text-[#A0AEC0]"}`}>
                    </span>
                    {hasUnread ? (
                      <span className={`flex items-center justify-center font-bold rounded-full text-xs min-w-6 h-6 px-1.5 ${
                        active ? 'bg-white text-[#1E56FB]' : 'bg-[#1E56FB] text-white'
                      }`}>
                        {contactUnreadCount}
                      </span>
                    ) : (
                        active ? (
                            <MailWarning size={16} className="text-white/70" />
                        ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[#CBD7E9] bg-[#E0E8F9]"/>
                        )
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Colonne 2: Zone de Chat (Inchangé, comme demandé) --- */}
      <div className="flex-1 flex flex-col rounded-3xl bg-[#F8FAFF] overflow-hidden border border-[#ECEEF5]">
        {!selectedContact ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#9CA3AF]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-18 h-18 bg-indigo-50 rounded-full flex items-center justify-center"
            >
              <Send size={28} className="text-indigo-400 opacity-50" />
            </motion.div>
            <p className="text-sm font-semibold text-[#6B7280]">
              Sélectionnez une discussion pour commencer
            </p>
          </div>
        ) : (
          <motion.div 
            key="chat" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-blue-100 shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => selectedContact(null)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 lg:hidden">
                  <ArrowLeft size={20} />
                </button>
                  <Avatar
                    src={selectedContact?.photo}
                    baseUrl={baseUrl}
                    alt={selectedContact?.nom}
                    size={24}
                    className="w-13 h-13 rounded-full font-bold uppercase bg-indigo-50"
                    iconClassName="text-indigo-500"
                  />
                <div>
                  <h4 className="font-black text-slate-800 text-sm italic uppercase tracking-tight">{selectedContact.nom} {selectedContact.prenom}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isOnline(selectedContact.last_seen) ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{isOnline(selectedContact.last_seen) ? "En ligne" : "Hors ligne"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Messages */}
            <div 
              className="flex-1 overflow-y-auto p-8 flex flex-col gap-6"
            >
              {messages.map((msg, idx) => {
                const isMe = String(msg.sender_type).includes("Admins");
                const fileFullUrl = msg.file_url ? `${baseUrl}/storage/${msg.file_url}` : null;
                
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start animate-in fade-in slide-in-from-bottom-0'}`}>
                    <div className={`relative max-w-[80%] p-4 shadow-sm ${isMe ? 'bg-[#62A9D9] text-white rounded-3xl rounded-tr-none' : 'bg-[#EBEDF0] text-[#2D3748] rounded-3xl rounded-tl-none border border-gray-200/50'}`}>
                      
                      {/* Gestion des types de fichiers */}
                      {fileFullUrl && msg.file_type === "image" && (
                        <a href={fileFullUrl} target="_blank" rel="noopener noreferrer" className="block mb-2">
                          <img src={fileFullUrl} alt="image" className="max-w-full max-h-75 rounded-xl object-cover cursor-pointer hover:opacity-90 transition" />
                        </a>
                      )}
                      
                      {fileFullUrl && msg.file_type === "pdf" && (
                        <a href={fileFullUrl} target="_blank" download rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition mb-2 ${isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                          <FileText size={14} /><span className="truncate max-w-40">{msg.file_url?.split('/').pop()}</span>
                        </a>
                      )}

                      {fileFullUrl && msg.file_type === "archive" && (
                        <a href={fileFullUrl} target="_blank" rel="noopener noreferrer" download
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition mb-2 ${isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'}`}>
                          <FileText size={14} /><span className="truncate max-w-40">{msg.file_url?.split('/').pop()}</span>
                        </a>
                      )}

                      {fileFullUrl && msg.file_type === "file" && (
                        <a href={fileFullUrl} target="_blank" rel="noopener noreferrer" download
                          className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition ${isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                          <Paperclip size={14} /><span className="truncate max-w-40">{msg.file_url?.split('/').pop()}</span>
                        </a>
                      )}

                      <p className="text-[15px] font-medium leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-2 font-bold px-2 uppercase tracking-wider">
                      {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Form  */}
            <div className="p-3 sm:p-4 bg-blue-100 border-t border-gray-100 shrink-0">
              {selectedFile && (
                <div className="mb-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${selectedFile.type.includes('image') ? 'bg-blue-50' : selectedFile.type.includes('pdf') ? 'bg-red-50' : selectedFile.name.match(/\.(zip|rar)$/i) ? 'bg-yellow-50' : 'bg-gray-100'}`}>
                      {selectedFile.type.includes('image') ? <ImageIcon size={14} className="text-blue-600" /> : selectedFile.name.match(/\.(zip|rar)$/i) ? <FileText size={14} className="text-yellow-600" /> : <FileText size={14} className={selectedFile.type.includes('pdf') ? 'text-red-500' : 'text-gray-500'} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-gray-400">{selectedFile.size < 1024 * 1024 ? `${Math.round(selectedFile.size / 1024)} Ko` : `${(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo`}</p>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
                      <X size={10} className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-white px-2 py-1.5 rounded-2xl border border-gray-100 focus-within:border-indigo-300 transition-all">
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*,application/pdf,.zip,.rar" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all shrink-0">
                  <Paperclip size={14} />
                </button>
                <input type="text" placeholder="Écrire un message..." className="flex-1 bg-transparent border-none outline-none text-xs font-medium px-1 text-gray-700 min-w-0" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0 ${newMessage.trim() || selectedFile ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} disabled={!newMessage.trim() && !selectedFile}>
                  <SendHorizonal size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- colonne droite: Profil (Inchangé, comme demandé) --- */}
      <div className="hidden lg:flex w-64 rounded-3xl bg-white border border-[#ECEEF5] flex-col overflow-y-auto">
        {selectedContact ? (
            <div className="p-6 flex flex-col gap-8">
            {/* Profil Header */}
            <div className="flex flex-col items-center text-center">
                <Avatar
                  src={selectedContact.photo}
                  baseUrl={baseUrl}
                  alt={selectedContact.nom}
                  size={24}
                  className="w-14 h-14 rounded-full mb-4 border-4 border-white shadow-sm bg-indigo-50"
                  iconClassName="text-indigo-500"
                />
                <h3 className="text-lg font-bold text-[#1A1D2E] leading-tight">
                  {selectedContact.nom} {selectedContact.prenom}
                </h3>
                <p className="text-[12px] font-medium text-green-500 mt-1">
                Online
                </p>
            </div>

            <div className="h-px bg-[#ECEEF5] w-full" />

            {/* Information Section */}
            <div className="space-y-5">
                <h4 className="text-[13px] font-bold text-[#1A1D2E]">Information</h4>
                
                <div className="space-y-4">
                

                <div className="flex items-center gap-3 text-[#9CA3AF]">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-blue-400" />
                    </div>
                    <p className="text-[12.5px] text-slate-500">{selectedContact.contact}</p>
                </div>

                <div className="flex items-center gap-3 text-[#9CA3AF]">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-blue-400" />
                    </div>
                    <p className="text-[12.5px] text-slate-500 truncate">
                    {selectedContact.email || "etudiant.test@example.com"}
                    </p>
                </div>
                </div>
            </div>

            {/* Order Details Style Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <h4 className="text-[13px] font-bold text-[#1A1D2E]">Formation Details</h4>
                
                </div>

                <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-400">Date:</span>
                    <span className="text-[12px] font-semibold text-slate-700">2 Feb, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-400">Formations:</span>
                    <span className="text-[12px] font-semibold text-slate-700">
                    {selectedContact.allFormations?.length || 0}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-400">Status:</span>
                    <span className="text-[11px] font-bold uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Active
                    </span>
                </div>
                </div>
            </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <Search size={24} />
            </div>
            <p className="text-xs text-slate-400 italic">
                Sélectionnez un étudiant pour voir son profil complet
            </p>
            </div>
        )}
        </div>
    </div>
  );
};

export default Message;