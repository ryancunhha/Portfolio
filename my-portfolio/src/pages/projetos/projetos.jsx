import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EsqueletoProjetos from "./projetosEsqueleto";
import { obterProjetosGithub } from "../../services/repoGitHub";

export default function Projeto() {
    const fimDaPaginaRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [projetos, setProjetos] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtroAtivo, setFiltroAtivo] = useState("Tudo");
    const [limiteVisivel, setLimiteVisivel] = useState(9);

    const todasCategorias = useMemo(() => {
        const setCategorias = new Set(projetos.flatMap(repo => repo.topicos || []));
        return ["Tudo", ...[...setCategorias].map(t => t.charAt(0).toUpperCase() + t.slice(1))];
    }, [projetos]);

    const projetosFiltrados = useMemo(() => {
        const buscaMinusculo = busca.toLowerCase().trim();
        const filtroMinusculo = filtroAtivo.toLowerCase();

        const filtrados = projetos.filter((repo) => {
            if (!repo) return false;
            const matchesFiltroBotao = filtroAtivo === "Tudo" || (repo.topicos && repo.topicos.map(t => t.toLowerCase()).includes(filtroMinusculo));
            const matchesInput = !buscaMinusculo || repo.nome.toLowerCase().includes(buscaMinusculo) || (repo.topicos && repo.topicos.some(t => t.toLowerCase().includes(buscaMinusculo)));

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
    }, [projetos, busca, filtroAtivo]);

    const projetosExibidos = useMemo(() => projetosFiltrados.slice(0, limiteVisivel), [projetosFiltrados, limiteVisivel]);

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

        (async () => {
            try {
                if (montado) setProjetos(await obterProjetosGithub(controller.signal))
            } catch (error) {
                console.error(error);
            }
        })();

        return () => {
            montado = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const elementoFim = entries[0];

            if (elementoFim.isIntersecting && projetosFiltrados.length > limiteVisivel) {
                setTimeout(() => {
                    setLimiteVisivel((prev) => prev + 9);
                }, 400);
            }
        }, { threshold: 0.7 });

        const elementoAtual = fimDaPaginaRef.current;
        if (elementoAtual) {
            observer.observe(elementoAtual);
        }

        return () => {
            if (elementoAtual) {
                observer.unobserve(elementoAtual)
            }
        }
    }, [limiteVisivel, projetosFiltrados.length]);

    if (projetos.length === 0) return <EsqueletoProjetos />

    return (
        <>
            <div className="md:sticky top-0 z-2 bg-principal-bg transition-colors duration-200 flex flex-col items-center px-2 md:px-4 pt-4 pb-2 select-none">
                <div className="flex items-center gap-2 w-full max-w-md border border-[#888] rounded-lg px-3">
                    <input maxLength="30" id="pesquisa" name="pesquisa" className="h-11 placeholder-[#888] bg-transparent outline-none w-full max-w-md" type="search" placeholder="Pesquisar..." value={busca} onChange={(e) => { setBusca(e.target.value); setLimiteVisivel(9); }} />
                    <p>🔍</p>
                </div>

                <div className="w-full flex flex-row gap-2 mt-3 px-1 text-[15px] overflow-x-auto whitespace-nowrap scrollbar-hide structural-tabs">
                    {todasCategorias.map((categoria) => (
                        <button key={categoria} onClick={() => { setFiltroAtivo(categoria); setLimiteVisivel(9); }} className={`px-3 py-1 mb-2 rounded-md font-medium cursor-pointer shrink-0 ${filtroAtivo === categoria ? "bg-white text-black" : "bg-zinc-800 text-white"}`}>
                            {categoria}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mx-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {projetosExibidos.length === 0 ? (
                    <div className="text-center text-[#999] col-span-full pt-10">Nenhum projeto encontrado.</div>
                ) : (
                    projetosExibidos.map((repo, i) => (
                        <Link key={repo.id} to={`/projetos/${repo.name}`} className="group hover:bg-[#999]/30 rounded-xl flex flex-col cursor-pointer">
                            <div className="relative w-full aspect-video p-1 overflow-hidden">
                                {/* 1. Imagem PNG  */}
                                <img src={repo.imagem} alt={`Projeto ${repo.name}`} loading={i < 9 ? "auto" : "lazy"} fetchPriority={i < 9 ? "high" : "low"} width="540" height="360" className="w-full h-full p-1 aspect-video object-cover rounded-xl select-none" crossOrigin="anonymous"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/fallbacks/FALLBACK.webp";
                                    }}
                                />

                                {/* 2. GIF */}
                                <img src={repo.imagemGif} alt="" loading="lazy" width="540" height="360" className="absolute inset-0 w-full h-full p-1 object-cover rounded-xl select-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out pointer-events-none" crossOrigin="anonymous"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/fallbacks/erroGif.webp";
                                    }}
                                />
                            </div>

                            <div className="mb-1.5 mx-2">
                                <p className="truncate font-bold text-lg first-letter:uppercase">{repo.nome}</p>
                                <p className="text-[12px] font-semibold text-[#888]">{repo.data.ano} {repo.atualizado}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {projetosFiltrados.length > limiteVisivel && (
                <div ref={fimDaPaginaRef} className="h-12 w-full flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                </div>
            )}
        </>
    )
}