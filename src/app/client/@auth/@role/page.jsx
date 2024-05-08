"use client";

const url = import.meta.url;

export default function Page() {
    return <div><a href={url} className="">@auth/@role: {url}</a></div>
}
