import { action, makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { ButtonHTMLAttributes, ChangeEvent, useRef } from "react";
import { useEffect } from "react";
import { FanficContext } from "../App";
import { EditorTarget } from "../fanfic/editortarget";
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
    selectedTemplate: string|undefined = undefined;

    constructor() {
        makeAutoObservable(this);
        let tabs: Map<TemplateTab, Tab<TemplateProps>> = new Map<TemplateTab, Tab<TemplateProps>>();
        tabs.set(TemplateTab.SOURCE, new TemplateSourceTab());
        tabs.set(TemplateTab.EXAMPLE, new TemplateExampleTab());
        this.tabCtx = new TabbedContext<TemplateProps, TemplateTab>(TemplateTab.SOURCE, tabs);
    }

    setSelection(selection: string|undefined) {
        runInAction(()=>{
            this.selectedTemplate = selection;
        });
    }
}

function hotUpdate(tabCtx: TabbedContext<TemplateProps, TemplateTab>) {
    tabCtx.hotUpdate(TemplateTab.SOURCE, new TemplateSourceTab());
    tabCtx.hotUpdate(TemplateTab.EXAMPLE, new TemplateExampleTab());
}

export class TemplatesTab implements Tab<EditorProps> {

    templateCtx: TemplateContext|undefined = undefined;

    setSelection(selection: string|undefined) {
        if(this.templateCtx!.selectedTemplate !== selection && this.templateCtx!.selectedTemplate !== undefined) {
            this.templateCtx!.tabCtx.currentTab().onClose();
        }
        this.templateCtx!.setSelection(selection);
    }

    render: (props: EditorProps)=>JSX.Element = (props: EditorProps)=>{
        let fic: Fanfic = props.fic.fic as Fanfic;

        this.templateCtx = props.ctx.templateCtx;
        
        useEffect(()=>{
            hotUpdate(this.templateCtx!.tabCtx)
        });

        if(!(this.templateCtx!.selectedTemplate !== undefined && fic.templates.has(this.templateCtx!.selectedTemplate))) {
            if(fic.templates.size > 0) {
                this.setSelection(fic.templates.keys().next().value);
            } else if(this.templateCtx!.selectedTemplate !== undefined) {
                this.setSelection(undefined);
            }
        } 

        useEffect(()=>{
            if(this.templateCtx!.selectedTemplate !== undefined)
                props.retarget.retarget(EditorTarget.targetTemplate(this.templateCtx!.selectedTemplate!));
        });

        return (
            <div className="template-tab">
                <div className="template-tab__template-manager">
                    <this.templateManagement fic={fic}/>
                </div>
                <TabbedWindow<TemplateProps, TemplateTab> ctx={this.templateCtx.tabCtx} props={ { ctx: this.templateCtx, fic: props.fic, template: fic.templates.get(this.templateCtx.selectedTemplate!)} }/>
            </div>
        );
    }

    templateManagement: (fic: TemplateManagementProps)=>JSX.Element = (fic: TemplateManagementProps)=>{
        return (
            <React.Fragment>
                <this.templateSelector className="template-tab__template-selector" fic={fic.fic}/>
                <this.templateRemover fic={fic.fic}/>
                <button onClick={ action(()=>{ this.newTemplate(fic.fic); }) }>New</button>
            </React.Fragment>
        )
    }

    templateSelector: (props: TemplateSelectorProps)=>JSX.Element = observer((props: TemplateSelectorProps)=>{
        let ref: React.RefObject<HTMLSelectElement> = useRef<HTMLSelectElement>(null as HTMLSelectElement|null);
        let definitelyObserved: string|undefined = this.templateCtx!.selectedTemplate;
        useEffect(()=>{
            if(definitelyObserved !== undefined) {
                ref.current!.value = definitelyObserved;
            }
        });
        if(props.fic.templates.size == 0) {
            return (
                <select {...props}>
                    <option disabled>No templates</option>
                </select>
            );
        } else {
            let options: JSX.Element[] = [];
            props.fic.templates.forEach((_v, k)=>{
                options.push(<option value={k} key={k}>{k}</option>)
            });
            return (
                <select {...props} ref={ref} onChange={action((e: ChangeEvent<HTMLSelectElement>)=>{ this.setSelection(e.target.value); })}>
                    {options}
                </select>
            );
        }
    });

    templateRemover: (props: TemplateRemoveButtonProps)=>JSX.Element = (props: TemplateRemoveButtonProps)=>{
        if(this.templateCtx!.selectedTemplate === undefined) {
            return (
                <button {...props} disabled>Delete</button>
            ) ;
        } else {
            return (
                <button onClick={action(()=>{ props.fic.templates.delete(this.templateCtx!.selectedTemplate!); this.setSelection(undefined); })}>Delete</button>
            );
        }
    }

    newTemplate(fic: Fanfic) {
        let name: string|null = window.prompt("Name for template?");
        if(name !== null) {
            if(fic.templates.has(name)) {
                alert("name already in use");
                return;
            }

            fic.newTemplate(name);
            this.setSelection(name);
        }
    }

    onClose(): void {
        this.templateCtx!.tabCtx.currentTab().onClose();
    }

    hotUpdate(n: TemplatesTab): void {
        this.templateCtx = n.templateCtx;
    }
    
}

interface TemplateManagementProps  {
    fic: Fanfic;
}
interface TemplateSelectorProps extends React.HTMLProps<HTMLSelectElement> {
    fic: Fanfic;
}
interface TemplateRemoveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fic: Fanfic;
}