import style from "./layout.module.css";

export default function Layout(props: { children: React.ReactNode }) {
  // NOTE: useSelectedLayoutSegment(s) only works in Client Components.
  // const routeSegment = useSelectedLayoutSegment();
  // console.log(routeSegment);
  // const routeSegmentsC = useSelectedLayoutSegments();
  // console.log(routeSegmentsC);
  
  return <article className={`${style.article}`}>{props.children}</article>;
}
