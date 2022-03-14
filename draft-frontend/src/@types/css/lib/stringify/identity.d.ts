declare module 'css/lib/stringify/identity' {
    import { Stylesheet, StringifyOptions } from "css";
    
    //Not compilete, but should be more than enough to suit general use
    class Compiler {
        constructor(options?: StringifyOptions);
        compile(stylesheet: Stylesheet): string;
    }

    export = Compiler
}