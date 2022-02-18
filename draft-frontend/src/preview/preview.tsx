import { makeAutoObservable } from "mobx";
import { FanficContext } from "../App";
import { Tab, TabbedContext } from "../tabs/TabbedContext";
import { TabbedWindow } from "../tabs/TabbedWindow";
import { OutputDisplayTab } from "./outputdisplay";
import { PreviewDisplayTab } from "./previewdisplay";

enum PreviewTab {
    PREVIEW = "Preview",
    OUTPUT = "Output",
}

export class PreviewContext {
    tabCtx: TabbedContext<PreviewProps, PreviewTab>;

    constructor() {
        makeAutoObservable(this);
        let tabs: Map<PreviewTab, Tab<PreviewProps>> = new Map<PreviewTab, Tab<PreviewProps>>();
        tabs.set(PreviewTab.PREVIEW, new PreviewDisplayTab());
        tabs.set(PreviewTab.OUTPUT, new OutputDisplayTab());
        this.tabCtx = new TabbedContext<PreviewProps, PreviewTab>(PreviewTab.PREVIEW, tabs);
    }
}

export interface PreviewProps extends React.HTMLProps<HTMLDivElement> {
    ctx: PreviewContext;
    fic: FanficContext;
}

export function Preview(props: PreviewProps) {
    return (
        <div className="preview">
            <TabbedWindow<PreviewProps, PreviewTab> ctx={props.ctx.tabCtx} props={props}/>
        </div>
    );
}
