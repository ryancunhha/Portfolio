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
        <div className={`relative h-6 w-full overflow-hidden border-b transition-colors flex items-center ${dark ? "border-zinc-600" : "border-zinc-100"}`} onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)} >
            <div className="absolute inset-0 z-11 pointer-events-none" ></div>

            <div style={{ animationPlayState: pausado ? "paused" : "running", transition: "animation-duration 0.5s ease" }} className="flex whitespace-nowrap animate-ticker relative z-10 w-[max-content]" >
                {[...moedas, ...moedas, ...moedas].map((item, index) => (
                    <div key={index} className="flex items-center shrink-0 px-8 gap-2 border-r-2 border-zinc-600 ">
                        <span className={`text-[11px] font-black ${dark ? "text-zinc-200!" : "text-zinc-600!"}`}>
                            {item.nome}
                        </span>

                        <span className={`text-[11px] font-bold  ${dark ? "text-zinc-200!" : "text-zinc-600!"}`} >{item.valor}</span>

                        <span className={`text-[11px] font-bold ${item.positivo ? "text-green-300!" : "text-red-400!"}`}>{item.variacao}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}