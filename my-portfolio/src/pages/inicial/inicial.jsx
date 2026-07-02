import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BACK from "/Background.webp";

const FRASES = [
    "Menos processos manuais, mais tempo para crescer.",
    "Aquela planilha chata? Eu automatizo para você.",
    "Seu app nas lojas, seus clientes conectados.",
    "Do código ao produto final.",
    "Sistemas sob medida para a sua empresa.",
    "Crie, Transforme, Conecte, Escale e Automatize",
];

export default function TelaInicial() {
    const [textoAtual, setTextoAtual] = useState("");
    const [fraseIndex, setFraseIndex] = useState(0);
    const [estaApagando, setEstaApagando] = useState(false);

    useEffect(() => {
        const fraseCompleta = FRASES[fraseIndex];
        const velocidade = estaApagando ? 10 : 100;

        const temporizador = setTimeout(() => {
            if (!estaApagando) {
                setTextoAtual(fraseCompleta.substring(0, textoAtual.length + 1));

                if (textoAtual === fraseCompleta) {
                    setTimeout(() => setEstaApagando(true), 1500);
                }
            } else {
                setTextoAtual(fraseCompleta.substring(0, textoAtual.length - 1));

                if (textoAtual === "") {
                    setEstaApagando(false);
                    setFraseIndex((prev) => (prev + 1) % FRASES.length);
                }
            }
        }, velocidade);

        return () => clearTimeout(temporizador);
    }, [textoAtual, estaApagando, fraseIndex]);

    return (
        <>
            <section className="flex flex-col items-center p-4 gap-6 justify-center">
                <div className="flex flex-col items-center pt-0 md:pt-8 gap-3 text-center">
                    <h1 className="brightness-120 text-3xl md:text-5xl font-extrabold tracking-tight uppercase bg-linear-to-r from-slate-400 via-slate-600 to-slate-700 bg-clip-text text-transparent">Menos complexidade. Mais escala.</h1>
                    <Link className="mt-2 p-1.5 px-8 border-2 rounded-full bg-transparent hover:bg-black/10 text-sm font-semibold" to="/solicitacao">Contate-me</Link>
                </div>

                <div className="relative flex items-center justify-center w-full h-90 overflow-hidden rounded-2xl select-none">
                    <img className="absolute w-full h-full object-cover brightness-40" height="100" src={BACK} fetchPriority="high" loading="eager" alt="" decoding="async" />

                    <p className="relative font-semibold text-[32px] italic tracking-tighter text-white text-center">
                        {textoAtual}
                    </p>
                </div>
            </section>

            {/* Projetos */}
            <section className="flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full">
                <h2 className="text-center font-bold text-2xl tracking-tight">Como posso te ajudar?</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Card Automações */}
                    <div className="flex gap-4 border-y border-slate-300 flex-col items-start justify-between w-full p-6">
                        <div className="flex justify-between items-start w-full">
                            <div className="bg-[#FFDE57]/10 p-3 rounded-xl">
                                <img src="https://img.icons8.com/color/48/python--v1.png" width="40" height="40" alt="Python" className="object-contain" loading="lazy" decoding="async" />
                            </div>

                            <Link className="p-1 px-3 border rounded-full bg-transparent text-xs font-medium border-slate-300" to={"/projetos?search=automacao"}>Ver exemplos</Link>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-bold text-lg tracking-tight">Automações</h3>
                            <p className="tracking-tight text-sm text-[#888] mt-1">Agilize processos, otimize rotinas e ganhe tempo no seu trabalho diário.</p>
                        </div>
                    </div>

                    {/* Card Mobile */}
                    <div className="flex gap-4 border-y border-slate-300 flex-col items-start justify-between w-full p-6">
                        <div className="flex justify-between items-start w-full">
                            <div className="bg-[#61DAFB]/10 p-3 rounded-xl">
                                <img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/90/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" alt="React-Native" width="40" height="40" className="object-contain" loading="lazy" decoding="async" />
                            </div>

                            <Link className="p-1 px-3 border rounded-full bg-transparent text-xs font-medium border-slate-300" to={"/projetos?search=mobile"}>Ver exemplos</Link>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-bold text-lg tracking-tight">Aplicativos Mobile</h3>
                            <p className="tracking-tight text-sm text-[#888] mt-1">Sua ideia direto no bolso dos clientes com apps modernos e fluidos para iOS e Android.</p>
                        </div>
                    </div>

                    {/* Card Web */}
                    <div className="flex gap-4 border-y border-slate-300 flex-col items-start justify-between w-full p-6">
                        <div className="flex justify-between items-start w-full">
                            <div className="bg-[#E34C26]/10 p-3 rounded-xl">
                                <img src="https://img.icons8.com/color/48/html-5--v1.png" alt="HTML" className="object-contain" width="40" height="40" loading="lazy" decoding="async" />
                            </div>

                            <Link className="p-1 px-3 border rounded-full bg-transparent text-xs font-medium border-slate-300" to={"/projetos?search=web"}>Ver exemplos</Link>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-bold text-lg tracking-tight">Aplicações Web</h3>
                            <p className="tracking-tight text-sm text-[#888] mt-1">Criação de sites institucionais, landing pages e plataformas web rápidas e responsivas.</p>
                        </div>
                    </div>

                    {/* Card Full */}
                    <div className="bg-slate-950 flex flex-col md:flex-row items-center justify-between w-full lg:col-span-3 rounded-2xl p-8 gap-6 text-white shadow-xl relative overflow-hidden mt-2">
                        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col items-start gap-3 max-w-xl z-2">
                            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Mais Solicitado</span>
                            <h3 className="font-bold text-2xl md:text-3xl tracking-tight">Desenvolvimento Full-Stack (Front & Back)</h3>
                            <p className="tracking-tight text-sm text-[#888]">Sistemas web completos. Do design de interface à arquitetura de banco de dados, garantindo performance e escala na internet.</p>
                            <Link className="mt-2 p-2 px-5 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-colors text-xs font-semibold shadow-sm" to={"/solicitacao"}>Iniciar meu projeto</Link>
                        </div>

                        <div className="flex items-center justify-center relative w-32 h-32 md:w-40 md:h-40 z-2">
                            <img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/90/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" alt="React" width="40" height="40" className="select-none w-full h-full object-contain brightness-110 drop-shadow-[0_0_15px_rgba(97,218,251,0.3)] animate-[spin_20s_linear_infinite]" loading="lazy" decoding="async" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Por que contratar */}
            <section className="p-4 max-w-6xl mx-auto w-full">
                <h2 className="text-center font-bold text-2xl mb-6 tracking-tight">Por que contratar meu serviço?</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                    <div className="p-4 py-6 flex flex-col gap-3 justify-center items-center rounded-2xl bg-black/10 text-center h-full">
                        <img width="40" height="40" className="object-contain" src="https://img.icons8.com/isometric/50/box.png" alt="" loading="lazy" decoding="async" />
                        <p className="font-bold tracking-tight text-sm">Entrega Rápida</p>
                    </div>

                    <div className="p-4 py-6 flex flex-col gap-3 justify-center items-center rounded-2xl bg-black/10 text-center h-full">
                        <img width="40" height="40" className="object-contain" src="https://img.icons8.com/color/48/broom.png" alt="" loading="lazy" decoding="async" />
                        <p className="font-bold tracking-tight text-sm">Código Limpo e Escalável</p>
                    </div>

                    <div className="p-4 py-6 flex flex-col gap-3 justify-center items-center rounded-2xl bg-black/10 text-center h-full">
                        <img width="40" height="40" className="object-contain" src="https://img.icons8.com/doodle-line/60/online-support--v1.png" alt="" loading="lazy" decoding="async" />
                        <p className="font-bold tracking-tight text-sm">Suporte</p>
                    </div>

                    <div className="p-4 py-6 flex flex-col gap-3 justify-center items-center rounded-2xl bg-black/10 text-center h-full">
                        <img width="40" height="40" className="object-contain" src="https://img.icons8.com/fluency/48/support.png" alt="" loading="lazy" decoding="async" />
                        <p className="font-bold tracking-tight text-sm">Manutenção</p>
                    </div>
                </div>
            </section>
        </>
    );
}