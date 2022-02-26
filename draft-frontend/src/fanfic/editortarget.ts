export class EditorTarget {
    readonly targetTemplate: boolean;
    readonly templateName: string;

    constructor(targetTemplate: boolean, templateName: string) {
        this.targetTemplate = targetTemplate;
        this.templateName = templateName;
    }

    equals(other: EditorTarget): boolean {
        return this.targetTemplate === other.targetTemplate && this.templateName === other.templateName;
    }

    static targetFic(): EditorTarget {
        return new EditorTarget(false, "");
    }

    static targetTemplate(templateName: string): EditorTarget {
        return new EditorTarget(true, templateName);
    }
}