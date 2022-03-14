import { makeAutoObservable } from "mobx";
import { Document, Node, Element, Text, NodeWithChildren } from "domhandler";
import { FicCompilerError } from "../compiler/compiler";
import { Rule, Stylesheet } from "css";
import CssCompiler from "css/lib/stringify/identity"
import parseCSS from "css/lib/parse"
import { selectAll } from "css-select"
import { parseDocument } from "htmlparser2";

const INSERTION_GHOST_NAME: string = "__insertionghost"

export class FicTemplate {
    key: string;
    source: string = "";
    style: string = "";
    example: string = "";

    constructor(key: string) {
        this.key = key;
        makeAutoObservable(this);
    }

    updateExample(newExample: string): void {
        this.example = newExample;
    }

    updateSource(newSource: string, newStyle: string): void {
        this.source = newSource;
        this.style = newStyle;
    }
    
}

export interface CompiledTemplate {
    readonly key: string;
    readonly style: string;
    readonly use: (e: Element)=>Node[];
}

export function isAllowedName(name: string): boolean {
    return name !== INSERTION_GHOST_NAME;
}

class CompiledTemplateImpl implements CompiledTemplate {
    readonly key: string;
    readonly style: string;
    readonly src: Node[];

    constructor(key: string, style: string, src: Node[]) {
        this.key = key;
        this.style = style;
        this.src = src;
    } 

    use(e: Element): Node[] 
    {
        return this.src.map(node=>node.cloneNode(true)).map(node=>this.apply(e, node)).reduce((a1,a2)=>a1.concat(a2), []);
    }

    apply(parent: Element, n: Node): Node[] {
        if(n instanceof Element) {
            if(n.tagName === INSERTION_GHOST_NAME) {
                let scr = (n.childNodes[0] as Text).data;
                return this.toNode(this.run(parent, scr));
            } else {
                if(n.attribs.class) {
                    let classes: string[] = [...n.attribs.class.matchAll(new RegExp("([^$][^ ]*)( |$)|(\\${.*?})( |$)", "g"))].map(arr=>arr[1] !== undefined ? arr[1] : arr[3]);

                    n.attribs.class = classes
                        .map(c=>{
                            if(c.length === 0) return "";
                            if(c[0] == '$') {
                                return this.run(parent, c.slice(2, -1));
                            } else {
                                return c;
                            }
                        })
                        .map(c=>c+' ')
                        .reduce((c1,c2)=>c1+c2).slice(0, -1);
                }
                n.childNodes = n.childNodes.map(c=>this.apply(parent, c)).reduce((a1, a2)=>a1.concat(a2), []);
            }
        }
        return [ n ];
    }

    run(parent: Element, script: string): Node[]|string {
        let itemPos: number = Math.max(0, script.lastIndexOf(" "));
        let selector: string = script.slice(0, itemPos);
        let item: string = script.slice(itemPos, script.length).trim();

        return this.runWithTarg(selector === "" ? [parent] : selectAll(selector, [parent]), item);
    }

    runWithTarg(target: Element[], item: string): Node[]|string {
        //children --> element's children
        //bare words --> value of that attribute in the element
        //[number].stuff = the number'th element with the above operation applied
        let exprPos: number = item.lastIndexOf(".");
        let selector: string = item.slice(0, Math.max(exprPos, 0));
        let expr: string = item.slice(exprPos + 1, item.length);

        let pos: number = 0;
        if(selector !== "") {
            pos = parseInt(selector.slice(1, selector.length - 1));
            if(isNaN(pos) || Math.abs(pos) >= target.length) return "undefined";
            if(pos < 0) pos = target.length + pos;
        }

        let singularTarget: Element = target[pos];

        if(expr === "children") {
            return singularTarget.childNodes.map(cn=>cn.cloneNode(true));
        } else {
            return singularTarget.attribs[expr];
        }
    }

    toNode(input: Node[]|string): Node[] {
        if(typeof input === 'string') {
            return [ new Text(input) ];
        } else {
            return input;
        }
    }  
}

export function compileTemplate(template: FicTemplate): CompiledTemplate|FicCompilerError {

    let style: Stylesheet;
    try {
        style = parseCSS(template.style);
    } catch(e) {
        return new FicCompilerError("Error compiling template " + template.key + ": " + String(e));
    }

    style.stylesheet!.rules.forEach(rule=>{
        if((rule as Rule).selectors) {
            let ruleR: Rule = rule;
            ruleR.selectors![0] = "#workskin " + ruleR.selectors![0] + "." + template.key;
        }
    });

    let doc: Document = parseDocument(template.source);
    let ret: FicCompilerError|undefined = addInsertionGhosts(doc);
    if(ret instanceof FicCompilerError) return ret;

    let compiler: CssCompiler = new CssCompiler();
    return new CompiledTemplateImpl(template.key, compiler.compile(style), doc.childNodes);
}

function addInsertionGhosts(node: NodeWithChildren): undefined|FicCompilerError {
    let nodes: Node[] = node.childNodes;
    for(let i: number = 0; i < nodes.length; i++) {
        let node: Node = nodes[i];
        if(node instanceof Text) {
            let ret: Node[]|FicCompilerError = addInsertionGhostsText(node);
            if(ret instanceof FicCompilerError) return ret;
            let newNodes: Node[] = ret;
            nodes.splice(i, 1);
            let right: Node[] = nodes.splice(i, nodes.length - i);
            nodes = nodes.concat(newNodes).concat(right);
            i = i - 1 + newNodes.length;
        } else if(node instanceof Element) {
            let ret: undefined|FicCompilerError = addInsertionGhosts(node);
            if(ret instanceof FicCompilerError) return ret;
        }
    }
    node.childNodes = nodes;
    return undefined;
}

function addInsertionGhostsText(textNode: Text): Node[]|FicCompilerError {
    let newList: Node[] = [];
    
    let content: string = textNode.data;
    let escaped: boolean = false;
    let inside: boolean = false;
    let cur: string = "";
    for(let i: number = 0; i < content.length; i++) {
        if(escaped) {
            cur += content[i];
            escaped = false;
        } else {
            if(content[i] == '\\') {
                escaped = true;
            } else if(!inside && content[i] == "$") {
                newList.push(new Text(cur));
                cur = "";
                inside = true;
                if(content[i + 1] != '{') return new FicCompilerError("Expected '{' after '$'. Either enter a proper insertion expression, or escape the dollar sign"); 
                i++;
            } else if(inside && content[i] == '}') {
                let ele: Element = new Element(INSERTION_GHOST_NAME, {});
                ele.childNodes.push(new Text(cur));
                newList.push(ele);
                cur = "";
                inside = false;
            } else {
                cur += content[i];
            }
        }
    }
    if(!inside) {
        newList.push(new Text(cur));
    } else {
        let ele: Element = new Element(INSERTION_GHOST_NAME, {});
        ele.childNodes.push(new Text(cur));
        newList.push(ele); 
    }

    return newList;
}