import { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaClock, FaStar, FaPlay } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import Sidebar from '../../Component/Sidebar';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../lib/api';

interface Formation {
  id: number;
  titre: string;
  categorie: string;
  difficulte: string;
  nom_formateur: string;
  photo_formateur: string | null;
  duree: string;
  type: string;
  frais: number | null;
  image: string | null;
}

// 1. Interface pour la structure de catégorie venant de /categories-liste
interface Categorie {
  id: number | string;
  nom_cat: string; // Adaptez ce nom de propriété si votre backend utilise un autre terme (ex: 'libelle', 'title', etc.)
}

const difficultyConfig: Record<string, { label: string; bg: string; text: string }> = {
  Facile:     { label: 'Facile',      bg: 'bg-green-50',  text: 'text-green-600' },
  Moyenne:   { label: 'Moyenne',  bg: 'bg-blue-50',   text: 'text-blue-600'  },
  Difficile:  { label: 'Difficile',  bg: 'bg-red-50',    text: 'text-red-500'   },
};

// ── Star Rating ──
const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          size={10}
          className={i < full ? 'text-amber-400' : 'text-slate-200'}
        />
      ))}
      <span className="text-[11px] font-semibold text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

// ── Formation Card ──
const FormationCard = ({ item, onClick }: { item: Formation; onClick: () => void }) => {
  const [moyenne, setMoyenne] = useState<number>(0);
  const isPaid = item.type !== 'Gratuite';
  const diff = difficultyConfig[item.difficulte] ?? { label: item.difficulte, bg: 'bg-slate-100', text: 'text-slate-500' };

  useEffect(() => {
    fetch(`${API_URL}/evaluations/${item.id}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setMoyenne(data.moyenne ?? 0))
      .catch(() => setMoyenne(0));
  }, [item.id]);

  const avatarUrl = item.photo_formateur
    ? (item.photo_formateur.startsWith('http')
        ? item.photo_formateur
        : `${API_URL.replace('api', '')}${item.photo_formateur}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nom_formateur)}&background=6366f1&color=fff`;

  return (
    <div
      onClick={onClick}
      className="bg-white overflow-hidden border border-slate-200 flex flex-col cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-md shadow-sm"
    >
      {/* ── Image ── */}
      <div className="relative h-40 flex-shrink-0 overflow-hidden bg-slate-100">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.image || 'https://via.placeholder.com/400x280?text=Formation'}
          alt={item.titre}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
            <FaPlay size={11} className="text-indigo-600 ml-0.5" />
          </div>
        </div>
        <div className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-lg text-white ${isPaid ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
          {isPaid ? `${item.frais?.toLocaleString()} Ar` : 'Gratuit'}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-md truncate max-w-[60%] uppercase tracking-wide">
            {item.categorie || 'Général'}
          </span>
          <span className={`px-2 py-0.5 ${diff.bg} ${diff.text} text-[10px] font-semibold rounded-md flex-shrink-0`}>
            {diff.label}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {item.titre}
        </h3>

        <StarRating rating={moyenne} />

        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={avatarUrl}
              alt={item.nom_formateur}
              className="w-5 h-5 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
            <p className="text-[11px] text-slate-400 truncate">Par {item.nom_formateur}</p>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px] flex-shrink-0">
            <FaClock size={10} />
            <span>{item.duree || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── PAGE PRINCIPALE ──
const Formations = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Formation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // 2. Mettre à jour le type du state des catégories
  const [categories, setCategories] = useState<Categorie[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const fetchFormations = (page: number, category: string, search: string) => {
    setLoading(true);
    fetch(`${API_URL}/formations?page=${page}&category=${category}&search=${search}`)
      .then(res => res.json())
      .then(res => {
        setProjects(res.data);
        setLastPage(res.last_page);
        setCurrentPage(res.current_page);
        setLoading(false);
      })
      .catch(err => { console.error('Erreur:', err); setLoading(false); });
  };

  useEffect(() => {
    fetchFormations(currentPage, selectedCategory, searchQuery);
  }, [currentPage, selectedCategory, searchQuery]);

  // 3. Appel à la route /categories-liste
  useEffect(() => {
    fetch(`${API_URL}/categories-liste`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : data.data || []))
      .catch(err => console.error('Erreur chargement des catégories:', err));
  }, []);

  const filteredFormations = projects.filter(i => {
    const matchSearch = i.titre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff = selectedDifficulty === 'all' || i.difficulte === selectedDifficulty;
    return matchSearch && matchDiff;
  });

  const difficulties = ['Facile', 'Moyenne', 'Difficile'];

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 lg:ml-64 2xl:ml-64 p-4 sm:p-6 md:p-8 min-w-0">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-14 lg:pt-0">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Catalogue</p>
            <h1 className="text-xl font-bold text-slate-800">Formations</h1>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative group">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input
                className="w-full sm:w-56 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-700 placeholder:text-slate-400 text-sm"
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer transition-all min-w-[150px]"
              >
                <option value="all">Toutes catégories</option>
                {/* 4. Rendu dynamique des options de catégories */}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.nom_cat}>
                    {cat.nom_cat}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            </div>

            {/* Difficulty */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer transition-all min-w-[140px]"
              >
                <option value="all">Tous niveaux</option>
                {difficulties.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            </div>
          </div>
        </div>

        {/* ── COUNT ── */}
        {!loading && (
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            <span className="text-indigo-600">{filteredFormations.length}</span> formation(s) trouvée(s)
          </p>
        )}

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            [...Array(8)].map((_, n) => (
              <div key={n} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-sm" />
            ))
          ) : filteredFormations.length > 0 ? (
            filteredFormations.map((item) => (
              <FormationCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/detailformation/${slugify(item.titre)}`, { state: { id: item.id } })}
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center mt-16">
              <div className="w-full max-w-sm rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FaSearch size={18} className="text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Aucune formation trouvée.</p>
              </div>
            </div>
          )}
        </div>

        {/* ── PAGINATION ── */}
        {!loading && lastPage > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-10 flex-wrap">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FaChevronLeft size={11} />
            </button>
            {[...Array(lastPage)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all shadow-sm border ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FaChevronRight size={11} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Formations;