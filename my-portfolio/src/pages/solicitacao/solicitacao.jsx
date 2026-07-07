import { useState } from "react";
import { email } from "../../config/config";
import Agradecimento from "./agradecimento";

export default function Solicitacao() {
    const [enviado, setEnviado] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
                method: "POST",
                body: new FormData(e.target),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                setEnviado(true);
            } else {
                console.log("Ops! Algo deu errado ao enviar. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro de conexão. Verifique sua internet.", error);
        } finally {
            setCarregando(false);
        }
    };

    if (enviado) return <Agradecimento />;

    const label = "block text-sm font-semibold mb-1";
    const input = "w-full px-4 py-2 border border-gray-300 rounded-sm text-gray-800 bg-gray-200 placeholder-gray-400";
    const subtextStyle = "text-xs mt-1 block font-light";

    return (
        <div className="py-8 px-4 flex flex-col items-center justify-center min-h-screen space-y-6 w-full">
            <div className="text-center space-y-3 max-w-2xl w-full">
                <h1 className="text-4xl font-extrabold tracking-tight">Solicitação de Serviço</h1>
                <h2 className="text-xl">Como fazer a sua solicitação?</h2>
                <p className="text-base">Escreva em detalhes o que você precisa, quais os passos importantes do processo e, se tiver, mencione algum site ou sistema que use como exemplo.</p>

                <p className="text-sm">
                    <strong className="font-semibold">Exemplo: </strong>
                    <em className="not-italic">"Quero um sistema que faça A, B e C"</em>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="px-4 sm:px-10 space-y-4 max-w-2xl w-full">
                {/* Configurações do FormSubmit (Oculto) */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" style={{ display: "none" }} />
                <input type="hidden" name="_autoresponse" value="Recebi sua solicitação! Em breve entrarei em contato para conversarmos sobre o seu projeto." />

                {/* Campos de preenchimento (Visivel) */}
                <div>
                    <label htmlFor="nome" className={label}>Nome Completo<span className="text-red-600">*</span></label>
                    <input className={input} type="text" id="nome" name="nome" placeholder="Ex: Fulano Da Silva" required />
                </div>

                <div>
                    <label htmlFor="email" className={label}>E-mail<span className="text-red-600">*</span></label>
                    <input maxLength={100} className={input} type="email" id="email" name="email" placeholder="Email@dominio.com" required />
                </div>

                <div>
                    <label className={label} htmlFor="descricao">Descrição do Projeto<span className="text-red-600">*</span></label>
                    <textarea className={`${input} h-30 resize-none`} id="descricao" name="descricao" placeholder="Descreva o que você quer. Quanto mais detalhes, melhor!" required />
                </div>

                <button type="submit" disabled={carregando} className={`w-full py-3 px-6 text-white font-semibold rounded-sm ${carregando ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 outline-none cursor-pointer"}`}>
                    {carregando ? "Enviando..." : "Solicitar"}
                </button>
            </form>
        </div>
    )
}