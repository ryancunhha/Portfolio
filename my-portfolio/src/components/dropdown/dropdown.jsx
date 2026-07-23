import { useRef, useEffect } from "react";

export default function Dropdown({ items, aoFechar }) {
    const dropdownRef = useRef(null)
    const aoFecharRef = useRef(aoFechar)

    useEffect(() => {
        aoFecharRef.current = aoFechar
    }, [aoFechar])

    useEffect(() => {
        const verificarCliqueFora = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                aoFecharRef.current?.();
            }
        }

        document.addEventListener("pointerdown", verificarCliqueFora)
        return () => document.removeEventListener("pointerdown", verificarCliqueFora)
    }, [])

    return (
        <div ref={dropdownRef} className="fixed z-2 flex flex-col rounded-lg border border-[#3E3E49] bg-[#232327] right-2 top-14 w-[calc(100vw-1rem)] max-w-60">
            <div className="flex flex-col min-w-0 divide-y divide-[#3E3E49]/40">
                {items.map((item, index) => (
                    <a title={item.label} key={index} href={item.url} target="_blank" rel="noopener noreferrer" onClick={aoFechar} className={`flex w-full items-center gap-2 px-3 py-4 min-w-0`}>
                        {item.icon && <img className="rounded" height="25" width="25" src={item.icon} loading="lazy" fetchPriority="low" alt={`Acessar meu perfil no ${items.label}`} />}
                        <p className="w-full text-left text-sm font-medium text-white truncate">{item.label}</p>
                    </a>
                ))}
            </div>
        </div>
    )
}