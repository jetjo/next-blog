import clsx from "clsx";

export default function Table({ children }: any) {
    return <div className={clsx(' overflow-x-auto')}>
        <table className={clsx(' w-full table-auto')}>
            {children}
        </table>
    </div>
}