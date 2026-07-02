import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Erro() {
    const [segundos, setSegundos] = useState(10)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Erro 404"

        const timer = setInterval(() => {
            setSegundos((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setTimeout(() => navigate("/", { replace: true }), 0)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate])

    return (
        <div className="bg-[#1F1F1F] flex h-screen justify-center flex-col items-center">
            <p className="text-7xl text-white">404</p>
            <p className="text-sm text-white">Página não encontrada.</p>

            <p className="text-[10px] text-zinc-300 uppercase tracking-widest mt-4">
                Redirecionando para a página inicial em <span className="text-blue-500 font-bold">{segundos}s</span>
            </p>

            <Link to="/" className="text-sm text-[#5b88c3] hover:underline mt-2">
                Voltar agora
            </Link>
        </div>
    )
}