import { Link } from "react-router-dom";

export function CardProjeto({ repo }) {
    const letraInicial = repo.name ? repo.name.charAt(0).toUpperCase() : "</>";

    return (
        <Link key={repo.id} to={`/projetos/${repo.id}`} className="hover:bg-[#999]/30 rounded-xl flex flex-col cursor-pointer transition-colors">
            <div className="aspect-video p-1">
                <div className="relative overflow-hidden bg-linear-to-br from-[#1c1c1c] to-[#0a0a0a] border border-[#222] group-hover:border-[#555] w-full h-full rounded-xl p-4 flex flex-col justify-between">
                    <div className="absolute -bottom-8 -right-4 text-[120px] font-black text-[#2a2a2a]/60 rotate-[-10deg] select-none">{letraInicial}</div>

                    <div className="flex justify-end h-6">
                        {repo.language && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#222] text-[#ccc] border border-[#444] rounded-md flex items-center">
                                {repo.language}
                            </span>
                        )}
                    </div>

                    <p className="text-[13px] text-[#aaa] line-clamp-3 my-2 leading-relaxed z-1">
                        {repo.description || "Descrição indisponível."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-auto h-5.5 overflow-hidden">
                        {repo.topicos && repo.topicos.slice(0, 3).map((topico) => (
                            <span key={topico} className="text-[10px] uppercase font-medium px-2 py-0.5 bg-[#222] text-[#888] border border-[#333] rounded-full flex items-center">
                                {topico}
                            </span>
                        ))}

                        {repo.topicos && repo.topicos.length > 3 && (
                            <span className="text-[10px] text-[#666] pl-1 font-medium flex items-center">
                                +{repo.topicos.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-1.5 mx-2">
                <p className="truncate font-bold text-lg first-letter:uppercase">{repo.name.replace(/-/g, " ")}</p>
                <p className="text-[12px] font-semibold text-[#888]">{repo.data.ano} {repo.atualizado}</p>
            </div>
        </Link>
    )
}