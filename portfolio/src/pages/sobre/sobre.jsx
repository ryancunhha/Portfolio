import { useEffect, useState } from "react";

import Header from "../../components/header/header";
import Contatos from "../../components/bar/contact/contact";

import dadosResumo from "../../data/resumo.json";

function Sobre() {
    const [mostarHistoria, setMostrarHistoria] = useState(false)

    function renderTextoComLink(texto) {
        const regex = /\[(https?:\/\/[^\]|]+)(?:\|([^\]]+))?\]/g
        const partes = texto.split(regex)

        return partes.map((parte, index) => {
            if (index % 3 === 1) {
                const link = parte
                const textoLink = partes[index + 1]
                const textoFinal = textoLink ? textoLink : link.replace("https://", "").replace("http://", "").replace("www", "").split("/")[0]

                return (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="cursor-pointer underline text-gray-600 hover:no-underline">{textoFinal}</a>
                )
            }

            if (index % 3 === 2) return null

            return <span key={index}>{parte}</span>
        })
    }

    useEffect(() => {
        document.title = "Sobre Mim"
    })

    return (
        <>
            <Header />

            <div className="pt-16 pb-8 md:pb-0">
                <div className="max-w-6xl mx-auto px-4 font-sans text-gray-900">

                    <div className="relative w-full h-55 overflow-hidden mb-12">
                        <img className="w-full h-full object-cover brightness-40" loading="lazy" src={dadosResumo.banner} alt="banner" />
                        <div className="absolute bottom-10 left-10 text-white">
                            <h1 className="text-5xl font-black uppercase tracking-tighter">Sobre Mim</h1>
                            <div className="w-20 h-2 bg-white mt-2"></div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-bold mb-6 border-gray-100 pb-2">Ryan</h2>

                            <div className="mt-4 text-gray-600">
                                <div className="mb-2 flex flex-row items-center">
                                    <p className="text-base w-15">Resumo</p>
                                    <hr className="ml-2 border w-full text-gray-600" />
                                </div>

                                {dadosResumo.resumo.map((texto, index) => (
                                    <p key={index} className="tracking-tighter mb-4">{renderTextoComLink(texto)}</p>
                                ))}
                            </div>

                            {dadosResumo.historia?.length > 0 && (
                                <div className="mt-4 text-gray-600">
                                    <div className="flex flex-row items-center mb-2 w-full">
                                        <button onClick={() => setMostrarHistoria(!mostarHistoria)} className="text-sm tracking-tighter flex items-center gap-1 cursor-pointer">
                                            <span className={`text-xs ${mostarHistoria ? "rotate-270" : ""}`}>▼</span>
                                            <p className="w-37.5 pr-2">{mostarHistoria ? "Ocultar história" : "História completa"}</p>
                                        </button>
                                        <hr className="border w-full" />
                                    </div>

                                    {mostarHistoria && (
                                        <div>{dadosResumo.historia.map((texto, index) => (
                                            <p key={index} className="mb-4 tracking-tighter">
                                                {renderTextoComLink(texto)}
                                            </p>
                                        ))}</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="md:w-1/3">
                            <div className="top-8 border border-gray-200 p-6 bg-gray-50">
                                <div className="w-full aspect-square bg-gray-200 mb-6 overflow-hidden">
                                    <img loading="lazy" className="w-full h-full object-cover" src={dadosResumo.foto} alt="Ryan" />
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">{dadosResumo.categoria}</h3>
                                <Contatos />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sobre