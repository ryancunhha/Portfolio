import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obterProjetosGithubPessoal, obterProjetosGithubOrganizacao } from "../../services/repoGitHub";

export default function BannerGithub() {
    const [projeto, setProjeto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function buscarUltimoProjeto() {
            try {
                const [projetosPessoais, projetosOrg] = await Promise.all([
                    obterProjetosGithubPessoal(controller.signal),
                    obterProjetosGithubOrganizacao(controller.signal)
                ]);

                const todosProjetos = [...projetosPessoais, ...projetosOrg];

                if (todosProjetos.length > 0) {
                    const dataAtual = new Date();
                    const duasSemanasEmMs = 14 * 24 * 60 * 60 * 1000;
                    const umMesEmMs = 30 * 24 * 60 * 60 * 1000;

                    const projetosNoPeriodo = todosProjetos.filter(proj => {
                        const dataDoProjeto = new Date(Number(proj.data.ano), Number(proj.data.mes) - 1);
                        const tempoPassado = dataAtual.getTime() - dataDoProjeto.getTime();

                        return tempoPassado >= duasSemanasEmMs && tempoPassado <= umMesEmMs;
                    });

                    const ordenarPorData = (a, b) => {
                        const anoA = Number(a.data.ano);
                        const mesA = Number(a.data.mes);
                        const anoB = Number(b.data.ano);
                        const mesB = Number(b.data.mes);

                        if (anoA !== anoB) {
                            return anoB - anoA;
                        }

                        return mesB - mesA;
                    };

                    if (projetosNoPeriodo.length > 0) {
                        const projetosOrdenados = projetosNoPeriodo.sort(ordenarPorData);
                        setProjeto(projetosOrdenados[0]);
                    } else {
                        const projetosOrdenadosGerais = todosProjetos.sort(ordenarPorData);
                        setProjeto(projetosOrdenadosGerais[0]);
                    }
                }
            } catch (error) {
                if (error.name !== "AbortError") console.error("Erro no Banner Github:", error);
            } finally {
                setLoading(false);
            }
        }

        buscarUltimoProjeto();
        return () => controller.abort();
    }, []);

    if (loading) {
        return <div className="flex flex-col h-100 w-full bg-white animate-pulse" />
    }

    if (!projeto) return null;

    return (
        <div className="w-full flex flex-col md:flex-row h-100">
            <div className="flex-1 p-3 md:p-10 flex flex-col justify-between items-start md:gap-6 bg-zinc-950">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex gap-2 items-center justify-between w-full border-b border-zinc-800 pb-3">
                        <span className="text-white font-black px-3 py-1 text-[11px] uppercase tracking-widest">// atualizado recentemente</span>
                        <span className="text-zinc-400 font-mono text-xs uppercase tracking-wider">{projeto.atualizado}</span>
                    </div>

                    <p className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mt-2">{projeto.name.replace(/-/g, " ")}</p>

                    <p className="text-zinc-400 text-sm md:text-base font-sans line-clamp-2">Acesse o código fonte completo e a documentação.</p>
                </div>

                <div className="w-full flex flex-row items-center justify-between gap-4 md:pt-4">
                    {projeto.topicos && projeto.topicos.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {projeto.topicos.slice(0, 3).map(topico => (
                                <span key={topico} className="text-[10px] font-mono font-bold uppercase bg-zinc-900 text-zinc-300 px-2.5 py-1 border border-zinc-800">
                                    #{topico}
                                </span>
                            ))}
                        </div>
                    ) : null}

                    <Link to={`/projetos/${projeto.id}`} className="w-auto px-6 py-3 bg-white text-zinc-950 font-black text-xs uppercase tracking-widest hover:bg-zinc-950 hover:text-white transition-colors text-center">ACESSAR  →</Link>
                </div>
            </div>

            <div className="bg-zinc-900 p-8 flex flex-col items-center justify-center">
                <div className="relative z-10 text-center flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">TECNOLOGIA</span>
                    <span className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">{projeto.language || "CODE"}</span>
                    <div className="w-12 h-1 bg-yellow-400 mt-4" />
                </div>
            </div>
        </div>
    )
}