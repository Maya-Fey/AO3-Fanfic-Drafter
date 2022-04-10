import React, { ChangeEvent, useRef } from "react";
import { useEffect } from "react";
import strftime from 'strftime';
import { CompilerResult, FicCompilerError } from "../compiler/compiler";
import { Fanfic } from "../fanfic/fanfiction";
import { Tab } from "../tabs/TabbedContext";
import { ChapterSelectorProps } from "./outputdisplay";
import { PreviewTabProps } from "./preview";

export const printT = strftime.timezone(0);

export class PreviewDisplayTab implements Tab<PreviewTabProps> {

    textRef: React.RefObject<HTMLDivElement>|undefined = undefined;
    curChapter: string = "Placeholder";
    chapters: Map<string, string> = new Map<string, string>([[ "Placeholder", "Placeholder" ]]);
    
    render: (props: PreviewTabProps)=>JSX.Element = (props: PreviewTabProps)=>{
        let summaryRef: React.RefObject<HTMLParagraphElement> = useRef<HTMLParagraphElement>(null as HTMLParagraphElement|null);

        this.textRef = useRef<HTMLDivElement>(null as HTMLDivElement|null);

        let fic: Fanfic = props.compiled instanceof FicCompilerError ? new Fanfic("Error", ()=>{}) : props.fic.fic as Fanfic;
        if(props.compiled instanceof FicCompilerError) fic.meta.summary = props.compiled.reason;

        this.chapters = this.chaptersToMap(props.compiled);

        let observedSummary: string = fic.meta.summary.replaceAll("\n", "<br>");

        useEffect(()=>{
            summaryRef.current!.innerHTML = observedSummary;

            if(this.textRef!.current !== undefined) {
                if(props.compiled instanceof FicCompilerError) {
                    this.textRef!.current!.innerHTML = "-"       
                } else {
                    this.textRef!.current!.innerHTML = props.compiled.files.get(this.curChapter)!;
                }
            }
        });

        let ChapterSelector = this.chapterSelector.bind(this);

        return (
            <div className="preview-display">
                <div className="preview-display__selector-container">
                    <ChapterSelector map={this.chapters}/>
                </div>
                <div className="gayo3">
                    <div className="wrapper">
                        <dl className="work meta group" role="complementary">
                            <dt className="rating tags">
                                Rating:
                            </dt>
                            <dd className="rating tags">
                            <ul className="commas">
                                <Tag last={true} tagName={String(fic.meta.rating)}/>
                            </ul>
                            </dd>
                            <dt className="warning tags">
                                <a href="https://archiveofourown.org/tos_faq#tags">Archive Warning</a>:
                            </dt>
                            <dd className="warning tags">
                            <ul className="commas">
                                <Tags tagNames={fic.meta.warnings.toTags()}/>
                            </ul>
                            </dd>
                            <dt className="category tags">
                                Category:
                            </dt>
                            <dd className="category tags">
                            <ul className="commas">
                                <Tags tagNames={fic.meta.categories.toTags()}/>
                            </ul>
                            </dd>
                            <dt className="fandom tags">
                                Fandoms:
                            </dt>
                            <dd className="fandom tags">
                            <ul className="commas">
                                <Tags tagNames={fic.meta.fandoms}/>
                            </ul>
                            </dd>
                            <dt className="relationship tags">
                                Relationship:
                            </dt>
                            <dd className="relationship tags">
                            <ul className="commas">
                                <Tags tagNames={fic.meta.ships}/>
                            </ul>
                            </dd>
                            <dt className="character tags">
                                Characters:
                            </dt>
                            <dd className="character tags">
                            <ul className="commas">
                                <Tags tagNames={fic.meta.characters}/>
                            </ul>
                            </dd>
                            <dt className="freeform tags">
                                Additional Tags:
                            </dt>
                            <dd className="freeform tags">
                            <ul className="commas">
                                <Tags tagNames={fic.meta.tags}/>
                            </ul>
                            </dd>
                            <dt className="language">
                                Language:
                            </dt>
                            <dd className="language">
                                English
                            </dd>
                            <dt className="stats">Stats:</dt>
                            <dd className="stats">
                                <dl className="stats"><dt className="published">Published:</dt><dd className="published">{printT("%Y-%m-%d", new Date())}</dd><dt className="words">Words:</dt><dd className="words">unimplemented</dd><dt className="chapters">Chapters:</dt><dd className="chapters">{props.compiled instanceof FicCompilerError ? "0" : props.compiled.files.size - 1}/?</dd><dt className="comments">Comments:</dt><dd className="comments">420</dd><dt className="kudos">Kudos:</dt><dd className="kudos">69</dd><dt className="bookmarks">Bookmarks:</dt><dd className="bookmarks"><a>100</a></dd><dt className="hits">Hits:</dt><dd className="hits">66,000</dd></dl>
                            </dd>
                        </dl>
                    </div>
                    <div id="workskin">
                        <div className="preface group">
                            <h2 className="title heading">
                                {fic.meta.title}
                            </h2>
                            <h3 className="byline heading">
                                <a rel="author" href="">You</a>
                            </h3>
                            <div className="summary module" role="complementary">
                            <h3 className="heading">Summary:</h3>
                                <blockquote className="userstuff">
                                    <p ref={summaryRef}>
                                    </p>
                                </blockquote>
                            </div>
                        </div>
                        <div id="chapters" role="article">
                            <h3 className="landmark heading" id="work">Work Text:</h3>
                            <div className="userstuff" ref={this.textRef}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    //TODO: abstract with inheritance
    
    chapterSelector: (props: ChapterSelectorProps)=>JSX.Element = (props: ChapterSelectorProps)=>{
        let items: JSX.Element[] = [];
        props.map.forEach((_v, k)=>{ items.push(<this.ChapterSelectorItem key={k} value={k}/>) })
        return (
            <select className="preview-display__selector" defaultValue={this.curChapter} onChange={(event: ChangeEvent<HTMLSelectElement>)=>{ this.switchToChapter(event.target.value); }}>
                {items}
            </select>
        )
    }

    ChapterSelectorItem(props: React.HTMLProps<HTMLOptionElement>): JSX.Element {
        if(props.selected) console.log(props.value);
        return (
            <option key={props.value as string} {...props}>{props.value}</option>
        )
    }

    switchToChapter(chapter: string) {
        this.curChapter = chapter;
        if(this.textRef !== undefined && this.textRef.current !== undefined)
            this.textRef.current!.innerHTML = this.chapters.get(this.curChapter)!;
    }

    chaptersToMap(chapters: CompilerResult|FicCompilerError): Map<string, string> {
        if(chapters instanceof FicCompilerError) {
            this.curChapter = "Error";
            return new Map<string, string>([[ "Error", chapters.reason ]]);
        } else if(chapters.files === undefined) {
            this.curChapter = "Error";
            return new Map<string, string>([[ "Error", "Hot update has created an inconsistent state" ]]);
        } else {
            let cMap: Map<string, string> = chapters.files;
            if(!cMap.has(this.curChapter)) this.curChapter = cMap.keys().next().value;
            return cMap;
        } 
    }

    onClose(): void {}

    hotUpdate(n: PreviewDisplayTab): void {
        this.curChapter = n.curChapter;
        this.chapters = n.chapters;
    }
    
}

interface TagsProps extends React.HTMLProps<HTMLAnchorElement> {
    tagNames: string[];
}

function Tags(props: TagsProps) {
    let tags: JSX.Element[]  = [];
    props.tagNames.forEach((tn, i)=>{
        tags.push(<Tag key={tn} tagName={tn} last={i == props.tagNames.length - 1}/>);
    })
    return <React.Fragment>{tags}</React.Fragment>;
}

interface TagProps extends React.HTMLProps<HTMLAnchorElement> {
    tagName: string;
    last: boolean;
}

function Tag(props: TagProps) {
    return (
        <li className={props.last ? "last" : ""}>
            <a {...props} href={encodeURI("https://archiveofourown.org/tags/" + props.tagName + "/works")} className="tag">{props.tagName}</a>
        </li>
    );
}