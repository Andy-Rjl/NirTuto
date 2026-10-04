import logo from "./../../../assets/images/nir'info.png";

interface Cours {
  id: number;
  titre: string;
  prix: number;
}

interface FactureType {
  contact: string;
  numero: string;
  date_inscription: string;
  client: string;
  email: string;
  cours: Cours[];
  total: number;
  statut: "Payé" | "En attente";
  methode?: string;
}

interface FactureDetailProps {
  selectedFacture: FactureType;
  onBack: () => void;
}

const FactureDetail = ({ selectedFacture, onBack }: FactureDetailProps) => {
  return (
    <>
      {/* Boutons header (retour + imprimer) */}
      <div className="flex w-full sm:w-auto gap-2">
        <button
          onClick={onBack}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-bold transition-all"
        >
          ← Liste
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 sm:flex-none bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-100 text-sm font-bold"
        >
          Imprimer
        </button>
      </div>

      {/* DÉTAIL FACTURE */}
      <div id='facture-a-imprimer' className="max-w-4xl mx-auto mb-10 mt-6">
        <div className="overflow-x-auto">
          <div
            className="bg-white shadow-xl border border-slate-200 flex flex-col p-6 sm:p-8 md:p-12 text-slate-800 font-sans relative overflow-hidden"
            style={{ minWidth: '320px' }}
          >
            {/* HEADER FACTURE */}
            <div className="relative mb-6 sm:mb-8 flex justify-between">
              <div className="flex flex-col items-start gap-3 sm:gap-4 mb-4">
                <img src={logo} alt="Logo Nir'Info" className="h-10 sm:h-14 md:h-16 w-auto object-contain" />
                <div className="space-y-1 flex flex-col items-start">
                  <p><span className="font-semibold">Nom:</span> Tuto-Info Madagascar</p>
                  <p><span className="font-semibold">Contact:</span> +261 34 70 840 46</p>
                  <p><span className="font-semibold">Adresse:</span> Cité Ampefiloha lgt 223, Antananarivo</p>
                  <p><span className="font-semibold">Email:</span> contact.nirinfo@gmail.com</p>
                  <p><span className="font-semibold">Site Web:</span> https://nir-info.mg</p>
                </div>
              </div>

              {/* Date + N° reçu */}
              <div className="flex flex-col gap-2 sm:gap-0 text-xs sm:text-sm">
                <div className="flex gap-2 justify-between mt-10">
                  <span className="font-semibold">Date de paiement :</span>
                  <span className="border-b border-slate-400 min-w-[120px] sm:min-w-[150px]">
                    {selectedFacture.date_inscription || "12 Mars 2026"}
                  </span>
                </div>
                <div className="flex gap-2 justify-between">
                  <span className="font-semibold">N° de reçu :</span>
                  <span className="border-b border-slate-400 min-w-[120px] sm:min-w-[150px] mb-10">
                    {selectedFacture.numero}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">Facturé à :</h3>
                  <div className="space-y-1 flex flex-col items-start">
                    <p><span className="font-semibold">Nom:</span> {selectedFacture.client}</p>
                    <p><span className="font-semibold">Email:</span> {selectedFacture.email}</p>
                    <p><span className="font-semibold">Contact:</span> {selectedFacture.contact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLEAU ARTICLES */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-300">
                    <th className="p-2 sm:p-3 border-r border-slate-300 w-1/2 text-left">Désignation</th>
                    <th className="p-2 sm:p-3 border-r border-slate-300 text-left">Cout de formations</th>
                    <th className="p-2 sm:p-3 border-r border-slate-300 text-left">Cout à payer</th>
                    <th className="p-2 sm:p-3 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFacture.cours.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200">
                      <td className="p-2 sm:p-3 border-r border-slate-300 font-medium text-left">{item.titre}</td>
                      <td className="p-2 sm:p-3 border-r border-slate-300 text-left">{item.prix.toLocaleString()} AR</td>
                      <td className="p-2 sm:p-3 border-r border-slate-300 text-left">{item.prix.toLocaleString()} AR</td>
                      <td className="p-2 sm:p-3 text-left">{item.prix.toLocaleString()} AR</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTAUX */}
              <div className="flex justify-end mt-0">
                <table className="w-1/2 border-l border-b border-r border-slate-300 text-xs sm:text-sm">
                  <tbody>
                    <tr>
                      <td className="p-2 w-1/2 font-semibold text-left">Sous-total</td>
                      <td className="p-2 border-r w-1/4 border-slate-300"></td>
                      <td className="p-2 text-left">{selectedFacture.total.toLocaleString()} AR</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold flex justify-between text-right">
                        Taux de taxe <span>0%</span>
                      </td>
                      <td className="p-3 border-r w-1/4 border-slate-300"></td>
                      <td className="p-2 text-left">0 AR</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2 font-bold text-left">Total Payé</td>
                      <td className="p-3 border-r w-1/4 border-slate-300"></td>
                      <td className="p-2 font-bold text-left">{selectedFacture.total.toLocaleString()} AR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOOTER FACTURE */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold mb-2 underline">Mode de paiement :</h4>
                <p>Mobile Money</p>
                <p className="mt-4 text-xs italic text-slate-500">
                  Merci d'avoir choisi Tuto-Info Madagascar !<br />
                  Au plaisir de vous revoir bientôt.
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-bold mb-4">Autorisé par :</h4>
                <p className="font-bold mb-4">MAMINIRINA MIHARISOA</p>
                <div className="w-48 sm:w-64 border-t border-slate-400 pt-2 text-xs sm:text-sm">
                  Responsable Nir'Info
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default FactureDetail;