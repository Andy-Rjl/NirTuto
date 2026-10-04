export interface Data {
  id: number;
  titre: string;
  programme: string;
  description: string;
  video: string;
  type: string;
  categorie: string;
  frais: number;
  duree: number;
  nom_formateur: string;
  difficulte: string;
  admin_id: string;
  url_youtube: string | null;
}

export interface PaymentData {
  numero_paiement: string;
  reference_transaction: string;
  methode: string;
}

export type StatutInscription = 'en_attente' | 'confirme' | null;

export const RICH_CONTENT_STYLES = `
  .rich-content ol { list-style: none; counter-reset: item; padding-left: 0; margin: 0; }
  .rich-content ol li {
    counter-increment: item; display: flex; align-items: center; gap: 12px;
    margin-top: 10px; padding: 10px 14px; border: 1.5px solid rgba(128,128,128,0.18);
    border-radius: 16px; background: #fafbff; position: relative;
  }
  .rich-content ol li::before {
    content: counter(item); display: flex; align-items: center; justify-content: center;
    min-width: 26px; height: 26px; background: #5a4fcf; color: white;
    font-weight: 800; font-size: 11px; border-radius: 50%; flex-shrink: 0;
  }
  .rich-content ul { list-style: none; padding-left: 0; margin: 0; }
  .rich-content ul li {
    display: flex; align-items: flex-start; gap: 10px; margin-top: 8px;
    padding: 9px 14px; border: 1px solid #e9eaf0; border-left: 3px solid #a5b4fc;
    border-radius: 10px; background: #fafbff;
  }
  .rich-content ul li::before { content: "•"; color: #5a4fcf; font-size: 16px; font-weight: 900; line-height: 1.3; flex-shrink: 0; }
  .rich-content p { margin-top: 8px; color: #6b7280; font-size: 13px; line-height: 1.7; }
  .rich-content h1,.rich-content h2,.rich-content h3 { font-weight: 700; color: #1e1b4b; margin-top: 14px; margin-bottom: 4px; }
`;