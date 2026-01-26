export function slugify(text = "") {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD") // separa acentos
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^a-z0-9\s-]/g, "") // remove símbolos
        .trim() // remove espaços nas pontas
        .replace(/\s+/g, "-") // espaços → -
        .replace(/-+/g, "-"); // evita --
}
