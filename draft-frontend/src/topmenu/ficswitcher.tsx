import { observer } from "mobx-react";
import React from "react";
import { AppContext } from "../App";
import { FicFlush } from "./ficflush";
import { NewFic } from "./newficbutton";
import { ConnectionStatus } from "./serverconnect";

export interface FicSwitcherProps extends React.HTMLProps<HTMLDivElement> {
    ctx: AppContext;
}

export const FicSwitcher = observer((props: FicSwitcherProps)=>{
   if(props.ctx.server.status == ConnectionStatus.CONNECTED_TO_SERVER) {
       return (
           <React.Fragment>
               <hr/>
               <FicSwitcherDropdown ctx={props.ctx}/>&nbsp;
               <FicFlush ficCtx={props.ctx.fic} serverCtx={props.ctx.server}/>
               <hr/>
               <NewFic ficCtx={props.ctx.fic} serverCtx={props.ctx.server}/>
           </React.Fragment>
        );
    } else {
        return <React.Fragment></React.Fragment>;
    }
});

const FicSwitcherDropdown = observer((props: FicSwitcherProps)=>{
    let curSelected: string|undefined = props.ctx.fic.fic?.meta.title;
    let options: JSX.Element[] = props.ctx.server.fics.map(title=><FicSwitcherOption key={title} title={title} selected={curSelected==title} />)
    return (
        <select onChange={(e)=>{ props.ctx.fic.switchStory(e.target.value, props.ctx.server); }}>
            <option value="">Select a fic to edit</option>
            {options}
        </select>
    );
});

export interface FicSwitcherOptionProps extends React.HTMLProps<HTMLOptionElement> {
    title: string,
    selected: boolean
}

function FicSwitcherOption(props: FicSwitcherOptionProps) {
    if(props.selected) {
        return <option value={props.title} selected>{props.title}</option>
    } else {
        return <option value={props.title}>{props.title}</option>
    }
}