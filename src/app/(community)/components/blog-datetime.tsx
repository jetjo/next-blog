import type { IBLog, IModel } from "@db/blog-model/blog/index.js";
import { _parseFloat, _parseInt } from "utils/number.js";
import dayjs from "dayjs";

export default function BlogDateTime({ post, dateTemplate = "MM-DD ", isListItem = true }: { post: IBLog & IModel, dateTemplate?: string, isListItem: boolean }) {
    return (
        <div className={` flex gap-1 whitespace-nowrap items-center opacity-75 text-sm `}>
            <span publish-date="">{dayjs(post.date).format(dateTemplate)}</span>
            {post.readingTime && <span read-time="">· {Math.ceil(_parseFloat(post.readingTime))}min {isListItem ? 'read' : ''}</span>}
        </div>
    )
}

export function BlogDateTime$1({ post, dateTemplate = "YYYY-MM-DD ", isListItem = true }: { post: IBLog & IModel, dateTemplate?: string, isListItem?: boolean }) {
    return (
        <div className="flex items-center gap-x-2 text-xs opacity-90">
            <time publish-date="" dateTime={post.date} >
                {dayjs(post.date).format(dateTemplate)}
            </time>
            {post.readingTime && <>
                <span>·</span>
                <span read-time="">{Math.ceil(_parseFloat(post.readingTime))}min {isListItem ? 'read' : ''}</span>
            </>}
        </div>
    )
}
