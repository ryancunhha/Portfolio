import { useParams } from "react-router-dom";

import Header from "../../components/header/header";
import Introducao from "./section/intro/intro";
import Conteudo from "./section/conteudo/conteudo";
import Erro from "../404/404";

import dadosProjeto from "../../data/projetos.json";
import { slugify } from "../../utils/slugify/slugify";

function ProjetoDetalhe() {
    const { slug } = useParams()

    let projetoAtual = null
    let categoriaAtual = null

    for (const categoria of dadosProjeto) {
        const encontrados = categoria.subCartegorias.find(p => (p.slug === slug || slugify(p.slug) === slug || slugify(p.nome) === slug))

        if (encontrados) {
            projetoAtual = encontrados
            categoriaAtual = categoria
            break
        }
    }

    if (!projetoAtual) return <Erro />

    return (
        <>
            <Header />

            <div className="pt-14 pb-8 flex justify-center">

                <div className="w-[95%] md:w-[45%]">
                    <Introducao projeto={projetoAtual} categoria={categoriaAtual} />

                    <div className="px-2">
                        <Conteudo projeto={projetoAtual} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjetoDetalhe