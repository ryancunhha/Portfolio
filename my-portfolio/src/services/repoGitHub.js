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
        if (!Array.isArray(dados)) return [];

        // INFORMAÇÔES
        const meusProjetos = dados.filter(repo => !repo.fork && !ignorarRepo.includes(repo.name)).map(({ id, name, topics = [], created_at, pushed_at, homepage, html_url }) => {
            return {
                id, // id
                name, // para links 
                nome: name.replace(/-/g, " "), // exibição nome
                topicos: topics, // filtro
                anoCriacao: new Date(created_at).getFullYear(), // ano de criação do repositorio
                atualizado: formatarTempoAtras(pushed_at), // atualização feita
                imagem: topics.includes("com-capa") ? `https://raw.githubusercontent.com/ryancunhha/${name}/main/thumbnail.png` : FALLBACK, // imagem
                homepage, // deploy
            };
        });

        sessionStorage.setItem(CACHE_KEY, JSON.stringify(meusProjetos));
        sessionStorage.setItem(CACHE_TIME_KEY, agora.toString());

        return meusProjetos;
    } catch (error) {
        if (error.name === "AbortError") return [];
        console.error("Erro ao buscar repositórios:", error);
        const cacheAntigo = sessionStorage.getItem(CACHE_KEY);
        return cacheAntigo ? JSON.parse(cacheAntigo) : [];
    }
}

// README
export async function obterReadmeDoProjeto(repo, signal) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/ryancunhha/${repo}/main/README.md`, { signal });
        return await response.text();
    } catch (error) {
        if (error.name === "AbortError") return "";
        console.error("Erro ao buscar o README:", error);
        return "# Erro ao carregar o conteúdo do README.";
    }
}