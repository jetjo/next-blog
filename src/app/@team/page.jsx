const url = import.meta.url;

export default function Page() {
    return <div><a href={url} className="">@team: {url}</a></div>
}
