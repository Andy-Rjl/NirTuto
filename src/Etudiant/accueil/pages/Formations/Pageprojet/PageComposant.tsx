import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import {  offres, temoignages } from './DataProjet';

/* ── Badge ── */
export const Badge = ({ text, color }: { text: string; color: string }) => (
  <span
    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: color + '18', color }}
  >
    {text}
  </span>
);



/* ── OffreCard ── */
export const OffreCard = ({ o, index }: { o: typeof offres[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-black text-gray-900 text-sm leading-tight">{o.role}</h4>
          <span
            className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: o.color + '18', color: o.color }}
          >
            {o.type}
          </span>
        </div>
        <p className="text-gray-600 text-xs font-semibold mb-2">{o.company}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {o.skills.map(sk => (
            <span key={sk} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">{sk}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
        
        </div>
      </div>
    </div>
  </motion.div>
);

/* ── TestimonialCard ── */
export const TestimonialCard = ({ t, index }: { t: typeof temoignages[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12 }}
    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
  >
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: t.stars }).map((_, i) => (
        <Star key={i} size={14} fill="#FBBF24" className="text-amber-400" />
      ))}
    </div>
    <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.texte}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-xl">
        {t.photo}
      </div>
      <div>
        <p className="font-black text-gray-900 text-sm">{t.nom}</p>
        <p className="text-gray-400 text-xs">{t.poste} · {t.promo}</p>
      </div>
    </div>
  </motion.div>
);