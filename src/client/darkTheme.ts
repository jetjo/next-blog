import { docCookies } from "./cookie";
import { nextFrame } from "./utils";

export type Theme = 'light' | 'dark'

export type ThemeMode = Theme | 'normal'

/** 
 * 从`localStorage`获取当前生效的主题模式
 * @return {ThemeMode}
 * */
const readThemeModeFormStore = (): ThemeMode => {
  const themeFromCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/,
    "$1",
  );
  const theme = localStorage.getItem('theme') || themeFromCookie;
  if (theme === 'light') {
    return 'light'
  }
  if (theme === 'dark') {
    return 'dark'
  }
  return 'normal'
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie#%E7%A4%BA%E4%BE%8B_3_%E5%8F%AA%E6%89%A7%E8%A1%8C%E6%9F%90%E4%BA%8B%E4%B8%80%E6%AC%A1
const doOnceWhenLight = () => {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "dark") {
    alert("Do something here!");
    document.cookie = "theme=dark; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
  }
}

/**保存主题模式到`localStorage` */
const writeThemeModeToStore = (mode: ThemeMode) => {
  // console.log({ mode });
  // document.cookie = "theme=dark; MaxAge=-1; path=/"
  // docCookies.setItem('theme', '', -1, '/')
  // document.cookie = "theme=light; expires=Fri, 31 Dec 1970 00:00:00 GMT; path=/"

  if (mode === 'light') {
    // document.cookie = "theme=light; path=/"
    docCookies.setItem('theme', 'light', 60 * 60 * 24 * 1000, '/')
    // document.cookie = "theme=light; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"
    return localStorage.setItem('theme', 'light')
  }
  if (mode === 'dark') {
    // document.cookie = "theme=dark; path=/"
    docCookies.setItem('theme', 'dark', 60 * 60 * 24 * 1000, '/')
    // document.cookie = "theme=dark; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"
    return localStorage.setItem('theme', 'dark')
  }
  localStorage.setItem('theme', 'normal')
  // document.cookie = `theme=${getTheme().theme}; path=/`
  console.log('theme: ', getTheme().theme);

  // document.cookie = `theme=${getTheme().theme}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`
  docCookies.setItem('theme', getTheme().theme, 60 * 60 * 24 * 1000, '/')
  return;
}


const consumers: Set<any> = new Set()
const preConsumers: Set<any> = new Set()


/** 发布事件 */
const emitTheme = <T>(e?: T) => {
  preConsumers.forEach(c => c(e, getTheme(), e, 'pre'))
  nextFrame(() => consumers.forEach(c => c(e, getTheme(), e, 'post')))
}

let clean: any;
/**
 * 监听,\
 * @throw 首先检查`localStorage`中的主题模式, 如果不是`normal`(自动模式), 抛出异常\
 * 1、添加监听\
 * 2、设置`clean`函数
 */
const listen = () => {
  if (readThemeModeFormStore() !== 'normal') throw new Error('非自动模式不用监听系统主题!')
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", handler);
  clean = () => media.removeEventListener("change", handler);
}

/**
 * **自动**\
 * 系统的主题变化后的处理
 * @throws 首先检查`localStorage`中的主题模式, 如果不是`normal`(自动模式), 抛出异常\
 * 1、调用`clean`清除上一次的监听\
 * 2、调用`listen`函数重新监听\
 * 3、设置主题
 * 4、发布事件
 */
const handler = (e: MediaQueryListEvent) => {
  if (readThemeModeFormStore() !== 'normal') throw new Error('非自动模式不用监听系统主题!')
  // 此时是最早可以执行clean的时候
  clean && clean();
  listen();
  setThemeOnHtml(false, e.matches ? 'dark' : 'light', e);
  // // localStorage.setItem('theme', 'normal'); // 本该就是`normal`, 不用设置
  // emitTheme(e)
}

const setThemeOnHtml = <T>(isManual: boolean, mode?: ThemeMode, e?: T) => {
  const isMode = isManual;
  const theme_flag___ = document.getElementById('-theme-flag___')!
  if (mode === 'dark' || mode === 'light') {
    document.documentElement.setAttribute("theme", mode);
    theme_flag___.setAttribute("theme", mode);
    isMode && writeThemeModeToStore(mode)
  }
  else {
    // 到此, 一定是手动切换的, 自动切换时,只有`light`和`dark`
    if (!isManual) throw new Error('模式选择错误!')
    writeThemeModeToStore('normal');
    // document.documentElement.removeAttribute('theme')
    document.documentElement.setAttribute('theme', getTheme().theme)
    theme_flag___.setAttribute('theme', getTheme().theme)
  }
  emitTheme(e)
}

/** 
 * 获取当前生效的主题 
 * @return dark | light
 * */
export const getTheme = () => {
  const mode = readThemeModeFormStore();
  const theme = (mode === 'dark' || mode === 'light') ? mode : (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
  return { theme, mode } as { theme: Theme, mode: ThemeMode }
}

let setupFlag = false;
export const setupTheme = () => {
  // console.log('setupTheme');

  if (!setupFlag) {
    setupFlag = true;
    // 如果`localStorage`中的主题是`light`或`dark`, 则不监听, 
    // 否则, 监听
    // 手动切换为自动模式后再监听,
    // 手动切换回`light`或`dark`后撤销监听
    setThemeMode(readThemeModeFormStore())
  }
}

/**
 * **手动**\
 * 设置主题(模式) ,\
 * 并发布事件\
 * 只接受'normal' | 'light' | 'dark',\
 * 可以基于当前主题(可以调用`getTheme`获取)结合所需逻辑来决定设置为神马主题\
 * 第二个参数用于调用者识别自身,\
 * 因为设置主题会发布事件,\
 * 如果调用者也订阅了事件,可借助于第二个参数区别自身
 * */
export function setThemeMode<T>(themeMode: ThemeMode, e?: T) {
  if (themeMode === 'dark' || themeMode === 'light') {
    clean && clean()
    setThemeOnHtml(true, themeMode, e);
    return;
  }
  if (themeMode === 'normal') {
    // 执行顺序很重要, 先设置为自动模式, 才能监听
    // 先设置了主题, 才能发布事件
    setThemeOnHtml(true, 'normal', e);
    listen()
    return;
  }
  throw new Error(`不支持的主题模式:${themeMode}!`)
}

/**
 * **手动**\
 * 依次切换主题\
 * 函数自身选择下一个主题,然后调用`setTheme`\
 * 自动-》白天-》夜晚-》自动
 */
export function toggleThemeMode<T>(e?: T) {
  // console.log('切换主题模式!');

  const themeMode = localStorage.getItem('theme');
  if (themeMode === 'light') {
    setThemeMode('dark', e);
  } else if (themeMode === 'dark') {
    setThemeMode('normal', e)
  } else {
    setThemeMode('light', e)
  }
}

/** 订阅事件 */
export function onDark<T>(cb: (e: T, m: { theme: Theme, mode: ThemeMode }, ec: T, mode: any) => any, { mode }: { mode?: 'post' | 'pre' } | undefined = {}) {
  // cb.mode = mode || 'post';
  if (mode === 'pre') {
    preConsumers.add(cb)
    return () => preConsumers.delete(cb)
  }
  consumers.add(cb)
  return () => consumers.delete(cb)
}

// 期待的自定义属性
const props = () => ([
  "--main-nav-bg-color",
  "--common-border-color",
  "--code-header-bg",
  "--code-block-bg-color"
])

/**
 * 在文档中添加一条样式表规则（这可能是动态改变 class 名的更好的实现方法，
 * 使得 style 样式内容可以保留在真正的样式表中，以便添加额外的元素到 DOM 中）。
 * 注意这里有必要声明一个数组，因为 ECMAScript 不保证对象按预想的顺序遍历，
 * 并且 CSS 也是依赖于顺序的。
 * 类型为数组的参数 decls 接受一个 JSON 编译的数组。
 * @example
addStylesheetRules([
  ['h2', // 还接受第二个参数作为数组中的数组
    ['color', 'red'],
    ['background-color', 'green', true] // 'true' for !important rules
  ],
  ['.myClass',
    ['background-color', 'yellow']
  ]
]);
 */
function addStylesheetRules(decls: any) {
  var style = document.createElement("style");
  document.getElementsByTagName("head")[0].appendChild(style);
  // @ts-ignore
  if (!window.createPopup) {
    /* For Safari */
    style.appendChild(document.createTextNode(""));
  }
  var s = document.styleSheets[document.styleSheets.length - 1];
  for (var i = 0, dl = decls.length; i < dl; i++) {
    var j = 1,
      decl = decls[i],
      selector = decl[0],
      rulesStr = "";
    if (Object.prototype.toString.call(decl[1][0]) === "[object Array]") {
      decl = decl[1];
      j = 0;
    }
    for (var rl = decl.length; j < rl; j++) {
      var rule = decl[j];
      rulesStr +=
        rule[0] + ":" + rule[1] + (rule[2] ? " !important" : "") + ";\n";
    }

    if (s.insertRule) {
      const css = selector + "{" + rulesStr + "}"
      console.log({ css });
      s.insertRule(css, s.cssRules.length);
    } else {
      /* IE */
      s.addRule(selector, rulesStr, -1);
    }
  }
}


export default function genSetup() {
  const readThemeModeFormStoreStr = String(readThemeModeFormStore);
  const getThemeStr = String(getTheme);
  const setupTheme = () => {
    const theme = getTheme()
    const cssSelector = theme.theme === 'dark' ? ":root[theme=\"dark\"], :root:has(#-theme-flag___[theme=\"dark\"])"
      : ":root[theme=\"light\"], :root:has(#-theme-flag___[theme=\"light\"])"
    // ? "--root[theme=\"dark\"]" : "--root";
    // @ts-ignore
    const _style = [...document.styleSheets].map(r => r.cssRules).reduce((res: CSSRule[], cur: CSSRuleList) => res.concat([...cur]), []) as CSSStyleRule[]
    const style = _style.filter(r => (r).selectorText === cssSelector).map(s => s.style)
    if (!style.length) {
      // throw new Error(`没有找到以${cssSelector}为选择器的规则集!`)
      console.error(`没有找到以${cssSelector}为选择器的规则集!`);
    }

    const rules = style.reduce((res, cur) => {
      // console.log({ cur });
      for (const prop of props()) {
        if (!prop) continue;
        const r = cur.getPropertyValue(prop)
        r && (res[prop] = r)
      }
      return res;
    }, {} as Record<string, string>)

    if (Object.keys(rules).length === 0) console.error(`没有在选择器为${cssSelector}的规则集中找到期待的属性(${props().join(',')})!`);
    // throw new Error(`没有在选择器为${cssSelector}的规则集中找到期待的属性(${props().join(',')})!`)

    const rules1 = [":root ", "{\n"] as any[]
    const rules2 = [":root "] as any[]
    // // 无效
    // // Object.assign(document.documentElement.style, rules);
    for (const [key, value] of Object.entries(rules)) {
      console.log(key, value);
      // 无效
      // document.documentElement.style[key as any] = value;
      // document.body.style[key as any] = value;
      rules1.push(`${key}: ${value} !important;\n`)
      rules2.push([key, value, true])
    }
    rules1.push(' }');
    // const len = document.styleSheets.item(document.styleSheets.length - 1)?.cssRules.length || 0
    // document.styleSheets.item(document.styleSheets.length - 1)?.insertRule(rules1.join(''), len)
    // document.styleSheets.item(document.styleSheets.length - 1)?.replaceSync(rules1.join(''))
    // const stylesheet = new CSSStyleSheet();
    // stylesheet.replaceSync(rules1.join(''));

    // addStylesheetRules([rules2])
    // console.dir({ _style, rules, theme, rules1, state: document.readyState, rules2 })
  }
  const setupThemeStr = String(setupTheme)
  return `"use strict";\n
  const ${props.name} = ${String(props)};\n
  const ${readThemeModeFormStore.name} = ${readThemeModeFormStoreStr};\n
  const ${getTheme.name} = ${getThemeStr};\n
  ${String(addStylesheetRules)}\n
  (${setupThemeStr})();\n`
}
