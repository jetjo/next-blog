import type {IBLog, IModel} from "@db/blog-model/blog/index.mjs";
import dayjs from "dayjs";
import style from "./blog-item.module.css";
import clsx from "clsx";
import BlogDateTime from "./blog-datetime";

export default function BlogItem({post}: { post: IBLog & IModel }) {
    return (
        <a
            className={` ${style.blogListItem} flex flex-col md:flex-row gap-0 md:gap-2 md:items-center`}
            href={`/post/${post._id}`}
        >
            <div className={clsx('text-lg leading-6', ' flex gap-2 flex-wrap')}>
                <h2 blog-title="">{post.title}</h2>
                <span icon-go=""
                      className={clsx(' align-middle', ' opacity-50', ' flex-none', ' text-xs', ' -ml-[.375rem]')}></span>
            </div>
            <BlogDateTime post={post} isListItem={true}/>
        </a>
    );
}
