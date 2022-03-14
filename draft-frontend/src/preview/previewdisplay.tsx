import React, { useRef } from "react";
import { useEffect } from "react";
import strftime from 'strftime';
import { CompilerResult, FicCompilerError } from "../compiler/compiler";
import { Fanfic } from "../fanfic/fanfiction";
import { Tab } from "../tabs/TabbedContext";
import { PreviewTabProps } from "./preview";

export const printT = strftime.timezone(0);

export class PreviewDisplayTab implements Tab<PreviewTabProps> {

    curChapter: string = "Placeholder";
    chapters: Map<string, string> = new Map<string, string>([[ "Placeholder", "Placeholder" ]]);
    
    render: (props: PreviewTabProps)=>JSX.Element = (props: PreviewTabProps)=>{
        let textRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null as HTMLDivElement|null);

        let fic: Fanfic = props.compiled instanceof FicCompilerError ? new Fanfic("Error") : props.fic.fic;
        if(props.compiled instanceof FicCompilerError) fic.summary = props.compiled.reason;

        useEffect(()=>{
            if(textRef.current !== undefined) {
                if(props.compiled instanceof FicCompilerError) {
                    textRef.current!.innerHTML = "-"       
                } else {
                    textRef.current!.innerHTML = props.compiled.files.get(props.compiled.files.keys().next().value)!;
                }
            }
        });

        return (
            <div className="gayo3">
                <div className="wrapper">
                    <dl className="work meta group" role="complementary">
                        <dt className="rating tags">
                            Rating:
                        </dt>
                        <dd className="rating tags">
                        <ul className="commas">
                            <Tag last={true} tagName={String(fic.rating)}/>
                        </ul>
                        </dd>
                        <dt className="warning tags">
                            <a href="https://archiveofourown.org/tos_faq#tags">Archive Warning</a>:
                        </dt>
                        <dd className="warning tags">
                        <ul className="commas">
                            <Tags tagNames={fic.warnings.toTags()}/>
                        </ul>
                        </dd>
                        <dt className="category tags">
                            Category:
                        </dt>
                        <dd className="category tags">
                        <ul className="commas">
                            <Tags tagNames={fic.categories.toTags()}/>
                        </ul>
                        </dd>
                        <dt className="fandom tags">
                            Fandoms:
                        </dt>
                        <dd className="fandom tags">
                        <ul className="commas">
                            <Tags tagNames={fic.fandoms}/>
                        </ul>
                        </dd>
                        <dt className="relationship tags">
                            Relationship:
                        </dt>
                        <dd className="relationship tags">
                        <ul className="commas">
                            <Tags tagNames={fic.ships}/>
                        </ul>
                        </dd>
                        <dt className="character tags">
                            Characters:
                        </dt>
                        <dd className="character tags">
                        <ul className="commas">
                            <Tags tagNames={fic.characters}/>
                        </ul>
                        </dd>
                        <dt className="freeform tags">
                            Additional Tags:
                        </dt>
                        <dd className="freeform tags">
                        <ul className="commas">
                            <Tags tagNames={fic.tags}/>
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
                            {fic.title}
                        </h2>
                        <h3 className="byline heading">
                            <a rel="author" href="">You</a>
                        </h3>
                        <div className="summary module" role="complementary">
                        <h3 className="heading">Summary:</h3>
                            <blockquote className="userstuff">
                                <p>
                                    {fic.summary}
                                </p>
                            </blockquote>
                        </div>
                    </div>
                    <div id="chapters" role="article">
                        <h3 className="landmark heading" id="work">Work Text:</h3>
                        <div className="userstuff" ref={textRef}></div>
                    </div>
                </div>
            </div>
        )
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
        tags.push(<Tag tagName={tn} last={i == props.tagNames.length - 1}/>);
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