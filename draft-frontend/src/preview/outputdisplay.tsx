import CodeMirror from "codemirror";
import React, { ChangeEvent, useEffect, useRef } from "react";
import { CompilerResult, FicCompilerError } from "../compiler/compiler";
import { Tab } from "../tabs/TabbedContext";
import { PreviewTabProps } from "./preview";

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/lib/codemirror.js');

interface ChapterSelectorProps extends React.HTMLProps<HTMLSelectElement> {
    map: Map<string, string>
}

export class OutputDisplayTab implements Tab<PreviewTabProps> {

    editor: CodeMirror.EditorFromTextArea|undefined = undefined;
    curChapter: string = "Placeholder";
    chapters: Map<string, string> = new Map<string, string>([[ "Placeholder", "Placeholder" ]]);

    render: (props: PreviewTabProps)=>JSX.Element = (props: PreviewTabProps)=>{
        let textRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        
        this.chapters = this.chaptersToMap(props.compiled);
        
        useEffect(()=>{
            this.editor = CodeMirror.fromTextArea(textRef.current!, {
                value: textRef.current!.value,
                mode: "htmlmixed",
                indentUnit: 4,
                indentWithTabs: true,
                lineNumbers: true,
                lineWrapping: true,
                readOnly: true
            });
        }, [textRef]);

        let ChapterSelector = this.chapterSelector.bind(this);

        return (
            <div className="compiler-output">
                <div className="compiler-output--selector-container">
                    <ChapterSelector map={this.chapters}/>
                </div>
                <div className="compiler-output--code-container">
                    <textarea defaultValue={this.chapters.get(this.curChapter)} ref={textRef}>
                    </textarea>
                </div>
            </div>
        )
    }

    chapterSelector: (props: ChapterSelectorProps)=>JSX.Element = (props: ChapterSelectorProps)=>{
        let items: JSX.Element[] = [];
        props.map.forEach((_v, k)=>{ items.push(<this.ChapterSelectorItem key={k} value={k}/>) })
        return (
            <select className="compiler--output--selector" defaultValue={this.curChapter} onChange={(event: ChangeEvent<HTMLSelectElement>)=>{ this.switchToChapter(event.target.value); }}>
                {items}
            </select>
        )
    }

    ChapterSelectorItem(props: React.HTMLProps<HTMLOptionElement>): JSX.Element {
        if(props.selected) console.log(props.value);
        return (
            <option key={props.value as string} {...props}>{props.value}</option>
        )
    }

    switchToChapter(chapter: string) {
        this.curChapter = chapter;
        this.editor!.setValue(this.chapters.get(chapter)!);
    }

    chaptersToMap(chapters: CompilerResult|FicCompilerError): Map<string, string> {
        if(chapters instanceof FicCompilerError) {
            this.curChapter = "Error";
            return new Map<string, string>([[ "Error", chapters.reason ]]);
        } else if(chapters.files === undefined) {
            console.log("literally what");
            this.curChapter = "Error";
            return new Map<string, string>([[ "Error", "Hot update has created an inconsistent state" ]]);
        } else {
            let cMap: Map<string, string> = chapters.files;
            if(!cMap.has(this.curChapter)) this.curChapter = cMap.keys().next().value;
            return cMap;
        } 
    }

    onClose(): void {
        this.editor!.toTextArea();
    }

    hotUpdate(n: OutputDisplayTab): void {
        this.editor = n.editor;
        this.curChapter = n.curChapter;
        this.chapters = n.chapters;
    }
    
}