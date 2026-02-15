import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Erro() {
    const [segundos, setSegundos] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Erro 404"

        if (segundos === 0) {
            navigate("/")
            return
        }

        const timer = setInterval(() => {
            setSegundos((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [segundos, navigate])

    return (
        <div className="flex h-screen justify-center flex-col items-center">
            <p className="text-7xl">404</p>
            <p className="text-sm">Página não encontrada.</p>

            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-4">
                Redirecionando para a Home em <span className="text-blue-500 font-bold">{segundos}s</span>
            </p>

            <Link to="/" className="text-sm text-[#5b88c3] hover:underline mt-2">
                Voltar agora
            </Link>
        </div>
    )
}