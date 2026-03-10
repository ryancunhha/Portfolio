import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import dadosProjetos from "../../../../public/data/projetos.json";
import { procura } from "../../../config/imagem";

export default function PesquisaModal({ dark, aberto, onClose, visivel }) {
    const [busca, setBusca] = useState("")
    const [resultado, setResultado] = useState([])
    const inputRef = useRef(null)

    const frases = ["O que você está procurando?", "Ex: Dashboard", "Ex: Landing Page", "Ex: Portfólio"]
    const [placeholder, setPlaceholder] = useState("")
    const [fraseIndex, setFraseIndex] = useState(0)
    const [letraIndex, setLetraIndex] = useState(0)
    const [apagando, setApagando] = useState(false)

    const [pesquisou, setPesquisou] = useState(false)

    useEffect(() => {
        const tempo = apagando ? 50 : 100

        const loop = setTimeout(() => {
            const fraseAtual = frases[fraseIndex]

            if (!apagando) {
                setPlaceholder(fraseAtual.substring(0, letraIndex + 1))
                setLetraIndex(prev => prev + 1)

                if (letraIndex === fraseAtual.length) {
                    setTimeout(() => setApagando(true), 2000)
                }
            } else {
                setPlaceholder(fraseAtual.substring(0, letraIndex - 1))
                setLetraIndex(prev => prev - 1)

                if (letraIndex === 0) {
                    setApagando(false)
                    setFraseIndex((prev) => (prev + 1) % frases.length)
                }
            }
        }, tempo)

        return () => clearTimeout(loop)
    }, [letraIndex, apagando, fraseIndex])

    useEffect(() => {
        if (aberto && visivel) {
            const timer = setTimeout(() => {
                inputRef.current?.focus()
            }, 150)
            return () => clearTimeout(timer)
        }
    }, [aberto, visivel])

    useEffect(() => {
        function fecharEsc(e) {
            if (e.key === "Escape") onClose()
        }

        if (aberto) window.addEventListener("keydown", fecharEsc)
        return () => window.removeEventListener("keydown", fecharEsc)
    }, [aberto, onClose])


    function limparBusca() {
        setBusca("")
        setResultado([])
        setPesquisou(false)
    }

    function buscaProjeto() {
        if (!busca.trim()) return
        setPesquisou(true)
        const texto = busca.toLowerCase()

        const todosProjetos = dadosProjetos.flatMap(
            categoria => categoria.subCartegorias
        )

        const encontrados = todosProjetos.filter((projeto) => projeto.titulo.toLocaleLowerCase().includes(texto))
        setResultado(encontrados)
    }

    return (
        <div className={`fixed left-0 right-0 ${dark ? "bg-(--bg-color)" : "bg-white!"} z-7 transition-all duration-150 ease-in-out overflow-hidden ${aberto && visivel ? "top-20 translate-y-0 opacity-100" : "top-10 -translate-y-full opacity-0 pointer-events-none"}`} >
            <div className={`border-b ${dark ? "border-zinc-600" : "border-zinc-100"} max-w-4xl mx-auto p-3`}>
                <form autoComplete="off" className="w-full flex justify-between items-center" onSubmit={(e) => { e.preventDefault(); buscaProjeto(); }} >
                    <img className={`rounded-xs hidden md:inline h-6 p-1 ${dark ? "invert" : ""}`} src={procura} alt="" />
                    
                    <label htmlFor="busca-projetos" className="sr-only">Pesquisar projetos</label>

                    <input ref={inputRef} autoFocus={aberto} maxLength={200} id="busca-projetos" name="busca-projetos" autoComplete="off" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={placeholder} className="w-full pr-2 md:px-2 outline-none" />

                    <div className="flex items-center gap-2 md:gap-3 ml-auto">
                        <button type="submit" onClick={buscaProjeto} className={`group flex items-center justify-center rounded-sm border px-2 py-1 md:px-4 md:py-1 text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer active:scale-95 ${dark ? "border-zinc-700 hover:bg-white! hover:text-black!" : "border-zinc-200 hover:bg-black! hover:text-white!"}`} >
                            <span className={`hidden md:block transition-colors ${dark ? "group-hover:text-black!" : "group-hover:text-white!"}`}>
                                Buscar
                            </span>

                            <img className={`h-4 w-4 md:hidden object-contain transition-all ${dark ? "invert group-hover:invert-0" : ""}`} src={procura} alt="" />
                        </button>

                        <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full md:hover:bg-zinc-100 text-zinc-400! md:hover:text-black! transition-all cursor-pointer text-lg" >
                            ✕
                        </button>
                    </div>
                </form>

                <div className="transition-all duration-300">
                    {resultado.length > 0 ? (
                        <ul className="py-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-500">
                            {resultado.map((proj) => (
                                <li key={proj.slug} className={`border-l-2 border-transparent ${dark ? "hover:border-white" : "hover:border-black"} pl-2 transition-all`}>
                                    <Link onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                                        className="cursor-pointer text-sm hover:font-bold transition-all block max- w-max" to={`/${proj.slug}`}>
                                        {proj.titulo}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : pesquisou && (
                        <div className="my-2 text-center animate-in fade-in zoom-in-95 duration-300">
                            <p className="text-sm text-gray-400 italic">
                                Nenhum projeto encontrado
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}