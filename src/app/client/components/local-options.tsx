"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

export default function LocalOptions() {
  // 客户端组件的🪝, 返回当前路径, 不包含域和查询参数
  const pathName = usePathname();

  const getLocal = () => {
    const local = pathName.split("/")[1];
    return ["en", "es", "fr", "zh"].includes(local) ? local : "";
  };
  const [local, setLocal] = useState(getLocal);

  function updateLocal(local = "") {
    // pathName: /en/client
    // local: es
    const _ = pathName.replace(/^\/(en|es|fr|zh)/, "").split("/"); // ["", "client"]
    _.splice(1, 0, local); // ["", "es", "client"]
    const newPath = _.join("/"); // /es/client
    history.replaceState(null, "", newPath);
    setLocal(local);
  }

  return (
    <div>
      <select value={local} onChange={(e: any) => updateLocal(e.target.value)}>
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
