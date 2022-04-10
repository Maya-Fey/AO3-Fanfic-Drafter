import { makeAutoObservable, reaction, observe } from "mobx";
import { allowStateReadsStart  } from "mobx/dist/internal";
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

    constructor(onDirty: ()=>void) {
        makeAutoObservable(this);

        observe(this, onDirty);
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

    fromSerialized(obj: any) {
        this.choseNotToUse = obj.choseNotToUse;
        this.majorDeath = obj.majorDeath
        this.graphicViolence = obj.graphicViolence;
        this.underage = obj.underage;
        this.rape = obj.rape;
    }
}

export class Categories {
    ff: boolean = false;
    fm: boolean = false;
    mm: boolean = false;
    multi: boolean = false;
    gen: boolean = false;
    other: boolean = false;

    constructor(onDirty: ()=>void) {
        makeAutoObservable(this);

        observe(this, onDirty);
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

    fromSerialized(obj: any) {
        this.ff = obj.ff;
        this.fm = obj.fm;
        this.mm = obj.mm;
        this.multi = obj.multi;
        this.gen = obj.gen;
        this.other = obj.other;
    }
}

export class FanficMetadata implements HasValidator {
    title: string;
    rating: Rating = Rating.NOT_RATED;
    categories: Categories;
    warnings: ArchiveWarnings;

    summary: string = "";

    fandoms: string[] = [];
    ships: string[] = [];
    characters: string[] = [];
    tags: string[] = [];

    constructor(title: string, onDirty: ()=>void) {
        this.title = title;
        makeAutoObservable(this);

        this.warnings = new ArchiveWarnings(onDirty);
        this.categories = new Categories(onDirty)

        observe(this, onDirty);
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

    fromSerialized(obj: any) {
        this.title = obj.title;
        this.rating = obj.rating;
        this.summary = obj.summary;
        this.fandoms = obj.fandoms;
        this.ships = obj.ships;
        this.characters = obj.characters;
        this.tags = obj.tags;

        this.warnings.fromSerialized(obj.warnings);
        this.categories.fromSerialized(obj.categories);
    }
}

export class Fanfic {
    
    text: string = "";

    templates: Map<string, FicTemplate> = new Map<string, FicTemplate>();

    meta: FanficMetadata;

    constructor(title: string, onDirty: ()=>void) {
        this.meta = new FanficMetadata(title, onDirty);

        makeAutoObservable(this);

        reaction(()=>this.templates.size,_size=>onDirty());

        observe(this.templates, onDirty);
        observe(this, onDirty);

        this.onDirty = onDirty;
    }

    onDirty: ()=>void = ()=>{};

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

    newTemplate(name: string): FicTemplate {
        let temp: FicTemplate = new FicTemplate(name);
        observe(temp, this.onDirty);
        this.templates.set(name, temp);
        return temp;
    }

    fromSerialized(obj: any) {
        this.text = obj.text;
        Object.keys(obj.templates).forEach(key=>{
            makeAutoObservable(obj[key]);
            this.templates.set(key, obj[key]);
        })
        this.meta.fromSerialized(obj.meta);
    }
}