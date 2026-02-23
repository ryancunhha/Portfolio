import { Link } from "react-router-dom";

import dadosContatos from "../../../data/contatos.json";
import dadosResumo from "../../../data/resumo.json";

export default function Shortcut({ onClose }) {
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
                <ul className="w-full font-medium list-none flex flex-col gap-1 my-1">
                    <li>
                        <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} title="Sobre Mim" to="/sobre" className="hover:underline cursor-pointer">Sobre</Link>
                    </li>

                    <li title="Faça sua solicitação">
                        <Link to={"/solicitacao"} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} rel="noreferrer" className="hover:underline cursor-pointer">Solicitação</Link>
                    </li>

                    <li className="flex flex-row items-center gap-1">
                        <a title="Currículo" target="_blank" rel="noreferrer" href={dadosContatos.cv} className="hover:underline cursor-pointer">Currículo</a>
                        <img className="h-3" src="https://img.icons8.com/sf-regular/90/external-link.png" alt="link" />
                    </li>
                </ul>
            </div>

        </div>
    )
}