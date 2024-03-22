export default function Layout(props: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col p-24">
      <section>{props.children}</section>
    </main>
  );
}
