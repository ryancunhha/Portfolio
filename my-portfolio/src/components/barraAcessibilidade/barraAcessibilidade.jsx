import { useState, useRef, useMemo, useCallback } from "react";

export default function BarraAcessibilidade({ textoAudio, setTamanhoFonte }) {
    const [status, setStatus] = useState("parado");
    const [progresso, setProgresso] = useState(0);
    const [velocidade, setVelocidade] = useState(1);
    const progressoRef = useRef(0);
    const utteranceRef = useRef(null);

    const tempoTotalBase = useMemo(() => {
        if (!textoAudio) return 0;
        const totalPalavras = textoAudio.trim().split(/\s+/).length;
        return Math.ceil((totalPalavras / 140) * 60);
    }, [textoAudio]);

    const tempoAtual = (progresso / 100) * tempoTotalBase / velocidade;

    const atualizarProgressoVisual = useCallback((valor) => {
        setProgresso(valor);
        progressoRef.current = valor;
    }, []);

    const executarFala = useCallback((porcentagemAlvo, velocidadeAtual = velocidade) => {
        window.speechSynthesis.cancel();
        if (!textoAudio) return;

        const totalCaracteres = textoAudio.length;
        const caractereInicial = Math.floor((porcentagemAlvo / 100) * totalCaracteres);
        const textoRestante = textoAudio.slice(caractereInicial);

        if (!textoRestante.trim() || porcentagemAlvo >= 100) {
            atualizarProgressoVisual(100);
            setStatus("parado");
            return;
        }

        const fala = new SpeechSynthesisUtterance(textoRestante);
        fala.lang = "pt-BR";
        fala.rate = velocidadeAtual;
        utteranceRef.current = fala;

        fala.onboundary = (event) => {
            if (event.name === "word") {
                const caractereAtual = event.charIndex + caractereInicial;
                const porcentagem = (caractereAtual / totalCaracteres) * 100;
                atualizarProgressoVisual(Math.min(100, porcentagem));
            }
        };

        fala.onend = () => {
            if (status === "tocando" || progressoRef.current >= 90) {
                setStatus("parado");
                atualizarProgressoVisual(100);
            }
        };

        fala.onerror = (e) => {
            if (e.error !== "interrupted") {
                setStatus("parado");
            }
        };

        window.speechSynthesis.speak(fala);
    }, [textoAudio, velocidade, atualizarProgressoVisual]);

    const alternarLeitura = () => {
        if (!textoAudio) return;

        if (status === "tocando") {
            window.speechSynthesis.cancel();
            setStatus("pausado");
        } else {
            setStatus("tocando");
            executarFala(progressoRef.current >= 100 ? 0 : progressoRef.current);
        }
    };

    const alterarProgresso = (e) => {
        const novaPorcentagem = Number(e.target.value);
        atualizarProgressoVisual(novaPorcentagem);

        if (status === "tocando") {
            executarFala(novaPorcentagem);
        } else {
            window.speechSynthesis.cancel();

            if (novaPorcentagem >= 100) {
                setStatus("parado");
            } else {
                setStatus("pausado");
            }
        }
    };

    const alterarVelocidade = (novaVelocidade) => {
        setVelocidade(novaVelocidade);
        if (status === "tocando") executarFala(progressoRef.current, novaVelocidade);
    };

    const formatarTempo = (segundos) => `${Math.floor(segundos / 60).toString().padStart(2, "0")}:${Math.floor(segundos % 60).toString().padStart(2, "0")}`;

    return (
        <div className="flex flex-col flex-wrap gap-2 select-none">
            <span className="text-xs font-medium">Ouvir:</span>

            <div className="flex flex-wrap gap-3">
                <button type="button" onClick={alternarLeitura} className="cursor-pointer font-bold w-6">
                    {status === "tocando" ? "❚❚" : "▶︎"}
                </button>

                <div className="flex items-center gap-2 flex-1 min-w-20">
                    <input id="progresso-audio" name="progressoAudio" type="range" min="0" max="100" step="0.1" value={progresso} onChange={alterarProgresso} className="w-full accent-blue-500 h-1 rounded-lg cursor-pointer" />
                    <span className="text-xs">{formatarTempo(tempoAtual)}</span>
                </div>

                <select id="velocidade-select" name="velocidadeSelect" value={velocidade} onChange={(e) => alterarVelocidade(Number(e.target.value))} className="text-xs outline-none cursor-pointer select-none bg-principal-bg transition-colors duration-200" >
                    {[1, 1.25, 1.5, 2].map(a => <option key={a} value={a}>{a}x</option>)}
                </select>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Fonte:</span>
                    <button onClick={() => setTamanhoFonte(prev => Math.max(12, prev - 2))} className="cursor-pointer font-bold px-1">A-</button>
                    <button onClick={() => setTamanhoFonte(prev => Math.min(28, prev + 2))} className="cursor-pointer font-bold px-1">A+</button>
                </div>
            </div>
        </div>
    );
}