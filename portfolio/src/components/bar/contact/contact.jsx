import Notificacao from "../../notificacao/notificacao";
import { useNotificacao } from "../../../hooks/useNotificacao";

import dadosContatos from "../../../../public/assets/data/contatos.json";
import { linkExterno, email } from "../../../config/index";

function Contact() {
    const notificacao = useNotificacao(2500)

    function EmailCopiado() {
        navigator.clipboard.writeText(dadosContatos.email)

        notificacao.mostrarNotificacao("Email copiado. Cole no seu app de email.")
    }

    return (
        <div>
            <Notificacao visivel={notificacao.visivel} mensagem={notificacao.mensagem} progresso={notificacao.progresso} onClose={notificacao.esconderNotificacao} onPausa={notificacao.pausarNotificacao} onDecorrer={notificacao.retomarNotificacao} />

            <div>
                <h1 className="text-xs text-[#727171]">Contatos</h1>

<<<<<<< Updated upstream
                <ul className="text-sm list-none">
                    <li>
                        <a title="Email" href={`mailto:${dadosContatos.email}`} onClick={EmailCopiado} className="hover:underline cursor-pointer">Email</a>
=======
                <ul className="flex flex-col gap-1.5 text-sm list-none">
                    <li onClick={EmailCopiado} className="max-w-max flex flex-row items-center gap-1 cursor-pointer">
                        <img className="h-3 w-3" src={email} alt="Email" />
                        <span>Email</span>
>>>>>>> Stashed changes
                    </li>

                    {dadosContatos.redes.map((rede, index) => (
                        rede.nome && (
<<<<<<< Updated upstream
                            <li key={index}>
                                <a title={rede.nome} target="_blank" href={rede.link} className="hover:underline cursor-pointer">{rede.nome}</a>
=======
                            <li className="w-max" key={index}>
                                <a target="_blank" href={rede.link} className="tracking-tighter flex flex-row items-center gap-1 cursor-pointer">
                                    {rede["imagem-rede"] && (
                                        <img className="h-3 w-3" src={rede["imagem-rede"]} alt="rede" />
                                    )}
                                    {rede.nome}
                                    <img className="h-3" src={linkExterno} alt="link" />
                                </a>
>>>>>>> Stashed changes
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Contact