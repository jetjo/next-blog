import { getPost } from "@/app/actions";
import { loadCom_ } from "@/utils/mdx/load";
import { gen_BlogHeader2 } from "@/utils/mdx/mdx-header";

export default async function Page(props: any) {
  const {
    params: { id = "" },
  } = props;
  const pathName = `/post/${id}`;
  const { post, content } = await getPost(id);
  const MDXContent = await loadCom_({ code: content || "" });
  return (
    <>
      {MDXContent({
        components: gen_BlogHeader2({ path: pathName, _components: {} }),
      })}
    </>
  );
}
