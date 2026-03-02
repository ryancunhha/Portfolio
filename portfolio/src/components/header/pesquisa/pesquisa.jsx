import { useState } from "react";
import PesquisaModal from "./PesquisaModal/PesquisaModal";

<<<<<<< Updated upstream
function Pesquisa() {
=======
import { procura } from "../../../config/index";

export default function Pesquisa() {
>>>>>>> Stashed changes
    const [MenuAberto, setMenuAberto] = useState(false)

    return (
        <>
            <PesquisaModal aberto={MenuAberto} onClose={() => setMenuAberto(false)} />

            <div className="flex-1 flex justify-end">
                <button onClick={() => setMenuAberto(true)} className="flex flex-row items-center cursor-pointer">
                    <img className="hover:bg-black/10 transition-all duration-300 rounded-full h-7 w-7 p-1.5" src={procura} alt="Buscar" />
                </button>
            </div>
        </>
    )
}

export default Pesquisa