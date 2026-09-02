import { useProjetos } from "../../contexts/ProjetosContext";
import { Link } from "react-router-dom";

export default function BannerGithub() {
    const { projetos, carregando } = useProjetos()

    if (carregando) return <div className="flex flex-col h-100 w-full bg-white animate-pulse" />;

    if (!projetos || projetos.length === 0) return null;

    const projeto = projetos[0];

    return (
        <div className="w-full flex flex-col md:flex-row h-100">
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-between items-start md:gap-6 bg-zinc-950">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex gap-2 items-center justify-between w-full border-b border-zinc-800 pb-3">
                        <span className="text-white font-black px-3 py-1 text-[11px] uppercase tracking-widest">{projeto.atualizado}</span>
                    </div>

                    <p className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mt-2 truncate">{projeto.name.replace(/-/g, " ")}</p>

                    <p className="text-zinc-400 text-sm md:text-base font-sans line-clamp-1 truncate">{projeto.description || "Acesse o código fonte completo e a documentação." }</p>
                </div>

                <div className="w-full flex flex-row items-center justify-between gap-4 md:pt-4">
                    <Link to={`/projetos/${projeto.id}`} className="w-auto px-6 py-3 bg-white text-zinc-950 font-black text-xs uppercase tracking-widest hover:bg-zinc-950 hover:text-white transition-colors text-center">ACESSAR  →</Link>
                </div>
            </div>

            <div className="bg-zinc-900 p-8 flex flex-col items-center justify-center">
                <div className="text-center flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">TECNOLOGIA</span>
                    <span className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">{projeto.language || "CODE"}</span>
                    <div className="w-12 h-1 bg-yellow-400 mt-4" />
                </div>
            </div>
        </div>
    )
}