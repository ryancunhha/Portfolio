import { useState, useEffect } from 'react';

export default function TickerEconomia({ dark }) {
    const [moedas, setMoedas] = useState([])
    const [pausado, setPausado] = useState(false)

    const CHAVE_CACHE = "cache-economia-v1"
    const UMA_HORA = 60 * 60 * 1000

    useEffect(() => {
        async function fetchEconomia() {
            const agora = new Date().getTime()
            const cache = localStorage.getItem(CHAVE_CACHE)

            if (cache) {
                const { data, timestamp } = JSON.parse(cache)

                if (agora - timestamp < UMA_HORA) {
                    setMoedas(data)
                    return
                }
            }

            try {
                const res = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL,BTC-USD")
                if (!res.ok) throw new Error("Erro na API")

                const data = await res.json()

                const dados = [
                    {
                        nome: "USD",
                        valor: `R$ ${parseFloat(data.USDBRL.bid).toFixed(2).replace('.', ',')}`,
                        variacao: `${parseFloat(data.USDBRL.pctChange).toFixed(2)}%`,
                        positivo: parseFloat(data.USDBRL.pctChange) >= 0
                    },
                    {
                        nome: "EUR",
                        valor: `R$ ${parseFloat(data.EURBRL.bid).toFixed(2).replace('.', ',')}`,
                        variacao: `${parseFloat(data.EURBRL.pctChange).toFixed(2)}%`,
                        positivo: parseFloat(data.EURBRL.pctChange) >= 0
                    },
                    {
                        nome: "Bitcoin - BRL",
                        valor: `R$ ${Math.round(data.BTCBRL.bid).toLocaleString("pt-BR")}`,
                        variacao: `${parseFloat(data.BTCBRL.pctChange).toFixed(2).replace('.', ',')}%`,
                        positivo: parseFloat(data.BTCBRL.pctChange) >= 0
                    },
                    {
                        nome: "Bitcoin - USD",
                        valor: `$ ${Math.round(data.BTCUSD.bid).toLocaleString("en-US")}`,
                        variacao: `${parseFloat(data.BTCUSD.pctChange).toFixed(2).replace('.', ',')}%`,
                        positivo: parseFloat(data.BTCUSD.pctChange) >= 0
                    }
                ]

                setMoedas(dados)

                localStorage.setItem(CHAVE_CACHE, JSON.stringify({
                    data: dados,
                    timestamp: agora
                }))
            } catch (error) {
                if (cache) {
                    const { data } = JSON.parse(cache)
                    setMoedas(data)
                }
            }
        }

        fetchEconomia()
    }, [])

    return (
        <div className={`relative h-6 w-full overflow-hidden border-b transition-colors flex items-center ${dark ? "bg-(--bg-color) border-zinc-600" : "bg-white border-zinc-100"}`} onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)} >
            <div className={`absolute inset-0 z-11 pointer-events-none ${dark ? "bg-linear-to-r from-(--bg-color) via-transparent 15% via-transparent 85% to-(--bg-color)" : "bg-linear-to-r from-white via-transparent 15% via-transparent 85% to-white"}`} ></div>

            <div style={{animationPlayState: pausado ? "paused" : "running", transition: "animation-duration 0.5s ease"}} className="flex whitespace-nowrap w-fit animate-ticker relative z-10" >
                {[...moedas, ...moedas].map((item, index) => (
                    <div key={index} className="flex items-center mx-6 gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                            {item.nome}
                        </span>

                        <span className={`text-[11px] font-bold ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
                            <span className={` ${item.positivo ? "text-green-500!" : "text-red-500!"}  `} >{item.valor}</span>
                        </span>

                        <div className="flex items-center gap-0.5 text-[9px] font-bold">
                            <span className={` ${item.positivo ? "text-green-300!" : "text-red-400!"}  `}>{item.positivo ? "▲" : "▼"}</span>
                            <span className={` ${item.positivo ? "text-green-300!" : "text-red-400!"} `}>{item.variacao}</span>
                        </div>

                        <span className={`text-zinc-600 opacity-20 ml-4`}>|</span>
                    </div>
                ))}
            </div>
        </div>
    )
}