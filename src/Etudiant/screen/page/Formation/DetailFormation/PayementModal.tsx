import { FaCheckCircle, FaTimes } from "react-icons/fa";
import type { Data, PaymentData } from "./types";

interface PaymentModalProps {
  formation: Data;
  paymentData: PaymentData;
  setPaymentData: (data: PaymentData) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const PaymentModal = ({
  formation, paymentData, setPaymentData,
  submitting, onSubmit, onClose,
}: PaymentModalProps) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[1000] p-0 sm:p-4">
    <div className="bg-white w-full sm:max-w-3xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] overflow-y-auto">

      {/* PARTIE GAUCHE — récap paiement */}
      <div
        className="relative w-full md:w-[35%] bg-[#5a4fcf] p-6 text-white flex flex-col justify-between overflow-hidden flex-shrink-0"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(90,79,207,0.96), rgba(67,56,202,0.85)), url('/src/assets/images/mes.jpg')",
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
        >
          <FaTimes size={16} />
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30">
              <FaCheckCircle className="text-white" size={18} />
            </div>
            <h2 className="text-lg font-black leading-tight">Paiement</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/20">
            <p className="text-indigo-100 text-[9px] uppercase font-black tracking-widest mb-1">À payer</p>
            <p className="text-2xl font-black text-white">
              {formation.frais.toLocaleString()} <span className="text-sm opacity-80">Ar</span>
            </p>
            <p className="text-indigo-100 text-[9px] uppercase font-black tracking-widest mt-3 mb-1">vers</p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center bg-black p-2 rounded-xl">
                <span className="font-mono font-black text-white text-sm sm:text-base">034 70 840 46</span>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[10px] text-indigo-200/70 mt-4 leading-snug">
          Vérification manuelle après envoi.
        </p>
      </div>

      {/* PARTIE DROITE — formulaire */}
      <div className="flex-1 p-5 sm:p-8 bg-[#F8FAFC] relative min-w-0">
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-all"
        >
          <FaTimes size={18} />
        </button>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="mb-5">
            <h3 className="text-gray-800 text-base sm:text-lg font-black">Méthode de paiement</h3>
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-tighter mt-1">
              Effectuez le transfert, choisissez votre mode puis remplissez ce formulaire
            </p>
          </div>

          {/* Sélection méthode */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5">
            {[{ id: 'Mvola', name: 'Mvola', img: '/src/assets/images/mvola.jpg' }].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentData({ ...paymentData, methode: method.id })}
                className={`cursor-pointer flex items-center gap-2 p-2 rounded-2xl border-2 transition-all ${
                  paymentData.methode === method.id
                    ? 'border-[#5a4fcf] bg-white shadow-sm scale-[1.02]'
                    : 'border-transparent bg-white hover:bg-gray-50 opacity-80'
                }`}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                  <img src={method.img} alt={method.name} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[10px] font-black truncate ${paymentData.methode === method.id ? 'text-[#5a4fcf]' : 'text-gray-500'}`}>
                  {method.name}
                </span>
              </div>
            ))}
          </div>

          {/* Champs */}
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] uppercase font-black text-gray-400 mb-1.5 ml-1">
                {paymentData.methode === 'Carte' ? 'Détenteur de la carte' : 'Votre numéro'}
              </label>
              <input
                type="text"
                placeholder={paymentData.methode === 'Carte' ? "NOM PRÉNOM" : "03X XX XXX XX"}
                required
                className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-[#5a4fcf]/10 focus:border-[#5a4fcf] outline-none transition-all"
                onChange={(e) => setPaymentData({ ...paymentData, numero_paiement: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-black text-gray-400 mb-1.5 ml-1">
                {paymentData.methode === 'Carte' ? 'Numéro de carte' : 'ID Transaction'}
              </label>
              <input
                type="text"
                placeholder={paymentData.methode === 'Carte' ? "**** **** **** ****" : "Référence"}
                required
                className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-3 text-sm font-bold focus:ring-4 focus:ring-[#5a4fcf]/10 focus:border-[#5a4fcf] outline-none transition-all"
                onChange={(e) => setPaymentData({ ...paymentData, reference_transaction: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-2 bg-gray-100 text-gray-500 text-xs font-black rounded-xl hover:bg-gray-200 transition-all active:scale-95 uppercase tracking-tighter"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-3.5 px-2 bg-[#5a4fcf] text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-100 hover:bg-[#493dbb] transition-all active:scale-95 disabled:bg-gray-300 uppercase tracking-tighter"
            >
              {submitting ? "Vérification..." : "Confirmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);