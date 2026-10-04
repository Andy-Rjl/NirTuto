import outils from "./../../assets/outils.jpg";
import online from "./../../assets/online.jpg";
import skills from "./../../assets/skills.jpg";

export const BlogPosts = [
  {
    id: 1,
    title: "Le futur appartient à ceux qui apprennent",
    excerpt: "Ne subissez plus les mutations du marché : maîtrisez les compétences clés de demain. Nos experts vous guident pas à pas pour transformer chaque innovation en un levier concret pour votre carrière professionnelle.",
    description: `
      Dans un monde en perpétuelle transformation, rester immobile équivaut à reculer. Les entreprises cherchent aujourd'hui des profils capables de s'adapter, d'innover et de maîtriser les outils de demain. 

      Nos formations sont conçues pour vous donner un avantage concret : des compétences techniques actualisées, une pédagogie axée sur la pratique, et un accompagnement personnalisé par des experts du terrain.

      Que vous soyez en reconversion, en quête de promotion, ou simplement curieux d'explorer de nouveaux horizons, apprendre en continu est la clé qui ouvre toutes les portes. Le futur appartient à ceux qui osent se former aujourd'hui.
    `,
    image: skills,
    date: "5 Avr 2024",
    categorie: "Carrière",
    auteur: "Équipe Tuto Info",
  },
  {
    id: 2,
    title: "Libérer votre Créativité Digitale",
    excerpt: "Transformez vos idées en projets visuels percutants. De la retouche photo au montage vidéo, apprenez à dompter les outils de la suite Adobe pour donner une dimension professionnelle à votre créativité.",
    description: `
      La créativité digitale n'est pas un don réservé aux artistes : c'est une compétence qui s'apprend et se développe avec les bons outils. Photoshop, Illustrator, Premiere Pro... ces logiciels sont devenus incontournables dans de nombreux secteurs.

      Notre approche pédagogique vous guide pas à pas, de la prise en main des interfaces jusqu'à la réalisation de projets complets. Vous apprendrez à retoucher des photos, créer des visuels percutants, et monter des vidéos professionnelles.

      Libérez votre potentiel créatif et donnez vie à vos idées avec une maîtrise technique irréprochable.
    `,
    image: outils,
    date: "28 Mar 2024",
    categorie: "Design",
    auteur: "Studio Créatif",
  },
  {
    id: 3,
    title: "L'excellence digitale à votre portée",
    excerpt: "Le succès numérique n'est plus réservé aux initiés. Accédez à des formations de haut niveau et adoptez les stratégies gagnantes pour vous démarquer et affirmer votre expertise sur le marché actuel.",
    description: `
      Le monde digital évolue à une vitesse vertigineuse. Chaque jour, de nouvelles plateformes, de nouveaux algorithmes et de nouvelles pratiques émergent, redessinant les règles du jeu professionnel.

      Nos formations premium vous donnent accès aux mêmes connaissances que les experts du secteur : SEO avancé, marketing automation, analyse de données, stratégie de contenu... Vous bénéficiez d'un enseignement de haut niveau, dispensé par des praticiens reconnus.

      L'excellence digitale n'est plus un privilège : avec Tuto Info, elle est accessible à tous ceux qui ont la volonté d'apprendre et de progresser.
    `,
    image: online,
    date: "20 Mar 2024",
    categorie: "Stratégie",
    auteur: "Experts Digitaux",
  },
];

export default BlogPosts;