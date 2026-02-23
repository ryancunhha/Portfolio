import { useEffect, useState } from "react"

import dadosResumo from "../../../../data/resumo.json";

function Dataehora() {
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
    }, [dataHora])

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
        <>
            <div className="px-6 md:p-6 flex flex-col gap-2.5 md:flex-row justify-between">
                <p className="text-[#727171] text-base flex items-center tracking-tighter">{texto}</p>

                <div className="tracking-tighter text-[#727171] text-sm flex items-center">
                    {formatacao}
                </div>
            </div>

            <div className="p-6">
                <p className="text-[#212023] text-base wrap-break-word tracking-tighter whitespace-normal">
                    {dadosResumo["boas-vindas"]}
                </p>
            </div>
        </>
    )
}

export default Dataehora