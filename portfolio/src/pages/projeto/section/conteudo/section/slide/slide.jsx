import { useEffect, useState } from "react";
import { logo, zoom } from "../../../../../../config/index";

function ModalImagem({ index, imagens, onClose, onNavigate, alt }) {
    const [zoom, setZoom] = useState(false)

    useEffect(() => {
        if (index === null) return

        const originalStyleBody = window.getComputedStyle(document.body).overflow
        const originalStyleHtml = window.getComputedStyle(document.documentElement).overflow

        document.body.style.overflow = "hidden"
        document.documentElement.style.overflow = "hidden"

        const handleEsc = (e) => { if (e.key === "Escape") onClose(); }
        window.addEventListener("keydown", handleEsc)

        return () => {
            document.body.style.overflow = originalStyleBody
            document.documentElement.style.overflow = originalStyleHtml
            window.removeEventListener("keydown", handleEsc)
        }
    }, [index, onClose])

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col md:flex-row">
            <div className="absolute top-6 left-0 w-full flex justify-center pointer-events-none">
                <img loading="lazy" className="h-8" src={logo} alt="Logo" />
            </div>

            <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 text-white font-black bg-black/30 md:bg-white/0 md:hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all z-50">✕</button>

            <div className={`relative flex-1 flex items-center justify-center ${zoom ? "overflow-auto block" : "overflow-hidden"}`}>
                <img onClick={(e) => { e.stopPropagation(); setZoom(!zoom); }} src={imagens[index]} className={`transition-all duration-150 ease-in-out transform ${zoom ? "scale-100 cursor-zoom-out min-w-full my-auto block" : "max-w-[90vw] md:max-w-[90vw] max-h-[60vh] md:max-h-[80vh] object-contain scale-90 cursor-zoom-in"}`} alt={alt[index]} />

                {!zoom && (
                    <div className="z-40 absolute inset-x-0 flex justify-between px-1.5 md:px-3 pointer-events-none">
                        <button onClick={(e) => { e.stopPropagation(); onNavigate(-1); }} className="text-white/20 hover:text-white text-[3rem] md:text-[5rem] cursor-pointer pointer-events-auto">‹</button>
                        <button onClick={(e) => { e.stopPropagation(); onNavigate(1); }} className="text-white/20 hover:text-white text-[3rem] md:text-[5rem] cursor-pointer pointer-events-auto">›</button>
                    </div>
                )}
            </div>

            <div className="relative w-full md:w-65 flex flex-col gap-1 px-5 md:justify-center pt-2.5 pb-5" onClick={(e) => e.stopPropagation()} >
                <p className="text-white font-mono text-xs tracking-widest uppercase">
                    {index + 1} / {imagens.length}
                </p>

                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Galeria de Fotos | Clique na foto para expandir</p>

                {alt[index] && (
                    <p className="text-white/80 text-xs leading-relaxed font-light animate-in fade-in duration-500">
                        {alt[index]}
                    </p>
                )}
            </div>
        </div>
    )
}

export default function Slide({ imagens = [], altTexto }) {
    const [imagemAberta, setImagemAberta] = useState(null)

    if (!imagens || imagens.length <= 1) return null

    const imagensSlide = imagens.slice(1)

    return (
        <>
            <div className="my-6">
                <div className="relative group">
                    <div className="absolute inset-0 flex opacity-100 group-hover:opacity-0 transition-opacity duration-250 pointer-events-none">
                        <img className="bg-white rounded-br-sm cursor-zoom-in absolute p-px h-3.5" src={zoom} alt="Zoom" />
                    </div>

                    <div className="hidden md:flex absolute h-full w-full justify-between items-center pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-150">
                        <span className="pl-3 animate-[bounce-x_2s_infinite] text-3xl text-gray-500 transition-all duration-300 group-hover:-translate-x-2 group-hover:animate-pulse">‹</span>
                        <span className="pr-3 animate-[bounce-x_2s_infinite] text-3xl text-gray-500 transition-all duration-300 group-hover:translate-x-2 group-hover:animate-pulse">›</span>
                    </div>

                    <img onClick={() => setImagemAberta(0)} loading="lazy" src={imagensSlide[0]} className="bg-zinc-50 w-full aspect-video object-contain cursor-zoom-in" alt="Preview 1" />
                </div>

                <div className="flex gap-2.5 mt-2.5 h-16 md:h-17">
                    <button onClick={() => setImagemAberta(0)} className="relative shrink-0 w-23 md:w-25 h-full cursor-pointer" >
                        <img src={imagensSlide[0]} alt={altTexto[0]} className="w-full h-full object-cover brightness-50" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <span className="font-black leading-none">{`${imagensSlide.length} imagens`}</span>
                        </div>
                    </button>

                    {imagensSlide[1] && (
                        <button onClick={() => setImagemAberta(0)}
                            className="shrink-0 w-23 md:w-25 h-full cursor-pointer" >
                            <img src={imagensSlide[1]} className="w-full h-full object-cover" title={altTexto[1]} alt={altTexto[1]} />
                        </button>
                    )}

                    {imagensSlide[2] && (
                        <button onClick={() => setImagemAberta(0)} className="hidden md:block shrink-0 md:w-25 h-full cursor-pointer">
                            <img src={imagensSlide[2]} className="w-full h-full object-cover" title={altTexto[2]} alt={altTexto[1]} />
                        </button>
                    )}
                </div>
            </div>

            {imagemAberta !== null && (
                <ModalImagem alt={altTexto} index={imagemAberta} imagens={imagensSlide} onClose={() => setImagemAberta(null)} onNavigate={(direcao) => {
                    setImagemAberta((prev) => {
                        const total = imagensSlide.length
                        return (prev + direcao + total) % total
                    })
                }} />
            )}
        </>
    )
}