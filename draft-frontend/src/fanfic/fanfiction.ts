import { makeAutoObservable } from "mobx";
import { FicTemplate } from "./template";

export enum Rating {
    NOT_RATED = "Not Rated",
    GENERAL_AUDIENCES = "General Audiences",
    TEEN = "Teen and Up Audiences",
    MATURE = "Mature",
    EXPLICIT = "Explicit"
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

    constructor() {
        makeAutoObservable(this);
    }

    toTags(): string[] {
        let ret: string[] = [];
        if(this.choseNotToUse) ret.push("Creator Chose Not To Use Archive Warnings");
        if(this.majorDeath) ret.push("Major Character Death");
        if(this.graphicViolence) ret.push("Graphic Depictions Of Violence");
        if(this.underage) ret.push("Underage");
        if(this.rape) ret.push("Rape/Non-Con");
        if(ret.length === 0) ret.push("No Archive Warnings Apply");
        return ret;
    }
}

export class Categories {
    ff: boolean = false;
    fm: boolean = false;
    mm: boolean = false;
    multi: boolean = false;
    gen: boolean = false;
    other: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    toTags(): string[] {
        let ret: string[] = [];
        if(this.ff) ret.push("F/F");
        if(this.fm) ret.push("F/M");
        if(this.mm) ret.push("M/M");
        if(this.multi) ret.push("Multi");
        if(this.gen) ret.push("Gen");
        if(this.other) ret.push("Other");
        return ret;
    }
}

export class FanficMetadata implements HasValidator {
    title: string;
    rating: Rating = Rating.NOT_RATED;
    categories: Categories = new Categories();
    warnings: ArchiveWarnings = new ArchiveWarnings();

    summary: string = "";

    fandoms: string[] = [];
    ships: string[] = [];
    characters: string[] = [];
    tags: string[] = [];

    constructor(title: string) {
        this.title = title;
        makeAutoObservable(this);
    }

    validate(): ValidationResult {
        if(this.title.length <= 2) {
            return { valid: false, validationReason: "Must have a title" };
        }

        if(this.fandoms.length == 0) {
            return { valid: false, validationReason: "Must have at least one fandom" };
        }

        return { valid: true, validationReason: ""};
    }
}

export class Fanfic {
    
    text: string = "";

    templates: Map<string, FicTemplate> = new Map<string, FicTemplate>();

    meta: FanficMetadata;

    constructor(title: string) {
        this.meta = new FanficMetadata(title);
        makeAutoObservable(this);
    }

    updateText(newText: string): void {
        this.text = newText;
    }

    getTemplateIfPresent(key: string, setter: ()=>FicTemplate): FicTemplate {
        if(this.templates.has(key)) {
            return this.templates.get(key)!;
        } else {
            let template: FicTemplate = setter();
            this.templates.set(key, template);
            return template;
        }
    }

    fromSerialized(templates: any, meta: any) {
        this.templates = objectToMap(templates);
        this.meta = meta;
        let warn = new ArchiveWarnings();
        warn.choseNotToUse = meta.warnings.choseNotToUse;
        warn.graphicViolence = meta.warnings.graphicViolence;
        warn.majorDeath = meta.warnings.majorDeath;
        warn.rape = meta.warnings.rape;
        warn.underage = meta.warnings.underage;
        this.meta.warnings = warn;
        let cats: Categories = new Categories();
        cats.ff = meta.categories.ff;
        cats.fm = meta.categories.fm;
        cats.mm = meta.categories.mm;
        cats.multi = meta.categories.multi;
        cats.gen = meta.categories.gen;
        cats.other = meta.categories.other;
        this.meta.categories = cats;
    }
}

function objectToMap(obj: any): Map<any, any>  {
    const keys = Object.keys(obj);
    const map = new Map();
    for(let i = 0; i < keys.length; i++){
       //inserting new key value pair inside map
       map.set(keys[i], obj[keys[i]]);
    };
    return map;
 };