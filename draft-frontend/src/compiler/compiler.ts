import { parseDocument } from "htmlparser2";
import { EditorTarget } from "../fanfic/editortarget";
import { Fanfic } from "../fanfic/fanfiction";
import { Document, Element, Text, DataNode } from "domhandler";
import type { Node } from "domhandler"
import { CompiledTemplate, FicTemplate } from "../fanfic/template";

export class FicCompilerError {
    reason: string;
    constructor(reason: string) {
        this.reason = reason;
    }
}

function compileTemplate(template: FicTemplate): CompiledTemplate|FicCompilerError {
    return new CompiledTemplate("unimplemented", "* { display: none; }", (e: Element)=>{return "gay";});
}

export function compileFanfic(fic: Fanfic, target: EditorTarget): string[]|FicCompilerError {
    let compiledTemplates: Map<string, CompiledTemplate> = new Map<string, CompiledTemplate>();
    fic.templates.forEach(v=>{
        let ret: CompiledTemplate|FicCompilerError = compileTemplate(v);
        if(ret instanceof FicCompilerError) {
            return ret as FicCompilerError;
        } else {
            compiledTemplates.set(v.key, ret as CompiledTemplate);
        }
    });

    let dom: Document = parseDocument(fic.text);
    return compile(0, false, true, dom.childNodes, compiledTemplates);
}

function genIndent(indent: number): string {
    return Array(indent + 1).join('\t');
}

function textTag(block: boolean, open: boolean): string {
    return block ? 
        (open ? "<p>" : "</p>") :
        (open ? "<span>" : "</span>)");
}

function openOfDefault(tag: Element) {
    return "<" + tag.tagName + (tag.attributes.length > 0 ? " " : "") + tag.attributes.map(att=>{return att.name + "=\"" + att.value + "\""}).join(" ") + ">";
}

function closeOfDefault(tag: Element) {
    return "</" + tag.tagName + ">";
}

function strip(s: string): string {
    if(s[0] === '\t' || s[0] === '\n')
        return strip(s.slice(1, s.length));
    else if(s[s.length - 1] === '\t' || s[s.length - 1] === '\n')
        return strip(s.slice(0, -1));
    else
        return s;
}

function compile(indent: number, inline: boolean, block: boolean, nodes: Node[], compiledTemplates: Map<string, CompiledTemplate>): string[]|FicCompilerError
{
    let chapters: string[] = [];
    let code: string = "";
    let acc: string|undefined = undefined;
    let lastWasCode: boolean = false;
    for(let i: number = 0; i < nodes.length; i++) {
        let node: Node = nodes[i];
        let next: Node|undefined = nodes[i + 1];
        if(node instanceof Text) {
            let tN: Text = node as Text;
            let lines: string[] = tN.data.split("\n\n").map(strip);

            if(inline && lines.length > 1) {
                return new FicCompilerError("Illegal line break in inline tag" + tN.startIndex);
            } 

            lines.forEach(line=>{
                if(lastWasCode) {
                    lastWasCode = false;
                    acc = (acc as string) + line;
                } else {
                    let accNotEmpty: boolean = acc !== undefined && acc.length > 0;
                    if(accNotEmpty) {
                        if(inline) 
                            code += acc as string;
                        else
                            code += genIndent(indent) + textTag(block, true) + "\n" + genIndent(indent + 1) + acc as string + "\n" + genIndent(indent) + textTag(block, false) + "\n";
                    } 
                    if(line.startsWith("#############")) {    
                        if(indent != 0) {
                            return new FicCompilerError("Illegal chapter break in the middle of tag");
                        }

                        chapters.push(code);
                        acc = "";
                        code = "";
                    } else {
                        acc = line;
                    }
                }
            });
        } else if(node instanceof Element) {
            let ele: Element = node as Element;
            if(compiledTemplates.has(ele.tagName)) {

            } else {
                if((acc === undefined || (acc as string).length === 0) && (next instanceof Text && (next as Text).data.startsWith("\n\n"))) {
                    let ret: string[]|FicCompilerError = compile(indent + 1, false, block && indent == 0, ele.childNodes, compiledTemplates);
                    if(ret instanceof FicCompilerError) return ret;
                    let middle = (ret as string[])[0];
                    code += genIndent(indent) + openOfDefault(ele) + "\n" + middle + genIndent(indent) + closeOfDefault(ele) + "\n";
                } else {
                    let ret: string[]|FicCompilerError = compile(-1, true, false, ele.childNodes, compiledTemplates);
                    if(ret instanceof FicCompilerError) return ret;
                    let middle = (ret as string[])[0];
                    acc = acc === undefined ? "" : acc as string;
                    acc += openOfDefault(ele) + middle + closeOfDefault(ele);
                    lastWasCode = true;
                }
            }
        }
    }
    if(acc !== undefined && (acc as string).length > 0) {
        if(inline) 
            code += acc as string;
        else
            code += genIndent(indent) + textTag(block, true) + "\n" + genIndent(indent + 1) + acc as string + "\n" + genIndent(indent) + textTag(block, false) + "\n";
    } 
    chapters.push(code);
    return chapters;
}