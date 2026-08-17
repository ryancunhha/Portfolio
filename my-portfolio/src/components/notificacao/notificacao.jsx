import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export function notificar(dados) {
    const payload = typeof dados === "string" ? { texto: dados } : dados;
    window.dispatchEvent(new CustomEvent("nova-notificacao", { detail: payload }));
}

const estilosTipo = {
    sucesso: "border-emerald-500 text-emerald-400 bg-emerald-950",
    info: "border-zinc-800 text-white bg-zinc-900",
}

export default function Notificacao({ mensagem }) {
    const [fila, setFila] = useState([]);

    useEffect(() => {
        const handleNovaNotificacao = (e) => {
            if (e.detail) {
                setFila((prev) => [...prev, e.detail]);
            }
        };

        window.addEventListener("nova-notificacao", handleNovaNotificacao);
        return () => window.removeEventListener("nova-notificacao", handleNovaNotificacao);
    }, []);

    useEffect(() => {
        if (fila.length === 0) return;

        const duracao = fila[0]?.duracao || 3500;

        const timer = setTimeout(() => {
            setFila((prev) => prev.slice(1));
        }, duracao);

        return () => clearTimeout(timer);
    }, [fila]);

    if (!fila || fila.length === 0 || !fila[0]) return null;

    const itemAtual = fila[0];
    const tipo = itemAtual.tipo || "info";
    const tipoEstilo = estilosTipo[tipo] || estilosTipo.info;

    return ReactDOM.createPortal(
        <div className={`fixed left-1/2 -translate-x-1/2 top-14 md:top-5 z-3 w-full max-w-sm px-4 py-3 font-medium text-center wrap-break-word rounded border ${tipoEstilo} ${itemAtual.className || ""}`}>
            {itemAtual.texto}
        </div>,
        document.body
    )
}