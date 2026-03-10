import { useState, useEffect } from "react";

export default function Comentarios({ comentarios, slugAtual, data }) {
    const [mostrar, setMostar] = useState(false)
    const [carregamento, setCarregamento] = useState(true)

    const dark = document.documentElement.classList.contains("dark-mode")

    const storageVoto = `voto-${slugAtual}`
    const storageLikes = `likes-valor-${slugAtual}`

    const [curtido, setCurtido] = useState(() => localStorage.getItem(storageVoto) === "like")
    const [likesFake, setLikesFake] = useState(() => {
        const salvo = localStorage.getItem(storageLikes)

        if (salvo) {
            return parseInt(salvo)
        }

        const base = Math.floor(Math.random() * 9999) + 1
        localStorage.setItem(storageLikes, base.toString())
        return base
    })
    const [direcao, setDirecao] = useState("subir")

    const calcularTempoIntervalo = (data) => {
        if (!data) return 12000

        const [mes, ano] = data.split("/").map(Number)
        const dataProjeto = new Date(ano, mes - 1)
        const hoje = new Date()

        const diferencaMeses = (hoje.getFullYear() - dataProjeto.getFullYear()) * 12 + (hoje.getMonth() - dataProjeto.getMonth())

        if (diferencaMeses <= 4) {
            return 3500
        } else if (diferencaMeses <= 12) {
            return 7000
        } else {
            return 10000
        }
    }
    const tempo = calcularTempoIntervalo(data)

    useEffect(() => {
        const salvo = localStorage.getItem(storageLikes)
        if (salvo !== likesFake.toString()) {
            localStorage.setItem(storageLikes, likesFake.toString())
        }
    }, [likesFake, storageLikes])

    useEffect(() => {
        const intervalo = setInterval(() => {
            const variacao = Math.floor(Math.random() * 5) + 1
            const subir = Math.random() > 0.2

            setLikesFake(prev => {
                const novo = subir ? prev + variacao : prev - variacao

                const valorFinal = Math.max(1, Math.min(novo, 9999))

                setDirecao(valorFinal > prev ? "subir" : "descer")
                return valorFinal
            })
        }, tempo)

        return () => clearInterval(intervalo)
    }, [tempo])

    const Like = () => {
        if (carregamento) return

        if (!curtido) {
            setCurtido(true)
            setDirecao("subir")
            localStorage.setItem(storageVoto, "like")

            setLikesFake(prev => {
                const novoValor = prev + 1
                return novoValor > 9999 ? 9999 : novoValor
            })
        } else {
            setCurtido(false)
            setDirecao("descer")
            localStorage.removeItem(storageVoto)

            setLikesFake(prev => {
                const novoValor = prev - 1
                return novoValor < 1 ? 1 : novoValor
            })
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setCarregamento(false)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    function EsqueletoTexto() {
        return (
            <div className="mt-1 space-y-2 animate-pulse w-full">
                <div className="h-3 w-full bg-gray-300 rounded"></div>
                <div className="h-3 w-[90%] bg-gray-300 rounded"></div>
                <div className="h-3 w-[75%] bg-gray-300 rounded"></div>
                <div className="h-3 w-[65%] bg-gray-300 rounded"></div>
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

    function formatarTempo(data) {
        const agora = new Date()

        const dataSegura = (data && data.trim() !== "" && data.includes("/")) ? data : `${agora.getMonth() + 1}/${agora.getFullYear()}`

        if (dataSegura.includes("/")) {
            const partes = dataSegura.split("/")
            const mes = parseInt(partes[0], 10)
            const ano = parseInt(partes[1], 10)

            const agora = new Date()
            const mesAtual = agora.getMonth() + 1
            const anoAtual = agora.getFullYear()

            const totalMesesPassado = (ano * 12) + mes
            const totalMesesAgora = (anoAtual * 12) + mesAtual
            const diferencaMeses = totalMesesAgora - totalMesesPassado

            if (diferencaMeses <= 0) {
                return "menos de 1 mês"
            } else if (diferencaMeses < 12) {
                return `há ${diferencaMeses} ${diferencaMeses === 1 ? "mês" : "meses"}`
            } else {
                const anos = Math.floor(diferencaMeses / 12)
                return `há ${anos} ${anos === 1 ? "ano" : "anos"}`
            }
        }

        return "há pouco tempo"
    }

    return (
        <div>
            <button onClick={() => setMostar(!mostrar)} className={`w-full rounded-xs cursor-pointer text-xs font-black uppercase tracking-[0.2em] px-3 py-3 border ${dark ? "text-white! hover:text-black!" : "text-black! hover:text-white!"} ${dark ? "" : ""} ${dark ? " hover:bg-white!" : "hover:bg-black!"}  transition-all hover:text-white`}>
                {mostrar ? "Fechar Avaliações" : `Ver Avaliações`}
            </button>

            {mostrar && (
                <div className="p-2 flex flex-col">
                    {comentarios.map((texto, index) => (
                        <div className="p-2.5 rounded bg-gray-100 flex gap-1 flex-col" key={index}>
                            {carregamento ? (EsqueletoNome()) : (
                                <div className="flex justify-between flex-row items-center gap-1">
                                    <span className="flex gap-1 text-[12px] tracking-tight font-bold text-zinc-700!">Resumo das Avaliações <strong>✦</strong></span>

                                    <div className="flex flex-row gap-1 items-center">
                                        <div className="flex flex-row items-center gap-1" >
                                            <span className="flex items-center gap-0.5 text-[12px] tracking-tight font-bold text-zinc-700!">
                                                Útil (
                                                <span key={likesFake} className={`inline-block text-zinc-700! ${direcao === "subir" ? "animate-subir" : "animate-descer"}`}>
                                                    {likesFake}
                                                </span>
                                                )
                                            </span>

                                            <button onClick={Like} className={`text-[14px] cursor-pointer ${curtido ? "" : "grayscale"}`}>
                                                👍
                                            </button>
                                        </div>

                                        <span className="flex justify-center text-[12px] text-zinc-700! tracking-tighter uppercase font-medium">{formatarTempo(data)}</span>
                                    </div>

                                </div>
                            )}
                            
                            {carregamento ? (EsqueletoTexto()) : (<p className="text-[14px] md:text-[15px] leading-relaxed text-zinc-700! font-medium tracking-tight">{texto}</p>)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}