import { pick } from "lodash-es";
import { ObjectId } from "@db/driver/index.mjs";
import { ISearchIndexDoc, ISearchIndex } from "../blog.mjs";

export const SearchIndex = {
    
    blogId: {
        type: ObjectId,
        unique: false,
        ref: "Blog",
    },
} as const;

export const option = {
    timestamps: true,
};

const fields = Object.keys(SearchIndex)

export function toSearchIndex(doc: ISearchIndexDoc) {
    const _res: any = pick(doc, fields)
    _res._id = String(doc._id)
    _res.blogId = String(doc.blogId)
    return _res as ISearchIndex;
}
