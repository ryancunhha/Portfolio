import { useState } from "react";
import { email } from "../../config/config";
import { notificar } from "../../components/notificacao/notificacao";

export default function Solicitacao() {
    const [carregando, setCarregando] = useState(false);

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

            if (!response.ok) throw new Error("Erro ao enviar o formulário.");

            notificar({
                texto: "✅ Email Enviado com sucesso.",
                tipo: "sucesso",
            })

            e.target.reset();
        } catch (error) {
            console.error(error);

            notificar({
                texto: "❌ Erro de conexão com o servidor.",
                tipo: "falha",
            })
        } finally {
            setCarregando(false);
        }
    };

    const label = "block text-sm font-semibold mb-1";
    const input = "text-xl w-full px-4 py-3 border-2 border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 invalid:border-red-500 transition-colors duration-50";

    return (
        <>
            <div className="py-8 px-4 flex flex-col items-center min-h-screen space-y-6 w-full">
                <div className="text-center space-y-3 max-w-2xl w-full">
                    <h1 className="text-4xl font-extrabold tracking-tight">Solicitação de Serviço</h1>
                    <h2 className="text-xl">Como fazer a sua solicitação?</h2>
                    <p className="text-base">Escreva em detalhes o que você precisa, quais os passos importantes do processo e se tiver.</p>

                    <p className="text-sm">
                        <strong className="font-semibold">Exemplo: </strong>
                        <em className="not-italic">"Quero um sistema que faça A, B e C"</em>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-4 md:px-10 py-8 space-y-4 max-w-2xl w-full border-y-3 border-gray-400">
                    {/* Configurações do FormSubmit (Oculto) */}
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="text" name="_honey" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />
                    <input type="hidden" name="_subject" value="Solicitação de Serviço" />

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
        </>
    )
}