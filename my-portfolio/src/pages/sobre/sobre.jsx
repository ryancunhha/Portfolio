import { useState, useEffect } from "react";
import { redes, email } from "../../config/config";
import { notificar } from "../../components/notificacao/notificacao";
import ReadmeConteudo from "../../components/readme/readme";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { buscarReadme } from "../../services/repoSobre";

export default function Sobre() {
    const [readmeHtml, setReadmeHtml] = useState("");

    const copiarEmail = () => {
        navigator.clipboard.writeText(email);
        notificar({
            texto: "✅ E-mail copiado!",
            tipo: "sucesso",
        });
    };

    useEffect(() => {
        const carregarReadme = async () => {
            const resultado = await buscarReadme();

            if (!resultado) return;

            const html = marked.parse(resultado);
            const htmlLimpo = DOMPurify.sanitize(html);

            setReadmeHtml(htmlLimpo);
        };

        carregarReadme();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center gap-6 mx-auto p-6 my-7 max-w-4xl">
                <div className="flex flex-row rounded-xl items-center text-center space-y-6 w-full">
                    <img loading="lazy" height="192" width="192" src="https://github.com/ryancunhha.png?size=40" alt="Foto de Perfil GitHub de Ryan Cunha" className="w-48 h-48 rounded-md object-cover transition-transform" />

                    <div className="flex flex-wrap justify-center gap-4 mx-5">
                        {redes?.map((rede, index) => (
                            <a className="flex h-11 px-4 gap-2 items-center justify-center rounded-lg bg-white/5" key={index} href={rede.url} target="_blank" rel="noopener noreferrer" title={rede.label}>
                                <img src={rede.icon} alt={`Acessar meu perfil no ${rede.label}`} className="h-7 w-7 object-contain" height="32" width="32" />
                                <span>{rede.label}</span>
                            </a>
                        ))}

                        <button title="Copiar Email" onClick={copiarEmail} className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/5 px-4">
                            <span className="text-xl">📧</span>
                            <span className="text-sm">Email</span>
                        </button>
                    </div>
                </div>

                {readmeHtml && <ReadmeConteudo html={readmeHtml} />}
            </div>
        </>
    )
}