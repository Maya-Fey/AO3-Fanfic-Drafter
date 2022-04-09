import { observer } from "mobx-react";
import React from "react";
import { AppContext } from "../App";
import { ConnectionStatus } from "./serverconnect";

export interface FicSwitcherProps extends React.HTMLProps<HTMLDivElement> {
    ctx: AppContext;
}

export const FicSwitcher = observer((props: FicSwitcherProps)=>{
   if(props.ctx.server.status == ConnectionStatus.CONNECTED_TO_SERVER) {
       return (
           <React.Fragment>
               <hr/>
               <FicSwitcherDropdown ctx={props.ctx}/>
           </React.Fragment>
        );
    } else {
        return <React.Fragment></React.Fragment>;
    }
});

const FicSwitcherDropdown = observer((props: FicSwitcherProps)=>{
    let options: JSX.Element[] = props.ctx.server.fics.map(title=><FicSwitcherOption title={title} />)
    return (
        <select onChange={(e)=>{ props.ctx.fic.switchStory(e.target.value, props.ctx.server); }}>
            <option value="">Select a fic to edit</option>
            {options}
        </select>
    );
});

export interface FicSwitcherOptionProps extends React.HTMLProps<HTMLOptionElement> {
    title: string
}

function FicSwitcherOption(props: FicSwitcherOptionProps) {
    return <option key={props.title} value={props.title}>{props.title}</option>
}