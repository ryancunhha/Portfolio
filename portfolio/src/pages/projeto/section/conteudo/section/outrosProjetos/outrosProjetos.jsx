import { Link } from "react-router-dom";
import { sortearProjetos } from "../../../../../../utils/random/projetosAleatorio";

import dadosProjeto from "../../../../../../data/projetos.json";

function OutroProjetos({ slugAtual }) {
    const todosProjetos = dadosProjeto.flatMap(
        categoria => categoria.subCartegorias
    )

    const projetos = sortearProjetos(todosProjetos, 4, slugAtual)

    return (
        <section className="my-6 px-4">
            <h4 className="mb-2 font-medium text-xs list-item">Projetos que podem te interessar</h4>

            <div className="grid">
                <ul className="text-xs">
                    {projetos.map((projeto, index) => (
                        <li className="group max-w-max max-h-max" key={projeto.slug}>
                            <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} className="flex items-center max-w-max text-xs gap-3" to={`/${projeto.slug}`}>
                                <span className="text-xl font-black text-gray-200 group-hover:text-black transition-colors">{index + 1}</span>
                                <span className="group-hover:underline">{projeto.nome}</span>
                            </Link>
                        </li>
                    ))}

                </ul>

            </div>



        </section>
    )
}

export default OutroProjetos