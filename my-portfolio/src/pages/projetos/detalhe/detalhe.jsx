import { useEffect, useState, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { obterReadmeDoProjeto, obterUnicoProjeto } from "../../../services/repoGitHub";
import BarraAcessibilidade from "../../../components/barraAcessibilidade/barraAcessibilidade";
import DetalheEsqueleto from "./detalheEsqueleto";

export default function DetalhePagina() {
    const { id } = useParams();
    const [projeto, setProjeto] = useState(null);
    const [readmeMarkdown, setReadmeMarkdown] = useState("");
    const [loading, setLoading] = useState(true);
    const [tamanhoFonte, setTamanhoFonte] = useState(16)

    // DADOS
    useEffect(() => {
        const controller = new AbortController();

        async function carregarDetalhes() {
            try {
                setLoading(true);

                const cache = sessionStorage.getItem("repos_cache");
                let textoMarkdown = "";
                let projetoEncontrado = null;

                if (cache) {
                    // --- CAMINHO NORMAL ---
                    projetoEncontrado = JSON.parse(cache).find(p => p.name.toLowerCase() === id.toLowerCase());
                    textoMarkdown = await obterReadmeDoProjeto(id, controller.signal);
                } else {
                    // --- CAMINHO UNICO ---
                    projetoEncontrado = await obterUnicoProjeto(id);
                    textoMarkdown = await obterReadmeDoProjeto(id, controller.signal);
                }

                if (projetoEncontrado) {
                    setProjeto(projetoEncontrado);
                    setReadmeMarkdown(textoMarkdown);
                } else {
                    setProjeto(null);
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("Requisição cancelada");
                } else {
                    console.error("Erro ao carregar a página:", error);
                }
            } finally {
                setLoading(false);
            }
        }

        carregarDetalhes();

        return () => {
            controller.abort();
            window.speechSynthesis.cancel();
        };
    }, [id]);

    // REAME
    const readmeHtml = useMemo(() => {
        if (!readmeMarkdown) return "";

        const renderer = {
            heading({ tokens, depth, text }) {
                const newDepth = depth === 1 || 2 ? 3 : depth;
                return `<h${newDepth}>${text}</h${newDepth}>`;
            }
        };

        marked.use({ renderer });
        return DOMPurify.sanitize(marked.parse(readmeMarkdown));
    }, [readmeMarkdown]);

    // REGAEZ
    const readmeTextoVoz = useMemo(() => {
        if (!readmeMarkdown) return "";
        return readmeMarkdown.replace(/https?:\/\/\S+/g, "").replace(/[#*`_\-\[\]()]/g, "").replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "");;
    }, [readmeMarkdown]);

    if (loading) return <DetalheEsqueleto />;
    if (!projeto) return <Navigate to="/404" replace />;

    return (
        <div className="flex flex-col gap-3 mx-auto max-w-4xl p-4">
            {/* APRESENTAÇÃO DO PROJETO */}
            <div className="flex flex-col gap-2">
                {/* BREADCRUMB */}
                <div className="flex items-center gap-2">
                    <Link className="hover:underline text-base md:text-sm" to="/projetos">← Projetos</Link>

                    {projeto.topicos && projeto.topicos.length > 0 && (
                        <>
                            <span className="cursor-default text-neutral-400">&gt;</span>
                            <Link className="capitalize hover:underline text-base md:text-sm" to={`/projetos?search=${projeto.topicos[0]}`}>{projeto.topicos[0]}</Link>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    {projeto.topicos[0] && <p className="capitalize text-sm">{projeto.topicos[0]}</p>}
                    <h1 className="text-4xl font-bold capitalize">{projeto.nome}</h1>
                    {projeto.description && <h2>{`${projeto.description}`}</h2>}
                    <p className="text-sm">Criado em {`${projeto.data.mes}/${projeto.data.ano}`} {projeto.atualizado && <span>{projeto.atualizado}</span>}</p>
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-sm">Links úteis:</p>

                    <div className="flex flex-row flex-wrap gap-2">
                        {projeto.homepage && (
                            <a title="Visitar o site" href={projeto.homepage} className="cursor-pointer" target="_blank" rel="noreferrer">
                                <img className="bg-white rounded-full" height="40" width="40" src="https://img.icons8.com/ios-filled/50/domain.png" alt={`Site do projeto ${projeto.name}`} />
                            </a>
                        )}

                        <a title="Link do repositório" href={`https://github.com/ryancunhha/${projeto.name}`} target="_blank" rel="noreferrer">
                            <img className="bg-white rounded-full" height="40" width="40" src="https://img.icons8.com/ios-filled/50/github.png" alt={`GitHub do projeto ${projeto.name}`} />
                        </a>

                        <button title="Compartilhar projeto" onClick={() => navigator.share && navigator.share({ title: projeto?.nome, url: window.location.href }).catch(console.error)} className="cursor-pointer">
                            <img className="rounded-full" height="40" width="40" src="https://img.icons8.com/flat-round/64/link--v1.png" alt="Compartilhar projeto" />
                        </button>
                    </div>
                </div>

                <img loading="eager" fetchPriority="low" className="max-auto h-64 md:h-96 object-contain" src={projeto.imagem} alt={`Projeto ${projeto.nome}`}
                    crossOrigin="anonymous"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/FALLBACK.webp";
                    }}
                />
            </div>

            {/* FAz com que se exista ser tiver readme */}
            <BarraAcessibilidade textoAudio={readmeTextoVoz} tamanhoFonte={tamanhoFonte} setTamanhoFonte={setTamanhoFonte} />

            {/* CONTEÚDO DO README.MD */}
            <div className="wrap-break-word [&_pre]:overflow-x-auto [&_pre]:w-full [&_p]:mb-4 [&_a]:underline [&_a]:text-[#5b88c3] [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-3 [&_strong]:font-bold [&_em]:italic [&_pre]:bg-neutral-800 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-md [&_hr]:my-6 [&_hr]:border-neutral-300" style={{ fontSize: `${tamanhoFonte}px` }} dangerouslySetInnerHTML={{ __html: readmeHtml }} />
        </div>
    );
}