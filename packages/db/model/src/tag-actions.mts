/// <reference lib="esnext" />

import { redis } from "@db/driver/index.mjs";
import { capitalize, difference, intersection } from "lodash-es";
import { tagDiff, isSystemBlog } from "./blog/tags-utils.mjs";
export { tagDiff, isSystemBlog };

/**
 * @return ```js
 * ${key}:{score:degree,value:relate}[]
 * ``` */
const zKeyRelateDegree = (key = '') => `${key}:{$\{relate\},$\{degree\}}[]`

/**
 * ```js
 * blog-count:{score:blog-count,value:key}[]
 * ```
 */
const zKeyBlogCount = `blog-count:{$\{blog-count\},$\{key\}}[]`

/**
 * ```js
 * ${key}:{blogId}[]
 * ```
 */
const sKeyBlog = (key = '') => `${key}:$\{blogId\}[]`

const isTruethy = (v): v is true => !!v;
const isFalsthy = (v): v is false => !v;

async function zRevRange(args: any[], withScore?: false | null | 0): Promise<string[]>
async function zRevRange(args: any[], withScore: true): Promise<{ score: string, value: string }[]>
async function zRevRange(args: any[], withScore?: boolean | null | 0): Promise<any[] | { score: string, value: string }[]>
async function zRevRange(args: any[], withScore: any = false) {
    if (withScore) {
        args.push('WITHSCORES')
    }
    const res = (await redis.sendCommand(args)) as string[]
    if (!Array.isArray(res)) throw new Error(`不支持的返回值(${JSON.stringify(res, null, 2)})类型!`)
    if (isFalsthy(withScore)) return res;
    // if (!res.length) return res;

    const res_: { score: string, value: string }[] = []
    for (let i = 0; i < res.length; i += 2) {
        const value = res[i];
        const score = res[i + 1]
        // @ts-ignore
        res_.push({ __proto__: null, score, value } as const)
    }
    return res_;
}

const updateTagDegree = async (fullKey = "", keyIdx = 0, maxIdx = 0, keys: string[], cache: number[], action: (old: number, add: number) => number) => {
    if (maxIdx === 0) throw new Error('关联标签列表为空, 不应该执行至此!')
    type Log = {
        // readonly __proto__: null;
        // readonly addScore: number;
        // readonly relateTag: string;
        [tag: string]: number
    }
    const logs = Object.create(null) as Log; // [] as Log[]
    const len = maxIdx + 1;
    const calcDg = async (value = '', valueIdx = 0) => {
        const oldScore = await redis.zScore(fullKey, value)
        // 越往右侧相互间的相关度越低
        const distance = Math.abs(valueIdx - keyIdx) * (valueIdx + 1) * (keyIdx + 1)
        // if (distance === 0) throw new Error('没必要计算标签与自身的相关度!');
        const ns = cache[distance] ||= 1 / ((distance * maxIdx) + 1)
        const score = action((oldScore || 0), ns); // ns + (oldScore || 0)
        // const log = { __proto__: null, addScore: ns, relateTag: value } as const;
        // logs.push(log);
        // logs[value] = ns;
        return { __proto__: null, score, value };
        return score ? { __proto__: null, score, value } as const : null;
    }
    const lKeys = keys.slice(0, keyIdx);
    const lSet = await Promise.all(lKeys.map((k, i) => (calcDg(k, i))))
    const rKeys = keys.slice(keyIdx + 1);
    const rSet = await Promise.all(rKeys.map((k, i) => (calcDg(k, keyIdx + 1 + i))))
    const set = lSet.concat(rSet).filter(e => !!e);
    // console.dir({ fullKey, set }, { depth: Infinity });
    // @ts-ignore
    set.length && await redis.zAdd(fullKey, set);
    // return { fullKey, relateTags: lKeys.concat(rKeys), logs };
}

const updateTagSBlogCount = async (tags: string[], mode: 'del' | 'add' = 'add') => {
    if (!tags || tags.length === 0) return;
    const action = mode === 'add' ? ((p = 0) => p + 1) : ((p = 0) => Math.max(p - 1, 0))
    const set = await Promise.all(tags.map(async (value) => {
        const score = action((await redis.zScore(zKeyBlogCount, value)) || 0);
        return { __proto__: null, score, value };
        return score ? { __proto__: null, score, value } : null
    }))
    // console.dir({ zKeyBlogCount, set }, { depth: Infinity });
    const _set = set.filter(e => !!e)
    // @ts-ignore
    _set.length && await redis.zAdd(zKeyBlogCount, _set);
}

const updateTagSDegree = async (tags: string[], mode: 'del' | 'add' = 'add') => {
    const maxIdx = tags.length - 1;
    if (maxIdx > 0) {
        const cache = [1]
        const action = mode === 'add' ? ((oldScore = 0, add = 0) => oldScore + add) : ((oldScore = 0, add = 0) => Math.max(oldScore - add, 0))
        const res = await Promise.all(tags.map(async (tag, i) => {
            const fullKey = zKeyRelateDegree(tag);
            return await updateTagDegree(fullKey, i, maxIdx, tags, cache, action);
        }))
    }
}

const updateBlogIds = async (tags: string[], blogId: string, mode: 'del' | 'add' = 'add') => {
    if (mode === 'add') {
        for (const tag of tags) {
            const fullKey = sKeyBlog(tag);
            // console.log({ fullKey, blogId });
            await redis.sAdd(fullKey, blogId);
        }
        return;
    }
    for (const tag of tags) {
        const fullKey = sKeyBlog(tag)
        await redis.sRem(fullKey, blogId);
    }
}

export const normalizeTags = async (tags: string[], lang: 'global' | 'en' | 'cn' = 'global') => {
    tags = [...new Set(tags.map(t => capitalize(t.trim())).filter(t => !!t))];
    const brands: string[] = []
    for (const tag of tags) {
        const brand = await redis.get(tag)
        brands.push(brand || tag)
    }
    // console.warn({ normalizeTags: brands });
    return brands;
}

export async function saveTags(tags: string[] | undefined = [], blogId: string) {
    if (!tags.length) return;
    blogId = String(blogId)
    const _tags = await normalizeTags(tags); // [...new Set(tags.map(t => t.trim()))];
    console.log({ tags, _tags }, 'savePost');
    await updateTagSBlogCount(_tags);
    const maxIdx = _tags.length - 1;
    if (maxIdx > 0) {
        await updateTagSDegree(_tags);
    }
    updateBlogIds(_tags, blogId)
}

// #region ++++++++++++++++++++++++++++ 更新 ++++++++++++++++++++++++++++ 
export async function updateTags(newTags: string[], oldTags: string[], blogId: string) {
    blogId = String(blogId)
    const _newTags = await normalizeTags(newTags);
    const _oldTags = await normalizeTags(oldTags);
    // console.dir({ _newTags, _oldTags }, { depth: Infinity });
    const dels = tagDiff(_oldTags, _newTags)
    const adds = tagDiff(_newTags, _oldTags)
    // const nochanges = intersection(_newTags, _oldTags)
    await updateTagSBlogCount(dels, 'del')
    await updateTagSBlogCount(adds);
    const oldMaxIdx = _oldTags.length - 1;
    // 对于相关度的计算考虑到了次序变动, 所以需要将原来的全部删除
    if (oldMaxIdx > 0) {
        await updateTagSDegree(_oldTags, 'del');
    }
    const maxIdx = _newTags.length - 1;
    if (maxIdx > 0) {
        await updateTagSDegree(_newTags);
    }
    updateBlogIds(adds, blogId);
    updateBlogIds(dels, blogId, 'del');
    return _newTags;
}

// #endregion


// #region ++++++++++++++++++++++++++++ 读取 ++++++++++++++++++++++++++++ 
export async function getBlogCountTopN(n, withScore?: false): Promise<string[]>;
export async function getBlogCountTopN(n, withScore: true): Promise<{ score: string, value: string }[]>;
export async function getBlogCountTopN(n, withScore?: boolean): Promise<string[] | { score: string, value: string }[]>;
export async function getBlogCountTopN(n = 10, withScore = false) {
    const args = ['ZREVRANGE', zKeyBlogCount, '0', `${n}`];
    const res = await zRevRange(args, !!withScore)
    // console.dir({ [`前${n}个最热门的标签: `]: res }, { depth: Infinity });
    return res;
}

export async function getDegreeTopNOfKey(key, n?, withScore?: false): Promise<string[]>;
export async function getDegreeTopNOfKey(key, n, withScore: true): Promise<{ score: string, value: string }[]>;
export async function getDegreeTopNOfKey(key, n?, withScore?: boolean): Promise<string[] | { score: string, value: string }[]>;
export async function getDegreeTopNOfKey(key, n = 3, withScore = false) {
    const args = ['ZREVRANGE', zKeyRelateDegree(key), '0', `${n - 1}`];
    const res = await zRevRange(args, !!withScore);
    // console.dir({ [`前${n}个最相关的标签: `]: res }, { depth: Infinity });
    return res;
}

export async function getMatchedTags({ tags = [], topN = 10 }: { tags?: string[], topN?: number }) {
    const ps = await getBlogCountTopN(topN);
    const _ds = await Promise.all(tags.map(async (t) => await getDegreeTopNOfKey(t)))
    const ds = _ds.flat(99)
    // console.dir({ ps, ds }, { depth: Infinity });
    const res = ps.concat(ds);
    // if (Object.hasOwn(Set.prototype, 'difference')) {
    //     // @ts-ignore
    //     return [...(new Set(res)).tagDiff(new Set(tags))];
    // }
    return tagDiff([...new Set(res)], tags);
}

export async function getBlogIdsOfTag(tag: string) {
    return await redis.sMembers(sKeyBlog(tag))
}
// #endregion

