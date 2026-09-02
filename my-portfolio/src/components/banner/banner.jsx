import { useState, useEffect } from "react";
const TEMPO_CARROSSEL_MS = 8000;

export default function Banner({ banners = [] }) {
    const [indexAtual, setIndexAtual] = useState(0);
    const [rodando, setRodando] = useState(true);
    const [direcao, setDirecao] = useState(null);
    const totalBanners = banners.length;
    const ComponenteBanner = (totalBanners > 0 && banners[indexAtual]) ? banners[indexAtual] : null;

    useEffect(() => {
        if (!rodando || totalBanners <= 1) return;

        const interval = setInterval(() => {
            setIndexAtual((prev) => {
                const proximo = (prev + 1) % totalBanners;
                setDirecao(proximo === 0 ? "esquerda" : "direita");
                return proximo;
            });
        }, TEMPO_CARROSSEL_MS);

        return () => clearInterval(interval);
    }, [rodando, totalBanners]);

    const proximoBanner = () => {
        if (totalBanners === 0) return;
        setDirecao("direita");
        setIndexAtual((prev) => (prev + 1) % totalBanners);
        setRodando(false);
    };

    const bannerAnterior = () => {
        if (totalBanners === 0) return;
        setDirecao("esquerda");
        setIndexAtual((prev) => (prev - 1 + totalBanners) % totalBanners);
        setRodando(false);
    };

    if (totalBanners === 0) return null;

    return (
        <div className="w-full">
            <div className="w-full h-100 overflow-hidden">
                <div key={indexAtual} className={direcao === "direita" ? "animacao-direita" : direcao === "esquerda" ? "animacao-esquerda" : ""}>
                    {ComponenteBanner && <ComponenteBanner />}
                </div>
            </div>

            {totalBanners > 1 && (
                <div className="w-full flex justify-between items-center pt-2 px-4 select-none">
                    <button title="Anterior" onClick={bannerAnterior} className="p-2 px-4 border-2 rounded-full cursor-pointer">❮</button>

                    <div className="flex items-center gap-1">
                        <div className="flex flex-wrap gap-1">
                            {banners.map((_, index) => (
                                <div key={index} className={`h-0.5 w-7 rounded-full ${index === indexAtual ? " bg-[#2A446F]" : "bg-[#E5ECF1]"}`} />
                            ))}
                        </div>

                        <button title={rodando ? "Pausar" : "Play"} onClick={() => setRodando((prev) => !prev)} className="w-7 border-2 rounded cursor-pointer px-1">
                            {rodando ? "❚❚" : "▶︎"}
                        </button>
                    </div>

                    <button title="Avançar" onClick={proximoBanner} className="p-2 px-4 border-2 rounded-full cursor-pointer">❯</button>
                </div>
            )}
        </div>
    )
}