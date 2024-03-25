import { evaluate as _evaluate, run } from "@mdx-js/mdx";
import * as _runtime from "react/jsx-runtime";
import type { Context } from "../../../global";
// // import { pathToFileURL as _pathToFileURL } from "url";
// import fileUrl from "file-url";
// import Fragment from "../../layout/Fragment";

// const pathToFileURL = fileUrl; //|| ((path = "") => _pathToFileURL(path).href);

type _MDXModule = Awaited<ReturnType<typeof run>>;
export type RunOptions = Parameters<typeof run>[1];

export type MDXContent = _MDXModule["default"] & { context: Context };

export type MDXModule = Omit<_MDXModule, "default"> & { default: MDXContent };

export type Node = { code?: string; runTime: RunOptions } & Context;

const mdxRuntime = {
  ..._runtime,
  //   Fragment,
  baseUrl: import.meta.url,
} as RunOptions;

const mdxRuntime$ = {
  ..._runtime,
  baseUrl: import.meta.url,
} as RunOptions;

export async function loadCom_({ code } = { code: "" }, fragment=null) {
  if(fragment) mdxRuntime.Fragment = fragment;
  // prettier-ignore
  const { default: Content } = await run(code, mdxRuntime) as MDXModule;
  return Content;
}
