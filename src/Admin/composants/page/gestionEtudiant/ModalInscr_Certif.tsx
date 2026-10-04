import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, CreditCard, Phone, CheckCircle, Award, Calendar, MapPin, Clock } from "lucide-react";

interface ModalInscriptionCertifProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  modalMode: "validation" | "formulaire";
  setModalMode: (mode: "validation" | "formulaire") => void;
  demandes: any[];
  demande: any[];
  handleValider: (id: number) => void;
  handleValide: (id: number) => void;
  handleRefuse: (id: number) => void;         
  handleRejeterCertif: (id: number) => void;   
  setPendingRequests: (arg0: (prev: any) => any) => void;
  setDemande: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (message: string, type: "success" | "error" | "confirm", onConfirm?: () => void) => void;
}

const ModalInscriptionCertif = ({
  isModalOpen, setIsModalOpen, modalMode, setModalMode,
  demandes, demande, handleValider, handleValide,
  handleRefuse, handleRejeterCertif, showToast,
}: ModalInscriptionCertifProps) => {

  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: ""
  });

  const triggerSuccessAlert = (message: string) => {
    setCustomAlert({ isOpen: true, message });
    setTimeout(() => {
      setCustomAlert({ isOpen: false, message: "" });
    }, 4000);
  };

  const onRefuseInscription = (idInscription: number) => {
    showToast("Voulez-vous vraiment refuser cette inscription ?", "confirm", () => {
      handleRefuse(idInscription);
      triggerSuccessAlert("Inscription refusée avec succès.");
    });
  };

  const onRejeterCertification = (idCertif: number) => {
    showToast("Voulez-vous vraiment refuser ce certificat ?", "confirm", () => {
      handleRejeterCertif(idCertif);
      triggerSuccessAlert("Certificat refusé avec succès.");
    });
  };

  const onValiderInscription = (id: number) => {
    handleValider(id);
    triggerSuccessAlert("Inscription validée avec succès !");
  };

  const onConfirmerCertification = (id: number) => {
    handleValide(id);
    triggerSuccessAlert("Certification validée avec succès !");
  };

  // ── AJOUT : Filtrer les inscriptions pour exclure celles qui n'ont pas de coordonnées de paiement complètes ──
  const demandesFiltrees = demandes.filter(
    (ins) => ins.reference_transaction && ins.numero_paiement && ins.methode
  );

  return (
    <>
      {/* Alerte animée de succès */}
      <AnimatePresence>
        {customAlert.isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 right-5 p-6 w-112.5 font-sans z-50"
          >
            <div className="bg-white rounded-[20px] px-5 py-6 flex items-center justify-between shadow-md relative border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 border-2 border-[#2ccba0] rounded-full flex items-center justify-center shrink-0">
                  <Check className="text-[#2ccba0]" size={14} strokeWidth={3} />
                </div>
                <span className="text-[#2ccba0] font-semibold text-[15px]">{customAlert.message}</span>
              </div>
              <button 
                onClick={() => setCustomAlert({ isOpen: false, message: "" })}
                className="absolute -top-4 -right-4 bg-[#2ccba0] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#23b58e] transition-colors shadow-lg"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL PRINCIPAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200/60 relative overflow-hidden z-10"
            >
              <div className="px-6 pt-5 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-xl">
                    <Award size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight">Gestion des demandes</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {modalMode === "validation"
                        ? `${demandesFiltrees.length} inscription${demandesFiltrees.length > 1 ? "s" : ""} en attente`
                        : `${demande.length} certification${demande.length > 1 ? "s" : ""} en attente`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 pb-4">
                <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                  <button
                    onClick={() => setModalMode("validation")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      modalMode === "validation" ? "bg-white text-indigo-600 shadow-sm shadow-slate-200" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Inscriptions
                    {demandesFiltrees.length > 0 && (
                      <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${modalMode === "validation" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                        {demandesFiltrees.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setModalMode("formulaire")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      modalMode === "formulaire" ? "bg-white text-indigo-600 shadow-sm shadow-slate-200" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Certifications
                    {demande.length > 0 && (
                      <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${modalMode === "formulaire" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                        {demande.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 max-h-105 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {modalMode === "validation" ? (
                  <>
                    {/* ── Changement ici : On vérifie le tableau filtré ── */}
                    {demandesFiltrees.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="text-green-500" size={28} />
                        </div>
                        <p className="text-slate-700 font-semibold text-sm">Tout est à jour</p>
                        <p className="text-slate-400 text-xs mt-1">Aucune inscription avec paiement en attente</p>
                      </div>
                    ) : (
                      /* ── Changement ici : Rendu sur demandesFiltrees ── */
                      demandesFiltrees.map((ins: any) => (
                        <motion.div
                          key={ins.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 hover:border-slate-200 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                              {ins.user?.nom?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 text-sm leading-tight">{ins.user?.nom}</p>
                              <p className="text-[11px] text-indigo-500 font-medium truncate">{ins.formation?.titre}</p>
                            </div>
                            <span className="ml-auto shrink-0 flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                              <Clock size={9} /> En attente
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                              <div className="bg-indigo-50 p-1.5 rounded-lg shrink-0">
                                <CreditCard size={12} className="text-indigo-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide leading-none">Référence ({ins.methode})</p>
                                <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5">{ins.reference_transaction}</p>
                              </div>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                              <div className="bg-emerald-50 p-1.5 rounded-lg shrink-0">
                                <Phone size={12} className="text-emerald-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide leading-none">Téléphone</p>
                                <p className="text-[11px] font-bold text-slate-700 mt-0.5">{ins.numero_paiement}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => onValiderInscription(ins.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all text-[11px] font-semibold shadow-sm shadow-indigo-200"
                            >
                              <Check size={13} /> Valider l'inscription
                            </button>
                            <button
                              onClick={() => onRefuseInscription(ins.id)}
                              className="px-3 py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </>
                ) : (
                  <>
                    {demande.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Award className="text-indigo-400" size={28} />
                        </div>
                        <p className="text-slate-700 font-semibold text-sm">Tout est à jour</p>
                        <p className="text-slate-400 text-xs mt-1">Aucune certification en attente</p>
                      </div>
                    ) : (
                      demande.map((d: any) => (
                        <motion.div
                          key={d.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 hover:border-slate-200 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-violet-100 p-2 rounded-xl shrink-0">
                              <Award size={16} className="text-violet-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-800 text-sm">{d.prenom} {d.nom}</p>
                              <p className="text-[11px] text-indigo-500 font-medium truncate">{d.formation}</p>
                            </div>
                            <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                              <Clock size={9} /> En attente
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                              <div className="bg-blue-50 p-1.5 rounded-lg shrink-0">
                                <Calendar size={12} className="text-blue-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide leading-none">Né(e) le</p>
                                <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                                  {new Date(d.date_Naissance).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                              <div className="bg-rose-50 p-1.5 rounded-lg shrink-0">
                                <MapPin size={12} className="text-rose-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide leading-none">Lieu</p>
                                <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5">{d.lieu_Naissance}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => onConfirmerCertification(d.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all text-[11px] font-semibold shadow-sm shadow-violet-200"
                            >
                              <Check size={13} /> Confirmer la certification
                            </button>
                            <button
                              onClick={() => onRejeterCertification(d.id)}
                              className="px-3 py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalInscriptionCertif;