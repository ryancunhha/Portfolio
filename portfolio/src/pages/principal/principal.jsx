import { useEffect } from "react";

import Slug from "../../data/slugs/slugs.json";
import Dataehora from "./section/dataehora/Dataehora";
import Projetos from "./section/projetos/projetos";
import Header from "../../components/header/header";

function Intro() {

    useEffect(() => {
        document.title = Slug.principal
    }, [])

    return (
        <>
            <Header />
            
            <div className="pt-16 pb-8">
                <Dataehora />
                <Projetos />
            </div>
        </>
    )
}

export default Intro