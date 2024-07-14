export default async function Layout({ children }) {
    return (
        <h1 className=" text-3xl font-black tracking-tight text-[color:var(--foreground-h2)] sm:text-4xl flex items-center gap-2 ">
            {children}
        </h1>
    )
}