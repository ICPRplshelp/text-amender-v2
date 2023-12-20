import {ReactNode} from "react";
import "./styles.css";
import "@fontsource/jetbrains-mono"; // Defaults to weight 400

interface CodeBlockProps {
    children: ReactNode;
}

function CodeBlock({children}: CodeBlockProps) {
    return (
        <div className={"code-box"}>
            {children}
        </div>
    );
}

export default CodeBlock;