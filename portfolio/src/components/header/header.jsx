import { useState } from "react";
import { Link } from "react-router-dom";

import Menu from "./Menu/Menu";
import Bar from "../bar/Bar";
import Pesquisa from "./pesquisa/pesquisa";

import dadosResumo from "../../data/resumo.json";

function Header(params) {
    const [abertura, setAberta] = useState(false)

    return (
        <>
            <Bar aberta={abertura} onClose={() => setAberta(false)} />

            <header className="fixed top-0 left-0 z-8 h-14 w-full bg-white">

                <div className="h-14 p-4 flex flex-row items-center justify-between">
                    <div>
                        <Menu onClick={() => setAberta(true)} />
                    </div>

                    <Link onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" })}} to="/" className="cursor-pointer flex bg-white">
                        <img className="h-10 brightness-110 bg-white" src={dadosResumo.marca} alt="" title="Ir para página inicial" />
                    </Link>

                    <div>
                        <Pesquisa />
                    </div>
                </div>

            </header>
        </>
    )
}

export default Header