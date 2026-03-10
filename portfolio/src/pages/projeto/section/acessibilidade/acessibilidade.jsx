import { useState, useEffect, useRef } from "react";

import { check } from "../../../../config/imagem";

export default function Acessibilidade({ dark, paragrafos, slug }) {
    const idUnico = useState(() => Math.random().toString(36).substr(2, 5))[0]
    const primeiraMontagem = useRef(true)

    const [falando, setFalando] = useState(false)
    const [progressoAudio, setProgressoAudio] = useState(0)
    const [salvando, setSalvando] = useState(false)

    const [tamanhoFonte, setTamanhoFonte] = useState(() => {
        const salvo = localStorage.getItem("preferencia-fonte")
        return salvo ? parseInt(salvo) : 16
    })

    const [velocidade, setVelocidade] = useState(() =>
        parseFloat(localStorage.getItem("pref-velocidade")) || 1
    )

    const [volume, setVolume] = useState(() => {
        const salvo = localStorage.getItem("pref-volume")
        return salvo !== null ? parseFloat(salvo) : 1
    })

    useEffect(() => {
        if (primeiraMontagem.current) {
            primeiraMontagem.current = false
            return
        }

        localStorage.setItem("pref-velocidade", velocidade)
        localStorage.setItem("pref-volume", volume)
        localStorage.setItem("preferencia-fonte", tamanhoFonte.toString())
        window.dispatchEvent(new CustomEvent("update-font-size", { detail: tamanhoFonte }))

        dispararCheck()
    }, [velocidade, volume, tamanhoFonte])

    useEffect(() => {
        const sincronizar = (e) => {
            if (e.type === "update-font-size") {
                setTamanhoFonte(e.detail)
            }
        }

        window.addEventListener("update-font-size", sincronizar)
        return () => window.removeEventListener("update-font-size", sincronizar)
    }, [])

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel()
                setFalando(false)
                setProgressoAudio(0)
            }
        }
    }, [slug])

    const dispararCheck = () => {
        setSalvando(true)

        const timer = setTimeout(() => {
            setSalvando(false)
        }, 1300)

        return () => clearTimeout(timer)
    }

    const falarTexto = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel()
            setFalando(false)
            setProgressoAudio(0)
            return
        }

        if (paragrafos.length === 0) return

        const limparTextoParaAudio = (texto) => {
            return texto.replace(/\[([^\]|]+)(?:\|([^\]]+))?\]/g, (match, p1, p2) => p2 ? p2 : p1)
        }

        const textoGeral = paragrafos.map(p => limparTextoParaAudio(p)).join(". ")
        const utterance = new SpeechSynthesisUtterance(textoGeral)

        utterance.lang = "pt-BR"
        utterance.rate = velocidade
        utterance.volume = volume

        utterance.onboundary = (event) => {
            const charAtual = event.charIndex
            const totalChar = textoGeral.length

            setProgressoAudio((charAtual / totalChar) * 100)
        }

        utterance.onend = () => {
            setFalando(false)
            setProgressoAudio(0)
        }

        utterance.onerror = () => {
            setFalando(false)
            setProgressoAudio(0)
        }

        setFalando(true)
        window.speechSynthesis.speak(utterance)
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
                <button type="button" onClick={() => setVisivel(!visivel)} className="ml-0.5 w-2.5 h-2.5 border border-zinc-400! text-[8px] font-bold rounded-full flex items-center justify-center cursor-help">
                    ?
                </button>

                <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 w-30 p-0.5 ${dark ? "bg-zinc-600!" : "bg-zinc-900!"} text-white! text-[12px] md:text-[10px] text-center rounded transition-all duration-300 z-10 ${visivel ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`} >
                    {texto}
                    <div className={`absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent ${dark ? "border-r-zinc-600!" : "border-r-zinc-900!"}`}></div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-2 flex flex-row gap-1 items-center">
                <p className="text-[12px] font-semibold">Personalize do seu jeito</p>
                <Pergunta texto="Salvamento Automático" />
            </div>

            <div className="flex items-center flex-wrap flex-row font-bold gap-3">
                <div className="flex gap-2 text-[13px] md:text-[16px]">

                    <button className="cursor-pointer relative w-8 h-8 flex items-center justify-center group" onClick={falarTexto}>
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-gray-100" />
                            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - (113 * progressoAudio) / 100} strokeLinecap="round" className="text-black transition-all duration-200 ease-linear" />
                        </svg>

                        <span className={`relative z-2 flex h-7 w-7 items-center justify-center rounded-full transition-all ${dark ? "text-white!" : "text-black!"} ${falando ? "" : "bg-transparent grayscale"}`}>
                            {falando ? "❚❚" : "▶︎"}
                        </span>
                    </button>

                    <div onChange={(e) => { setVelocidade(parseFloat(e.target.value)); window.speechSynthesis.cancel(); setFalando(false) }} className="flex items-center">
                        <select id={`velocidade-${idUnico}`} name={`velocidade-${idUnico}`} value={velocidade} onChange={(e) => { const val = parseFloat(e.target.value); setVelocidade(val); window.speechSynthesis.cancel(); setFalando(false); }} className={`${dark ? "bg-[#1f1f1f]" : "bg-transparent"} text-[11px] border border-gray-200! rounded px-0.5 cursor-pointer focus:outline-none`} >
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

                    <input id={`volume-${idUnico}`} name={`volume-${idUnico}`} type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => { const val = parseFloat(e.target.value); setVolume(val); window.speechSynthesis.cancel(); setFalando(false); }} className="w-10 md:w-15 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4c4c4c]" />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setTamanhoFonte(prev => Math.max(12, prev - 2))} className="cursor-pointer">A-</button>
                    <button onClick={() => setTamanhoFonte(prev => Math.min(26, prev + 2))} className="cursor-pointer">A+</button>
                </div>

                {salvando && (
                    <div className="flex items-center gap-1 animate-check">
                        <img className="h-4 rounded-full" src={check} alt="Salvando" />
                    </div>
                )}
            </div>
        </div>
    )
}