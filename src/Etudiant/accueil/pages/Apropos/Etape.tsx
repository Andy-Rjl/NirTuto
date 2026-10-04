import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award, TrendingUp } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: GraduationCap,
    title: "Explorez",
    desc: "Découvrez nos formations ",
    color: "#6366F1",
  },
  {
    n: "02",
    icon: Briefcase,
    title: "Apprenez",
    desc: "Suivez les cours à votre rythme",
    color: "#8B5CF6",
  },
  {
    n: "03",
    icon: Award,
    title: "Certifiez",
    desc: "Obtenez votre certification",
    color: "#A855F7",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Progressez",
    desc: "Boostez votre carrière",
    color: "#EC4899",
  },
];

export default function Etape() {
  return (
    <section className="bg-[#f0f9ff] py-16 overflow-hidden">
      <div className="w-full mx-auto px-6">
        <div className="text-center mb-12">
          <span className=" text-2xl md:text-3xl font-extrabold text-[#0f4c81] tracking-tight">
            Le parcours d'apprentissage
          </span>
          <h2 className="text-lg font-black text-black mt-2">
            Un processus simple et efficace
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Ligne de connexion */}
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                style={{
                  background: step.color + "20",
                  border: `1px solid ${step.color}40`,
                }}
              >
                <step.icon size={24} style={{ color: step.color }} />
              </div>
              <span className="text-xs font-black text-gray-600 tracking-widest">
                {step.n}
              </span>
              <h3 className="text-black font-black text-base mt-1 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}