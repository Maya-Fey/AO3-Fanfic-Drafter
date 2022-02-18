import { makeAutoObservable } from "mobx";
import { FanficContext } from "../App";
import { Tab, TabbedContext } from "../tabs/TabbedContext";
import { TabbedWindow } from "../tabs/TabbedWindow";
import { MetadataTab } from "./metadata";
import { NotesTab } from "./notes";
import { TemplatesTab } from "./templates";
import { TextEditorTab } from "./texteditor";

enum EditorTab {
    TEXT = "Text",
    METADATA = "Metadata",
    TEMPLATES = "Templates",
    NOTES = "Notes"
}

export class EditorContext {
    tabCtx: TabbedContext<EditorProps, EditorTab>;

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

export interface EditorProps extends React.HTMLProps<HTMLDivElement> {
    ctx: EditorContext;
    fic: FanficContext;
}

export function Editor(props: EditorProps) {
    return (
        <div className="editor">
            <TabbedWindow<EditorProps, EditorTab> ctx={props.ctx.tabCtx} props={props}/>
        </div>
    );
}