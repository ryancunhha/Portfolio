import { Link } from "react-router-dom";

import dadosProjetos from "../../../../public/data/projetos.json";
import { slugify } from "../../../utils/slugify/slugify";

export default function Project({ dark }) {

    function CriarCard(projeto) {
        return (
            <div>
                <p className={`text-xs ${dark ? "text-gray-300!" : "text-[#727171]!"}`}>{projeto.categoria}</p>

                <ul className="list-none flex flex-col gap-2.5">
                    {projeto.subCartegorias.map((item, index) => (
                        <li key={index} className="text-sm wrap-break-word group flex items-center gap-2">
                            <Link className="hover:underline" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); onClose(); }} to={`/${slugify(item.slug) ?? item.slug}`}>{item.titulo}</Link>

                            {item.emDesenvolvimento && (
                                <div className="flex items-center gap-1.5 ml-1">
                                    <span className="relative flex h-1 w-1">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8101] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1 w-1 bg-[#FF8101]"></span>
                                    </span>

                                    <span className="w-max text-[9px] font-bold text-[#FF8101]! uppercase tracking-tighter">Dev</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-3 w-full">
                {dadosProjetos.map((p, index) => (
                    <CriarCard key={index} {...p} />
                ))}
            </div>
        </div>
    )
}