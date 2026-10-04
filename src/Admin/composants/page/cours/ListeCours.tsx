import React from "react";
import { FaEdit, FaTrash, FaLayerGroup, FaChevronRight, FaChevronDown, FaClock } from "react-icons/fa";

interface Cours {
  id: number;
  titre: string;
  video_path: string;
  duree: string;
  description: string;
  url_youtube: string;
}

interface Formation {
  id: number;
  titre: string;
  cours: Cours[];
}

interface ListeCoursProps {
  formation: Formation[];
  expandedId: string | number | null;
  toggleFormation: (id: string | number) => void;
  // Modifié ici pour passer l'objet cours ou l'ID au parent lors du clic sur supprimer
  setShowDeleteModal: (cours: Cours | boolean) => void; 
  onEditCours: (cours: Cours, formationId: number) => void;
}

const ListeCours: React.FC<ListeCoursProps> = ({ 
  formation, 
  expandedId, 
  toggleFormation, 
  setShowDeleteModal,
  onEditCours 
}) => {
  return (
    <>
      {formation.length === 0 ? (
        <p className="no-data" style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
          Aucune formation trouvée ou erreur de connexion.
        </p>
      ) : (
        formation.map(f => (
          <div key={f.id} className="bg-white mb-4 border border-slate-100 shadow-xl overflow-hidden">
            <div onClick={() => toggleFormation(f.id)} className="flex h-10 items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 text-indigo-600 rounded-2xl p-2 flex items-center justify-center">
                  <FaLayerGroup size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[15px]">{f.titre}</span>
                  <span className="text-sm text-slate-500">{f.cours?.length || 0} cours disponibles</span>
                </div>
              </div>
              <div className="text-slate-400">
                {expandedId === f.id ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            </div>
            
            {expandedId === f.id && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-6">Détails du Cours</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Durée</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y h-10 divide-slate-50">
                  {f.cours && f.cours.length > 0 ? (
                    f.cours.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{c.titre}</span>
                            {c.description && <span className="text-xs text-slate-400 line-clamp-1">{c.description}</span>}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="flex items-center gap-2 text-[10px] font-bold">
                            {c.video_path ? (
                              <span style={{ color: '#2ecc71' }}>● Vidéo chargée</span>
                            ) : c.url_youtube ? (
                              <span style={{ color: '#2ecc71' }}>● Lien youTube</span>
                            ):(
                              <span style={{ color: '#e74c3c' }}>○ Sans vidéo</span>
                            )}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-[11px] font-medium text-slate-500 italic">
                          <FaClock size={12} className="inline mr-1" /> {c.duree || "N/A"}
                        </td>
                        <td className="px-8 py-5 text-right flex justify-end gap-2">
                          {/* Bouton Modifier */}
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onEditCours(c, f.id); 
                            }} 
                            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            <FaEdit size={14} />
                          </button>
                          
                          {/* Bouton Supprimer lié au cours actuel */}
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setShowDeleteModal(c); // On envoie le cours complet pour la suppression
                            }} 
                            className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                        Aucun cours pour cette formation
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </>
  );
};

export default ListeCours;