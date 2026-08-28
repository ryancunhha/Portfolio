import { Outlet } from "react-router-dom";
import Header from "../components/header/header";

export default function LayoutPrincipal() {
    return (
        <>
            <Header />

            <main className="h-full overflow-y-auto">
                <div className="w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </>
    )
}