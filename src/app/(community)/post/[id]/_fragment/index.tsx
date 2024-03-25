import _ul from "./_ul";

function _swap(children: any[]): any {
  return children.map((child: any) => {
    if (typeof child === "string") return child;
    if (typeof child === "function") return child;
    if (typeof child === "symbol") return child;
    if (typeof child !== "object") return child;
    if (Array.isArray(child)) return _swap(child);
    if (child.type === "ul") return { ...child, type: _ul };
    return child;
  });
}

export default function _Fragment({ children }: any) {
  children = _swap(children);
  console.log(children, "fragment children");

  return <>{children}</>;
}
