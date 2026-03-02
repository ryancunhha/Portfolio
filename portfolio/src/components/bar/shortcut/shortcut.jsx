import { LINKS_NAVEGACAO } from "../../../config/navegacao";
import { Link } from "react-router-dom";

import { logo, linkExterno } from "../../../config/index";

function Shortcut({ onClose }) {
    return (
        <div className="flex flex-col">

            <div className="flex items-center justify-between">
                <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); onClose(); }} to="/" aria-label="Ir para a página inicial">
                    <img className="h-9" src={logo} alt="Logo" />
                </Link>

                <button className="text-xl my-2 mr-2.5 max-w-max items-center flex justify-end hover:opacity-50" onClick={onClose} >
                    ✕
                </button>
            </div>

<<<<<<< Updated upstream

            <div className="">
                <ul className="font-medium list-none flex flex-col gap-0.5 py-1">
                    <li>
                        <Link onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} title="Sobre Mim" to="/sobre" className="hover:underline cursor-pointer">Sobre</Link>
                    </li>

                    <li>
                        <a title="Currículo" target="_blank" rel="noreferrer" href={dadosContatos.cv} className="hover:underline cursor-pointer">CV</a>
                    </li>

                    <li title="Faça sua solicitação">
                        <Link to={"/solicitacao"} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }) }} rel="noreferrer" className="hover:underline cursor-pointer">Solicitação</Link>
                    </li>
=======
            <nav>
                <ul className="ml-1 mt-3 flex flex-col gap-4 list-none">
                    {LINKS_NAVEGACAO.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 group">
                            {item.externo ? (
                                <a href={item.path} target="_blank" rel="noreferrer" className="uppercase tracking-tighter flex items-center gap-2" >
                                    {item.nome}
                                    <img className="h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" src={linkExterno} alt="link" />
                                </a>
                            ) : (
                                <Link to={item.path} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); onClose(); }} className="uppercase tracking-tighter" >
                                    {item.nome}
                                </Link>
                            )}
                        </li>
                    ))}
>>>>>>> Stashed changes
                </ul>
            </nav>
        </div>
    )
}

export default Shortcut