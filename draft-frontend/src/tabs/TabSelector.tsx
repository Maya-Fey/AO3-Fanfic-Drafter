import { TabbedContext } from "./TabbedContext";

interface TabSelectorProps<Props extends React.HTMLProps<HTMLDivElement>, Enum> extends React.HTMLProps<HTMLDivElement> {
    ctx: TabbedContext<Props, Enum>
}

export function TabSelector<Props extends React.HTMLProps<HTMLDivElement>, Enum>(props: TabSelectorProps<Props, Enum>): JSX.Element {
    let eles: JSX.Element[] = [];
    props.ctx.tabs.forEach((val, key)=>{
        eles.push(<TabSelectorButton className="tabbed-window__tab-selector-button" enabled={key!=props.ctx.currentTabId()} name={String(key)} setTab={()=>{props.ctx.setCurrentTab(key);}}/>);
    });
    return (
        <div className="tabbed-window__tab-selector">
            <span className="tabbed-window__tab-selector-anchor">&nbsp;</span>
            {eles}
        </div>
    )
}

interface TabSelectorButtonProps extends React.HTMLProps<HTMLButtonElement> {
    enabled: boolean,
    name: string,
    setTab: ()=>void
}


function TabSelectorButton(props: TabSelectorButtonProps): JSX.Element {
    if(props.enabled) {
        return <button className={props.className} onClick={()=>{props.setTab()}}>{props.name}</button>
    } else {
        return <span className={props.className}>{props.name}</span>
    }
}