import Atalho from "./shortcut/shortcut";
import Projetos from "./project/project";
import Contatos from "./contact/contact";

export default function Bar({ dark, aberta, onClose }) {

  return (
    <>
      {aberta && (
        <div onClick={onClose} className="fixed inset-0 bg-black/80 z-10"></div>
      )}

      <div className={`overflow-y-auto wrap-break-word overflow-x-hidden fixed z-10 ${dark ? "bg-(--bg-color)!" : "bg-white"} px-3 md:px-4 py-5 h-screen w-55 left-0 top-0 ${aberta ? "duration-100 transition-all translate-x-0" : "duration-100 transition-all -translate-x-55"}`}>
        <div className="ml-2 mt-2 flex gap-5 flex-col h-full">
          <Atalho dark={dark} onClose={onClose} />

          <Contatos dark={dark} />

          <div className="pb-5">
            <Projetos dark={dark} />
          </div>
        </div>
      </div>
    </>
  )
}