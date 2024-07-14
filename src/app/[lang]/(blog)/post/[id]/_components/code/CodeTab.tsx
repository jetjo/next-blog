"use client";

import { memo, useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri'
import { throttle } from 'lodash-es'
import clsx from 'clsx';
// #region Icons
// import { MdTypeSpecimen, MdJavascript, MdHtml, MdCss } from "react-icons/md";
import {
    BiLogoTypescript,
    BiLogoJavascript,
    BiLogoHtml5,
    BiLogoCss3,
    BiLogoVuejs,
    BiLogoReact,
    BiLogoSass,
    BiLogoTailwindCss,
    BiLogoNodejs,
    BiLogoMarkdown,
    BiTerminal,
    BiSolidTerminal,
    BiLogoLess,
} from "react-icons/bi";
import { SiPug, SiReadme, SiStylus, SiJavascript, SiTypescript } from 'react-icons/si';
import { PiDatabase, PiFileSql } from 'react-icons/pi';
import { GrDocumentConfig, GrReactjs } from 'react-icons/gr';
import { IoLogoJavascript, IoLogoWebComponent } from "react-icons/io5";
import { MdViewModule, MdStyle } from "react-icons/md";
import { CgTemplate } from 'react-icons/cg';
import { VscTerminalBash, VscTerminalCmd, VscTerminalPowershell } from "react-icons/vsc";
// #endregion
import { docCookies } from "@/utils/client/cookie";
import { nextFrame } from '@/utils/client/utils';
import { programLangs, allLangs } from "@/langs";
import type { AllActiveLabels, Lang, LangConf } from "@/langs";
import { _parseInt } from 'utils/number.mjs';

const devopsLabelIcon = {
    bash: <VscTerminalBash />,
    cmd: <VscTerminalCmd />,
    powershell: <VscTerminalPowershell />
}

const programLabelIcon = {
    react: <GrReactjs />,
    vue: <BiLogoVuejs />,
    javascript: <SiJavascript />,
    typescript: <SiTypescript />,
    css: <BiLogoCss3 />,
    less: <BiLogoLess />,
    sass: <BiLogoSass />,
    stylus: <SiStylus />,
    html: <BiLogoHtml5 />,
    pug: <SiPug />,
    markdown: <BiLogoMarkdown />,
    shell: <BiTerminal />,
    sql: <PiFileSql />,
    ...devopsLabelIcon
}

const programCategoryIcon = {
    component: <IoLogoWebComponent />,
    module: <MdViewModule />,
    style: <MdStyle />,
    template: <CgTemplate />,
    comment: <SiReadme />,
    devopsconfigure: <GrDocumentConfig />,
    database: <PiDatabase />
}

const programIcon: any = {
    js: <BiLogoJavascript />,
    jsx: <BiLogoJavascript />,
    javascript: <BiLogoJavascript />,
    html: <BiLogoHtml5 />,
    css: <BiLogoCss3 />,
    md: <BiLogoMarkdown />,
    ts: <BiLogoTypescript />,
    tsx: <BiLogoTypescript />,
    typescript: <BiLogoTypescript />,
    vue: <BiLogoVuejs />,
    react: <BiLogoReact />,
    sass: <BiLogoSass />,
    tailwind: <BiLogoTailwindCss />,
    node: <BiLogoNodejs />,
    markdown: <BiLogoMarkdown />,
    bash: <BiSolidTerminal />,
    zsh: <BiSolidTerminal />,
    json: <BiLogoJavascript />,
    mdx: <BiLogoMarkdown />
};

const getIcon = (lang?: LangConf) => {
    if (!lang) return '';
    const labelIcon = (programLabelIcon as any)[lang.label.toLowerCase()]
    if (labelIcon) return labelIcon;
    const icon = (programIcon as any)[lang.lang]
    if (icon) return icon
    return lang.lang
}

export function genLangMap<T extends typeof allLangs>(langs: T, curLang?: Lang) {
    const res = [] as LangConf[]
    for (const lang of langs) {
        const conf = { ...programLangs[lang] }
        if (!conf) throw new Error(`没有找到语言${lang}的配置信息!`)
        if (!res.every(c => c.type === conf.type)) throw new Error(`语言列表[${langs.join(',')}]内的语言不兼容!`)
        if (res.some(c => c.label === conf.label)) console.warn(`语言列表[${langs.join(',')}]内的语言有重复!`);
        conf.isActive = conf.lang === curLang
        res.push(conf);
    }
    return res;
}

interface OnEvent<E extends Event> {
    (e?: E, currentTarget?: EventTarget | null): void
    // (e?: E, currentTarget?: EventTarget): void
    handle?: (e?: E) => void;
    on?: boolean
}

interface OnScroll<E extends Event> extends OnEvent<E> {
    range?: [number, number]
    posWhenShow?: number
}

interface Prop {
    onLangChange?: (lang: string) => void;
    readonly langMap?: Readonly<LangConf[]>; //Record<string, string>
    // _langMap?: any;
    filename?: string;
    langs?: string[];
    preferLang: string;
}


const denyE = (e: any) => {
    e.preventDefault();
    e.stopPropagation()
}

let isShow = false;
let onHidden = () => void 0;
let onShow = (pos: Partial<CSSStyleDeclaration>) => void 0;

const onStatePop: OnEvent<Event> = (e) => {
    onStatePop.handle && onStatePop.handle()
}

const onDocClick: OnEvent<MouseEvent> = (e) => {
    if (!isShow) return;
    onHidden()
    isShow = false;
}

let onScroll = (offsetY = 0) => void 0;
const _____onScroll: OnScroll<Event> = function (e) {
    if (!isShow) return;
    const offsetY = _____onScroll.posWhenShow! - window.scrollY
    const [min, max] = _____onScroll.range || [1, 0];
    if (offsetY > max || offsetY < min) {
        onHidden();
        isShow = false;
        return;
    }
    onScroll(offsetY);
}

const showCodeLangSwitcher: OnEvent<MouseEvent> & { switcherPos?: Partial<CSSStyleDeclaration> } & { langMap?: LangConf[]; } = (e, tab) => {
    if (!e) throw new Error('没获取到事件对象!')
    denyE(e)
    const tabRect = (tab as Element).getBoundingClientRect();
    // NOTE: 这里的`position: 'fixed'`应该提前在模版jsx中设置好, 否则, 否则会导致其父元素抖动
    const switcherPos = { position: 'fixed', left: _parseInt(tabRect.x) + 'px' } as Partial<CSSStyleDeclaration>
    if (window.innerHeight - tabRect.top > tabRect.bottom) {
        switcherPos.top = _parseInt(tabRect.top) + 'px'
    } else {
        switcherPos.bottom = _parseInt(window.innerHeight - tabRect.bottom) + 'px'
    }
    _____onScroll.range = [-1 * parseInt(e.clientY + '') + 10, window.innerHeight - parseInt(e.clientY + '') - 20]
    _____onScroll.posWhenShow = _parseInt(window.scrollY)
    // return switcherPos
    onShow(switcherPos);
    isShow = true;
}



const _onScroll = throttle(_____onScroll, 30, { leading: true, trailing: true })
const setupSwitcher = () => {
    window.addEventListener('click', onDocClick)
    window.addEventListener('scroll', _onScroll, { passive: true })
}

let langChangeHandlerCounter = 0;
const destroySwitcher = () => {
    window.removeEventListener('click', onDocClick);
    window.removeEventListener('scroll', _onScroll);
    langChangeHandlers.length = 0;
    onHidden = null as any;
    onScroll = null as any;
    onShow = null as any;
    showCodeLangSwitcher.langMap = undefined;
    // showCodeLangSwitcher._langMap = undefined;
    onStatePop.on = false;
    langChangeHandlerCounter = 0;
}

const RegExpS = {
    serialize(reg: RegExp, toStr = false) {
        const m = /^\/(.*?)\/([dgimsuvy]*)$/
        const [, ...res] = reg.toString().match(m) || []
        // console.log({ res, m, reg: reg, toString });
        // console.log(JSON.stringify(res));
        return toStr ? JSON.stringify(res) : res;
    },
    /** */
    deserialize(input: string | string[], isStr = false) {
        if (typeof input === 'string') {
            // if (isStr) {
            input = JSON.parse(input)
        }
        return new RegExp(...input as [string, string])
    }
}

const storeLang = (lang: LangConf) => {
    const l = { ...lang };
    const type = lang.type;
    l.isActive = true;
    const nL = { [type]: { activeLabel: l } }
    const curLangStr = localStorage.getItem('codeLang') || '{}';
    let curLangs = JSON.parse(curLangStr)
    if (typeof curLangs !== 'object' || Array.isArray(curLangs)) {
        console.warn(`localStorage.curLang不是对象类型!`);
        curLangs = {}
    }
    Object.assign(curLangs, nL)
    // console.log({ curLangs });
    // const cl = JSON.stringify(curLangs, (_, value) => value instanceof RegExp ? value.toString().replace(/^\/(.*)\/$/, '$1') : value);
    const cl = JSON.stringify(curLangs, (_, value) => value instanceof RegExp ? RegExpS.serialize(value) : value);
    localStorage.setItem('codeLang', cl);
    docCookies.setItem('preferGramLang', cl, 60 * 60 * 24 * 1000, '/');
}

const genSwitcherOptions = (langMap: Readonly<LangConf[]>, curLang = 'js') => langMap.map(l => {
    const r = { ...l }
    if (l.lang === curLang) {
        r.isActive = true;
    } else r.isActive = false;
    return r;
})

const langChangeHandlers = [] as ((lang: LangConf) => void)[]; // new Set<(lang: string) => void>()

const findLang = (lang: LangConf, langMap: Readonly<LangConf[]>) => {
    // console.log({ lang, langMap });

    if (lang.type !== langMap[0].type) {
        return null
    }
    return langMap.find(l => l.label === lang.label)?.lang;
}

export const matchActiveLang = (langs: string[], preferGramLang?: AllActiveLabels, langMap?: Readonly<LangConf[]>) => {
    // console.log({ preferGramLang });

    if (!preferGramLang) {
        preferGramLang = JSON.parse(localStorage.getItem('codeLang') || '{}')
    }
    if (!preferGramLang) return langs[0]
    // console.log({ preferGramLang });
    langMap ||= genLangMap(langs as any)
    if (!langMap.length) return langs[0]
    const type = langMap[0].type
    const lb = preferGramLang[type]
    if (!lb || !lb.activeLabel) return langs[0]
    const l = langMap.find((l) => l.label === lb.activeLabel?.label)?.lang
    return l || langs[0];
}
export const matchActiveLangAtServer = (langs: string[], preferGramLang: AllActiveLabels, langMap?: Readonly<LangConf[]>) => {
    return matchActiveLang(langs, preferGramLang, langMap)
}

const CodeTab = memo(function CodeTab({ onLangChange, preferLang, langMap, filename, langs = [] }: Prop) {
    if (!langMap || !Object.keys(langMap).length) {
        console.warn('未提供可选语言列表!');
        return null;
    }
    // langMap = langMap.map(lang => ({ ...lang })) // NOTE: 浅复制, 没有使用JSON..., 因为有正则类型的成员
    const [showSwitcher, toggleSwitcherVisible] = useState(false);
    const switcher = useRef<HTMLDivElement>(null)
    const tab = useRef<HTMLDivElement>(null)
    const [langMap_, setLangMap] = useState<LangConf[]>()

    const [curLang, setCurLang] = useState(preferLang)
    const [handleIdx, setHandleIdx] = useState(-1)

    useEffect(() => {
        if (handleIdx === -1) return;
        // console.log({ handleIdx });
        langChangeHandlers[handleIdx] = (lang: LangConf) => {
            const l = findLang(lang, langMap)
            if (!l) {
                console.warn('不兼容的语言!', { lang, langMap, filename });
                return;
            }
            setCurLang(l)
            onLangChange && onLangChange(l)
        }
    }, [setCurLang, onLangChange, langMap, handleIdx])

    useEffect(() => {
        // console.log({ langs });
        const l = matchActiveLang(langs, undefined, langMap);
        if (curLang !== l) {
            setCurLang(l)
        }
        onLangChange && onLangChange(l)
        setHandleIdx(langChangeHandlerCounter++)
        if (!onStatePop.on) {
            // console.error('添加!');
            onStatePop.on = true;
            onHidden = () => {
                Object.assign(switcher.current!.style, { opacity: 0 })
                nextFrame(() => toggleSwitcherVisible(false))
            }
            onScroll = (offsetY) => {
                switcher.current!.style.transform = `translate3d(0,${offsetY}px,0)`
            }

            onShow = (pos) => {
                setLangMap(showCodeLangSwitcher.langMap!)
                toggleSwitcherVisible(true)
                nextFrame(() => {
                    Object.assign(switcher.current!.style, { top: 'auto', bottom: 'auto', transform: 'none', opacity: 1 }, pos)
                })
            }

            setupSwitcher()

            return () => {
                destroySwitcher()
                langChangeHandlers.length = 0
                onHidden = null as any;
                onScroll = null as any;
                onShow = null as any;
                showCodeLangSwitcher.langMap = undefined;
                // showCodeLangSwitcher._langMap = undefined;
                onStatePop.on = false;
                langChangeHandlerCounter = 0;
            }
        }
    }, [])

    return (
        <>
            <div ref={tab}
                onClick={(e) => {
                    // showCodeLangSwitcher._langMap = langMap; // 含有RegExp类型的成员, 不特殊处理会变为字符串, JSON.parse(JSON.stringify(langMap));
                    showCodeLangSwitcher.langMap = genSwitcherOptions(langMap, curLang)
                    showCodeLangSwitcher(e.nativeEvent, tab.current)
                }}
                className=" not-prose inline-flex ml-1 place-items-start place-content-center list-none relative"
            >
                <button type="button" className=' text-[length:inherit] rounded-sm px-1 inline-flex items-center gap-0.5 ' >{getIcon(langMap.find(l => l.lang === curLang))} <RiArrowDownSLine /></button>
            </div>
            {/* NOTE: 这里的`position: 'fixed'`应该提前在模版jsx中设置好, 否则, 否则会导致其父元素抖动 */}
            {showSwitcher && <div ref={switcher} className=' border border-[color:var(--common-border-color)] bg-white dark:bg-black fixed z-[999999] opacity-0 transition-opacity not-prose rounded-md overflow-hidden p-0 '>
                <ul className='overflow-hidden border-0 p-[2px] flex flex-col list-none items-stretch'>
                    {langMap_ && langMap_.map((lang) => (
                        <li onClick={() => {
                            // 没太必要, 当事件冒泡到window时会隐藏菜单
                            // showCodeLangSwitcher.langMap = genSwitcherOptions(showCodeLangSwitcher._langMap, value)
                            // setLangMap(showCodeLangSwitcher.langMap!)
                            storeLang(lang);
                            langChangeHandlers.forEach(h => h(lang))
                        }}
                            className={clsx(
                                ' overflow-hidden text-center cursor-pointer px-4 py-3 transition-colors border-b  border-[color:var(--common-border-color)] last:border-b-0 border-t-0 first:rounded-t last:rounded-b ',
                                { ' outline-double -outline-offset-8 outline-8 outline-amber-200 dark:outline-indigo-400': lang.isActive },
                                { ' hover:text-amber-400 dark:hover:text-violet-500 ': !lang.isActive },
                            )}
                            key={lang.lang}
                        >{lang.label}</li>))}
                </ul>
            </div>}
        </>
    )
})

export default CodeTab;
