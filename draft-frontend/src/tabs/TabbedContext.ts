import { makeAutoObservable } from "mobx";

export class TabbedContext<Props extends React.HTMLProps<HTMLDivElement>, Enum> {
    private cur: Enum;
    tabs: Map<Enum, Tab<Props>>;

    constructor(init: Enum, tabs: Map<Enum, Tab<Props>>) {
        this.cur = init;
        this.tabs = tabs;
        makeAutoObservable(this);
    }

    currentTabId(): Enum {
        return this.cur;
    }

    currentTab(): Tab<Props> {
        return this.tabs.get(this.cur)!;
    }

    setCurrentTab(nCur: Enum): void {
        this.tabs.get(this.cur)!.onClose();
        this.cur = nCur; 
    }

    hotUpdate(key: Enum, value: Tab<Props>) {
        value.hotUpdate(this.tabs.get(key)!);
        this.tabs.set(key, value);
    }

}

export interface Tab<Props extends React.HTMLProps<HTMLDivElement>> {
    render(props: Props): JSX.Element;
    onClose(): void;
    hotUpdate(updated: this): void;
}

