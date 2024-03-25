import fs from "node:fs/promises";
import { compile as _compile } from "@mdx-js/mdx";

async function compilePath(path) {
  const content = await fs.readFile(path, "utf-8");
  const compiled = await _compile(content, {
    outputFormat: "function-body",
  });
  return { code: String(compiled), content };
}

async function compileFile(file) {
  const compiled = await _compile(file, {
    outputFormat: "function-body",
  });
  return String(compiled);
}

/**
 * @typedef {object} MDXHead
 * @property {string} title
 * @property {string} [description]
 * @property {string} date
 * @property {string} [tags]
 * @property {string} slug
 * */

export async function compile({ filePath = "", fileContent = "" }) {
  // prettier-ignore
  let code, content = fileContent;
  if (fileContent) {
    code = await compileFile(fileContent);
  }
  if (filePath) {
    const res = await compilePath(filePath);
    code = res.code;
    content = res.content;
  }
  if (!code) {
    throw new Error("No file path or content provided");
  }
  // console.log(code, 'code');
  /**@type {MDXHead} */
  const head = parseMDXHeaderFromRaw(content);
  return { code, head };
}

export function parseMDXHeaderFromRaw(code = "") {
  const c1 = code.slice(code.indexOf("---") + 3);
  const c2 = c1.slice(0, c1.indexOf("---"));
  const c3 = c2.replace(/^\s+/, "");
  const c4 = c3.replace(/\s+$/, "");
  const res = parseMDXHeader(c4);
  return JSON.parse(res);
  console.log("match", JSON.parse(res));
}

export function parseMDXHeader(headerStr) {
  return '{"' + headerStr.replaceAll(":", '":').replaceAll(/\n/g, ',\n"') + "}";
}
