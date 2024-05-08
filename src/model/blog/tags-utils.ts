import { differenceBy, differenceWith } from "lodash-es";

export const reserveTags = ['系统', 'system'];

export const tagDiff = (tags: string[], othTags: string[]) => {
    return differenceWith(tags, othTags, (t, ot) => {
        const tl = t.toLowerCase().trim();
        const otl = ot.toLowerCase().trim();
        const isEqual = tl === otl || reserveTags.includes(tl);
        return isEqual;
    })
}

export const isSystemBlog = (tags: string[] = []) => tags.find(t => reserveTags.includes(t));