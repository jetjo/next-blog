const url = import.meta.url;

/**
 * @file src/app/%28community%29/%40analytics/blogs/page.jsx
 * @summary - 假定此文件位于上述`@file`标记的路径中, 那么此组件是一个命名插槽, 插槽名称为`analytics`
 * - 当路由是`/blogs`时, 才命中此组件
 * - 渲染位置只能是此位置(`src/app/%28community%29/layout.jsx`)的`Layout`组件
 * - `Layout`通过属性`props.analytics`接收此组件并渲染在其内部某处
 */
export default function Page() {
    return <div><a href={url} className="">@analytics/blogs: {url}</a></div>
}
