import { useState, useRef, useMemo, useCallback, useEffect } from "react";

export default function BarraAcessibilidade({ textoAudio, setTamanhoFonte }) {
    const [status, setStatus] = useState("parado");
    const [progresso, setProgresso] = useState(0);
    const [tempoAtual, setTempoAtual] = useState(0);
    const timerRef = useRef(null);
    const inicioTimerRef = useRef(0);
    const tempoInicialRef = useRef(0);
    const [velocidade, setVelocidade] = useState(1);
    const progressoRef = useRef(0);
    const utteranceRef = useRef(null);
    const canceladoManualmenteRef = useRef(false);

    const textoLimpo = useMemo(() => {
        if (!textoAudio) return "";
        return textoAudio.replace(/https?:\/\/\S+/g, "").replace(/[#*`_\-\[\]()]/g, "").replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "");
    }, [textoAudio]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            clearInterval(timerRef.current);
        };
    }, []);

    const tempoTotalBase = useMemo(() => {
        if (!textoLimpo) return 0;
        const totalPalavras = textoLimpo.trim().split(/\s+/).length;
        return Math.ceil((totalPalavras / 140) * 60);
    }, [textoLimpo]);

    const iniciarTimer = useCallback((tempoInicial, velocidadeAtual) => {
        clearInterval(timerRef.current);

        tempoInicialRef.current = tempoInicial;
        inicioTimerRef.current = Date.now();

        timerRef.current = setInterval(() => {
            const decorrido =
                tempoInicialRef.current +
                ((Date.now() - inicioTimerRef.current) / 1000);

            const limite = tempoTotalBase / velocidadeAtual;

            setTempoAtual(Math.min(decorrido, limite));
        }, 250);
    }, [tempoTotalBase]);

    const atualizarProgressoVisual = useCallback((valor) => {
        setProgresso(valor);
        progressoRef.current = valor;
    }, []);

    const executarFala = useCallback((porcentagemAlvo, velocidadeAtual = velocidade) => {
        canceladoManualmenteRef.current = true;
        window.speechSynthesis.cancel();

        if (!textoLimpo) return;

        const partes = textoLimpo.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(parte => parte.trim()).filter(Boolean) || [];

        if (!partes.length) return;

        const totalPartes = partes.length;

        let indiceInicial = Math.floor(
            (porcentagemAlvo / 100) * totalPartes
        );

        if (indiceInicial >= totalPartes) {
            atualizarProgressoVisual(100);
            setStatus("parado");
            return;
        }

        canceladoManualmenteRef.current = false;

        const falarParte = (indice) => {
            if (canceladoManualmenteRef.current || indice >= totalPartes) {
                if (!canceladoManualmenteRef.current) {
                    atualizarProgressoVisual(100);
                    setStatus("parado");
                }

                return;
            }

            const fala = new SpeechSynthesisUtterance(partes[indice]);

            fala.lang = "pt-BR";
            fala.rate = velocidadeAtual;

            utteranceRef.current = fala;

            fala.onstart = () => {
                setStatus("tocando");

                const tempoInicial =
                    (indice / totalPartes) *
                    (tempoTotalBase / velocidadeAtual);

                iniciarTimer(tempoInicial, velocidadeAtual);
            };

            fala.onend = () => {
                if (canceladoManualmenteRef.current) return;

                const novoProgresso =
                    ((indice + 1) / totalPartes) * 100;

                atualizarProgressoVisual(novoProgresso);

                if (indice + 1 >= totalPartes) {
                    clearInterval(timerRef.current);
                    setTempoAtual(tempoTotalBase / velocidadeAtual);
                    setStatus("parado");
                    return;
                }

                falarParte(indice + 1);
            };

            fala.onerror = (event) => {
                clearInterval(timerRef.current);

                if (event.error !== "interrupted" && !canceladoManualmenteRef.current) {
                    setStatus("parado");
                }
            };

            window.speechSynthesis.speak(fala);
        };

        falarParte(indiceInicial);
    }, [textoLimpo, velocidade, atualizarProgressoVisual]);

    const alternarLeitura = () => {
        if (!textoLimpo) return;

        if (status === "tocando") {
            canceladoManualmenteRef.current = true;
            window.speechSynthesis.cancel();
            clearInterval(timerRef.current);
            setStatus("pausado");
        } else {
            canceladoManualmenteRef.current = true;
            window.speechSynthesis.cancel();
            setStatus("tocando");
            executarFala(progressoRef.current >= 100 ? 0 : progressoRef.current);
        }
    };

    const atualizarVisualAoArrastar = (e) => {
        const novaPorcentagem = Number(e.target.value);
        atualizarProgressoVisual(novaPorcentagem);
    };

    const aplicarMudancaDeAudio = (e) => {
        const novaPorcentagem = Number(e.target.value);

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
        <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex flex-col gap-2 flex-1 w-full min-w-62">
                <span className="text-xs font-medium">Ouvir:</span>

                <div className="flex flex-row items-center gap-3 w-full">
                    <button type="button" onClick={alternarLeitura} className="cursor-pointer font-bold w-6">
                        {status === "tocando" ? "❚❚" : "▶︎"}
                    </button>

                    <div className="flex items-center gap-2 flex-1 w-full">
                        <input id="progresso-audio" name="progressoAudio" type="range" min="0" max="100" step="1" value={progresso} onChange={atualizarVisualAoArrastar} onMouseUp={aplicarMudancaDeAudio} onTouchEnd={aplicarMudancaDeAudio} className="flex-1 w-full accent-blue-500 h-3 rounded-lg cursor-pointer" />
                        <span className="text-xs font-mono min-w-10 text-right">{formatarTempo(tempoAtual)}</span>
                    </div>

                    <select id="velocidade-select" name="velocidadeSelect" value={velocidade} onChange={(e) => alterarVelocidade(Number(e.target.value))} className="text-xs outline-none cursor-pointer bg-principal-bg transition-colors duration-200" >
                        {[1, 1.15, 1.5, 2].map(a => <option key={a} value={a}>{a}x</option>)}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-0.5 px-2">
                <span className="text-xs font-medium">Fonte:</span>

                <div className="flex gap-4">
                    <button onClick={() => setTamanhoFonte(prev => Math.max(12, prev - 2))} className="text-3xl md:text-2xl cursor-pointer font-bold">A-</button>
                    <button onClick={() => setTamanhoFonte(prev => Math.min(28, prev + 2))} className="text-3xl md:text-2xl cursor-pointer font-bold">A+</button>
                </div>
            </div>
        </div>
    );
}