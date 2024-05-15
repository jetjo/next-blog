import noContentImg from '@/assets/images/no-content.jpg'
import clsx from 'clsx';
import Image from 'next/image'

export function NoContent({ message, className }: { message: string, className: string }) {
    // console.log({ noContentImg });
    return (
        <div
            style={{ textShadow: '4px 4px 4px #aaa' }}
            className={clsx(className, 'text-center text-5xl text-indigo-400')}
        >
            {/* <Image src={noContentImg} alt={message}></Image> */}
            {message}
        </div>
    )
}