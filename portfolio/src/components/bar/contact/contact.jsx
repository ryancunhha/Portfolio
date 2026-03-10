import Notificacao from "../../notificacao/notificacao";
import { useNotificacao } from "../../../hooks/useNotificacao";

import { email, linkExterno } from "../../../config/imagem";
import dadosContatos from "../../../../public/data/contatos.json";

export default function Contact({ dark }) {
    const notificacao = useNotificacao(2500)

    async function EmailCopiado(email) {
        let appAbriu = false

        const detectarSaida = () => {
            appAbriu = true

            window.removeEventListener('blur', detectarSaida)
        }

        window.addEventListener('blur', detectarSaida)

        window.location.href = `mailto:${email}`

        setTimeout(async () => {
            window.removeEventListener('blur', detectarSaida)

            if (!appAbriu) {
                try {
                    await navigator.clipboard.writeText(email)
                    notificacao.mostrarNotificacao("E-mail copiado! Cole no seu e-mail.")
                } catch (error) {
                    console.error("Erro: App bloqueado e Cópia negada.", error)
                    notificacao.mostrarNotificacao("Erro ao abrir e-mail. Tente copiar manualmente.")
                }
            }
        }, 600);
    }

    function links(url) {
        window.open(url, "_blank", "noreferrer")
    }

    return (
        <>
            <Notificacao visivel={notificacao.visivel} mensagem={notificacao.mensagem} progresso={notificacao.progresso} onClose={notificacao.esconderNotificacao} onPausa={notificacao.pausarNotificacao} onDecorrer={notificacao.retomarNotificacao} />

            <div>
                <h1 className={`text-xs ${dark ? "text-gray-300" : "text-[#727171]"}`}>Contatos</h1>

                <ul className="flex flex-col gap-2.5 text-sm list-none">
                    <li title="Email" className="flex flex-row items-center gap-1.5 text-sm w-max">
                        <img className={`h-3.5 w-3.5 object-contain transition-all duration-300 ${dark ? "invert brightness-200" : "opacity-80 hover:opacity-100"}`} src={email} alt="Email" />

                        <button className={`hover:opacity-50 transition-all duration-150 cursor-pointer ${dark ? "text-white!" : ""}`} onClick={() => EmailCopiado(dadosContatos.email)}>
                            Email
                        </button>
                    </li>

                    {dadosContatos.redes.map((rede, index) => (
                        rede.nome && (
                            <li title={rede.nome} className="flex flex-row items-center gap-1.5 text-sm w-max" key={index}>
                                <img className="h-3.5 w-3.5" src={rede.imagem} alt={rede.nome} />

                                <button onClick={() => links(rede.link)} className="flex items-center gap-1.5 cursor-pointer" >
                                    <span className={` transition-all peer ${dark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}`}>
                                        {rede.nome}
                                    </span>

                                    <img className={`h-2.5 w-2.5 transition-all duration-300 opacity-20 peer-hover:opacity-100 peer-hover:scale-102 ${dark ? "invert" : ""}`} src={linkExterno} alt="link" />
                                </button>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        </>
    )
}