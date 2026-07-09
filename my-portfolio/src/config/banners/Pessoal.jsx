import { Link } from "react-router-dom";
import BACK from "/Background.webp";

export default function Pessoal() {
    return (
        <div className="flex flex-col md:grid md:grid-cols-2 h-100 md:h-100 w-full bg-[#F2F2F2]">
            <div className="flex-1 relative w-full h-1/2 md:h-full">
                <img src={BACK} className="absolute inset-0 w-full h-full object-cover brightness-60 pointer-events-none select-none" loading="eager" fetchPriority="high" alt="" decoding="async" aria-hidden="true" />
            </div>

            <div className="flex-1 flex flex-col justify-center items-start p-6 gap-3">
                <h2 className="text-lg md:text-2xl font-extrabold text-black uppercase tracking-tight leading-tight italic">Crie, Conecte, Escale, Automatize</h2>
                <p className="text-gray-700 text-sm">Conheça mais sobre mim, minha história no desenvolvimento.</p>
                <Link to="/sobre" className="text-black border-2 border-gray-700 font-semibold px-6 py-1 text-sm rounded-lg">Sobre mim</Link>
            </div>
        </div>
    )
}