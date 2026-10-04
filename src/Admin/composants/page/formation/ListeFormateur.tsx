import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../../../lib/api";
import { useNavigate } from "react-router-dom";

const ListeFormateur = () => {
    const [admins, setAdmins] = useState<any[]>([]);
    const token = localStorage.getItem('token');
    const [activeTab] = useState("formateurs");
    const [search, setSearch] = useState("");

    const navigation = useNavigate();

    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${API_URL}/admins`, {
          headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setAdmins(Array.isArray(data) ? data : (data.data || []));
      } catch (error) { console.error(error); }
    };

    useEffect(() => {
      if (activeTab === "formateurs") fetchAdmins();
    }, [activeTab]);

    const filtered = admins.filter(a =>
      a.nom?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div key="profs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white  border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* ── TOOLBAR ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-800 tracking-tight">Formateurs</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {admins.length} membre{admins.length > 1 ? 's' : ''} au total
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all w-40"
                />
              </div>
              {/* Add new */}
              <button onClick={()=>navigation('/admin/signup')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-xl transition-all shadow-sm shadow-indigo-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter
              </button>
              {/* Export */}
              
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-12">Photo</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Nom</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Formations</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((admin, idx) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group hover:bg-slate-50/60 transition-all"
                  >
                    {/* Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                        <img
                          src={`${API_URL.replace("/api", "")}/${admin.photo}`}
                          alt={admin.nom}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    </td>

                    {/* Nom */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-slate-800">{admin.nom}</span>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500 font-medium">{admin.contact || '—'}</span>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500 font-medium">{admin.email}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Actif
                      </span>
                    </td>

                    {/* Formations */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {admin.formations?.slice(0, 2).map((f: any) => (
                          <span key={f.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[9px] font-bold">
                            {f.titre}
                          </span>
                        ))}
                        {admin.formations?.length > 2 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-bold">
                            +{admin.formations.length - 2}
                          </span>
                        )}
                        {(!admin.formations || admin.formations.length === 0) && (
                          <span className="text-[10px] text-slate-300 font-medium">Aucune</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                       
                        {/* Delete */}
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all" title="Supprimer">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                       
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm font-medium">
                      Aucun formateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── FOOTER ── */}
          <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition-all text-xs font-bold">‹</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-black">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition-all text-xs font-bold">›</button>
            </div>
          </div>
        </motion.div>
    );
}

export default ListeFormateur;