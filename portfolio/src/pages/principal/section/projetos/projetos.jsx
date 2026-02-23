import { Link } from "react-router-dom";
import { useState, useEffect, Fragment, useMemo } from "react";

import dadosProjetos from "../../../../data/projetos.json";
import dadosFrasesClima from "../../../../data/frasesClima.json";
import { slugify } from "../../../../utils/slugify/slugify";

export default function Projetos() {
    const [clima, setClima] = useState({
        cidade: "",
        chuvaProb: 0,
        chuvaMm: 0,
        max: "--",
        min: "--",
        manhaEmoji: "☀️",
        tardeEmoji: "🌤️",
        noiteEmoji: "🌙",
        frase: "",
        loading: true
    })

    const projetosVitrine = useMemo(() => {
        const todos = dadosProjetos.flatMap(cat => cat.subCartegorias)

        return todos.sort(() => Math.random() - 0.5).slice(0, 6)
    }, [])

    useEffect(() => {
        fetchClima()
    }, [])

    async function fetchClima() {
        try {
            const resIp = await fetch("https://ipapi.co/json/")
            const dataIp = await resIp.json()

            if (!dataIp.status === "fail") throw new Error("Falha na localização")

            const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${dataIp.latitude}&longitude=${dataIp.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&hourly=weathercode&timezone=auto`

            const resClima = await fetch(urlClima)
            const data = await resClima.json()

            if (!data.daily) throw new Error("Erro nos dados do clima")

            const getEmoji = (code) => {
                if (code <= 1) return "☀️"
                if (code <= 3) return "🌤️"
                if (code >= 51 && code <= 67) return "🌧️"
                if (code >= 71 && code <= 77) return "❄️"
                return "☁️"
            }

            const tempMax = Math.round(data.daily.temperature_2m_max[0])
            const probChuva = data.daily.precipitation_probability_max[0]

            setClima({
                cidade: dataIp.city,
                chuvaProb: probChuva,
                chuvaMm: data.daily.precipitation_sum[0],
                max: tempMax,
                min: Math.round(data.daily.temperature_2m_min[0]),
                manhaEmoji: getEmoji(data.hourly.weathercode[9]),
                tardeEmoji: getEmoji(data.hourly.weathercode[15]),
                noiteEmoji: "🌙",
                frase: obterFraseSorteada(tempMax, probChuva),
                loading: false
            })
        } catch (error) {
            console.error("Erro ao buscar clima:", error)
        }
    }

    const obterFraseSorteada = (temp, chuva) => {
        let categoria = "agradavel"

        if (chuva > 50) categoria = "chuva"
        else if (temp <= 18) categoria = "frio"
        else if (temp > 28) categoria = "calor"

        const frases = dadosFrasesClima[categoria]
        return frases[Math.floor(Math.random() * frases.length)]
    }

    return (
        <div className="flex flex-col gap-5">

            <section className="ml-5 mr-5">
                <hr className="my-3 text-[#dcdcdc]" />

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">
                    {projetosVitrine.map((projeto, i) => (
                        <Fragment key={`vitrine-${i}`}>
                            <div className="mb-3.5 break-inside-avoid">
                                <Link title={projeto.resuminho} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                    <img src={projeto.imagem?.[0]} alt={projeto.nome} className="w-full rounded-md shadow-sm" />
                                </Link>

                                <div className="my-2 flex justify-between items-center">
                                    <Link className="flex flex-row gap-2 items-center" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                        <p className="text-sm hover:underline tracking-tight">{projeto.nome}</p>

                                        {projeto.emDesenvolvimento && (
                                            <span title="Em desenvolvimento" className="bg-[#FF8101] text-white text-[8px] px-1 rounded-sm uppercase">Dev</span>
                                        )}
                                    </Link>

                                    <p className="text-xs">{projeto.ano}</p>
                                </div>
                            </div>

                            {i == 3 && (
                                <div style={{ opacity: clima.loading ? 0.5 : 1 }} className="mb-3.5 p-4 break-inside-avoid bg-gray-50 border border-gray-200 rounded-md shadow-sm transition-opacity duration-500">
                                    <div className="flex justify-between items-center border-b pb-3 border-[#eeeeee]">
                                        <p className="text-[16px] font-bold uppercase text-black">Previsão do Tempo</p>

                                        <div className="flex flex-col text-center">
                                            <p className="text-[12px]">Oferecido por:</p>
                                            <span className="text-[10px] font-bold text-black">Open-Meteo</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-start px-2 py-2">
                                            <p className="text-xl font-bold text-zinc-800">{clima.cidade}</p>
                                            <p className="text-[17px]">Prob. de chuva: {clima.chuvaProb}% {clima.chuvaMm}mm</p>
                                        </div>

                                        <div className="w-full flex flex-row justify-between p-2">
                                            <div className="flex w-full justify-around items-center">
                                                <div className="flex flex-col items-center">
                                                    <label className="text-[9px] uppercase font-bold">Manhã</label>
                                                    <span className="text-xl">{clima.manhaEmoji}</span>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <label className="text-[9px] uppercase font-bold">Tarde</label>
                                                    <span className="text-xl">{clima.tardeEmoji}</span>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <label className="text-[9px] uppercase font-bold">Noite</label>
                                                    <span className="text-xl">{clima.noiteEmoji}</span>
                                                </div>
                                            </div>

                                            <div className="flex w-[20%] flex-col justify-center gap-1 text-xs font-bold">
                                                <span className="text-red-400">{clima.max}° Max</span>
                                                <span className="text-blue-400">{clima.min}° Min</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-600 italic mt-2">"{clima.frase}"</p>
                                </div>
                            )}
                        </Fragment>
                    ))}
                </div>
            </section>

            {dadosProjetos.map((categoria, index) => (
                <section key={index} className="ml-5 mr-5">
                    <hr className="mt-3 text-[#dcdcdc]" />
                    <p className="text-xs py-3 text-[#727171]">{categoria.categoria}</p>

                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">
                        {categoria.subCartegorias.map((projeto, i) => (
                            <div key={i} className="mb-3.5 break-inside-avoid">
                                <Link title={projeto.resuminho} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                    <img loading="lazy" src={projeto.imagem?.[0]} alt={projeto.nome} className="w-full rounded-md shadow-sm" />
                                </Link>

                                <div className="my-2 flex justify-between items-center">
                                    <Link className="flex flex-row gap-2 items-center" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                        <p className="text-sm hover:underline tracking-tight">{projeto.nome}</p>

                                        {projeto.emDesenvolvimento && (
                                            <span title="Em desenvolvimento" className="cursor-default bg-[#FF8101] text-white text-[8px] px-1 rounded-sm uppercase">Dev</span>
                                        )}
                                    </Link>

                                    <p className="text-xs">{projeto.ano}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}