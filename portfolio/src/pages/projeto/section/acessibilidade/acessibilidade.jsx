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
        return salvo ? parseInt(salvo) : 18
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

    return (
        <div>
            <div className="mb-2 flex flex-row gap-2 items-center">
                <p className="text-[12px] font-semibold">Personalize do seu jeito</p>

                {salvando && (
                    <div className="flex items-center gap-1 animate-check">
                        <img loading="lazy" decoding="async" className="h-3 rounded-full" src={check} alt="Salvando" />
                    </div>
                )}
            </div>

            <div className="flex items-center flex-wrap flex-row font-bold gap-2">
                <div className="flex gap-2 text-[13px] md:text-[16px]">
                    <button className="cursor-pointer relative w-8 h-8 flex items-center justify-center group" onClick={falarTexto}>
                        <span className={`text-[20px] relative z-2 flex h-7 w-7 items-center justify-center rounded-full transition-all ${dark ? "text-white!" : "text-black!"} ${falando ? "" : "bg-transparent grayscale"}`}>
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

                <div className="flex items-center gap-2 group rounded-full">

                    <div className="flex items-center gap-1 px-1">
                        <button onClick={() => {
                            const novoVal = Math.max(0, volume - 0.1);
                            setVolume(novoVal);
                            window.speechSynthesis.cancel();
                            setFalando(false);
                        }} disabled={volume <= 0} className={`w-6 h-6 flex items-center justify-center rounded-full bg-transparent ${dark ? "text-gray-100" : "text-zinc-800"} border border-zinc-500/20 hover:border-zinc-500 transition-all duration-300 active:scale-90 disabled:opacity-10 cursor-pointer text-[14px] font-bold`} >
                            -
                        </button>

                        <span className="text-[10px] text-center font-bold text-zinc-500 w-7">
                            {`${Math.round(volume * 100)}%`}
                        </span>

                        <button onClick={() => {
                            const novoVal = Math.min(1, volume + 0.1);
                            setVolume(novoVal);
                            window.speechSynthesis.cancel();
                            setFalando(false);
                        }} disabled={volume >= 1} className={`w-6 h-6 flex items-center justify-center rounded-full bg-transparent ${dark ? "text-gray-100" : "text-zinc-800"} border border-zinc-500/20 hover:border-zinc-500 transition-all duration-300 active:scale-90 disabled:opacity-10 cursor-pointer text-[14px] font-bold`} >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setTamanhoFonte(prev => Math.max(16, prev - 2))} className="cursor-pointer">A-</button>
                    <button onClick={() => setTamanhoFonte(prev => Math.min(26, prev + 2))} className="cursor-pointer">A+</button>
                </div>
            </div>
        </div>
    )
}