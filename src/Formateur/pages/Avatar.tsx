import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null; 
  baseUrl: string;  
  alt?: string;
  size?: number; 
  className?: string;
  iconClassName?: string;    
}

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