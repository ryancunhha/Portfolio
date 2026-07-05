import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Dropdown from "../dropdown/dropdown";
import { rotasMenu, redes, email } from "../../config/config";

function Opcoes({ className }) {
    const [dropdownAberto, setDropdownAberto] = useState(false)
    const [ativadoLight, setAtivadoLight] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("light")
        }
        return false
    })

    const alterarTema = () => {
        const Light = document.documentElement.classList.toggle("light")
        localStorage.setItem("theme", Light ? "light" : "dark")
        setAtivadoLight(Light)
    }

    return (
        <div className={`flex flex-row items-center gap-3 ${className}`}>
            {/* TEMA */}
            <button type="button" onClick={alterarTema} className="cursor-pointer" title={ativadoLight ? "Modo Escuro" : "Modo Claro"} aria-label={ativadoLight ? "Ativar modo escuro" : "Ativar modo claro"}>
                {ativadoLight ? "🌙" : "☀️"}
            </button>

            {/* REDES */}
            <div className="mr-2 relative flex flex-row items-center">
                <button aria-label="Links das redes sociais" aria-expanded={dropdownAberto} type="button" onPointerDown={(e) => { e.stopPropagation(); setDropdownAberto(anterior => !anterior); }} className="p-1 md:hidden">
                    <p className="text-[#999] text-lg" aria-hidden="true">{dropdownAberto ? "▴" : "▾"}</p>
                </button>

                {dropdownAberto && (
                    <Dropdown className="md:hidden" items={redes} aoFechar={() => setDropdownAberto(false)} />
                )}

                {/* NO PC */}
                <div className="hidden md:flex flex-row items-center gap-3">
                    {redes.map((rede, id) => (
                        <a key={id} title={rede.label} href={rede.url} target="_blank" rel="noopener noreferrer" className="opacity-90">
                            <img className="object-contain" height="30" width="30" src={rede.icon} loading="eager" fetchPriority="low" alt={`Acessar meu perfil no ${rede.label}`} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function MenuHamburguer() {
    const [menuAberto, setMenuAberto] = useState(false)

    const alterarMenu = () => {
        setMenuAberto(!menuAberto)
    };

    const fecharMenu = () => {
        setMenuAberto(false)
    };

    return (
        <>
            {/* MOBILE */}
            <div className="md:hidden fixed top-0 left-0 w-full p-2 flex flex-row justify-between items-center z-3">
                {/* botao hamburguer mobile */}
                <button aria-label="Abrir menu de navegação" type="button" onClick={alterarMenu} className="p-3">
                    <div className="flex flex-col gap-1 w-6" aria-hidden="true">
                        <span className="h-1 bg-[#8B8B94] w-[80%]"></span>
                        <span className="h-1 bg-[#8B8B94] w-[80%]"></span>
                    </div>
                </button>

                <Opcoes />
            </div>

            {menuAberto && <div onClick={fecharMenu} className="fixed inset-0 bg-black/20 z-4 md:hidden animate-fade-in" />}

            {/* MENU */}
            <div className={`bg-[#0A0A0A] m-0.5 rounded-lg fixed top-0 h-[calc(100vh-6px)] z-5 flex flex-col justify-between transition-transform duration-200 ease-in-out w-[calc(100%-8px)] max-w-78 ${menuAberto ? "translate-x-0" : "-translate-x-[110%]"} md:static md:translate-x-0 md:h-screen md:w-64 md:max-w-none md:m-0 md:rounded-none`}>
                {/* HEAEDAR */}
                <div className="border-b border-[#29292A]">
                    {/* botao de fechar (mobile) */}
                    <div className="bg-[#18181B] rounded-t-lg pt-5 px-3 flex md:hidden">
                        <button type="button" onClick={alterarMenu} className="text-3xl text-white p-3" aria-label="Fechar menu de navegação">×</button>
                    </div>

                    {/* logo / nome */}
                    <div className="flex flex-row items-center m-4 p-2 rounded-lg bg-[#161616] text-white">
                        <img className="border rounded-full border-[#232323] select-none" src="https://github.com/ryancunhha.png?size=40" alt="Foto de perfil de Ryan Cunha" width="40" height="40" decoding="async" loading="eager" fetchPriority="low" />
                        <p className="ml-2 text-white text-wrap font-semibold">Ryan <span className="font-mono">Dev<span className="animate-[pulse_0.8s_steps(1,start)_infinite] text-green-500 select-none" aria-hidden="true">_</span></span></p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-2 py-2 md:mb-0 scrollbar-thumb-[#9F9F9F]">
                    {rotasMenu.map((link, index) => (
                        <NavLink key={index} to={link.path} onClick={() => setMenuAberto(false)} className={({ isActive }) => `flex p-4 rounded-md ${isActive ? "text-white bg-[#161616] border-l-8 border-white" : "text-[#999] hover:text-white hover:bg-[#161616] border-l-8 border-transparent"}`}>
                            {link.nome}
                        </NavLink>
                    ))}
                </nav>

                {/* rodape do menu (PC) */}
                <Opcoes className="hidden md:flex flex-wrap border-t border-[#29292A] py-8 px-6 select-none" />
            </div>
        </>
    );
}