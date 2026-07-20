import { rotasMenu, ignorarRepo } from "./rotas.js";
import BannerPessoal from "./banners/Pessoal";
import BannerAutomacao from "./banners/Automacao";

const BANNERS = [
    BannerPessoal,
];

const email = "ryancunhha@outlook.com"

const redes = [
    { label: "Twitter / X", url: "https://x.com/ryancunhha", icon: "https://img.icons8.com/ios-filled/50/FFFFFF/twitterx--v1.png" },
    { label: "GitHub", url: "https://github.com/ryancunhha", icon: "https://img.icons8.com/ios-filled/50/FFFFFF/github.png" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/ryancunhha", icon: "https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png" },
]

export { rotasMenu, redes, email, ignorarRepo, BANNERS }