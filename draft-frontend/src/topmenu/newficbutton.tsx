import { observer } from "mobx-react";
import { FanficContext } from "../App";
import { ServerContext } from "./serverconnect";

export interface NewFicProps extends React.HTMLProps<HTMLButtonElement> {
    ficCtx: FanficContext;
    serverCtx: ServerContext;
}

export const NewFic = observer((props: NewFicProps)=>{
    return (
        <button onClick={()=>{props.ficCtx.newfic(props.serverCtx);}}>New Fanfic</button>
    );
});