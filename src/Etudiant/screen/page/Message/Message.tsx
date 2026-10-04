import { useState, useRef, useEffect } from 'react';
import Sidebar from './../../Component/Sidebar';
import { SendHorizonal, Search, Paperclip, X, FileText, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { API_URL } from '../../../../lib/api';
import bgMessage from './../../../assets/images/chatM.png';

interface Message {
  id: number;
  sender_id: number;
  sender_type: string;
  content: string;
  file_url?: string;
  file_type?: "image" | "pdf" | "archive" | "file";
  created_at: string;
}

interface Instructor {
  id: number;
  nom: string;
  email: string;
  last_seen: string;
  photo: string;
  formations: { id: number; titre: string }[];
  // --- Nouveaux champs attendus depuis l'API /users ---
  unread_count?: number;      // nombre de messages non lus envoyés par ce contact
  last_message_at?: string;   // date du dernier message (envoyé OU reçu) avec ce contact
}

const Messagerie = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [activeChat, setActiveChat] = useState<Instructor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- Tri des contacts : dernier message en premier ---
  const sortInstructors = (list: Instructor[]) => {
    return [...list].sort((a, b) => {
      const dateA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
      const dateB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
      return dateB - dateA; // le plus récent en premier
    });
  };

  const fetchInstructors = async () => {
  if (!token) return;
  try {
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

    const [usersRes, unreadRes, lastRes] = await Promise.all([
      fetch(`${API_URL}/users`, { headers }),
      fetch(`${API_URL}/notifications/unread`, { headers }),
      fetch(`${API_URL}/messages/last-per-contact`, { headers }),
    ]);

    if (!usersRes.ok) return;
    const users = await usersRes.json();
    const unread = unreadRes.ok ? (await unreadRes.json()).counts : {};
    const lastData = lastRes.ok ? await lastRes.json() : { last_messages: {} };
    const lastMsgs = lastData.last_messages ?? {};

    const merged = users.map((u: { id: number; }) => ({
      ...u,
      unread_count: unread[u.id] ?? 0,
      last_message_at: lastMsgs[u.id] ?? null,
    }));

    setInstructors(_prev => {
      const withActiveReset = merged.map((inst: { id: number; }) =>
        activeChat && inst.id === activeChat.id ? { ...inst, unread_count: 0 } : inst
      );
      return sortInstructors(withActiveReset);
    });
  } catch (err) { console.error("Erreur instructors:", err); }
};

  useEffect(() => {
    fetchInstructors();
    // On rafraîchit la liste régulièrement pour mettre à jour l'ordre et les badges
    // même quand aucune conversation n'est ouverte
    const interval = setInterval(fetchInstructors, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!activeChat || !token) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/messages/${activeChat.id}`, {
          headers: { Authorization: `Bearer ${token}`, "Accept": "application/json" }
        });
        if (res.ok) setMessages(await res.json());
      } catch (err) { console.error("Erreur messages:", err); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [activeChat, token]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !activeChat) return;
    const formData = new FormData();
    formData.append("receiver_id", activeChat.id.toString());
    formData.append("content", newMessage);
    if (selectedFile) formData.append("file", selectedFile);
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data]);
        setNewMessage("");
        setSelectedFile(null);
        // Fait remonter ce contact en tête de liste immédiatement
        setInstructors(prev =>
          sortInstructors(prev.map(inst =>
            inst.id === activeChat.id ? { ...inst, last_message_at: new Date().toISOString() } : inst
          ))
        );
      }
    } catch (err) { console.error("Erreur envoi:", err); }
  };

  const checkIsOnline = (lastSeen: string) => {
    if (!lastSeen) return false;
    return (new Date().getTime() - new Date(lastSeen).getTime()) / 60000 < 5;
  };

  const filteredInstructors = instructors.filter(i => i.nom.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectChat = async (instructor: Instructor) => {
    setActiveChat(instructor);
    setShowChat(true);

    // Remise à zéro immédiate côté UI
    setInstructors(prev =>
      prev.map(inst => inst.id === instructor.id ? { ...inst, unread_count: 0 } : inst)
    );

    // Marquer comme lu côté serveur (adapte l'URL/méthode à ton API)
    if (token) {
      try {
        await fetch(`${API_URL}/messages/${instructor.id}/read`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Accept": "application/json" }
        });
      } catch (err) { console.error("Erreur marquage lu:", err); }
    }
  };

  const handleBackToList = () => { setShowChat(false); };

  return (
    <div className="flex h-[100svh] bg-[#E4ECF7] dark:bg-slate-950 font-sans overflow-hidden text-gray-800 dark:text-slate-200 transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 lg:ml-64 flex overflow-hidden bg-[#E4ECF7] dark:bg-slate-950 min-w-0 p-2 sm:p-4 gap-4">

        {/* Liste formateurs - Nouveau Design Maquette */}
        <div className={`w-full sm:w-[320px] lg:w-[350px] xl:w-[390px] h-full flex flex-col bg-[#EDF3FA] dark:bg-slate-900 rounded-[2rem] shadow-sm flex-shrink-0 ${showChat ? 'hidden sm:flex' : 'flex'}`}>
          
          {/* Header de la liste */}
          <div className="p-5 pb-3">
            {/* Barre de Recherche épurée */}
            <div className="relative mb-5 mt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70 dark:text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FCFDFE] dark:bg-slate-800 rounded-full py-3 pl-12 pr-4 text-sm font-medium text-gray-700 dark:text-slate-200 outline-none shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-300 transition-all"
              />
            </div>

          </div>

          {/* Conteneur des cartes de formateurs */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map((instructor) => {
                const isSelected = activeChat?.id === instructor.id;
                const isOnline = checkIsOnline(instructor.last_seen);
                const unreadCount = instructor.unread_count ?? 0;
                const hasUnread = unreadCount > 0 && !isSelected;

                return (
                  <div
                    key={instructor.id}
                    onClick={() => handleSelectChat(instructor)}
                    className={`p-4 rounded-[1.8rem] flex items-center gap-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#7FA9FB] text-white shadow-md shadow-blue-200/50 dark:shadow-none'
                        : 'bg-[#FCFDFE] dark:bg-slate-800 text-gray-800 hover:bg-white/80 dark:hover:bg-slate-750 shadow-sm'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full border-2 border-white/80 shadow-sm overflow-hidden bg-gray-100">
                        <img 
                          src={`${API_URL.replace('/api', '')}/${instructor.photo}`} 
                          alt={instructor.nom.charAt(0)} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      {/* Statut En ligne / Hors ligne */}
                      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-400'}`} />
                    </div>

                    {/* Informations textuelles */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm text-left font-bold truncate ${isSelected ? 'text-white' : 'text-gray-800 dark:text-slate-100'}`}>
                          {instructor.nom}
                        </h4>
                        <span className={`text-[10px] shrink-0 font-medium ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                          {isOnline ? 'Active' : 'Offline'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs text-left truncate ${isSelected ? 'text-white/80 font-normal' : 'text-gray-500 dark:text-slate-400 font-medium'}`}>
                          {instructor.formations?.[0]?.titre || "Formateur spécialisé"}
                        </p>
                        {/* Badge messages non lus */}
                        {hasUnread && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 dark:text-slate-500 text-center pt-8 font-medium">Aucun formateur trouvé.</p>
            )}
          </div>
        </div>

        {/* Zone chat */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm overflow-hidden min-w-0 ${showChat ? 'flex' : 'hidden sm:flex'}`}>
          {activeChat ? (
            <>
              {/* Header chat */}
              <div className="p-4 flex items-center gap-3 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 shadow-sm z-10">
                <button onClick={handleBackToList} className="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300 flex-shrink-0">
                  <ArrowLeft size={18} />
                </button>
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-indigo-600 overflow-hidden">
                    <img src={`${API_URL.replace('/api', '')}/${activeChat.photo}`} alt={activeChat.nom.charAt(0)} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-slate-800 rounded-full ${checkIsOnline(activeChat.last_seen) ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm leading-tight">{activeChat.nom}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{checkIsOnline(activeChat.last_seen) ? 'En ligne' : 'Hors ligne'}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 bg-[#cce2f8] dark:bg-slate-900"
              >
                {messages.map((m) => {
                  const isMe = String(m.sender_type) === "App\\Models\\Authentifications";
                  const baseUrl = API_URL.replace('/api', '');
                  const fileFullUrl = m.file_url ? `${baseUrl}/storage/${m.file_url}` : null;

                  return (
                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-2.5 shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-br from-[#5BA3D3] to-[#4082B5] text-white rounded-[18px] rounded-tr-none'
                          : 'bg-[#EBEDF0] dark:bg-slate-700 text-[#2D3748] dark:text-slate-200 rounded-[18px] rounded-tl-none border border-gray-100 dark:border-slate-600'
                      }`}>

                        {/* Image jointe */}
                        {fileFullUrl && m.file_type === "image" && (
                          <a href={fileFullUrl} target="_blank" rel="noopener noreferrer" className="block mb-2">
                            <img
                              src={fileFullUrl}
                              alt="image"
                              className="max-w-[220px] max-h-[300px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition"
                            />
                          </a>
                        )}

                        {/* Fichier PDF */}
                        {fileFullUrl && m.file_type === "pdf" && (
                          <a
                            href={fileFullUrl}
                            target="_blank"
                            download
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition ${
                              isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-50 dark:bg-red-900/30 text-red-600'
                            }`}
                          >
                            <FileText size={14} />
                            <span className="truncate max-w-[160px]">{m.file_url?.split('/').pop()}</span>
                          </a>
                        )}

                        {/* Archives */}
                        {fileFullUrl && m.file_type === "archive" && (
                          <a
                            href={fileFullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition ${
                              isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600'
                            }`}
                          >
                            <FileText size={14} />
                            <span className="truncate max-w-[160px]">{m.file_url?.split('/').pop()}</span>
                          </a>
                        )}

                        {/* Autre fichier */}
                        {fileFullUrl && m.file_type === "file" && (
                          <a
                            href={fileFullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition ${
                              isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-100 dark:bg-slate-600 text-gray-600'
                            }`}
                          >
                            <Paperclip size={14} />
                            <span className="truncate max-w-[160px]">{m.file_url?.split('/').pop()}</span>
                          </a>
                        )}

                        {m.content && <p className="text-sm font-medium leading-snug">{m.content}</p>}
                      </div>

                      <span className="text-[9px] text-gray-400 dark:text-slate-500 mt-1 font-bold px-1">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Formulaire d'envoi */}
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
                {selectedFile && (
                  <div className="mb-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm">
                        {selectedFile.type.includes('image') ? (
                          <ImageIcon size={14} className="text-blue-500" />
                        ) : (
                          <FileText size={14} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-800 dark:text-slate-200 truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {selectedFile.size < 1024 * 1024
                            ? `${Math.round(selectedFile.size / 1024)} Ko`
                            : `${(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo`}
                        </p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <X size={10} className="text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-gray-50 dark:bg-slate-900 px-3 py-2 rounded-2xl border border-gray-100 dark:border-slate-700 focus-within:bg-white focus-within:border-blue-300 transition-all">
                  <input type="file" className="hidden" ref={fileInputRef}
                    accept="image/*,application/pdf,.zip,.rar"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-blue-500 shadow-sm transition-all flex-shrink-0"
                  >
                    <Paperclip size={14} />
                  </button>

                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none outline-none text-xs font-medium px-2 text-gray-700 dark:text-slate-200 min-w-0"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />

                  <button
                    type="submit"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 flex-shrink-0 ${
                      newMessage.trim() || selectedFile
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-gray-300 cursor-not-allowed'
                    }`}
                    disabled={!newMessage.trim() && !selectedFile}
                  >
                    <SendHorizonal size={14} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-slate-600">
              <SendHorizonal size={40} className="opacity-20 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Sélectionnez une discussion</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messagerie;