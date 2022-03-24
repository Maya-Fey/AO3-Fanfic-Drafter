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

        useEffect(()=>{
            fandomsField.current!.value = this.unparseTags(props.fic.fic.fandoms);
            shipsField.current!.value = this.unparseTags(props.fic.fic.ships);
            characterField.current!.value = this.unparseTags(props.fic.fic.characters);
            tagsField.current!.value = this.unparseTags(props.fic.fic.tags);
            titleField.current!.value = props.fic.fic.title;
            summaryField.current!.value = props.fic.fic.summary;
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
                            <RatingSelector fic={props.fic.fic}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Archive Warnings:
                            </p>
                        </td>
                        <td className="metadata-edit__warning-selector">
                            <input id="chosenottouse" type="checkbox" onChange={action((_e)=>props.fic.fic.warnings.choseNotToUse = !props.fic.fic.warnings.choseNotToUse)} defaultChecked={props.fic.fic.warnings.choseNotToUse}/><label htmlFor="chosenottouse">Creator Chose Not to Use Archive Warnings</label>
                            <input id="death" type="checkbox" onChange={action((_e)=>props.fic.fic.warnings.majorDeath = !props.fic.fic.warnings.majorDeath)} defaultChecked={props.fic.fic.warnings.majorDeath}/><label htmlFor="death">Major Character Death</label>
                            <input id="violence" type="checkbox" onChange={action((_e)=>props.fic.fic.warnings.graphicViolence = !props.fic.fic.warnings.graphicViolence)} defaultChecked={props.fic.fic.warnings.graphicViolence}/><label htmlFor="violence">Grahic Depictions of Violence</label>
                            <input id="rape" type="checkbox" onChange={action((_e)=>props.fic.fic.warnings.rape = !props.fic.fic.warnings.rape)} defaultChecked={props.fic.fic.warnings.rape}/><label htmlFor="rape">Rape/Non-Con</label>
                            <input id="underage" type="checkbox" onChange={action((_e)=>props.fic.fic.warnings.underage = !props.fic.fic.warnings.underage)} defaultChecked={props.fic.fic.warnings.underage}/><label htmlFor="underage">Underage</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Fandoms:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__fandoms-textarea" onChange={action((e)=>{props.fic.fic.fandoms = this.parseTags(fandomsField.current!.value);})}ref={fandomsField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Categories:
                            </p>
                        </td>
                        <td className="metadata-edit__category-selector">
                            <input id="ff" type="checkbox" onChange={action((_e)=>props.fic.fic.categories.ff = !props.fic.fic.categories.ff)} defaultChecked={props.fic.fic.categories.ff}/><label htmlFor="ff">F/F</label>
                            <input id="fm" type="checkbox" onChange={action((_e)=>props.fic.fic.categories.fm = !props.fic.fic.categories.fm)} defaultChecked={props.fic.fic.categories.fm}/><label htmlFor="fm">F/M</label>
                            <input id="mm" type="checkbox" onChange={action((_e)=>props.fic.fic.categories.mm = !props.fic.fic.categories.mm)} defaultChecked={props.fic.fic.categories.mm}/><label htmlFor="mm">M/M</label>
                            <input id="multi" type="checkbox" onChange={action((_e)=>props.fic.fic.categories.multi = !props.fic.fic.categories.multi)} defaultChecked={props.fic.fic.categories.multi}/><label htmlFor="multi">Multi</label>
                            <input id="gen" type="checkbox" onChange={action((_e)=>props.fic.fic.categories.gen = !props.fic.fic.categories.gen)} defaultChecked={props.fic.fic.categories.gen}/><label htmlFor="gen">Gen</label>
                            <input id="other" type="checkbox" onChange={action((_e)=>props.fic.fic.categories.other = !props.fic.fic.categories.other)} defaultChecked={props.fic.fic.categories.other}/><label htmlFor="other">Other</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Ships:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__ships-textarea" onChange={action((e)=>{props.fic.fic.ships = this.parseTags(shipsField.current!.value);})} ref={shipsField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Characters:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__characters-textarea" onChange={action((e)=>{props.fic.fic.characters = this.parseTags(characterField.current!.value);})} ref={characterField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Tags:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__tag-textarea metadata-edit__tags-textarea" onChange={action((e)=>{props.fic.fic.tags = this.parseTags(tagsField.current!.value);})} ref={tagsField}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Title:
                            </p>
                        </td>
                        <td>
                            <input type="text" className="metadata-edit__title-input" onChange={action((e)=>{props.fic.fic.title = titleField.current!.value})}ref={titleField}></input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                Summary:
                            </p>
                        </td>
                        <td>
                            <textarea className="metadata-edit__summary-textarea" onChange={action((e)=>{props.fic.fic.summary = summaryField.current!.value})} ref={summaryField}></textarea>
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
                <input type="radio" name="rating" id={String(rating)} value={String(rating)} defaultChecked={props.fic.rating == rating} onChange={action(()=>{props.fic.rating = rating})}/>,
                <label htmlFor={String(rating)}>{String(rating)}</label>])
            .reduce((a1, a2)=>a1.concat(a2))}    
     </React.Fragment>);
}