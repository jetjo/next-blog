// `Template`实例不能在路由间共享, 每次路由切换都会重新渲染, 不同于`Layout`实例
// 同一个目录下的`layout`、`template`、`page`之间的嵌套层次是: `<layout><template><page /></template></layout>`
// 由于每次路由切换时,都会重新渲染,因此能间接知道路由的改变,因而, 
// 客户端渲染的`template`中如果有`useEffect`, 可以在路由变化时重新执行.
export default function Template(props: any) {
  // return null;
  console.log(props, "Template");
  return <>{props.children}</>;
}
