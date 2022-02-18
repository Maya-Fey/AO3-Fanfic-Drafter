import { Tab } from "../tabs/TabbedContext";
import { PreviewProps } from "./preview";

export class OutputDisplayTab implements Tab<PreviewProps> {
    
    render(props: PreviewProps): JSX.Element {
        return (
            <span>
                Output
            </span>
        )
    }

    onClose(): void {
        //TODO: Save
    }
    
}