import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../../components/header/ScrollToTop";

export default function Agradecimento() {
    const [segundos, setSegundos] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Solicitação Enviada";
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100vw";
        container.style.height = "100vh";
        container.style.pointerEvents = "none";
        container.style.zIndex = "10";
        container.style.overflow = "hidden";
        container.style.transition = "opacity 1.5s ease-out";
        container.style.opacity = "1";
        document.body.appendChild(container);
        const cores = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

        for (let i = 0; i < 50; i++) {
            const confete = document.createElement("div");
            const tamanho = Math.random() * 8 + 6;
            const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
            const posicaoX = Math.random() * 100;
            const atraso = Math.random() * 3;
            const duracao = Math.random() * 3 + 2;
            confete.style.position = "absolute";
            confete.style.width = `${tamanho}px`;
            confete.style.height = `${tamanho * (Math.random() > 0.5 ? 1.5 : 1)}px`;
            confete.style.backgroundColor = corAleatoria;
            confete.style.left = `${posicaoX}vw`;
            confete.style.top = "-20px";
            confete.style.opacity = Math.random().toString();
            confete.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
            confete.style.animation = `confete ${duracao}s linear ${atraso}s infinite`;
            container.appendChild(confete);
        }

        const iniciarFadeOut = setTimeout(() => {
            container.style.opacity = "0";
        }, 4000);

        const confeteTimer = setTimeout(() => {
            if (document.body.contains(container)) document.body.removeChild(container);
        }, 5500);

        const timer = setInterval(() => {
            setSegundos((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeout(() => navigate("/", { replace: true }), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            if (document.body.contains(container)) document.body.removeChild(container);
        };
    }, [navigate]);

    return (
        <div className="py-8 px-4 flex flex-col items-center justify-center min-h-screen space-y-4 w-full text-center relative overflow-hidden">
            <ScrollToTop />
            
            <style>
                {`
                    @keyframes confete {
                        0% { transform: translateY(0) rotate(0deg); }
                        100% { transform: translateY(105vh) rotate(720deg); }
                    }
                `}
            </style>

            <span className="text-6xl animate-bounce">✅</span>

            <h1 className="text-4xl font-extrabold tracking-tight text-blue-500">Solicitação Recebida!</h1>

            <div className="max-w-md space-y-2">
                <p className="text-lg font-medium">Muito obrigado pelo contato!</p>
                <p className="text-base">Acabei de receber do seu projeto no meu e-mail. Vou analisar tudo e te respondo o quanto antes.</p>
            </div>

            <p className="text-[10px] uppercase tracking-widest">
                Redirecionando para a página inicial em <span className="text-blue-500 font-bold">{segundos}s</span>
            </p>

            <Link to="/" className="text-sm text-[#5b88c3] hover:underline">
                Voltar agora
            </Link>
        </div>
    );
}