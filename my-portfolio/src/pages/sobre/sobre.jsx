import { redes, email } from "../../config/config";
import ReadmeConteudo from "../../components/readme/readme";

export default function Sobre() {
    return (
        <div className="flex flex-col items-center gap-6 mx-auto p-6 max-w-4xl">
            <div data-aos="fade-down" className="flex flex-col md:flex-row items-center gap-8 w-full border border-[#232323] p-6 rounded-2xl">
                <img loading="lazy" fetchPriority="auto" height="192" width="192" src="https://github.com/ryancunhha.png?size=40" alt="Foto de Perfil GitHub de Ryan Cunha" className="w-40 h-40 rounded-xl" />

                <div className="flex flex-col items-center md:items-start justify-center flex-1 gap-5 w-full text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Ryan Cunha</h2>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full">
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

            <ReadmeConteudo usuario="ryancunhha" repositorio="ryancunhha" />
        </div>
    )
}