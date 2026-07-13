import { useState, useEffect } from "react";
import { redes, email } from "../../config/config";
import Notificacao from "../../components/notificacao/notificacao";

export default function Sobre() {
    const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

    const copiarEmail = () => {
        navigator.clipboard.writeText(email);
        setMostrarNotificacao(true);
    };

    useEffect(() => {
        if (!mostrarNotificacao) return;
        const timer = setTimeout(() => setMostrarNotificacao(false), 3500);
        return () => clearTimeout(timer);
    }, [mostrarNotificacao]);

    return (
        <>
            {mostrarNotificacao && (
                <Notificacao mensagem={"E-mail copiado!"} className="p-4 text-md rounded-lg border-l-6 bg-blue-100 text-blue-700 border-blue-700" />
            )}

            <div className="flex flex-col items-center gap-6 mx-auto p-6 my-7 max-w-4xl">
                <div className="flex flex-col items-center text-center space-y-6 w-full">
                    <img loading="lazy" height="192" width="192" src="/ryan.png" alt="Foto de Ryan Cunha" className="w-48 h-48 rounded-full object-cover border-6 border-white" />

                    <div className="flex flex-wrap justify-center gap-4 bg-[#18181B] p-2 rounded-sm">
                        {redes?.map((rede, index) => (
                            <a key={index} href={rede.url} target="_blank" rel="noopener noreferrer" title={rede.label}>
                                <img src={rede.icon} alt={`Acessar meu perfil no ${rede.label}`} className="h-8 w-8" height="32" width="32" />
                            </a>
                        ))}

                        <button title="Copiar Email" onClick={copiarEmail} className="px-1 cursor-pointer bg-white rounded text-lg">📧</button>
                    </div>
                </div>

                {/* Biografia */}
                <div className="w-full space-y-4 text-left">
                    <h1 className="text-3xl text-left font-bold tracking-tight">Olá, eu sou o Ryan
                        <span className="inline-block ml-2 animate-wave-hand">👋</span>
                    </h1>

                    <h2 className="text-xl font-semibold ">Sou <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">desenvolvedor Full-Stack</span> e em <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">automações</span>. Este é o espaço onde compartilho meus projetos, estudos e como traduzo visões em valor de mercado.</h2>

                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
                        <h3 className="font-semibold text-xl">🛠️ Minha Metodologia</h3>
                    </div>
                    <p className="leading-relaxed text-lg">
                        Gosto de criar projetos organizados, focados em{" "}
                        <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">
                            reutilização de código
                        </span>
                        ,{" "}
                        <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">
                            escalabilidade
                        </span> e{" "}
                        <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">facilidade de manutenção</span>. Os projetos apresentados neste portfólio refletem a forma como penso, organizo e desenvolvo soluções.
                    </p>

                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
                        <h3 className="font-semibold text-xl">🌱 O Começo</h3>
                    </div>
                    <p className="leading-relaxed text-lg">
                        Meu interesse pelo desenvolvimento surgiu de forma espontânea. Meu
                        irmão fazia um curso de front-end e ao acompanhar seus estudos, despertei curiosidade pela área.
                        A curiosidade rapidamente virou interesse, comecei pelo{" "}
                        <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">
                            Front-end
                        </span> e fui evoluindo naturalmente.
                    </p>

                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
                        <h3 className="font-semibold text-xl">🎓 Formação e Evolução</h3>
                    </div>
                    <p className="leading-relaxed text-lg">
                        Com o tempo, decidi ingressar na graduação de{" "}
                        <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">
                            Análise e Desenvolvimento de Sistemas (ADS)
                        </span>{" "}
                        no IBMR (Barra da Tijuca), conquistando uma bolsa de 100% por meio do ENEM. Durante essa jornada, me interessei por{" "}
                        <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">
                            Back-end, Bancos de dados e Automações
                        </span>
                        , áreas que hoje fazem parte do meu dia a dia nos estudos e no desenvolvimento dos meus projetos.
                    </p>
                </div>
            </div>
        </>
    )
}