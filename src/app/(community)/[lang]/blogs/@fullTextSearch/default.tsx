// "use client";

import clsx from "clsx";
import { IoSearch } from "react-icons/io5";
import { MdOutlineSelectAll } from "react-icons/md";
import { FiDelete } from "react-icons/fi";

export default async function FullTextSearch() {
    // const [q, setQ] = useState('');
    return (<div className=" w-full">
        <form action="">
            <p className=" relative">
                <i className=" absolute top-3 left-5 w-5 h-5 text-4xl opacity-50"><IoSearch /></i>
                <i className=" absolute top-3 right-20 w-5 h-5 text-4xl opacity-50"><MdOutlineSelectAll /></i>
                <i className=" absolute top-3 right-10 w-5 h-5 text-4xl opacity-50"><FiDelete /></i>
                <input type="text" name="q" id="q"
                    placeholder="搜索文章、标签"
                    // onChange={(e) => {
                    //     // setQ(e.target.value)
                    // }}
                    className={clsx("form-input",
                        "w-full",
                        "bg-transparent",
                        "border-0",
                        "border-b",
                        "border-[color:var(--common-border-color)]",
                        " focus:ring-transparent",
                        "px-20"
                    )}
                />
            </p>
        </form>
    </div>)
}