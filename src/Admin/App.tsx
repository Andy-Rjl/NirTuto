import { Route, Routes, Navigate } from 'react-router-dom';
import Apps from './Apps';
import FrontOffice from './composants/page/frontOffice/menufrontoffice/FrontOffice';
import Login from './composants/connexion/login';
import Inscription from './composants/inscription/inscription';
import { useEffect } from 'react';
import Formateur from '../Formateur/pages/Formateur';


const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem('token');
  
  return token ? children : <Navigate to="login" replace />;
};
const GuestRoute = ({ children }: any) => {
  const token = localStorage.getItem('token');

  return !token ? children : <Navigate to="dashboard" replace />;
};

export default function App() {
  useEffect(() => {
  // Vérifie le stockage local ou la préférence système
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, []);
  return (
      <Routes>
        <Route path="" element={<Navigate to="login" replace />} />

        {/* Routes protégées  */}
        <Route path='dashboard' element={
          <PrivateRoute>
            <Apps />
          </PrivateRoute>
        } />
        
        <Route path='frontoffice' element={
          <PrivateRoute>
            <FrontOffice />
          </PrivateRoute>
        } />

        <Route path='formateur' element={
          <PrivateRoute>
            <Formateur />
          </PrivateRoute>
        } />

        {/* Routes pour invités (Publics) */}
        <Route path='login' element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        
        <Route path='signup' element={
            <Inscription />
        } />


        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
  );
}