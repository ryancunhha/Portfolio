import { useEffect, useState } from "react";

function ModalImagem({ index, imagens, onClose, onNavigate }) {
    if (index === null) return null

    return (
        <div className="fixed inset-0 z-30 bg-black/80 flex items-center justify-center" onClick={onClose}>
            <img src={imagens[index]} onClick={(e) => e.stopPropagation()} className="max-w-[75vw] md:max-w-[80vw] max-h-[80vh] object-contain" />
            <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 text-white" title="Fechar">✕</button>
            <button onClick={(e) => { e.stopPropagation(), onNavigate(-1) }} className="absolute left-4 text-white cursor-pointer text-5xl">‹</button>
            <button onClick={(e) => { e.stopPropagation(), onNavigate(1) }} className="absolute right-4 text-white cursor-pointer text-5xl">›</button>
        </div>
    )
}

export default function Slide({ imagens = [], intervalo = 3000 }) {
    const [indexAtual, setIndexAtual] = useState(0)
    const [autoPlay, setAutoPlay] = useState(false)
    const [imagemAberta, setImagemAberta] = useState(null)

    const imagensSlide = imagens.slice(1)

    useEffect(() => {
        if (!autoPlay || imagensSlide.length === 0) return;

        const id = setInterval(() => {
            setIndexAtual((prev) =>
                prev === imagensSlide.length - 1 ? 0 : prev + 1
            );
        }, intervalo);

        return () => clearInterval(id);
    }, [autoPlay, imagensSlide.length, intervalo]);

    if (!imagensSlide.length) return null;

    function selecionarImagem(index) {
        setIndexAtual(index);
        setAutoPlay(false);
    }

    function play() {
        setAutoPlay(true);
    }

    return (
        <>
            <div className="my-4">
                <div>
                    {!autoPlay && (
                        <div>
                            <button onClick={play} className="pt-1.5 pl-1.5 absolute">
                                <img title="Reproduzir Slide" className="bg-white/70 h-4.5 rounded-full cursor-pointer duration-250 hover:rotate-200" src="https://img.icons8.com/metro/90/synchronize.png" alt="icone-retormar" />
                            </button>

                            <img className="absolute mt-8 ml-1.5 bg-white/70 h-4.5 rounded-full duration-250" src="https://img.icons8.com/external-creatype-outline-colourcreatype/90/external-zoom-photo-camera-interface-creatype-outline-colourcreatype-2.png" alt="Zoom" />
                        </div>
                    )}

                    <div>
                        <img onClick={() => { if (!autoPlay) { setImagemAberta(indexAtual) } }} loading="lazy" src={imagensSlide[indexAtual]} alt="outras-imagens" className={`w-full h-full max-w-full aspect-video object-contain ${!autoPlay ? "cursor-zoom-in" : "cursor-default"}`} />
                    </div>
                </div>

                <div className="flex gap-2 my-3 overflow-x-auto">
                    {imagensSlide.map((img, index) => (
                        <button key={index} onClick={() => selecionarImagem(index)} className={`shrink-0 rounded-sm`}>
                            <img src={img} loading="lazy" className={`cursor-pointer w-20 h-15 object-contain bg-black ring-1 rounded-sm ${index === indexAtual ? "rounded-sm" : "opacity-50"}`} />
                        </button>
                    ))}
                </div>
            </div>

            {imagemAberta !== null && (
                <ModalImagem index={imagemAberta} imagens={imagensSlide} onClose={() => setImagemAberta(null)} onNavigate={(direcao) => {
                    setImagemAberta((prev) => {
                        const total = imagensSlide.length
                        return (prev + direcao + total) % total
                    })
                }} />
            )}
        </>
    )
}