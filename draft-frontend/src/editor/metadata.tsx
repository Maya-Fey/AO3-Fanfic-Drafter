import { action } from "mobx";
import React, {  useEffect, useRef } from "react";
import { Fanfic, Rating } from "../fanfic/fanfiction";
import { Tab } from "../tabs/TabbedContext";
import { EditorProps } from "./editor";

export class MetadataTab implements Tab<EditorProps> {
    
    render: (props: EditorProps)=>JSX.Element = (props: EditorProps)=>{
        let fandomsField: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        let shipsField: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        let characterField: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        let tagsField: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);
        let titleField: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null as HTMLInputElement|null);
        let summaryField: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null as HTMLTextAreaElement|null);

        let fic: Fanfic = props.fic.fic as Fanfic;

        useEffect(()=>{
            fandomsField.current!.value = this.unparseTags(fic.meta.fandoms);
            shipsField.current!.value = this.unparseTags(fic.meta.ships);
            characterField.current!.value = this.unparseTags(fic.meta.characters);
            tagsField.current!.value = this.unparseTags(fic.meta.tags);
            titleField.current!.value = fic.meta.title;
            summaryField.current!.value = fic.meta.summary;
        });

        return (
            <div className="metadata-edit">
                <table className="metadata-edit__table">
                    <tr>
                        <td>
                            <p>
                                Rating:
                            </p>
                        </td>
                        <td className="metadata-edit__rating-selector">
                            <RatingSelector fic={fic}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Archive Warnings:
                            </p>
                        </td>
                        <td className="metadata-edit__warning-selector">
                            <input id="chosenottouse" type="checkbox" onChange={action((_e)=>fic.meta.warnings.choseNotToUse = !fic.meta.warnings.choseNotToUse)} defaultChecked={fic.meta.warnings.choseNotToUse}/><label htmlFor="chosenottouse">Creator Chose Not to Use Archive Warnings</label>
                            <input id="death" type="checkbox" onChange={action((_e)=>fic.meta.warnings.majorDeath = !fic.meta.warnings.majorDeath)} defaultChecked={fic.meta.warnings.majorDeath}/><label htmlFor="death">Major Character Death</label>
                            <input id="violence" type="checkbox" onChange={action((_e)=>fic.meta.warnings.graphicViolence = !fic.meta.warnings.graphicViolence)} defaultChecked={fic.meta.warnings.graphicViolence}/><label htmlFor="violence">Grahic Depictions of Violence</label>
                            <input id="rape" type="checkbox" onChange={action((_e)=>fic.meta.warnings.rape = !fic.meta.warnings.rape)} defaultChecked={fic.meta.warnings.rape}/><label htmlFor="rape">Rape/Non-Con</label>
                            <input id="underage" type="checkbox" onChange={action((_e)=>fic.meta.warnings.underage = !fic.meta.warnings.underage)} defaultChecked={fic.meta.warnings.underage}/><label htmlFor="underage">Underage</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Fandoms:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__fandoms-textarea" onChange={action((e)=>{fic.meta.fandoms = this.parseTags(fandomsField.current!.value);})}ref={fandomsField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Categories:
                            </p>
                        </td>
                        <td className="metadata-edit__category-selector">
                            <input id="ff" type="checkbox" onChange={action((_e)=>fic.meta.categories.ff = !fic.meta.categories.ff)} defaultChecked={fic.meta.categories.ff}/><label htmlFor="ff">F/F</label>
                            <input id="fm" type="checkbox" onChange={action((_e)=>fic.meta.categories.fm = !fic.meta.categories.fm)} defaultChecked={fic.meta.categories.fm}/><label htmlFor="fm">F/M</label>
                            <input id="mm" type="checkbox" onChange={action((_e)=>fic.meta.categories.mm = !fic.meta.categories.mm)} defaultChecked={fic.meta.categories.mm}/><label htmlFor="mm">M/M</label>
                            <input id="multi" type="checkbox" onChange={action((_e)=>fic.meta.categories.multi = !fic.meta.categories.multi)} defaultChecked={fic.meta.categories.multi}/><label htmlFor="multi">Multi</label>
                            <input id="gen" type="checkbox" onChange={action((_e)=>fic.meta.categories.gen = !fic.meta.categories.gen)} defaultChecked={fic.meta.categories.gen}/><label htmlFor="gen">Gen</label>
                            <input id="other" type="checkbox" onChange={action((_e)=>fic.meta.categories.other = !fic.meta.categories.other)} defaultChecked={fic.meta.categories.other}/><label htmlFor="other">Other</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Ships:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__ships-textarea" onChange={action((e)=>{fic.meta.ships = this.parseTags(shipsField.current!.value);})} ref={shipsField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Characters:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__characters-textarea" onChange={action((e)=>{fic.meta.characters = this.parseTags(characterField.current!.value);})} ref={characterField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Tags:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__tags-textarea" onChange={action((e)=>{fic.meta.tags = this.parseTags(tagsField.current!.value);})} ref={tagsField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Title:
                            </p>
                        </td>
                        <td>
                            <input type="text" className="metadata-edit__title-input" onChange={action((e)=>{fic.meta.title = titleField.current!.value})}ref={titleField}></input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Summary:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__summary-textarea" onChange={action((e)=>{fic.meta.summary = summaryField.current!.value})} ref={summaryField}></textarea>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }

    parseTags(str: string): string[] {
        return str.split(",").map(s=>s.trim());
    }

    unparseTags(tags: string[]): string {
        return tags.join(", ");
    }

    onClose(): void {
        //TODO: Save
    }

    hotUpdate(n: MetadataTab): void {}
    
}

interface RatingSelectorProps extends React.HTMLProps<HTMLDivElement>{
    fic: Fanfic;
}

const RatingSelector: (props: RatingSelectorProps)=>JSX.Element =  (props: RatingSelectorProps)=>{
    return (<React.Fragment>
        {[Rating.NOT_RATED, Rating.GENERAL_AUDIENCES, Rating.TEEN, Rating.MATURE, Rating.EXPLICIT]
            .map(rating=>[
                <input type="radio" name="rating" id={String(rating)} value={String(rating)} defaultChecked={props.fic.meta.rating == rating} onChange={action(()=>{props.fic.meta.rating = rating})}/>,
                <label htmlFor={String(rating)}>{String(rating)}</label>])
            .reduce((a1, a2)=>a1.concat(a2))}    
     </React.Fragment>);
}