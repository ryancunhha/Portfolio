import { useState } from "react";

import Slide from "./section/slide/slide";
import OutroProjetos from "./section/outrosProjetos/outrosProjetos";
import Comentarios from "./section/comentarios/comentarios";

function Conteudo({ projeto }) {
    const [imagemAberta, setImagemAberta] = useState(null)
    const comentarios = projeto?.conteudo?.comentarios

    function renderTextoComLink(texto) {
        const regex = /\[(https?:\/\/[^\]|]+)(?:\|([^\]]+))?\]/g
        const partes = texto.split(regex)

        return partes.map((parte, index) => {
            if (index % 3 === 1) {
                const link = parte
                const textoLink = partes[index + 1]
                const textoFinal = textoLink ? textoLink : link.replace("https://", "").replace("http://", "").replace("www", "").split("/")[0]

                return (
                    <a key={index} title={link} href={link} target="_blank" rel="noopener noreferrer" className="cursor-pointer underline text-black hover:no-underline">{textoFinal}</a>
                )
            }

            if (index % 3 === 2) return null

            return <span key={index}>{parte}</span>
        })
    }

    function ModalImagem({ src, onClose }) {
        if (!src) return null

        return (
            <div className="fixed inset-0 z-30 bg-black/80 flex items-center justify-center" onClick={onClose}>
                <img src={src} onClick={(e) => e.stopPropagation()} className="max-w-[95vw] md:max-w-[80vw] max-h-[80vh] object-contain" />
                <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 text-white" title="Fechar">✕</button>
            </div>
        )
    }

    return (
        <>
            {imagemAberta && (
                <ModalImagem src={imagemAberta} onClose={() => setImagemAberta(null)} />
            )}

            <div className="my-2.5">
                <div>
                    <img className="absolute mt-1.5 ml-1.5 bg-white/70 h-4 rounded-full duration-250" src="https://img.icons8.com/external-creatype-outline-colourcreatype/90/external-zoom-photo-camera-interface-creatype-outline-colourcreatype-2.png" alt="Zoom" />
                    <img onClick={() => setImagemAberta(projeto.imagem[0])} loading="lazy" className="cursor-zoom-in w-full aspect-video object-contain" src={projeto.imagem[0]} alt="imagens-principal" />
                </div>

                <div className="mt-4">
                    {projeto.conteudo.paragrafo?.map((texto, index) => (
                        <p key={index} className="mb-4 tracking-tighter">{renderTextoComLink(texto)}</p>
                    ))}
                </div>

                <OutroProjetos slugAtual={projeto.slug} />

                <div>
                    {projeto.conteudo["paragrafo-2"]?.map((texto, index) => (
                        <p key={index} className="mb-4 tracking-tighter">{renderTextoComLink(texto)}</p>
                    ))}
                </div>

                <Slide imagens={projeto.imagem} />

                <div>
                    {projeto.conteudo["paragrafo-3"]?.map((texto, index) => (
                        <p key={index} className="mb-4 tracking-tighter">{renderTextoComLink(texto)}</p>
                    ))}
                </div>

                <Comentarios comentarios={comentarios} />
            </div>
        </>
    )
}

export default Conteudo