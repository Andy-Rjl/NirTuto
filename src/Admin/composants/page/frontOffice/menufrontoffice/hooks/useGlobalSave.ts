import { useState } from "react";
import { API_URL } from "../../../../../lib/api";

interface SaveData {
  heroText: string;
  slogan: string;
  buttonText: string;
  imageFile: File | null;
  certifText: string;
  contactInfo: { adresse: string; telephone: string; email: string };
  ctaFormateur: { title: string; desc: string };
  pilierData: {
    title: string; subtitle: string;
    titre1: string; desc1: string;
    titre2: string; desc2: string;
    titre3: string; desc3: string;
  };
  reelData: { title: string; ctaTitle: string; ctaButton: string };
  mentorData: { ctaTitle: string; ctaDesc: string; ctaButton: string };
  thematiqueData: { title: string; subtitle: string };
  blogData: { heroTitle: string; heroDesc: string; ctaText: string; ctaColor: string };
  detailsData: { authorName: string; authorRole: string; popularTags: string; shareTitle: string };
}

export function useGlobalSave(notify: (message: string) => void) {
  const [isSaving, setIsSaving] = useState(false);

  const handleGlobalSave = async (data: SaveData) => {
    setIsSaving(true);
    try {
      // accueil_fo — FormData car image possible
      const accueilForm = new FormData();
      accueilForm.append("titre",      data.heroText);
      accueilForm.append("sous_titre", data.buttonText);
      accueilForm.append("slogan",     data.slogan);
      if (data.imageFile) accueilForm.append("image", data.imageFile);
      await fetch(`${API_URL}/front-office/accueil`, {
        method: "POST",
        body: accueilForm,
      });

      // certification_fo
      await fetch(`${API_URL}/front-office/certification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: data.certifText }),
      });

      // contact_fo
      await fetch(`${API_URL}/front-office/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adresse:   data.contactInfo.adresse,
          telephone: data.contactInfo.telephone,
          email:     data.contactInfo.email,
        }),
      });

      // recrutement_fo
      await fetch(`${API_URL}/front-office/recrutement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cta_title: data.ctaFormateur.title,
          cta_desc:  data.ctaFormateur.desc,
        }),
      });

      // pilier_fo
      await fetch(`${API_URL}/front-office/pilier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:    data.pilierData.title,
          subtitle: data.pilierData.subtitle,
          titre1:   data.pilierData.titre1,
          desc1:    data.pilierData.desc1,
          titre2:   data.pilierData.titre2,
          desc2:    data.pilierData.desc2,
          titre3:   data.pilierData.titre3,
          desc3:    data.pilierData.desc3,
        }),
      });

      // reel_fo
      await fetch(`${API_URL}/front-office/reel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:      data.reelData.title,
          cta_title:  data.reelData.ctaTitle,
          cta_button: data.reelData.ctaButton,
        }),
      });

      // mentor_fo
      await fetch(`${API_URL}/front-office/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cta_title:  data.mentorData.ctaTitle,
          cta_desc:   data.mentorData.ctaDesc,
          cta_button: data.mentorData.ctaButton,
        }),
      });

      // thematique_fo
      await fetch(`${API_URL}/front-office/thematique/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:    data.thematiqueData.title,
          subtitle: data.thematiqueData.subtitle,
        }),
      });

      // blog_fo
      await fetch(`${API_URL}/front-office/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_title:   data.blogData.heroTitle,
          hero_desc:    data.blogData.heroDesc,
          cta_text:     data.blogData.ctaText,
          cta_color:    data.blogData.ctaColor,
          author_name:  data.detailsData.authorName,
          author_role:  data.detailsData.authorRole,
          popular_tags: data.detailsData.popularTags,
          share_title:  data.detailsData.shareTitle,
        }),
      });

      notify("💾 Configuration globale enregistrée !");
    } catch {
      notify("❌ Impossible de contacter le serveur");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, handleGlobalSave };
}