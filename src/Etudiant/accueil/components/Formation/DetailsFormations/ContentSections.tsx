import { MessageSquare, Star } from "lucide-react";
import type { Evaluation } from "./types";
// ── Avis & commentaires ──
export const AvisSection = ({ evaluations, totalEvaluations }: { evaluations: Evaluation[]; totalEvaluations: number }) => (
  <div>
    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
      <MessageSquare className="text-[#00A99D]" /> Retours d'expérience ({totalEvaluations})
    </h2>

    {evaluations.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {evaluations.map((evalItem) => (
          <div key={evalItem.id} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
            <div>
              {evalItem.note !== null && (
                <div className="flex gap-0.5 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      fill={index < evalItem.note! ? "currentColor" : "none"}
                      className={index < evalItem.note! ? "text-yellow-400" : "text-gray-200"}
                    />
                  ))}
                </div>
              )}
              <p className="text-gray-600 text-sm italic mb-4 leading-relaxed">
                "{evalItem.commentaire ? evalItem.commentaire : "L'étudiant a donné une note globale sans laisser d'avis écrit."}"
              </p>
            </div>
            <div className="mt-4 border-t border-gray-50 pt-3 flex justify-between items-center">
              <p className="font-bold text-gray-900 text-xs">{evalItem.nom}</p>
              <span className="text-[10px] text-gray-400">Inscrit</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center text-sm 2xl:text-lg text-gray-400">
        Aucun commentaire n'a été publié pour cette formation.
      </div>
    )}
  </div>
);