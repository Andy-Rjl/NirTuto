import { FaCheckCircle, FaTimes } from "react-icons/fa";

interface SuccessAlertProps {
  title: string;
  onClose: () => void;
  onContinue: () => void;
}

export const SuccessAlert = ({ title, onClose, onContinue }: SuccessAlertProps) => (
  <>
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[2rem] shadow-2xl flex flex-col items-center px-8 py-10 mx-4"
        style={{ width: '100%', maxWidth: 320, animation: 'successAlertIn 0.35s cubic-bezier(.34,1.56,.64,1) both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Fermer"
        >
          <FaTimes size={14} />
        </button>

        <div
          className="flex items-center justify-center rounded-full mb-6"
          style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #6ee7a0 0%, #34c471 100%)',
            boxShadow: '0 8px 24px rgba(52,196,113,0.35)',
          }}
        >
          <FaCheckCircle size={34} color="white" />
        </div>

        <h2 className="text-[#1a1a2e] text-xl font-bold mb-2 text-center">{title}</h2>

        <button
          onClick={onContinue}
          className="w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'transparent', border: '2px solid #e2e8f0', color: '#4a5568' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#34c471';
            (e.currentTarget as HTMLButtonElement).style.color = '#34c471';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
            (e.currentTarget as HTMLButtonElement).style.color = '#4a5568';
          }}
        >
          Continuer
        </button>
      </div>
    </div>
    <style>{`
      @keyframes successAlertIn {
        from { opacity: 0; transform: scale(0.85) translateY(16px); }
        to   { opacity: 1; transform: scale(1)    translateY(0); }
      }
    `}</style>
  </>
);