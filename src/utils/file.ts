import { open, writeFile } from "fs/promises";
import fs from "node:fs/promises";

export async function saveFile(file: Blob, path: string) {
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  const data = new Uint8Array(await file.arrayBuffer());
  await writeFile(path, data); //, { signal });
}

export async function readFile(path: string) {
  const isFile = async () => {
    try {
      const info = await fs.stat(path);
      return info.isFile();
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  if (!isFile()) return "";
  const code = await fs.readFile(path, "utf-8");
  return code;
}