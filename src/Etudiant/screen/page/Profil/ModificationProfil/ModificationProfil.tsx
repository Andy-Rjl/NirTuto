import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../../lib/api";
import { SuccessAlert } from "./SuccessAlert";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";
import { FormateurDesktopColumn, FormateurMobileStrip } from "./FormateursList";
import { PasswordModal } from "./PasswordModal";
import type { ModalProps, FormData, PasswordData } from "./types";

const EtudProfileEditModal = ({ user, onClose }: ModalProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    contact: user.contact,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [selectedFormateur, setSelectedFormateur] = useState<any | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setCollabPage] = useState(0);

  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordSuccessAlert, setShowPasswordSuccessAlert] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(5 / itemsPerPage);

  const handlePageChange = (dir: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCollabPage((prev) => (prev + dir + totalPages) % totalPages);
      setIsAnimating(false);
    }, 200);
  };

  // Bloquer scroll body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (user.photo) {
      setProfileImage(`${API_URL.replace('/api', '')}/${user.photo}`);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/etudiant/mes-formations`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        setInscriptions(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error("Erreur Fetch:", err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append('nom', formData.nom);
      fd.append('prenom', formData.prenom);
      fd.append('email', formData.email);
      fd.append('contact', formData.contact);
      if (selectedFile) fd.append('photo', selectedFile);

      const res = await fetch(`${API_URL}/etudiant/update-profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccessAlert(true);
      } else {
        alert(`Erreur : ${data.message || "Problème serveur"}`);
      }
    } catch {
      alert("Impossible de contacter le serveur.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/etudiant/update-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          old_password: passwordData.current_password,
          password: passwordData.new_password,
          password_confirmation: passwordData.new_password_confirmation,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowPasswordSuccessAlert(true);
        setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
      } else {
        alert(`Erreur : ${data.message || "Échec de la mise à jour"}`);
      }
    } catch {
      alert("Impossible de contacter le serveur.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const uniqueFormateurs = [...new Map(inscriptions.map(i => [i.nom_formateur, i])).values()];

  const modalHTML = (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4"
      onClick={onClose}
    >
      {showSuccessAlert && (
        <SuccessAlert
          title="Modification de profil réussi !"
          onClose={() => setShowSuccessAlert(false)}
          onContinue={() => { setShowSuccessAlert(false); navigate('/dash'); }}
        />
      )}
      {showPasswordSuccessAlert && (
        <SuccessAlert
          title="Modification de mot de passe réussi !"
          onClose={() => setShowPasswordSuccessAlert(false)}
          onContinue={() => { setShowPasswordSuccessAlert(false); setShowPasswordModal(false); }}
        />
      )}

      {/* CONTENEUR PRINCIPAL */}
      <div
        className="bg-white dark:bg-slate-800 w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[88vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-[#1A234E] p-4 sm:p-6 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-indigo-500 p-2 sm:p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em]">Espace Apprenant</h2>
              <p className="text-[9px] sm:text-[10px] text-indigo-300 font-bold opacity-80 uppercase tracking-tighter hidden sm:block">
                Édition du profil & Formateurs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer group">
            <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 dark:bg-slate-800">
          <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-8 lg:gap-12">

            <ProfileAvatar
              user={user}
              profileImage={profileImage}
              onImageChange={(file, preview) => { setSelectedFile(file); setProfileImage(preview); }}
            />

            <ProfileForm
              formData={formData}
              setFormData={setFormData}
              isUpdating={isUpdating}
              onSave={handleSave}
              onOpenPasswordModal={() => setShowPasswordModal(true)}
            />

            <FormateurDesktopColumn
              formateurs={uniqueFormateurs}
              isAnimating={isAnimating}
              selectedFormateur={selectedFormateur}
              onSelect={setSelectedFormateur}
              onDeselect={() => setSelectedFormateur(null)}
              onPageChange={handlePageChange}
            />

            <FormateurMobileStrip formateurs={uniqueFormateurs} />
          </div>
        </div>

        {/* MODAL MOT DE PASSE */}
        {showPasswordModal && (
          <PasswordModal
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            isUpdating={isUpdatingPassword}
            onSubmit={handlePasswordUpdate}
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </div>
    </div>
  );

  return createPortal(modalHTML, document.body);
};

export default EtudProfileEditModal;