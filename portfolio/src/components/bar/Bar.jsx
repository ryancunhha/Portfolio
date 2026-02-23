import Atalho from "./shortcut/shortcut";
import Projetos from "./project/project";
import Contatos from "./contact/contact";

export default function Bar({ aberta, onClose }) {

  return (
    <>
      {aberta && (
        <div onClick={onClose} className="fixed inset-0 bg-black/80 z-10"></div>
      )}

      <div className={`overflow-y-auto wrap-break-word overflow-x-hidden font-[Open Sans] fixed z-10 bg-white px-3 md:px-4 py-5 h-screen w-50 left-0 top-0 border-r-2 border-[#f4f4f4] ${aberta ? "duration-100 transition-all translate-x-0" : "duration-100 transition-all -translate-x-50"}`}>
        <div className="flex gap-5 flex-col h-full">

          <div className="">
            <Atalho onClose={onClose} />
          </div>

          <div className="">
            <Contatos />
          </div>

          <div className="">
            <Projetos />
          </div>

        </div>
      </div>
    </>
  )
}