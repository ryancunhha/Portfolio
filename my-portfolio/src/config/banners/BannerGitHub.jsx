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

                const todosProjetos = [...(projetosPessoais || []), ...(projetosOrg || [])];

                if (todosProjetos.length > 0) {
                    const extrairTimestamp = (proj) => {
                        if (proj.data?.ano && proj.data?.mes) {
                            const ano = Number(proj.data.ano);
                            const mes = Number(proj.data.mes) - 1;
                            const dia = Number(proj.data.dia || 1);
                            return new Date(ano, mes, dia).getTime();
                        }
                        
                        const dataIso = proj.pushed_at || proj.updated_at || proj.created_at;
                        return dataIso ? new Date(dataIso).getTime() : 0;
                    };

                    const projetosOrdenados = todosProjetos.sort((a, b) => extrairTimestamp(b) - extrairTimestamp(a));

                    setProjeto(projetosOrdenados[0]);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Erro no Banner Github:", error);
                }
            } finally {
                setLoading(false);
            }
        }

        buscarUltimoProjeto();
        return () => controller.abort();
    }, []);

    if (loading) {
        return <div className="flex flex-col h-100 w-full bg-white animate-pulse" />;
    }

    if (!projeto) return null;

    return (
        <div className="w-full flex flex-col md:flex-row h-100">
            <div className="flex-1 p-3 md:p-10 flex flex-col justify-between items-start md:gap-6 bg-zinc-950">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex gap-2 items-center justify-between w-full border-b border-zinc-800 pb-3">
                        <span className="text-white font-black px-3 py-1 text-[11px] uppercase tracking-widest">{projeto.atualizado}</span>
                    </div>

                    <p className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mt-2">{projeto.name.replace(/-/g, " ")}</p>

                    <p className="text-zinc-400 text-sm md:text-base font-sans line-clamp-2">Acesse o código fonte completo e a documentação.</p>
                </div>

                <div className="w-full flex flex-row items-center justify-between gap-4 md:pt-4">
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