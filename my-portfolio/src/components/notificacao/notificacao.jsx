import { useEffect, useState } from "react";

export default function AlertError({ mensagem, className }) {
    const [renderizar, setRenderizar] = useState(false);
    const [animarSaida, setAnimarSaida] = useState(false);

    if (!mensagem) return null;

    useEffect(() => {
        if (mensagem) {
            setRenderizar(true);
            setAnimarSaida(false);
        } else if (renderizar) {
            setAnimarSaida(true);
            const timer = setTimeout(() => {
                setRenderizar(false);
            }, 400);

            return () => clearTimeout(timer);
        }
    }, [mensagem, renderizar]);

    if (!renderizar) return null;

    return (
        <div
            className={`
                /* Posicionamento fixo */
                fixed z-3 break-words whitespace-pre-line
                
                /* ESTILO */
                ${className}
                
                /* Celular */
                top-14 left-1/2 w-[90%] max-w-sm
                ${animarSaida ? "animate-slide-out-top" : "animate-slide-in-top"}
                
                /* COMPUTADOR */
                md:top-auto md:bottom-3 md:left-67 md:w-auto md:max-w-xs 
                ${animarSaida ? "animate-notification-out" : "animate-notification-in"}
            `}
        >
            {mensagem}
        </div>
    )
}