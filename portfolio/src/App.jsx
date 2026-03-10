import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Principal from "./pages/principal/principal";
import ProjetoDetalhes from "./pages/projeto/projeto";
import Sobre from "./pages/sobre/sobre";
import Error404 from "./pages/404/404";
import Chamados from "./pages/chamados/chamados";

export default function App() {
    const [dark, setDark] = useState(() => localStorage.getItem("tema") === "dark")

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark-mode");
            localStorage.setItem("tema", "dark");
        } else {
            document.documentElement.classList.remove("dark-mode");
            localStorage.setItem("tema", "light");
        }
    }, [dark])

    const alterarTema = () => setDark(!dark)

    return (
        <Routes>
            <Route path="/" element={<Principal dark={dark} mudarTema={alterarTema} />} />
            <Route path="/sobre" element={<Sobre dark={dark} mudarTema={alterarTema} />} />
            <Route path="/:slug" element={<ProjetoDetalhes dark={dark} mudarTema={alterarTema} />} />
            <Route path="/solicitacao" element={<Chamados dark={dark} mudarTema={alterarTema} />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    )
}