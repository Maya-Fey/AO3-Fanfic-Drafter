import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";

export class TextEditorTab implements Tab<EditorProps> {
    
    render(props: EditorProps): JSX.Element {
        return (
            <textarea>
                Gay
            </textarea>
        )
    }

    onClose(): void {
        //TODO: Save
    }
    
}