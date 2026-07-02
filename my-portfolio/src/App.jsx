import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutPrincipal from "./layouts/LayoutPrincipal";
import Erro404 from "./pages/404/404";
import TelaInicial from "./pages/inicial/inicial";
import Projetos from "./pages/projetos/projetos";
import Sobre from "./pages/sobre/sobre";
import Solicitacao from "./pages/solicitacao/solicitacao";
import Curriculo from "./pages/curriculos/curriculo";
import DetalheProjeto from "./pages/projetos/detalhe/detalhe";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<TelaInicial />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="projetos/:id" element={<DetalheProjeto />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="solicitacao" element={<Solicitacao />} />
          <Route path="curriculos" element={<Curriculo />} />
        </Route>
        <Route path="*" element={<Erro404 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
