import { useEffect, useState } from "react";

import Header from "../../components/header/header";
import Contatos from "../../components/bar/contact/contact";

import dadosResumo from "../../../public/assets/sobre/resumo.json";

export default function Sobre({ dark, mudarTema }) {
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
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className={`cursor-pointer underline ${dark ? "text-gray-300!" : "text-gray-600!"} hover:no-underline`}>{textoFinal}</a>
                )
            }

            if (index % 3 === 2) return null

            return <span className={`${dark ? "text-white!" : "text-gray-600!"}`} key={index}>{parte}</span>
        })
    }

    useEffect(() => {
        document.title = "Sobre Mim"
    })

    return (
        <>
            <Header dark={dark} mudarTema={mudarTema} />

            <div className="pb-8 md:pb-0">
                <div className="max-w-6xl mx-auto px-4 font-sans text-gray-900!">
                    <div className="relative w-full h-55 overflow-hidden mb-12">
                        <img className="w-full h-full object-cover brightness-40" loading="lazy" src={dadosResumo.sobre[1]} alt="banner" />
                        <div className="absolute bottom-10 left-10">
                            <h1 className="text-5xl font-black text-white! uppercase tracking-tighter">Sobre Mim</h1>
                            <div className="w-20 h-2 bg-white mt-2"></div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-2/3">
                            <h2 className={`text-3xl font-bold mb-6 ${dark ? "text-gray-100!" : "text-black!"}`}>Ryan</h2>

                            <div className="mt-4 text-gray-600">
                                <div className="mb-2 flex flex-row items-center">
                                    <p className={`pr-2 text-sm w-15 ${dark ? "text-white!" : "text-gray-600!"}`}>Resumo</p>
                                    <hr className="border w-full opacity-20" />
                                </div>

                                {dadosResumo.resumo.map((texto, index) => (
                                    <p key={index} className="tracking-tighter mb-4">{renderTextoComLink(texto)}</p>
                                ))}
                            </div>

                            {dadosResumo.historia?.length > 0 && (
                                <div className="mt-4 text-gray-600">
                                    <div className="flex flex-row items-center mb-2 w-full">
                                        <button onClick={() => setMostrarHistoria(!mostarHistoria)} className="group text-sm tracking-tighter flex items-center gap-1 cursor-pointer">
                                            <span className={`text-[10px] transition-transform duration-300 ${dark ? "" : "text-gray-600! group-hover:text-black!"} ${mostarHistoria ? "rotate-180" : ""}`}>
                                                ▼
                                            </span>

                                            <p className={`w-37.5 pr-2 transition-colors ${dark ? "" : "text-gray-600! group-hover:text-black!"}`}>
                                                {mostarHistoria ? "Ocultar história" : "História completa"}
                                            </p>
                                        </button>

                                        <hr className="border w-full opacity-20" />
                                    </div>

                                    <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${mostarHistoria ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                        <div className="overflow-hidden">
                                            <div className="pt-2">
                                                {dadosResumo.historia.map((texto, index) => (
                                                    <p key={index} className="mb-4 tracking-tighter leading-relaxed">
                                                        {renderTextoComLink(texto)}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:w-1/3">
                            <div className={`top-8 border border-gray-200 p-6 ${dark ? "bg-zinc-900 border-zinc-800 shadow-2xl" : "bg-gray-50! border-gray-200 shadow-sm"}`}>
                                <div className="w-full aspect-square mb-6 overflow-hidden">
                                    <img loading="lazy" className="w-full h-full object-cover" src={dadosResumo.sobre[0]} alt="Ryan" />
                                </div>
                                <h3 className={`text-xl font-black uppercase mb-4 tracking-tight ${dark ? "text-white!" : "text-zinc-900!"}`}>{dadosResumo.sobre[2]}</h3>
                                
                                <div className={`w-full h-px mb-6 ${dark ? "bg-zinc-800" : "bg-gray-200"}`} />
                                <Contatos dark={dark} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}