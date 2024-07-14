import clsx from "clsx"
import { cookies } from "next/headers"

export function Theme() {
    const theme = cookies().get('theme')?.value || 'light';
    return <div
        id={`-theme-flag___`}
        theme={`${theme}`}
        className={clsx(
            " overflow-hidden fixed left-0 right-0 top-0 bottom-0 -z-[9999999999999999999999999] pointer-events-none m-0 bg-[--body-bg]"
        )}
    ></div>
}