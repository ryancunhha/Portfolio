import Notificacao from "../../notificacao/notificacao";
import { useNotificacao } from "../../../hooks/useNotificacao";

import dadosContatos from "../../../data/contatos.json";

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

                <ul className="text-sm list-none">
                    <li>
                        <a title="Email" href={`mailto:${dadosContatos.email}`} onClick={EmailCopiado} className="hover:underline cursor-pointer">Email</a>
                    </li>

                    {dadosContatos.redes.map((rede, index) => (
                        rede.nome && (
                            <li key={index}>
                                <a title={rede.nome} target="_blank" href={rede.link} className="hover:underline cursor-pointer">{rede.nome}</a>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Contact