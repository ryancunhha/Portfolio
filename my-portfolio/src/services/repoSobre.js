const CACHE_TIME = 24 * 60 * 60 * 1000;

let readmeCache = null;
let cacheTimestamp = 0;
let requisicao = null;

export async function buscarReadme() {
    if (readmeCache && Date.now() - cacheTimestamp < CACHE_TIME) return readmeCache;
    if (requisicao) return requisicao;

    requisicao = fetch("https://raw.githubusercontent.com/ryancunhha/ryancunhha/main/README.md").then((resposta) => {
        if (!resposta.ok) {
            throw new Error(`GitHub retornou ${resposta.status}`);
        }

        return resposta.text();
    }).then((markdown) => {
        readmeCache = markdown;
        cacheTimestamp = Date.now();

        return markdown;
    }).catch((erro) => {
        console.error("Erro ao buscar README:", erro);
        return null;
    }).finally(() => {
        requisicao = null;
    });

    return requisicao;
}