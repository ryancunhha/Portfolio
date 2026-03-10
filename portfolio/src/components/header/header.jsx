import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Bar from "../bar/Bar";
import { logo, linkExterno, procura } from "../../config/imagem";
import { LINKS_NAVEGACAO } from "../../config/navegacao";
import PesquisaModal from "./pesquisa/PesquisaModal";
import TickerEconomia from "./Ticker/TickerEconomia";

export default function Header({ dark, mudarTema }) {
    const [abertura, setAberta] = useState(false)
    const [MenuAberto, setMenuAberto] = useState(false)

    const [visivel, setVisivel] = useState(true)
    const [posicaoAnterior, setPosicaoAnterior] = useState(0)

    useEffect(() => {
        const controleScroll = () => {
            const posicaoAtual = window.scrollY

            if (Math.abs(posicaoAnterior - posicaoAtual) > 5) {
                setMenuAberto(false)
            }

            if (posicaoAtual < 10) {
                setVisivel(true)
            } else {
                setVisivel(posicaoAnterior > posicaoAtual)
            }

            setPosicaoAnterior(posicaoAtual)
        }

        window.addEventListener("scroll", controleScroll)
        return () => window.removeEventListener("scroll", controleScroll)
    }, [posicaoAnterior])

    return (
        <>
            <Bar dark={dark} aberta={abertura} onClose={() => setAberta(false)} />

            <header className={`fixed top-0 left-0 z-8 h-20 w-full ${dark ? "bg-(--bg-color) border-zinc-600" : "bg-white! border-zinc-100"} transition-transform duration-250 ease-in-out border-b ${visivel ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="max-w-7xl mx-auto w-full h-14 p-4 flex flex-row items-center justify-between md:justify-start gap-8">
                    <button onClick={() => setAberta(true)} className="cursor-pointer md:hidden flex-1 flex gap-1 items-center flex-row">
                        <span className="cursor-pointer">☰</span>
                        <span className="text-xs tracking-tighter">Menu</span>
                    </button>

                    <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to="/" className="flex-1 md:flex-initial flex justify-center md:justify-start cursor-pointer">
                        <img className="h-10" src={logo} alt="logo" title="Ir para página inicial" />
                    </Link>

                    <div className="hidden md:block flex-1">
                        <ul className="flex flex-row gap-5 font-bold text-[13px] uppercase tracking-tighter list-none">
                            {LINKS_NAVEGACAO.map((item, index) => {
                                if (item.nome === "Solicitação") return null

                                return (
                                    <li key={index} className="flex items-center gap-1 group">
                                        {item.externo ? (
                                            <a href={item.path} target="_blank" rel="noreferrer" className={`${dark ? "hover:text-zinc-600!" : "hover:text-zinc-500!"} transition-colors flex items-center gap-1`}>
                                                {item.nome}
                                                <img className={`${dark ? "invert" : ""} h-2.5 opacity-50 group-hover:opacity-100 transition-opacity`} src={linkExterno} alt="externo" />
                                            </a>
                                        ) : (
                                            <Link title={item.title} to={item.path} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-zinc-500 transition-colors">
                                                {item.nome}
                                            </Link>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="flex flex-row items-center md:gap-4 flex-1 md:flex-initial justify-end">
                        {LINKS_NAVEGACAO.find(item => item.nome === "Solicitação") && (
                            <Link to={LINKS_NAVEGACAO.find(item => item.nome === "Solicitação").path} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`hidden md:block border-2 rounded-sm px-4 py-1.5 text-[10px] font-black uppercase ${dark ? "hover:bg-white! hover:text-black! border-white!" : "hover:bg-black! hover:text-white! border-black!"} transition-all duration-300`} >
                                Solicitação
                            </Link>
                        )}

                        <button className="w-8 h-8 flex items-center justify-center cursor-pointer text-[19px] transition-transform duration-200" onClick={mudarTema} >{dark ? "☀️" : "🌙"}</button>

                        <button onClick={() => setMenuAberto(!MenuAberto)} className="group flex items-center justify-center cursor-pointer" >
                            <img className={`transition-all duration-300 rounded-full h-8 w-8 p-1.5 ${dark ? "invert bg-transparent group-hover:bg-white/20" : "bg-transparent group-hover:bg-black/10"}`} src={procura} alt="Buscar" />
                        </button>
                    </div>
                </div>

                <nav className="max-w-7xl mx-auto h-6">
                    <TickerEconomia dark={dark} />
                </nav>
            </header>

            <PesquisaModal dark={dark} aberto={MenuAberto} onClose={() => setMenuAberto(false)} visivel={visivel} />

            <div className="h-20"></div>
        </>
    )
}