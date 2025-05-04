import type { Root } from "mdast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";
import _path from 'path';

export const unsupportedLangs = ['math', 'chartjs', '', 'unknown', 'txt']

const getLang = (className = '') => {
    const match = className.match(/\blanguage\-(\S+)/)
    return match ? match[1] : ''
}

export const delQuoteAtStartAndEnd = (str = '') => {
    if (!str) return str;
    try {
        const match = /^[\"\`\']?(.+?)[\"\`\']?$/.exec(str);
        if (!match) return str;
        const ret = match[1].trim();
        return ret;
    } catch (error) {
        console.error('解析异常!!!!!!', str);
    }
    return str;
}
const delQuoteAtStartAndEndGy = (str = '') =>
    (/^[\"\`\']*(.+?)[\"\`\']*$/.exec(str) || ['', str])[1].trim();

/**
 * 输入:
 * ```js
 * const content = `filename="app/api/search/route.ts" switcher`
 * ```
 * 输出:
 * ```js
 * {filename: "app/api/search/route.ts", switcher: true}
 * ```
 */
export function parseTokenStr(content = "", filename = "") {
    content = content.trim();
    const reg = /(\w+)="([^"]+)"/g;
    const res: Record<string, any> = {};
    let match: ReturnType<RegExp["exec"]>;
    const setMatch = (match: NonNullable<ReturnType<RegExp["exec"]>>) => {
        const key = match[1];
        const value = match[2];
        res[key] = delQuoteAtStartAndEnd(value);
    }
    while ((match = reg.exec(content))) {
        setMatch(match)
    }
    const tokens = content.split(" ");
    const regNoQu = /(\w+)=(\S+)/;
    tokens.forEach((token) => {
        token = token.trim()
        if (!token) return;
        if (!reg.test(token) && !regNoQu.test(token)) {
            res[token] = true;
        } else if ((match = regNoQu.exec(token))) {
            setMatch(match)
        }
    });
    res.filename ||= filename;
    return res;
}

export function rehypeCodeLangSwitcher({ codeBlocks = [] as any[] }) {
    return function (tree: Root, file: VFile) {
        let stack: any[] = [];
        let codesLen = 0;
        let pre: any;
        visit(tree, function (node: any, idx, parent) {
            if (idx === undefined) return;
            const inPre = stack.find(n => n.tagName === 'pre');
            if (node.tagName === 'pre' && inPre) {
                throw new Error('pre元素不允许嵌套!')
            }
            if (!inPre && pre && node.tagName !== 'pre') {
                // if (node.type === "text" && node.value === "\n" && parent?.children[idx - 1]?.tagName === 'pre' && parent.children[idx + 1]?.tagName !== 'pre' && pre) {
                const nextSibling = parent.children[idx + 1]
                if (nextSibling?.tagName !== 'pre') {
                    pre = null;
                } else if (node.type !== "text" || node.value !== '\n') {
                    pre = null;
                } else if (!(nextSibling?.children?.length)) {
                    pre = null;
                }
            }
            if (node.tagName === 'code' && parent.tagName === 'pre') {
                const className = node.properties.className || [];
                const lang = getLang(className.join(' '));
                if (className.length && !lang) throw new Error('解析编程语言失败!')
                const token = parseTokenStr(node.data?.meta || '');
                const block = token ? codeBlocks.find(code => code.uuid === token.uuid) : null;
                if (block && lang && !unsupportedLangs.includes(lang) && !isNaN(token?.idx)) {
                    if (Number(token.idx) !== codesLen++ || lang !== token.lang) throw new Error('解析异常!')
                    if (token.switcher) {
                        node.properties.hiddenForSwitcher = true;
                        // @ts-ignore
                        const filenameNoExt = token.filename.replace(_path.extname(token.filename), '');
                        if (!pre || pre.properties.langs.includes(lang) || !pre.properties.filenames.includes(filenameNoExt)) {
                            pre = parent;
                            pre.properties.switcher = true;
                            pre.properties.uuids = token.uuid;
                            pre.properties.filenames = token.filename;
                            pre.properties.langs = token.lang
                            pre.properties.idxs = token.idx
                            pre.properties.codeClassNames = className.join(' ');
                            pre.properties.codeLenMax = block.rowLen; // Number(token.rowLen);
                        }
                        else {
                            pre.properties.langs += `,${token.lang}`
                            pre.properties.uuids += `,${token.uuid}`
                            pre.properties.filenames += `,${token.filename}`
                            pre.properties.idxs += `,${token.idx}`
                            pre.properties.codeClassNames += `;${className.join(' ')}`;
                            pre.properties.codeLenMax = Math.max(block.rowLen, Number(pre.properties.codeLenMax))
                        }
                        if (parent !== pre) {
                            parent.properties.hiddenForSwitcher = true;
                        }
                    } else if (pre) {
                        pre = null
                    }
                    if (!token.switcher) {
                        // parent.properties.switcher = false; //NOTE: 赋值为false, 相当于没有此属性,会被移除!!!
                        parent.properties.switcher = '';
                        parent.properties.hiddenForSwitcher = '';
                        parent.properties.idxs = token.idx;
                        parent.properties.uuids = token.uuid;
                        parent.properties.filenames = token.filename;
                        parent.properties.langs = token.lang
                        parent.properties.codeClassNames = className.join(' ');
                        parent.properties.codeLenMax = block.rowLen; // Number(token.rowLen);
                        // console.dir(parent, { depth: null })
                    }
                } else if (!unsupportedLangs.includes(lang)) {
                    console.warn(lang, "不支持的代码块语言?");
                    parent.properties.switcher = '';
                    parent.properties.hiddenForSwitcher = '';
                    if (token) {
                        parent.properties.idxs = token.idx;
                        parent.properties.uuids = token.uuid;
                        parent.properties.filenames = token.filename;
                    }
                    parent.properties.langs = token?.lang || lang
                    parent.properties.codeClassNames = className.join(' ');
                    parent.properties.codeLenMax = block?.rowLen; // Number(token.rowLen);
                }
                // codesLen++;
            }
            if (node.type === 'text' && stack.at(-1)?.tagName === 'code' && stack.at(-2)?.tagName === 'pre') {
                // if (stack.at(-1) !== parent) {
                //   throw new Error('未知异常!')
                // }
                // const lang = getLang(parent.properties.className?.join(' '));
                // if (!lang) throw new Error('解析编程语言失败!')
                // NOTE: 这一句导致插件`rehype-mdx-code-props`崩溃😡
                // pre.properties[`_codeBlock_${codesLen++}_${lang}`] = node.value;
                // const pre = stack.at(-2);
                // if (pre) {
                //   pre.properties.dynamicBlock = JSON.stringify({ code: node.value, html: await highLightLoad(node.value) })
                // }
            }
            // if (parent && parent.tagName === 'code' && parent.properties.hiddenForSwitcher) {
            //   node.value = '';
            // }
            // console.dir(node, { depth: null });
            // 如果有children, 入栈
            if (node.children?.length) {
                stack.push(node)
            }
            // 否则, 如果是parent的最后一个, 出栈
            else if (parent?.children.at(-1) === node && stack.length) {
                const out = stack.pop();
                if (parent !== out) throw new Error(`parent:${parent?.value}与栈顶节点:${out?.value}不同!`)
                if (parent.children.includes(pre)) pre = null;
                let preTopOfStack = parent;
                while (stack.length) {
                    if (stack.at(-1).children.at(-1) === preTopOfStack) {
                        preTopOfStack = stack.pop();
                        const _g = preTopOfStack
                        if (_g?.children?.includes(pre)) pre = null;
                    } else {
                        break
                    }
                }
                // if (stack.length === 0) console.log('执行完毕~');
            }
        })
    }
}
