import { useState, useEffect } from "react";

function Comentarios({ comentarios }) {
    const [mostrar, setMostar] = useState(false)
    const [carregamento, setCarregamento] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setCarregamento(false)
        }, 3200)

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

    return (
        <div>
            {comentarios?.length > 0 && (
                <button onClick={() => setMostar(!mostrar)} className="w-full cursor-pointer text-xs font-black uppercase tracking-[0.2em] rounded-none px-3 py-3 border text-black border-black hover:bg-black transition-all hover:text-white">
                    {mostrar ? "Fechar comentários" : `Ver comentários (${comentarios.length})`}
                </button>
            )}

            {mostrar && (
                <div className="flex flex-col animate-fadeIn">
                    {comentarios.map((ia, index) => (
                        <div className="mt-6 flex flex-row" key={index}>
                            <div className="flex flex-col items-center gap-1">
                                {carregamento ? (EsqueltoFoto()) : (<img className="h-10 w-10 rounded-full object-cover" loading="lazy" src={ia.imagem} alt={ia.nome} />)}
                                {carregamento ? (EsqueletoNome()) : (<span className="text-xs tracking-tight">{ia.nome}</span>)}
                            </div>
                            {carregamento ? (EsqueletoTexto()) : (<p className="ml-4 text-[16px] animate-fadeIn leading-relaxed">{ia.texto}</p>)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Comentarios