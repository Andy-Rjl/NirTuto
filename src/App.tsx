import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Connexion from './Etudiant/screen/Connexion';
import Profile from './Etudiant/screen/page/Profil/Profile';
import Exemple from './Etudiant/screen/page/DashboardEtudiant/DashboardEtud';
import Message from './Etudiant/screen/page/Message/Message';
import Formations from "./Etudiant/screen/page/Formation/Formations";
import Guide from "./Etudiant/screen/page/Guide/Guide";
import Facture from "./Etudiant/screen/page/Facture/Facture";
import Certification from "./Etudiant/screen/page/Certification/Certification";
import DetailFormation from "./Etudiant/screen/page/Formation/DetailFormation/detailFormation";
import GuideDetail from './Etudiant/screen/page/Guide/GuideDetail';
import { PublicRoute, ProtectedRoute } from './Etudiant/screen/protection/Protected';
import CourseList from "./Etudiant/screen/page/CoursList";
import PlayerPage from "./Etudiant/screen/page/Formation/PlayerPage";
import Home from './Etudiant/accueil/pages/Home';
import PageProjets from './Etudiant/accueil/pages/Formations/Pageprojet/PageProjets';
import PageMentors from './Etudiant/accueil/pages/Formations/PageMentors';
import PageCertifs from './Etudiant/accueil/pages/Formations/PageCertifs';
import PageBlogListe from './Etudiant/accueil/pages/Apropos/PageBlogListe';
import DetailBlog from './Etudiant/accueil/pages/Apropos/DetailsBlog';
import CatalogueFormation from './Etudiant/accueil/components/Formation/CatalogueFormation/CatalogueFormation';
import DetailsFormations from './Etudiant/accueil/components/Formation/DetailsFormations/DetailsFormations';
import VoirTousF from './Etudiant/accueil/pages/VoirTousFormations/VoirTousF';
import Admin from "./Admin/App";

function App() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />        
        <Route path="/formations/projets" element={<PublicRoute><PageProjets /></PublicRoute>} />
        <Route path="/formations/mentors" element={<PublicRoute><PageMentors /></PublicRoute>} />
        <Route path="/formations/certifications" element={<PublicRoute><PageCertifs /></PublicRoute>} />
        <Route path="/blog" element={<PublicRoute><PageBlogListe /></PublicRoute>} />
        <Route path="/blog/:id" element={<PublicRoute><DetailBlog /></PublicRoute>} />
        <Route path="/formation/:id" element={<PublicRoute><DetailsFormations /></PublicRoute>} />
        <Route path="/formation/:id" element={<PublicRoute>
          <CatalogueFormation 
            activeTab="all" 
            setActiveTab={() => {}} 
            searchTerm="" 
            setSearchTerm={() => {}} 
            onSelectFormation={(f) => {}} // Sera géré en interne
          /></PublicRoute>
        } />
        <Route path="/voir-toutes-formations" element={<VoirTousF />} />
      

        <Route path="/connexion" element={<PublicRoute><Connexion /></PublicRoute>} />
        <Route path='/profil' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dash" element={<ProtectedRoute><Exemple /></ProtectedRoute>}/>
        <Route path="/*" element={<Navigate to='/dash'/> }/>
        <Route path="/message" element={<ProtectedRoute><Message /></ProtectedRoute>}/>
        <Route path="/formations" element={<ProtectedRoute><Formations /></ProtectedRoute>} />
        <Route path="/guides" element={<ProtectedRoute><Guide /></ProtectedRoute>}/>
        <Route path="/facture" element={<ProtectedRoute><Facture /></ProtectedRoute>} />
        <Route path="/certification" element={<ProtectedRoute><Certification /></ProtectedRoute>} />
        <Route path="/detailformation/:id" element={<ProtectedRoute><DetailFormation /></ProtectedRoute>} />
        <Route path="/cour/:id" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
        <Route path="/player/:coursId" element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />
        <Route path="/playerguide/:guideId" element={<ProtectedRoute><GuideDetail/></ProtectedRoute>} />

        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
