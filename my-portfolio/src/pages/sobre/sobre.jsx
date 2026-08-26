import { useState, useEffect } from "react";
import { redes, email } from "../../config/config";
import ReadmeConteudo from "../../components/readme/readme";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { buscarReadme } from "../../services/repoSobre";

export default function Sobre() {
    const [readmeHtml, setReadmeHtml] = useState("");

    useEffect(() => {
        const carregarReadme = async () => {
            const resultado = await buscarReadme();
            if (resultado) {
                setReadmeHtml(resultado);
            }
        };

        carregarReadme();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center gap-6 mx-auto p-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full bg-[#121212]/50 border border-[#232323] p-6 rounded-2xl backdrop-blur-sm">
                    <img loading="lazy" height="192" width="192" src="https://github.com/ryancunhha.png?size=40" alt="Foto de Perfil GitHub de Ryan Cunha" className="w-40 h-40 rounded-xl object-cover border border-[#2e2e2e] shrink-0" />

                    <div className="flex flex-col items-center sm:items-start justify-center flex-1 gap-5 w-full text-center sm:text-left">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Ryan Cunha</h2>
                            <p className="text-[#8B8B94] text-sm mt-0.5">Desenvolvedor Web / Full Stack</p>
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 w-full">
                            {redes?.map((rede, index) => (
                                <a key={index} href={rede.url} target="_blank" rel="noopener noreferrer" title={rede.label} className="flex h-10 px-4 gap-2.5 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-sm text-[#CCCCCC] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                    <img src={rede.icon} alt={`Ícone ${rede.label}`} className="h-5 w-5 object-contain" height="20" width="20" />
                                    <span className="font-medium">{rede.label}</span>
                                </a>
                            ))}
                        </div>

                        <a className="text-sm font-medium text-[#999] hover:text-white transition-colors underline underline-offset-4" href={`mailto:${email}`}>
                            {email}
                        </a>
                    </div>
                </div>

                {readmeHtml && <ReadmeConteudo markdown={readmeHtml} />}
            </div>
        </>
    )
}