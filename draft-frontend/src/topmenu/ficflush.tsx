import { observer } from "mobx-react";
import { FanficContext, FlushCapability } from "../App";
import { ServerContext } from "./serverconnect";

export interface FicFlushProps extends React.HTMLProps<HTMLButtonElement> {
    flush: FlushCapability;
}

export const FicFlush = observer((props: FicFlushProps)=>{
    if(props.flush.canFlush()) {
        return (
            <button onClick={()=>{props.flush.flush();}}>Flush</button>
        );
    } else {
        return (
            <button disabled>Flush</button>
        );
    }
});