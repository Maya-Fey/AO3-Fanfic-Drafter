import CodeMirror from "codemirror";
import { useEffect, useRef } from "react";
import { FicTemplate } from "../fanfic/template";
import { Tab } from "../tabs/TabbedContext";
import { TemplateProps } from "./templates";

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/mode/css/css.js');
require('codemirror/lib/codemirror.js');

export class TemplateSourceTab implements Tab<TemplateProps> {

    template: FicTemplate|undefined = undefined;
    htmlEditor: CodeMirror.EditorFromTextArea|undefined = undefined;
    cssEditor: CodeMirror.EditorFromTextArea|undefined = undefined;

    render: (props: TemplateProps)=>JSX.Element = (props: TemplateProps)=>{
        let htmlRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        let cssRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);

        this.template = props.template;

        useEffect(()=>{
            if(this.template === undefined) return;

            this.htmlEditor = CodeMirror.fromTextArea(htmlRef.current!, {
                value: htmlRef.current!.value,
                mode: "htmlmixed",
                indentUnit: 4,
                indentWithTabs: true,
                lineNumbers: true,
                lineWrapping: true
            });

            this.cssEditor = CodeMirror.fromTextArea(cssRef.current!, {
                value: cssRef.current!.value,
                mode: "css",
                indentUnit: 4,
                indentWithTabs: true,
                lineNumbers: true,
                lineWrapping: true
            });

            let autosaveHandle: NodeJS.Timeout = setInterval(()=>{
                if(this.htmlEditor !== undefined) {
                    this.template?.updateSource(this.htmlEditor.getValue(), this.cssEditor!.getValue());
                }
            }, 2000);
            return ()=>{
                clearInterval(autosaveHandle);
            }
        }, [htmlRef, cssRef]);

        if(this.template !== undefined) {
            return (
                <div className="template-source-editor">
                    <div className="template-source-editor__section">
                        <div className="template-source-editor__titlebox">
                            <span>
                                HTML
                            </span>
                        </div>
                        <textarea defaultValue={this.template!.source} ref={htmlRef}>
                        </textarea>
                    </div>
                    <div className="template-source-editor__section">
                        <span className="template-source-editor__titlebox">
                            CSS
                        </span>
                        <textarea defaultValue={this.template!.style} ref={cssRef}>
                        </textarea>
                    </div>
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
            this.template!.updateSource(this.htmlEditor!.getValue(), this.cssEditor!.getValue());
            this.htmlEditor!.toTextArea();
            this.cssEditor!.toTextArea();
            this.htmlEditor = undefined;
            this.cssEditor = undefined;
        }
    }

    hotUpdate(updated: TemplateSourceTab): void {
        this.template = updated.template;
        this.htmlEditor = updated.htmlEditor;
        this.cssEditor = updated.cssEditor;
    }
    
}