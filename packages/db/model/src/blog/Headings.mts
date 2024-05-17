import { pick } from "lodash-es";
import { ObjectId } from "@db/driver/index.mjs";
import { IHeading, IHeadingDoc } from "../blog.mjs";

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
        /**@type {import('utils/mdx/compile.mjs').HeadingAncestors} [<empty slot>, h1.id|null, h2.id|null, ..., h5.id|null]  */
        type: Array,
        default: []
    },
    children: {
        /**
         * @type {import('utils/mdx/compile.mjs').HeadingChildren}
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
