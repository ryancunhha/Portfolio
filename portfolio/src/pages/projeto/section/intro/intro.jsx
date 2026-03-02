import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotificacao } from "../../../../hooks/useNotificacao";

import dadosResumo from "../../../../../public/assets/data/resumo.json";
import Notificacao from "../../../../components/notificacao/notificacao";
import * as Imagens from "../../../../config/index";

function Introducao({ projeto, categoria }) {
    const notificacaoLink = useNotificacao(2300)
    const notificacaoBitcoin = useNotificacao(3100)

<<<<<<< Updated upstream
    const existeDeploy = !!projeto.deploy && projeto.deploy !== "#"
=======
    const [visivel, setVisivel] = useState(false)
    const containerRef = useRef(null)

    const existeDeploy = !!projeto.deploy && projeto.deploy !== "#" &&  projeto.deploy.includes("http")
    const base_url = "https://ryancunhha.vercel.app/"
    const existeRepositorio = !!projeto.repoGithub && projeto.repoGithub !== "#" && projeto.repoGithub.includes("http")

    useEffect(() => {
        const fecharClickFora = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setVisivel(false)
            }
        }

        document.addEventListener("mousedown", fecharClickFora)
        return () => document.removeEventListener("mousedown", fecharClickFora)
    }, [])
>>>>>>> Stashed changes

    async function copiarLink() {
        const shareData = {
            title: projeto.nome,
            text: projeto.resumo,
            url: window.location.href,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (error) { }
        } else {
            navigator.clipboard.writeText(window.location.href)
            notificacaoLink.mostrarNotificacao("Link copiado para a área de transferência")
        }
    }

    function copiarCodigoCarteiraBTC() {
        navigator.clipboard.writeText(dadosResumo.bitcoin[0])
        notificacaoBitcoin.mostrarNotificacao(dadosResumo.bitcoin[2])
    }

<<<<<<< Updated upstream
=======
    function copiarPix() {
        navigator.clipboard.writeText(dadosResumo.pix[0])
        notificacaoBitcoin.mostrarNotificacao(dadosResumo.pix[2])
    }

    const linkImagem = projeto.conteudo.imagem[0].startsWith("http") ? projeto.conteudo.imagem[0] : `${base_url}${projeto.conteudo.imagem[0]}`
    const urlLimpa = `${base_url}/${projeto.slug}`

    const verSite = () => {
        window.open(projeto.deploy, "_blank", "noreferrer")
    }

    const repoGitHub = () => {
        window.open(projeto.repoGithub, "_blank", "noreferrer")
    }

    const compartilharFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlLimpa)}`
        window.open(url, "_blank", "noreferrer")
    }

    const compartilharWhatsapp = () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(urlLimpa)}`
        window.open(url, "_blank", "noreferrer")
    }

    const compartilharTwitter = () => {
        const textoParaCompartilhar = projeto.conteudo.paragrafo[0] || projeto.conteudo.paragrafo?.[0]
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoParaCompartilhar)}&url=${encodeURIComponent(urlLimpa)}`
        window.open(url, "_blank", "noreferrer")
    }

    const [visivelBTC, setVisivelBTC] = useState(false)
    const [visivelPix, setVisivelPix] = useState(false)

    const QrCode = ({ visivel, qrcode, deposito, rede, texto }) => {
        return (
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 p-2 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-300 z-50 w-32 ${visivel ? "opacity-100 scale-95 visible" : "opacity-0 invisible"}`}>

                {qrcode && (
                    <img loading="lazy" src={qrcode} alt="QR Code" className="w-full h-auto" />
                )}

                <div className="flex flex-col gap-1 border-t border-gray-50 pt-2">
                    <p className="text-[9px] leading-[1.1] text-black font-mono break-all bg-gray-50 p-1.5 rounded border border-gray-100">
                        {texto}
                    </p>

                    {deposito && (
                        <div className="flex justify-between items-center px-0.5">
                            <span className="text-[8px] font-bold text-gray-400 uppercase">Depósito Mín:</span>
                            <span className="text-[8px] font-bold text-orange-500 uppercase">{deposito}</span>
                        </div>
                    )}

                    {rede && (
                        <div className="flex justify-between items-center px-0.5">
                            <span className="text-[8px] font-bold text-gray-400 uppercase">Rede:</span>
                            <span className="text-[8px] font-bold text-orange-500 uppercase">{rede}</span>
                        </div>
                    )}

                    <p className="text-[8px] text-center mt-1 text-orange-500 font-bold uppercase">Escaneie ou clique para copiar</p>
                </div>

                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
            </div>
        )
    }

>>>>>>> Stashed changes
    return (
        <>
            <Notificacao visivel={notificacaoLink.visivel} mensagem={notificacaoLink.mensagem} progresso={notificacaoLink.progresso} onClose={notificacaoLink.esconderNotificacao} onPausa={notificacaoLink.pausarNotificacao} onDecorrer={notificacaoLink.retomarNotificacao} />
            <Notificacao visivel={notificacaoBitcoin.visivel} mensagem={notificacaoBitcoin.mensagem} progresso={notificacaoBitcoin.progresso} onClose={notificacaoBitcoin.esconderNotificacao} onPausa={notificacaoBitcoin.pausarNotificacao} onDecorrer={notificacaoBitcoin.retomarNotificacao} />

<<<<<<< Updated upstream
            <div className="py-2.5 px-2">
=======
            <div className="py-2.5 px-2 max-w-7xl mx-auto">
>>>>>>> Stashed changes

                <div className="">
                    <p className="text-[11px] mb-1 flex items-center">
                        <Link className="pr-1 hover:underline" to="/">Página Inicial</Link>
                        <span>›</span>
                        <span className="pl-1">{categoria.categoria}</span>
                    </p>

                    <h1 className="text-3xl tracking-tight font-bold text-black my-2 pr-0 md:pr-7 ">{projeto.titulo}</h1>
                    <h2 className="text-xs tracking-tighter text-[#727171] md:pr-7 mb-3">{projeto.resumo}</h2>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        {projeto.ano && (
                            <div>
                                <p className="text-[13px] text-[#727171]">Feito em</p>
                                <p className="text-[11px] text-black font-medium">{projeto.ano}</p>
                            </div>
                        )}

                        {projeto.emDesenvolvimento && (
<<<<<<< Updated upstream
                            <div className="no-underline">
                                <span className="bg-[#FF8101] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-md">
                                    Em Desenvolvimento
                                </span>
                            </div>
=======
                            <span className="bg-[#FF8101] text-center text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                                Em Desenvolvimento
                            </span>
>>>>>>> Stashed changes
                        )}
                    </div>

                    <div>
<<<<<<< Updated upstream
                        <img className="h-6 brightness-110 bg-white" src={dadosResumo.marca} alt="" title="ryancunhha" />
=======
                        <img className="h-6" src={Imagens.logo} alt="Logo" title="ryancunhha" />
>>>>>>> Stashed changes
                    </div>
                </div>
            </div>

            <div className="px-2 max-w-7xl mx-auto">
                <div className="flex justify-between flex-row">
                    <p className="text-[11px] mb-2 font-semibold">Compartilhar projeto</p>
                </div>

                <div className="flex flex-row flex-wrap items-center gap-3">
                    {existeDeploy && (
<<<<<<< Updated upstream
                        <a href={projeto.deploy} target="_blank" rel="noreferrer" title="Visitar Site">
                            <img className="h-6  rounded-[100%] bg-white" src="https://img.icons8.com/ios-filled/92/domain.png" alt="site-deployado" />
                        </a>
                    )}

                    <a href={projeto.github} target="_blank" title="Ver Repositório">
                        <img className="h-6 rounded-[100%] bg-white" src="https://img.icons8.com/ios-filled/92/github.png" alt="repositorio-no-github" />
                    </a>

                    <button onClick={copiarLink} title="Compartilhar projeto">
                        <img className="h-6 cursor-pointer rounded-[100%]" src="https://img.icons8.com/flat-round/92/link--v1.png" alt="copiar-link" />
                    </button>

                    {dadosResumo.bitcoin && (
                        <button onClick={copiarCodigoCarteiraBTC} className="cursor-pointer" title="Faça uma doação em Bitcoin">
                            <img className="h-6 rounded-full" src="https://img.icons8.com/officel/92/bitcoin.png" alt="bitcoin" />
                        </button>
                    )}
=======
                        <button className="cursor-pointer" title="Visitar Site" onClick={verSite}>
                            <img className="h-6 w-6 rounded-full bg-white" src={Imagens.dominio} alt="site-deployado" />
                        </button>
                    )}

                    {existeRepositorio && (
                        <button className="cursor-pointer" title="Ver Repositório" onClick={repoGitHub}>
                            <img className="h-6 w-6 rounded-full bg-white" src={Imagens.github} alt="repositorio-no-github" />
                        </button>
                    )}

                    <button onClick={copiarLink} title="Compartilhar projeto">
                        <img className="h-6 w-6 cursor-pointer rounded-full" src={Imagens.link} alt="copiar-link" />
                    </button>

                    {dadosResumo.bitcoin && (
                        <div className="relative flex items-center justify-center" ref={containerRef}>
                            <QrCode visivel={visivelBTC} texto={dadosResumo.bitcoin[0]} qrcode={dadosResumo.bitcoin[1]} deposito={dadosResumo.bitcoin[4]} rede={dadosResumo.bitcoin[3]} />

                            <button onClick={() => { copiarCodigoCarteiraBTC(); setVisivelBTC(!visivel); }} onMouseEnter={() => setVisivelBTC(true)} onMouseLeave={() => setVisivelBTC(false)} className="cursor-pointer hover:bg-orange-50 rounded-full transition-all flex items-center justify-center" title="Apoiar com Bitcoin">
                                <img className={`h-6 w-6 transition-transform`} src={Imagens.btc} alt="bitcoin" />
                            </button>
                        </div>
                    )}

                    {dadosResumo.pix && (
                        <div className={`relative items-center justify-center`} ref={containerRef}>
                            <QrCode visivel={visivelPix} texto={dadosResumo.pix[0]} qrcode={dadosResumo.pix[1]} />

                            <button onClick={() => { copiarPix(); setVisivel(!visivelPix); }} onMouseEnter={() => setVisivelPix(true)} onMouseLeave={() => setVisivelPix(false)} className="cursor-pointer hover:bg-orange-50 rounded-full transition-all flex items-center justify-center" title="Apoiar com Pix">
                                <img className="p-1 rounded-full h-6 w-6 bg-[#29bbac]" src={Imagens.pix} alt="pix" />
                            </button>
                        </div>
                    )}

                    <button className="cursor-pointer" onClick={compartilharWhatsapp} title="Enviar pelo WhatsApp" aria-label="Compartilhar projeto no WhatsApp">
                        <img className="h-6 w-6 bg-[#39b44c] rounded-full p-1" src={Imagens.zap} alt="WhastApp" />
                    </button>

                    <button className="cursor-pointer" onClick={compartilharFacebook} title="Compartilhar no Facebook" aria-label="Compartilhar projeto no Facebook">
                        <img className="h-6 w-6 rounded-full bg-[#3f51b5]" src={Imagens.face} alt="Facebook" />
                    </button>

                    <button className="cursor-pointer" onClick={compartilharTwitter} title="Enviar no X (Twitter)" aria-label="Compartilhar projeto no X">
                        <img className={`h-6 w-6 bg-[#212121] rounded-full`} src={Imagens.twitter} alt="Twiiter" />
                    </button>
>>>>>>> Stashed changes
                </div>
            </div>
        </>
    )
}

export default Introducao