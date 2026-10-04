import type { JSX } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';


const LoadingSpinner = () => {
  const bars = Array.from({ length: 12 });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-white">
      <div className="relative h-20 w-20">
        {bars.map((_, i) => {
          const rotation = i * 30; 
          const opacity = 0.25 + (i / bars.length) * 0.75; 
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-7 w-2 -translate-x-1/2 -translate-y-full rounded-full bg-blue-500"
              style={{
                transform: `rotate(${rotation}deg) translateY(-150%)`,
                opacity,
                animation: 'spin-fade 1s linear infinite',
                animationDelay: `${(i / bars.length) * 1}s`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes spin-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
};

// Composant pour protéger le Dashboard
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/connexion" />;
};

// Composant pour bloquer Home et Login si déjà connecté
export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return !isAuthenticated ? children : <Navigate to="/dash" />;
};