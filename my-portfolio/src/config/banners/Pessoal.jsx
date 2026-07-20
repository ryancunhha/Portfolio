import { Link } from "react-router-dom";

export default function Pessoal() {
    return (
        <div className="rounded-xl flex flex-col md:grid md:grid-cols-2 h-100 md:h-100 w-full bg-white">
            <div className="flex-1 relative w-full h-1/2 md:h-full">
                <img src="/banners/Background.webp" className="rounded-l-xl absolute inset-0 w-full h-full object-cover brightness-60 pointer-events-none select-none" width="665" height="398" loading="eager" fetchPriority="high" alt="" decoding="async" aria-hidden="true" />
            </div>

            <div className="flex-1 flex flex-col justify-center items-start p-6 gap-3">
                <h2 className="text-lg md:text-2xl font-extrabold text-black uppercase tracking-tight leading-tight italic">Crie, Conecte, Escale, Automatize</h2>
                <p className="text-gray-700 text-sm">Conheça mais sobre mim, minha história no desenvolvimento.</p>
                <Link to="/sobre" className="text-black border-2 border-black font-semibold px-6 py-3 text-sm rounded-lg hover:bg-black hover:text-white transition-colors">Sobre mim</Link>
            </div>
        </div>
    )
}