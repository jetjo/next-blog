"use client";

import type { H } from "utils/mdx/compile.mjs";
import { nextFrame } from "@/client/utils";
import { IHeading } from "@db/blog-model/blog/index.mjs";
import { _parseInt } from "utils/number.mjs";
import { throttle } from "lodash-es";
import { memo, useEffect, useState } from "react";

export type Heading = {
    index: number,
    id: string,
    depth: number,
    offset: number,
    offsetReverse: number,
    paddingTop: number,
    paddingBottom: number,
    children?: [H[]]
}

const consumer: (((h2Id: string) => any) | undefined)[] = []
const h2Datas: Heading[] = []

/** @assume `box-sizing`值为`border-box`; 获取占据空间的垂直高度 */
const getRectHeight = (selector = '') => {
    const ele = document.querySelector(selector);
    if (!ele) {
        throw new Error(`选择器${selector}没有选中任何节点!`)
    }
    const rect = ele.getBoundingClientRect();
    const style = window.getComputedStyle(ele)
    if (style.boxSizing !== 'border-box') {
        console.warn(`节点${selector}的box-sizing值不是border-box`);
    }
    const marginTop = parseFloat(style.marginTop)
    const marginBottom = parseFloat(style.marginBottom)
    return { height: rect.height, rect, ele, style, areaHeight: rect.height + marginBottom + marginTop }
}

/** 根元素滚动区域的paddingTop */
const getRootOffset = () => {
    const rootEle = document.documentElement;
    const rootStyle = window.getComputedStyle(rootEle)
    const rootScrollPaddingTop = parseFloat(rootStyle.scrollPaddingTop);
    return rootScrollPaddingTop;
}
/** 顶层导航栏占据空间的垂直高度 */
const getTopNavBarOffset = () => {
    const selector = 'main [main-header]'
    const rect = getRectHeight(selector)
    return rect.height
}
/** 文章标题占据空间的垂直高度 */
const getArticleHeaderOffset = () => {
    const selector = 'header[article-header]'
    const rect = getRectHeight(selector)
    return rect.height
}

/**
 * @assume h2的`offsetParent`是`body`, 否则需要更新算法
 */
const getH2ScrollOffset = (h2) => {
    const h2Ele = document.getElementById(h2?.id)
    if (!h2Ele) {
        throw new Error(`没有id为${h2?.id}的h2节点!`)
    }
    const h2Style = window.getComputedStyle(h2Ele)
    const h2MarginTop = parseFloat(h2Style.marginTop)
    const paddingTop = parseFloat(h2Style.paddingTop)
    const paddingBottom = parseFloat(h2Style.paddingBottom)
    /* `ele.offsetTop`包含`ele.style.marginTop`和`ele.offsetParent.style.paddingTop` */
    const offsetTop = h2Ele.offsetTop;
    // console.log({ articleHeaderOffset, offsetTop, rootOffset });
    if (h2Ele.offsetParent !== document.body) {
        console.warn('h2的`offsetParent`不是`body`, 需要更新算法!');
    }
    const offset = _parseInt(offsetTop - h2MarginTop - codeBlockPadding - rootOffset - 1);
    const offsetReverse = _parseInt(offsetTop + paddingTop - rootOffset + 1);
    return { offset, offsetReverse, paddingTop, paddingBottom }
}

let initFlag = false;
const codeBlockPadding = 50;
/**就是顶部导航栏占据的高度, 应该与`topNavBarOffset`大致相等. */
let rootOffset;
let topNavBarOffset;
let articleHeaderOffset;
let hashFlag;
let preScrollTop = 0;

const populateH2Datas = (h2Data: any) => {
    // 切断引用
    h2Datas.push(JSON.parse(JSON.stringify(h2Data)));

    rootOffset ??= getRootOffset();
    topNavBarOffset ??= getTopNavBarOffset();
    articleHeaderOffset ??= getArticleHeaderOffset();
    const h2 = h2Datas.at(-1)!;
    const offset = getH2ScrollOffset(h2);
    Object.assign(h2, offset)

    populateChildren(h2);

    h2Datas.forEach((h, i) => h.index = i)
    // console.log({ h2Datas });

}

let pathName;

function setup(h2Data: any) {
    populateH2Datas(h2Data)
    if (initFlag) {
        return () => void 0
    }
    initFlag = true;
    pathName = window.location.pathname;
    // console.log(window.location);

    const onHashChange = () => {
        hashFlag = true;
        const hash = window.location.hash;
        // alert(hash)
        // console.log('hashchange', hash);

        publish(hash)
    }

    window.addEventListener('hashchange', onHashChange)
    
    const onResize = throttle(() => {
        calOffset()
    }, 1000, { leading: true, trailing: true })
    window.addEventListener('resize', onResize)

    const clean = () => {
        // console.log('clean toc')
        window.removeEventListener('hashchange', onHashChange)
        window.removeEventListener('resize', onResize)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('scrollend', onScrollEnd)
        consumer.length = 0;
        h2Datas.length = 0;
        initFlag = false;
        hashFlag = false;
        preScrollTop = 0;
    }

    const _onScroll = ({ isOnScrollEnd }: Record<string, any>) => {
        if (window.location.pathname !== pathName) {
            clean()
            return;
        }
        if (hashFlag) {
            return;
        }
        // console.clear()
        const scrollTop = document.documentElement.scrollTop;
        if (Math.abs(scrollTop - preScrollTop) < .5) {
            preScrollTop = scrollTop;
            return;
        }
        let id, h2;
        if (scrollTop > preScrollTop) {
            // console.log('向下滚动~');
            let i = -1;
            for (const h2Data of h2Datas) {
                if (h2Data.offset > scrollTop) {
                    break;
                }
                id = h2Data.id;
                i = h2Data.index;
                h2 = h2Data;
            }
            i++;
            if (i < h2Datas.length) {
                if (!h2 || !isInView(h2)) {
                    const _h2 = h2Datas[i];
                    if (isInTopHalfArea(_h2)) {
                        id = _h2.id;
                        h2 = _h2
                    }
                }
            }
        } else {
            // console.log('向上滚动~');
            h2 = h2Datas.at(-1);
            id = h2?.id;
            let i = 0
            const Len = -1 * h2Datas.length
            while (--i >= Len) {
                const h2Data = h2Datas.at(i)!
                if (isInAboveHiddenArea(h2Data, scrollTop)) {
                    break;
                }
                id = h2Data.id;
                h2 = h2Data;
            }
            // 至此有两种情况: 1、数组循环完(i等于Len-1); 2、遇到了符合提前终止循环条件的h2, 提前break, i >= Len
            if (i >= Len) {
                if (isInBottomHalfAreaOrNotInView(h2)) {
                    h2 = h2Datas.at(i);
                    id = h2.id;
                }
            }
            else if (!isInTopHalfArea(h2)) {
                id = undefined;
                h2 = undefined;
            }
        }
        // console.log({ id, scrollTop });
        // if (id) {
        publish(`#${id}`)
        // }
        preScrollTop = scrollTop;
        // console.log({ preScrollTop }, 'scroll');

    }
    const onScroll = throttle(_onScroll, 1000, { leading: true, trailing: true })
    window.addEventListener('scroll', onScroll)
    const onScrollEnd = () => {
        const scrollTop = document.documentElement.scrollTop;
        // if (scrollTop < 2 || window.location.hash === '#top') {
        // console.log('回到顶部~');
        _onScroll({ isOnScrollEnd: true });
        // }
        preScrollTop = scrollTop;
        // console.log({ preScrollTop }, 'scroll end');
        hashFlag = false;
    }
    window.addEventListener('scrollend', onScrollEnd);

    nextFrame(() => {
        // if (window.location.hash) {
        //     publish(window.location.hash)
        // }
        // else {
        _onScroll({});
        // }
    })
    return clean;
}

function publish(hash: string) {
    const h2Id = hash.slice(1)
    consumer.forEach(f => f && f(h2Id))
}

function subscription(cb: (h2Id: string) => any, idx: number) {
    consumer[idx] = cb;
    return () => {
        // console.log('clean toc subscription')
        consumer[idx] = undefined
    };
}

function calOffset() {
    rootOffset = getRootOffset();
    topNavBarOffset = getTopNavBarOffset();
    articleHeaderOffset = getArticleHeaderOffset();

    h2Datas.forEach((h2, i) => {
        const offset = getH2ScrollOffset(h2);
        Object.assign(h2, offset)
    })
    // console.log(JSON.parse(JSON.stringify(h2Datas)));
}

const isChildOf = ({ depth, children }: IHeading, hId: string) => {
    let i = depth!;
    const Len = children.length
    while (++i < children.length) {
        const hIIds = children[i] as string[]
        if (!hIIds || !hIIds.length) continue;
        if (hIIds.includes(hId)) return true;
    }
    return false;
}

const TocListItem = memo(function TocListItem({ h2 }: any) {
    // console.log(h2);
    const [h2Data, setH2Data] = useState(JSON.parse(JSON.stringify(h2)))

    useEffect(() => {
        const clean = setup(JSON.parse(JSON.stringify(h2)));
        return () => clean && clean()
    }, [])

    useEffect(() => {
        const clean = subscription((h2Id: string) => {
            // console.log(h2Id, h2Data.id);
            h2Id = decodeURIComponent(h2Id)
            if (!h2Data.active && h2Id !== h2Data.id && !isChildOf(h2Data, h2Id)) return;
            setH2Data({ ...h2Data, active: h2Id === h2Data.id || isChildOf(h2Data, h2Id) })
        }, h2Data.idx)
        return () => clean()
    }, [h2Data])

    return (<li><a className={' block py-2 px-4 pr-0 max-w-full overflow-clip text-ellipsis'} href={`#${h2Data.id}`} aria-current={h2Data.active}>{h2Data.value}</a></li>)
})

export default TocListItem;

function isInAboveHiddenArea(h2Data: any, scrollTop: number) {
    return scrollTop > h2Data.offsetReverse;
    console.log(h2Data);
    return false;
    throw new Error("Function not implemented.");
}

const getRect = (id = '') => {
    const h2Ele = document.getElementById(id)
    if (!h2Ele) {
        throw new Error(`没有id为${id}的h2节点!`)
    }
    const rect = h2Ele.getBoundingClientRect()
    return { h2Ele, rect }
}
function isInBottomHalfAreaOrNotInView({ id, paddingTop, paddingBottom }: { id: string, paddingTop: number, paddingBottom: number }) {
    const _rect = getRect(id);
    const { rect } = _rect;
    if (!isInView({ id, paddingBottom, paddingTop, _rect })) return true;
    return rect.top - rootOffset > (window.innerHeight - rootOffset) / 2 - paddingTop;
    throw new Error("Function not implemented.");
}
function isInTopHalfArea({ id, paddingTop, paddingBottom }: { id: string, paddingTop: number, paddingBottom: number }) {
    const _rect = getRect(id);
    const { rect } = _rect;
    if (!isInView({ id, paddingBottom, paddingTop, _rect })) return false;

    const flag = rect.bottom - rootOffset < (window.innerHeight - rootOffset) / 2 + paddingBottom;
    // console.log({ isInTopHalfArea: flag, id, bottom: rect.bottom, rootOffset, topNavBarOffset, viewHeight: window.innerHeight });
    return flag;
    throw new Error("Function not implemented.");
}

function isInView({ id, paddingBottom, paddingTop, _rect }: { id: string, paddingTop: number, paddingBottom: number, _rect?: ReturnType<typeof getRect> }) {
    const { rect } = _rect || getRect(id);
    const aboveFlag = rect.top >= rootOffset - paddingTop
    const belowFlag = rect.bottom <= window.innerHeight + paddingBottom
    return aboveFlag && belowFlag
    throw new Error("Function not implemented.");
}

function populateChildren(h2: Heading) {
    // return;
    // console.log({ h2 });
    const children = h2.children?.[0]
    if (!children) return;
    for (const child of children) {
        const c = child as unknown as WriteAble<IHeading>
        c.children = []
        populateH2Datas(child)
    }
    return;
    throw new Error("Function not implemented.");
}

