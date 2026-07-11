import { useState, useEffect } from "react";
import { redes, email } from "../../config/config";
import Notificacao from "../../components/notificacao/notificacao";
import fotoRyan from "/ryan.png";

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
            {mostrarNotificacao && <Notificacao mensagem={"E-mail copiado!"} className="p-3 text-sm rounded-lg md:rounded-r-lg border-l-6 bg-blue-100 text-blue-700 border-blue-700" />}

            <div className="flex flex-col items-center gap-6 mx-auto p-6 my-7">
                {/* Foto e Redes */}
                <div className="flex flex-col items-center text-center space-y-6 w-full">
                    <img loading="lazy" src={fotoRyan} alt="Foto de Ryan Cunha" className="w-48 rounded-full object-cover" />

                    <div className="flex flex-wrap justify-center gap-4 bg-[#18181B] p-2 rounded-sm">
                        {redes?.map((rede, index) => (
                            <a title={rede.label} className="h-8 w-8" key={index} href={rede.url} target="_blank" rel="noopener noreferrer">
                                <img src={rede.icon} alt={rede.label} alt={`Acessar meu perfil no ${rede.label}`} />
                            </a>
                        ))}

                        <button title="Copiar Email" onClick={copiarEmail} className="px-1 cursor-pointer bg-white rounded text-lg">📧</button>
                    </div>
                </div>

                {/* Biografia */}
                <div className="w-full space-y-4 max-w-3xl text-left">
                    <style>{`
                            @keyframes wave { 
                                0%, 
                                100% { transform: rotate(0deg); } 
                                50% { transform: rotate(15deg); }
                            }
                    `}</style>

                    <h1 className="text-3xl text-left font-bold tracking-tight">Olá, eu sou o <span className="bg-amber-100 text-gray-800 px-1 rounded">Ryan</span>
                        <span className="inline-block ml-2" style={{ animation: "wave 1s ease-in-out infinite", transformOrigin: "70% 70%" }}>
                            👋
                        </span>
                    </h1>

                    <h2 className="text-xl font-semibold ">Sou <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">desenvolvedor Full-Stack</span> e em <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">automações</span>. Este é o espaço onde compartilho meus projetos, estudos e como traduzo visões em valor de mercado.</h2>

                    <h3 className="ml-2 font-semibold text-lg">🛠️ Minha Metodologia</h3>
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

                    <h3 className="ml-2 font-semibold text-lg">🌱 O Começo</h3>
                    <p className="leading-relaxed text-lg">
                        Meu interesse pelo desenvolvimento surgiu de forma espontânea. Meu
                        irmão fazia um curso de front-end e ao acompanhar seus estudos, despertei curiosidade pela área.
                        A curiosidade rapidamente virou interesse, comecei pelo{" "}
                        <span className="bg-amber-100 text-gray-800 px-1 rounded font-medium">
                            Front-end
                        </span> e fui evoluindo naturalmente.
                    </p>

                    <h3 className="ml-2 font-semibold text-lg">
                        <span className="inline-block mr-1">
                            🎓
                        </span>
                        Formação e Evolução</h3>
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

                {/* CARROSEL DE TECNOLOGIA */}
            </div>
        </>
    )
}