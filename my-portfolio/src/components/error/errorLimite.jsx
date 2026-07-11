import React from "react";
import Erro404 from "../../pages/404/404";

export default class ErrorLimite extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("fatal erro:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Erro404 />
            )
        }

        return this.props.children;
    }
}