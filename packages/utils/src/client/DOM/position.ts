/// <reference lib="DOM" />

import { _parseInt } from "../../number";
import { sum } from "lodash-es";

function getPositionOnPage(elementId: string) {
    const ele = document.getElementById(elementId) as HTMLElement
    if (!ele) {
        console.error(`没有找到ID为${elementId}的节点!`)
        return;
    }
    // return { pageX: ele.top }
}

export function addUpOffsetTop(elementId: string) {
    const ele = document.getElementById(elementId);
    let accumulativeOffset = ele?.offsetTop || 0;
    let offsetParent = ele;
    let i = 0;
    console.log({
        elementId, accumulativeOffset, offsetParent
    }, 'addUpOffsetTop循环前.');
    // @ts-ignore
    while (offsetParent = offsetParent?.offsetParent) {
        const ot = offsetParent.offsetTop || 0
        accumulativeOffset += ot;

        // if (ot && offsetParent.offsetParent) {
        const { marginTop, borderTopWidth, paddingTop } = window.getComputedStyle(offsetParent)
        const offsetOffsets = [marginTop, borderTopWidth, paddingTop].map(o => _parseInt(o) || 0)
        const offsetAccOffset = sum(offsetOffsets)
        accumulativeOffset += offsetAccOffset;
        // }
        console.log({
            elementId,
            accumulativeOffset,
            offsetParent,
            offsetParentStyle: { marginTop, borderTopWidth, paddingTop },
            offsetOffsets,
            offsetAccOffset
        }, `addUpOffsetTop Loop ${++i}.`);
    }
    return accumulativeOffset;
}