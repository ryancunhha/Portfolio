import { useState } from "react";
import { email } from "../../config/config";
import Agradecimento from "./agradecimento";
import Notificacao from "../../components/notificacao/notificacao";

export default function Solicitacao() {
    const [enviado, setEnviado] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);

        const formData = new FormData(e.target);
        for (let [key, value] of formData.entries()) {
            if (typeof value === "string") {
                formData.set(key, value.trim());
            }
        }

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                setEnviado(true);
            } else {
                setErro("Algo deu errado. Tente novamente.");
                setTimeout(() => setErro(null), 3500);
            }
        } catch (error) {
            setErro("Erro de conexão. Verifique sua internet.");
        } finally {
            setCarregando(false);
        }
    };

    if (enviado) return <Agradecimento />;

    const label = "block text-sm font-semibold mb-1";
    const input = "w-full px-4 py-3 border-2 border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 invalid:border-red-500 transition-colors duration-50";

    return (
        <>
            <Notificacao mensagem={erro} className="p-3 text-sm rounded-lg md:rounded-r-lg border-l-6 bg-red-100 text-red-700 border-red-700" />

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

                <form onSubmit={handleSubmit} className="p-8 space-y-4 max-w-2xl w-full border border-gray-400 rounded-2xl">
                    {/* Configurações do FormSubmit (Oculto) */}
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="text" name="_honeypot" style={{ display: "none" }} />
                    <input type="hidden" name="_autoresponse" value="custom message" />

                    {/* Campos de preenchimento (Visivel) */}
                    <div>
                        <label htmlFor="nome" className={label}>Nome Completo<span className="text-red-600">*</span></label>
                        <input maxLength={100} className={input} type="text" id="nome" name="name" autoComplete="name" placeholder="" required />
                    </div>

                    <div>
                        <label htmlFor="email" className={label}>E-mail<span className="text-red-600">*</span></label>
                        <input maxLength={100} className={input} type="email" id="email" name="email" autoComplete="email" placeholder="" required />
                    </div>

                    <div>
                        <label className={label} htmlFor="descricao">Descrição do Projeto<span className="text-red-600">*</span></label>
                        <textarea className={`${input} h-30 resize-none`} id="descricao" name="descricao" placeholder="" required />
                    </div>

                    <button title="Enviar" type="submit" disabled={carregando} className={`w-full py-3 px-6 text-white font-semibold rounded-sm ${carregando ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 outline-none cursor-pointer"}`}>
                        {carregando ? "Enviando..." : "Enviar"}
                    </button>
                </form>
            </div>
        </>)
}