import { dir } from "console";
import { redirect } from "next/navigation";

async function fetchTeam(id = "") {
  // 在服务端执行, 客户端浏览器控制台看不到
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) return undefined;
  const data = await res.json();
  // dir(data);
  return data;
}

export default async function Profile(props: any) {
  console.log(props.params, "Profile");
  const {
    params: { id = "" },
  } = props;
  const team = await fetchTeam(id);
  //   `redirect`用于在渲染过程中,创建`307临时重定向响应`, 重定向到指定的`URL`
  //   `redirect`会在内部抛出异常, 这种异常需要在生成`HttpResponse`的过程中被进一步处理,因此不能在`try/catch`中使用
  if (!team) redirect("/login");
  //   if (!team) return <pre>Not found :{JSON.stringify(props, null, 3)}</pre>;
  return (
    <div>
      <h1>{team.name}</h1>
      <pre>{JSON.stringify(team.company, null, 2)}</pre>
    </div>
  );
}
