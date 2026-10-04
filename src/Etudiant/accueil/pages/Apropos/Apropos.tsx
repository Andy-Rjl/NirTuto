import Blog from "./Blog";
import Etape from "./Etape";
import Recrutement from "../../components/Recrutement/Recrutement";
import Bip from "./Bip";

export default function About() {
  return (
    <div className="w-full overflow-x-hidden bg-white font-sans text-gray-900">
      <Etape />
      <Bip />
      <Blog />
      <Recrutement />
    </div>
  );
}