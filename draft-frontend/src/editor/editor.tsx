import { makeAutoObservable } from "mobx";
import { useEffect } from "react";
import { FanficContext } from "../App";
import { Tab, TabbedContext } from "../tabs/TabbedContext";
import { TabbedWindow } from "../tabs/TabbedWindow";
import { MetadataTab } from "./metadata";
import { NotesTab } from "./notes";
import { TemplateContext, TemplatesTab } from "./templates";
import { TextEditorTab } from "./texteditor";

enum EditorTab {
    TEXT = "Text",
    METADATA = "Metadata",
    TEMPLATES = "Templates",
    NOTES = "Notes"
}

export class EditorContext {
    tabCtx: TabbedContext<EditorProps, EditorTab>;
    templateCtx: TemplateContext = new TemplateContext();
    
    constructor() {
        makeAutoObservable(this);
        let tabs: Map<EditorTab, Tab<EditorProps>> = new Map<EditorTab, Tab<EditorProps>>();
        tabs.set(EditorTab.TEXT, new TextEditorTab());
        tabs.set(EditorTab.METADATA, new MetadataTab());
        tabs.set(EditorTab.TEMPLATES, new TemplatesTab());
        tabs.set(EditorTab.NOTES, new NotesTab());
        this.tabCtx = new TabbedContext<EditorProps, EditorTab>(EditorTab.TEXT, tabs);
    }
}

function hotUpdate(tabCtx: TabbedContext<EditorProps, EditorTab>) {
    tabCtx.hotUpdate(EditorTab.TEXT, new TextEditorTab());
    tabCtx.hotUpdate(EditorTab.METADATA, new MetadataTab());
    tabCtx.hotUpdate(EditorTab.TEMPLATES, new TemplatesTab());
    tabCtx.hotUpdate(EditorTab.NOTES, new NotesTab());
}

export interface EditorProps extends React.HTMLProps<HTMLDivElement> {
    ctx: EditorContext;
    fic: FanficContext;
}

export function Editor(props: EditorProps) {
    useEffect(()=>{
        hotUpdate(props.ctx.tabCtx);
    });
    return (
        <div className="editor">
            <TabbedWindow<EditorProps, EditorTab> ctx={props.ctx.tabCtx} props={props}/>
        </div>
    );
}