const url = import.meta.url;

/**
 * @file src/app/%40analytics/default.jsx
 */
export default function Page() {
    console.log('reload', url);
    return <div><a href={url} className="">@user/default: {url}</a></div>
}
