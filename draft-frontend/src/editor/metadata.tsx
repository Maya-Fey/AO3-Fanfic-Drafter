import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";

export class MetadataTab implements Tab<EditorProps> {
    
    render(props: EditorProps): JSX.Element {
        return (
            <span>
                Metadata
            </span>
        )
    }

    onClose(): void {
        //TODO: Save
    }
    
}