import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Menu from "./Menu/Menu";
import Bar from "../bar/Bar";
import Pesquisa from "./pesquisa/pesquisa";

import * as Imagem from "../../config/index";
import { LINKS_NAVEGACAO } from "../../config/navegacao";

export default function Header() {
    const [abertura, setAberta] = useState(false)
    const [visivel, setVisivel] = useState(true)
    const [posicaoAnterior, setPosicaoAnterior] = useState(0)

    useEffect(() => {
        const controleScroll = () => {
            const posicaoAtual = window.scrollY

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
            <Bar aberta={abertura} onClose={() => setAberta(false)} />

            <header className={`fixed top-0 left-0 z-8 h-14 w-full bg-white/80 backdrop-blur-md transition-transform duration-300 ease-in-out border-b border-zinc-100 ${visivel ? "translate-y-0" : "-translate-y-full"}`}>

                <div className="max-w-7xl mx-auto w-full">
                    <div className="h-14 p-4 flex flex-row items-center justify-between md:justify-start gap-8">
                        <div className="md:hidden flex-1">
                            <Menu onClick={() => setAberta(true)} />
                        </div>

                        <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
                            <Link aria-label="Ir para a página inicial" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to="/" className="cursor-pointer">
                                <img className="h-8 md:h-9 w-auto" src={Imagem.logo} alt="Logo" />
                            </Link>
                        </div>

                        <nav className="hidden md:block flex-1">
                            <ul className="flex flex-row gap-6 font-bold text-[13px] uppercase tracking-tighter list-none">
                                {LINKS_NAVEGACAO.map((item, index) => {
                                    if (item.nome === "Solicitação") return null

                                    return (
                                        <li key={index} className="flex items-center gap-1 group">
                                            {item.externo ? (
                                                <a href={item.path} target="_blank" rel="noreferrer" className="hover:text-zinc-500 transition-colors flex items-center gap-1">
                                                    {item.nome}
                                                    <img className="h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" src={Imagem.linkExterno} alt="externo" />
                                                </a>
                                            ) : (
                                                <Link to={item.path} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-zinc-500 transition-colors">
                                                    {item.nome}
                                                </Link>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>

                        <div className="flex flex-row items-center gap-4 flex-1 md:flex-initial justify-end">
                            {LINKS_NAVEGACAO.find(item => item.nome === "Solicitação") && (
                                <Link to={LINKS_NAVEGACAO.find(item => item.nome === "Solicitação").path} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hidden md:block border-2 border-black rounded-sm px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-all duration-300" >
                                    Solicitação
                                </Link>
                            )}

                            <Pesquisa />
                        </div>
                    </div>
                </div>
            </header>

            <div className="h-14"></div>
        </>
    )
}