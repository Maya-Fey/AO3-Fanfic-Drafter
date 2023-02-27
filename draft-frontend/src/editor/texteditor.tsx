import { EditorView, EditorViewConfig } from "@codemirror/view";
import { useEffect, useRef } from "react";
import { FanficContext } from "../App";
import { EditorTarget } from "../fanfic/editortarget";
import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";
import { lineNumbers, gutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";

export class TextEditorTab implements Tab<EditorProps> {

    ctx: FanficContext|undefined = undefined;
    view: EditorView|undefined = undefined;

    render: (props: EditorProps)=>JSX.Element = (props: EditorProps)=>{
        let textRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null as HTMLDivElement|null);

        this.ctx = props.fic;

        useEffect(()=>{
            this.view = new EditorView({
                state: EditorState.create({
                    doc: props.fic.fic!.text,
                    extensions: [
                        EditorState.tabSize.of(4),
                        EditorView.lineWrapping,
                        lineNumbers({}),
                    ]
                }),
                parent: textRef.current!,
            });
            

            let autosaveHandle: NodeJS.Timeout = setInterval(()=>{
                if(this.view !== undefined) {
                    this.ctx!.fic!.updateText([...this.view!.state.doc].join(""));
                }
            }, 2000);
            return ()=>{
                clearInterval(autosaveHandle);
            }
        }, [textRef]);

        useEffect(()=>{
            props.retarget.retarget(EditorTarget.targetFic());
        });

        return (
            <div className="fic-editor" ref={textRef}>
                <div className="fic-editor__top-bar">
                    <button>girls</button>
                </div>
            </div>
        )
    }

    onClose(): void {
        this.ctx!.fic!.updateText([...this.view!.state.doc].join(""));
        this.view!.destroy();
        this.view = undefined;
    }

    hotUpdate(n: TextEditorTab): void {
        this.ctx = n.ctx;
        this.view = n.view;
    }
    
}

