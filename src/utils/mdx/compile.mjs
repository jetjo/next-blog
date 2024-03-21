import fs from "node:fs/promises";
import { compile as _compile } from "@mdx-js/mdx";

async function compilePath(path) {
  const compiled = await _compile(await fs.readFile(path, "utf-8"), {
    outputFormat: "function-body",
  });
  return String(compiled);
}

async function compileFile(file) {
  const compiled = await _compile(file, {
    outputFormat: "function-body",
  });
  return String(compiled);
}

export async function compile({ filePath = "", fileContent = "" }) {
  if (fileContent) {
    return compileFile(fileContent);
  }
  if (filePath) {
    return compilePath(filePath);
  }
  throw new Error("No file path or content provided");
}

export function parseMDXHeader(headerStr) {
  return (
    '{"' + headerStr.replaceAll(":", '":').replaceAll(/\n/g, ',\n"') + "}"
  );
}
