interface ProfileAvatarProps {
  user: any;
  profileImage: string | null;
  onImageChange: (file: File, preview: string) => void;
}

export const ProfileAvatar = ({ user, profileImage, onImageChange }: ProfileAvatarProps) => (
  <div className="flex flex-row lg:flex-col items-center gap-4 sm:gap-6 lg:min-w-[200px] lg:border-r border-slate-100 lg:pr-6">
    {/* Avatar */}
    <div className="relative group flex-shrink-0">
      <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full bg-slate-100 border-[6px] sm:border-[8px] lg:border-[10px] border-white shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105">
        {profileImage ? (
          <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-600 uppercase">
            {user.nom.charAt(0)}
          </span>
        )}
        <label className="absolute inset-0 bg-[#1A234E]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
          <span className="text-[9px] font-black uppercase text-white tracking-widest">Changer</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => onImageChange(file, reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      </div>
    </div>

    {/* Nom + badge */}
    <div className="text-left lg:text-center space-y-1 sm:space-y-2 min-w-0">
      <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 uppercase italic tracking-tight truncate">
        {user.nom}
      </h3>
      <div className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-indigo-50 text-indigo-600 rounded-full shadow-sm">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter">Étudiant Actif</span>
      </div>
    </div>
  </div>
);