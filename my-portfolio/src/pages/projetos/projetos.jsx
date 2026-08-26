import { useState, useEffect } from "react";
import EsqueletoProjetos from "./projetosEsqueleto";
import { obterProjetosGithubPessoal, obterProjetosGithubOrganizacao } from "../../services/repoGitHub";
import { CardProjeto } from "../../components/cards/cards";

export default function Projeto() {
    const [projetos, setProjetos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const ordenarMaisRecentes = (lista) => {
        const checarAtualizado = (repo) => {
            const temNaTag = repo.topicos && repo.topicos.some(t => t.toLowerCase().includes("atualizado"));
            const temNaPropriedadeString = typeof repo.atualizado === "string" && repo.atualizado.toLowerCase().includes("atualizado");
            const temNaPropriedadeBool = repo.atualizado === true;
            return temNaTag || temNaPropriedadeString || temNaPropriedadeBool;
        };

        const extrairTimestamp = (repo) => {
            if (repo.data?.ano && repo.data?.mes) {
                return new Date(repo.data.ano, repo.data.mes - 1, repo.data.dia || 1).getTime();
            }

            if (repo.updated_at || repo.pushed_at || repo.created_at) {
                return new Date(repo.updated_at || repo.pushed_at || repo.created_at).getTime();
            }
            return 0;
        }

        return [...lista].sort((a, b) => {
            const atualizadoA = checarAtualizado(a);
            const atualizadoB = checarAtualizado(b);

            if (atualizadoA && !atualizadoB) return -1;
            if (!atualizadoA && atualizadoB) return 1;

            return extrairTimestamp(b) - extrairTimestamp(a);
        })
    }

    useEffect(() => {
        let montado = true;
        const controller = new AbortController();

        async function carregarDados() {
            try {
                const [dadosPessoal, dadosOrg] = await Promise.all([
                    obterProjetosGithubPessoal(controller.signal),
                    obterProjetosGithubOrganizacao(controller.signal)
                ]);

                if (montado) {
                    const todosOsProjetos = [...(dadosPessoal || []), ...(dadosOrg || [])];

                    const projetosFiltrados = todosOsProjetos.filter((repo) => {
                        if (!repo.data?.ano || !repo.data?.mes) return true;
                        const limite = new Date();
                        limite.setDate(limite.getDate() - 7);
                        return new Date(repo.data.ano, repo.data.mes - 1) <= limite;
                    })

                    setProjetos(ordenarMaisRecentes(projetosFiltrados));
                }
            } catch (error) {
                console.error("Erro ao buscar projetos:", error);
            } finally {
                if (montado) setCarregando(false);
            }
        }

        carregarDados()

        return () => {
            montado = false;
            controller.abort();
        };
    }, []);

    if (carregando) return <EsqueletoProjetos />

    return (
        <div className="mx-4 my-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projetos.map((repo) => (
                    <CardProjeto key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    )
}