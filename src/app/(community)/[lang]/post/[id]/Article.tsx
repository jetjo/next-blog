// "use client";

import type { FunctionComponent } from "react";
import type { AllActiveLabels } from "@/langs";
import type { MDXModule } from "utils/mdx/load.js";
import type { ICodeBlock } from "@db/blog-model/blog/index.js";

import MDXLayout from "./_MDXLayout";
import Image from "./_components/_Image";
import { Check, Cross } from "./_components/icons";
import { Code, Pre } from "./_components/code";
import Chart from "./_components/chart";
import { Math as _MathCom, MathParams } from './_components/math'
import Table from "./_components/Table";
import HLink from "./_components/HLink";
import { NoContent } from '@/components/no-content';

export const Article: FunctionComponent<{ ssrEntirely?: boolean, id: string, preferGramLang?: AllActiveLabels, MDXContent?: MDXModule['default'] | null, codeBlocks?: ICodeBlock[] }> = ({ ssrEntirely = false, preferGramLang, MDXContent, codeBlocks, id, ...props }) => {

  if (!MDXContent) return <NoContent className={" relative md:-right-4 lg:-right-8 xl:-right-10 "} message="文章加载失败了☹️!" />
  {/* https://unifiedjs.com/explore/package/@mdx-js/mdx/#notes */ }
  {/* https://mdxjs.com/packages/mdx/#notes */ }
  {/* 优化方案: https://nextjs.org/docs/pages/building-your-application/configuring/mdx#custom-elements */ }
  const NullCom = () => null;
  if (ssrEntirely) return (<MDXContent components={{
    "h-link": NullCom,
    img: NullCom,
    image: NullCom,
    svg: NullCom
  }}
  />)
  return (<MDXContent {...{
    name: 'Jetjo`s blog!',
    year: '2024',
    codeBlocks,
    ...MathParams,
    components: {
      wrapper: MDXLayout,
      Image,
      Check,
      Cross,
      code: Code,
      pre: ({ children, ...props }: any) => <Pre preferGramLang={preferGramLang} codeBlocks={codeBlocks} {...props}>{children}</Pre>,
      Chart,
      Math: _MathCom,
      table: Table,
      "h-link": HLink,
    }
  }} />);
}
