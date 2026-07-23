import { ignorarRepo } from "../config/config";

const CACHE_KEY = "repos_cache";
const CACHE_TIME_KEY = "cache_time";
const FALLBACK = "/FALLBACK.webp";

const intervalos = {
    mês: 2592000,
    semana: 604800,
    dia: 86400,
    hora: 3600,
    minuto: 60,
};

function formatarTempoAtras(dataString) {
    if (!dataString) return null;
    const diferencaEmSegundos = Math.floor((Date.now() - new Date(dataString)) / 1000);
    if (diferencaEmSegundos > 90 * 86400) return null;

    for (const unidade in intervalos) {
        const contagem = Math.floor(diferencaEmSegundos / intervalos[unidade]);

        if (contagem >= 1) {
            const plural = contagem > 1 ? (unidade === "mês" ? "meses" : unidade + "s") : unidade;
            return `• Atualizado há ${contagem} ${plural}`;
        }
    }

    return "• Atualizado há 1seg";
}

// DADO LEVES
export async function obterProjetosGithub(signal) {
    try {
        const cache = sessionStorage.getItem(CACHE_KEY);
        const tempo = sessionStorage.getItem(CACHE_TIME_KEY);
        const agora = Date.now();

        if (cache && tempo && (agora - Number(tempo) < 3600000)) return JSON.parse(cache);

        const [responseOrgs, responsePerfil] = await Promise.all([
            fetch("https://api.github.com/orgs/estudos-ryan/repos?per_page=30", { signal }),
            fetch("https://api.github.com/users/ryancunhha/repos?sort=pushed&per_page=30", { signal })
        ]);

        if (!responseOrgs.ok) throw new Error(`Erro na API Organzizações: ${responseOrgs.status}`);
        if (!responsePerfil.ok) throw new Error(`Erro na API Github: ${responsePerfil.status}`);

        const dadosOrgs = await responseOrgs.json();
        const dadosPerfil = await responsePerfil.json();

        const dados = [...dadosOrgs, ...dadosPerfil];

        // DADOS
        const meusProjetos = await Promise.all(dados.filter(repo => !repo.fork && !ignorarRepo.includes(repo.name)).map(async ({ id, name, topics = [], created_at, pushed_at, homepage, default_branch, description, owner, clone_url }) => {
            const baseImagemUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/assets`;

            return {
                id,
                name,
                nome: name.replace(/-/g, " "),
                organizacao: owner.login,
                topicos: topics,
                data: {
                    ano: new Date(created_at).getFullYear(),
                    mes: String(new Date(created_at).getMonth() + 1).padStart(2, "0"),
                },
                atualizado: formatarTempoAtras(pushed_at),
                imagem: `${baseImagemUrl}/thumbnail.png`,
                imagemGif: `${baseImagemUrl}/thumbnail.gif`,
                branch: default_branch,
                homepage,
                description,
                clone_url,
            }
        })
        )

        sessionStorage.setItem(CACHE_KEY, JSON.stringify(meusProjetos));
        sessionStorage.setItem(CACHE_TIME_KEY, agora.toString());

        return meusProjetos;
    } catch (error) {
        if (error.name === "AbortError") return [];
        console.error(error);
        const cacheAntigo = sessionStorage.getItem(CACHE_KEY);
        return cacheAntigo ? JSON.parse(cacheAntigo) : [];
    }
}

// Dados Leves unicos
export async function obterUnicoProjeto(nomeRepo, signal) {
    try {
        let dono = "ryancunhha"
        let response = await fetch(`https://api.github.com/repos/ryancunhha/${nomeRepo}`, { signal });

        if (!response.ok) {
            dono = "estudos-ryan";
            response = await fetch(`https://api.github.com/repos/${dono}/${nomeRepo}`, { signal });
        }

        if (!response.ok) {
            throw new Error(`Repositório não encontrado em nenhuma das contas`);
        }

        const dados = await response.json();
        const branchPadrao = dados.default_branch || "main";

        return {
            id: dados.id,
            name: dados.name,
            nome: dados.name.replace(/-/g, " "),
            organizacao: dados.owner.login,
            topicos: dados.topics || [],
            data: {
                ano: new Date(dados.created_at).getFullYear(),
                mes: String(new Date(dados.created_at).getMonth() + 1).padStart(2, "0"),
            },
            atualizado: formatarTempoAtras(dados.updated_at),
            imagem: `https://raw.githubusercontent.com/${dados.owner.login}/${dados.name}/${branchPadrao}/assets/thumbnail.png`,
            branch: branchPadrao,
            homepage: dados.homepage,
            description: dados.description,
            clone_url: dados.clone_url
        };
    } catch (error) {
        if (error.name === "AbortError") throw error;
        console.error(`Erro ao obter o projeto ${nomeRepo}:`, error);
        return null;
    }
}

// README
export async function obterReadmeDoProjeto(repo, signal) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/ryancunhha/${repo}/main/README.md`, { signal });
        if (!response.ok) return "Indisponível no momento";
        return await response.text();
    } catch (error) {
        if (error.name === "AbortError") return "";
        console.error("Erro ao buscar o conteúdo do README", error);
        return "Erro ao buscar o conteúdo do README";
    }
}