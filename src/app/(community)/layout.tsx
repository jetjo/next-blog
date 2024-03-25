import Nav from "./components/Nav";

export default function Layout(props: any) {
  return (
    <main className="min-h-screen px-7 pb-10 of-x-hidden">
      <header>
        {/* {props.nav} */}
        <Nav />
      </header>

      <section>{props.children}</section>

      <footer></footer>
    </main>
  );
}
