import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EsqueletoProjetos from "./projetosEsqueleto";
import { obterProjetosGithubPessoal, obterProjetosGithubOrganizacao } from "../../services/repoGitHub";
import { CardProjeto } from "../../components/cards/cards";

export default function Projeto() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [projetosPessoal, setProjetosPessoal] = useState([]);
    const [projetosOrg, setProjetosOrg] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroAtivo, setFiltroAtivo] = useState("Tudo");

    const todasCategorias = useMemo(() => {
        const todosOsProjetos = [...projetosPessoal, ...projetosOrg];
        const setCategorias = new Set(todosOsProjetos.flatMap(repo => repo.topicos || []));
        return ["Tudo", ...[...setCategorias].map(t => t.charAt(0).toUpperCase() + t.slice(1))];
    }, [projetosPessoal, projetosOrg]);

    const filtrarOrdenarProjetos = (listaProjetos) => {
        const buscaMinusculo = busca.toLowerCase().trim();
        const filtroMinusculo = filtroAtivo.toLowerCase();

        const filtrados = listaProjetos.filter((repo) => {
            if (!repo) return false;
            const matchesFiltroBotao = filtroAtivo === "Tudo" || (repo.topicos && repo.topicos.map(t => t.toLowerCase()).includes(filtroMinusculo));
            const matchesInput = !buscaMinusculo || (repo.name && repo.name.toLowerCase().includes(buscaMinusculo)) || (repo.topicos && repo.topicos.some(t => t.toLowerCase().includes(buscaMinusculo)));

            return matchesFiltroBotao && matchesInput;
        });

        const checarAtualizado = (repo) => {
            const temNaTag = repo.topicos && repo.topicos.some(t => t.toLowerCase().includes("atualizado"));
            const temNaPropriedadeString = typeof repo.atualizado === 'string' && repo.atualizado.toLowerCase().includes("atualizado");
            const temNaPropriedadeBool = repo.atualizado === true;
            return temNaTag || temNaPropriedadeString || temNaPropriedadeBool;
        };

        return filtrados.sort((a, b) => {
            const temAtualizadoA = checarAtualizado(a);
            const temAtualizadoB = checarAtualizado(b);

            if (temAtualizadoA && !temAtualizadoB) return -1;
            if (!temAtualizadoA && temAtualizadoB) return 1;
            return 0;
        });
    };

    const projetosPessoalFiltrados = useMemo(() => filtrarOrdenarProjetos(projetosPessoal), [projetosPessoal, busca, filtroAtivo]);
    const projetosOrgFiltrados = useMemo(() => filtrarOrdenarProjetos(projetosOrg), [projetosOrg, busca, filtroAtivo]);
    const projetosOrgExibidos = useMemo(() => projetosOrgFiltrados.slice(0), [projetosOrgFiltrados]);

    useEffect(() => {
        const querySearch = searchParams.get("search") || "";
        if (querySearch !== busca) setBusca(querySearch);
    }, [searchParams]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (busca) {
                setSearchParams({ search: busca }, { replace: true });
            } else {
                const novosParams = new URLSearchParams(searchParams);
                novosParams.delete("search");
                setSearchParams(novosParams, { replace: true });
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [busca, setSearchParams]);

    useEffect(() => {
        let montado = true;
        const controller = new AbortController();

        async function CarregarDados(params) {
            try {
                const [dadosPessoal, dadosOrg] = await Promise.all([
                    obterProjetosGithubPessoal(controller.signal),
                    obterProjetosGithubOrganizacao(controller.signal)
                ]);

                if (montado) {
                    setProjetosPessoal(dadosPessoal || []);
                    setProjetosOrg(dadosOrg || []);
                }
            } catch (error) {
                console.error("Erro ao buscar projetos:", error);
            } finally {
                if (montado) setCarregando(false);
            }
        }

        CarregarDados()

        return () => {
            montado = false;
            controller.abort();
        };
    }, []);

    if (carregando) return <EsqueletoProjetos />

    return (
        <>
            <div className="top-0 z-2 transition-colors duration-200 flex flex-col items-center px-4 pt-4 pb-2">
                <div className="flex items-center w-full max-w-xl border-2 border-[#888] rounded-lg">
                    <input maxLength="30" id="pesquisa" name="pesquisa" className="text-lg h-11 px-4 placeholder-[#888] outline-none w-full" type="search" placeholder="Pesquisar" value={busca} onChange={(e) => { setBusca(e.target.value); }} />
                    <p className="px-4 border-l">🔍</p>
                </div>

                <div className="w-full flex flex-row gap-2 mt-3 overflow-x-auto whitespace-nowrap scrollbar-hide structural-tabs">
                    {todasCategorias.map((categoria) => (
                        <button key={categoria} onClick={() => { setFiltroAtivo(categoria); }} className={`px-4 py-2.5 md:py-1 mb-2 rounded-md font-medium cursor-pointer shrink-0 ${filtroAtivo === categoria ? "bg-white text-black" : "bg-zinc-800 text-white"}`}>
                            {categoria}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {projetosOrgExibidos.length === 0 && projetosPessoalFiltrados.length === 0 ? (
                    <p className="text-center col-span-full pt-8 h-screen">Nenhum projeto encontrado.</p>
                ) : (
                    <>
                        {projetosPessoalFiltrados.length > 0 && (
                            <>
                                <div className="flex-1 bg-zinc-700 h-px" />

                                <div className="mx-4 my-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {projetosPessoalFiltrados.filter(repo => {
                                        const agora = new Date()
                                        agora.setDate(agora.getDate() - 21)
                                        return new Date(repo.data.ano, repo.data.mes - 1) <= agora
                                    }).map((repo) => (
                                        <CardProjeto key={repo.id} repo={repo} />
                                    ))}
                                </div>
                            </>
                        )}

                        {projetosOrgFiltrados.length > 0 && (
                            <>
                                <div className="flex-1 bg-zinc-700 h-px" />

                                <div className="mx-4 my-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {projetosOrgFiltrados.map((repo) => (
                                        <CardProjeto key={repo.id} repo={repo} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    )
}