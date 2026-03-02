import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import dadosProjetos from "../../../../../public/assets/data/projetos.json";
import { logo } from "../../../../config/index";

function PesquisaModal({ aberto, onClose }) {
    const [busca, setBusca] = useState("")
    const [resultado, setResultado] = useState([])

    useEffect(() => {
        function fecharEsc(e) {
            if (e.key === "Escape") onClose()
        }

        if (aberto) {
            document.body.style.overflow = "hidden"
            window.addEventListener("keydown", fecharEsc)
        }

        return () => {
            document.body.style.overflow = "auto"
            window.removeEventListener("keydown", fecharEsc)
        }
    }, [aberto, onClose])


    function limparBusca() {
        setBusca("")
        setResultado([])
    }

    function buscaProjeto() {
        if (!busca.trim()) return
        const texto = busca.toLowerCase()

        const todosProjetos = dadosProjetos.flatMap(
            categoria => categoria.subCartegorias
        )

        const encontrados = todosProjetos.filter((projeto) => projeto.titulo.toLocaleLowerCase().includes(texto))
        setResultado(encontrados)
    }

    if (!aberto) return null

    return (
        <div onClick={onClose} className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-white animate-fadeIn">
                <div onClick={(e) => e.stopPropagation()} className="flex bg-white flex-col h-screen w-full">

                    <div className="flex justify-between items-center py-4 px-5 md:px-10 max-w-7xl mx-auto w-full">
                        <img title="ryancunhha" className="h-7" src={logo} alt="logo" />
                        <button title="Fechar Menu" onClick={onClose} className="text-xl cursor-pointer hover:opacity-50">✕</button>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex flex-col w-full max-w-2xl px-5 pt-10">
                            <label htmlFor="procurar" className="text-xs font-bold">Busque por um projeto</label>

<<<<<<< Updated upstream
                                <div className="w-full flex justify-between items-center">
                                    <input maxLength={100} id="procurar" type="text" value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") buscaProjeto() }} placeholder="Ex: Dashboard, Landing Page, Portfólio" className="w-full mt-2 px-2 pb-2 outline-none" />

                                    {busca.length > 0 && (
                                        <button onClick={limparBusca} className="pr-3">✕</button>
                                    )}

                                    <button onClick={buscaProjeto} className="px-2 py-1 border-2 text-xs font-bold cursor-pointer transition-all hover:bg-black hover:border-black hover:text-white">BUSCAR</button>
                                </div>
                                <hr className="mt-1" />

                                {resultado.length > 0 && (
                                    <ul className="mt-4 space-y-1">
                                        {resultado.map((proj) => (
                                            <li key={proj.slug}>
                                                <Link onClick={() => { onClose().window.scrollTo({ top: 0, behavior: "smooth" }) }} className="cursor-pointer text-sm hover:underline" to={`${proj.slug}`}>{proj.nome}</Link>
                                            </li>
                                        ))}
                                    </ul>
=======
                            <div className="w-full flex justify-between items-center">
                                <input maxLength={200} id="procurar" type="text" value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") buscaProjeto() }} placeholder="Ex: Dashboard, Landing Page, Portfólio" className="w-full mt-2 px-2 pb-2 outline-none" />

                                {busca.length > 0 && (
                                    <button onClick={limparBusca} className="mr-3 cursor-pointer">✕</button>
>>>>>>> Stashed changes
                                )}

                                <button onClick={buscaProjeto} className="px-2 py-1 border-2 text-xs font-bold cursor-pointer transition-all hover:bg-black hover:border-black hover:text-white">BUSCAR</button>
                            </div>
                            <hr className="mt-1" />

                            {resultado.length > 0 && (
                                <ul className="mt-4 space-y-1">
                                    {resultado.map((proj) => (
                                        <li key={proj.slug}>
                                            <Link onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="cursor-pointer text-sm hover:underline" to={`${proj.slug}`}>{proj.titulo}</Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PesquisaModal