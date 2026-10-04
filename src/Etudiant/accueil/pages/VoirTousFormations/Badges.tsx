import { C } from "./types";

export const DiffBadge = ({ diff }: { diff: string }) => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    débutant:      { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    intermédiaire: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    avancé:        { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  };
  const s = map[diff?.toLowerCase()] ?? { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
  return (
    <span
      className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest"
      style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {diff || '—'}
    </span>
  );
};

export const CatPill = ({ label }: { label: string }) => (
  <span
    className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest"
    style={{ backgroundColor: C.primaryBg, color: C.primary, border: `1px solid ${C.primaryBorder}` }}
  >
    {label}
  </span>
);