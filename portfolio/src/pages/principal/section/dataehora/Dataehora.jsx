import { useEffect, useState } from "react"

import dadosResumo from "../../../../../public/assets/sobre/resumo.json";

const BannerCarousel = ({ imagens }) => {
    const [indexAtual, setIndexAtual] = useState(0);
    const [animar, setAnimar] = useState(false);
    const tempoIntervalo = 5000;

    useEffect(() => {
        if (!imagens || imagens.length <= 1) return;

        setAnimar(false);
        const timeout = setTimeout(() => setAnimar(true), 10);

        const intervalo = setInterval(() => {
            setIndexAtual((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
        }, tempoIntervalo);

        return () => {
            clearInterval(intervalo);
            clearTimeout(timeout);
        };
    }, [indexAtual, imagens]);

    if (!imagens || imagens.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto relative group overflow-hidden rounded-b-sm">
            <div className="flex transition-transform duration-700 ease-in-out w-full" style={{ transform: `translateX(-${indexAtual * 100}%)` }} >
                {imagens.map((url, i) => (
                    <div key={i} className="w-full shrink-0">
                        <img className="w-full h-20 md:h-30 object-cover" src={url} alt="Banner" />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-2 z-3">
                {imagens.map((_, i) => (
                    <button key={i} onClick={() => setIndexAtual(i)} className="relative w-10 h-1 cursor-pointer focus:outline-none bg-white/20 rounded-full overflow-hidden" >
                        <div className={`h-full bg-white rounded-full ${indexAtual === i && animar ? "w-full transition-all ease-linear" : "w-0 transition-none"}`} style={{ transitionDuration: (indexAtual === i && animar) ? `${tempoIntervalo}ms` : "0ms" }} />
                    </button>
                ))}
            </div>
        </div>
    );
};

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
            {dadosResumo.banner && (
                <BannerCarousel imagens={dadosResumo.banner} />
            )}

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center flex-col gap-2.5 md:flex-row justify-between">
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