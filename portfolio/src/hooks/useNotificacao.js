import { useRef, useState } from "react";

export function useNotificacao(duration = 2000) {
    const [visivel, setVisivel] = useState(false)
    const [mensagem, setMensagem] = useState("")
    const [progresso, setProgresso] = useState(100)

    const restanteRef = useRef(duration)
    const intervaloRef = useRef(null)
    const pausadoRef = useRef(false)

    function limpar() {
        if (intervaloRef.current) {
            clearInterval(intervaloRef.current)
            intervaloRef.current = null
        }
    }

    function iniciar() {
        limpar()

        intervaloRef.current = setInterval(() => {
            if (pausadoRef.current) return

            restanteRef.current -= 16

            const porcentagem =
                (restanteRef.current / duration) * 100

            setProgresso(Math.max(0, porcentagem))

            if (restanteRef.current <= 0) {
                limpar()
                setVisivel(false)
            }
        }, 16)
    }

    function mostrarNotificacao(texto) {
        limpar()

        restanteRef.current = duration
        pausadoRef.current = false

        setMensagem(texto)
        setProgresso(100)
        setVisivel(true)

        iniciar()
    }

    function pausarNotificacao() {
        pausadoRef.current = true
    }

    function retomarNotificacao() {
        pausadoRef.current = false
    }

    function esconderNotificacao() {
        limpar()
        setVisivel(false)
    }

    return {
        visivel,
        mensagem,
        progresso,
        mostrarNotificacao,
        pausarNotificacao,
        retomarNotificacao,
        esconderNotificacao,
    }
}