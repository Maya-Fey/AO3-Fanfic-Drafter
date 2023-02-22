const AO3_ALLOWED_TAGS: Set<string> = new Set<string>(["a", "abbr", "acronym", "address", "b", "big", "blockquote", "br", "caption", "center", "cite", "code", "col", "colgroup", "dd", "del", "dfn", "div", "dl", "dt", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "ol", "p", "pre", "q", "s", "samp", "small", "span", "strike", "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "tt", "u", "ul", "var"]);
const BLOCK_LEVEL: Set<string> = new Set<string>(["div", "blockquote"]);
const PARA_LEVEL: Set<string> = new Set<string>(["p", "hr", "h1", "h2", "h3", "h4", "h5", "h6"]);
const INLINE_LEVEL: Set<string> = new Set<string>(["i", "b", "u", "em", "strong", "a", "span", "br", "img"]);
const SELF_CLOSING: Set<string> = new Set<string>(["img", "hr", "br"]);
const TABLE_LEVEL: Set<string> = new Set<string>(["table"]);
const TABLE_BODY_LEVEL: Set<string> = new Set<string>(["tbody"]);
const TABLE_ROW_LEVEL: Set<string> = new Set<string>(["tr"]);
const TABLE_COL_LEVEL: Set<string> = new Set<string>(["td"]);

enum EnumLevel {
    ROOT_LEVEL,
    BLOCK_LEVEL,
    PARA_LEVEL,
    INLINE_LEVEL,
    TABLE_LEVEL,
    TABLE_BODY_LEVEL,
    TABLE_ROW_LEVEL,
    TABLE_COL_LEVEL
}

export class Level {
    level: EnumLevel;
    tags: Set<string>;
    allowedChildren: Set<EnumLevel>;
    constructor(level: EnumLevel, tags: Set<string>, allowedChildren: Set<EnumLevel>) {
        this.level = level;
        this.tags = tags;
        this.allowedChildren = allowedChildren;
    }

    canBeParentOf(level: Level): boolean {
        return this.allowedChildren.has(level.level);
    }
}

export const LEVELS: Map<EnumLevel, Level> = new Map<EnumLevel, Level>();

{
    LEVELS.set(EnumLevel.ROOT_LEVEL, new Level(EnumLevel.ROOT_LEVEL, new Set<string>(), new Set<EnumLevel>([EnumLevel.BLOCK_LEVEL, EnumLevel.PARA_LEVEL, EnumLevel.TABLE_LEVEL])))
    LEVELS.set(EnumLevel.BLOCK_LEVEL, new Level(EnumLevel.BLOCK_LEVEL, BLOCK_LEVEL, new Set<EnumLevel>([EnumLevel.BLOCK_LEVEL, EnumLevel.PARA_LEVEL, EnumLevel.TABLE_LEVEL])));
    LEVELS.set(EnumLevel.PARA_LEVEL, new Level(EnumLevel.PARA_LEVEL, PARA_LEVEL, new Set<EnumLevel>([EnumLevel.INLINE_LEVEL])));
    LEVELS.set(EnumLevel.INLINE_LEVEL, new Level(EnumLevel.INLINE_LEVEL, INLINE_LEVEL, new Set<EnumLevel>([EnumLevel.INLINE_LEVEL])));
    LEVELS.set(EnumLevel.TABLE_LEVEL, new Level(EnumLevel.TABLE_LEVEL, TABLE_LEVEL, new Set<EnumLevel>([EnumLevel.TABLE_BODY_LEVEL])));
    LEVELS.set(EnumLevel.TABLE_BODY_LEVEL, new Level(EnumLevel.TABLE_BODY_LEVEL, TABLE_BODY_LEVEL, new Set<EnumLevel>([EnumLevel.TABLE_ROW_LEVEL])));
    LEVELS.set(EnumLevel.TABLE_ROW_LEVEL, new Level(EnumLevel.TABLE_ROW_LEVEL, TABLE_ROW_LEVEL, new Set<EnumLevel>([EnumLevel.TABLE_COL_LEVEL])));
    LEVELS.set(EnumLevel.TABLE_COL_LEVEL, new Level(EnumLevel.TABLE_COL_LEVEL, TABLE_COL_LEVEL, new Set<EnumLevel>([EnumLevel.BLOCK_LEVEL, EnumLevel.PARA_LEVEL])));
}

export const LEVEL_ROOT: Level = LEVELS.get(EnumLevel.ROOT_LEVEL)!;
export const LEVEL_PARAGRAPH: Level = LEVELS.get(EnumLevel.PARA_LEVEL)!;
export const LEVEL_INLINE: Level = LEVELS.get(EnumLevel.INLINE_LEVEL)!;

export function isAllowedTag(tag: string): boolean {
    return AO3_ALLOWED_TAGS.has(tag);
}

export function isSelfClosing(tag: string): boolean {
    return SELF_CLOSING.has(tag);
}

export function getLevelOf(tag: string): Level|undefined {
    let ret: Level|undefined = undefined;
    LEVELS.forEach(level=>{
        if(level.tags.has(tag)) { ret = level; }
    });
    return ret;
}

