const url = import.meta.url;

export default function Page() {
    return <div><a href={url} className="">@analytics: {url}</a></div>
}
