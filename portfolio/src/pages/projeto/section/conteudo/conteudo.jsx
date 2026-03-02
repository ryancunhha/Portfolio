import { useState, useEffect, useMemo, useRef } from "react";
import Slide from "./section/slide/slide";
import Comentarios from "./section/comentarios/comentarios";

import { Link } from "react-router-dom";
import { sortearProjetos } from "../../../../utils/random/projetosAleatorio";
import dadosProjeto from "../../../../../public/assets/data/projetos.json";

import { check, logo, zoom } from "../../../../config/index";

export default function Conteudo({ projeto }) {
    const [imagemAberta, setImagemAberta] = useState(null)
    const comentarios = projeto?.conteudo?.comentarios
    const Mobile = window.innerWidth >= 768
    const existeAlt = projeto.conteudo.alt?.[0] || "Imagem Principal"
    const restanteAlt = (projeto.conteudo.alt?.length > 1) ? projeto.conteudo.alt.slice(1) : ["Imagem do Projeto"]

    const projetosRecomendados = useMemo(() => {
        const todosProjetos = dadosProjeto.flatMap(categoria => categoria.subCartegorias || [])
        return sortearProjetos(todosProjetos, 4, projeto.slug)
    }, [projeto.slug])

    if (projetosRecomendados.length === 0) return null

    const [progressoAudio, setProgressoAudio] = useState(0)
    const [salvando, setSalvando] = useState(false)
    const [tamanhoFonte, setTamanhoFonte] = useState(() => {
        const salvo = localStorage.getItem("preferencia-fonte")
        return salvo ? parseInt(salvo) : 16
    })
    const [falando, setFalando] = useState(false)
    const [velocidade, setVelocidade] = useState(() =>
        parseFloat(localStorage.getItem("pref-velocidade")) || 1
    )
    const [volume, setVolume] = useState(() => {
        const salvo = localStorage.getItem("pref-volume")
        return salvo !== null ? parseFloat(salvo) : 1
    })

    const todosParagrafos = projeto.conteudo.paragrafo || []
    const { bloco1, bloco2, bloco3 } = useMemo(() => {
        const p = projeto.conteudo.paragrafo || []

        return {
            bloco1: p.slice(0, 3),
            bloco2: p.slice(3, 9),
            bloco3: p.slice(9)
        }
    }, [projeto.slug])

    useEffect(() => {
        localStorage.setItem("pref-velocidade", velocidade)
        localStorage.setItem("pref-volume", volume)
        localStorage.setItem("preferencia-fonte", tamanhoFonte.toString())

        dispararCheck()
    }, [velocidade, volume, tamanhoFonte])

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel()
                setFalando(false)
                setProgressoAudio(0)
            }
        }
    }, [projeto.slug])

    const dispararCheck = () => {
        setSalvando(true)
        if (window.checkTimer) clearTimeout(window.checkTimer)

        window.checkTimer = setTimeout(() => {
            setSalvando(false)
        }, 1300)
    }

    const renderTextoMestre = (arrayDeTexto) => {
        if (!arrayDeTexto || arrayDeTexto.length === 0) return null

        return arrayDeTexto.map((texto, index) => (
            <p key={index} className="mb-5 tracking-tighter leading-relaxed">
                {renderTextoComLink(texto)}
            </p>
        ))
    }

    const falarTexto = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel()
            setFalando(false)
            setProgressoAudio(0)
            return
        }

        const limparTextoParaAudio = (texto) => {
            return texto.replace(/\[([^\]|]+)(?:\|([^\]]+))?\]/g, (match, p1, p2) => {
                return p2 ? p2 : p1
            })
        }

        const textoGeral = todosParagrafos.map(p => limparTextoParaAudio(p)).join(". ")
        const utterance = new SpeechSynthesisUtterance(textoGeral)
        utterance.lang = "pt-BR"
        utterance.rate = velocidade
        utterance.volume = volume

        utterance.onboundary = (event) => {
            const charAtual = event.charIndex
            const totalChar = textoGeral.length
            const porcentagem = (charAtual / totalChar) * 100
            setProgressoAudio(porcentagem)
        }

        utterance.onend = () => {
            setFalando(false)
            setProgressoAudio(0)
        }

        utterance.onend = () => {
            setFalando(false)
            setProgressoAudio(0)
        }

        utterance.onerror = () => {
            setFalando(false)
        }

        setFalando(true)
        window.speechSynthesis.speak(utterance)
    }

    function renderTextoComLink(texto) {
        const regex = /\[([^\]|]+)(?:\|([^\]]+))?\]/g;
        const partes = texto.split(regex);

        return partes.map((parte, index) => {
            if (index % 3 === 1) {
                const conteudoPrincipal = parte
                const textoAlternativo = partes[index + 1]

                if (conteudoPrincipal.startsWith("http")) {
                    const link = conteudoPrincipal
                    const textoFinal = textoAlternativo ? textoAlternativo : link.replace(/(https?:\/\/)?(www\.)?/, "").split("/")[0]

                    return (
                        <a key={index} title={link} href={link} target="_blank" rel="noopener noreferrer" className="cursor-pointer underline text-black hover:no-underline font-medium">
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
            <div className="fixed inset-0 z-30 bg-black/85 flex items-center justify-center backdrop-blur-sm transition-all flex-col md:flex-row">
                <div className="absolute top-6 text-white/50">
                    <img loading="lazy" className="h-8" src={logo} alt="Logo" />
                </div>

                <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 text-white font-black bg-black/30 md:bg-white/0 md:hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all z-40" title="Fechar">✕</button>

                <div className={`relative flex-1 w-full h-full flex items-center justify-center ${zoom ? "overflow-y-auto block" : "overflow-hidden flex"}`} >
                    <img src={src} onClick={handleImageClick} className={`transition-all duration-100 ease-in-out transform ${Mobile ? "cursor-zoom-in" : "cursor-default"} ${zoom ? "scale-100 cursor-zoom-out min-w-full my-auto" : "max-w-full md:max-w-[80vw] max-h-[60vh] md:max-h-[85vh] object-contain scale-90"}`} alt={existeAlt} />
                </div>

                <div className="relative w-full md:w-65 flex flex-col gap-1 px-5 pt-2.5 pb-5">
                    <p className="text-white font-mono text-xs tracking-widest uppercase">
                        1 / 1
                    </p>

                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Galeria de Fotos | Clique na foto para expandir</p>

                    {altTexto && (
                        <p className="text-white/80 text-xs leading-relaxed font-light">
                            {altTexto}
                        </p>
                    )}
                </div>
            </div>
        )
    }

    const Pergunta = ({ texto }) => {
        const [visivel, setVisivel] = useState(false)
        const containerRef = useRef(null)

        useEffect(() => {
            const fecharClickFora = (e) => {
                if (containerRef.current && !containerRef.current.contains(e.target)) {
                    setVisivel(false)
                }
            }

            document.addEventListener('mousedown', fecharClickFora)
            return () => document.removeEventListener('mousedown', fecharClickFora)
        }, [])

        return (
            <div className="group relative inline-block" ref={containerRef} onMouseEnter={() => setVisivel(true)} onMouseLeave={() => setVisivel(false)} >
                <button type="button" onClick={() => setVisivel(!visivel)} className="ml-0.5 w-2.5 h-2.5 border border-zinc-400 text-black text-[8px] font-bold rounded-full flex items-center justify-center cursor-help">
                    ?
                </button>

                <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 w-28 p-0.5 bg-zinc-900 text-white text-[9px] md:text-[10px] text-center rounded border border-zinc-700 transition-all duration-300 z-50 pointer-events-none ${visivel ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`} >
                    {texto}
                    <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-zinc-900"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            {imagemAberta && (
                <ModalImagem src={imagemAberta} onClose={() => setImagemAberta(null)} altTexto={existeAlt} />
            )}

            <div className="my-2.5 max-w-7xl mx-auto px-2">
                <div className="relative group overflow-hiddenm">
                    <div className="absolute inset-0 flex opacity-100 group-hover:opacity-0 transition-opacity duration-250 pointer-events-none">
                        <img className="bg-white rounded-br-sm cursor-zoom-in absolute p-px h-3.5" src={zoom} alt="Zoom" />
                    </div>

                    <img onClick={() => setImagemAberta(projeto.conteudo.imagem[0])} loading="lazy" className="cursor-zoom-in bg-zinc-50 w-full aspect-video object-contain" src={projeto.conteudo.imagem[0]} alt={existeAlt} />
                </div>

                <div className="pt-4">
                    <div className="mb-2 flex flex-row gap-1 items-center">
                        <p className="text-[11px] font-semibold">Personalize do seu jeito</p>
                        <Pergunta texto="Salvamento Automático" />
                    </div>

                    <div className="flex items-center flex-wrap flex-row font-bold gap-3 ">
                        <div className="flex gap-2 text-[13px] md:text-[16px]">

                            <button title="Ouvir o texto" className="cursor-pointer relative w-8 h-8 flex items-center justify-center group" onClick={falarTexto}>
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-gray-100" />
                                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - (113 * progressoAudio) / 100} strokeLinecap="round" className="text-black transition-all duration-200 ease-linear" />
                                </svg>

                                <span className={`relative z-2 flex h-7 w-7 items-center justify-center rounded-full transition-all ${falando ? "" : "bg-transparent text-black grayscale opacity-70"}`}>
                                    {falando ? "❚❚" : "▶︎"}
                                </span>
                            </button>

                            <div onChange={(e) => { setVelocidade(parseFloat(e.target.value)); window.speechSynthesis.cancel(); setFalando(false) }} className="flex items-center">
                                <select title="Velocidade" value={velocidade} onChange={(e) => { const val = parseFloat(e.target.value); setVelocidade(val); window.speechSynthesis.cancel(); setFalando(false); }} className="bg-transparent text-[10px] font-bold border border-gray-200 rounded px-1 cursor-pointer focus:outline-none" >
                                    <option value="0.5">0.5x</option>
                                    <option value="0.8">0.8</option>
                                    <option value="1">1x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                    <option value="3">3x</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 group">
                            <p className="text-[11px] w-9 flex items-center justify-between">
                                <span className="text-[10px]">{`${Math.round(volume * 100)}%`}</span>
                                {`${volume === 0 ? "🔇" : "🔈"}`}
                            </p>

                            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => { const val = parseFloat(e.target.value); setVolume(val); window.speechSynthesis.cancel(); setFalando(false); }} className="w-10 md:w-15 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4c4c4c]" title={`Volume: ${Math.round(volume * 100)}%`} />
                        </div>

                        <div className="flex items-center gap-2">
                            <button title="Diminuir o texto" onClick={() => setTamanhoFonte(prev => Math.max(12, prev - 2))} className="cursor-pointer">A-</button>
                            <button title="Aumentar o texto" onClick={() => setTamanhoFonte(prev => Math.min(26, prev + 2))} className="cursor-pointer">A+</button>
                        </div>

                        {salvando && (
                            <div className="flex items-center gap-1 animate-check">
                                <img className="h-4" src={check} alt="Salvando" />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ fontSize: `${tamanhoFonte}px` }} className="mt-4">
                    {renderTextoMestre(bloco1)}
                </div>

                <section className="my-6 px-4">
                    <h4 className="mb-2 font-medium text-xs list-item">Projetos que podem te interessar</h4>

                    <div className="grid">
                        <ul className="text-xs">
                            {projetosRecomendados.map((projeto, index) => (
                                <li className="group max-w-max max-h-max" key={projeto.slug}>
                                    <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} className="flex items-center max-w-max text-xs gap-3" to={`/${projeto.slug}`}>
                                        <span className="text-2xl font-black text-gray-200 group-hover:text-black transition-colors">{index + 1}</span>
                                        <span className="group-hover:underline">{projeto.titulo}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <div style={{ fontSize: `${tamanhoFonte}px` }}>
                    {renderTextoMestre(bloco2)}
                </div>

<<<<<<< Updated upstream
                <Comentarios comentarios={comentarios} />
=======
                <Slide imagens={projeto.conteudo.imagem} altTexto={restanteAlt} />

                <div style={{ fontSize: `${tamanhoFonte}px` }}>
                    {renderTextoMestre(bloco3)}
                </div>

                {projeto.conteudo.tags && (
                    <div className="flex flex-col gap-1">
                        <hr className="mt-3 text-[#dcdcdc]" />

                        {projeto.conteudo.tags && (
                            <div className="flex justify-center flex-wrap gap-1 py-1">
                                {projeto.conteudo.tags.map((tag, index) => (
                                    <span key={index} className="text-[8px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-sm border border-zinc-200" >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <hr className="mb-3 text-[#dcdcdc]" />
                    </div>
                )}

                <Comentarios comentarios={comentarios} slugAtual={projeto.slug} data={projeto.ano} />
>>>>>>> Stashed changes
            </div>
        </>
    )
}