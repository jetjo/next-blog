"use client";

import clsx from "clsx";
import { Code } from "./Code";
import CodeTab, { genLangMap, matchActiveLangAtServer } from "./CodeTab";
import { useCallback, useMemo, useState } from "react";
import CodeCopy from "./CodeCopy";
import { allActiveLabels } from "@/langs";

export interface CodeBlockInfo { lang: string, filename: string, uuid: string, className: string, block: { code: string }, dynamicBlock: { code: string, html: string } }

function Pre({ preferGramLang = allActiveLabels, switcher, codeBlocks, children, hiddenForSwitcher, filenames = '', langs = '', uuids = '', codeClassNames = '', codeLenMax: _codeLenMax = 0, dynamicBlock, ...props }: any) {
  const codeLenMax = _codeLenMax;
  // console.log({ children, hiddenForSwitcher, filenames, langs, uuids, codeClassNames, switcher, ...props });

  if (hiddenForSwitcher) return null;
  // if (!uuids && !langs) return <pre pure-pre='true' {...props}>{children}</pre>
  const isNoLang = !uuids && !langs;
  if (!isNoLang && !langs) {
    // TODO: 使用uuid去数据库检索lang???
    // if (!filenames || !langs || !codeClassNames) {
    // console.log({ uuids, filenames, langs, codeClassNames, switcher, ...props });
    throw new Error("解析异常!");
  }

  const switcherContext = {} as any
  const lgs = langs.split(',')
  const files = filenames.split(',')
  const ids = uuids.split(',')
  const classNames = codeClassNames.split(';')
  lgs.forEach((lang: string, i: number) => {
    if (switcherContext[lang]) throw new Error('语言重复!')
    switcherContext[lang] = {
      lang, filename: files[i], uuid: ids[i], className: classNames[i],
      block: codeBlocks.find((b: any) => b.uuid === ids[i]) || dynamicBlock,
      // suffixEmptyLine: '\n'.repeat(Number(codeLenMax)-block.rowLen),
      // suffixEmptyLine: '<br />'.repeat(Number(codeLenMax) - block.rowLen)
    }
  })
  // !switcher && console.log({ children, hiddenForSwitcher, filenames, langs, uuids, codeClassNames, lgs, switcher, switcherContext, ...props });

  const langMap = useMemo(() => {
    return Object.freeze(genLangMap(lgs).map(r => Object.freeze(r)));// : Record<string, string> = {}
  }, [lgs])
  // console.log({ langMap }) // : genLangMap(lgs) });

  const preferLang = preferGramLang && matchActiveLangAtServer(lgs, preferGramLang, langMap);
  // console.log({ preferLang });

  const [block, setBlock] = useState(switcherContext[preferLang || lgs[0]]);
  const [isLoaded, setIsLoaded] = useState(!switcher)
  if (!block) {
    console.warn('未发现代码块!');
    return null;
  }

  // console.log({ block });


  const handleLangChange = useCallback((lang = '') => {
    // console.log({ lang });
    if (lgs.includes(lang)) {
      // lang !== block.lang && // 这样的话,需要把`block`加入依赖列表项, 否则此处的`block`不会更新, 但是如果依赖`block`, 会造成`handleLangChange`随着更新,进而需要重新渲染子组件, 没太必要
      setBlock(switcherContext[lang])
    } else {
      console.warn(`没有${lang}语言对应的代码块!`);
    }
    setIsLoaded(true);
  }, [setBlock, setIsLoaded])
  return (
    <div className={clsx({ " opacity-0": !isLoaded }, "relative transition-opacity my-4 rounded-lg overflow-hidden")}>
      {!isNoLang && <>
        <div className=" border-none overflow-y-hidden h-0 code-block-tab text-xl text-slate-500 dark:text-slate-200 p-0 border-b border-[--common-border-color] flex justify-between text-ellipsis bg-[--code-header-bg] items-center ">
          {/* <div className="inline-flex place-items-center gap-1 mr-auto min-w-0">
            <span className="hidden">{block.idx}</span> {programIcon[block.lang] || <BiFile />}
            <span className="filename inline-block overflow-hidden text-ellipsis whitespace-nowrap min-w-0 max-w-full ">{block.filename || block.lang}</span>
          </div> */}
          <div className="absolute right-3 bottom-3 inline-flex place-items-center gap-1">
            {/* 不能给`switcher`传递`curLang`作为`preferLang`的属性值, `curLang`是变化的 */}
            {switcher && <>
              <CodeTab preferLang={preferLang || lgs[0]} langMap={langMap} filename={filenames} onLangChange={handleLangChange} langs={lgs} />
              <i className=" w-px h-[.75em] border-x border-dashed border-[--common-border-color]"></i></>}
            <CodeCopy codeBlockInfo={block} />
          </div>
        </div>
        {/* <hr className="opacity-55 border-slate-400 dark:border-slate-100"></hr> */}
      </>}
      {isNoLang ?
        <pre pure-pre='true' {...props}>{children}</pre> :
        <pre><Code className={block.className} codeBlock={block.block} suffixEmptyLine={/**html */`<br /><span class="line opacity-0">&nbsp;</span>`.repeat(1 + Math.max(0, Number(codeLenMax) - (block.block?.rowLen || 0)))} /></pre>}
    </div>
  );
}

Pre.$__type = "Pre";

export { Pre };
