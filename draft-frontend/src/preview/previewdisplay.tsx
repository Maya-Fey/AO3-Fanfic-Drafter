import { Tab } from "../tabs/TabbedContext";
import { PreviewProps } from "./preview";

export class PreviewDisplayTab implements Tab<PreviewProps> {
    
    render(props: PreviewProps): JSX.Element {
        return (
            <span>
                Preview
            </span>
        )
    }

    onClose(): void {
        //TODO: Save
    }
    
}