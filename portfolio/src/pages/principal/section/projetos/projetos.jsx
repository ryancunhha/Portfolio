import { Link } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";

<<<<<<< Updated upstream
import dadosProjetos from "../../../../data/projetos.json";
=======
import dadosProjetos from "../../../../../public/assets/data/projetos.json";
import dadosFrasesClima from "../../../../../public/assets/sobre/frasesClima.json";
>>>>>>> Stashed changes
import { slugify } from "../../../../utils/slugify/slugify";

function Projetos() {
    const [categoriasEmbaralhadas, setCategoriasEmbaralhadas] = useState([])

    const [clima, setClima] = useState({
<<<<<<< Updated upstream
        cidade: "Rio de Janeiro",
=======
        cidade: "--",
>>>>>>> Stashed changes
        chuvaProb: 0,
        chuvaMm: 0,
        max: "--",
        min: "--",
        manhaEmoji: "☀️",
        tardeEmoji: "🌤️",
        noiteEmoji: "🌙",
<<<<<<< Updated upstream
        frase: "Analisando",
=======
        fonteNome: "-",
        frase: "",
>>>>>>> Stashed changes
        loading: true
    })

    useEffect(() => {
        const shuffle = (array) => {
            const novoArray = [...array]

            for (let i = novoArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
            }
            return novoArray
        }

        const novosDados = dadosProjetos.map(categoria => ({
            ...categoria,
            subCartegorias: shuffle(categoria.subCartegorias)
        }))

        setCategoriasEmbaralhadas(novosDados)

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
        const cache = localStorage.getItem("cache-clima")

        if (cache) {
            const { data, timestamp } = JSON.parse(cache)
            const agora = new Date().getTime()
            const Minutos = 60 * 60 * 1000

            if (agora - timestamp < Minutos) {
                setClima({ ...data, loading: false })
                return
            }
        }

        try {
            const resIp = await fetch("https://ipapi.co/json/").catch(() => null)
            if (!resIp || !resIp.status !== "200") throw new Error("Erro na API de IP")

            const dataIp = await resIp.json()

            const urlClima = `/api/clima?lat=${dataIp.latitude}&lon=${dataIp.longitude}`
            const resClima = await fetch(urlClima)
            const data = await resClima.json()

<<<<<<< Updated upstream
            if (!data.daily) throw new Error("Erro nos dados do clima");
=======
            const tempMax = Math.round(data.daily.temperature_2m_max[0])
            const probChuva = data.daily.precipitation_probability_max[0]
>>>>>>> Stashed changes

            const getEmoji = (code) => {
                if (code <= 1) return "☀️"
                if (code <= 3) return "🌤️"
                if (code >= 51 && code <= 67) return "🌧️"
                if (code >= 71 && code <= 77) return "❄️"
                return "☁️"
            }

<<<<<<< Updated upstream
            const tempMax = Math.round(data.daily.temperature_2m_max[0])
            const probChuva = data.daily.precipitation_probability_max[0]
            const Frase = obterFraseSorteada(tempMax, probChuva)

            setClima({
=======
            const clima = {
>>>>>>> Stashed changes
                cidade: dataIp.city,
                chuvaProb: probChuva,
                chuvaMm: data.daily.precipitation_sum[0],
                max: tempMax,
                min: Math.round(data.daily.temperature_2m_min[0]),
                manhaEmoji: getEmoji(data.hourly.weathercode[9]),
                tardeEmoji: getEmoji(data.hourly.weathercode[15]),
                noiteEmoji: "🌙",
<<<<<<< Updated upstream
                frase: Frase,
=======
                frase: obterFraseSorteada(tempMax, probChuva),
                fonteNome: new URL(urlClima).hostname.replace("api.", "").replace(".com", ""),
>>>>>>> Stashed changes
                loading: false
            }

            localStorage.setItem("cache-clima", JSON.stringify({
                data: clima,
                timestamp: new Date().getTime()
            }))

            setClima(clima)
        } catch (error) {
<<<<<<< Updated upstream
            console.error("Erro ao buscar clima:", error)
            setClima({
                cidade: "Rio de Janeiro",
                chuvaProb: 10,
                chuvaMm: 0,
                max: 30,
                min: 22,
                manhaEmoji: "☀️",
                tardeEmoji: "🌤️",
                noiteEmoji: "🌙",
                frase: "Alguém realmente lê isso?",
                loading: false
=======
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
>>>>>>> Stashed changes
            })
        }
    }

    const frasesClima = {
        frio: [
            "Clima de montanha! Perfeito para um café quente e muito código.",
            "Está frio lá fora, mas o terminal está pegando fogo!",
            "Hora de colocar o casaco e abrir o VS Code.",
            "Compilando... e tremendo de frio.",
            "Alguém realmente lê isso?",
            "Stack Overflow aquece mais que cobertor."
        ],
        agradavel: [
            "Temperatura ideal para tirar aquela ideia do papel.",
            "Clima agradável, mente focada.",
            "99 bugs na branch, 99 bugs...",
            "Consigo ver minha casa daqui! 🏠",
            "Ótimo dia para codar!",
            "Clima agradável, mente focada. Vamos codar!",
            "Alguém realmente lê isso?",
            "O dia está perfeito para resolver uns bugs."
        ],
        calor: [
            "Está calor por aqui! Não esqueça de se hidratar.",
            "Sol lá fora, Dark Mode aqui dentro.",
            "Meu PC está parecendo uma airfryer.",
            "Sol lá fora, código aqui dentro.",
            "Alguém realmente lê isso?",
            "Clima tropical e produtividade a mil!"
        ],
        chuva: [
            "Caindo um pé d'água? Melhor lugar é dentro do código!",
            "Alguém realmente lê isso?",
            "Som de chuva ao fundo e café na mão. Combo perfeito.",
            "Dia chuvoso pede um refil de café e novos commits."
        ]
    }

    const obterFraseSorteada = (temp, chuva) => {
        if (temp === "--") return ""

        let categoria = "agradavel"
        const t = Number(temp)

        if (chuva > 50) {
            categoria = "chuva"
        } else if (t <= 18) {
            categoria = "frio"
        } else if (t > 28) {
            categoria = "calor"
        }

        const frases = frasesClima[categoria]
        const indiceAleatorio = Math.floor(Math.random() * frases.length)

        return frases[indiceAleatorio]
    }

    return (
<<<<<<< Updated upstream
        <div>
            {categoriasEmbaralhadas.map((categoria, index) => (
                <div key={index} className="ml-5">
                    <div>
                        <hr className="mt-3 text-[#dcdcdc]" />
                        <p className="text-xs py-3 text-[#727171]">{categoria.categoria}</p>
                    </div>

                    <div className="mr-5">
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">

                            {categoria.subCartegorias.map((projeto, i) => (
                                <Fragment key={i}>

                                    {index === 0 && i === 4 && (
                                        <div style={{ opacity: clima.loading ? 0.5 : 1 }} className="mb-3.5 p-2 break-inside-avoid bg-gray-50 border border-gray-200 rounded-md flex gap-1 flex-col justify-between text-[#727171] tracking-tighter shadow-sm transition-opacity duration-500">

                                            <div className="flex justify-between items-center border-b px-2 pt-1 pb-3 border-[#eeeeee]">
                                                <p className="text-[16px] font-bold uppercase text-black">Previsão do Tempo</p>

                                                <div className="flex flex-col text-center">
                                                    <p className="text-[12px]">Oferecido por:</p>
                                                    <span className="text-[10px] font-bold text-black">Open-Meteo</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">

                                                <div className="text-start px-2 py-2">
                                                    <p className="text-[20px] font-bold text-zinc-800">{clima.cidade}</p>
                                                    <p className="text-[17px]">Prob. de chuva: {clima.chuvaProb}% {clima.chuvaMm}mm</p>
                                                </div>

                                                <div className="w-full flex flex-row justify-between px-2">
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

                                            <p className="p-2 text-[16px] text-zinc-600 italic">"{clima.frase}"</p>
                                        </div>
                                    )}

                                    <div className="mb-3.5 break-inside-avoid">
                                        <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} title={projeto.resuminho} className="cursor-pointer" to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                            <img loading="lazy" src={projeto.imagem?.[0]} alt={projeto.nome} className="duration-300 ease-in-out w-full shadow-sm hover:shadow-lg rounded-md" />
                                        </Link>

                                        <div className="my-2 flex justify-between text-sm items-center">
                                            <Link className="flex flex-row gap-1 items-center" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} title={projeto.nome} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                                
                                                <p className="text-sm hover:underline tracking-tight">{projeto.nome}</p>

                                                {projeto.emDesenvolvimento && (
                                                    <div className="flex flex-col gap-1 no-underline">
                                                        <span className="bg-[#FF8101] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-md">
                                                            Em Desenvolvimento
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>
                                            <p className="text-xs">{projeto.ano}</p>
                                        </div>
                                    </div>

                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
=======
        <div className="flex flex-col gap-5">

            <section className="ml-5 mr-5">
                <div className="max-w-7xl mx-auto">
                    <hr className="mt-3 text-[#dcdcdc]" />
                    <p className="text-xs py-3 text-[#727171]">Aleatórios</p>

                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">
                        {projetosVitrine.map((projeto, i) => (
                            <Fragment key={`vitrine-${i}`}>
                                <div className="mb-3.5 break-inside-avoid">
                                    <Link title={projeto.titulo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                        <img src={projeto.conteudo.imagem?.[0]} alt={projeto.conteudo.alt?.[0]} className="hover:scale-101 transition-all w-full rounded-md shadow-sm h-auto object-cover" />
                                    </Link>

                                    <div className="my-2 flex justify-between items-center">
                                        <Link className="flex flex-row gap-2 items-center" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                            <p className="text-sm hover:underline tracking-tight">{projeto.titulo}</p>

                                            {projeto.emDesenvolvimento && (
                                                <span title="Em desenvolvimento" className="bg-[#FF8101] text-white text-[8px] px-1 rounded-sm uppercase">Dev</span>
                                            )}
                                        </Link>

                                        <p className="text-xs">{projeto.ano}</p>
                                    </div>
                                </div>

                                {i == 2 && (
                                    <div style={{ opacity: clima.loading ? 0.5 : 1 }} className="mb-3.5 p-4 break-inside-avoid bg-gray-50 border border-gray-200 rounded-md shadow-sm transition-opacity duration-500">
                                        <div className="flex justify-between items-center border-b pb-3 border-[#eeeeee]">
                                            <p className="text-[16px] font-bold uppercase text-black">Previsão do Tempo</p>

                                            <div className="flex flex-col text-center">
                                                <p className="text-[12px]">Oferecido por:</p>
                                                {clima.loading ? (EsqueletoFornecido()) : (<span className="text-[10px] font-bold text-black">{clima.fonteNome}</span>)}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-start px-2 py-2">
                                                {clima.loading ? (EsqueletoFornecido2()) : (<p className="text-xl font-bold text-zinc-800">{clima.cidade}</p>)}
                                                {clima.loading ? (EsqueletoFornecido2()) : (<p className="text-[17px]">Prob. de chuva: {clima.chuvaProb}% {clima.chuvaMm}mm</p>)}
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
                                                    {clima.loading ? (EsqueletoFornecido()) : (<span className="text-red-400">{clima.max}° Max</span>)}
                                                    {clima.loading ? (EsqueletoFornecido()) : (<span className="text-blue-400">{clima.min}° Min</span>)}
                                                </div>
                                            </div>
                                        </div>

                                        {clima.loading ? (EsqueletoFornecido()) : (<p className="text-sm text-zinc-600 italic mt-2">{clima.loading ? `"${clima.frase}"` : ""}</p>)}
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {dadosProjetos.map((categoria, index) => (
                <section key={index} className="ml-5 mr-5">
                    <div className="max-w-7xl mx-auto">
                        <hr className="mt-3 text-[#dcdcdc]" />
                        <p className="text-xs py-3 text-[#727171]">{categoria.categoria}</p>

                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5">
                            {categoria.subCartegorias.map((projeto, i) => (
                                <div key={i} className="mb-3.5 break-inside-avoid">
                                    <Link title={projeto.titulo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                        <img loading="lazy" src={projeto.conteudo.imagem?.[0]} alt={projeto.conteudo.alt?.[0]} className="hover:scale-101 transition-all w-full h-auto rounded-md shadow-sm object-cover" />
                                    </Link>

                                    <div className="my-2 flex justify-between items-center">
                                        <Link className="flex flex-row gap-2 items-center" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to={`/${slugify(projeto.slug) ?? projeto.slug}`}>
                                            <p className="text-sm hover:underline tracking-tight">{projeto.titulo}</p>

                                            {projeto.emDesenvolvimento && (
                                                <span title="Em desenvolvimento" className="cursor-default bg-[#FF8101] text-white text-[8px] px-1 rounded-sm uppercase">Dev</span>
                                            )}
                                        </Link>

                                        <p className="text-xs">{projeto.ano}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>
>>>>>>> Stashed changes
            ))}
        </div>
    )
}

export default Projetos