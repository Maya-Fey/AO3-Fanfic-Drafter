import { observer } from "mobx-react";
import { AppContext, WindowFocus } from "../App";

export interface FocusSwitcherProps extends React.HTMLProps<HTMLDivElement> {
    ctx: AppContext;
}

export const FocusSwitcher = observer((props: FocusSwitcherProps)=>{
    return (
        <div>
            <FocusSwitchButton ctx={props.ctx} focusType={WindowFocus.EDITOR_ONLY}>
                Editor
            </FocusSwitchButton>
            <FocusSwitchButton ctx={props.ctx} focusType={WindowFocus.BOTH}>
                Both
            </FocusSwitchButton>
            <FocusSwitchButton ctx={props.ctx} focusType={WindowFocus.PREVIEW_ONLY}>
                Preview
            </FocusSwitchButton>
        </div>
    );
});

interface FocusSwitchButtonProps extends React.HTMLProps<HTMLDivElement> {
    focusType: WindowFocus;
    ctx: AppContext;
}

const FocusSwitchButton = observer((props: FocusSwitchButtonProps)=>{
    if(props.focusType != props.ctx.getFocus()) {
        return (
            <button onClick={()=>{props.ctx.setFocus(props.focusType)}}>
                {props.children}
            </button>
        );
    } else {
        return (
            <button disabled>
                {props.children}
            </button>
        );
    }
});