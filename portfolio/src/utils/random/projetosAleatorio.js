export function sortearProjetos(projetos, quantidade, slugAtual) {
    if (!Array.isArray(projetos)) return []
    
    const filtrados = projetos.filter(
        p => p.slug !== slugAtual
    )

    const embaralhados = [...filtrados].sort(() => Math.random() - 0.5)

    if (!projetos.length) return null

    return embaralhados.slice(0, quantidade)
}