import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EsqueletoProjetos from "./projetosEsqueleto";
import { obterProjetosGithub } from "../../services/repoGitHub";

export default function Projeto() {
    const [projetos, setProjetos] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtroAtivo, setFiltroAtivo] = useState("Tudo");
    const [limiteVisivel, setLimiteVisivel] = useState(9);
    const fimDaPaginaRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const querySearch = searchParams.get("search") || "";
        if (querySearch !== busca) setBusca(querySearch);
    }, [searchParams]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (busca) {
                setSearchParams({ search: busca }, { replace: true });
            } else {
                const novosParams = new URLSearchParams(searchParams);
                novosParams.delete("search");
                setSearchParams(novosParams, { replace: true });
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [busca, setSearchParams]);

    const todasCategorias = useMemo(() => {
        const setCategorias = new Set(projetos.flatMap(repo => repo.topicos || []));
        return ["Tudo", ...[...setCategorias].map(t => t.charAt(0).toUpperCase() + t.slice(1))];
    }, [projetos]);

    const projetosFiltrados = useMemo(() => {
        const buscaMinusculo = busca.toLowerCase().trim();
        const filtroMinusculo = filtroAtivo.toLowerCase();

        return projetos.filter((repo) => {
            if (!repo) return false;
            const matchesFiltroBotao = filtroAtivo === "Tudo" || (repo.topicos && repo.topicos.map(t => t.toLowerCase()).includes(filtroMinusculo));
            const matchesInput = !buscaMinusculo || repo.nome.toLowerCase().includes(buscaMinusculo) || (repo.topicos && repo.topicos.some(t => t.toLowerCase().includes(buscaMinusculo)));

            return matchesFiltroBotao && matchesInput;
        });
    }, [projetos, busca, filtroAtivo]);

    const projetosExibidos = useMemo(() => projetosFiltrados.slice(0, limiteVisivel), [projetosFiltrados, limiteVisivel]);

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
            if (entries[0].isIntersecting && projetosFiltrados.length > limiteVisivel) setLimiteVisivel((prev) => prev + 9);
        }, { rootMargin: "200px" });

        const elementoAtual = fimDaPaginaRef.current;
        if (elementoAtual) observer.observe(elementoAtual);

        return () => { if (elementoAtual) observer.unobserve(elementoAtual); };
    }, [projetosFiltrados.length]);

    if (projetos.length === 0) return <EsqueletoProjetos />

    return (
        <>
            <div className="md:sticky top-0 z-2 bg-principal-bg transition-colors duration-200 flex flex-col items-center px-4 pt-4 pb-2 select-none">
                <div className="flex items-center gap-2 w-full max-w-md border border-[#888] rounded-md px-4">
                    <input maxLength="30" id="pesquisa" name="pesquisa" className="h-11 text-[#888] bg-transparent outline-none w-full max-w-md" type="search" placeholder="Pesquisar..." value={busca} onChange={(e) => { setBusca(e.target.value); setLimiteVisivel(9); }} />
                    <p>🔍</p>
                </div>

                <div className="w-full flex flex-row gap-2 mt-3 pb-2 text-[15px] overflow-x-auto whitespace-nowrap scrollbar-hide structural-tabs">
                    {todasCategorias.map((categoria) => (
                        <button key={categoria} onClick={() => { setFiltroAtivo(categoria); setLimiteVisivel(9); }} className={`px-3 py-1 rounded-full font-medium cursor-pointer shrink-0 transition-colors ${filtroAtivo === categoria ? "bg-[#F8F9FA] text-black" : "bg-zinc-800 text-white"}`}>
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
                        <Link to={`/projetos/${repo.name}`} key={repo.id} className="hover:bg-[#999]/25 rounded-xl flex flex-col cursor-pointer">
                            <img loading={i < 9 ? "eager" : "lazy"} fetchPriority={i < 9 ? "high" : "low"} width="540" height="360" className="w-full p-1 aspect-video object-cover rounded-xl select-none" src={repo.imagem} alt={`Projeto ${repo.name}`} />

                            <div className="mb-1 mx-2">
                                <p className="truncate font-bold text-lg first-letter:uppercase">{repo.nome}</p>
                                <p className="text-[12px] font-semibold text-[#888]">{repo.anoCriacao} {repo.atualizado}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {projetosFiltrados.length > limiteVisivel && <div ref={fimDaPaginaRef} className="h-10 w-full" />}
        </>
    );
}