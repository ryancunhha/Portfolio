import { useEffect } from "react";

import Dataehora from "./section/dataehora/Dataehora";
import Projetos from "./section/projetos/projetos";
import Header from "../../components/header/header";

export default function Intro({ dark, mudarTema }) {
    useEffect(() => {
        document.title = "Home | Portfólio"
    }, [])

    return (
        <>
            <Header dark={dark} mudarTema={mudarTema} />
            
            <div className="pb-8">
                <Dataehora dark={dark} />
                <Projetos dark={dark} />
            </div>
        </>
    )
}