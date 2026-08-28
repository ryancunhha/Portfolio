import { Link } from "react-router-dom";

export function CardProjeto({ repo }) {
    return (
        <Link key={repo.id} to={`/projetos/${repo.id}`} className="block bg-[#050505] border border-[#1a1a1a]">
            <div className="relative w-full min-h-50 bg-[#0c0c0c] p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

                <div className="flex justify-start">
                    {repo.language && (
                        <span className="text-[10px] font-mono font-bold px-3 py-2 bg-[#151515] text-[#999] border border-[#222] rounded uppercase tracking-widest">
                            {repo.language}
                        </span>
                    )}
                </div>

                <p className="text-2xl md:text-3xl font-black text-white/90 capitalize tracking-tight my-4">{repo.name.replace(/-/g, " ")}</p>

                <div className="flex flex-wrap justify-end gap-2">
                    {repo.topicos && repo.topicos.slice(0, 3).map((topico) => (
                        <span key={topico} className="text-[10px] uppercase font-bold px-3 py-1 bg-[#1a1a1a] text-[#777] rounded">
                            {topico}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6 flex gap-2 flex-col justify-between mb-4">
                <p className="truncate font-bold text-white capitalize flex items-center gap-2">{repo.owner.replace(/-/g, " ")}</p>

                <p className="text-[#999]">{repo.data.ano} {repo.atualizado}</p>

                <p className="leading-relaxed font-medium">
                    {repo.description || "Descrição indisponível"}
                </p>
            </div>
        </Link>
    )
}