import { useState, useEffect } from "react";

export default function Comentarios({ comentarios, slugAtual }) {
    const [mostrar, setMostar] = useState(false)
    const [carregamento, setCarregamento] = useState(true)

    const storage = `voto-${slugAtual}`
    const [curtido, setCurtido] = useState(() => localStorage.getItem(storage) === "like")
    const [descurtido, setDescurtido] = useState(() => localStorage.getItem(storage) === "deslike")
    const [likesFake, setLikesFake] = useState(Math.floor(Math.random() * (99900 - 1000) + 1000))
    const [direcao, setDirecao] = useState("subir")

    useEffect(() => {
        const intervalo = setInterval(() => {
            const variacao = Math.floor(Math.random() * 600) + 50
            const subir = Math.random() > 0.4

            setLikesFake(prev => {
                const novo = subir ? prev + variacao : prev - variacao
                const valorFinal = novo < 0 ? 0 : novo

                const antigoFormatado = (prev / 1000).toFixed(1)
                const novoFormatado = (valorFinal / 1000).toFixed(1)

                if (antigoFormatado !== novoFormatado) {
                    setDirecao(valorFinal > prev ? "subir" : "descer")
                    return valorFinal
                }

                return prev
            })
        }, 5000)

        return () => clearInterval(intervalo)
    }, [])

    const handleLike = () => {
        if (carregamento) return

        const jaEstavaCurtido = curtido;

        if (!jaEstavaCurtido) {
            setCurtido(true)
            setDescurtido(false)
            setDirecao("subir")
            setLikesFake(prev => prev + 100)
            localStorage.setItem(storage, "like")
        } else {
            setCurtido(false)
            setDirecao("descer")
            setLikesFake(prev => prev - 100)
            localStorage.removeItem(storage)
        }
    }

    const handleDislike = () => {
        const novoEstado = !descurtido
        setDescurtido(novoEstado)
        setCurtido(false)

        if (novoEstado) {
            localStorage.setItem(storage, "deslike")
        } else {
            localStorage.removeItem(storage)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setCarregamento(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    function EsqueletoTexto() {
        return (
            <div className="ml-3 space-y-2 animate-pulse w-full">
                <div className="h-3 w-full bg-gray-300 rounded"></div>
                <div className="h-3 w-[90%] bg-gray-300 rounded"></div>
                <div className="h-3 w-[75%] bg-gray-300 rounded"></div>
            </div>
        )
    }

    function EsqueletoNome() {
        return (
            <div className="animate-pulse w-full">
                <div className="h-3 w-full bg-gray-300 rounded"></div>
            </div>
        )
    }

    function EsqueltoFoto() {
        return (
            <div className="h-10 w-10">
                <div className="h-full w-full rounded-full bg-gray-300"></div>
            </div>
        )
    }

    function EsqueltoContador() {
        return (
            <div className="animate-pulse w-8">
                <div className="h-2 w-full bg-gray-300 rounded"></div>
            </div>
        )
    }

    function formatarTempo(dataISO) {
        if (!dataISO) return ""

        const agora = new Date()
        const dataComentario = new Date(dataISO)
        const diffEmSegundos = Math.floor((agora - dataComentario) / 1000)

        if (diffEmSegundos < 3600) return "Menos de 1h"

        const horas = Math.floor(diffEmSegundos / 3600)
        if (horas < 24) return `há ${horas}h`

        const dias = Math.floor(horas / 24)
        if (dias < 30) return `${dias}d`

        const meses = Math.floor(dias / 30)
        if (meses < 12) return `${meses} mes${meses > 1 ? "es" : ""}`

        const anos = Math.floor(meses / 12)
        return `${anos} ano${anos > 1 ? "s" : ""}`
    }

    return (
        <div>
            {comentarios?.length > 0 && (
                <button onClick={() => setMostar(!mostrar)} className="w-full cursor-pointer text-xs font-black uppercase tracking-[0.2em] rounded-none px-3 py-3 border text-black border-black hover:bg-black transition-all hover:text-white">
                    {mostrar ? "Fechar comentários" : `Ver comentários`}
                </button>
            )}

            {mostrar && (
                <div className="flex flex-col animate-fadeIn">
                    {comentarios.map((ia, index) => (
                        <div className="mt-6 flex flex-row" key={index}>
                            <div className="flex flex-col items-center gap-1">
                                {carregamento ? (EsqueltoFoto()) : (<img className="h-10 w-10 rounded-full object-cover" loading="lazy" src={ia.imagem} alt={ia.nome} />)}
                                {carregamento ? (EsqueletoNome()) : (<span className="flex justify-center w-11 text-[12px] tracking-tight">{ia.nome}</span>)}
                                {carregamento ? (EsqueletoNome()) : (<span className="flex justify-center w-11 text-[10px] text-[#727171] tracking-tighter uppercase font-medium">{formatarTempo(ia.data)}</span>)}

                                <div className="my-1 flex items-center justify-between w-15">
                                    <div className="flex flex-col gap-0.5 items-center">
                                        <button onClick={handleLike} className="flex items-center gap-2 transition-all active:scale-125" >
                                            <span title="Gostei" className={`mt-2 cursor-pointer text-lg leading-none ${curtido ? "" : "grayscale opacity-50"}`}>👍</span>
                                        </button>

                                        <div className="h-4 overflow-hidden flex flex-row gap-1 items-center justify-center">
                                            {carregamento ? (
                                                EsqueltoContador()
                                            ) : (
                                                (() => {
                                                    const valorFormatado = (likesFake / 1000).toFixed(1).replace(".", ",")
                                                    const [inteiro, decimal] = valorFormatado.split(",")

                                                    return (
                                                        <div className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-tighter leading-none">
                                                            <div className="h-4 overflow-hidden flex flex-col items-center justify-center min-w-1.75">
                                                                <span key={inteiro} className={`inline-block ${direcao === "subir" ? "animate-subir" : "animate-descer"}`}>
                                                                    {inteiro}
                                                                </span>
                                                            </div>

                                                            <span>,</span>

                                                            <div className="h-4 overflow-hidden flex flex-col items-center justify-center min-w-1.75">
                                                                <span key={decimal} className={`inline-block ${direcao === "subir" ? "animate-subir" : "animate-descer"}`} >
                                                                    {decimal}
                                                                </span>
                                                            </div>

                                                            <span className="ml-1">mil</span>
                                                        </div>
                                                    )
                                                })()
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex justify-center">
                                        <button onClick={handleDislike} className="transition-all active:scale-125 flex items-center">
                                            <span title="Não gostei" className={`cursor-pointer mb-2 text-lg leading-none ${descurtido ? "" : "grayscale opacity-50"}`}>{descurtido ? "👎" : "👎"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {carregamento ? (EsqueletoTexto()) : (<p className="ml-2 text-[16px] animate-fadeIn leading-relaxed">{ia.texto}</p>)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}