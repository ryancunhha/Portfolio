import EsqueletoProjetos from "./projetosEsqueleto";
import { CardProjeto } from "../../components/cards/cards";
import { useProjetos } from "../../contexts/ProjetosContext";

export default function Projeto() {
    const { projetos, carregando } = useProjetos();

    if (carregando) return <EsqueletoProjetos />

    return (
        <div className="m-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projetos.map((repo) => (
                    <CardProjeto key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    )
}