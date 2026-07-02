import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import EsqueletoProjetos from "./projetosEsqueleto";
import { obterProjetosGithub } from "../../services/repoGitHub";

export default function Projeto() {
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroAtivo, setFiltroAtivo] = useState("Tudo");
    const [limiteVisivel, setLimiteVisivel] = useState(9);
    const fimDaPaginaRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const querySearch = searchParams.get("search") || "";

        if (querySearch !== busca) {
            setBusca(querySearch);
        }
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
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [busca, setSearchParams]);

    const handleBuscaChange = (valor) => {
        setBusca(valor);
    };

    const todasCategorias = useMemo(() => {
        const setCategorias = new Set(projetos.flatMap(repo => repo.topicos || []));
        return ["Tudo", ...Array.from(setCategorias).map(t => t.charAt(0).toUpperCase() + t.slice(1))];
    }, [projetos]);

    const projetosFiltrados = useMemo(() => {
        const buscaMinusculo = busca.toLowerCase().trim();
        const filtroMinusculo = filtroAtivo.toLowerCase();

        return projetos.filter((repo) => {
            if (!repo) return false;
            const matchesFiltroBotao = filtroAtivo === "Tudo" || (repo.topicos && repo.topicos.map(t => t.toLowerCase()).includes(filtroMinusculo));
            let matchesInput = true;

            if (buscaMinusculo) {
                const matchesNome = repo.nome.toLowerCase().includes(buscaMinusculo);
                const matchesTopico = repo.topicos && repo.topicos.some(topico => topico.toLowerCase().includes(buscaMinusculo));
                matchesInput = matchesNome || matchesTopico;
            }

            return matchesFiltroBotao && matchesInput;
        });
    }, [projetos, busca, filtroAtivo]);

    const projetosExibidos = useMemo(() => projetosFiltrados.slice(0, limiteVisivel), [projetosFiltrados, limiteVisivel]);

    useEffect(() => {
        let montado = true;
        const controller = new AbortController();

        (async () => {
            try {
                const dados = await obterProjetosGithub(controller.signal);
                if (montado) {
                    setProjetos(dados);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erro ao carregar:", error);
                if (montado) setLoading(false);
            }
        })();

        return () => {
            montado = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (loading || projetosFiltrados.length <= limiteVisivel) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setLimiteVisivel((prev) => prev + 9);
            }
        }, { rootMargin: "200px" });

        const elementoAtual = fimDaPaginaRef.current;
        if (elementoAtual) observer.observe(elementoAtual);

        return () => { if (elementoAtual) observer.unobserve(elementoAtual); };
    }, [loading, projetosFiltrados.length, limiteVisivel]);

    useEffect(() => {
        setLimiteVisivel(9);
    }, [busca, filtroAtivo]);

    if (loading) return <EsqueletoProjetos />;

    return (
        <>
            <div className="md:sticky top-0 z-2 bg-principal-bg transition-colors duration-200 flex flex-col items-center px-4 pt-4 pb-2 select-none">
                <input id="pesquisa" name="pesquisa" className="h-10 text-md border rounded-lg border-[#999] py-1 px-3 text-[#888] bg-transparent outline-none w-full max-w-md" type="search" placeholder="Pesquisar..." value={busca} onChange={(e) => handleBuscaChange(e.target.value)} />

                <div className="w-full flex flex-row justify-center gap-2 mt-3 text-[15px] overflow-x-auto whitespace-nowrap scrollbar-hide structural-tabs">
                    {todasCategorias.map((categoria) => (
                        <button key={categoria} onClick={() => setFiltroAtivo(categoria)} className={`px-3 py-1 rounded-full font-medium cursor-pointer shrink-0 transition-colors ${filtroAtivo === categoria ? "bg-[#F8F9FA] text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}>
                            {categoria}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mx-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {projetosExibidos.length === 0 ? (
                    <div className="text-center text-[#999] col-span-full pt-10">Nenhum projeto encontrado.</div>
                ) : (
                    projetosExibidos.map((repo) => (
                        <Link to={`/projetos/${repo.name}`} key={repo.id} className="hover:bg-white/5 transition-colors duration-200 rounded-xl flex flex-col cursor-pointer">
                            <img loading="lazy" className="w-full aspect-video object-cover rounded-lg select-none" src={repo.imagem} alt={`Projeto ${repo.name}`} />

                            <div className="my-1 mx-2">
                                <p className="truncate font-bold text-lg" title={repo.nome}>{repo.nome}</p>
                                <p className="text-[12px] font-semibold text-[#888]">{repo.anoCriacao} {repo.atualizado}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {projetosFiltrados.length > limiteVisivel && <div ref={fimDaPaginaRef} className="h-2 w-full" />}
        </>
    );
}