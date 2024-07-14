const url = import.meta.url;

/**
 * @file src/app/[lang]/%40analytics/default.jsx
 * @summary - 假定此文件位于上述`@file`标记的路径中, 那么此组件是一个插槽
 * - 并且是一个特殊插槽
 * - 假设路由是`/setting`, 但是目录`src/app/[lang]/@analytics/setting`不存在, 
 * - 或者这个目录`src/app/[lang]/@analytics/setting`下没有匹配此路由的组件作为`analytics`插槽
 * - 则此组件则作为fallback.
 * - 或者路由是`/`但是目录`src/app/[lang]/@analytics`下没有`page.jsx`组件组件时, 也会以此组件作为fallback.
 */
export default function Page() {
    return <div><a href={url} className="">@analytics/default: {url}</a></div>
}
