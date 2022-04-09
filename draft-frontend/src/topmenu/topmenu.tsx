import { AppContext } from "../App";
import { FicSwitcher } from "./ficswitcher";
import { FocusSwitcher } from "./foccusswitcher";
import { ServerConnect } from "./serverconnect";

export interface TopMenuProps extends React.HTMLProps<HTMLDivElement> {
    ctx: AppContext;
}

export function TopMenu(props: TopMenuProps) {
    return (
        <div className="top-menu">
            <FocusSwitcher ctx={props.ctx}/>
            <FicSwitcher ctx={props.ctx}/>
            <hr/>
            <ServerConnect ctx={props.ctx}/>
        </div>
    )
}