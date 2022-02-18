import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";

export class NotesTab implements Tab<EditorProps> {
    
    render(props: EditorProps): JSX.Element {
        return (
            <span>
                Notes
            </span>
        )
    }

    onClose(): void {
        //TODO: Save
    }
    
}