import { useState, useEffect } from "react";
import EsqueletoProjetos from "./projetosEsqueleto";
import { obterProjetosGithubPessoal, obterProjetosGithubOrganizacao } from "../../services/repoGitHub";
import { CardProjeto } from "../../components/cards/cards";

export default function Projeto() {
    const [projetos, setProjetos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const ordenarMaisRecentes = (lista) => {
        const extrairTimestamp = (repo) => {
            if (repo.data?.ano && repo.data?.mes) {
                const ano = repo.data.ano;
                const mes = repo.data.mes - 1;
                const dia = repo.data.dia || 1;

                return new Date(ano, mes, dia).getTime();
            }

            const dataIso = repo.pushed_at || repo.updated_at || repo.created_at;
            if (dataIso) {
                return new Date(dataIso).getTime();
            }

            return 0;
        }

        return [...lista].sort((a, b) => extrairTimestamp(b) - extrairTimestamp(a));
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
                    setProjetos(ordenarMaisRecentes(todosOsProjetos));
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
        <div className="m-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projetos.map((repo) => (
                    <CardProjeto key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    )
}