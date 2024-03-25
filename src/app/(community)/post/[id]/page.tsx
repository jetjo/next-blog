import { loadCom_ } from "@/utils/mdx/load";
import { getPost } from "../../actions";
import Header2 from "./_header2";
import MDXLayout from "./_MDXLayout";
import _Fragment from "./_fragment";

export default async function Page(props: any) {
  const {
    params: { id = "" },
  } = props;
  const pathName = `/post/${id}`;
  const { post, content } = await getPost(id);
  // return <pre>{JSON.stringify({ post, content }, null, 4)}</pre>;
  console.log(content.content);

  const MDXContent = await loadCom_({ code: content.content || "" }, _Fragment as any);
  // console.log(MDXContent.toString());

  return (
    <>
      {MDXContent({
        components: Header2({ path: pathName, _components: { wrapper: MDXLayout } }),
      })}
    </>
  );
}
