import { Outlet } from "react-router-dom";
import Header from "../components/header/header";
import ScrollToTop from "../components/header/ScrollToTop";

export default function LayoutPrincipal() {
    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
            <ScrollToTop />
            <Header />

            <main className="bg-principal-bg text-principal-text flex-1 h-full overflow-y-auto scrollbar-thumb-[#9F9F9F] pt-14 md:pt-0 transition-colors duration-200">
                <div className="w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}