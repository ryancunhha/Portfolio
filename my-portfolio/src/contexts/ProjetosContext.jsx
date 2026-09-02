import { createContext, useContext, useState, useEffect } from "react";
import { obterProjetosGithubPessoal, obterProjetosGithubOrganizacao } from "../services/repoGitHub";

const ProjetosContext = createContext(null);

const ordenarMaisRecentes = (lista) => {
    return [...lista].sort((a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime())
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

    if (!context) throw new Error("useProjetos deve ser usado dentro de um ProjetosProvider");

    return context;
}