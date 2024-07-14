"use client";

import { usePathname } from "next/navigation";

export default function LocalOptions() {
  // 客户端组件的🪝, 返回当前路径, 不包含域和查询参数
  const pathName = usePathname();

  console.log(pathName, "rerender");

  const getLocal = () => {
    const local = pathName.split("/")[1];
    return ["en", "es", "fr", "zh"].includes(local) ? local : "";
  };
  // const [local, setLocal] = useState(getLocal);

  function updateLocal(local = "") {
    // pathName: /en/client
    // local: es
    const _ = pathName.replace(/^\/(en|es|fr|zh)/, "").split("/"); // ["", "client"]
    _.splice(1, 0, local); // ["", "es", "client"]
    const newPath = _.join("/"); // /es/client
    // 对`history.replaceState`等的调用会被`Next.js Router`捕获, 并将与`usePathname`钩子同步,
    // `usePathname`的返回值自动异步更新, 从而触发重新渲染
    history.replaceState(null, "", newPath);
    // 经测试, `setLocal`调用触发的异步更新并没有与`pathName`的异步更新合并, 导致了两次重新渲染,
    // 第一次渲染由`setLocal`触发, 第二次渲染由`history.replaceState`触发
    // setLocal(local);
  }

  return (
    <div>
      <select
        value={getLocal()}
        onChange={(e: any) => updateLocal(e.target.value)}
      >
        <option value="" disabled>
          Language:
        </option>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
}
