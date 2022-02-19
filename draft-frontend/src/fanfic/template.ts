import { makeAutoObservable } from "mobx";
import { Element } from "domhandler";

export class FicTemplate {
    key: string;
    source: string = "";
    style: string = "";
    example: string = "";

    constructor(key: string) {
        this.key = key;
        makeAutoObservable(this);
    }
}

export class CompiledTemplate {
    readonly key: string;
    readonly style: string;
    readonly use: (e: Element)=>string;
    constructor(key: string, style: string, use: (e: Element)=>string) {
        this.key = key;
        this.style = style;
        this.use = use;
    }
}