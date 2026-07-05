import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutPrincipal from "./layouts/LayoutPrincipal";
import TelaInicial from "./pages/inicial/inicial";

const Erro404 = lazy(() => import("./pages/404/404"));
const Projetos = lazy(() => import("./pages/projetos/projetos"));
const Sobre = lazy(() => import("./pages/sobre/sobre"));
const Solicitacao = lazy(() => import("./pages/solicitacao/solicitacao"));
const Curriculo = lazy(() => import("./pages/curriculos/curriculo"));
const DetalheProjeto = lazy(() => import("./pages/projetos/detalhe/detalhe"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="bg-[#18181B] h-screen" />
      }>
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
      </Suspense>
    </BrowserRouter>
  )
}