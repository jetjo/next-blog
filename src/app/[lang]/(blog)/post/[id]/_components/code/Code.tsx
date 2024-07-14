"use client";

import { useEffect, useRef } from "react";
import { throttle } from "lodash-es";
import { clsx } from "clsx";
import { nextFrame } from "@/utils/client/utils";

// const isCodeBlock = (className = "") => className.includes("language-"); //`remark-math`插件包导致包含`language-`的`code`也可能位于`p`中

const getCode = (__context: any) => {
  const idx = __context.codeIdx || 0;
  __context.codeIdx = idx + 1;
  const block = __context.codeBlocks[idx];

  if (block?.idx !== idx) {
    console.error("code block idx not match", { block, idx });
  }
  return block;
};

function Code({ children, className, codeBlock, suffixEmptyLine = '', codeBlocks, __context }: any) {
  //   const language = className?.replace(/language-/, "") || "";
  const isCodeBlock = !!codeBlock; //!children; //!!__context; //isCodeBlock(clsx(className));
  if (!isCodeBlock) {
    return children ? <code className={clsx(className)}>{children}</code> : null;
  }

  const { html, idx = null, code, codeAsHtml } = codeBlock;// getCode(__context) //block||{}

  const codeIdxEle = isCodeBlock ? <>{/* {idx} <br /> */}</> : null;

  const codeRef = useRef<HTMLElement>(null)

  // useEffect(() => {
  //   const resizeHandler = () => {
  //     nextFrame(() => {
  //       if (!codeRef.current) {
  //         console.error('没有获取到code元素的引用!');
  //         return;
  //       }
  //       const { width, height } = codeRef.current.getBoundingClientRect();
  //       nextFrame(() => {
  //         codeRef.current!.style.width = `${Math.ceil(width)}px`;
  //         codeRef.current!.style.height = `${Math.ceil(height)}px`;
  //       })
  //     })
  //   }
  //   const handler = throttle(resizeHandler, 100, { leading: true, trailing: true })
  //   window.addEventListener('resize', handler)
  //   window.addEventListener('zoom', handler)
  //   resizeHandler()
  //   return () => (window.removeEventListener('zoom', handler), window.removeEventListener('resize', handler), void 0)
  // }, [])

  return (
    <>
      {codeIdxEle}
      <code
        ref={codeRef}
        className={clsx(
          className,
          " origin-top-left w-full inline-block p-[1em] pt-3 pb-5 overflow-y-hidden overflow-x-auto"
        )}
        dangerouslySetInnerHTML={{ __html: html + suffixEmptyLine }}
      ></code>
    </>
  );
}

Code.$__type = "Code";

export { Code };

// export default Code;
