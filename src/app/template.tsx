// `Template`实例不能在路由间共享, 每次路由切换都会重新渲染, 不同于`Layout`实例
export default function Template(props: any) {
  // console.log(props, "Template");
  return <>{props.children}</>;
}
