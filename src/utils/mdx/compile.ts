/// <reference lib="esnext" />

import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import _path from "path";
import { v4 as uuidv4 } from 'uuid';
import punycode from 'punycode/punycode.js'

import { compile as _compile } from "@mdx-js/mdx";
import _grayMatter from "gray-matter";
import readingTime from "reading-time";
import { SourceMapGenerator } from 'source-map';
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";

// #region remark plugins
import remarkGfm from "remark-gfm"; // Tables, footnotes, strikethrough, task lists, literal URLs.
import remarkDirective from "remark-directive";
import remarkMath from "remark-math"; // Support math like `$so$`.
import { remarkHeadingId } from "./plugins/remark-heading-id";
import remarkHeadings from '@vcarl/remark-headings';
import remarkMdxEnhanced from 'remark-mdx-math-enhanced'
// #endregion

// #region rehype plugins
import rehypeKatex from 'rehype-katex' // Render math with KaTeX.
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import rehypeSanitize from 'rehype-sanitize'
// #endregion

import { h } from 'hastscript'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
// import { withWebpackContext } from "../../../bundle-helper.mjs";
// import rehypeMdxCodeProps from 'rehype-mdx-code-props'
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
// import remarkUsage from 'remark-usage'
// import type {Options as RemarkUsageOption} from 'remark-usage'
// import { remark } from 'remark'
// import { read } from 'to-vfile'
// import remarkExportsPlugin from './plugins/exports'
import { myRemarkYoutubeDirective } from './plugins/youtube-directive'
import remarkMdxChartJS from './plugins/charjs'; // 'remark-mdx-chartjs';
import { remarkAssertOrigin } from "./plugins/assert-origin";
import { unsupportedLangs, delQuoteAtStartAndEnd, parseTokenStr, rehypeCodeLangSwitcher } from "./plugins/code-switcher";
import { highLightLoad } from "../hightlighter";
import { _parseFloat, _parseInt } from "../number";
import { IHeading } from "@/model/blog";
import { dir } from "node:console";
import { HeadingAncestors, HeadingChildren, headingKeys } from "@/model/blog/Headings";
import { pick } from "lodash-es";

/**
 * @typedef {import('hast').ElementContent} ElementContent
 */

/**
 * @typedef {import('remark-usage').Options} RemarkUsageOption
*/

/**
 * @typedef {import('gray-matter')} MatterNs
*/

// const _require = withWebpackContext();


// const remarkExportsPlugin = _require(_path.resolve(fileURLToPath(import.meta.url), '../plugins/exports/index.cjs')).default;

// const punycode = _require('punycode/');

// @ts-ignore
const BlogTitleMinLen = Math.max(3, parseInt(process.env.BlogTitleMinLen) || 0);

const compiledProgramStoreDir = _path.resolve(process.cwd(), '../data/src/app/')
const componentsDirOfCompiledProgramDependOn = _path.resolve(process.cwd(), '../data/src/components/')

const compiledProgramStorePath = async (blogName, userId = '1') => {
  // const absDir = _path.resolve(compiledProgramStoreDir, userId, encodeURIComponent(blogName), 'view')
  const absDir = _path.resolve(compiledProgramStoreDir, userId, punycode.encode(blogName), 'view')
  await fs.mkdir(absDir, { recursive: true })
  return _path.resolve(absDir, 'page.jsx')
}

async function writePage({ path = '', pageCode = '' }) {
  await fs.writeFile(path,
    `import { components } from "@/components";
import MDXContent from "../blog";
import * as params from "../blog";

export default function Page() {
    return MDXContent({
        name: 'Jetjo\`s blog!',
        year: '2024',
        ...params,
        components
    })
}`)
  await fs.writeFile(_path.resolve(path, '../../', 'blog.jsx'), pageCode)
  await fs.writeFile(_path.resolve(path, '../../', 'route.js'),
    `import React from "react";
import Page from './view/page'
import { render } from '@/utils/render'

export async function GET() {
    const html = await render(<Page />)
    return Response.json({ html })
}`)
}

async function compileFileToProgram(file = "", { noHeaderCompile, blogName, programPath }) {
  try {
    // console.log(noHeaderCompile, "noHeaderCompile");
    // console.log(compiledProgramStorePath(blogName), 'compiledProgramStorePath');
    const matter = _grayMatter(file);
    // dir({ matter }, { depth: 10 });
    if (noHeaderCompile) file = matter.content;
    let vfile;
    const compiled = String(
      vfile = await _compile(file, {
        SourceMapGenerator,
        // 编译出的文件在模块系统中的url, 即编译出的文件内的语句`import.meta.url`的值, 
        // 编译出的文件内导入其他模块时, 如果使用的是相对路径,自然是以此为基准的
        baseUrl: pathToFileURL(programPath),
        development: true,
        format: 'detect', // 'detect' | 'mdx' | 'md'
        // whether to preserve JSX
        jsx: true, //  需配合`outputFormat: 'program'`
        // place to import automatic JSX runtimes from
        jsxImportSource: "react",
        jsxRuntime: "automatic",  // "classic" | "automatic"
        outputFormat: 'program',
        // pragma: 'React.createElement',
        // pragmaFrag: 'React.Fragment',
        // pragmaImportSource: 'react',
        // providerImportSource: '@mdx-js/react', // NOTE: only for test!!!

        recmaPlugins: [],// plugins to transform esast trees (JavaScript)
        // rehypePlugins: [[rehypeKatex, { strict: true, throwOnError: true }]],
        remarkPlugins: [
          // // [remarkFrontmatter, 'toml'],
          // // remarkFrontmatter,// 没毛用
          // // remarkMdxFrontmatter,// 输出异常
          // remarkDirective,
          // myRemarkPlugin,
          // // 有些插件间有次序限制, 此插件必须在`remarkDirective`之后
          // myRemarkYoutubeDirective,
          // remarkMath,
          [remarkGfm, { singleTilde: false }],
        ],
        // remarkRehypeOptions: {clobberPrefix: 'comment-1'},
        // 生成的节点树中的属性名的大小写格式
        elementAttributeNameCase: 'react', // 'react' | 'html'
        // 生成的节点树的style属性中的属性名的大小写格式,
        // css: background-color, dom: backgroundColor
        stylePropertyNameCase: "dom", // 'dom' | 'css'
      })
    );
    console.log({ compiled, map: vfile.map });
    return { matter, compiled };
  } catch (error) {
    console.error(error)
  }
}

const CommonReadingSpeed = {
  wordsPerMinute: 200
}
const CodeReadingSpeed = {
  wordsPerMinute: 500,
  wordBound: (c = '') => {
    // console.log({ c });
    return /\W/.test(c)
  }
}

async function compilePath(path = "", option) {
  const file = await fs.readFile(path, "utf-8");
  option.matter = _grayMatter(file);
  requireValidTitle(option.matter.data.title)
  return compileFile(file, option);
}

export type RemarkHeading = {
  ancestors?: HeadingAncestors;
  children?: HeadingChildren;
  id?: string;
  idx?: number;
  depth: number;
  value: string;
  data: {
    id: string;
    hProperties: {
      id: string;
    }
  }
}

function populateAncestors(headings: RemarkHeading[]) {
  const populateChildren = (child: RemarkHeading, ancestor: RemarkHeading) => {
    if (!ancestor.children) {
      ancestor.children = (new Array(7)).fill(null, ancestor.depth + 1) as HeadingChildren
      ancestor.children[ancestor.depth] = ancestor.id;
      ancestor.children[0] = []
    }
    const c = ancestor.children[child.depth] ||= []
    // @ts-ignore
    c.push(child.id!)
    ancestor.children[0].push({ id: child.id!, idx: child.idx!, depth: child.depth })
  }
  const initAncestors = (h: RemarkHeading) => {
    const a = new Array(h.depth + 1)
    a.fill(null, 1)
    a[a.length - 1] = h.id
    return a as HeadingAncestors
  }
  const stack = [] as RemarkHeading[]
  let hi = 0
  for (const h of headings) {
    if (!h || !h.depth || !h.data?.id) {
      throw new Error(`标题对象${h}的depth和id属性不能为空!`)
    }
    h.idx = hi++;
    h.depth = Number(h.depth)
    if (![1, 2, 3, 4, 5, 6].includes(h.depth)) {
      throw new Error(`标题的级别(${h.depth})不合法!`)
    }
    h.id = h.data.id;
    h.ancestors ||= initAncestors(h);
    // h.ancestors[h.depth] = (h.id)
    let j = 0, lJ = -0, lFlag = false;
    const stackLen = -1 * stack.length
    while (--j >= stackLen) {
      const c = stack.at(j)!
      if (c.depth! < h.depth) {
        lFlag = true;
        if (h.ancestors[c.depth] !== null) {
          throw new Error('genHeadingTree未知异常!')
        }
        h.ancestors[c.depth] = (c.id!)
        populateChildren(h, c)
        continue;
      }
      if (lFlag) {
        throw new Error('genHeadingTree未知异常!')
      }
      lJ = j;
    }
    stack.splice(lJ + stack.length, -1 * lJ, h)
  }
  // dir(headings, { depth: Infinity })
}

/**
 * @param {string} [file=""] 
 * @param {Object} param1 
 * @param {ReturnType<MatterNs>} param1.matter 
 * @param {RemarkUsageOption} param1.remarkUsageOption 
 */
async function compileFile(file = "", { noHeaderCompile, blogName, matter, remarkUsageOption }) {
  // console.log(noHeaderCompile, "noHeaderCompile");
  // #region 测试
  // const programPath = await compiledProgramStorePath(blogName);
  // const program = await compileFileToProgram(file, { noHeaderCompile, blogName, programPath });
  // await fs.writeFile(programPath, program.compiled);
  // await writePage({ path: programPath, pageCode: program.compiled }); // test
  // #endregion
  // const matter = _grayMatter(file);
  // dir({ matter }, { depth: 10 });
  const { codeBlocks, content } = await parseCodeBlocks(matter.content);
  // 不包含代码块的阅读时长
  const readingTimeInfo = readingTime(content, CommonReadingSpeed)
  const sumReadingTime = codeBlocks.reduce((sum, { readingTime }) => (sum += _parseFloat(readingTime)), 0) + _parseFloat(readingTimeInfo.minutes)
  // if (noHeaderCompile) file = matter.content;
  const conditionalRemarkPlugins = []
  let content1 = content;
  let codeBlocks1 = codeBlocks;
  if (remarkUsageOption) {
    // // conditionalRemarkPlugins.push([remarkUsage, { ...remarkUsageOption }])
    // // const file = await read({path: 'readme.md', cwd: 'example'})
    // // .use(remarkToc, {heading: 'contents', tight: true})
    // content1 = String(await remark().use(remarkUsage, remarkUsageOption).process(content))
    // const b = await parseCodeBlocks(content1);
    // content1 = b.content;
    // codeBlocks1 = b.codeBlocks;
  }
  try {
    const vfile = await _compile(content1 || content, {
      outputFormat: "function-body", // 后续配合`run`方法使用,需要设置为此值
      rehypePlugins: [
        // NOTE: 由于前面插件`remarkMdxChartJS`的原因, 此插件失效
        [rehypeKatex, { strict: true, throwOnError: true }],
        [rehypeCodeLangSwitcher, { codeBlocks: codeBlocks1 || codeBlocks1 || [] }],
        [rehypeSlug, { prefix: 'jetjo--' }],
        // [rehypeAutolinkHeadings, { behavior: 'prepend' }],
        // [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        // [rehypeAutolinkHeadings, {
        //   content: /** @type {Array<ElementContent>} */ (
        //     fromHtmlIsomorphic(
        //       '<svg height="10" width="10"><circle cx="5" cy="5" r="5" fill="black" /></svg>',
        //       { fragment: true }
        //     ).children
        //   )
        // }],
        // [rehypeAutolinkHeadings, {
        //   content(node) {
        //     return [
        //       h('span.visually-hidden', 'Read the “', toString(node), '” section'),
        //       h('span.icon.icon-link', { ariaHidden: 'true' })
        //     ]
        //   }
        // }],
        [rehypeAutolinkHeadings, {
          content(node) {
            return h('h-link', toString(node))
          }
        }],
        // rehypePresetMinify,
        [rehypeMinifyWhitespace, { newlines: true }],
        // rehypeSanitize
        // rehypeMdxCodeProps // 转换`hast`到`jsx`, 因此需要放在最后
      ],
      remarkPlugins: [
        remarkDirective,
        remarkMath,
        [remarkMdxEnhanced, { component: 'Math' }],
        [remarkGfm, { singleTilde: false }],
        remarkMdxChartJS,
        remarkDirectiveTest,
        // 有些插件间有次序限制, 此插件必须在`remarkDirective`之后
        myRemarkYoutubeDirective,
        [remarkHeadingId, { defaults: true, uniqueDefaults: true }],
        // 必须放在`remarkHeadingId`之后
        remarkHeadings,
        remarkAssertOrigin,
        // https://github.com/unifiedjs/unified?tab=readme-ov-file#transformer
        ...conditionalRemarkPlugins
      ],
      recmaPlugins: [recmaMdxEscapeMissingComponents],
    })
    // console.dir(vfile.data.headings, { depth: Infinity })
    // console.log({ vfile });
    const compiled = String(vfile);
    // console.log({ compiled }, 'mdx的编译结果~');
    const headings = vfile.data.headings as any;
    // swapDuplicateHeadingId(headings)
    populateAncestors(headings);
    return {
      sumReadingTime, matter, code: compiled, content: content1 || content, codeBlocks: codeBlocks1 || codeBlocks, headings: headings.map(h => {
        // ({ depth: h.depth, value: h.value, id: h.data.id, ancestors: h.ancestors, children: h.children })
        h.id = h.data.id;
        return pick(h, headingKeys);
      })
    };
  } catch (error: any) {
    console.error('编译异常!!!!!!', error.message)
    throw new Error(error.message);
  }
}

// This plugin is an example to let users write HTML with directives.
// It’s informative but rather useless.
// See below for others examples.
function remarkDirectiveTest() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    visit(tree, function (node) {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {})
        const hast = h(node.name, node.attributes || {}) as any

        data.hName = hast.tagName
        data.hProperties = hast.properties
      }
    })
  }
}

const requireValidTitle = (title = '') => {
  if (!title) {
    throw new Error('请补充文章名称!');
  } else if (title.replace(/\s/g, '').length < BlogTitleMinLen) {
    throw new Error('文章标题过短!')
  }
}

/**
 * @typedef {object} MDXHead
 * @property {string} title
 * @property {string} [description]
 * @property {string} date
 * @property {string} [tags]
 * @property {string} slug
 * */

export async function compile({
  filePath = "",
  fileContent = "",
  noHeaderCompile = true,
  blogName = '',
  remarkUsageOption = null
}) {
  // prettier-ignore
  let res;// = {};
  if (fileContent) {
    const matter = _grayMatter(fileContent)
    requireValidTitle(matter.data.title)
    res = await compileFile(fileContent, { noHeaderCompile, blogName, matter, remarkUsageOption });
  } else if (filePath) {
    res = await compilePath(filePath, { noHeaderCompile, blogName, remarkUsageOption });
  }
  else {
    throw new Error('请提供文件路径或文章内容!')
  }
  // const codeBlocks = await parseCodeBlocks(res.matter.content);
  // console.dir({ codeBlocks, len: codeBlocks.length }, { depth: 10 });
  return { ...res, head: res.matter?.data };
}

/**
 * 对于如下格式的输入:
 * ~~~mdx
 *  ```path/to/example.js
 *  console.log(1)
 *  ```
 * ~~~
 * 或者:
 * ~~~mdx
 *  ``` filename=path/to/example.js
 *  console.log(1)
 *  ```
 * ~~~
 * 函数`parseCodeBlocks`解析得到`lang`: \
 * `path/to/example.js`或者`filename=path/to/example.js`,\
 * 此函数进一步从`lang`中解析出`filename`和`lang`
 * @returns {{filename: string, lang: string}}
 * ~~~js
 * {filename: "path/to/example.js", lang: "js"}
 * ~~~
 */
function parseTokenFromLang(lang = "path/to/example.js") {
  const isFile = lang.includes(".") || lang.startsWith("filename=");
  if (lang.startsWith("filename=")) lang = lang.slice(9);
  lang = delQuoteAtStartAndEnd(lang);
  const reg = /\w+$/;
  const res = reg.exec(lang);
  return Object.freeze({
    filename: isFile ? lang : "",
    lang: res ? res[0] : "",
  });
}

function isNestedBlock({ startPos, matchLen }, content = '', codeFenceBoundary) {
  const reg = new RegExp(`${codeFenceBoundary}[\\s\\S]*?${codeFenceBoundary}`, 'g')
  let m;
  // throw new Error('解析异常! cross nested???')
  while (m = reg.exec(content)) {
    const _start = m.index, _end = m.index + m[0].length;
    if (_end < startPos) {
      // if (_end <= startPos) { // NOTE: 下一个字符该是换行符,不应该等于, reg没有消费两侧的换行
      continue
    }
    const endPos = startPos + matchLen - 1;
    if (_end > startPos) {
      if (_start < startPos) {
        if (_end <= endPos) {
          throw new Error('解析异常! cross nested???')
        }
        // 包含了嵌套代码块
        return true;
      }
      if (_start === startPos) {
        throw new Error('被检测代码块的codeFenceBoundary不应该与传入的codeFenceBoundary相同!???')
      }
      if (_start > startPos) {
        if (_start < endPos) {
          if (_end - 1 >= endPos) {
            throw new Error('语法错误???')
          }
          // 嵌套在了被检测代码的内部
          continue; // throw new Error('not impl')
        }
        if (_start === endPos) {
          throw new Error('语法错误, 代码块之间该有换行???')
        }
        // 越过了被测代码块
        return false; // throw new Error('not impl')
      }
      // throw new Error('not impl')
    }
  }
}

async function parseCodeBlocks(content = "") {
  // const reg = /```(\w+)[^\n\S]*([\s\S]*?)\n([\s\S]*?)```/g;
  // const reg = /```(\w+)[^\n\S]*([^\n]*?)\n([\s\S]*?)```/g;
  // const reg = /```(\S+)[^\n\S]*([^\n]*?)\n([\s\S]*?)```/g;
  // const reg = /```[^\n\S]*(\S+)[^\n\S]*([^\n]*?)\n([\s\S]*?)```/g; // NOTE: 如果有交叉嵌套(cross nested), 此正则无法匹配, 比如:
  // const reg = /(`+)[^\n\S]*(\S+)[^\n\S]*([^\n]*?)\n([\s\S]*?)\1/g; // NOTE: 如果有交叉嵌套(cross nested), 此正则无法匹配, 比如:
  // const reg = /(`+)(\S*)[^\n\S]*([^\n]*)\n(.*)\1/g; //
  // const reg = /(`{3,})(.*?)\n([\s\S]+?)\n\1/g; //
  // ```start1
  // ~~~start1-1
  // ```start1-1-1
  // ```end1-1-1
  // ~~~end1-1
  // ```end1
  // const reg1 = /~~~[^\n\S]*(\S+)[^\n\S]*([^\n]*?)\n([\s\S]*?)~~~/g;
  // const reg1 = /(~+)[^\n\S]*(\S+)[^\n\S]*([^\n]*?)\n([\s\S]*?)\1/g; //÷
  // const reg1 = /(~{3,})(.*?)\n([\s\S]+?)\n\1/g; //
  const reg = /([`~]{3,})(.*?)\n([\s\S]+?)\n\1/g; //
  const codeBlocks: any[] = [];
  let res,
    idx = 0;
  const getOtherFenceBoundary = (codeFenceBoundary = '') => {
    if (codeFenceBoundary[0] === '`') {
      return [codeFenceBoundary.replaceAll('`', '~')]
    }
    if (codeFenceBoundary[0] === '~') {
      return [codeFenceBoundary.replaceAll('~', '`')]
    }
    throw new Error('not impl!')
  }
  const handleMatched = async () => {
    // dir(res, 'res');
    const codeFenceBoundary = res[1]
    // console.log([res[1], res[2], res[3]], "res");
    const bounds = getOtherFenceBoundary(codeFenceBoundary)
    const startPos = res.index, matchLen = res[0].length;
    for (const b of bounds) {
      const f = isNestedBlock({ startPos, matchLen }, content, b)
      if (f) return;
    }
    const meta = res[2].trim().split(' ');
    const lang_ = meta[0]
    const langToken = parseTokenFromLang(lang_);
    const lang = langToken.lang;
    if (unsupportedLangs.includes(lang)) {
      console.warn({ lang, lang_, meta }, "不支持的代码块语言");
      return;// continue;
    }
    const tokenStr = res[2].trim();
    const code = res[3];
    const reading = readingTime(code, CodeReadingSpeed)?.minutes;
    console.log({ reading });
    codeBlocks.push({
      codeFenceBoundary,
      uuid: uuidv4(),
      idx: idx++,
      startPos,
      matchLen,
      rowLen: code.split('\n').length,
      lang,
      code,
      readingTime: reading,
      html: await highLightLoad(code, { lang, flag: lang } as any),
      tokens: tokenStr ? parseTokenStr(tokenStr, langToken.filename) : {},
      langToken,
    });
    if (langToken.filename) {
      console.warn(res[2], "不规则的代码块头部");
    }
  }
  while ((res = reg.exec(content))) {
    await handleMatched();
  }
  content = consumeCodeBlocks(content, codeBlocks as any);
  return { codeBlocks, content };
}

const codeFenceBoundary = "```"
function stringifyToken(tokens) {
  const nameKeys: any[] = []
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'boolean') {
      nameKeys.push(key)
    }
    else if (typeof value === 'string' || typeof value === 'number') {
      nameKeys.push(`${key}=${value}`)
    } else {
      console.error('不支持的token值类型', key, value);
    }
  }
  return nameKeys.join(' ')
}
function consumeCodeBlocks(content = '', codeBlocks = []) {
  let preStartPos = 0, preMatchLen = 0;
  const textBlocks: any[] = [];
  for (const { startPos, matchLen, tokens, lang = 'unknown', uuid, idx, codeFenceBoundary } of codeBlocks) {
    const preEndPos = preStartPos + preMatchLen;
    textBlocks.push(content.slice(preEndPos, startPos))
    const tokenStr = stringifyToken(tokens);
    textBlocks.push(`${codeFenceBoundary}${lang} lang=${lang} uuid=${uuid} idx=${idx} ${tokenStr}\n${codeFenceBoundary}`)
    preStartPos = startPos;
    preMatchLen = matchLen;
  }
  textBlocks.push(content.slice(preStartPos + preMatchLen))
  return textBlocks.join('');
}

export function parseMDXHeaderFromRaw(code = "") {
  const c1 = code.slice(code.indexOf("---") + 3);
  const c2 = c1.slice(0, c1.indexOf("---"));
  const c3 = c2.replace(/^\s+/, "");
  const c4 = c3.replace(/\s+$/, "");
  // const res = parseMDXHeader(c4);
  const res = parseMDXHeader(`---\n${c4}\n---`);
  console.log({ c4, res });
  return res;
  // return JSON.parse(res);
  // console.log("match", JSON.parse(res));
}

// returns the first 4 lines of the contents
function firstFourLines(file, options) {
  file.excerpt = file.content.split("\n").slice(0, 4).join(" ");
}

const defaultExcerpt = (file, options) => {
  const c1 = file.content
    .replace(/^\s+/, "")
    .replace(/\s+$/, "")
    .slice(0, 1024);
  // 清楚`c1`中的`xml`格式的文本
  const c2 = c1.replace(/<[^>]+>/g, "");
  file.excerpt = c2.slice(0, Math.min(c2.indexOf(`## `), 512));
};

/**
 * @deprecated 多此一举, 本以为不支持重复的键, 但是实际上是支持的
 * @param {string} content
 * @param {{excerpt: boolean}} param1 摘抄
 * 例如:
 * ```js
 * const str = '---\nfoo: bar\n---\nThis is an excerpt.\n---\nThis is content';
 * const file = matter(str, { excerpt: true });
 * ```
 * 结果:
 * ```json
 * {
 *    content: 'This is an excerpt.\n---\nThis is content',
 *    data: { foo: 'bar' },
 *    excerpt: 'This is an excerpt.\n'
 *  }
 * ```
 */
function grayMatter(content = "", { excerpt = defaultExcerpt } = {}) {
  const idx1 = content.indexOf("---");
  const idx2 = content.indexOf("---", idx1 + 3);
  const sliceStartIdx = idx2 + 3;
  const header = swapDuplicateKeys(content.slice(0, sliceStartIdx));
  const body = content.slice(sliceStartIdx);
  const matter = _grayMatter(`${header}\n${body}`, { excerpt } as any);
  const data = unSwapMatterHeaderKey(matter.data);
  console.dir({ matter, data }, { depth: null }); //, 'gray-matter compile result...');
  return { ...matter, data };
}

const unSwapMatterHeaderKey = (header) => {
  if (!header) return header;
  if (typeof header !== "object") return header;
  if (Array.isArray(header)) {
    return header.map((h) =>
      !h || typeof h !== "object" ? h : unSwapMatterHeaderKey(h)
    );
  }
  const keys = Object.keys(header);
  /**@type {Record<string, any>} */
  const unSwapped = keys.reduce((acc, key) => {
    const keyWithoutIndex = swapDuplicateKey(key, 0, true);
    const value = header[key];
    const isObj = value && typeof value === "object";
    const unWrapValue = isObj ? unSwapMatterHeaderKey(value) : value;
    if (!acc[keyWithoutIndex]) {
      acc[keyWithoutIndex] = unWrapValue;
    } else {
      if (!Array.isArray(acc[keyWithoutIndex])) {
        acc[keyWithoutIndex] = [acc[keyWithoutIndex]];
      }
      acc[keyWithoutIndex].push(unWrapValue);
    }
    return acc;
  }, {});
  // console.log({ header, keys, unSwapped });
  return unSwapped;
};

/* 输出结果示例1: {
  file: {
    content: '',
    data: {
      title: 'Server Components',
      description: 'Learn how you can use React Server Components to render parts of your application on the server.',
      related: null,
      'description$0': 'Learn how Next.js caches data and the result of static rendering.',
      links: null
    },
    isEmpty: false,
    excerpt: ''
  }
} */
/* 输出结果示例2: {
  file: {
    content: '',
    data: {
      'There are a couple of benefits to doing the rendering work on the server, including': null
    },
    isEmpty: false,
    excerpt: ''
  }
} */
export function parseMDXHeader(headerStr) {
  // return {}
  headerStr = swapDuplicateKeys(headerStr);
  const file: any = _grayMatter(headerStr, { excerpt: true });
  if (file.empty) {
    console.warn("mdx文件不合法, 缺少头部信息!");
  }
  return unSwapMatterHeaderKey(file.data);
}

function findDuplicateKeys(t) {
  const r = /\s(\w+):/g;
  let res;
  const keys: any[] = [];
  const dupKeys: any[] = [];
  while ((res = r.exec(t))) {
    const match = res[0];
    const key = res[1];
    const matchIndex = res.index;
    const keyIndex = matchIndex + match.indexOf(key);
    if (keys.find((ky) => ky.key === key)) {
      dupKeys.push({ match, key, matchIndex, keyIndex });
    }
    keys.push({ match, key, matchIndex, keyIndex });
  }
  return dupKeys;
}

const swapDuplicateKey = (key = "", i = 0, isAfter = false) =>
  isAfter ? key.replace(/\$\d+$/, "") : `${key}$${i}`;

function swapDuplicateKeys(txt) {
  const dupKeys = findDuplicateKeys(txt);
  let sliceStart = 0;
  const segments: any[] = [];
  const keyCounter = {};
  dupKeys.reduce((acc, cur) => {
    if (!acc[cur.key]) {
      acc[cur.key] = 0;
    }
    // acc[cur.key]++;
    return acc;
  }, keyCounter);
  for (let index = 0; index < dupKeys.length; index++) {
    const dupKey = dupKeys[index];
    segments.push(txt.slice(sliceStart, dupKey.keyIndex));
    const i = keyCounter[dupKey.key];
    segments.push(swapDuplicateKey(dupKey.key, i, false));
    // segments.push(dupKey.key + `$${keyCounter[dupKey.key]}`);
    sliceStart = dupKey.keyIndex + dupKey.key.length;
    keyCounter[dupKey.key] += 1;
  }
  segments.push(txt.slice(sliceStart));
  return segments.join("");
}

function swapDuplicateHeadingId(headings: RemarkHeading[]) {
  // NOTE: 这样数组中的所有元素都是同一个对象...
  // const ids = (new Array(7)).fill([])
  const ids = [[], [], [], [], [], [], []]
  for (const h of headings) {
    if (h?.data?.id && [1, 2, 3, 4, 5, 6].includes(h.depth)) {
      const id = h.data.id;
      const iids = ids[h.depth]
      h.data.id = `${id}-${h.depth}-${iids.length}`
      h.data.hProperties.id = h.data.id;
      iids.push(id)
      ids[0].push(id)
    }
    else throw new Error('标题对象必须具有`data.id`和合法的`depth`成员!')
  }
  // throw new Error("Function not implemented.");
}

