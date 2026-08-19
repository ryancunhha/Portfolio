import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Dropdown from "../dropdown/dropdown";
import { rotasMenu, redes, email } from "../../config/config";
import { notificar } from "../notificacao/notificacao";

function Opcoes({ className, mostrarNotificacao, setMostrarNotificacao }) {
    const [dropdownAberto, setDropdownAberto] = useState(false)

    const copiarEmail = () => {
        navigator.clipboard.writeText(email);
        notificar({
            texto: "✅ E-mail copiado!",
            tipo: "sucesso",
        });
    };

    useEffect(() => {
        if (!mostrarNotificacao) return;
        const timer = setTimeout(() => setMostrarNotificacao(false), 3500);
        return () => clearTimeout(timer);
    }, [mostrarNotificacao, setMostrarNotificacao]);

    return (
        <>
            <div className={`flex flex-row items-center gap-4 ${className}`}>
                <button type="button" onClick={copiarEmail} title="Copiar Email" className="cursor-pointer text-xl" aria-label="Copiar Email">📧</button>

                <div className="mr-2 relative flex flex-row items-center">
                    <button className="text-[#999] text-xl cursor-pointer" type="button" onPointerDown={(e) => { e.stopPropagation(); setDropdownAberto(anterior => !anterior); }}>
                        {dropdownAberto ? "▴" : "▾"}
                    </button>

                    {dropdownAberto && <Dropdown items={redes} aoFechar={() => setDropdownAberto(false)} />}
                </div>
            </div>
        </>
    )
}

export default function MenuHamburguer() {
    const { pathname } = useLocation();
    const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false)

    const alterarMenu = () => setMenuAberto(!menuAberto);

    useEffect(() => {
        const elementoMain = document.querySelector("main");

        if (elementoMain) {
            elementoMain.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    }, [pathname]);

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 w-full p-2 flex flex-row justify-between items-center z-2">
                <button aria-label="Abrir menu" type="button" onClick={alterarMenu} className="p-3">
                    <div className="flex flex-col gap-1 w-6">
                        <span className="h-1 bg-[#8B8B94] w-[80%]" />
                        <span className="h-1 bg-[#8B8B94] w-[80%]" />
                    </div>
                </button>

                <Opcoes mostrarNotificacao={mostrarNotificacao} setMostrarNotificacao={setMostrarNotificacao} />
            </div>

            {menuAberto && <div onClick={alterarMenu} className="fixed inset-0 bg-black/50 z-4 md:hidden" />}

            <header className={`bg-[#0A0A0A] fixed top-0 left-0 h-screen z-5 flex flex-col justify-between transition-transform duration-150 ease-in-out w-[calc(100%-8px)] max-w-74 ${menuAberto ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}>
                <div>
                    <div className="bg-[#18181B] pt-5 px-3 flex md:hidden">
                        <button type="button" onClick={alterarMenu} className="text-3xl text-white p-3">×</button>
                    </div>

                    <div className="flex flex-row items-center m-4 p-3 rounded-lg bg-[#161616] text-white">
                        <p className="flex items-center justify-center font-black border rounded-full border-[#232323] h-10 w-10">RC</p>
                        <p className="ml-2 text-white font-semibold">Ryan Cunha <span>Dev<span className="animate-[pulse_0.8s_steps(1,start)_infinite] text-green-800 select-none">_</span></span></p>
                    </div>
                </div>

                <Opcoes mostrarNotificacao={mostrarNotificacao} setMostrarNotificacao={setMostrarNotificacao} className="hidden md:flex flex-wrap p-8" />

                <nav className="flex-1 overflow-y-auto px-4 space-y-2 py-2 scrollbar-thumb-[#9F9F9F]">
                    {rotasMenu.map((link, index) => (
                        <NavLink key={index} to={link.path} onClick={() => setMenuAberto(false)} className={({ isActive }) => `flex p-4 rounded-md ${isActive ? "text-white bg-[#161616] border-l-8 border-white" : "text-[#999] hover:text-white hover:bg-[#161616] border-l-8 border-transparent"}`}>
                            {link.nome}
                        </NavLink>
                    ))}
                </nav>
            </header>
        </>
    )
}