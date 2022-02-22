import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";

export class TemplatesTab implements Tab<EditorProps> {
    
    render(props: EditorProps): JSX.Element {
        return (
            <span>
                Templates
            </span>
        )
    }

    onClose(): void {
        //TODO: Save
    }

    hotUpdate(n: TemplatesTab): void {}
    
}