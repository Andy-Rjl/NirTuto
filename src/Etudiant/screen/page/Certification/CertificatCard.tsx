
interface Certificat {
  id: string;
  formation: any;
  date_de_delivrance: any;
}

interface CertificatCardProps {
  cert: Certificat;
  onOpen: (cert: any) => void;
}

export const CertificatCard = ({ cert, onOpen }: CertificatCardProps) => {
  return (
    <div className="bg-white border border-slate-200 p-3.5 flex items-center justify-between shadow-2xs">
      <div className="min-w-0 pr-2">
        <p className="text-xs font-bold text-slate-800 truncate">{cert.formation}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          ID: {cert.id} • date du: {cert.date_de_delivrance ? new Date(cert.date_de_delivrance as string).toLocaleDateString('fr-FR') : '—'}
        </p>
      </div>
      <button
        onClick={() => onOpen(cert)}
        className="text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors bg-emerald-50 px-3 py-1.5"
      >
        Voir
      </button>
    </div>
  );
};