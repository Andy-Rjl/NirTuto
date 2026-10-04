import { useState, useEffect } from "react";
import { API_URL } from "../../../../../lib/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [nom, setNom] = useState("");
  const [editingId, setEditingId] = useState<any>(null);

  const fetchCategories = () => {
    fetch(`${API_URL}/blogcategories`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const payload = { nom };

    if (editingId) {
      fetch(`${API_URL}/blogcategories/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(() => {
          resetForm();
          fetchCategories();
        })
        .catch((error) => console.error(error));
    } else {
      fetch(`${API_URL}/blogcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(() => {
          resetForm();
          fetchCategories();
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDelete = (id: any) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      fetch(`${API_URL}/blogcategories/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      })
        .then(() => fetchCategories())
        .catch((error) => console.error(error));
    }
  };

  const startEdit = (categorie: any) => {
    setEditingId(categorie.id);
    setNom(categorie.nom);
  };

  const resetForm = () => {
    setEditingId(null);
    setNom("");
  };

  return {
    categories,
    nom,
    setNom,
    editingId,
    handleSubmit,
    handleDelete,
    startEdit,
    resetForm,
  };
}