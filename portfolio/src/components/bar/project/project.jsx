import { Link } from "react-router-dom";

import dadosProjetos from "../../../data/projetos.json";
import { slugify } from "../../../utils/slugify/slugify";

function Project() {

    function CriarCard(projeto) {
        return (
            <div>
                <p className="text-xs text-[#727171]">{projeto.categoria}</p>

                <ul className="list-none">
                    {projeto.subCartegorias.map((item, index) => (
                        <li key={index} title={item.nome} className="text-sm wrap-break-word">
                            <Link className="hover:underline" to={`/${slugify(item.slug) ?? item.slug}`}>{item.nome}</Link>
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