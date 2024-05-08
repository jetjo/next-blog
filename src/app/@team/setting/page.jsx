const url = import.meta.url;

export default function Page() {
    return <div><a href={url} className="">@team/setting: {url}</a></div>
}
