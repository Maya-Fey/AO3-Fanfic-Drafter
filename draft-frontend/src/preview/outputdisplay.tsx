import CodeMirror from "codemirror";
import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef } from "react";
import { FicCompilerError } from "../compiler/compiler";
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
                    <textarea defaultValue={this.chapters.get(this.chapters.keys().next().value)} ref={textRef}>
                    </textarea>
                </div>
            </div>
        )
    }

    chapterSelector: (props: ChapterSelectorProps)=>JSX.Element = (props: ChapterSelectorProps)=>{
        let items: JSX.Element[] = [];
        props.map.forEach((_v, k)=>{ items.push(<this.ChapterSelectorItem value={k}/>) })
        return (
            <select className="compiler--output--selector" onChange={(event: ChangeEvent<HTMLSelectElement>)=>{ this.editor!.setValue(this.chapters.get(event.target.value)!)}}>
                {items}
            </select>
        )
    }

    ChapterSelectorItem(props: React.HTMLProps<HTMLOptionElement>): JSX.Element {
        return (
            <option key={props.value as string} {...props}>{props.value}</option>
        )
    }

    chaptersToMap(chapters: string[]|FicCompilerError): Map<string, string> {
        if(chapters instanceof FicCompilerError) {
            return new Map<string, string>([[ "Error", chapters.reason ]]);
        } else {
            return new Map<string, string>(chapters.map((val, idx)=>[ "Chapter " + (idx + 1), val ]));
        }
    }

    onClose(): void {
        this.editor!.toTextArea();
    }
    
}