const fs = require("fs");

let rotasMenu = [];
let ignorarRepo = [];

try {
    const config = require("./src/config/config.js");
    ignorarRepo = config.ignorarRepo || [];
} catch (e) {
    ignorarRepo = [];
}

async function generateSitemap() {
    const baseUrl = "https://ryancunha.vercel.app";

    let dynamicRoutes = [];

    try {
        const response = await fetch(`https://api.github.com/users/ryancunhha/repos?sort=pushed&per_page=100`);
        const dados = await response.json();
        dynamicRoutes = dados.filter(repo => !repo.fork && !ignorarRepo.includes(repo.name)).map(repo => `/projetos/${repo.name}`);
    } catch (error) {
        console.error("Erro ao buscar projetos do GitHub:", error);
    }

    const staticRoutes = ["", "/projetos", "/sobre", "/solicitacao", "/curriculos"]; // seria "/" inves de ""
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
        xml += `    <loc>${baseUrl}${route}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += `    <changefreq>${freq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    if (!fs.existsSync("./public")) {
        fs.mkdirSync("./public");
    }

    fs.writeFileSync("./public/sitemap.xml", xml);
    console.log("✅ sitemap.xml gerado!");
}

generateSitemap();