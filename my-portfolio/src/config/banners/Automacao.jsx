import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BannerAutomacao() {
    const [status, setStatus] = useState("Processando pedido...");
    const [progresso, setProgresso] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setProgresso((prev) => {
                if (prev >= 100) {
                    setStatus("Projeto concluido!");
                    return 100;
                }
                return prev + 20;
            });
        }, 300);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="rounded-2xl flex flex-col md:grid md:grid-cols-2 h-100 w-full bg-gradient-to-br from-[#0d0e12] to-[#1a1c23] border border-gray-800 overflow-hidden text-white">
            <div className="hidden md:flex flex-1 flex-col gap-4 select-none p-6 justify-center bg-[#14161d]/50 h-full">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-[#14161d] px-3 py-1.5 rounded-t-lg w-fit border-t border-x border-gray-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Automacao.py
                </div>

                <div className="font-mono text-xs bg-[#14161d] p-5 rounded-r-xl rounded-bl-xl border border-gray-800 leading-relaxed overflow-x-auto">
                    <span className="text-purple-400">import</span> <span className="text-blue-400">automacoes</span>
                    <br /><br />
                    <span className="text-purple-400">def</span> <span className="text-yellow-400">main</span>():
                    <br />
                    <span className="text-green-500 block pl-4 my-1 font-semibold italic">
                        # Aquela planilha chata? Eu automatizo para você.
                    </span>
                    <span className="text-blue-400 pl-4">planilha</span> = <span className="text-green-400">"trabalho.xlsx"</span>
                    <br />
                    <span className="text-blue-400 pl-4">automacoes</span>.<span className="text-yellow-400">grafico</span>(planilha)
                    <br /><br />
                    <span className="text-purple-400">if</span> <span className="text-blue-400">__name__</span> == <span className="text-green-400">"__main__"</span>:
                    <br />
                    <span className="text-yellow-400 pl-4">main</span>()
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between md:justify-center items-start p-5 sm:p-6 gap-4 h-full min-h-0 w-full">
                <div className="w-full shrink-0">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                        <p className="text-sm font-bold tracking-wider text-gray-400 uppercase">Status do Script</p>
                        <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full font-mono">v1.0.0</span>
                    </div>

                    <div className="font-mono text-sm space-y-3 py-3 w-full">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">&gt;</span>
                            <span className={progresso === 100 ? "text-green-400 transition-colors duration-300" : "text-gray-300"}>
                                {status}
                            </span>
                        </div>

                        <div className="w-full bg-gray-900 border border-gray-800 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 rounded-full to-green-400 h-2.5 transition-all duration-300" style={{ width: `${progresso}%` }} />
                        </div>
                    </div>
                </div>

                <div className="md:hidden w-full max-h-40 font-mono text-[11px] sm:text-xs bg-[#14161d] p-4 rounded-xl border border-gray-800 leading-relaxed overflow-auto flex-1 my-1">
                    <span className="text-purple-400">import</span> <span className="text-blue-400">automacoes</span>
                    <br /><br />
                    <span className="text-purple-400">def</span> <span className="text-yellow-400">main</span>():
                    <br />
                    <span className="text-green-500 block pl-4 my-1 font-semibold italic">
                        # Aquela planilha chata? Eu automatizo para você.
                    </span>
                    <span className="text-blue-400 pl-4">planilha</span> = <span className="text-green-400">"trabalho.xlsx"</span>
                    <br />
                    <span className="text-blue-400 pl-4">automacoes</span>.<span className="text-yellow-400">grafico</span>(planilha)
                    <br /><br />
                    <span className="text-purple-400">if</span> <span className="text-blue-400">__name__</span> == <span className="text-green-400">"__main__"</span>:
                    <br />
                    <span className="text-yellow-400 pl-4">main</span>()
                </div>

                <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-3 w-full flex-wrap shrink-0">
                    <p className="text-xs text-gray-400 max-w-50">Está esperando o quê? Faça já o seu pedido.</p>
                    <Link to="/solicitacao" className="text-xs font-bold bg-white text-black px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap ml-auto">Faça seu pedido</Link>
                </div>
            </div>

        </div>
    )
}