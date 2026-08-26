import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function ReadmeConteudo({ markdown }) {
    const htmlLimpoESeguro = useMemo(() => {
        if (!markdown) return "";

        const renderer = {
            heading(token) {
                const text = typeof token === "object" ? token.text : arguments[1];
                const depth = typeof token === "object" ? token.depth : arguments[0];
                const newDepth = (depth === 1 || depth === 2) ? 3 : depth;
                return `<h${newDepth}>${text}</h${newDepth}>`;
            }
        };

        marked.use({ renderer });

        const html = marked.parse(markdown);
        return DOMPurify.sanitize(html);
    }, [markdown]);

    if (!htmlLimpoESeguro) return null;

    return (
        <div className="wrap-break-word [&_pre]:overflow-x-auto [&_pre]:w-full [&_p]:mb-4 [&_a]:underline [&_a]:text-[#5b88c3] [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-3 [&_strong]:font-bold [&_em]:italic [&_pre]:bg-neutral-800 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-md [&_hr]:my-6 [&_hr]:border-neutral-300"
            dangerouslySetInnerHTML={{ __html: htmlLimpoESeguro }}
        />
    )
}