import { Tab } from "../tabs/TabbedContext";
import { PreviewTabProps } from "./preview";

export class PreviewDisplayTab implements Tab<PreviewTabProps> {
    
    render(props: PreviewTabProps): JSX.Element {
        return (
            <span>
                Preview
            </span>
        )
    }

    onClose(): void {
        //TODO: Save
    }

    hotUpdate(n: PreviewDisplayTab): void {}
    
}