import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

interface TousProps {
  uniqueEtudiants: any[];
}

const PAGE_SIZE = 5;

const typeBadge = (type: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("en ligne") || t.includes("online"))
    return "bg-indigo-50 text-indigo-600 border-indigo-100";
  if (t.includes("présentiel") || t.includes("presentiel"))
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  return "bg-slate-50 text-slate-500 border-slate-100";
};

const Tous = ({ uniqueEtudiants }: TousProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = uniqueEtudiants.filter(
    (e) =>
      e.nom?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.formation?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      {/* Table header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 bg-blue-200">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
          Liste des étudiants
          <span className="ml-2 text-[10px] font-bold text-indigo-400 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full normal-case tracking-normal">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </h3>
        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-3 py-2 text-xs font-medium bg-white border border-blue-600 rounded-xl outline-none focus:ring-2 ring-indigo-100 text-slate-700 placeholder-slate-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/40 border-b border-slate-100">
              <th className="px-5 py-3 w-8"></th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Étudiant</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Formation</th>
              <th className="px-5 py-3">Montant</th>
              <th className="px-5 py-3">Type</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((etud, i) => (
                <tr
                  key={etud.id ?? i}
                  className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={etud.selected ?? false}
                      onChange={() => {}}
                      className="accent-indigo-500 cursor-pointer rounded"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                      {etud.date_inscription ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-slate-800">{etud.nom} {etud.prenom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-35 block">{etud.email}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-semibold text-slate-600">{etud.formation}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-black text-emerald-600 whitespace-nowrap">
                      {etud.frais ?? '0'} Ar
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${typeBadge(etud.type)}`}>
                      {etud.type ?? "Aucun"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400 text-sm font-medium">
                  Aucun étudiant trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-blue-200">
        <p className="text-[10px] font-semibold text-slate-400">
          Page <span className="text-indigo-600 font-black">{page}</span> / {totalPages}
          <span className="ml-2 text-slate-300">·</span>
          <span className="ml-2">{filtered.length} entrée{filtered.length > 1 ? "s" : ""}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all
              ${page === 1 ? "opacity-30 cursor-not-allowed border-slate-100 text-slate-400" : "border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"}`}
          >
            <ChevronLeft size={13} /> Préc.
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`sep-${i}`} className="px-1 text-slate-300 text-[10px] self-center">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all border
                      ${page === p ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100" : "border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"}`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all
              ${page === totalPages ? "opacity-30 cursor-not-allowed border-slate-100 text-slate-400" : "border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"}`}
          >
            Suiv. <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tous;