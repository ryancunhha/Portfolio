import { useEffect, useMemo, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function ReadmeConteudo({ markdown, usuario = "ryancunhha", repositorio = "", branch = "main" }) {
    const contentRef = useRef(null);

    const htmlLimpoESeguro = useMemo(() => {
        if (!markdown) return "";

        const renderer = {
            heading(token) {
                const text = typeof token === "object" ? token.text : arguments[1];
                const depth = typeof token === "object" ? token.depth : arguments[0];
                const newDepth = (depth === 1 || depth === 2) ? 3 : depth;
                return `<h${newDepth}>${text}</h${newDepth}>`;
            },
            image(token) {
                let src = typeof token === "object" ? token.href : arguments[0];
                const title = typeof token === "object" ? token.title : arguments[1];
                const alt = typeof token === "object" ? token.text : arguments[2];

                if (src) {
                    if (!src.startsWith("http://") && !src.startsWith("https://")) {
                        const cleanPath = src.replace(/^\.\//, "");
                        src = `https://raw.githubusercontent.com/${usuario}/${repositorio}/${branch}/${cleanPath}`;
                    }
                }

                return `<img src="${src}" alt="${alt || ''}" ${title ? `title="${title}"` : ''} />`;
            }
        };

        marked.use({ renderer });

        const html = marked.parse(markdown);
        return DOMPurify.sanitize(html, {
            ADD_TAGS: ["img"],
            ADD_ATTR: ["src", "alt", "title", "loading"],
        });
    }, [markdown]);

    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        const buttons = [];

        container.querySelectorAll("pre").forEach((pre) => {
            if (pre.querySelector(".copy-code-button")) return;

            pre.style.position = "relative";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "copy-code-button absolute right-2 top-2 rounded-md bg-neutral-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-600 cursor-pointer";
            button.textContent = "Copiar";

            const handleCopy = async () => {
                const code = pre.querySelector("code");
                const text = code?.innerText || code?.textContent || "";

                try {
                    await navigator.clipboard.writeText(text);
                    button.textContent = "Copiado!";
                    setTimeout(() => { button.textContent = "Copiar"; }, 2000);
                } catch (error) {
                    console.error("Erro ao copiar código:", error);
                    button.textContent = "Erro";
                    setTimeout(() => { button.textContent = "Copiar"; }, 2000);
                }
            };

            button.addEventListener("click", handleCopy);
            pre.appendChild(button);
            buttons.push({ button, handleCopy });
        });

        return () => {
            buttons.forEach(({ button, handleCopy }) => {
                button.removeEventListener("click", handleCopy);
                button.remove();
            });
        };
    }, [htmlLimpoESeguro]);

    if (!htmlLimpoESeguro) return null;

    return (
        <div ref={contentRef} className="wrap-break-word leading-relaxed 
        [&_pre]:overflow-x-auto 
        [&_pre]:w-full 
        [&_p]:mb-4
        [&_a]:font-medium
        [&_a]:underline 
        [&_a]:text-[#5b88c3] 
        [&_ol]:space-y-2 
        [&_ul]:list-disc 
        [&_ul]:pl-5 
        [&_ul]:mb-4 
        [&_h3]:text-2xl 
        [&_h3]:font-bold 
        [&_h3]:mt-2
        [&_h3]:mb-3
        [&_h3]:leading-tight
        [&_strong]:font-bold 
        [&_em]:italic
        [&_pre]:bg-neutral-800 
        [&_pre]:text-white
        [&_pre]:p-4 
        [&_pre]:rounded-md 
        [&_hr]:my-6 
        [&_hr]:border-neutral-300
        [&_img]:my-4 
        [&_img]:max-w-full 
        [&_img]:rounded-lg
        "
            dangerouslySetInnerHTML={{ __html: htmlLimpoESeguro }}
        />
    )
}