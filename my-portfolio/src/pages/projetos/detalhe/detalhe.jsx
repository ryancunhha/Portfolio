import { useEffect, useState, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { obterReadmeDoProjeto } from "../../../services/repoGitHub";
import BarraAcessibilidade from "../../../components/barraAcessibilidade/barraAcessibilidade";
import DetalheEsqueleto from "./detalheEsqueleto";

export default function DetalhePagina() {
    const { id } = useParams();
    const [projeto, setProjeto] = useState(null);
    const [readmeMarkdown, setReadmeMarkdown] = useState("");
    const [loading, setLoading] = useState(true);
    const [tamanhoFonte, setTamanhoFonte] = useState(16)

    // INFO
    useEffect(() => {
        const controller = new AbortController();

        async function carregarDetalhes() {
            try {
                setLoading(true);

                const cache = sessionStorage.getItem("repos_cache");
                if (cache) {
                    const listaProjetos = JSON.parse(cache);
                    const projetoAchado = listaProjetos.find(p => p.name === id);
                    if (projetoAchado) setProjeto(projetoAchado);
                }

                const textoMarkdown = await obterReadmeDoProjeto(id, controller.signal);
                setReadmeMarkdown(textoMarkdown);
            } catch (error) {
                console.error("Erro ao carregar a página:", error);
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
                const newDepth = depth === 1 ? 2 : depth;
                return `<h${newDepth}>${text}</h${newDepth}>`;
            }
        };

        marked.use({ renderer });

        return DOMPurify.sanitize(marked.parse(readmeMarkdown));
    }, [readmeMarkdown]);

    // REGAEZ
    const readmeTextoVoz = useMemo(() => {
        if (!readmeMarkdown) return "";
        return readmeMarkdown.replace(/https?:\/\/\S+/g, "").replace(/[#*`_\-\[\]()]/g, "");
    }, [readmeMarkdown]);

    if (loading) return <DetalheEsqueleto />;
    if (!projeto) return <Navigate to="/404" replace />;

    return (
        <div className="m-4 flex flex-col gap-3">
            {/* Fazer um modificaçaõ aqui ← Voltar para projetos (se tiver > Topics por exemplo e automacao com link que fiz "/projetos?search=${topico}") ficará Projeto > Automacao */}
            <Link to="/projetos" className="w-max text-sm">← Voltar para projetos</Link>

            {/* APRESENTAÇÃO DO PROJETO */}
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-3xl font-bold uppercase">{projeto.nome}</h1>
                    <p className="text-sm">Criado em {projeto.mes}/{projeto.ano} {projeto.atualizado && `${projeto.atualizado}`}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs">link inforamções</p>

                    <div className="flex flex-row flex-wrap gap-2">
                        {/* projeto.homepage */}
                        {true && (
                            <a href={projeto.homepage} className="cursor-pointer" target="_blank" rel="noreferrer">
                                <img className="bg-white rounded-full" height="40" width="40" src="https://img.icons8.com/ios-filled/50/domain.png" alt={`Site do projeto ${projeto.name}`} />
                            </a>
                        )}

                        <a href={`https://github.com/ryancunhha/${projeto.name}`} target="_blank" rel="noreferrer">
                            <img className="bg-white rounded-full" height="40" width="40" src="https://img.icons8.com/ios-filled/50/github.png" alt={`GitHub do projeto ${projeto.name}`} />
                        </a>

                        <button onClick={() => navigator.share && navigator.share({ title: projeto?.nome, url: window.location.href }).catch(console.error)} className="cursor-pointer">
                            <img className="rounded-full" height="40" width="40" src="https://img.icons8.com/flat-round/64/link--v1.png" alt="Compartilhar projeto" />
                        </button>
                    </div>
                </div>

                <img className="w-full h-64 md:h-96 object-cover rounded-lg select-none" src={projeto.imagem} alt={`Projeto ${projeto.nome}`} />
            </div>

            {/* BARRA DE ACESSIBILIDADE */}
            <BarraAcessibilidade textoAudio={readmeTextoVoz} tamanhoFonte={tamanhoFonte} setTamanhoFonte={setTamanhoFonte} />

            {/* CONTEÚDO DO README.MD */}
            <div className="leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-3 [&>p]:mb-4 [&>a]:underline [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4 [&>pre_code]:p-0" style={{ fontSize: `${tamanhoFonte}px` }} dangerouslySetInnerHTML={{ __html: readmeHtml }} />
        </div>
    );
}