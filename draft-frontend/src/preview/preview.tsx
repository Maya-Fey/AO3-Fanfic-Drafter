import { makeAutoObservable } from "mobx";
import { FanficContext } from "../App";
import { Tab, TabbedContext } from "../tabs/TabbedContext";
import { TabbedWindow } from "../tabs/TabbedWindow";
import { OutputDisplayTab } from "./outputdisplay";
import { PreviewDisplayTab } from "./previewdisplay";

import { observer } from "mobx-react";
import { CompilerResult, compileTarget, FicCompilerError } from "../compiler/compiler";
import { EditorTarget } from "../fanfic/editortarget";
import { useEffect } from "react";

enum PreviewTab {
    PREVIEW = "Preview",
    OUTPUT = "Output",
}

export class PreviewContext {
    tabCtx: TabbedContext<PreviewTabProps, PreviewTab>;

    constructor() {
        makeAutoObservable(this);
        let tabs: Map<PreviewTab, Tab<PreviewTabProps>> = new Map<PreviewTab, Tab<PreviewTabProps>>();
        tabs.set(PreviewTab.PREVIEW, new PreviewDisplayTab());
        tabs.set(PreviewTab.OUTPUT, new OutputDisplayTab());
        this.tabCtx = new TabbedContext<PreviewTabProps, PreviewTab>(PreviewTab.PREVIEW, tabs);
    }
}

function hotUpdate(tabCtx: TabbedContext<PreviewTabProps, PreviewTab>) {
    tabCtx.hotUpdate(PreviewTab.PREVIEW, new PreviewDisplayTab());
    tabCtx.hotUpdate(PreviewTab.OUTPUT, new OutputDisplayTab());
}

interface PreviewProps extends React.HTMLProps<HTMLDivElement> {
    ctx: PreviewContext;
    targ: EditorTarget;
    fic: FanficContext;
}

export interface PreviewTabProps extends PreviewProps {
    compiled: CompilerResult|FicCompilerError
}

export const Preview = observer(function(props: PreviewProps) {
    let ret: CompilerResult|FicCompilerError = compileTarget(props.fic.fic, props.targ);
    useEffect(()=>{
        hotUpdate(props.ctx.tabCtx);
    });
    return (
        <div className="preview">
            <TabbedWindow<PreviewTabProps, PreviewTab> ctx={props.ctx.tabCtx} props={{ ctx: props.ctx, targ: props.targ, fic: props.fic, compiled: ret }}/>
        </div>
    );
});
