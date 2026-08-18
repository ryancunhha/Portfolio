import { Link } from "react-router-dom";

export default function Banner() {
    return (
        <div className="flex flex-col md:grid md:grid-cols-2 h-100 w-full bg-white">
            <div className="flex-1 relative w-full h-1/2 md:h-full flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-700">
                <div className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute w-48 h-48 rounded-full bg-white/5 blur-2xl top-10 left-10" />

                <h1 className="text-white text-6xl font-black tracking-widest opacity-20 select-none">
                    {"</>"}
                </h1>
            </div>

            <div className="flex-1 flex flex-col justify-center items-start px-6 py-2 gap-3">
                <h2 className="text-lg md:text-2xl font-extrabold text-black uppercase tracking-tight leading-tight italic">Crie, Conecte e Escale</h2>
                <p className="text-gray-700">Conheça mais sobre mim, minha história no desenvolvimento.</p>
                <Link to="/sobre" className="text-black border-2 border-black font-semibold px-6 py-3 text-sm rounded-lg hover:bg-black hover:text-white transition-colors">Sobre mim</Link>
            </div>
        </div>
    )
}