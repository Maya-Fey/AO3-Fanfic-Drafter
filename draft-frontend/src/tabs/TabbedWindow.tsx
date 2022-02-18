import { observer } from "mobx-react";
import { TabbedContext } from "./TabbedContext";
import { TabSelector } from "./TabSelector";

interface TabbedWindowProps<Props extends React.HTMLProps<HTMLDivElement>, Enum> extends React.HTMLProps<HTMLDivElement> {
    ctx: TabbedContext<Props, Enum>,
    props: Props
}

export const TabbedWindow = observer(function<Props extends React.HTMLProps<HTMLDivElement>, Enum>(props: TabbedWindowProps<Props, Enum>) {
    let Tab: ((props: Props)=>JSX.Element) = observer(props.ctx.currentTab().render.bind(props.ctx.currentTab()));
    return (
        <div className="tabbed-window">
            <TabSelector<Props, Enum> ctx={props.ctx}/>
            <div className="tabbed-window__open-tab">
                <Tab {...props.props}/>
            </div>
        </div>
    )
});