import { Link } from "react-router-dom";

import dadosProjetos from "../../../data/projetos.json";
import { slugify } from "../../../utils/slugify/slugify";

function Project() {

    function CriarCard(projeto) {
        return (
            <div>
                <p className="text-xs text-[#727171]">{projeto.categoria}</p>

                <ul className="list-none flex flex-col gap-0.5">
                    {projeto.subCartegorias.map((item, index) => (
                        <li key={index} title={item.nome} className="text-sm wrap-break-word group flex items-center gap-2">
                            
                            <Link className="hover:underline" to={`/${slugify(item.slug) ?? item.slug}`}>{item.nome}</Link>

                            {item.emDesenvolvimento && (
                                <div className="flex items-center gap-1.5 ml-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8101] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8101]"></span>
                                    </span>

                                    <span className="text-[9px] font-bold text-[#FF8101] uppercase tracking-tighter">
                                        Em construção
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="flex flex-col pb-5">
            <div className="flex flex-col gap-3">
                {
                    dadosProjetos.map((p, index) => (
                        <CriarCard key={index} {...p} />
                    ))
                }
            </div>
        </div>
    )
}

export default Project