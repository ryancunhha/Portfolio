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

        if (cache && tempo && (agora - Number(tempo) < 300000)) return JSON.parse(cache);

        const response = await fetch("https://api.github.com/users/ryancunhha/repos?sort=pushed&per_page=100", { signal });
        if (!response.ok) throw new Error(`Erro na API do GitHub: ${response.status}`);

        const dados = await response.json();

        // DADOS
        const meusProjetos = await Promise.all(dados.filter(repo => !repo.fork && !ignorarRepo.includes(repo.name)).map(async ({ id, name, topics = [], created_at, pushed_at, homepage, default_branch }) => {
                return {
                    id,
                    name,
                    nome: name.replace(/-/g, " "),
                    topicos: topics,
                    data: {
                        ano: new Date(created_at).getFullYear(),
                        mes: String(new Date(created_at).getMonth() + 1).padStart(2, "0"),
                    },
                    atualizado: formatarTempoAtras(pushed_at),
                    imagem: `https://raw.githubusercontent.com/ryancunhha/${name}/${default_branch}/thumbnail.png`,
                    homepage,
                    description,
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
        const response = await fetch(`https://api.github.com/repos/ryancunhha/${nomeRepo}`, { signal });

        if (!response.ok) {
            throw new Error(`Erro ao buscar repositório específico: ${response.status}`);
        }

        const dados = await response.json();
        console.log(dados)

        return {
            id: dados.id,
            name: dados.name,
            nome: dados.name.replace(/-/g, " "),
            topicos: dados.topics || [],
            data: {
                ano: new Date(dados.created_at).getFullYear(),
                mes: String(new Date(dados.created_at).getMonth() + 1).padStart(2, "0"),
            },
            atualizado: formatarTempoAtras(dados.updated_at),
            imagem: `https://raw.githubusercontent.com/ryancunhha/${dados.name}/${dados.default_branch}/thumbnail.png`,
            homepage: dados.homepage,
            description: dados.description,
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