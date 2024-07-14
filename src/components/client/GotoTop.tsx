"use client";

import clsx from "clsx";
import { RiArrowUpLine } from "react-icons/ri";
import { h2PosBoxStyle, h2Style } from "@/components/client/ThemeSelectorLink";

export default function gotoTop({ className, title, href }) {
    // console.log({ className });

    return (
        <a
            className={clsx(className, h2Style, ' right-5 bottom-20', h2PosBoxStyle, ` text-slate-700 dark:text-slate-200 `, `hover:text-jj-sky-750 dark:hover:text-sky-400  active:text-opacity-100`)}
            title={title}
            href=""
            onClick={(e: any) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'auto' })
            }}
        >
            <RiArrowUpLine />
        </a>
    );
}