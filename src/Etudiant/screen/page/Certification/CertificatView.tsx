import { motion } from 'framer-motion';
import { ChevronLeft, Download } from 'lucide-react';
import logo from "./../../../assets/images/nir'info.png";
import fond from './../../../assets/images/certificate.png';

interface CertificatViewProps {
  selectedCert: any;
  setViewDetail: (value: boolean) => void;
  handleDownload: () => void;
}

export const CertificatView = ({ selectedCert, setViewDetail, handleDownload }: CertificatViewProps) => {

  const formaterDateEnLettres = (dateString: string | number | Date) => {
    if (!dateString) return "Date non spécifiée";
    
    const date = new Date(dateString);
    
    // On vérifie si la date est valide
    if (isNaN(date.getTime())) return "Date invalide";

    // Options pour avoir le jour, le mois en toutes lettres et l'année
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="w-full flex justify-end">
        <button
          onClick={() => setViewDetail(false)}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-4 py-2 font-medium text-xs transition-all shadow-2xs"
        >
          <ChevronLeft size={14} /> Retour à la liste
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <div
          id="certificat-a-imprimer"
          className="bg-white rounded-none relative overflow-hidden border border-slate-300 mx-auto"
          style={{ aspectRatio: '1.414 / 1', minWidth: '320px', maxWidth: '860px' }}
        >
          {/* Fond en tant que vraie image, imprimée systématiquement */}
          <img
            src={fond}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative p-8 h-full flex flex-col items-center justify-between text-[#1a1a1a]">
            <div className="w-full flex mt-5 justify-center">
              <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
            </div>
            <div className="text-center">
              <h3 className="text-[36px] font-serif text-slate-800">
                CERTIFICAT
              </h3>
              <div className='flex justity-center'>
                <div className="w-16 h-[2px] bg-[#bd7407] mt-3 mx-auto" />
                <p className='mx-11 font-serif'>DE REUSSITE</p>
                <div className="w-16 h-[2px] bg-[#bd7407] mt-3 mx-auto" />
              </div>
            </div>
            <div className="flex flex-col items-center text-center px-6 w-full">
              <p className="font-bold text-sm sm:text-xl md:text-xl text-slate-900">
                {selectedCert.nom.toUpperCase()} {selectedCert.prenom}{' '}
              </p>
              <div className='w-[350px] h-[2px] mt-2 bg-black' />
              <span className="text-xs sm:text-sm font-normal text-slate-600 mb-10">
                Né(e) le {formaterDateEnLettres(selectedCert.date_Naissance)} à {selectedCert.lieu_Naissance}
              </span>
              <p className="text-xs sm:text-sm md:text-base font-serif">
                A réussi avec succès la formation
              </p>
              
              <p className="text-xs sm:text-sm md:text-base">
                <span className="font-bold text-blue-800 uppercase text-2xl">{selectedCert.formation}</span>
              </p>
              <p>Le : {formaterDateEnLettres(selectedCert.date_de_delivrance)}</p>
            </div>
            <div className="w-full flex justify-between items-end px-6">
              <div className="text-center mb-20">
                <p className="text-[10px] sm:text-xs uppercase mb-5 text-slate-900">L'impetrant(e)</p>
                <div className="w-28 h-[1px] bg-slate-900 mx-auto" />
              </div>
              <div className="text-center mb-16">
                <p className="text-[10px] sm:text-xs uppercase mb-5 text-slate-900">Le directeur</p>
                <div className="w-28 h-[1px] bg-slate-900 mx-auto" />
                <p>MIHARISOA Maminirina</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 text-white px-8 py-3.5 bg-slate-800 hover:bg-slate-900 transition-all font-medium text-xs uppercase tracking-widest shadow-2xs"
      >
        <Download size={16} /> Télécharger en PDF
      </button>
    </motion.div>
  );
};