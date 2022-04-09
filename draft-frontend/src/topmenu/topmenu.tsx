import { AppContext } from "../App";
import { FocusSwitcher } from "./foccusswitcher";
import { ServerConnect } from "./serverconnect";

export interface TopMenuProps extends React.HTMLProps<HTMLDivElement> {
    ctx: AppContext;
}

export function TopMenu(props: TopMenuProps) {
    return (
        <div className="top-menu">
            <FocusSwitcher ctx={props.ctx}/>
            <hr/>
            <ServerConnect ctx={props.ctx}/>
        </div>
    )
}