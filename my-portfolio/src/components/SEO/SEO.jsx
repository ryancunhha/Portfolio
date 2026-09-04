import { rotasMenu } from "../../config/rotas";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const URL_BASE = "https://ryancunha.vercel.app";

export default function SEO() {
    const { pathname } = useLocation()

    const rota = rotasMenu.find((rota) => rota.path === pathname)

    if (!rota) return null

    const url = `${URL_BASE}${rota.path}`

    return (
        <Helmet>
            <link rel="canonical" href={url} />
            <meta name="description" content={rota.description} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content="Portfólio de Ryan Cunha" />
            <meta property="og:description" content={rota.description} />
            <meta property="og:image" content={`${URL_BASE}/favicon.ico`} />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Portfólio de Ryan Cunha" />
            <meta name="twitter:description" content={rota.description} />
            <meta property="og:image" content={`${URL_BASE}/favicon.ico`} />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />
        </Helmet>
    )
}