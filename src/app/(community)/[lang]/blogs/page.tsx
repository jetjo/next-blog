import BlogList from "../../components/blog-list";
import { getDictionary } from "@/i18n/dictionaries";
import Demo from "./_demos/三列响应式-最近文章列表";
import { AiOutlineHistory } from "react-icons/ai";

// export const revalidate = 3600 // revalidate the data at most every hour

export default async function Blogs({
  params: { lang, ...params },
}: {
  params: { lang: string };
}) {
  const dic = await getDictionary(lang);
  // console.log(dic, "dic", lang);
  return <Demo />;
  return <BlogList />;
}
