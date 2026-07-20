import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BANNERS } from "../../config/config";

export default function TelaInicial() {
    const [indexAtual, setIndexAtual] = useState(0);
    const [rodando, setRodando] = useState(true);
    const [direcao, setDirecao] = useState("direita");
    const totalBanners = BANNERS ? BANNERS.length : 0;
    const ComponenteBanner = (totalBanners > 0 && BANNERS[indexAtual]) ? BANNERS[indexAtual] : null;

    useEffect(() => {
        if (!rodando || totalBanners <= 1) return
        const interval = setInterval(() => {
            setIndexAtual((prev) => {
                const proximo = (prev + 1) % BANNERS.length

                if (proximo === 0) {
                    setDirecao("esquerda");
                } else {
                    setDirecao("direita");
                }

                return proximo;
            })
        }, 7500);
        return () => clearInterval(interval);
    }, [rodando, totalBanners]);

    const proximoBanner = () => {
        if (totalBanners === 0) return;
        setDirecao("direita");
        setIndexAtual((prev) => (prev + 1) % BANNERS.length)
        setRodando(false)
    }

    const bannerAnterior = () => {
        if (totalBanners === 0) return;
        setDirecao("esquerda");
        setIndexAtual((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)
        setRodando(false)
    }

    return (
        <>
            <section className="flex flex-col items-center px-4 pt-8 justify-center">
                <div className="flex flex-col items-center gap-3 mb-3 max-w-3xl text-center">
                    <h1 className="leading-tight brightness-120 text-[7.5vw] sm:text-4xl md:text-6xl font-extrabold tracking-tight uppercase bg-linear-to-r from-slate-400 via-slate-600 to-slate-700 bg-clip-text text-transparent">Menos complexidade. Mais escala.</h1>
                    <Link className="mt-2 py-2 px-8 border-2 rounded-full text-sm font-semibold tracking-wide" to="/projetos">Ver Projetos</Link>
                </div>

                {/* BANNER */}
                <div className="w-full">
                    {totalBanners > 0 ? (
                        <div className="w-full h-100 overflow-hidden">
                            <div key={indexAtual} className={indexAtual === 0 && direcao === "direita" && rodando ? "" : (direcao === "direita" ? "animacao-direita" : "animacao-esquerda")}>
                                {ComponenteBanner && <ComponenteBanner />}
                            </div>
                        </div>
                    ) : (
                        null
                    )}

                    {/* Controles */}
                    {totalBanners > 1 &&
                        <div className="w-full flex justify-between items-center pt-2 px-4 select-none">
                            <button title="Anterior" onClick={bannerAnterior} className="p-2 px-4 border-2 rounded-full cursor-pointer">❮</button>

                            <div className="flex items-center gap-1">
                                {/* VISUAL */}
                                <div className="flex flex-wrap gap-1">
                                    {BANNERS.map((_, index) => (
                                        <div key={index} className={`h-0.5 w-7 rounded-full ${index === indexAtual ? " bg-[#2A446F]" : "bg-[#E5ECF1]"}`} />
                                    ))}
                                </div>

                                {/* Botão Play/Pausa */}
                                <button title={rodando ? "Pausar" : "Play"} onClick={() => setRodando(!rodando)} className="border-2 rounded cursor-pointer px-1">
                                    {rodando ? "❚❚" : "▶︎"}
                                </button>
                            </div>

                            <button title="Avançar" onClick={proximoBanner} className="p-2 px-4 border-2 rounded-full cursor-pointer">❯</button>
                        </div>
                    }
                </div>
            </section>

            {/* Projetos */}
            <section className="flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full">
                <h2 className="text-center font-bold text-2xl tracking-tight">Como posso te ajudar?</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Card Automações */}
                    <div className="flex gap-4 border-y border-slate-300 flex-col items-start justify-between w-full p-6">
                        <div className="flex flex-wrap gap-3 justify-between items-start w-full">
                            <div className="bg-[#FFDE57]/10 p-3 rounded-xl">
                                <img src="https://img.icons8.com/color/48/python--v1.png" width="40" height="40" alt="Python" className="object-contain h-8 w-8" loading="lazy" decoding="async" />
                            </div>

                            <Link aria-label="Filtrar projetos por automação" className="mt-1 py-2.5 px-5 border rounded-full text-xs font-medium border-slate-300" to={"/projetos?search=automacao"}>Ver exemplos</Link>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg tracking-tight">Automações</h3>
                            <p className="tracking-tight text-sm text-[#888]">Automatize processos, elimine tarefas repetitivas e economize horas de trabalho.</p>
                        </div>
                    </div>

                    {/* Card Mobile */}
                    <div className="flex gap-4 border-y border-slate-300 flex-col items-start justify-between w-full p-6">
                        <div className="flex flex-wrap gap-3 justify-between items-start w-full">
                            <div className="bg-[#61DAFB]/10 p-3 rounded-xl">
                                <img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/90/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" alt="React-Native" width="40" height="40" className="object-contain h-8 w-8" loading="lazy" decoding="async" />
                            </div>

                            <Link aria-label="Filtrar projetos por mobile" className="mt-1 py-2.5 px-5 border rounded-full text-xs font-medium border-slate-300" to={"/projetos?search=mobile"}>Ver exemplos</Link>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg tracking-tight">Aplicativos Mobile</h3>
                            <p className="tracking-tight text-sm text-[#888]">Sua ideia direto no bolso dos clientes com apps modernos e fluidos para iOS e Android.</p>
                        </div>
                    </div>

                    {/* Card Web */}
                    <div className="flex gap-4 border-y border-slate-300 flex-col items-start justify-between w-full p-6">
                        <div className="flex flex-wrap gap-3 justify-between items-start w-full">
                            <div className="bg-[#E34C26]/10 p-3 rounded-xl">
                                <img src="https://img.icons8.com/color/48/html-5--v1.png" alt="HTML" className="object-contain h-8 w-8" width="40" height="40" loading="lazy" decoding="async" />
                            </div>

                            <Link aria-label="Filtrar projetos por Web" className="mt-1 py-2.5 px-5 border rounded-full text-xs font-medium border-slate-300" to={"/projetos?search=web"}>Ver exemplos</Link>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg tracking-tight">Aplicações Web</h3>
                            <p className="tracking-tight text-sm text-[#888]">Criação de sites institucionais, landing pages e plataformas web rápidas e responsivas.</p>
                        </div>
                    </div>

                    {/* Card Full */}
                    <div className="bg-slate-950 flex flex-col md:flex-row items-center justify-between w-full lg:col-span-3 rounded-2xl p-8 gap-6 text-white shadow-xl relative overflow-hidden mt-2">
                        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col items-start gap-3 max-w-xl z-2">
                            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Mais Solicitado</span>
                            <h3 className="font-bold text-2xl md:text-3xl tracking-tight">Desenvolvimento Full-Stack (Front & Back)</h3>
                            <p className="tracking-tight text-sm text-[#888]">Sistemas web completos. Do design, performance, segurança até a arquitetura do banco de dados do sistema.</p>
                            <Link className="mt-2 p-2.5 px-5 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-colors text-xs font-semibold shadow-sm" to={"/solicitacao"}>Iniciar meu projeto</Link>
                        </div>

                        <div className="flex items-center justify-center relative w-32 h-32 md:w-40 md:h-40 z-2">
                            <img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/90/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" alt="React" width="40" height="40" className="w-full h-full object-contain brightness-110 drop-shadow-[0_0_15px_rgba(97,218,251,0.3)] animate-[spin_20s_linear_infinite]" loading="lazy" decoding="async" />
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
                        <img width="40" height="40" className="object-contain" src="https://img.icons8.com/external-kmg-design-flat-kmg-design/50/external-shield-protection-and-security-kmg-design-flat-kmg-design.png" alt="" loading="lazy" decoding="async" />
                        <p className="font-bold tracking-tight text-sm">Sistemas Seguros</p>
                    </div>

                    <div className="p-4 py-6 flex flex-col gap-3 justify-center items-center rounded-2xl bg-black/10 text-center h-full">
                        <img width="40" height="40" className="object-contain" src="https://img.icons8.com/fluency/48/group-task.png" alt="" loading="lazy" decoding="async" />
                        <p className="font-bold tracking-tight text-sm">Suporte a Dúvidas</p>
                    </div>

                    <div className="p-4 py-6 flex flex-col gap-3 justify-center items-center rounded-2xl bg-black/10 text-center h-full">
                        <img width="40" height="40" className="object-contain" src="https://img.icons8.com/fluency/48/support.png" alt="" loading="lazy" decoding="async" />
                        <p className="font-bold tracking-tight text-sm">Atualizações</p>
                    </div>
                </div>
            </section>
        </>
    );
}