import { useEffect, useState, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { obterReadmeDoProjeto, obterUnicoProjeto } from "../../services/repoGitHub";
import BarraAcessibilidade from "../../components/barraAcessibilidade/barraAcessibilidade";
import DetalheEsqueleto from "./detalheEsqueleto";
import { notificar } from "../../components/notificacao/notificacao";

export default function DetalhePagina() {
    const { id } = useParams();
    const [projeto, setProjeto] = useState(null);
    const [readmeMarkdown, setReadmeMarkdown] = useState("");
    const [loading, setLoading] = useState(true);
    const [tamanhoFonte, setTamanhoFonte] = useState(16);

    // DADOS
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

    // REAME
    const readmeHtml = useMemo(() => {
        if (!readmeMarkdown) return "";

        const renderer = {
            heading(token) {
                const text = typeof token === "object" ? token.text : arguments[1];
                const depth = typeof token === "object" ? token.depth : arguments[0];
                const newDepth = (depth === 1 || depth === 2) ? 3 : depth;
                return `<h${newDepth}>${text}</h${newDepth}>`;
            }
        };

        marked.use({ renderer });
        return DOMPurify.sanitize(marked.parse(readmeMarkdown));
    }, [readmeMarkdown])

    if (loading) return <DetalheEsqueleto />;
    if (!projeto) return <Navigate to="/404" replace />;

    const donoDoRepo = projeto.organizacao || (projeto.clone_url ? projeto.clone_url.split("/")[3] : "ryancunhha");

    return (
        <div className="flex flex-col gap-3 mx-auto max-w-4xl p-4">
            <div className="flex flex-col gap-4 bg-[#111] border border-[#222] p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute -bottom-10 -right-6 text-[180px] font-black text-[#2a2a2a]/30 rotate-[-10deg] select-none">{projeto.name ? projeto.name.charAt(0).toUpperCase() : "</>"}</div>

                <div className="relative flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2 w-full text-base">
                        <Link className="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors" to="/projetos">
                            <span>←</span>
                            <span className="group-hover:underline">Projetos</span>
                        </Link>

                        {projeto.topicos && projeto.topicos.length > 0 && (
                            <>
                                <span className="cursor-default text-gray-600">&gt;</span>
                                <Link className="capitalize text-gray-400 hover:text-white hover:underline transition-colors" to={`/projetos?search=${projeto.topicos[0]}`}>
                                    {projeto.topicos[0]}
                                </Link>
                            </>
                        )}
                    </div>

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
                            <h2 className="max-w-3xl text-lg text-gray-400 leading-relaxed mt-2">
                                {projeto.description}
                            </h2>
                        )}

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
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
                                <img loading="lazy" className="bg-white rounded-full p-0.5" height="38" width="38" src="https://img.icons8.com/ios-filled/50/domain.png" alt="Site" />
                            </a>
                        )}

                        <a title="Link do repositório" href={`https://github.com/${donoDoRepo}/${projeto.name}`} target="_blank" rel="noreferrer">
                            <img loading="eager" className="bg-white rounded-full p-0.5" height="38" width="38" src="https://img.icons8.com/ios-filled/50/github.png" alt="GitHub" />
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
                                <img loading="lazy" className="rounded-full bg-white p-1" height="38" width="38" src="https://img.icons8.com/flat-round/64/link--v1.png" alt="Compartilhar" />
                            </button>
                        )}

                        {projeto.clone_url && (
                            <button type="button" title="Copiar comando Git clone" className="cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText(`git clone ${projeto.clone_url}`);
                                    notificar({
                                        texto: "✅ Comando copiado!",
                                    })
                                }}>
                                <img loading="lazy" className="rounded-full bg-white p-1" height="38" width="38" src="https://img.icons8.com/color/48/git.png" alt="Git" />
                            </button>
                        )}

                        <a title="Reportar bug ou sugestão" href={`https://github.com/${donoDoRepo}/${projeto.name}/issues/new`} target="_blank" rel="noreferrer">
                            <img loading="lazy" className="rounded-full bg-white p-1.5" height="38" width="38" src="https://img.icons8.com/ios-filled/50/bug.png" alt="Issue" />
                        </a>
                    </div>
                </div>
            </div>

            <BarraAcessibilidade textoAudio={readmeMarkdown} tamanhoFonte={tamanhoFonte} setTamanhoFonte={setTamanhoFonte} />

            <div className="wrap-break-word [&_pre]:overflow-x-auto [&_pre]:w-full [&_p]:mb-4 [&_a]:underline [&_a]:text-[#5b88c3] [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-3 [&_strong]:font-bold [&_em]:italic [&_pre]:bg-neutral-800 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-md [&_hr]:my-6 [&_hr]:border-neutral-300" style={{ fontSize: `${tamanhoFonte}px` }} dangerouslySetInnerHTML={{ __html: readmeHtml }} />
        </div>
    )
}