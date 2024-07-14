import Image from "next/image"
import placeholder from '@/components/picture-loading-failed-1.svg';
import clsx from "clsx";
import { _parseInt } from "utils/number.mjs";

export default function ImgPlaceholderCom({ alt, ...props }: { alt: string, width: any, height: any }) {
    // console.log({ props });
    // props.width = _parseInt(parseInt(props.width) * 1.55)
    // props.height = _parseInt(parseInt(props.height) * 1.55)
    return (
        <figure className={clsx(' rounded-md bg-[#F7F7F711] my-10 relative h-60 flex justify-center overflow-hidden')}>
            <Image alt={alt} {...props} src={placeholder} />
            <figcaption
                style={{ textShadow: '-1px -1px 4px #aaa' }}
                className={
                    clsx(
                        "absolute bottom-0 left-0 right-0 h-[33%]",
                        "text-center",
                        'text-center text-xl text-indigo-400',
                        "p-5"
                    )
                }
            >{alt}</figcaption>
        </figure>
    )
}
