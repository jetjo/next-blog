import { open, writeFile } from "fs/promises";
import fs from "node:fs/promises";
// import { read, write } from "to-vfile";

export async function saveFile(file: Blob | string, path: string) {
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  const data = typeof file === 'string' ? file : new Uint8Array(await file.arrayBuffer());
  await writeFile(path, data); //, { signal });
}

export async function readFile(path: string) {
  const isFile = async () => {
    try {
      const info = await fs.stat(path);
      return info.isFile();
    } catch (error: any) {
      console.error(error.message);
      return false;
    }
  };
  if (!(await isFile())) return "";
  const code = await fs.readFile(path, "utf-8");
  return code;
}
