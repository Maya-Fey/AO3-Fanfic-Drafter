import { makeAutoObservable } from "mobx";
import { useEffect } from "react";
import { FanficContext } from "../App";
import { Fanfic } from "../fanfic/fanfiction";
import { FicTemplate } from "../fanfic/template";
import { Tab, TabbedContext } from "../tabs/TabbedContext";
import { TabbedWindow } from "../tabs/TabbedWindow";
import { EditorProps } from "./editor";
import { TemplateExampleTab } from "./templateexample";
import { TemplateSourceTab } from "./templatesource";

enum TemplateTab {
    SOURCE = "Source",
    EXAMPLE = "Example"
}

export interface TemplateProps extends React.HTMLProps<HTMLDivElement> {
    ctx: TemplateContext;
    fic: FanficContext;
    template: FicTemplate|undefined;
}

export class TemplateContext {
    tabCtx: TabbedContext<TemplateProps, TemplateTab>;

    constructor() {
        makeAutoObservable(this);
        let tabs: Map<TemplateTab, Tab<TemplateProps>> = new Map<TemplateTab, Tab<TemplateProps>>();
        tabs.set(TemplateTab.SOURCE, new TemplateSourceTab());
        tabs.set(TemplateTab.EXAMPLE, new TemplateExampleTab());
        this.tabCtx = new TabbedContext<TemplateProps, TemplateTab>(TemplateTab.SOURCE, tabs);
    }
}

function hotUpdate(tabCtx: TabbedContext<TemplateProps, TemplateTab>) {
    tabCtx.hotUpdate(TemplateTab.SOURCE, new TemplateSourceTab());
    tabCtx.hotUpdate(TemplateTab.EXAMPLE, new TemplateExampleTab());
}

function usePointlessHook(fic: Fanfic): void
{
    useEffect(()=>{
        fic.getTemplateIfPresent("test", ()=>new FicTemplate("test"));
    })
}

export class TemplatesTab implements Tab<EditorProps> {

    templateCtx: TemplateContext|undefined = undefined;
    
    getTemplate(fic: Fanfic): FicTemplate {
        return fic.getTemplateIfPresent("test", ()=>{return new FicTemplate("test")});
    }

    render: (props: EditorProps)=>JSX.Element = (props: EditorProps)=>{
        this.templateCtx = props.ctx.templateCtx;
        let template: FicTemplate|undefined = props.fic.fic.templates.has("test") ? props.fic.fic.templates.get("test") : undefined;

        useEffect(()=>{
            hotUpdate(this.templateCtx!.tabCtx)
        });

        usePointlessHook(props.fic.fic);

        return (
            <div className="template-tab">
                <div className="template-tab__template-manager">
                    Template Mangement goes here
                </div>
                <TabbedWindow<TemplateProps, TemplateTab> ctx={this.templateCtx.tabCtx} props={ { ctx: this.templateCtx, fic: props.fic, template: template} }/>
            </div>
        );
    }

    onClose(): void {
        this.templateCtx!.tabCtx.currentTab().onClose();
    }

    hotUpdate(n: TemplatesTab): void {
        this.templateCtx = n.templateCtx;
    }
    
}