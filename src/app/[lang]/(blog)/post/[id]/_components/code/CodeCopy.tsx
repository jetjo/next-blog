///<reference lib="dom" />

"use client";

import { memo, useEffect, useState } from "react";
import { IoCopyOutline, IoCheckmarkSharp } from 'react-icons/io5'
import { CodeBlockInfo } from "./Pre";
import clsx from "clsx";

interface Prop {
    codeBlockInfo: CodeBlockInfo
}

type Stage = 'copy-scale-1' | 'copy-scale-0' | 'leave-copy' | 'enter-check' | 'check-scale-1' | 'check-scale-0' | 'leave-check' | 'enter-copy'


async function writeClipboardText(text = '') {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error: any) {
        console.error(error?.message || '复制失败');
        throw error;
    }
}

const CodeCopy = memo(function CodeCopy({ codeBlockInfo }: Prop) {
    // console.log(codeBlockInfo);

    // if (!codeBlockInfo?.block?.code) {
    //     console.error('没有接收到代码!');
    //     return null;
    // }

    const [stage, setStage] = useState<Stage>('copy-scale-1')

    const handleTransitionEnd = () => {
        if (stage === 'copy-scale-0') {
            setStage('enter-check')
            return;
        }
        if (stage === 'check-scale-1') {
            setStage('check-scale-0')
            return;
        }
        if (stage === 'check-scale-0') {
            setStage('enter-copy')
        }
    }

    useEffect(() => {
        // console.log('effect!');

        if (stage === 'enter-check') {
            setStage('check-scale-1')
            return;
        }
        if (stage === 'enter-copy') {
            setStage('copy-scale-1')
        }
    })
    if (!codeBlockInfo?.block?.code) {
        console.error('没有接收到代码!');
        return null;
    }
    return (
        <div className={clsx('hover:bg-white dark:hover:bg-gray-700', stage.includes('check') ? ' text-green-400' : '', ' p-1 rounded flex place-content-center place-items-center')}>
            <i
                style={{
                    display: 'inline-block',
                    transformOrigin: '50% 50% 0',
                    transitionDuration: stage.endsWith('-0') ?
                        (stage.includes('copy') ? '.1s' : '.3s') :
                        stage.endsWith('-1') ?
                            (stage.includes('copy') ? '.375s' : '1s') : '0s',
                    transitionDelay: stage === 'check-scale-0' ? '1s' : '0s'
                }}
                onClick={() => {
                    writeClipboardText(codeBlockInfo.block.code).then(() => {
                        setStage('copy-scale-0')
                    }).catch((e) => alert(e.massage))
                }}
                onTransitionEnd={handleTransitionEnd}
                className={clsx(
                    ' transition-all',
                    { ' scale-75 opacity-0': stage === 'copy-scale-0' },
                    { ' scale-25 opacity-0': stage === 'enter-check' },
                    { ' scale-x-125 opacity-100': stage === 'check-scale-1' },
                    { ' scale-75 opacity-0': stage === 'check-scale-0' },
                    { ' scale-75 opacity-75': stage === 'enter-copy' },
                    { ' scale-100 opacity-100': stage === 'copy-scale-1' }
                )}
            >
                {stage.includes('copy') ? <IoCopyOutline /> : <IoCheckmarkSharp />}
            </i>
        </div>)
})

export default CodeCopy;