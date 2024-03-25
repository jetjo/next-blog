/**
 * @param {JSX.Element} Header2
 * @param {{path: string, _components: Record<string, JSX.Element|string>}} context
 */
export function proxyHeader2(Header2, context) {
  const _createMdxContentComps = {
    h2: Header2,
  };
  return proxy(_createMdxContentComps, context, keys);
}

const keys = ["h2"];;//, "wrapper"];

const proxy = (_com_s, context) => {
  const keys = Object.keys(_com_s).concat(Object.keys(context._components));
  const res = new Proxy(_com_s, {
    get: (target, prop, receiver) => {
      console.log("prop", prop);
      const res = Reflect.get(target, prop, receiver);
      if(res != null) return res;
      return Reflect.get(context._components, prop, receiver);
    },
    ownKeys: (target) => {
      // const keys = Reflect.ownKeys(target).concat(Object.keys(context._components));
      console.log("ownKeys", keys);
      return keys;
    },
  });
  return res;
};
