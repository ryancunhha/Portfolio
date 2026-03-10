import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

import Notificacao from "../../components/notificacao/notificacao";
import { useNotificacao } from "../../hooks/useNotificacao";
import Header from "../../components/header/header";
import { check } from "../../config/imagem";

export default function Chamados({ dark, mudarTema }) {
    const form = useRef()
    const [loading, setLoading] = useState(false)
    const [canSend, setCanSend] = useState(true)
    const [currency, setCurrency] = useState("BRL")
    const [message, setMessage] = useState("")
    const [links, setLinks] = useState([""])

    const navigate = useNavigate()
    const notificacao = useNotificacao(2500)

    const [phone, setPhone] = useState("")
    const [price, setPrice] = useState("")

    const [mostrarOpcionais, setMostrarOpcionais] = useState(false)
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
    const [enviadoComSucesso, setEnviadoComSucesso] = useState(false)

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
            const newLinks = links.filter((_, i) => i !== index)
            setLinks(newLinks)
        } else {
            handleLinkChange(0, "")
        }
    }

    useEffect(() => {
        document.title = "Solicitação"
    }, [])

    useEffect(() => {
        const travarScroll = mostrarConfirmacao || enviadoComSucesso


        if (travarScroll) {
            document.body.style.overflow = "hidden"
            document.documentElement.style.overflow = "hidden"
            document.body.style.touchAction = "none"
        } else {
            document.body.style.overflow = "unset"
            document.documentElement.style.overflow = "unset"
            document.body.style.touchAction = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
            document.documentElement.style.overflow = "unset"
            document.body.style.touchAction = "unset"
        }
    }, [mostrarConfirmacao, enviadoComSucesso])

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

    const currencySymbols = {
        BRL: "R$",
        USD: "$",
        EUR: "€",
        BTC: "BTC"
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
        if (e && e.preventDefault) e.preventDefault()

        const formData = new FormData(form.current)
        if (formData.get("honeypot")) return

        if (!canSend) {
            notificacao.mostrarNotificacao("Envio limitado: 1 envio por dia.")
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
        const TEMPLATE_NOTIFICACAO_ID = import.meta.env.VITE_TEMPLATE_NOTIFICACAO_ID
        const TEMPLATE_AUTOREPLY_ID = import.meta.env.VITE_TEMPLATE_AUTOREPLY_ID

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_NOTIFICACAO_ID, templateParams, PUBLIC_KEY)
            await emailjs.send(SERVICE_ID, TEMPLATE_AUTOREPLY_ID, templateParams, PUBLIC_KEY)

            localStorage.setItem("portfolio_last_send", new Date().toISOString())
            setCanSend(false)

            setEnviadoComSucesso(true)

            form.current.reset()
            setPhone("")
            setPrice("")
            setMessage("")
            setLinks([""])

            setTimeout(() => {
                setMostrarConfirmacao(false)
                setEnviadoComSucesso(false)
                navigate("/")
                window.scrollTo({ top: 0, behavior: "smooth" })
            }, 3000)
        } catch (error) {
            console.error("Erro ao enviar", error)
            notificacao.mostrarNotificacao("Ocorreu um erro. Tente novamente mais tarde.")
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
            <div className="group relative inline-block" ref={containerRef} onMouseEnter={() => setVisivel(true)} onMouseLeave={() => setVisivel(false)} >

                <button type="button" onClick={() => setVisivel(!visivel)} className={`w-3 h-3 border border-zinc-400 ${dark ? "" : "text-black!"} text-[9px] font-bold rounded-full flex items-center justify-center cursor-help`}>
                    ?
                </button>

                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 py-2 px-1 bg-zinc-900 text-white text-[8.5px] md:text-[10px] rounded shadow-xl border ${dark ? "border-zinc-700" : "border-zinc-900"} transition-opacity z-50 pointer-events-none ${visivel ? 'opacity-100' : 'opacity-0'}`}>
                    {texto}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-700"></div>
                </div>
            </div>
        )
    }

    const abrirConfirmacao = (e) => {
        e.preventDefault()
        setMostrarConfirmacao(true)
    }

    const handleConfirmarEnvio = () => {
        setMostrarConfirmacao(false)
        sendEmail()
    }

    return (
        <>
            <Notificacao visivel={notificacao.visivel} mensagem={notificacao.mensagem} progresso={notificacao.progresso} onClose={notificacao.esconderNotificacao} onPausa={notificacao.pausarNotificacao} onDecorrer={notificacao.retomarNotificacao} />

            {mostrarConfirmacao && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
                    <div className="bg-white w-full max-w-lg p-6 md:p-8 rounded-sm shadow-2xl border-4 border-black animate-fadeIn relative max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
                        <div className="flex justify-between">
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black">Checkout</h3>

                            <button className="w-8 h-8 flex items-center justify-center bg-zinc-100 text-black! hover:bg-black hover:text-white! transition-all rounded-full cursor-pointer" onClick={() => setMostrarConfirmacao(false)}>✕</button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-zinc-500! text-xs uppercase font-bold tracking-widest border-b pb-1">Verifique seu contato:</p>

                            <p className="text-[11px] bg-amber-50 text-amber-700! p-3 border-l-4 border-amber-400 leading-relaxed">
                                <strong>Atenção:</strong>
                                <span className="block mt-1 text-amber-700!">• Verifique seu e-mail, caso esteja errado não conseguirei te responder.</span>
                                <span className="block text-amber-700!">• Este formulário só pode ser enviado 1 vez por sessão.</span>
                            </p>

                            <div>
                                <span className="block text-[10px] text-zinc-400! uppercase font-black">Email para resposta:</span>
                                <span className="text-lg font-bold text-blue-600! break-all block max-w-full overflow-hidden">{form.current.user_email.value}</span>
                            </div>

                            <div>
                                <span className="block text-[10px] text-zinc-400! uppercase font-black">Seu Nome:</span>
                                <span className="text-lg font-bold text-black!">{form.current.user_name.value}</span>
                            </div>

                            {phone && (
                                <div>
                                    <span className="block text-[10px] text-zinc-400! uppercase font-black tracking-tight">Telefone:</span>
                                    <span className="text-lg font-bold text-black!">{phone}</span>
                                </div>
                            )}

                            {price && price !== "0,00" && price !== "0.00000000" && (
                                <div>
                                    <span className="block text-[10px] text-zinc-400! uppercase font-black tracking-tight">Orçamento Estimado:</span>
                                    <span className="text-lg font-bold text-green-600!">
                                        {currencySymbols[currency]} {price}
                                    </span>
                                </div>
                            )}

                            {links.some(l => l.trim() !== "") && (
                                <div>
                                    <span className="block text-[10px] text-zinc-400! uppercase font-black tracking-tight">Links de Referência:</span>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {links.filter(l => l.trim() !== "").map((l, i) => (
                                            <span key={i} className="text-xs text-blue-600! underline break-all block max-w-full overflow-hidden">
                                                {l}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <span className="block text-[10px] text-zinc-400! uppercase font-black tracking-tight">Seu pedido:</span>
                                <div className="max-h-28 overflow-y-auto border border-zinc-100 rounded bg-zinc-50 custom-scrollbar">
                                    <p className="text-sm font-medium text-zinc-800! leading-5.5 italic p-3 whitespace-pre-wrap break-words overflow-hidden">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 ">
                            <button onClick={() => setMostrarConfirmacao(false)} className="cursor-pointer w-full bg-black text-white! py-4 font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 border-2 border-black" >
                                Não, preciso corrigir algo
                            </button>

                            <button onClick={handleConfirmarEnvio} className="cursor-pointer w-full py-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400! hover:text-black! hover:bg-zinc-100 transition-all border border-zinc-200 rounded-sm" >
                                Tudo certo, enviar agora
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {enviadoComSucesso && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm p-8 rounded-sm shadow-2xl border-4 border-black animate-fadeIn relative flex flex-col items-center text-center">

                        <div className="mb-6">
                            <img className="h-20 w-20" src={check} alt="Sucesso" />
                        </div>

                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-black!">
                            Solicitação Finalizada
                        </h3>

                        <p className="text-zinc-600! text-xs font-medium leading-relaxed mb-8">
                            O e-mail foi processado com sucesso!<br />
                            Fique atento à sua caixa de entrada para mais informações.
                        </p>

                        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-full bg-black animate-shrink"></div>
                        </div>

                        <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400! mt-3">
                            Redirecionando em 3 segundos...
                        </span>
                    </div>
                </div>
            )}

            <Header dark={dark} mudarTema={mudarTema} />

            <main className="overflow-x-hidden">
                <section className="py-3 px-3 md:px-6 max-w-5xl mx-auto text-white">
                    <div className="md:py-6">
                        <h2 className={`text-2xl md:text-3xl font-bold md:mb-3 uppercase tracking-tighter ${dark ? "text-white!" : "text-black!"}`}>Faça sua Solicitação!</h2>

                        <div className="grid md:grid-cols-2 md:gap-10">
                            <div className="space-y-6 px-1 md:px-6 py-6 h-fit">
                                <div>
                                    <p className="text-black font-bold uppercase text-sm mb-2">Descreva sua ideia!</p>
                                    <p className={`${dark ? "" : "text-zinc-700!"} text-md`}>Tem um desafio técnico ou um novo projeto em mente? Explique como o sistema deve funcionar e quais objetivos você quer alcançar.</p>
                                </div>

                                <div className="space-y-3 text-zinc-700 italic text-sm">
                                    <p className="text-black font-bold uppercase text-sm mb-2">Exemplo:</p>
                                    <p>"Quero um sistema para fazer X, Y, Z"</p>
                                    <p>"Esse sistema deve me permitir fazer A, B, C, D"</p>
                                    <p><strong className="not-italic">💡 Dica:</strong> Se você ainda está em dúvida sobre o que pedir, não se preocupe! <span className={`${dark ? "text-blue-400!" : "text-blue-700!"} font-semibold`}>{<Link to={"/"}>Clique aqui</Link>}</span> para ver alguns dos meus trabalhos e ter uma ideia do que você precisa.</p>
                                </div>
                            </div>

                            <form ref={form} onSubmit={abrirConfirmacao} className={`flex flex-col gap-2 border border-gray-200 p-4 md:p-6 ${dark ? "bg-zinc-900 border-zinc-800 shadow-2xl" : "bg-gray-50! border-gray-200 shadow-sm"}`}>
                                <div>
                                    <h3 className={`text-xl font-bold ${dark ? "text-white!" : "text-zinc-900!"} tracking-tight mb-1`}>
                                        Solicitação de Projeto
                                    </h3>

                                    <p className="text-zinc-500! text-xs mb-1">Preencha os campos abaixo para iniciar seu pedido.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="user_name" className="text-xs text-zinc-400! uppercase">Nome<span className="text-[#ee4b1e]!">*</span></label>
                                        <input id="user_name" name="user_name" maxLength={20} required placeholder="Seu nome" type="text" className={`px-3 py-2 text-sm ${dark ? "text-white!" : "text-black!"} border border-zinc-800 rounded outline-none transition`} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="user_phone" className="text-xs text-zinc-400! uppercase flex flex-row gap-1">Telefone <Pergunta texto="Opcional. Facilita o suporte de dúvidas via WhatsApp." /></label>
                                        <input id="user_phone" name="user_phone" value={phone} onChange={handlePhone} placeholder="(00) 00000-0000" type="text" inputMode="numeric" className={`px-3 py-2 text-sm ${dark ? "text-white!" : "text-black!"} border border-zinc-800 rounded outline-none`} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="user_email" className="text-xs text-zinc-400! uppercase">Email<span className="text-[#ee4b1e]!">*</span></label>
                                    <input id="user_email" maxLength={100} name="user_email" required placeholder="Seu Email" type="email" className={`px-3 py-2 text-sm ${dark ? "text-white!" : "text-black!"} border border-zinc-800 rounded outline-none`} />
                                </div>

                                <button type="button" onClick={() => setMostrarOpcionais(!mostrarOpcionais)} className="cursor-pointer mt-2 flex justify-between items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors w-40">
                                    <span className={`${dark ? "" : "text-zinc-500! hover:text-black!"}`} >
                                        {mostrarOpcionais ? "− Ocultar Opcionais" : "+ Informações Opcionais"}
                                    </span>

                                    <span className={`transition-transform duration-300 ${dark ? "" : "text-zinc-500!"} ${mostrarOpcionais ? "rotate-180" : ""}`}>▼</span>
                                </button>

                                <div className={`grid transition-all duration-500 ease-in-out ${mostrarOpcionais ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
                                    <div className="min-h-0 flex flex-col gap-2">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="budget_currency" className="flex flex-row gap-1 text-xs text-zinc-400 uppercase">Orçamento <Pergunta texto="Opcional, Este é o valor inicial, poderá sofrer alterações." /></label>

                                            <div className={`flex flex-row border rounded overflow-hidden ${dark ? "border-zinc-800" : "border-zinc-300"}`}>
                                                <select id="budget_currency" name="currency" value={currency} onChange={(e) => { setCurrency(e.target.value); setPrice("") }} className="bg-zinc-900 text-zinc-300 text-xs font-bold px-3 outline-none cursor-pointer border-r border-zinc-700 hover:bg-zinc-800" >
                                                    <option value="BRL">BRL</option>
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="BTC">BTC</option>
                                                </select>

                                                <input id="budget_price" name="budget" value={price} onChange={handlePrice} placeholder={currency === "BTC" ? "0.00000000" : "0,00"} type="text" inputMode="numeric" className={`${dark ? "text-white!" : "text-black!"} w-full text-sm border-l border-zinc-800 outline-none px-3 py-2`} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="link-0" className="flex flex-row gap-1 text-xs text-zinc-400 uppercase">Link de Referência <Pergunta texto="Opcional, Links de Referência (YouTube, Drive, etc) max: 3" /></label>

                                            {links.map((link, index) => (
                                                <div key={index} className="flex flex-row text-black border w-full border-zinc-800 rounded overflow-hidden">
                                                    {index === 0 && links.length < 3 ? (
                                                        <button title="Adicionar novo link" type="button" onClick={addLink} className="w-10 bg-zinc-900 text-zinc-300 text-xs font-bold px-3 outline-none cursor-pointer border-r border-zinc-700 hover:bg-zinc-800">+</button>
                                                    ) : (
                                                        <button title="Remover este link" type="button" onClick={() => removeLink(index)} className="w-10 bg-zinc-900 text-red-400 text-xs font-bold px-3 outline-none cursor-pointer border-r border-zinc-700 hover:bg-zinc-800 transition-colors">-</button>
                                                    )}

                                                    <input id={`link-${index}`} type="url" placeholder={`https://exemplo-${index + 1}.com`} value={link} onChange={(e) => handleLinkChange(index, e.target.value)} className={`flex-1 min-w-0 w-full text-sm border-l border-zinc-800 outline-none px-3 py-2 ${dark ? "text-white!" : "text-black!"}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="message" className="text-xs text-zinc-400! uppercase">
                                        Como posso te ajudar?<span className="text-[#ee4b1e]!">*</span>
                                    </label>

                                    <textarea id="message" onChange={(e) => setMessage(sanitizeInput(e.target.value))} maxLength={800} name="message" required placeholder="Descreva seu pedido aqui detalhadamente..." rows="5" className={`text-sm px-3 py-2 ${dark ? "text-white!" : "text-black!"} border border-zinc-800 rounded outline-none`} />

                                    <span className={`text-[10px] ${message.length > 750 ? "text-orange-500!" : "text-zinc-500!"}`}>
                                        {message.length} / 800
                                    </span>
                                </div>

                                <div className="w-full flex flex-col gap-1">
                                    <button type="submit" disabled={loading || !canSend} className={`w-full p-4 rounded font-bold uppercase tracking-widest transition-all ${(!canSend || loading) ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white shadow-lg shadow-blue-900/20 active:scale-95"}`} >
                                        Enviar Solicitação
                                    </button>

                                    <div>
                                        <p className="text-[13px] text-zinc-700">Seus dados serão utilizados exclusivamente para o retorno desta solicitação, respeitando sua privacidade e o sigilo das informações.</p>
                                    </div>
                                </div>

                                <label htmlFor="honeypot" className="hidden">
                                    <input id="honeypot" type="text" name="honeypot" tabIndex="-1" autoComplete="off" />
                                </label>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}