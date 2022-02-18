export enum Rating {
    NOT_RATED,
    GENERAL_AUDIENCES,
    TEEN,
    MATURE,
    EXPLICIT
}

export class ValidationResult {
    valid: boolean;
    validationReason: string;

    constructor(valid: boolean, validationReason: string) {
        this.valid = valid;
        this.validationReason = validationReason;
    } 
}

export interface HasValidator {
    validate(): ValidationResult;
}

export class ArchiveWarnings {
    choseNotToUse: boolean = false;
    majorDeath: boolean = false;
    graphicViolence: boolean = false;
    underage: boolean = false;
    rape: boolean = false;
}

export class Categories {
    ff: boolean = false;
    fm: boolean = false;
    mm: boolean = false;
    multi: boolean = false;
    gem: boolean = false;
    other: boolean = false;
}

export class Fanfic implements HasValidator {
    title: string;
    rating: Rating = Rating.NOT_RATED;
    categories: Categories = new Categories();
    warnings: ArchiveWarnings = new ArchiveWarnings();

    summary: string = "";

    fandoms: string[] = [];
    ships: string[] = [];
    characters: string[] = [];
    tags: string[] = [];

    text = "";

    constructor(title: string) {
        this.title = title;
    }

    validate(): ValidationResult {
        if(this.title.length <= 2) {
            return { valid: false, validationReason: "Must have a title" };
        }

        if(this.fandoms.length == 0) {
            return { valid: false, validationReason: "Must have at least one fandom" };
        }

        if(this.text.length < 10) {
            return { valid: false, validationReason: "Must have at least some text" };
        }

        return { valid: true, validationReason: ""};
    }
}