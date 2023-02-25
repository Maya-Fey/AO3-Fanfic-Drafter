import localStorage from 'mobx-localstorage';
import { observer } from 'mobx-react';
import React from 'react';
import { FlushCapability } from '../App';

export interface AutosaveCheckmarkProps extends React.HTMLProps<HTMLInputElement> {
    flush: FlushCapability
}

let timer: NodeJS.Timer|undefined = undefined;

function updateTimer(flush: FlushCapability): void {
    if(localStorage.get("autosave")) {
        if(timer !== undefined) return;
        timer = setInterval(()=>{
            flush.flush();
        }, 10*1000);
    } else if(timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
    }
}

export const AutosaveCheckmark = observer((props: AutosaveCheckmarkProps)=>{
    updateTimer(props.flush);
    return (
        <React.Fragment>
            <input type="checkbox" name="autosave" onChange={(_e)=>{
                localStorage.set("autosave", !localStorage.get("autosave"));
                updateTimer(props.flush);
            }} defaultChecked={localStorage.get("autosave")}></input> Autosave
        </React.Fragment>
    );
});