import { LINKS_NAVEGACAO } from "../../../config/navegacao";
import { Link } from "react-router-dom";

import { logo, linkExterno } from "../../../config/imagem";

export default function Shortcut({ dark, onClose }) {
    return (
        <div className="flex flex-col">

            <div className="flex items-center justify-between">
                <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); onClose(); }} to="/" className="cursor-pointer" aria-label="Ir para a página inicial">
                    <img className="h-9" src={logo} alt="Logo" />
                </Link>

                <button className="cursor-pointer text-xl my-2 mr-2.5 max-w-max items-center flex justify-end hover:opacity-50" onClick={onClose} >
                    ✕
                </button>
            </div>

            <nav>
                <ul className="mt-2 flex flex-col gap-4 list-none">
                    {LINKS_NAVEGACAO.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 group">
                            {item.externo ? (
                                <a href={item.path} target="_blank" rel="noreferrer" className="uppercase tracking-tighter flex items-center gap-2" >
                                    <span className={`transition-colors peer ${dark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}`}>{item.nome}</span>
                                    <img className={`h-2.5 w-2.5 transition-all duration-300 opacity-30 peer-hover:opacity-100 ${dark ? "invert" : ""}`} src={linkExterno} alt="link" />
                                </a>
                            ) : (
                                <Link to={item.path} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); onClose(); }} className="uppercase tracking-tighter" >
                                    {item.nome}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}