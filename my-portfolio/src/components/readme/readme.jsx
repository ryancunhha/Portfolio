export default function ReadmeConteudo({ html, tamanhoFonte }) {
    return (
        <div className="wrap-break-word [&_pre]:overflow-x-auto [&_pre]:w-full [&_p]:mb-4 [&_a]:underline [&_a]:text-[#5b88c3] [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-3 [&_strong]:font-bold [&_em]:italic [&_pre]:bg-neutral-800 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-md [&_hr]:my-6 [&_hr]:border-neutral-300"
            style={{ fontSize: `${tamanhoFonte}px` }} dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}