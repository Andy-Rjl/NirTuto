import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, X } from "lucide-react";
import type { PasswordData } from "./types";

interface PasswordModalProps {
  passwordData: PasswordData;
  setPasswordData: (data: PasswordData) => void;
  isUpdating: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const PasswordModal = ({
  passwordData, setPasswordData,
  isUpdating, onSubmit, onClose,
}: PasswordModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#20b461] transition-all placeholder:text-slate-400";

  return (
    <div className="absolute inset-0 z-[120] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[28px] p-6 sm:p-8 shadow-xl relative border border-slate-100 dark:border-slate-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6 sm:mb-8 text-center">
          <div className="bg-emerald-50 w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={22} className="text-[#20b461]" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">Sécurité</h3>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">Modifier votre accès</p>
        </div>

        <div className="space-y-3">
          <input
            type={showPassword ? "text" : "password"}
            value={passwordData.current_password}
            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
            placeholder="Ancien mot de passe"
            className={inputClass}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              placeholder="Nouveau mot de passe"
              className={inputClass}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={passwordData.new_password_confirmation}
            onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
            placeholder="Confirmer le nouveau mot de passe"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-3 mt-6 sm:mt-8">
          <button
            onClick={onSubmit}
            disabled={isUpdating}
            className="w-full bg-[#20b461] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-[#1ca358] transition-all shadow-md active:scale-[0.98] flex items-center justify-center"
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Confirmer le changement"}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white text-[#20b461] border border-slate-200 py-3 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};