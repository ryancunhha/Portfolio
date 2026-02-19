import { Link } from "react-router-dom";
import { useNotificacao } from "../../../../hooks/useNotificacao";

import dadosResumo from "../../../../data/resumo.json";
import Notificacao from "../../../../components/notificacao/notificacao";

function Introducao({ projeto, categoria }) {
    const notificacaoLink = useNotificacao(2300)
    const notificacaoBitcoin = useNotificacao(3100)

    const existeDeploy = !!projeto.deploy && projeto.deploy !== "#"

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

    return (
        <>
            <Notificacao visivel={notificacaoLink.visivel} mensagem={notificacaoLink.mensagem} progresso={notificacaoLink.progresso} onClose={notificacaoLink.esconderNotificacao} onPausa={notificacaoLink.pausarNotificacao} onDecorrer={notificacaoLink.retomarNotificacao} />
            <Notificacao visivel={notificacaoBitcoin.visivel} mensagem={notificacaoBitcoin.mensagem} progresso={notificacaoBitcoin.progresso} onClose={notificacaoBitcoin.esconderNotificacao} onPausa={notificacaoBitcoin.pausarNotificacao} onDecorrer={notificacaoBitcoin.retomarNotificacao} />

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
                            <div className="no-underline">
                                <span className="bg-[#FF8101] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-md">
                                    Em Desenvolvimento
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <img className="h-6 brightness-110 bg-white" src={dadosResumo.marca} alt="" title="ryancunhha" />
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
                </div>
            </div>
        </>
    )
}

export default Introducao