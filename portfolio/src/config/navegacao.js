import dadosContatos from "../../public/assets/data/contatos.json";

export const LINKS_NAVEGACAO = [
    { nome: "Sobre", path: "/sobre", externo: false },
    { nome: "Solicitação", path: "/solicitacao", externo: false },
    { nome: "Currículo", path: dadosContatos.cv, externo: true },
]