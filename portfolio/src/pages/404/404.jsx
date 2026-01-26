import { useEffect } from "react";
import { Link } from "react-router-dom";
import Slug from "../../data/slugs/slugs.json";

function Erro() {
    useEffect(() => {
        document.title = Slug.erro
    })

    return (
        <div className="flex h-screen justify-center flex-col items-center">
            <p className="text-7xl">404</p>
            <p className="text-sm">Página não encontrada.</p>
            <Link to="/" className="text-sm text-[#5b88c3]">Home</Link>
        </div>
    )
}

export default Erro