import { ignorarRepo } from "../config/config";
import { formatarTempoAtras } from "./repoUtils";

const CACHE_KEY_PESSOAL = "repos_cache_pessoal";
const CACHE_TIME_PESSOAL = "cache_time_pessoal";

const CACHE_KEY_ORG = "repos_cache_org";
const CACHE_TIME_ORG = "cache_time_org";

const agora = Date.now();

// DADO LEVES
export async function obterProjetosGithubPessoal(signal) {
    try {
        const cache = sessionStorage.getItem(CACHE_KEY_PESSOAL);
        const tempo = sessionStorage.getItem(CACHE_TIME_PESSOAL);

        if (cache && tempo && (agora - Number(tempo) < 3600000)) return JSON.parse(cache);

        const responsePerfil = await fetch("https://api.github.com/users/ryancunhha/repos?sort=pushed&per_page=6", { signal });

        if (!responsePerfil.ok) throw new Error(`Erro na API Github: ${responsePerfil.status}`);

        const dados = [...await responsePerfil.json()];

        // DADOS
        const meusProjetos = await Promise.all(dados.filter(repo => !repo.fork && !ignorarRepo.includes(repo.name)).map(async ({ id, name, topics = [], created_at, pushed_at, language, homepage, default_branch, description, clone_url, owner }) => {
            return {
                id,
                name,
                topicos: topics,
                owner: owner.login,
                data: {
                    ano: new Date(created_at).getFullYear(),
                    mes: String(new Date(created_at).getMonth() + 1).padStart(2, "0"),
                },
                atualizado: formatarTempoAtras(pushed_at),
                language,
                branch: default_branch,
                homepage,
                description,
                clone_url,
            }
        }))

        sessionStorage.setItem(CACHE_KEY_PESSOAL, JSON.stringify(meusProjetos));
        sessionStorage.setItem(CACHE_TIME_PESSOAL, agora.toString());

        return meusProjetos;
    } catch (error) {
        if (error.name === "AbortError") return [];
        console.error(error);
        const cacheAntigo = sessionStorage.getItem(CACHE_KEY);
        return cacheAntigo ? JSON.parse(cacheAntigo) : [];
    }
}

export async function obterProjetosGithubOrganizacao(signal) {
    try {
        const cache = sessionStorage.getItem(CACHE_KEY_ORG);
        const tempo = sessionStorage.getItem(CACHE_TIME_ORG);

        if (cache && tempo && (agora - Number(tempo) < 3600000)) return JSON.parse(cache);

        const responseOrgs = await fetch("https://api.github.com/orgs/estudos-ryan/repos?per_page=100", { signal })

        if (!responseOrgs.ok) throw new Error(`Erro na API Organzizações: ${responseOrgs.status}`);

        const dados = [...await responseOrgs.json()]

        // DADOS
        const meusProjetos = await Promise.all(dados.filter(repo => !repo.fork && !ignorarRepo.includes(repo.name)).map(async ({ id, name, topics = [], created_at, pushed_at, language, homepage, default_branch, description, clone_url, owner }) => {
            return {
                id,
                name,
                topicos: topics,
                owner: owner.login,
                data: {
                    ano: new Date(created_at).getFullYear(),
                    mes: String(new Date(created_at).getMonth() + 1).padStart(2, "0"),
                },
                atualizado: formatarTempoAtras(pushed_at),
                language,
                branch: default_branch,
                homepage,
                description,
                clone_url,
            }
        }))

        sessionStorage.setItem(CACHE_KEY_ORG, JSON.stringify(meusProjetos));
        sessionStorage.setItem(CACHE_TIME_ORG, agora.toString());

        return meusProjetos;
    } catch (error) {
        if (error.name === "AbortError") return [];
        console.error(error);
        const cacheAntigo = sessionStorage.getItem(CACHE_KEY);
        return cacheAntigo ? JSON.parse(cacheAntigo) : [];
    }
}

// Dados Leves unicos
export async function obterUnicoProjeto(idRepo, signal) {
    try {
        const response = await fetch(`https://api.github.com/repositories/${idRepo}`, { signal });

        if (!response.ok) {
            throw new Error(`Repositório com ID ${idRepo} não encontrado`);
        }

        const dados = await response.json();

        return {
            id: dados.id,
            name: dados.name,
            organizacao: dados.owner.login,
            topicos: dados.topics || [],
            owner: dados.owner.login,
            data: {
                ano: new Date(dados.created_at).getFullYear(),
                mes: String(new Date(dados.created_at).getMonth() + 1).padStart(2, "0"),
            },
            atualizado: formatarTempoAtras(dados.pushed_at),
            language: dados.language,
            branch: dados.default_branch,
            homepage: dados.homepage,
            description: dados.description,
            clone_url: dados.clone_url
        };
    } catch (error) {
        if (error.name === "AbortError") throw error;
        console.error(`Erro ao obter o projeto ID ${idRepo}:`, error);
        return null;
    }
}

// README
export async function obterReadmeDoProjeto(idProjeto, signal) {
    try {
        const repoName = typeof idProjeto === 'string' ? idProjeto : idProjeto.name;
        const dono = idProjeto?.organizacao || idProjeto?.clone_url?.split('/')[3] || "ryancunhha";
        const branch = idProjeto?.branch || "main";
        const baseUrl = "https://raw.githubusercontent.com";

        let response = await fetch(`${baseUrl}/${dono}/${repoName}/${branch}/README.md`, { signal });

        if (!response.ok && dono === "ryancunhha") {
            response = await fetch(`${baseUrl}/estudos-ryan/${repoName}/${branch}/README.md`, { signal });
        }

        if (!response.ok) return "O README deste projeto não estar disponível no momento.";

        return await response.text();
    } catch (error) {
        if (error.name === "AbortError") return "";
        console.error("Erro ao buscar o conteúdo do README:", error);
        return "Algo deu errado ao carregar o README.";
    }
}