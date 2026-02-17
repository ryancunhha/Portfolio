import { useState } from "react";
import PesquisaModal from "./PesquisaModal/PesquisaModal";

function Pesquisa() {
    const [MenuAberto, setMenuAberto] = useState(false)

    return (
        <>
            <PesquisaModal aberto={MenuAberto} onClose={() => setMenuAberto(false)} />
            
            <div className="flex-1 flex justify-end">
                <button onClick={() => setMenuAberto(true)} title="Buscar projetos" className="flex flex-row items-center cursor-pointer">
                    <img className="h-4 w-4" src="https://img.icons8.com/ios-filled/92/window-search.png" alt="Lupa" />
                    <span className="hidden md:inline font-bold text-xs tracking-tighter">Busca</span>
                </button>
            </div>
        </>
    )
}

export default Pesquisa