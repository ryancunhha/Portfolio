import { useState, useEffect, useMemo } from "react";

import Slide from "./section/slide/slide";

import { Link } from "react-router-dom";
import { sortearProjetos } from "../../../../utils/random/projetosAleatorio";
import dadosProjeto from "../../../../../public/data/projetos.json";
import { logo, zoom } from "../../../../config/imagem";
import Acessibilidade from "../acessibilidade/acessibilidade";

export default function Conteudo({ projeto, dark }) {
    const [imagemAberta, setImagemAberta] = useState(null)
    const existeAlt = projeto.conteudo.alt?.[0] || "Imagem Principal"
    const restanteAlt = (projeto.conteudo.alt?.length > 1) ? projeto.conteudo.alt.slice(1) : ["Imagem do Projeto"]

    const todosParagrafos = projeto.conteudo.paragrafo || []

    const [tamanhoFonte, setTamanhoFonte] = useState(() => {
        const salvo = localStorage.getItem("preferencia-fonte")
        return salvo ? parseInt(salvo) : 16
    })

    useEffect(() => {
        const handleFontSize = (e) => setTamanhoFonte(e.detail)
        window.addEventListener("update-font-size", handleFontSize)

        return () => window.removeEventListener("update-font-size", handleFontSize)
    }, [])

    const projetosRecomendados = useMemo(() => {
        const todosProjetos = dadosProjeto.flatMap(categoria => categoria.subCartegorias || [])

        return sortearProjetos(todosProjetos, 4, projeto.slug)
    }, [projeto.slug])

    if (projetosRecomendados.length === 0) return null

    const { bloco1, bloco2, bloco3 } = useMemo(() => {
        const p = projeto.conteudo.paragrafo || []

        return {
            bloco1: p.slice(0, 3),
            bloco2: p.slice(3, 9),
            bloco3: p.slice(9)
        }
    }, [projeto.slug])

    const renderTextoMestre = (arrayDeTexto) => {
        if (!arrayDeTexto || arrayDeTexto.length === 0) return null

        return arrayDeTexto.map((texto, index) => (
            <p key={index} className="mb-5 tracking-tighter leading-relaxed">
                {renderTextoComLink(texto)}
            </p>
        ))
    }

    function renderTextoComLink(texto) {
        const regex = /\[([^\]|]+)(?:\|([^\]]+))?\]/g
        const partes = texto.split(regex)

        return partes.map((parte, index) => {
            if (index % 3 === 1) {
                const conteudoPrincipal = parte
                const textoAlternativo = partes[index + 1]

                if (conteudoPrincipal.startsWith("http")) {
                    const link = conteudoPrincipal
                    const textoFinal = textoAlternativo ? textoAlternativo : link.replace(/(https?:\/\/)?(www\.)?/, "").split("/")[0]

                    return (
                        <a key={index} href={link} target="_blank" rel="noopener noreferrer" className={`cursor-pointer underline ${dark ? "text-white!" : "text-black!"}`}>
                            {textoFinal}
                        </a>
                    )
                }

                return (
                    <mark key={index} className="animate-highlight text-black px-1 rounded-sm no-underline font-medium" style={{ animationDelay: `${index * 0.1}s` }} >
                        {conteudoPrincipal}
                    </mark>
                )
            }

            if (index % 3 === 2) return null

            return <span key={index}>{parte}</span>
        })
    }

    function ModalImagem({ src, onClose, altTexto }) {
        const [zoom, setZoom] = useState(false)

        useEffect(() => {
            document.body.style.overflow = "hidden"

            const handleEsc = (e) => { if (e.key === "Escape") onClose() }
            window.addEventListener("keydown", handleEsc)

            return () => {
                document.body.style.overflow = "auto"
                window.removeEventListener("keydown", handleEsc)
            }
        }, [onClose])

        if (!src) return null

        const handleImageClick = (e) => {
            e.stopPropagation()

            setZoom(!zoom)
        }

        return (
            <div className="fixed inset-0 z-30 bg-black/85 flex items-center justify-center backdrop-blur-xs transition-all flex-col md:flex-row">
                <div className="absolute top-6 text-white/50">
                    <img loading="lazy" className="h-8" src={logo} alt="Logo" />
                </div>

                <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 text-white! font-black bg-black/30! md:bg-white/0! md:hover:bg-white/20! w-10 h-10 rounded-full flex items-center justify-center transition-all z-40">✕</button>

                <div className={`relative flex-1 w-full h-full flex items-center justify-center ${zoom ? "overflow-y-auto block" : "overflow-hidden flex"}`} >
                    <img src={src} onClick={handleImageClick} className={`transition-all duration-100 ease-in-out transform cursor-zoom-in ${zoom ? "scale-100 cursor-zoom-out min-w-full my-auto" : "max-w-full md:max-w-[80vw] max-h-[60vh] md:max-h-[85vh] object-contain scale-90"}`} alt={existeAlt} />
                </div>

                <div className="relative w-full md:w-65 flex flex-col gap-1 px-5 pt-2.5 pb-5">
                    <p className={`font-mono text-xs tracking-widest uppercase text-white!`}>
                        1 / 1
                    </p>

                    <p className={`text-[9px] uppercase font-bold tracking-tighter text-gray-500!`}>Clique na foto para expandir</p>

                    {altTexto && (
                        <p className={`text-xs leading-relaxed font-light text-white!`}>
                            {altTexto}
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {imagemAberta && (<ModalImagem src={imagemAberta} onClose={() => setImagemAberta(null)} altTexto={existeAlt} />)}

            <div className="my-2.5">
                <div className="relative group overflow-hiddenm">
                    <div className="absolute inset-0 flex opacity-100 group-hover:opacity-0 transition-opacity duration-250 pointer-events-none">
                        <img className="bg-white! rounded-br-sm cursor-zoom-in absolute p-0.5 h-3.5" src={zoom} alt="Zoom" />
                    </div>

                    <img onClick={() => setImagemAberta(projeto.conteudo.imagem[0])} loading="lazy" className="cursor-pointer w-full aspect-video object-contain" src={projeto.conteudo.imagem[0]} alt={existeAlt} />
                </div>

                <div className="pt-3 px-1 md:hidden">
                    <Acessibilidade dark={dark} paragrafos={todosParagrafos} slug={projeto.slug} />
                </div>

                <div style={{ fontSize: `${tamanhoFonte}px` }} className="mt-4">
                    {renderTextoMestre(bloco1)}
                </div>

                <section className="my-6 px-4">
                    <h4 className="mb-2  font-medium text-xs list-item">Projetos que podem te interessar</h4>

                    <div className="grid">
                        <ul className="text-xs">
                            {projetosRecomendados.map((projeto, index) => (
                                <li className="group max-w-max max-h-max" key={projeto.slug}>
                                    <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} className="flex items-center max-w-max text-xs gap-3" to={`/${projeto.slug}`}>
                                        <span className={`text-2xl font-black ${dark ? "text-gray-700! group-hover:text-gray-200!" : "text-gray-200! group-hover:text-gray-700!"} transition-colors`}>{index + 1}</span>
                                        <span className="group-hover:underline">{projeto.titulo}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <div style={{ fontSize: `${tamanhoFonte}px` }} className="mt-4">
                    {renderTextoMestre(bloco2)}
                </div>

                <Slide imagens={projeto.conteudo.imagem} altTexto={restanteAlt} dark={dark} />

                <div style={{ fontSize: `${tamanhoFonte}px` }} className="mt-4">
                    {renderTextoMestre(bloco3)}
                </div>

                {projeto.conteudo.tags && (
                    <div className="flex flex-col gap-1">
                        <hr className="mt-3 text-[#dcdcdc]" />

                        {projeto.conteudo.tags && (
                            <div className="rounded px-1 overflow-x-auto select-none no-scrollbar flex whitespace-nowrap gap-1 py-1">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-900! bg-zinc-100! px-2 py-0.5 rounded-xs" >
                                    tags:
                                </span>

                                {projeto.conteudo.tags.map((tag, index) => (
                                    <span key={index} className="text-[8px] font-bold uppercase tracking-wider text-zinc-500! rounded-xs bg-zinc-100 px-2 py-0.5" >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <hr className="mb-3 text-[#dcdcdc]" />
                    </div>
                )}
            </div>
        </>
    )
}