import { createContext, useState, useEffect, useContext } from "react";

const tema = createContext()

export const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(() => localStorage.getItem("tema") === "dark")

    useEffect(() => {
        const root = document.documentElement

        if (dark) {
            root.classList.add("dark-mode")
            localStorage.setItem("tema", "dark")
        } else {
            root.classList.remove("dark-mode")
            localStorage.setItem("tema", "light")
        }
    }, [dark]);

    return (
        <ThemeContext.Provider value={{ dark, setDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext)