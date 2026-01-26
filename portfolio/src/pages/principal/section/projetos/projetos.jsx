import { Link } from "react-router-dom";

import dadosProjetos from "../../../../data/projetos.json";
import { slugify } from "../../../../utils/slugify/slugify";

function Projetos() {

    return (
        <div>
            {dadosProjetos.map((categoria, index) => (

                <div key={index} className="ml-5">

                    <div>
                        <hr className="mt-3 text-[#dcdcdc]" />
                        <p className="text-xs py-3 text-[#727171]">{categoria.categoria}</p>
                    </div>

                    <div className="mr-5">
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">

                            {categoria.subCartegorias.map((projeto, i) => (

                                <div key={i} className="mb-3.5 break-inside-avoid">

                                    <Link onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" })}} title={projeto.resuminho} className="cursor-pointer" to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                        <img loading="lazy" src={projeto.imagem?.[0]} alt={projeto.nome} className="duration-300 ease-in-out w-full shadow-sm hover:shadow-lg rounded-md" />
                                    </Link>

                                    <div className="my-2 flex justify-between text-sm items-center">

                                        <Link onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" })}} title={projeto.nome} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                            <p className="text-sm hover:underline tracking-tight">{projeto.nome}</p>
                                        </Link>

                                        <p className="text-xs">{projeto.ano}</p>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}

export default Projetos