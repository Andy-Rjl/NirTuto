import { useState, useEffect } from "react";
import { API_URL } from "../../../../../lib/api";

export function useFrontOfficeData() {
  // ── Accueil ──────────────────────────────────────────────────────────────────
  const [heroText,      setHeroText]      = useState("Meilleure plateforme de formation en ligne à Madagascar");
  const [slogan,        setSlogan]        = useState("Bénéficiez d'une formation de qualité 100% Pratique");
  const [buttonText,    setButtonText]    = useState("");
  const [imageFile,     setImageFile]     = useState<File | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string>("");

  // ── Certification ─────────────────────────────────────────────────────────
  const [certifText, setCertifText] = useState("L'organisme de formation Nir'Info atteste que...");

  // ── Contact ───────────────────────────────────────────────────────────────
  const [contactInfo, setContactInfo] = useState({
    adresse:   "Antananarivo, Madagascar",
    telephone: "+261 34 70 840 46",
    email:     "admin@nir-info.com",
  });

  // ── Recrutement ───────────────────────────────────────────────────────────
  const [ctaFormateur, setCtaFormateur] = useState({
    title: "Transmettez votre expertise.",
    desc:  "Rejoignez la plus grande communauté de formateurs francophones.",
  });

  // ── Piliers ───────────────────────────────────────────────────────────────
  const [pilierData, setPilierData] = useState({
    title:    "Nos Piliers d'Excellence",
    subtitle: "Une méthodologie unique pour transformer votre passion en carrière.",
    titre1:   "Nos Piliers d'Excellence",
    desc1:    "Une méthodologie unique pour transformer votre passion en carrière.",
    titre2:   "Nos Piliers d'Excellence",
    desc2:    "Une méthodologie unique pour transformer votre passion en carrière.",
    titre3:   "Nos Piliers d'Excellence",
    desc3:    "Une méthodologie unique pour transformer votre passion en carrière.",
  });

  // ── Réels ─────────────────────────────────────────────────────────────────
  const [reelData, setReelData] = useState({
    title:     "Nos Réalisations",
    ctaTitle:  "Prêt à coder votre futur ?",
    ctaButton: "Rejoindre Tuto Info",
  });

  // ── Mentors ───────────────────────────────────────────────────────────────
  const [mentorData, setMentorData] = useState({
    ctaTitle:  "Ne restez jamais bloqué.",
    ctaDesc:   "Rejoignez Tuto Info et bénéficiez d'une assistance humaine.",
    ctaButton: "Rejoindre Tuto Info",
  });

  // ── Thématique ────────────────────────────────────────────────────────────
  const [thematiqueData, setThematiqueData] = useState({
    title:    "Explorez nos thematiques",
    subtitle: "Trouvez la formation qui correspond à vos ambitions professionnelles.",
  });

  // ── Blog ──────────────────────────────────────────────────────────────────
  const [blogData, setBlogData] = useState({
    heroTitle: "Notre Blog",
    heroDesc:  "Apprendre l'informatique, ce n'est pas seulement accumuler des lignes de code...",
    ctaText:   "Rejoignez la communauté Tuto Info",
    ctaColor:  "Passionné par le développement et les nouvelles technologies...",
  });

  const [detailsData, setDetailsData] = useState({
    authorName:  "Melisa",
    authorRole:  "Expert Full-stack",
    popularTags: "React, TypeScript, Laravel, UI/UX",
    shareTitle:  "Partagez cet article",
  });

  // ── Chargements API ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/front-office/accueil`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setHeroText(data.titre          || heroText);
        setSlogan(data.slogan           || slogan);
        setButtonText(data.sous_titre   || buttonText);
        setSavedImageUrl(data.image_url || "");
      })
      .catch(err => console.error("Erreur accueil:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/certification`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setCertifText(data.texte || certifText);
      })
      .catch(err => console.error("Erreur certification:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/contact`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setContactInfo({
          adresse:   data.adresse   || contactInfo.adresse,
          telephone: data.telephone || contactInfo.telephone,
          email:     data.email     || contactInfo.email,
        });
      })
      .catch(err => console.error("Erreur contact:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/recrutement`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setCtaFormateur({
          title: data.cta_title || ctaFormateur.title,
          desc:  data.cta_desc  || ctaFormateur.desc,
        });
      })
      .catch(err => console.error("Erreur recrutement:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/pilier`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setPilierData({
          title:    data.title    || pilierData.title,
          subtitle: data.subtitle || pilierData.subtitle,
          titre1:   data.titre1   || pilierData.titre1,
          desc1:    data.desc1    || pilierData.desc1,
          titre2:   data.titre2   || pilierData.titre2,
          desc2:    data.desc2    || pilierData.desc2,
          titre3:   data.titre3   || pilierData.titre3,
          desc3:    data.desc3    || pilierData.desc3,
        });
      })
      .catch(err => console.error("Erreur pilier:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/reel`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setReelData({
          title:     data.title      || reelData.title,
          ctaTitle:  data.cta_title  || reelData.ctaTitle,
          ctaButton: data.cta_button || reelData.ctaButton,
        });
      })
      .catch(err => console.error("Erreur reel:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/mentor`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setMentorData({
          ctaTitle:  data.cta_title  || mentorData.ctaTitle,
          ctaDesc:   data.cta_desc   || mentorData.ctaDesc,
          ctaButton: data.cta_button || mentorData.ctaButton,
        });
      })
      .catch(err => console.error("Erreur mentor:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/thematique/config`)
      .then(r => r.json())
      .then(data => {
        const config = Array.isArray(data) ? data.find((d: any) => d.id === 1) : data;
        if (!config) return;
        setThematiqueData({
          title:    config.title    || thematiqueData.title,
          subtitle: config.subtitle || thematiqueData.subtitle,
        });
      })
      .catch(err => console.error("Erreur thematique:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/front-office/blog`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setBlogData({
          heroTitle: data.hero_title || blogData.heroTitle,
          heroDesc:  data.hero_desc  || blogData.heroDesc,
          ctaText:   data.cta_text   || blogData.ctaText,
          ctaColor:  data.cta_color  || blogData.ctaColor,
        });
        setDetailsData({
          authorName:  data.author_name  || detailsData.authorName,
          authorRole:  data.author_role  || detailsData.authorRole,
          popularTags: data.popular_tags || detailsData.popularTags,
          shareTitle:  data.share_title  || detailsData.shareTitle,
        });
      })
      .catch(err => console.error("Erreur blog:", err));
  }, []);

  return {
    heroText,      setHeroText,
    slogan,        setSlogan,
    buttonText,    setButtonText,
    imageFile,     setImageFile,
    savedImageUrl,
    certifText,    setCertifText,
    contactInfo,   setContactInfo,
    ctaFormateur,  setCtaFormateur,
    pilierData,    setPilierData,
    reelData,      setReelData,
    mentorData,    setMentorData,
    thematiqueData,setThematiqueData,
    blogData,      setBlogData,
    detailsData,   setDetailsData,
  };
}