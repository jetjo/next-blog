import { pick } from "lodash-es";
import { ObjectId } from "@db/driver";
import { ICodeBlockDoc, ICodeBlock } from "../blog.mjs";

export const CodeBlock = {
    filename: String,
    uuid: {
        type: String,
        unique: true,
    },
    idx: {
        type: Number,
        unique: false,
    },
    lang: {
        type: String,
    },
    code: {
        type: String,
    },
    html: {
        type: String,
    },
    codeAsHtml: {
        type: Boolean,
    },
    tokens: {
        type: String,
    },
    rowLen: {
        // 当多个代码块在同一个盒子内切换显示时,
        // 由于不同代码块的行数不同,
        // 外加盒子没有固定高度, 可能导致盒子的高度来回变动,
        // 借助此字段为盒子设置一个容纳最大行数的高度;
        // 或者对于行数少的代码块补充空行
        type: Number,
        default: 0
    },
    blogId: {
        type: ObjectId,
        unique: false,
        ref: "Blog",
    },
    parse: {
        startPos: Number,
        matchLen: Number,
        readingTime: Number,
    }
} as const;

export const option = {
    timestamps: true,
};

const fields = Object.keys(CodeBlock)

export function toCodeBlock(doc: ICodeBlockDoc) {
    const _res: any = pick(doc, fields)
    _res._id = String(doc._id)
    _res.blogId = String(doc.blogId)
    return _res as ICodeBlock;
}
