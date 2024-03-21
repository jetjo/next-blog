import * as React from "react";
import { parseMDXHeader } from "./compile.mjs";

export function gen_BlogHeader2(context) {
  function BlogHeader2(prop) {
    const { title, date } = JSON.parse(parseMDXHeader(prop.children));
    return (
      <div>
        <a href={context.path}>
          <h2>{title}</h2>
        </a>
        <p>Posted: {date}</p>
        {/* <p>{slug}</p> */}
      </div>
    );
  }

  const _createMdxContentComps = {
    h2: BlogHeader2,
  };
  return proxy(_createMdxContentComps, context);
}

const keys = ["h2", "wrapper"];

const proxy = (_com_s, context) => {
  const res = new Proxy(_com_s, {
    get: (target, prop, receiver) => {
      if (keys.includes(prop)) return Reflect.get(target, prop, receiver);
      return Reflect.get(context._components, prop, receiver);
    },
  });
  return res;
};
