import fs from "fs";
import { rotasMenu } from "./src/config/rotas.js";

async function generateSitemap() {
    const Rotas = rotasMenu.map(rota => rota.path === "/" ? "" : rota.path);
    const Data = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    Rotas.forEach(route => {
        const Incio = route === "";

        const priority = Incio ? "1.00" : "0.80";

        xml += `  <url>\n`;
        xml += `    <loc>https://ryancunha.vercel.app${route}</loc>\n`;
        xml += `    <lastmod>${Data}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    fs.mkdirSync("./public", { recursive: true });
    fs.writeFileSync("./public/sitemap.xml", xml);
}

async function generateLLM() {
    try {
        const response = await fetch(`https://api.github.com/orgs/estudos-ryan/repos?per_page=100`);

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const dados = await response.json();

        const texto = dados.map(repo => `### ${repo.name} 

- Tecnologia: ${repo.language || "Não informada"}
- Descrição: ${repo.description || "Não informada"}
- Tags: ${repo.topics?.join(", ") || "Nenhuma"}
- GitHub: ${repo.html_url}
- [Página do projeto](https://ryancunha.vercel.app/projetos/${repo.id})
`).join("\n");

        const paginas = rotasMenu.map(rota => `- [${rota.nome}](https://ryancunha.vercel.app${rota.path})`).join("\n")

        const llmTXT = `# Ryan Cunha
        
> Portfólio pessoal de Ryan Cunha, desenvolvedor de Web Full-Stack.
        
## Páginas principais
        
${paginas}
        
## Projetos

${texto}`

        fs.mkdirSync("./public", { recursive: true });
        fs.writeFileSync("./public/llms.txt", llmTXT, "utf8");
    } catch (error) {
        console.error(error);
    }
}

generateLLM();
generateSitemap();