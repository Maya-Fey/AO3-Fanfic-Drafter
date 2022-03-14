declare module 'css/lib/parse' {
    import { Stylesheet, ParserOptions } from "css";

    function parseCSS(css: string, options?: ParserOptions): Stylesheet;

    export default parseCSS;
}