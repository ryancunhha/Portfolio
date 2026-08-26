import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Dropdown from "../dropdown/dropdown";
import { rotasMenu, redes } from "../../config/config";

export default function MenuHamburguer() {
    const ultimoScroll = useRef(0);
    const menuRef = useRef(null);
    const [dropdownAberto, setDropdownAberto] = useState(false)
    const [visivel, setVisivel] = useState(true);
    const { pathname } = useLocation();
    const [menuAberto, setMenuAberto] = useState(false)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        setMenuAberto(false);
        setDropdownAberto(false);
    }, [pathname]);

    useEffect(() => {
        const onScroll = () => {
            const atual = window.scrollY;
            setVisivel(atual <= 60 || atual < ultimoScroll.current);
            ultimoScroll.current = atual;
            setMenuAberto(prev => prev ? false : prev);
            setDropdownAberto(prev => prev ? false : prev);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const clicarFora = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAberto(false);
                setDropdownAberto(false);
            }
        };

        if (menuAberto || dropdownAberto) document.addEventListener("mousedown", clicarFora);

        return () => document.removeEventListener("mousedown", clicarFora);
    }, [menuAberto, dropdownAberto]);

    return (
        <header ref={menuRef} className={`sticky top-0 z-5 w-full bg-[#141414]/60 backdrop-blur-md transition-transform duration-300 ${visivel ? "translate-y-0" : "-translate-y-full"}`}>
            <div className="mx-auto flex h-19 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 md:hidden">
                    <button type="button" onClick={() => setMenuAberto(prev => !prev)} className="p-2 text-[#8B8B94]" aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}>
                        <div className="flex flex-col gap-1 w-6 pointer-events-none">
                            <span className="h-1 bg-current w-[90%]" />
                            <span className={`h-1 bg-current transition-all duration-200 ease-in-out ${menuAberto ? "-translate-y-2.5 opacity-0 w-[90%]" : "w-[80%]"}`} />
                        </div>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <img fetchPriority="high" className="w-9 h-9 border border-[#202020] rounded-full" src="https://github.com/ryancunhha.png?size=40" alt="Perfil GitHub" />
                    <p className="text-white font-semibold hidden md:block">
                        Ryan Cunha <span>Dev<span className="animate-[pulse_0.8s_steps(1,start)_infinite] text-green-800 select-none">_</span></span>
                    </p>
                </div>

                <nav className="hidden md:flex flex-row items-center gap-2">
                    {rotasMenu.map((link, index) => (
                        <NavLink key={index} to={link.path} className="px-4 py-2 rounded-full text-sm text-white font-medium hover:bg-white/10">
                            {link.nome}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center">
                    <div className={`flex flex-row items-center gap-4`}>
                        <div className="relative flex flex-row items-center">
                            <button className="text-white text-2xl cursor-pointer hover:bg-white/10 py-0.5 px-2 rounded-full" type="button" onPointerDown={(e) => { e.stopPropagation(); setDropdownAberto(anterior => !anterior); }}>
                                {dropdownAberto ? "▴" : "▾"}
                            </button>

                            {dropdownAberto && <Dropdown items={redes} aoFechar={() => setDropdownAberto(false)} />}
                        </div>
                    </div>
                </div>
            </div>

            {menuAberto && (
                <div className={`absolute top-full left-0 w-full bg-[#141414] py-3 md:hidden`}>
                    <nav className="flex flex-col space-y-2">
                        {rotasMenu.map((link, index) => (
                            <NavLink key={index} to={link.path} onClick={() => setMenuAberto(false)}
                                className={({ isActive }) =>
                                    `py-4 px-3 ${isActive ? "text-white bg-[#181818] border-l-8 border-white" : "text-[#999] hover:text-white hover:bg-[#202020] border-l-8 border-transparent"}`
                                }
                            >
                                {link.nome}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}