import { Link } from "react-router-dom";
import { useState, useEffect, Fragment, useMemo } from "react";

import dadosProjetos from "../../../../../public/data/projetos.json";
import FrasesClima from "../../../../api/clima/frases.json";
import { slugify } from "../../../../utils/slugify/slugify";
import { sicronizar } from "../../../../config/imagem";

export default function Projetos({ dark }) {
    const todosOsProjetos = useMemo(() => dadosProjetos.flatMap(cat => cat.subCartegorias), [])
    const [projetosVitrine, setProjetosVitrine] = useState([])
    const [girando, setGirando] = useState(false)

    const handleSortear = () => {
        if (girando) return

        setGirando(true)
        Sortear()

        setTimeout(() => {
            setGirando(false)
        }, 500)
    }

    const [clima, setClima] = useState({
        cidade: "--",
        chuvaProb: 0,
        chuvaMm: 0,
        max: "--",
        min: "--",
        manhaEmoji: "☀️",
        tardeEmoji: "🌤️",
        noiteEmoji: "🌙",
        fonteNome: "-",
        frase: "",
        loading: true
    })

    const Sortear = () => {
        const misturados = [...todosOsProjetos].sort(() => Math.random() - 0.5).slice(0, 2)

        setProjetosVitrine(misturados)
    }

    useEffect(() => {
        Sortear()
        fetchClima()
    }, [])

    const EsqueletoFornecido = () => {
        return (
            <div className="animate-pulse w-full">
                <div className="h-3 w-full bg-gray-300 rounded"></div>
            </div>
        )
    }

    const EsqueletoFornecido2 = () => {
        return (
            <div className="animate-pulse w-full">
                <div className="mt-1 h-3.5 w-[80%] bg-gray-300 rounded"></div>
            </div>
        )
    }

    async function fetchClima() {
        const CHAVE_CACHE = "cache-clima"
        const UMA_HORA = 60 * 60 * 1000
        const agora = new Date().getTime()

        const cacheSalvo = localStorage.getItem(CHAVE_CACHE)

        if (cacheSalvo) {
            const { data, timestamp } = JSON.parse(cacheSalvo)

            if (agora - timestamp < UMA_HORA) {
                setClima({ ...data, loading: false })
                return
            }
        }

        try {
            const resIp = await fetch("https://ipapi.co/json/")
            if (!resIp.ok) throw new Error("Erro no IP")
            const dataIp = await resIp.json()

            const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${dataIp.latitude}&longitude=${dataIp.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&hourly=weathercode&timezone=auto`
            const resClima = await fetch(urlClima)
            const data = await resClima.json()

            const getEmoji = (code) => {
                if (code <= 1) return "☀️"
                if (code <= 3) return "🌤️"
                if (code >= 51 && code <= 67) return "🌧️"
                if (code >= 71 && code <= 77) return "❄️"
                return "☁️"
            }

            const tempMax = Math.round(data.daily.temperature_2m_max[0])
            const probChuva = data.daily.precipitation_probability_max[0]

            const dadosClima = {
                cidade: dataIp.city,
                chuvaProb: probChuva,
                chuvaMm: data.daily.precipitation_sum[0],
                max: tempMax,
                min: Math.round(data.daily.temperature_2m_min[0]),
                manhaEmoji: getEmoji(data.hourly.weathercode[9]),
                tardeEmoji: getEmoji(data.hourly.weathercode[15]),
                noiteEmoji: "🌙",
                frase: obterFraseSorteada(tempMax, probChuva),
                fonteNome: new URL(urlClima).hostname.replace("api.", "").replace(".com", ""),
                loading: false
            }

            localStorage.setItem("cache-clima", JSON.stringify({
                data: dadosClima,
                timestamp: new Date().getTime()
            }))

            setClima(dadosClima)
            localStorage.setItem(CHAVE_CACHE, JSON.stringify({
                data: dadosClima,
                timestamp: agora
            }))
        } catch (error) {
            setClima({
                cidade: "--",
                chuvaProb: "-",
                chuvaMm: "-",
                max: "--",
                min: "--",
                manhaEmoji: "☀️",
                tardeEmoji: "🌤️",
                noiteEmoji: "🌙",
                fonteNome: "-",
                frase: "-",
                loading: false,
                error: true
            })
        }
    }

    const obterFraseSorteada = (temp, chuva) => {
        let categoria = "agradavel"

        if (chuva > 50) categoria = "chuva"
        else if (temp <= 18) categoria = "frio"
        else if (temp > 28) categoria = "calor"

        const frases = FrasesClima[categoria]
        return frases[Math.floor(Math.random() * frases.length)]
    }

    return (
        <div className="flex flex-col gap-5">
            <section className="ml-5 mr-5">
                <div className="max-w-6xl mx-auto">
                    <hr className="mt-3 text-[#dcdcdc]!" />
                    <div className="my-3 flex flex-row gap-2">
                        <p className={`text-xs ${dark ? "" : "text-[#727171]!"}`}>Sugestões para você</p>

                        <button onClick={handleSortear} className="group flex items-center text-[10px] cursor-pointer transition-all">
                            <img className={`h-3 ${dark ? "invert" : ""} rounded-full transition-transform duration-600 group-hover:rotate-180 ${girando ? "animate-spin-custom" : ""}`} src={sicronizar} alt="Sortear" />
                        </button>
                    </div>

                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">
                        {projetosVitrine.map((projeto, i) => (
                            <Fragment key={`vitrine-${i}`}>
                                <div className="mb-3.5 break-inside-avoid">
                                    <Link title={projeto.resumo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                        <img src={projeto.conteudo.imagem?.[0]} alt={projeto.conteudo.alt?.[0]} className="w-full h-45 md:h-65 rounded-md shadow-sm object-cover" />
                                    </Link>

                                    <div className="my-2 flex justify-between items-center">
                                        <Link className="flex flex-row gap-2 items-center" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                            <p className="text-sm hover:underline tracking-tight">{projeto.titulo}</p>

                                            {projeto.emDesenvolvimento && (
                                                <span title="Em desenvolvimento" className="cursor-default bg-[#FF8101] text-white! text-[8px] px-1 rounded-sm uppercase">Dev</span>
                                            )}
                                        </Link>

                                        <p className="text-xs">{projeto.ano}</p>
                                    </div>
                                </div>

                                {i == 0 && (
                                    <div style={{ opacity: clima.loading ? 0.5 : 1 }} className="mb-3.5 p-4 break-inside-avoid bg-gray-50 border border-gray-200 rounded-md shadow-sm transition-opacity duration-500">
                                        <div className="flex justify-between items-center border-b pb-3 border-[#eeeeee]">
                                            <p className="text-[16px] font-bold uppercase text-black!">Previsão do Tempo</p>

                                            <div className="flex flex-col text-center">
                                                <p className="text-[12px] text-zinc-800!">Oferecido por:</p>
                                                {clima.loading ? (EsqueletoFornecido()) : (<span className="text-[10px] font-bold text-zinc-800!">{clima.fonteNome}</span>)}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-start px-2 py-2">
                                                {clima.loading ? (EsqueletoFornecido2()) : (<p className={`text-xl font-bold text-zinc-800!`}>{clima.cidade}</p>)}
                                                {clima.loading ? (EsqueletoFornecido2()) : (<p className="text-[17px] text-zinc-800!">Prob. de chuva: {clima.chuvaProb}% {clima.chuvaMm}mm</p>)}
                                            </div>

                                            <div className="w-full flex flex-row justify-between p-2">
                                                <div className="text-zinc-800! flex w-full justify-around items-center">
                                                    <div className="flex flex-col items-center">
                                                        <p className="text-[9px] uppercase font-bold">Manhã</p>
                                                        <span className="text-xl">{clima.manhaEmoji}</span>
                                                    </div>

                                                    <div className="flex flex-col items-center">
                                                        <p className="text-[9px] uppercase font-bold">Tarde</p>
                                                        <span className="text-xl">{clima.tardeEmoji}</span>
                                                    </div>

                                                    <div className="flex flex-col items-center">
                                                        <p className="text-[9px] uppercase font-bold">Noite</p>
                                                        <span className="text-xl">{clima.noiteEmoji}</span>
                                                    </div>
                                                </div>

                                                <div className="flex w-[20%] flex-col justify-center gap-1 text-xs font-bold">
                                                    {clima.loading ? (EsqueletoFornecido()) : (<span className="text-red-400!">{clima.max}° Max</span>)}
                                                    {clima.loading ? (EsqueletoFornecido()) : (<span className="text-blue-400!">{clima.min}° Min</span>)}
                                                </div>
                                            </div>
                                        </div>

                                        {clima.loading ? (EsqueletoFornecido()) : (<p className="text-sm text-zinc-800! italic mt-2">{clima.loading ? `"${clima.frase}"` : ""}</p>)}
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {dadosProjetos.map((categoria, index) => (
                <section key={index} className="ml-5 mr-5">
                    <div className="max-w-6xl mx-auto">
                        <hr className={`mt-3 ${dark ? "" : "text-[#dcdcdc]!"}`} />
                        <p className={`text-xs py-3 ${dark ? "" : "text-[#727171]!"}`}>{categoria.categoria}</p>

                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">
                            {categoria.subCartegorias.map((projeto, i) => (
                                <div key={i} className="mb-3.5 break-inside-avoid">
                                    <Link title={projeto.resumo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                        <img loading="lazy" src={projeto.conteudo.imagem?.[0]} alt={projeto.conteudo.alt?.[0]} className="w-full h-45 md:h-auto rounded-md shadow-sm object-cover" />
                                    </Link>

                                    <div className="my-2 flex justify-between items-center">
                                        <Link className="flex flex-row gap-2 items-center" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                            <p className="text-sm hover:underline tracking-tight">{projeto.titulo}</p>

                                            {projeto.emDesenvolvimento && (
                                                <span title="Em desenvolvimento" className="cursor-default bg-[#FF8101] text-white! text-[8px] px-1 rounded-sm uppercase">Dev</span>
                                            )}
                                        </Link>

                                        <p className="text-xs">{projeto.ano}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </div>
    )
}