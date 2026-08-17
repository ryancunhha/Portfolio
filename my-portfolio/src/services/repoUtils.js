const intervalos = {
    mês: 2592000,
    semana: 604800,
    dia: 86400,
    hora: 3600,
    minuto: 60,
};

export function formatarTempoAtras(dataString) {
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
