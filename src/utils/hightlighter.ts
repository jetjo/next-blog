"use server";

import { common, createStarryNight } from "@wooorm/starry-night";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { renderToHTML } from "next/dist/server/render";
import { renderToStaticMarkup } from "react-dom/server";
import * as _runtime from "react/jsx-runtime";
import { toHtml } from "hast-util-to-html";
import { starryNightGutter } from "./hast-util-starry-night-gutter";

const starryNight = await createStarryNight(common);

const renderCode = async (component: any) => {
  return toHtml(component);
};

export const render = async (component: any) => {
  // NOTE: 不能直接转换`starryNight.highlight`的返回的`hast`, Error: Objects are not valid as a React child (found: object with keys {type, children})
  const ReactDOMServer = (await import("react-dom/server")).default;
  const staticMarkup = ReactDOMServer.renderToStaticMarkup(component);
  return staticMarkup;
};

const map = {
  'tsx': "jsx"
}

export async function highLightLoad(content = "", { flag = 'js', lineNumbers = true } = {}) {
  flag = map[flag] || flag;
  const scope = starryNight.flagToScope(flag);
  if (!scope) throw new Error(`暂未支持${flag}语言的语法高亮!`);

  const tree = await starryNight.highlight(content, scope);
  if (lineNumbers) {
    starryNightGutter(tree);
  }
  // const reactNode = toJsxRuntime(tree, {
  //   ...(_runtime as any),
  // });
  //   console.log(reactNode);
  //   const html = renderToStaticMarkup(reactNode); // ok
  // const html = await renderCode(reactNode); // NOTE: 不能使用`toHtml`, 报错: Error: Cannot convert a Symbol value to a string
  const html = await renderCode(tree); // ok
  console.dir({ html: flag === 'html' ? html : undefined, flag, scope, tree: flag === 'html' ? JSON.parse(JSON.stringify(tree)) : undefined }, { depth: Infinity });
  //   console.log(html);
  return html;
  // return reactNode;
}
