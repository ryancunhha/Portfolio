import { useEffect } from "react";

import Dataehora from "./section/dataehora/Dataehora";
import Projetos from "./section/projetos/projetos";
import Header from "../../components/header/header";

export default function Intro() {
    useEffect(() => {
        document.title = "Home | Portfólio"
    }, [])

    return (
        <>
            <Header />
            
            <div className="pt-5 md:pt-0 pb-8">
                <Dataehora />
                <Projetos />
            </div>
        </>
    )
}