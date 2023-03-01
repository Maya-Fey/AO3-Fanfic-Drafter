import { EditorView, EditorViewConfig } from "@codemirror/view";
import { useEffect, useRef } from "react";
import { FanficContext } from "../App";
import { EditorTarget } from "../fanfic/editortarget";
import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";
import { lineNumbers, gutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { search as CodeMirrorSearch, openSearchPanel, searchPanelOpen, closeSearchPanel } from "@codemirror/search"
import { keymap } from "@codemirror/view";
import { html as LangHTML } from "@codemirror/lang-html"
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language"
import { tags } from "@lezer/highlight";

export class TextEditorTab implements Tab<EditorProps> {

    ctx: FanficContext|undefined = undefined;
    view: EditorView|undefined = undefined;

    toggleSearch = (e: EditorView)=>{
        searchPanelOpen(e.state) ? closeSearchPanel(e) : openSearchPanel(e);
        return true;
    }

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
                        CodeMirrorSearch({
                            top: true
                        }),
                        keymap.of([
                            {
                                key: "Ctrl-f",
                                run: this.toggleSearch
                            }
                        ]),
                        LangHTML({}),
                        syntaxHighlighting(HighlightStyle.define([
                            {
                                tag: tags.tagName,
                                color: "#170"
                            },
                            {
                                tag: tags.angleBracket,
                                color: "#170"
                            },
                            {
                                tag: tags.attributeName,
                                color: "blue"
                            },
                            {
                                tag: tags.string,
                                color: "#a11"
                            }
                        ]))
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
                    <button onClick={()=>{this.toggleSearch(this.view!)}}>Find/Replace</button>
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

