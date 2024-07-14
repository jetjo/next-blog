"use client";

import { useTheme } from "@/hooks/useTheme";

export function ColorTags({ tags = [], theme = 'light', hwbDarks = [], hwbLights = [] }: { tags: string[], theme?: string, hwbDarks?: string[], hwbLights?: string[] }) {
    const theme_ = useTheme({ theme });
    return (<>{tags.map((tag, i) => (
        <a
            key={tag}
            style={{ color: (theme_?.theme === 'dark' ? hwbDarks : hwbLights)[i] }}
            href={`/blogs/${tag}`}
            className="relative z-10 rounded-full py-1.5 font-medium text-gray-600 hover:underline hover:underline-offset-3 "
        >
            {tag}
        </a>
    ))}</>)
}