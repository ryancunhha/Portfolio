import { createPortal } from "react-dom";

export default function Notificacao({ visivel, mensagem, progresso, onClose, onPausa, onDecorrer }) {

    return createPortal(
        <div onMouseEnter={onPausa} onMouseLeave={onDecorrer} className={`m-1.5 fixed bottom-5 md:bottom-2 right-0 z-11 transition-all duration-300 ease-in-out ${visivel ? "md:-translate-x-0.5" : "opacity-0 -translate-x pointer-events-none"}`}>

            <div className="bg-[#212023] w-full md:w-[35vw] overflow-hidden rounded-lg shadow-lg">

                <div className="flex justify-between items-center text-white px-4 py-2 gap-3">
                    <p className="text-sm">{mensagem}</p>

                    <button onClick={onClose} className="cursor-pointer text-xs underline opacity-80 hover:opacity-100">
                        Fechar
                    </button>
                </div>

                <div className="h-1">
                    <div className="h-full bg-green-400 transition-[widht] duration-75" style={{ width: `${progresso}%` }}></div>
                </div>

            </div>
        </div>, document.body
    )
}