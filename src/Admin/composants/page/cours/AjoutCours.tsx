import React, { useEffect, useState } from "react";
import { FaSave, FaVideo, FaTimes } from "react-icons/fa"; // 1. Importation de FaTimes
import { API_URL } from "../../../lib/api";

interface AjoutCoursProps {
  cours: {
    titre: string;
    formation_id: string;
    description: string;
    duree: string;
    url_youtube: string;
    video_path?: string;
  };
  formations: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearVideo: () => void; // 2. Nouvelle prop pour vider la vidéo dans le state parent
  handleSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
  videoFile: File | null;
  isSubmitting?: boolean;
  uploadProgress?: number;
}

const AjoutCours: React.FC<AjoutCoursProps> = ({
  cours,
  formations,
  handleChange,
  handleFileChange,
  handleClearVideo, // Récupération de la prop
  handleSubmit,
  isEditing = false,
  videoFile,
  isSubmitting = false,
  uploadProgress = 0
}) => {
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Gère proprement la création et le nettoyage de l'URL d'aperçu de la vidéo
  useEffect(() => {
    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      setPreviewVideoUrl(objectUrl);

      // Nettoyage de la mémoire lorsque le composant se démonte ou que le fichier change
      return () => URL.revokeObjectURL(objectUrl);
    } else if (cours.video_path) {
      setPreviewVideoUrl(`${API_URL.replace("/api", "")}/storage/${cours.video_path}`);
    } else {
      setPreviewVideoUrl(null);
    }
  }, [videoFile, cours.video_path]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 font-sans antialiased text-[#333333]">
      {/* ── HEADER DE LA PAGE ── */}
      <div className="w-full mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#303972]">
            {isEditing ? "Modifier le cours" : "Ajouter un cours"}
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A3BD] mt-1">
            {isEditing ? "Ajustez les informations et le contenu vidéo du cours" : "Renseignez les informations du nouveau cours"}
          </p>
        </div>
      </div>

      {/* ── FORMULAIRE PRINCIPAL STYLE AKADEMI ── */}
      <form onSubmit={handleSubmit} className="w-full mx-auto space-y-8 pb-12">
        
        {/* SECTION : Informations Générales */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#EBF0FF]">
          <div className="bg-[#5A57D6] px-6 py-4">
            <h2 className="text-white font-semibold text-base">Informations Générales</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Ligne 1 : Titre du cours */}
            <div>
              <label className="text-left block text-sm font-bold text-[#303972] mb-2">
                Titre du cours <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titre"
                value={cours.titre}
                onChange={handleChange}
                placeholder="Ex: Introduction à React"
                className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Ligne 2 : Formation & Durée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-left block text-sm font-bold text-[#303972] mb-2">
                  Formation associée <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="formation_id"
                    value={cours.formation_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all appearance-none"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" className="text-[#A0A3BD]">Sélectionner une formation</option>
                    {formations && formations.length > 0 ? (
                      formations.map((f) => (
                        <option key={f.id} value={f.id}>{f.titre}</option>
                      ))
                    ) : (
                      <option disabled>Aucune formation disponible</option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#303972]">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-left block text-sm font-bold text-[#303972] mb-2">Durée</label>
                <input
                  type="text"
                  name="duree"
                  value={cours.duree}
                  onChange={handleChange}
                  placeholder="MM:SS"
                  className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Ligne 3 : Description */}
            <div>
              <label className="text-left block text-sm font-bold text-[#303972] mb-2">Description</label>
              <textarea
                name="description"
                value={cours.description}
                onChange={handleChange}
                rows={4}
                placeholder="Ajoutez un résumé ou des détails sur ce cours..."
                className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* SECTION : Vidéo & Médias */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#EBF0FF]">
          <div className="bg-[#5A57D6] px-6 py-4">
            <h2 className="text-white font-semibold text-base">Contenu Vidéo</h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Zone d'Upload */}
            <div>
              <label className="block text-sm text-left font-bold text-[#303972] mb-2">Vidéo du cours</label>
              <label 
                htmlFor="video-upload"
                className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[#C1BBEB] rounded-2xl transition-all group ${isSubmitting ? "cursor-not-allowed opacity-50 bg-[#F3F4F9]" : "cursor-pointer hover:border-[#5A57D6] hover:bg-[#5A57D6]/5"}`}
              >
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  <svg className="w-10 h-10 text-[#A0A3BD] group-hover:text-[#5A57D6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-[#303972] group-hover:text-[#5A57D6] transition-colors">
                    {videoFile ? `Prêt : ${videoFile.name.substring(0, 22)}${videoFile.name.length > 22 ? "..." : ""}` : "Glissez ou cliquez pour sélectionner"}
                  </span>
                  <span className="text-xs text-[#A0A3BD]">Formats vidéo acceptés (mp4, avi...)</span>
                </div>
              </label>
              <input 
                id="video-upload"
                type="file" 
                accept="video/*" 
                onChange={handleFileChange} 
                className="hidden" 
                disabled={isSubmitting} 
              />
            </div>

            {/* Zone de Preview Vidéo & Bouton Supprimer */}
            <div>
              <label className="text-left block text-sm font-bold text-[#303972] mb-2">Aperçu du média</label>
              {previewVideoUrl ? (
                // L'ajout de relative permet de positionner le bouton X de manière absolue par rapport à ce conteneur
                <div className="relative border border-[#EBF0FF] w-full h-44 rounded-2xl overflow-hidden bg-slate-900 aspect-video group">
                  <video key={previewVideoUrl} src={previewVideoUrl} controls className="w-full h-44 object-contain" />
                  
                  {/* Bouton X de suppression */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleClearVideo}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    title="Supprimer la vidéo sélectionnée"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#EBF0FF] rounded-2xl h-44 flex flex-col items-center justify-center bg-[#FDFDFF] text-[#A0A3BD]">
                  <FaVideo size={28} className="mb-2 opacity-60" />
                  <p className="text-xs">Aucune vidéo sélectionnée pour le moment</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <div>
                <label className="text-left block text-sm font-bold text-[#303972] mb-2">
                  Lien YouTube <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="url_youtube"
                  value={cours.url_youtube}
                  onChange={handleChange}
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-white border border-[#C1BBEB] rounded-xl text-sm text-[#303972] placeholder-[#A0A3BD] focus:outline-none focus:border-[#5A57D6] focus:ring-1 focus:ring-[#5A57D6] transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Affichage de la progression globale */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="px-6 pb-6">
              <div className="flex justify-between items-center mb-1 text-xs font-bold text-[#5A57D6]">
                <span>Téléversement de la vidéo par morceaux</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#EBF0FF] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#5A57D6] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── BOUTONS D'ACTION ── */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            className="px-6 py-3 border border-[#5A57D6] text-[#5A57D6] text-sm font-bold rounded-full hover:bg-[#5A57D6]/5 transition-all disabled:opacity-50"
          >
            Sauvegarder comme brouillon
          </button>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 text-white text-sm font-bold rounded-full shadow-md transition-all ${
              isSubmitting ? "bg-slate-400 cursor-not-allowed shadow-none" : "bg-[#5A57D6] hover:bg-[#4845B4]"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>
                  {uploadProgress > 0 && uploadProgress < 100 
                    ? `Envoi : ${uploadProgress}%` 
                    : "Traitement..."
                  }
                </span>
              </>
            ) : (
              <>
                <FaSave size={14} /> 
                <span>{isEditing ? "Enregistrer les modifications" : "Soumettre"}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AjoutCours;