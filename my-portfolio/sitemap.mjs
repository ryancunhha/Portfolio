import fs from "fs";
import { rotasMenu, ignorarRepo } from "./src/config/rotas.js";

async function generateSitemap() {
    let dynamicRoutes = [];

    try {
        const response = await fetch(`https://api.github.com/orgs/estudos-ryan/repos?per_page=50`);

        if (!response.ok)  throw new Error(`GitHub API: ${response.status}`);
        
        const dados = await response.json();
        dynamicRoutes = dados.filter(repo => !repo.fork && !ignorarRepo.includes(repo.name)).map(repo => `/projetos/${repo.name}`);
    } catch (error) {
        console.error("Erro ao buscar projetos do GitHub:", error);
    }

    const staticRoutes = rotasMenu.map(rota => rota.path === "/" ? "" : rota.path);
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    const currentDate = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    allRoutes.forEach(route => {
        const isHome = route === "";
        const isDynamicProject = route.includes("/projetos/");

        const priority = isHome ? "1.00" : (isDynamicProject ? "0.60" : "0.80");
        const freq = isHome ? "daily" : (isDynamicProject ? "monthly" : "weekly");

        xml += `  <url>\n`;
        xml += `    <loc>https://ryancunha.vercel.app${route}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += `    <changefreq>${freq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    fs.mkdirSync("./public", { recursive: true });
    fs.writeFileSync("./public/sitemap.xml", xml);
    
    console.log("✅ sitemap.xml gerado!");
}

generateSitemap();