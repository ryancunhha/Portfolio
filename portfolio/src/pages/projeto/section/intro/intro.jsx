import { Link } from "react-router-dom";
import { useNotificacao } from "../../../../hooks/useNotificacao";
import { Helmet } from "react-helmet-async";

import dadosResumo from "../../../../data/resumo.json";
import Notificacao from "../../../../components/notificacao/notificacao";

export default function Introducao({ projeto, categoria }) {
    const notificacaoLink = useNotificacao(2300)
    const notificacaoBitcoin = useNotificacao(3400)

    const existeDeploy = !!projeto.deploy && projeto.deploy !== "#"
    const base_url = window.location.origin

    async function copiarLink() {
        const shareData = {
            title: projeto.nome,
            text: projeto.resuminho,
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
        navigator.clipboard.writeText(dadosResumo.bitcoin)
        notificacaoBitcoin.mostrarNotificacao(dadosResumo["cripto-rede"])
    }

    const linkImagem = projeto.imagem[0].startsWith("http") ? projeto.imagem[0] : `${base_url}${projeto.imagem[0]}`
    const urlLimpa = `${base_url}/${projeto.slug}`

    const repoGitHub = () => {
        const url = `${projeto.github}`
        window.open(url, "_blank", "noreferrer")
    }

    const compartilharFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
        window.open(url, "_blank", "noreferrer")
    }

    const compartilharWhatsapp = () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`
        window.open(url, "_blank", "noreferrer")
    }

    const compartilharTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${projeto.resuminho}&url=${urlLimpa}`
        window.open(url, "_blank", "noreferrer")
    }

    return (
        <>
            <Notificacao visivel={notificacaoLink.visivel} mensagem={notificacaoLink.mensagem} progresso={notificacaoLink.progresso} onClose={notificacaoLink.esconderNotificacao} onPausa={notificacaoLink.pausarNotificacao} onDecorrer={notificacaoLink.retomarNotificacao} />
            <Notificacao visivel={notificacaoBitcoin.visivel} mensagem={notificacaoBitcoin.mensagem} progresso={notificacaoBitcoin.progresso} onClose={notificacaoBitcoin.esconderNotificacao} onPausa={notificacaoBitcoin.pausarNotificacao} onDecorrer={notificacaoBitcoin.retomarNotificacao} />

            <Helmet>
                <title>{projeto.nome}</title>
                <meta name="description" content={projeto.resuminho} />
                <link rel="canonical" href={urlLimpa} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={urlLimpa} />
                <meta property="og:title" content={projeto.nome} />
                <meta property="og:description" content={projeto.resuminho} />
                <meta property="og:image" content={linkImagem} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={projeto.nome} />
                <meta name="twitter:description" content={projeto.resuminho} />
                <meta name="twitter:image" content={linkImagem} />
            </Helmet>

            <div className="py-2.5 px-2">

                <div className="">
                    <p className="text-[11px] mb-1 flex items-center">
                        <Link className="pr-1 hover:underline" to="/">Página Inicial</Link>
                        <span>›</span>
                        <span className="pl-1">{categoria.categoria}</span>
                    </p>

                    <h1 className="text-3xl tracking-tight font-bold text-black my-2 pr-0 md:pr-7 ">{projeto.nome}</h1>
                    <h2 className="text-xs tracking-tighter text-[#727171] md:pr-7 mb-3">{projeto.resuminho}</h2>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <div>
                            <p className="text-[13px] text-[#727171]">Feito em</p>
                            <p className="text-[11px] text-black font-medium">{projeto.ano}</p>
                        </div>

                        {projeto.emDesenvolvimento && (
                            <span className="cursor-default bg-[#FF8101] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                                Em Desenvolvimento
                            </span>
                        )}
                    </div>

                    <div>
                        <img className="h-6 brightness-110 bg-white" src={dadosResumo.marca} alt="Marca" title="ryancunhha" />
                    </div>
                </div>
            </div>

            <div className="px-2">
                <div className="flex justify-between flex-row">
                    <p className="text-[11px] mb-2 font-semibold">Compartilhar projeto</p>
                </div>

                <div className="flex flex-row items-center gap-3">

                    {existeDeploy && (
                        <a href={projeto.deploy} target="_blank" rel="noreferrer" title="Visitar Site">
                            <img className="h-6 w-6 rounded-full bg-white" src="https://img.icons8.com/ios-filled/92/domain.png" alt="site-deployado" />
                        </a>
                    )}

                    <button className="cursor-pointer" title="Ver Repositório" onClick={repoGitHub}>
                        <img className="h-6 w-6 rounded-full bg-white" src="https://img.icons8.com/ios-filled/92/github.png" alt="repositorio-no-github" />
                    </button>

                    <button onClick={copiarLink} title="Compartilhar projeto">
                        <img className="h-6 w-6 cursor-pointer rounded-full" src="https://img.icons8.com/flat-round/92/link--v1.png" alt="copiar-link" />
                    </button>

                    {dadosResumo.bitcoin && (
                        <button onClick={copiarCodigoCarteiraBTC} className="cursor-pointer" title="Faça uma doação em Bitcoin">
                            <img className="h-6 w-6 rounded-full" src="https://img.icons8.com/officel/92/bitcoin.png" alt="bitcoin" />
                        </button>
                    )}

                    <div className="flex flex-row gap-3 border-[#727171]/50 border-l pl-3">
                        <button className="cursor-pointer" onClick={compartilharWhatsapp} title="Enviar pelo WhatsApp" aria-label="Compartilhar projeto no WhatsApp">
                            <img className="h-6 w-6 bg-[#40c351] rounded-[10%] p-[1.5px]" src="https://img.icons8.com/color/90/whatsapp--v6.png" alt="WhastApp" />
                        </button>

                        <button className="cursor-pointer" onClick={compartilharFacebook} title="Compartilhar no Facebook" aria-label="Compartilhar projeto no Facebook">
                            <img className="h-6 w-6 rounded-[10%] bg-[#3b5999] p-[1.2px]" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/90/external-online-social-media-facebook-website-homescreen-logo-button-logo-color-tal-revivo.png" alt="Facebook" />
                        </button>

                        <button className="cursor-pointer" onClick={compartilharTwitter} title="Enviar no X (Twitter)" aria-label="Compartilhar projeto no X">
                            <img className="h-6 w-6 bg-[#212121] rounded-[10%]" src="https://img.icons8.com/color/90/twitterx--v1.png" alt="Twiiter" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}