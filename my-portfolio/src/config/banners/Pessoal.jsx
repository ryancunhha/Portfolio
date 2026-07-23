import { Link } from "react-router-dom";

export default function Pessoal() {
    return (
        <div className="flex flex-col md:grid md:grid-cols-2 h-100 w-full bg-white">
            <div className="flex-1 relative w-full h-1/2 md:h-full">
                <img src="/banners/Background.gif" className="absolute inset-0 w-full h-full object-contain pointer-events-none" width="420" height="320" loading="eager" fetchPriority="high" alt="" decoding="async" aria-hidden="true" />
            </div>

            <div className="flex-1 flex flex-col justify-center items-start px-6 py-2 gap-3">
                <h2 className="text-lg md:text-2xl font-extrabold text-black uppercase tracking-tight leading-tight italic">Crie, Conecte, Escale, Automatize</h2>
                <p className="text-gray-700 text-sm">Conheça mais sobre mim, minha história no desenvolvimento.</p>
                <Link to="/sobre" className="text-black border-2 border-black font-semibold px-6 py-3 text-sm rounded-lg hover:bg-black hover:text-white transition-colors">Sobre mim</Link>
            </div>
        </div>
    )
}