import { useState, useEffect } from "react";
import IA from "../../../../../../../public/assets/ia/ia.json";

<<<<<<< Updated upstream
function Comentarios({ comentarios }) {
    const [mostrar, setMostar] = useState(false)
    const [carregamento, setCarregamento] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setCarregamento(false)
        }, 3200)

        return () => clearTimeout(timer)
    }, [])

=======
const PERSONAS_IA = IA

function formatarTempo(dataInput) {
    const agora = new Date()

    const dataSegura = (dataInput && dataInput.trim() !== "" && dataInput.includes("/")) ? dataInput : `${agora.getMonth() + 1}/${agora.getFullYear()}`

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

function Comentario({ ia, index, slugAtual, dataBase, carregamentoPai }) {
    const storageKey = `voto-${slugAtual}-${index}`
    const likesKey = `likes-${slugAtual}-${index}`

    const [curtido, setCurtido] = useState(() => localStorage.getItem(storageKey) === "like")
    const [descurtido, setDescurtido] = useState(() => localStorage.getItem(storageKey) === "deslike")
    const [likesFake, setLikesFake] = useState(() => {
        const salvo = localStorage.getItem(likesKey)
        return salvo ? parseInt(salvo) : Math.floor(Math.random() * 15000 + 1000 + (index * 300))
    })

    const [direcao, setDirecao] = useState("subir")
    const [carregamentoLocal, setCarregamentoLocal] = useState(true)

    const isLoading = carregamentoPai || carregamentoLocal

    useEffect(() => {
        const timer = setTimeout(() => setCarregamentoLocal(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const intervalo = Math.random() * (10000 - 5000) + 5000

        const timer = setInterval(() => {
            const subir = Math.random() > 0.50
            const variacao = Math.floor(Math.random() * 200) + 100

            setLikesFake(prev => {
                const novo = subir ? prev + variacao : prev - variacao
                const valorFinal = Math.max(1000, Math.min(99900, novo))
                localStorage.setItem(likesKey, valorFinal.toString())

                setDirecao(valorFinal > prev ? "subir" : "descer")
                return valorFinal
            })
        }, intervalo)

        return () => clearTimeout(timer)
    }, [likesKey])

    const handleLike = () => {
        if (isLoading) return

        if (!curtido) {
            setCurtido(true)
            setDescurtido(false)
            setDirecao("subir")
            setLikesFake(prev => prev + 100)
            localStorage.setItem(storageKey, "like")
        } else {
            setCurtido(false)
            setDirecao("descer")
            setLikesFake(prev => prev - 100)
            localStorage.removeItem(storageKey)
        }
    }

    const handleDislike = () => {
        if (isLoading) return

        if (!descurtido) {
            if (curtido) {
                setLikesFake(prev => prev - 100)
                setDirecao("descer")
            }
            setDescurtido(true)
            setCurtido(false)
            localStorage.setItem(storageKey, "deslike")
        } else {
            setDescurtido(false)
            localStorage.removeItem(storageKey)
        }
    }

>>>>>>> Stashed changes
    function EsqueletoTexto() {
        return (
            <div className="ml-3 space-y-2 animate-pulse w-full">
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

    function EsqueltoFoto() {
        return (
            <div className="h-10 w-10">
                <div className="h-full w-full rounded-full bg-gray-300"></div>
            </div>
        )
    }

<<<<<<< Updated upstream
=======
    function EsqueltoContador() {
        return (
            <div className="animate-pulse w-8">
                <div className="h-2 w-full bg-gray-300 rounded"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-row">
            <div className="flex flex-col gap-1 items-center">
                {isLoading ? (EsqueltoFoto()) : (<img className="h-10 w-10 rounded-full object-cover" loading="lazy" src={ia.imagem} alt={ia.nome} />)}
                {isLoading ? (EsqueletoNome()) : (<span className="flex justify-center w-11 text-[12px] tracking-tight">{ia.nome}</span>)}
                {isLoading ? (EsqueletoNome()) : (<span className="flex justify-center w-11 text-[10px] text-[#727171] tracking-tighter uppercase font-medium">{formatarTempo(dataBase)}</span>)}

                <div className="mt-0.5 flex justify-between w-15">
                    <div className="flex flex-col gap-0.5 items-center">
                        <button onClick={handleLike} className="flex items-center transition-all active:scale-125" >
                            <span title="Gostei" className={`cursor-pointer text-lg ${curtido ? "" : "grayscale"} ${isLoading ? "grayscale" : ""}`}>👍</span>
                        </button>

                        <div className="h-4 overflow-hidden flex flex-row gap-1 items-center justify-center">
                            {isLoading ? (EsqueltoContador()) : (
                                (() => {
                                    const valorFormatado = (likesFake / 1000).toFixed(1).replace(".", ",")
                                    const [inteiro, decimal] = valorFormatado.split(",")

                                    return (
                                        <div className="absolute flex items-center text-[11px] font-black text-gray-400 uppercase tracking-tighter leading-none">

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
                                            </div>

                                            <span className="ml-1">mil</span>
                                        </div>
                                    )
                                })()
                            )}
                        </div>
                    </div>

                    <div>
                        <button onClick={handleDislike} className="transition-all active:scale-125 flex items-center">
                            <span title="Não gostei" className={`cursor-pointer text-lg ${descurtido ? "" : "grayscale"} ${isLoading ? "grayscale" : ""}`}>👎</span>
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (EsqueletoTexto()) : (<p className="ml-3 text-[16px] animate-fadeIn leading-relaxed">{ia.texto}</p>)}
        </div>
    )
}

export default function Comentarios({ comentarios, slugAtual, data }) {
    const [comentariosComPersona, setComentariosComPersona] = useState([])
    const [mostrar, setMostar] = useState(false)
    const [carregamento, setCarregamento] = useState(true)

    useEffect(() => {
        const storageKey = `personas-${slugAtual}`
        const salvo = localStorage.getItem(storageKey)
        let personasAtribuidas = salvo ? JSON.parse(salvo) : {}

        const novosComentarios = (comentarios || []).map((texto, index) => {
            if (!personasAtribuidas[index]) {
                personasAtribuidas[index] = PERSONAS_IA[Math.floor(Math.random() * PERSONAS_IA.length)]
            }

            return { texto, ...personasAtribuidas[index] }
        })

        localStorage.setItem(storageKey, JSON.stringify(personasAtribuidas))
        setComentariosComPersona(novosComentarios)
    }, [comentarios, slugAtual])

    useEffect(() => {
        const timer = setTimeout(() => setCarregamento(false), 2000)
        return () => clearTimeout(timer)
    }, [])

>>>>>>> Stashed changes
    return (
        <div>
            {comentarios?.length > 0 && (
                <button onClick={() => setMostar(!mostrar)} className="w-full cursor-pointer text-xs font-black uppercase tracking-[0.2em] rounded-none px-3 py-3 border text-black border-black hover:bg-black transition-all hover:text-white">
                    {mostrar ? "Fechar comentários" : `Ver comentários (${comentarios.length})`}
                </button>
            )}

<<<<<<< Updated upstream
            {mostrar && (
                <div className="flex flex-col animate-fadeIn">
                    {comentarios.map((ia, index) => (
                        <div className="mt-6 flex flex-row" key={index}>
                            <div className="flex flex-col items-center gap-1">
                                {carregamento ? (EsqueltoFoto()) : (<img className="h-10 w-10 rounded-full object-cover" loading="lazy" src={ia.imagem} alt={ia.nome} />)}
                                {carregamento ? (EsqueletoNome()) : (<span className="text-xs tracking-tight">{ia.nome}</span>)}
                            </div>
                            {carregamento ? (EsqueletoTexto()) : (<p className="ml-4 text-[16px] animate-fadeIn leading-relaxed">{ia.texto}</p>)}
=======
            <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${mostrar ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                <div className="min-h-0">
                    {mostrar && (
                        <div className="px-2 py-2 flex flex-col gap-5">
                            {comentariosComPersona.map((iaItem, index) => (
                                <Comentario key={`${slugAtual}-${index}`} ia={iaItem} index={index} slugAtual={slugAtual} dataBase={data} carregamentoPai={carregamento} />
                            ))}
>>>>>>> Stashed changes
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comentarios