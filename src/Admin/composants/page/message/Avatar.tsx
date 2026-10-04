import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;       // valeur brute venant de l'API (ex: etud.photo)
  baseUrl: string;           // ex: baseUrl (API_URL sans /api)
  alt?: string;
  size?: number;             // taille de l'icône User en fallback
  className?: string;        // classes pour le conteneur (w-14 h-14, rounded-full, etc.)
  iconClassName?: string;    // classes pour l'icône User (couleur, etc.)
}

/**
 * Avatar robuste : affiche l'image si elle existe et charge correctement,
 * sinon affiche l'icône User en fallback. Gère aussi le cas où l'API
 * renvoie la string "null" au lieu de la valeur null.
 */
const Avatar = ({
  src,
  baseUrl,
  alt = "",
  size = 24,
  className = "",
  iconClassName = "text-[#7C8DB5]",
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);

  // Reset l'état d'erreur si la source change (ex: changement de contact)
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const isValidSrc =
    !!src &&
    src !== "null" &&
    src !== "undefined" &&
    src.trim() !== "";

  const showImage = isValidSrc && !imgError;

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={`${baseUrl}/${src}`}
          alt={alt}
          className="w-14 h-14 object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <User size={size} className={iconClassName} />
      )}
    </div>
  );
};

export default Avatar;