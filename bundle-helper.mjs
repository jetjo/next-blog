import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { opendir } from "node:fs/promises";
import _path, { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function withWebpackContext(require = createRequire(import.meta.url)) {
  require.context = async (pathDir, recursive = true, glob) => {
    const keys = [];

    try {
      const dir = await opendir(_path.resolve(__dirname, pathDir), {
        encoding: "utf8",
        withFileTypes: true,
        recursive,
      });
      for await (const d of dir) {
        if (!d.path) {
          dir.closeSync();
          throw new Error(
            "d.path is undefined, 需要 node v20.1.0 或更高版本。"
          );
        }
        const p = _path.resolve(d.path, d.name);
        if (!d.isFile()) continue;
        if (glob && !glob.test(p)) continue;
        keys.push(p);
      }
    } catch (err) {
      console.error(err);
    }

    // return { keys: () => keys };
    const require = createRequire(import.meta.url);
    require.keys = () => keys;
    return require;
  };

  return require;
}
