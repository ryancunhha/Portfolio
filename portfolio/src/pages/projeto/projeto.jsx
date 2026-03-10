import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/header/header";
import Introducao from "./section/intro/intro";
import Conteudo from "./section/conteudo/conteudo";
import Erro from "../404/404";
import Comentarios from "./section/comentarios/comentarios";

import Acessibilidade from "./section/acessibilidade/acessibilidade";

import dadosProjeto from "../../../public/data/projetos.json";
import { slugify } from "../../utils/slugify/slugify";

export default function ProjetoDetalhe({ dark, mudarTema }) {
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
        if (projetoAtual?.titulo) {
            document.title = `${projetoAtual.titulo}`
        } else {
            document.title = slug.projeto
        }
    }, [])

    if (!projetoAtual) return <Erro />

    useEffect(() => {
        document.title = projetoAtual.titulo || "Projeto"
    }, [projetoAtual.titulo])

    return (
        <>
            <Header dark={dark} mudarTema={mudarTema} />

            <div className={`max-w-7xl mx-auto flex justify-center ${dark ? "dark-mode" : ""} `}>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-2">

                    <aside className="hidden md:block">
                        <div className="relative top-60 px-5">
                            <Acessibilidade dark={dark} paragrafos={projetoAtual.conteudo.paragrafo} slug={projetoAtual.slug} />
                        </div>
                    </aside>

                    <main className="w-full px-2 pb-2 md:px-0">
                        <Introducao projeto={projetoAtual} categoria={categoriaAtual} dark={dark} />

                        <Conteudo projeto={projetoAtual} dark={dark} />

                        {projetoAtual.conteudo.comentarios?.length > 0 && (
                            <div>
                                <Comentarios dark={dark} comentarios={projetoAtual.conteudo.comentarios} slugAtual={projetoAtual.slug} data={projetoAtual.ano} />
                            </div>
                        )}
                    </main>

                    <aside className="hidden md:block"></aside>
                </div>
            </div>
        </>
    )
}