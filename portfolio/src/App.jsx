import { Routes, Route } from "react-router-dom";

import Principal from "./pages/principal/principal";
import ProjetoDetalhes from "./pages/projeto/projeto";
import Sobre from "./pages/sobre/sobre";
import Error404 from "./pages/404/404";
import Chamados from "./pages/chamados/chamados";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Principal />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/:slug" element={<ProjetoDetalhes />} />
            <Route path="/solicitacao" element={<Chamados />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    )
}

export default App