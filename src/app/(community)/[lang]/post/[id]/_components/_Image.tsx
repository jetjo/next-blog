"use client";

import { useLayoutEffect, useState } from "react";
import _Image from "next/image";
import clsx from "clsx";
import { onDark, getTheme } from "@/client/darkTheme";
import { nextFrame } from '@/client/utils'
import ImgPlaceholderCom from "@/components/ImgPlaceholder";

const reg = /^(['"`])(.*)\1$/
// 删除字符串开头和结尾的引号
const trimQuote = (str = '"') => str.replace(reg, '$2');

const imageLoader = ({ src, width, quality }: any) => {
  const url = new URL(src); // URL.canParse(src) ? new URL(src) : new URL(src, window.location.origin);
  if (!url.searchParams.has('w')) url.searchParams.append('w', width);
  if (!url.searchParams.has('q')) url.searchParams.append('q', quality || 75);
  return url.toString();
}

export default function Image({ srcLight, srcDark, src, ...props }: any) {
  srcLight && (srcLight = trimQuote(srcLight));
  srcDark && (srcDark = trimQuote(srcDark));
  src && (src = trimQuote(src))
  src ||= srcLight;
  if (!srcDark) {
    if (!URL.canParse(src)) return <ImgPlaceholderCom {...props} />
    return <_Image loader={imageLoader} src={src} priority={true} {...props} />;
  }
  // 重新渲染时, 传递的src被忽略
  const [themeSrc, setThemeSrc] = useState(src);
  const [preloadedThemeSrc, setPreloadThemeSrc] = useState(srcDark);
  // console.log('image rerender...', themeSrc);
  const [themeLoaded, setThemeLoaded] = useState(false)

  useLayoutEffect(() => {
    // console.log('image useLayoutEffect init~');
    let _theme = getTheme()?.theme;
    const nextSrc = () => _theme === 'dark' ? srcDark : (srcLight || src);
    setThemeSrc(nextSrc())
    // setPreloadThemeSrc(nextSrc())
    setThemeLoaded(true);
    // console.log('显示初始图片!', themeSrc); //此时的`themeSrc`还是旧值
    // console.log('显示初始图片!', _theme, nextSrc());

    const clean = onDark((_, { theme }, __, mode) => {
      if (theme === _theme) return;
      _theme = theme;
      // console.log('主题变更!', mode, theme, nextSrc());
      setThemeLoaded(false);
      setPreloadThemeSrc(nextSrc())
      // console.log('快速隐藏旧图!');
    }, { mode: 'pre' })
    return () => (clean(), void 0);
  }, [])

  if (!URL.canParse(preloadedThemeSrc) || !URL.canParse(themeSrc)) {
    return <ImgPlaceholderCom {...props} />
  }

  return <><_Image
    className={clsx('transition-opacity ease-in-out',
      themeLoaded ? ' duration-1000 opacity-100' : "  duration-500 opacity-0")}
    onTransitionEnd={() => {
      if (themeLoaded) {
        return;
      }
      setThemeSrc(preloadedThemeSrc)
      nextFrame(() => setThemeLoaded(true))
      // console.log(`缓慢显示新图!`);
    }}
    loader={imageLoader} src={themeSrc} priority={true} {...props}
  />
    <_Image
      className=" fixed right-0 bottom-0 opacity-0 -z-[999999999]"
      loader={imageLoader} src={preloadedThemeSrc} priority={true} {...props}
    />
  </>
}
