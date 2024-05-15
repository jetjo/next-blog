// import type { Context } from "../../../global";
export interface Context { }

import { evaluate as _evaluate, run } from "@mdx-js/mdx";
import * as _runtime from "react/jsx-runtime";
// https://unifiedjs.com/explore/package/@mdx-js/react/#when-should-i-use-this
// https://mdxjs.com/docs/using-mdx/#mdx-provider
import * as _provider from '@mdx-js/react'
import { highLightLoad } from "../";

type _MDXModule = Awaited<ReturnType<typeof run>>;
export type RunOptions = Parameters<typeof run>[1];

export type MDXContent = _MDXModule["default"] & { context: Context };

export type MDXModule = Omit<_MDXModule, "default"> & { default: MDXContent };

export type Node = { code?: string; runTime: RunOptions } & Context;

const mdxRuntime = {
  // ..._provider,
  ..._runtime,
  //   Fragment,
  // NOTE: remarkMdxChartJS需要此设置
  baseUrl: import.meta.url,
} as RunOptions;

const mdxRuntime$ = {
  ..._runtime, baseUrl: import.meta.url,
} as RunOptions;

export async function loadCom_({ code } = { code: '' }, fragment = null) {
  if (!code) return null;
  // test
  // console.log('code', code);
  // highLightLoad(code);
  if (fragment) mdxRuntime.Fragment = fragment;
  // prettier-ignore
  const { default: Content } = await run(code, mdxRuntime) as MDXModule;
  // const { default: Content } = await import(path); //不支持动态参数
  // const { default: Content } = await import('/Users/loong/project/blog/next-blog/.debug/import-baseUrl.mdx.code.jsx');
  // const { default: Content } = await withWebpackContext(createRequire(import.meta.url))(path);
  return Content;
}
