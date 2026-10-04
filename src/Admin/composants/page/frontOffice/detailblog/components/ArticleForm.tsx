import { useRef, useEffect, useState } from "react";
import {
  Save, Upload, Edit3, Calendar,
  Tag, User, Image as ImageIcon,
} from "lucide-react";
import type { ArticleConfig } from "../types";

interface ArticleFormProps {
  article: ArticleConfig;
  setArticle: (updater: (a: ArticleConfig) => ArticleConfig) => void;
  editingArticleId: number | null;
  resetArticleForm: () => void;
  onSave: (e: React.FormEvent, selectedFile: File | null) => Promise<void>;
  saved: boolean;
  categories: any[];
  editorResetRef: React.MutableRefObject<(() => void) | null>;
}

const LBL = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1";
const INP = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#AC77E9]/40 focus:border-[#AC77E9] transition-all bg-white";

export default function ArticleForm({
  article,
  setArticle,
  editingArticleId,
  onSave,
  saved,
  categories,
  editorResetRef,
}: ArticleFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);

  // Expose la fonction de reset de l'éditeur au parent via editorResetRef
  useEffect(() => {
    editorResetRef.current = () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    };
    return () => { editorResetRef.current = null; };
  }, [editorResetRef]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = article.bodyText;
    }
  }, [editingArticleId]);

  const checkSelectionStyles = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsBulletList(document.queryCommandState("insertUnorderedList"));
    setIsOrderedList(document.queryCommandState("insertOrderedList"));
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setArticle((a) => ({ ...a, bodyText: editorRef.current!.innerHTML }));
    }
    checkSelectionStyles();
  };

  const execCommand = (e: React.MouseEvent, command: string) => {
    e.preventDefault();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, undefined);
    handleEditorChange();
  };

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) =>
      setArticle((a) => ({ ...a, image: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleFormSave = (e: React.FormEvent) => {
    onSave(e, selectedFile);
  };

  return (
    <form onSubmit={handleFormSave} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* Formulaire (3/5) */}
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#AC77E9] flex items-center justify-center">
              <Edit3 size={12} className="text-white" />
            </span>
            {editingArticleId ? "Modifier le contenu" : "Contenu de l'article"}
          </h2>

          <div>
            <label className={LBL}>Titre de l'article</label>
            <input
              className={INP}
              value={article.title}
              onChange={(e) => setArticle((a) => ({ ...a, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LBL}>
                <User size={10} className="inline mr-1" />Auteur
              </label>
              <input
                className={INP}
                value={article.auteur}
                onChange={(e) => setArticle((a) => ({ ...a, auteur: e.target.value }))}
              />
            </div>
            <div>
              <label className={LBL}>
                <Calendar size={10} className="inline mr-1" />Date
              </label>
              <input
                type="date"
                className={INP}
                value={article.date}
                onChange={(e) => setArticle((a) => ({ ...a, date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className={LBL}>
              <Tag size={10} className="inline mr-1" />Catégorie
            </label>
            <select
              className={INP}
              value={article.categorie}
              onChange={(e) => setArticle((a) => ({ ...a, categorie: e.target.value }))}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.nom}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Corps de l'article */}
          <div className="space-y-1">
            <label className={LBL}>Corps de l'article</label>
            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Texte Officiel
                </span>
              </div>

              {/* Barre d'outils */}
              <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center gap-2 select-none">
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                  <button
                    type="button"
                    onMouseDown={(e) => execCommand(e, "bold")}
                    className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-all ${isBold ? "bg-white text-[#AC77E9] shadow-sm font-black" : "text-gray-500 hover:bg-white"}`}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => execCommand(e, "italic")}
                    className={`w-7 h-7 rounded text-xs italic flex items-center justify-center transition-all ${isItalic ? "bg-white text-[#AC77E9] shadow-sm font-bold" : "text-gray-500 hover:bg-white"}`}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => execCommand(e, "insertUnorderedList")}
                    className={`w-7 h-7 rounded text-sm flex items-center justify-center transition-all ${isBulletList ? "bg-white text-[#AC77E9] shadow-sm font-bold" : "text-gray-500 hover:bg-white"}`}
                  >
                    •
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => execCommand(e, "insertOrderedList")}
                    className={`w-7 h-7 rounded text-xs flex items-center justify-center transition-all ${isOrderedList ? "bg-white text-[#AC77E9] shadow-sm font-bold" : "text-gray-500 hover:bg-white"}`}
                  >
                    1.
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => execCommand(e, "justifyLeft")}
                    className="w-7 h-7 rounded text-xs flex items-center justify-center text-gray-500 hover:bg-white transition-all"
                  >
                    ≡
                  </button>
                </div>
              </div>

              {/* Zone Éditable */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                onKeyUp={checkSelectionStyles}
                onMouseUp={checkSelectionStyles}
                className="w-full min-h-37.5 p-4 text-sm text-gray-800 outline-none bg-white custom-editor"
                style={{ minHeight: "150px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image & aperçu (2/5) */}
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
              <ImageIcon size={12} className="text-white" />
            </span>
            Image principale
          </h2>
          <div
            className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer ${dragOver ? "border-[#AC77E9] bg-[#AC77E9]/5" : "border-gray-200 hover:border-gray-300"}`}
            style={{ minHeight: 180 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f?.type.startsWith("image/")) handleImageUpload(f);
            }}
            onClick={() => imageInputRef.current?.click()}
          >
            {article.image ? (
              <img src={article.image} alt="" className="w-full object-cover" style={{ maxHeight: 220 }} />
            ) : (
              <div className="flex flex-col items-center justify-center h-44 text-gray-300">
                <Upload size={24} />
                <p className="text-xs mt-2">Glissez ou cliquez</p>
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
              }}
            />
          </div>
        </div>

        {/* Mini-aperçu */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Aperçu carte</p>

          <div className="rounded-xl overflow-hidden border border-gray-100 mb-4">
            <div className="bg-[#1a2340] py-4 text-center px-3">
              <h3 className="text-sm font-bold text-white leading-tight">{article.bannerTitle}</h3>
            </div>
            {article.image && (
              <img src={article.image} alt="" className="w-full object-cover" style={{ maxHeight: 100 }} />
            )}
            <div className="p-3">
              <p className="text-[10px] text-gray-400 mb-1">
                {article.auteur} · {article.date} · {article.categorie}
              </p>
              <p className="text-xs font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
                {article.title}
              </p>
              <p className="text-[10px] text-gray-500 line-clamp-2">
                {editorRef.current ? editorRef.current.innerText : article.bodyText}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#AC77E9] hover:bg-[#965fd1] text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Save size={16} />
            {saved
              ? editingArticleId ? "Article Modifié !" : "Article Enregistré !"
              : editingArticleId ? "Modifier l'article" : "Enregistrer l'article"}
          </button>
        </div>
      </div>
    </form>
  );
}