import dayjs from "dayjs";
import Link from "next/link";
import style from "./blog-item.module.css";

export default function BlogItem({ post }: any) {
  return (
    <a
      className={` ${style.container} flex flex-col md:flex-row gap-0 md:gap-2`}
      href={`/post/${post.key}`}
    >
      <h2 className={` ${style.title}`}>{post.title}</h2>
      <div className={` ${style.date} flex gap-2 ws-nowrap items-center`}>
        <span>{dayjs(post.date).format("MM-DD ")}</span>
        <span>· 10min</span>
      </div>
    </a>
  );
}
