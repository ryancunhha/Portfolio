import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { obterReadmeDoProjeto, obterUnicoProjeto } from "../../services/repoGitHub";
import DetalheEsqueleto from "./detalheEsqueleto";
import ReadmeConteudo from "../../components/readme/readme";

export default function DetalhePagina() {
    const { id } = useParams();
    const [projeto, setProjeto] = useState(null);
    const [readmeMarkdown, setReadmeMarkdown] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let montado = true
        const controller = new AbortController()

        async function carregarDetalhes() {
            try {
                if (montado) setLoading(true);

                const cachePessoal = JSON.parse(sessionStorage.getItem("repos_cache_pessoal") || "[]");
                const cacheOrg = JSON.parse(sessionStorage.getItem("repos_cache_org") || "[]");
                const todosEmCache = [...cachePessoal, ...cacheOrg];

                let textoMarkdown = "";
                let projetoEncontrado = todosEmCache.find(p => p.id.toString() === id.toString());

                if (!projetoEncontrado) projetoEncontrado = await obterUnicoProjeto(id, controller.signal);

                if (projetoEncontrado && montado) {
                    textoMarkdown = await obterReadmeDoProjeto(projetoEncontrado.name, controller.signal);

                    setProjeto(projetoEncontrado);
                    setReadmeMarkdown(textoMarkdown);
                } else if (montado) {
                    setProjeto(null);
                }
            } catch (error) {
                if (error.name !== "AbortError") console.error("Erro ao carregar a página:", error);
            } finally {
                if (montado) setLoading(false)
            }
        }

        carregarDetalhes();

        return () => {
            montado = false;
            controller.abort();
            window.speechSynthesis.cancel();
        };
    }, [id]);

    if (loading) return <DetalheEsqueleto />;
    if (!projeto) return <Navigate to="/404" replace />;

    return (
        <div className="flex flex-col gap-3 mx-auto max-w-4xl p-4">
            <div className="flex flex-col gap-4 bg-[#111] border border-[#222] p-6 rounded-lg relative overflow-hidden">
                <div className="absolute -bottom-10 -right-6 text-[180px] font-black text-[#2a2a2a]/30 rotate-[-10deg] select-none">{projeto.name ? projeto.name.charAt(0).toUpperCase() : "</>"}</div>

                <div className="relative flex flex-col gap-3">
                    <Link className="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors" to="/projetos">
                        <span>←</span>
                        <span className="group-hover:underline">Projetos</span>
                    </Link>

                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-4xl font-extrabold tracking-tight capitalize text-white">{projeto.name.replace(/-/g, " ")}</h1>

                            {projeto.language && (
                                <span className="text-xs font-bold px-2.5 py-1 bg-[#222] text-[#ccc] border border-[#333] rounded-md">
                                    {projeto.language}
                                </span>
                            )}
                        </div>

                        {projeto.description && (
                            <p className="max-w-3xl text-gray-400 leading-relaxed mt-2">
                                {projeto.description}
                            </p>
                        )}

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-medium">
                            <p className="capitalize">{projeto.owner.replace(/-/g, " ")}</p>

                            <p>Criado em {projeto.data?.mes}/{projeto.data?.ano}</p>

                            {projeto.atualizado && (
                                <p className="flex items-center gap-1.5">
                                    {projeto.atualizado}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row flex-wrap items-center gap-3 pt-4 border-t border-[#333]">
                        {projeto.homepage && (
                            <a title="Visitar o site" href={projeto.homepage} target="_blank" rel="noreferrer">
                                <img loading="lazy" className="rounded-full bg-white" height="38" width="38" src="https://img.icons8.com/ios-filled/50/domain.png" alt="Site" />
                            </a>
                        )}

                        <a title="Link do repositório" href={`https://github.com/${projeto.owner}/${projeto.name}`} target="_blank" rel="noreferrer">
                            <img loading="eager" className="rounded-full bg-white" height="38" width="38" src="https://img.icons8.com/ios-filled/64/github.png" alt="GitHub" />
                        </a>

                        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                            <button type="button" title="Compartilhar projeto"
                                onClick={() => {
                                    navigator.share({
                                        title: projeto.name.replace(/-/g, " "),
                                        text: `Confira o projeto ${projeto.name.replace(/-/g, " ")}:`,
                                        url: window.location.href
                                    }).catch(() => { });
                                }} className="cursor-pointer">
                                <img loading="lazy" className="rounded-full bg-white p-1" height="38" width="38" src="https://img.icons8.com/ios-glyphs/30/forward-arrow.png" alt="Compartilhar" />
                            </button>
                        )}

                        <a title="Reportar bug ou sugestão" href={`https://github.com/${projeto.owner}/${projeto.name}/issues/new`} target="_blank" rel="noreferrer">
                            <img loading="lazy" className="rounded-full bg-white p-1" height="38" width="38" src="https://img.icons8.com/pastel-glyph/64/speaker--v1.png" alt="Reportar" />
                        </a>
                    </div>
                </div>
            </div>

            <ReadmeConteudo markdown={readmeMarkdown} usuario={projeto.owner} repositorio={projeto.name} branch={projeto.branch} />
        </div>
    )
}