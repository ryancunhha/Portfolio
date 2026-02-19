import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

import Notificacao from "../../components/notificacao/notificacao";
import { useNotificacao } from "../../hooks/useNotificacao";
import Header from "../../components/header/header";

function Chamados() {
    const form = useRef()
    const [loading, setLoading] = useState(false)
    const [canSend, setCanSend] = useState(true)
    const [currency, setCurrency] = useState("BRL")
    const [message, setMessage] = useState("")
    const [links, setLinks] = useState([""])

    const addLink = () => {
        if (links.length < 3) {
            setLinks([...links, ""])
        }
    }

    const sanitizeInput = (value) => {
        return value.replace(/<[^>]*>?/gm, "")
    }

    const handleLinkChange = (index, value) => {
        const cleanValue = sanitizeInput(value)
        if (cleanValue.length > 300) return

        const newLinks = [...links]
        newLinks[index] = cleanValue
        setLinks(newLinks)
    }

    const removeLink = (index) => {
        if (links.length > 1) {
            const newLinks = links.filter((_, i) => i !== index);
            setLinks(newLinks)
        } else {
            handleLinkChange(0, "")
        }
    }

    const currencySymbols = {
        BRL: "R$",
        USD: "$",
        EUR: "€",
        BTC: "BTC"
    }

    const notificacao = useNotificacao(2500)

    const [phone, setPhone] = useState("")
    const [price, setPrice] = useState("")

    useEffect(() => {
        document.title = "Solicitação"
    })

    useEffect(() => {
        const lastSend = localStorage.getItem("portfolio_last_send")

        if (lastSend) {
            const lastDate = new Date(lastSend)
            const now = new Date()
            const diffInHours = (now - lastDate) / (1000 * 60 * 60)

            if (diffInHours < 24) {
                setCanSend(false)
            }
        }
    }, [])

    const handlePhone = (e) => {
        let value = e.target.value.replace(/\D/g, "")

        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
        }

        if (value.length > 9) {
            value = value.replace(/(\d{5})(\d)/, "$1-$2")
        }

        if (value.length > 15) {
            value = value.substring(0, 15)
        }

        setPhone(value)
    }

    const handlePrice = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 12) value = value.substring(0, 12)

        if (currency === "BTC") {
            const btcValue = (Number(value) / 100000000).toFixed(8)
            setPrice(btcValue)
        } else {
            const locale = currency === "BRL" ? "pt-BR" : "en-US"

            value = (Number(value) / 100).toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })

            setPrice(value)
        }
    }

    const sendEmail = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        if (formData.get("honeypot")) return

        if (!canSend) {
            notificacao.mostrarNotificacao("Você já enviou uma solicitação hoje. Tente novamente mais tarde!")
            return
        }

        setLoading(true)

        const cleanName = sanitizeInput(form.current.user_name.value)
        const cleanEmail = sanitizeInput(form.current.user_email.value)
        const cleanMessage = sanitizeInput(form.current.message.value)

        const formattedBudget = price ? `${price} ${currencySymbols[currency]}` : `0,00 ${currencySymbols[currency]}`;
        const linksFormatados = links.filter(link => link.trim() !== "").join(", ")

        const templateParams = {
            user_name: cleanName,
            user_email: cleanEmail,
            user_phone: phone || "(00) 00000-0000",
            budget: formattedBudget,
            message: cleanMessage,
            user_links: linksFormatados || "Nenhum link.",
            date: new Date().toLocaleDateString("pt-BR")
        }

        const SERVICE_ID = import.meta.env.VITE_SERVICE_ID
        const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY
        const TEMPLATE_NOTIFICACAO_ID =  import.meta.env.VITE_TEMPLATE_NOTIFICACAO_ID
        const TEMPLATE_AUTOREPLY_ID =  import.meta.env.VITE_TEMPLATE_AUTOREPLY_ID

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_NOTIFICACAO_ID, templateParams, PUBLIC_KEY)
            await emailjs.send(SERVICE_ID, TEMPLATE_AUTOREPLY_ID, templateParams, PUBLIC_KEY)

            notificacao.mostrarNotificacao("Solicitação enviada com sucesso.")

            localStorage.setItem("portfolio_last_send", new Date().toISOString())

            setCanSend(false)
            form.current.reset()
            setPhone("")
            setPrice("")
            setMessage("")
            setLinks([""])
        } catch (error) {
            console.error("Erro ao enviar", error)
            notificacao.mostrarNotificacao("Ocorreu um erro ao processar seu pedido. Tente novamente mais tarde.")
        } finally {
            setLoading(false)
        }
    }

    const Pergunta = ({ texto }) => {
        const [visivel, setVisivel] = useState(false)
        const containerRef = useRef(null)

        useEffect(() => {
            const fecharClickFora = (e) => {
                if (containerRef.current && !containerRef.current.contains(e.target)) {
                    setVisivel(false)
                }
            }

            document.addEventListener('mousedown', fecharClickFora)
            return () => document.removeEventListener('mousedown', fecharClickFora)
        }, [])

        return (
            <div className="group relative inline-block ml-1" ref={containerRef} onMouseEnter={() => setVisivel(true)} onMouseLeave={() => setVisivel(false)} >

                <button type="button" onClick={() => setVisivel(!visivel)} className="w-3 h-3 border border-zinc-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center cursor-help">
                    ?
                </button>

                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 py-2 px-1 bg-zinc-900 text-white text-[8.5px] md:text-[10px] rounded shadow-xl border border-zinc-700 transition-opacity z-50 pointer-events-none ${visivel ? 'opacity-100' : 'opacity-0'}`}>
                    {texto}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Notificacao visivel={notificacao.visivel} mensagem={notificacao.mensagem} progresso={notificacao.progresso} onClose={notificacao.esconderNotificacao} onPausa={notificacao.pausarNotificacao} onDecorrer={notificacao.retomarNotificacao} />

            <main>
                <Header></Header>

                <section className="pt-18 pb-6 md:pb-0 px-6 max-w-5xl mx-auto text-white">
                    <div className="py-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase tracking-tighter text-black">Faça sua Solicitação!</h2>

                        <div className="grid md:grid-cols-2 gap-10">

                            <div className="space-y-6 px-1 md:px-6 py-6 h-fit">
                                <div>
                                    <p className="text-black font-bold uppercase text-sm mb-2">Descreva sua ideia!</p>
                                    <p className="text-zinc-700 text-md">Tem um desafio técnico ou um novo projeto em mente? Explique como o sistema deve funcionar e quais objetivos você quer alcançar.</p>
                                </div>

                                <div className="space-y-3 text-zinc-700 italic text-sm">
                                    <p className="text-black font-bold uppercase text-sm mb-2">Exemplo:</p>
                                    <p>"Quero um sistema para fazer X, Y, Z"</p>
                                    <p>"Esse sistema deve me permitir fazer A, B, C, D"</p>
                                    <p><strong className="not-italic">💡 Dica:</strong> Se você ainda está em dúvida sobre o que pedir, não se preocupe! <span className="text-blue-700 font-semibold">{<Link to={"/"}>Clique aqui</Link>}</span> para ver alguns dos meus trabalhos e ter uma ideia do que você precisa.</p>
                                </div>
                            </div>

                            <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-2 border border-gray-200 p-6 bg-gray-50">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="user_name" className="text-xs text-zinc-400 uppercase">Nome<span className="text-[#ee4b1e]">*</span></label>
                                        <input id="user_name" maxLength={20} name="user_name" required placeholder="Seu nome" type="text" className="px-3 py-2 text-sm text-black border border-zinc-800 rounded  outline-none transition" />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="user_phone" className="text-xs text-zinc-400 uppercase">Telefone <Pergunta texto="Opcional. Facilita o suporte e dúvidas rápidas via WhatsApp." /></label>
                                        <input id="user_phone" value={phone} onChange={handlePhone} name="user_phone" placeholder="(00) 00000-0000" type="text" inputMode="numeric" className="px-3 py-2 text-sm text-black border border-zinc-800 rounded outline-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="user_email" className="text-xs text-zinc-400 uppercase">Email<span className="text-[#ee4b1e]">*</span></label>
                                    <input id="user_email" maxLength={100} name="user_email" required placeholder="Seu Email" type="email" className="px-3 py-2 text-sm text-black border border-zinc-800 rounded outline-none" />
                                </div>

                                <div className="flex flex-col gap-1">

                                    <label htmlFor="budget" className="text-xs text-zinc-400 uppercase">Orçamento <Pergunta texto="Opcional, Este é o valor inicial, poderá sofrer alterações." /></label>

                                    <div className="flex flex-row text-black border w-full border-zinc-800 rounded">
                                        <select value={currency} onChange={(e) => { setCurrency(e.target.value); setPrice("") }} className="bg-zinc-900 text-zinc-300 text-xs font-bold px-3 outline-none cursor-pointer border-r border-zinc-700 hover:bg-zinc-800" >
                                            <option value="BRL">BRL</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="BTC">BTC</option>
                                        </select>

                                        <div className="w-full">
                                            <input id="budget" value={price} onChange={handlePrice} name="budget" placeholder={currency === "BTC" ? "0.00000000" : "0,00"} type="text" inputMode="numeric" className="w-full text-sm border-l outline-none px-3 py-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="link" className="text-xs text-zinc-400 uppercase">Link <Pergunta texto="Opcional, Links de Referência (YouTube, Drive, etc) max: 3" /></label>

                                    {links.map((link, index) => (
                                        <div key={index} className="flex flex-row text-black border w-full border-zinc-800 rounded">

                                            {index === 0 && links.length < 3 ? (
                                                <button title="Adicionar novo link" type="button" onClick={addLink} className="w-10 bg-zinc-900 text-zinc-300 text-xs font-bold px-3 outline-none cursor-pointer border-r border-zinc-700 hover:bg-zinc-800">+</button>
                                            ) : (
                                                <button title="Remover este link" type="button" onClick={() => removeLink(index)} className="w-10 bg-zinc-900 text-red-400 text-xs font-bold px-3 outline-none cursor-pointer border-r border-zinc-700 hover:bg-zinc-800 transition-colors">-</button>
                                            )}

                                            <input id={`link-${index}`} type="url" placeholder={`https://exemplo-${index + 1}.com`} value={link} onChange={(e) => handleLinkChange(index, e.target.value)} className="w-full text-sm border-l outline-none px-3 py-2" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="message" className="text-xs text-zinc-400 uppercase">
                                        Como posso te ajudar?<span className="text-[#ee4b1e]">*</span>
                                    </label>

                                    <textarea id="message" onChange={(e) => setMessage(sanitizeInput(e.target.value))} maxLength={800} name="message" required placeholder="Descreva seu pedido aqui detalhadamente..." rows="5" className="text-sm px-3 py-2 text-black border border-zinc-800 rounded outline-none" />

                                    <span className={`text-[10px] ${message.length > 750 ? 'text-orange-500' : 'text-zinc-500'}`}>
                                        {message.length} / 800
                                    </span>
                                </div>

                                <div className="w-full flex flex-col gap-1">
                                    <div className="flex justify-end">
                                        <Pergunta texto="Limite de no máximo até 1 solicitação a cada 24h." />
                                    </div>

                                    <button type="submit" disabled={loading || !canSend} className={`w-full p-4 rounded font-bold uppercase tracking-widest transition-all ${(!canSend || loading) ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white shadow-lg shadow-blue-900/20 active:scale-95"}`} >
                                        {loading ? "Enviando..." : canSend ? "Enviar Solicitação" : "Limite Diário Atingido"}
                                    </button>

                                    <div>
                                        <p className="text-[13px] text-zinc-700">Seus dados serão utilizados exclusivamente para o retorno desta solicitação, respeitando sua privacidade e o sigilo das informações.</p>
                                    </div>
                                </div>

                                <div htmlFor="honeypot" className="hidden">
                                    <input id="honeypot" type="text" name="honeypot" tabIndex="-1" autoComplete="off" />
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Chamados