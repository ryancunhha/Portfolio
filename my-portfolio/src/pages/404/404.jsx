import { useEffect, useState } from "react";

export default function Erro() {
    const [segundos, setSegundos] = useState(10)

    useEffect(() => {
        document.title = "Erro 404"

        const timer = setInterval(() => {
            setSegundos((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    window.location.href = "/"
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="bg-[#18181B] flex h-screen justify-center flex-col items-center">
            <p className="text-7xl text-white">404</p>
            <p className="text-sm text-white">Página não encontrada.</p>

            <p className="text-[10px] text-zinc-300 uppercase tracking-widest mt-4">
                Redirecionando para a página inicial em <span className="text-blue-500 font-bold">{segundos}s</span>
            </p>

            <a to="/" className="text-sm text-[#5b88c3] hover:underline mt-2">Voltar agora</a>
        </div>
    )
}