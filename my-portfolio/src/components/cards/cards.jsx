import { Link } from "react-router-dom";

export function CardProjeto({ repo }) {
    return (
        <Link key={repo.id} to={`/projetos/${repo.id}`} className="block bg-black border border-[#1a1a1a]">
            <div className="w-full min-h-50 bg-[#0c0c0c] p-6 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-start">
                    {repo.language && (
                        <span className="text-[10px] font-mono font-bold px-3 py-2 bg-[#151515] text-[#999] border border-[#222] rounded uppercase tracking-widest">
                            {repo.language}
                        </span>
                    )}
                </div>

                <p className="text-2xl md:text-3xl font-black text-white capitalize truncate tracking-tight my-4">{repo.name.replace(/-/g, " ")}</p>

                <div className="flex flex-wrap justify-end gap-2">
                    {repo.topicos && repo.topicos.slice(0, 3).map((topico) => (
                        <span key={topico} className="text-[10px] uppercase font-bold px-3 py-1 bg-[#1a1a1a] text-[#777] rounded">
                            {topico}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6 flex gap-2 flex-col justify-between mb-4">
                <div className="flex flex-row gap-2">
                    {repo.avatar_url && <img loading="lazy" fetchPriority="auto" className="rounded-full w-6 h-6" src={repo.avatar_url} alt="" />}
                    <p className="truncate font-bold text-white capitalize flex items-center gap-2">{repo.owner.replace(/-/g, " ")}</p>
                </div>

                <p className="text-[#999]">{repo.data.ano} {repo.atualizado}</p>

                <p className="leading-relaxed font-medium">
                    {repo.description || "Descrição indisponível"}
                </p>
            </div>
        </Link>
    )
}