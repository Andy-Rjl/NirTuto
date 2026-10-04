export interface ModalProps {
  user: any;
  onClose: () => void;
}

export interface PasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface FormData {
  nom: string;
  prenom: string;
  email: string;
  contact: string;
}

export const INPUT_CLASS =
  "w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm";