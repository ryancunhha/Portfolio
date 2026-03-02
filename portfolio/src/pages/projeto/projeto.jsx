import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import Header from "../../components/header/header";
import Introducao from "./section/intro/intro";
import Conteudo from "./section/conteudo/conteudo";
import Erro from "../404/404";

import dadosProjeto from "../../../public/assets/data/projetos.json";
import { slugify } from "../../utils/slugify/slugify";

export default function ProjetoDetalhe() {
    const { slug } = useParams()

    let projetoAtual = null
    let categoriaAtual = null

    for (const categoria of dadosProjeto) {
        const encontrados = categoria.subCartegorias.find(p => (p.slug === slug || slugify(p.slug) === slug || slugify(p.titulo) === slug))

        if (encontrados) {
            projetoAtual = encontrados
            categoriaAtual = categoria
            break
        }
    }

    useEffect(() => {
        if (projetoAtual?.nome) {
            document.title = `${projetoAtual.nome}`
        } else {
            document.title = slug.projeto
        }
    },)

    if (!projetoAtual) return <Erro />

    useEffect(() => {
        document.title = projetoAtual.titulo || "Projeto"
    }, [projetoAtual.titulo])

    return (
        <>
            <Header />

            <div className="pt-1 pb-8 flex justify-center">
                <div className="w-[95%] md:w-[45%]">
                    <Introducao projeto={projetoAtual} categoria={categoriaAtual} />

                    <div>
                        <Conteudo projeto={projetoAtual} />
                    </div>
                </div>
            </div>
        </>
    )
}