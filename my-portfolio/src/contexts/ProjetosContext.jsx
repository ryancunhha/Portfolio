import { createContext, useContext, useState, useEffect } from 'react';
import { obterProjetosGithubPessoal, obterProjetosGithubOrganizacao } from "../services/repoGitHub";

const ProjetosContext = createContext();

const ordenarMaisRecentes = (lista) => {
    const extrairTimestamp = (repo) => {
        if (repo.data?.ano && repo.data?.mes) {
            const ano = Number(repo.data.ano)
            const mes = Number(repo.data.mes) - 1
            const dia = Number(repo.data.dia || 1)
            return new Date(ano, mes, dia).getTime()
        }

        const dataIso = repo.pushed_at || repo.updated_at || repo.created_at;
        return dataIso ? new Date(dataIso).getTime() : 0;
    };

    return [...lista].sort((a, b) => extrairTimestamp(b) - extrairTimestamp(a))
}

export function ProjetosProvider({ children }) {
    const [projetos, setProjetos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function carregarProjetos() {
            try {
                setCarregando(true);

                const [pessoais, orgs] = await Promise.all([
                    obterProjetosGithubPessoal(controller.signal),
                    obterProjetosGithubOrganizacao(controller.signal)
                ]);

                const todosProjetos = [...pessoais, ...orgs];

                setProjetos(ordenarMaisRecentes(todosProjetos));
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Erro ao carregar projetos:", err);
                    setErro(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        carregarProjetos();

        return () => controller.abort();
    }, []);

    return (
        <ProjetosContext.Provider value={{ projetos, carregando, erro }}>
            {children}
        </ProjetosContext.Provider>
    )
}

export function useProjetos() {
    const context = useContext(ProjetosContext);

    if (!context)  throw new Error("useProjetos deve ser usado dentro de um ProjetosProvider");
    
    return context;
}