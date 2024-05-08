import { read } from "to-vfile";
import { matter } from "vfile-matter";
export async function printMatter(filePath = "") {
  const file = await read(filePath);

  matter(file, { strip: true });

  console.dir(file.data, { depth: null }); //, 'v-file matter');
  console.log(String(file), "v-file matter");
}
