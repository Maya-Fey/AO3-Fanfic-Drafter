import { makeAutoObservable } from "mobx";
import { Document, Node, Element, Text, NodeWithChildren } from "domhandler";
import { FicCompilerError } from "../compiler/compiler";
import { Rule, Stylesheet } from "css";
import CssCompiler from "css/lib/stringify/identity"
import parseCSS from "css/lib/parse"
import { selectAll } from "css-select"
import { ElementType, parseDocument } from "htmlparser2";
import { readdir } from "fs";
import { formatDiagnostic } from "typescript";

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
                                return this.toString(this.run(parent, c.slice(2, -1)));
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

        return this.runWithTarg(parent, selector === "" ? [parent] : selectAll(selector, [parent]), item);
    }

    runWithTarg(root: Element, target: Node[]|Element|string, item: string): Node[]|string {
        if(target === undefined) return "[not found]";
        if(target instanceof Array && target.length === 0) return "[not found]"; 
        //children --> element's children
        //bare words --> value of that attribute in the element
        //[number].stuff = the number'th element with the above operation applied
        let exprPos: number = item.indexOf(".");
        let expr: string = item.slice(0, Math.max(exprPos, 0));
        let restOfExpr: string = item.slice(exprPos + 1, item.length);
        if(expr === "") {
            expr = restOfExpr;
            restOfExpr = "";
        } 

        let final: Node[]|Element|string = target;

        if(expr === "") {
            ;
        } else if(expr.startsWith("[") && expr.indexOf(":") !== -1) {
            if(!(target instanceof Array)) return "[can't perform array operations on non-array]"
            expr = expr.slice(1, expr.length - 1);
            let sides: string[] = expr.split(":");
            if(sides.length !== 2) return "[invalid array slice]";

            if(sides[0] === "") sides[0] = "0";
            if(sides[1] === "") sides[1] = "" + target.length;

            let leftpos: number = parseInt(sides[0]);
            let rightpos: number = parseInt(sides[1]);

            if(isNaN(leftpos) || isNaN(rightpos)) return "[invalid array slice]";
            if(Math.abs(leftpos) > target.length || Math.abs(rightpos) > target.length) return "[index out of bounds]";

            final = target.slice(leftpos, rightpos);
            if(final.length == 0) return "[array slice resulted in size of 0]"
        } else if(expr.startsWith("[")) {
            if(!(target instanceof Array)) return "[can't perform array operations on non-array]"
            let pos: number = parseInt(expr.slice(1, expr.length - 1));
            if(isNaN(pos)) return "[invalid array operation]";
            if(Math.abs(pos) >= target.length) return "[index out of bounds]";
            if(pos < 0) pos = target.length + pos;

            if(target[pos] instanceof Element) {
                final = target[pos] as Element;
            } else if(target[pos] instanceof Text) {
                final = (target[pos] as Text).data;
            } else {
                return "[bug, please report to https://github.com/Maya-Fey/AO3-Fanfic-Drafter/issues/new]"
            }
        } else if(expr === "children") {
            let singularTarget: Element|undefined = undefined;
            if(target instanceof Array && target[0] instanceof Element) singularTarget = target[0];
            if(target instanceof Element) singularTarget = target;
            if(singularTarget === undefined) {
                return "[children expects element or array of elements]"
            }
            final = singularTarget.childNodes.map(cn=>cn.cloneNode(true));
        } else if(expr === "lines") {
            let text: string|undefined = undefined;
            if(typeof target === "string") text = target as string;
            if(target instanceof Text) text = target.data;
            if(text === undefined) {
                return "[lines expects a string or a text node]"
            }
            let lines: string[] = text.split("\n").filter(line=>line.length > 0);
            let pre: Element[] = lines.map(line=>new Text(line)).map(node=>new Element("span", {}, [node], ElementType.Tag));
            final = [];
            pre.forEach(node=>{
                (final as Array<Node>).push(node);
                (final as Array<Node>).push(new Text("\n"));
            })
            final = final.slice(0, -1);
        }  else {
            let singularTarget: Element|undefined = undefined;
            if(target instanceof Array && target[0] instanceof Element) singularTarget = target[0];
            if(target instanceof Element) singularTarget = target;
            if(singularTarget === undefined) {
                return "[can't get attrib of non-element]"
            }
            final = singularTarget.attribs[expr];
        }

        if(restOfExpr !== undefined && restOfExpr.length > 0) {
            return this.runWithTarg(root, final, restOfExpr);
        } else {
            if(final === root || (final instanceof Array && final[0] === root)) {
                return "[infinite recursion detected: template expr returned root element]"
            } else {
                if(final instanceof Element)
                    return [final]
                else
                    return final;
            }
        }

        // let pos: number = 0;
        // if(selector !== "") {
        //     pos = parseInt(selector.slice(1, selector.length - 1));
        //     if(isNaN(pos) || Math.abs(pos) >= target.length) return "undefined";
        //     if(pos < 0) pos = target.length + pos;
        // }

        // let singularTarget: Element = target[pos];

        // if(expr === "children") {
        //     return singularTarget.childNodes.map(cn=>cn.cloneNode(true));
        // } else {
        //     return singularTarget.attribs[expr];
        // }
    }

    toString(input: Node[]|string): string {
        if(input === undefined) input = "undefined";
        if(typeof input === 'string') {
            return input;
        } else {
            return "[expected string, got element]"
        }
    }

    toNode(input: Node[]|string): Node[] {
        if(input === undefined) input = "undefined";
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

    let doc: Document = parseDocument(template.source);
    let ret: FicCompilerError|undefined = addInsertionGhosts(doc);
    if(ret instanceof FicCompilerError) return ret;

    let classes: Set<string> = new Set<string>();
    collectClasses(doc, template.key, classes);

    style.stylesheet!.rules.forEach(rule=>{
        if((rule as Rule).selectors) {
            let ruleR: Rule = rule;
            for(let i: number = 0; i < ruleR.selectors!.length; i++) {
                let parts: string[] = [...ruleR.selectors![i].matchAll(new RegExp("(([^ [\\]~>+]|\\[.*?\\])+([~+> ]+|$))", "g"))].map(match=>match[0]);
                let nselector: string = "#workskin ";
                parts.forEach(part=>{
                    let subparts: string[] = [...part.matchAll(new RegExp("\\.[^ ~!@$%^&*()+=,.\\/';:\"?><[\\]\\\\{}|`#]+|([^.[]|\\[.*?\\])+", "g"))].map(match=>match[0]);
                    subparts.forEach(subpart=>{
                        if(subpart.startsWith(".") && classes.has(subpart.substring(1))) {
                            nselector += ".template__" + template.key + "__" + subpart.substring(1);
                        } else {
                            nselector += subpart;
                        }
                    });
                });
                ruleR.selectors![i] = nselector;
            }
        }
    });

    let compiler: CssCompiler = new CssCompiler();
    return new CompiledTemplateImpl(template.key, compiler.compile(style), doc.childNodes);
}


function collectClasses(node: NodeWithChildren, name: string, set: Set<string>): void {
    if(node instanceof Element) {
        if(node.attribs["class"] !== undefined) {
            let classes: string = "";
            [...node.attribs.class.matchAll(new RegExp("([^$][^ ]*)( |$)|(\\${.*?})( |$)", "g"))].map(arr=>arr[1] !== undefined ? arr[1] : arr[3]).forEach(class_=>{
                if(class_.startsWith("$")) {
                    classes += class_ + " ";
                } else {
                    set.add(class_);
                    classes += "template__" + name + "__" + class_ + " ";
                }
            });
            node.attribs["class"] = classes.substring(0, classes.length - 1);
        }
    }
    node.childNodes.filter(node=>node instanceof NodeWithChildren).forEach(nwc=>{
        collectClasses(nwc as NodeWithChildren, name, set);
    });
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