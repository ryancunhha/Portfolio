import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const elementoMain = document.querySelector("main");

        if (elementoMain) {
            elementoMain.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant",
            });
        }
    }, [pathname]);

    return null;
}