import { useEffect, useState } from "react"

import dadosResumo from "../../../../../public/assets/sobre/resumo.json";

export default function Dataehora({ dark }) {
    const [dataHora, setDataHora] = useState(new Date())
    const [texto, setTexto] = useState("")

    useEffect(() => {
        const jaVisitou = localStorage.getItem("visitou")
        const hora = new Date().getHours()

        function saudacaoPorHora() {
            if (hora >= 5 && hora < 12) return "Bom dia! ☀️"
            if (hora > 12 && hora < 18) return "Boa Tarde! 🌤️"
            return "Boa noite! 🌙"
        }

        if (!jaVisitou) {
            setTexto("Olá! 👋")
            localStorage.setItem("visitou", "true")
        } else {
            setTexto(saudacaoPorHora())
        }
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setDataHora(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatacao = new Intl.DateTimeFormat("pt-br", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    }).format(dataHora)

    return (
        <section>
            {dadosResumo.sobre[1] && (
                <div className="max-w-7xl mx-auto">
                    <img className="w-full h-20 md:h-25 object-cover" src={dadosResumo.sobre[1]} alt="Banner" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex items-center flex-col gap-2.5 md:flex-row justify-between">
                <p className={`${dark ? "text-gray-300!" : "text-[#727171]!"} text-base flex items-center tracking-tighter`}>{texto}</p>

                <div className={`${dark ? "text-gray-300!" : "text-[#727171]!"} tracking-tighter text-sm flex items-center`}>
                    {formatacao}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-2">
                <p className={`${dark ? "text-gray-200!" : "text-[#212023]!"} text-base wrap-break-word tracking-tighter whitespace-normal`}>
                    {dadosResumo["boas-vindas"]}
                </p>
            </div>
        </section>
    )
}