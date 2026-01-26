import { Link } from "react-router-dom";

import dadosContatos from "../../../data/contatos.json";
import dadosResumo from "../../../data/resumo.json";

function Shortcut({ onClose }) {
    return (
        <div className="flex flex-col">

            <div className="flex items-center justify-between">
                <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} to="/" className="cursor-pointer">
                    <img className="h-7" src={dadosResumo.marca} alt="Marca" title="Ir para página inicial" />
                </Link>

                <div className="my-1.5 flex justify-end max-w-max items-center">
                    <button title="Fechar Menu" className="cursor-pointer hover:opacity-50" onClick={onClose} >
                        ✕
                    </button>
                </div>
            </div>


            <div className="">
                <ul className="font-medium list-none flex flex-col gap-0.5 py-1">
                    <li>
                        <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} title="Sobre Mim" to="/sobre" className="hover:underline cursor-pointer">Sobre</Link>
                    </li>

                    <li>
                        <a title="Currículo" target="_blank" rel="noreferrer" href={dadosContatos.cv} className="hover:underline cursor-pointer">CV</a>
                    </li>

                </ul>
            </div>

        </div >
    )
}

export default Shortcut