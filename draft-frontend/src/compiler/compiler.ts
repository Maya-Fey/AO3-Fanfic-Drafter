import { parseDocument } from "htmlparser2";
import { EditorTarget } from "../fanfic/editortarget";
import { Fanfic } from "../fanfic/fanfiction";
import { Document, Element, Text, DataNode } from "domhandler";
import type { Node } from "domhandler"
import { CompiledTemplate, FicTemplate } from "../fanfic/template";
import { getLevelOf, isAllowedTag, isSelfClosing, Level, LEVEL_INLINE, LEVEL_ROOT } from "./tags";



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
    return compile(0, LEVEL_ROOT, dom.childNodes, compiledTemplates);
}

function pTag(open: boolean): string {
    return (open ? "<p>" : "</p>");
}

function openOfDefault(tag: Element) {
    return "<" + tag.tagName + (tag.attributes.length > 0 ? " " : "") + tag.attributes.map(att=>{return att.name + "=\"" + att.value + "\""}).join(" ") + ">";
}

function selfClosing(tag: Element) {
    return "<" + tag.tagName + (tag.attributes.length > 0 ? " " : "") + tag.attributes.map(att=>{return att.name + "=\"" + att.value + "\""}).join(" ") + "/>";
}

function closeOfDefault(tag: Element) {
    return "</" + tag.tagName + ">";
}

function rmTabs(s: string): string {
    return s.replaceAll("\t", "");
}

function strip(s: string): string {
    if(s[0] === '\n')
        return strip(s.slice(1, s.length));
    else if(s[s.length - 1] === '\n')
        return strip(s.slice(0, -1));
    else
        return s;
}

function breakAndIndentSingleNewlines(s: string, markup: boolean): string {
    let lines: string[] = s.split("\n");
    return lines.map((line, idx)=>"\t" + line + ((markup && idx < lines.length - 1) ? "<br>\n" : "\n")).reduce((p, c)=>p+c);
}

function isNonEmpty(s: string|undefined): boolean {
    return s !== undefined && (strip(s).length > 0);
}

function compile(indent: number, level: Level, nodes: Node[], compiledTemplates: Map<string, CompiledTemplate>): string[]|FicCompilerError
{
    let chapters: string[] = [];
    let code: string = "";
    let acc: string|undefined = undefined;
    let lastWasCode: boolean = false;
    for(let i: number = 0; i < nodes.length; i++) {
        let node: Node = nodes[i];
        if(node instanceof Text) {
            let tN: Text = node as Text;
            let lines: string[] = rmTabs(tN.data).split("\n\n");

            lines.forEach(line=>{
                if(lastWasCode) {
                    lastWasCode = false;
                    acc = (acc as string) + line;
                } else {
                    if(isNonEmpty(acc)) {
                        if(level.canBeParentOf(LEVEL_INLINE)) 
                            code += strip(acc as string);
                        else
                            code += pTag(true) + "\n" + breakAndIndentSingleNewlines(strip(acc as string),  true)  + pTag(false) + "\n";
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

            } else if(isAllowedTag(ele.tagName)) {
                let nLevel: Level|undefined = getLevelOf(ele.tagName);
                if(nLevel === undefined) {
                    return new FicCompilerError("Tag <" + ele.tagName + "> is allowed on AO3, but is not supported by this compiler yet. Ooops. sorry.");
                }

                if(nLevel !== LEVEL_INLINE) {
                    if(isNonEmpty(acc)) { return new FicCompilerError("Block-level tags shouldn't be within less than two newlines of raw text"); }
                    acc = "";

                    let ret: string[]|FicCompilerError = compile(indent + 1, nLevel, ele.childNodes, compiledTemplates);
                    if(ret instanceof FicCompilerError) return ret;
                    let middle = (ret as string[])[0];
                    if(isSelfClosing(ele.tagName)) {
                        code += selfClosing(ele) + "\n";
                    } else {
                        code += openOfDefault(ele) + "\n" + breakAndIndentSingleNewlines(strip(middle), false) + closeOfDefault(ele) + "\n";
                    }
                } else {
                    let ret: string[]|FicCompilerError = compile(-1, nLevel, ele.childNodes, compiledTemplates);
                    if(ret instanceof FicCompilerError) return ret;
                    let middle = (ret as string[])[0];
                    acc = acc === undefined ? "" : acc as string;
                    
                    if(isSelfClosing(ele.tagName)) {
                        acc += selfClosing(ele);
                    } else {
                        if((middle.indexOf("\n") > -1)) {
                            acc += openOfDefault(ele) + "\n" + breakAndIndentSingleNewlines(strip(middle), false) + closeOfDefault(ele);
                        } else {
                            acc += openOfDefault(ele) + middle + closeOfDefault(ele);
                        }
                    }

                    lastWasCode = true;
                }
            } else {
                return new FicCompilerError("Tag <" + ele.tagName + "> is not a template and not allowed on AO3.");
            }
        }
    }
    if(isNonEmpty(acc)) {
        if(level.canBeParentOf(LEVEL_INLINE)) 
            code += strip(acc as string);
        else
            code += pTag(true) + "\n" + breakAndIndentSingleNewlines(strip(acc as string), true) + pTag(false) + "\n";
    } 
    chapters.push(code);
    return chapters;
}