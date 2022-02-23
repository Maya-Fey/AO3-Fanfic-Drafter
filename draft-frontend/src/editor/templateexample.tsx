import CodeMirror from "codemirror"
import { useEffect, useRef } from "react";
import { FicTemplate } from "../fanfic/template";
import { Tab } from "../tabs/TabbedContext";
import { TemplateProps } from "./templates";

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/lib/codemirror.js');

export class TemplateExampleTab implements Tab<TemplateProps> {
    
    template: FicTemplate|undefined = undefined;
    editor: CodeMirror.EditorFromTextArea|undefined = undefined;
    
    render: (props: TemplateProps)=>JSX.Element = (props: TemplateProps)=>{
        let textRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        
        this.template = props.template;
        
        useEffect(()=>{
            if(this.template === undefined) return;

            this.editor = CodeMirror.fromTextArea(textRef.current!, {
                value: textRef.current!.value,
                mode: "htmlmixed",
                indentUnit: 4,
                indentWithTabs: true,
                lineNumbers: true,
                lineWrapping: true
            });

            let autosaveHandle: NodeJS.Timeout = setInterval(()=>{
                if(this.editor !== undefined) {
                    this.template!.updateExample(this.editor.getValue());
                }
            }, 2000);
            return ()=>{
                clearInterval(autosaveHandle);
            }
        }, [textRef]);
        if(this.template !== undefined) {
            return (
                <div className="example-editor">
                    <textarea defaultValue={this.template!.example} ref={textRef}>
                    </textarea>
                </div>
            )
        } else {
            return (
                <span>
                    No template selected
                </span>
            )
        }
    }

    onClose(): void {
        if(this.template !== undefined) {
            this.template!.updateExample(this.editor!.getValue());
            this.editor!.toTextArea();
            this.editor = undefined;
        }
    }

    hotUpdate(updated: TemplateExampleTab): void {
        this.template = updated.template;
        this.editor = updated.editor;
    }
    
}