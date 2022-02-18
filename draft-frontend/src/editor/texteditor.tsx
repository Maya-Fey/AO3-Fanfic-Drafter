import CodeMirror from "codemirror"
import { useEffect, useRef } from "react";
import { FanficContext } from "../App";
import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/lib/codemirror.js');

export class TextEditorTab implements Tab<EditorProps> {

    ctx: FanficContext|undefined = undefined;
    editor: CodeMirror.EditorFromTextArea|undefined = undefined;

    render: (props: EditorProps)=>JSX.Element = (props: EditorProps)=>{
        let textRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        
        this.ctx = props.fic;
        
        useEffect(()=>{
            console.log(textRef.current!);
            this.editor = CodeMirror.fromTextArea(textRef.current!, {
                value: textRef.current!.value,
                mode: "htmlmixed",
                indentUnit: 4,
                indentWithTabs: true,
                lineNumbers: true,
                lineWrapping: true
            });
        }, [textRef]);
        
        return (
            <div className="fic-editor">
                <textarea defaultValue={this.ctx.fic.text} ref={textRef}>
                </textarea>
            </div>
        )
    }

    onClose(): void {
        this.ctx!.fic.text = this.editor!.getValue();
        this.editor!.toTextArea();
    }
    
}

