import { observer } from "mobx-react";
import { FanficContext } from "../App";
import { ServerContext } from "./serverconnect";

export interface FicFlushProps extends React.HTMLProps<HTMLButtonElement> {
    ficCtx: FanficContext;
    serverCtx: ServerContext;
}

export const FicFlush = observer((props: FicFlushProps)=>{
    if(props.ficCtx.fic !== undefined && props.ficCtx.dirty) {
        return (
            <button onClick={()=>{props.ficCtx.save(props.serverCtx);}}>Flush</button>
        );
    } else {
        return (
            <button disabled>Flush</button>
        );
    }
});