import { Search } from 'lucide-react';
import DefiQcm from './Defiqcm';
import Evaluation from './Evaluation';
import ListeCoursEtud from './Listecoursetud';

/*  Types  */
interface MainContentProps {
  user: any;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredInscriptions: any[];
  inscriptions: any[];
  formationsEnAttente: any[];
  connectedDays: number[];
  showQcm: boolean;
  setShowQcm: (v: boolean) => void;
  showEvaluation: boolean;
  setShowEvaluation: (v: boolean) => void;
  rating: number;
  setRating: (r: number) => void;
  // QCM
  selectedFormation: any;
  setSelectedFormation: (f: any) => void;
  selectedCours: any;
  setSelectedCours: (c: any) => void;
  selectedQcm: any;
  setSelectedQcm: (q: any) => void;
  userAnswers: any;
  setUserAnswers: (a: any) => void;
  formation: any;
  setFormation: (f: any) => void;
  fetchFormationDetails: (id: number) => void;
  closeQcmMode: () => void;
  isSubmitted: boolean;
  setIsSubmitted: (v: boolean) => void;
  score: number;
  isLoading: boolean;
  scores: any[];
  handleSubmit: () => void;
  onOpenPaymentModal: (formation: any) => void;
}

/*  MainContent  */
const MainContent = ({
  user, loading, searchQuery, setSearchQuery, filteredInscriptions,
  connectedDays,formationsEnAttente, showQcm, setShowQcm, showEvaluation, setShowEvaluation,
  rating, setRating, selectedFormation, setSelectedFormation, selectedCours,
  setSelectedCours, selectedQcm, setSelectedQcm, userAnswers, setUserAnswers,
  formation, setFormation, fetchFormationDetails, closeQcmMode,
  isSubmitted, setIsSubmitted, score, isLoading, scores, handleSubmit,onOpenPaymentModal,
}: MainContentProps) => {
  return (
    <div className="flex-1 min-w-0 p-5 sm:p-7 overflow-y-auto">

      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pt-14 lg:pt-0">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          {showQcm ? 'Centre de Révision' : showEvaluation ? 'Évaluer le module' : 'Tableau de bord'}
        </h1>
        {!showQcm && !showEvaluation && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm dark:text-slate-200"
              placeholder="Rechercher une formation…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </header>

      {/* ── Vues ── */}
      {showQcm ? (
        <DefiQcm
          filteredInscriptions={filteredInscriptions}
          loading={loading}
          selectedFormation={selectedFormation}
          setSelectedFormation={setSelectedFormation}
          selectedCours={selectedCours}
          setSelectedCours={setSelectedCours}
          selectedQcm={selectedQcm}
          setSelectedQcm={setSelectedQcm}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          formation={formation}
          setFormation={setFormation}
          fetchFormationDetails={fetchFormationDetails}
          closeQcmMode={closeQcmMode}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          score={score}
          isLoading={isLoading}
          scores={scores}
          handleSubmit={handleSubmit}
        />
      ) : showEvaluation ? (
        <Evaluation
          setShowEvaluation={setShowEvaluation}
          rating={rating}
          setRating={setRating}
          filteredInscriptions={filteredInscriptions}
        />
      ) : (
        <ListeCoursEtud
          user={user}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredInscriptions={filteredInscriptions}
          formationsEnAttente={formationsEnAttente}
          connectedDays={connectedDays}
          setShowQcm={setShowQcm}
          setShowEvaluation={setShowEvaluation}
          onOpenPaymentModal={onOpenPaymentModal}
        />
      )}

    </div>
  );
};

export default MainContent;