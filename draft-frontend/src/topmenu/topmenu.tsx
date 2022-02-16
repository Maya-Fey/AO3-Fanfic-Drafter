import { AppContext } from "../App";
import { FocusSwitcher } from "./foccusswitcher";

export interface TopMenuProps extends React.HTMLProps<HTMLDivElement> {
    ctx: AppContext;
}

export function TopMenu(props: TopMenuProps) {
    return (
        <div className="top-menu">
            <FocusSwitcher ctx={props.ctx}/>
        </div>
    )
}