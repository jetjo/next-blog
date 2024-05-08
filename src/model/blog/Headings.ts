import { pick } from "lodash-es";
import { ObjectId } from "@/db";
import { IHeading, IHeadingDoc } from ".";


export type HAncestor1 = string | null;
export type HAncestor2 = string | null;
export type HAncestor3 = string | null;
export type HAncestor4 = string | null;
export type HAncestor5 = string | null;

export type HChildren2 = string[] | null;
export type HChildren3 = string[] | null;
export type HChildren4 = string[] | null;
export type HChildren5 = string[] | null;
export type HChildren6 = string[] | null;

export type H = { id: string, depth: number, idx: number }

export type Heading1Children = [H[], string, HChildren2, HChildren3, HChildren4, HChildren5, HChildren6]
export type Heading2Children = [H[], undefined, string, HChildren3, HChildren4, HChildren5, HChildren6]
export type Heading3Children = [H[], undefined, undefined, string, HChildren4, HChildren5, HChildren6]
export type Heading4Children = [H[], undefined, undefined, undefined, string, HChildren5, HChildren6]
export type Heading5Children = [H[], undefined, undefined, undefined, undefined, string, HChildren6]
export type Heading6Children = [H[], undefined, undefined, undefined, undefined, undefined, string]

export type Heading1Ancestors = [undefined, string]
export type Heading2Ancestors = [undefined, HAncestor1, string]
export type Heading3Ancestors = [undefined, HAncestor1, HAncestor2, string]
export type Heading4Ancestors = [undefined, HAncestor1, HAncestor2, HAncestor3, string]
export type Heading5Ancestors = [undefined, HAncestor1, HAncestor2, HAncestor3, HAncestor4, string]
export type Heading6Ancestors = [undefined, HAncestor1, HAncestor2, HAncestor3, HAncestor4, HAncestor5, string]

export type HeadingChildren = Heading1Children | Heading2Children | Heading3Children | Heading4Children | Heading5Children | Heading6Children

export type HeadingAncestors = Heading1Ancestors | Heading2Ancestors | Heading3Ancestors | Heading4Ancestors | Heading5Ancestors | Heading6Ancestors

export const Heading = {
    depth: {
        type: Number,
    },
    value: {
        type: String,
    },
    id: {
        type: String,
    },
    ancestors: {
        /**@type {HeadingAncestors} [<empty slot>, h1.id|null, h2.id|null, ..., h5.id|null]  */
        type: Array,
        default: []
    },
    children: {
        /**
         * @type {HeadingChildren}
         * @h1类型 [<empty>, <empty>, [h2.id, h2.id, ...]|null, [h3.id, h3.id, ...]|null, ..., [h6.id, h6.id, ...]|null] 
         * @h2类型 [<empty>, <empty>, <empty>, [h3.id, h3.id, ...]|null, ..., [h6.id, h6.id, ...]|null] 
         * @h3类型 [<empty>, <empty>, <empty>, <empty>, [h4.id, h4.id, ...]|null, ..., [h6.id, h6.id, ...]|null] 
         * @h4类型 [<empty>, <empty>, <empty>, <empty>, <empty>, [h5.id, h5.id, ...]|null, [h6.id, h6.id, ...]|null] 
         * @h5类型 [<empty>, <empty>, <empty>, <empty>, <empty>, <empty>, [h6.id, h6.id, ...]|null] 
         * */
        type: Array,
        default: []
    },
    blogId: {
        type: ObjectId,
        unique: false,
        ref: "Blog",
    },
} as const;

const fields = Object.keys(Heading)

export function toHeading(doc: IHeadingDoc) {
    const _res: any = pick(doc, fields)
    _res._id = String(doc._id)
    _res.blogId = String(doc.blogId)
    _res.ancestors = [...doc.ancestors]
    _res.children = [...doc.children]
    _res.children = _res.children.map(c => {
        if (Array.isArray(c)) {
            return [...c]
        }
        return c;
    })
    return _res as (IHeading & { idx?: number });
}

export const option = {
    timestamps: true,
};

export const headingKeys = fields;
