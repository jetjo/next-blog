import { Root } from "mdast";
import { EXIT, visit } from "unist-util-visit";
import type { VFile } from 'vfile'

export function remarkAssertOrigin({ exportNameReg = /defAssertOrigin/ } = {}) {
    const srcResolver = [
        [/^(https?\:)?\/\/nextjs.org\/_next\/image$/, (src = '', nOrigin = '', myReg: RegExp, myself: (src: string, origin: string, ...args: any[]) => string) => {
            // const nOrigin = 'https://nextjs.org/_next/image'
            // return `${nOrigin}?url=${encodeURIComponent(src)}`
            // 解决如下异常:
            // 传递的srcSet属性中的所有地址都没有被引号包裹, 导致调用`run`方法时抛出`Error: Unexpected token ':'`异常,
            // 无法解析后面的`alt`属性, 不能识别`alt`后面的冒号
            /**
             * ```jsx
             * _jsx(Image, {
             * srcSet: [https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fserver-rendering-with-streaming.png, https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fserver-rendering-with-streaming.png],
             * alt: "Server Rendering with Streaming"
             *})
             * ```
             */
            const match = myReg.exec(nOrigin)!;
            return `"${match[1] ? '' : 'https:'}${nOrigin}?url=${encodeURIComponent(src)}"`
            // 解决: 400: BAD_REQUEST, Code: INVALID_IMAGE_OPTIMIZE_REQUEST
            // https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fterminology-component-tree.png&w=3840&q=75
            // return `"${nOrigin}?url=${encodeURIComponent(src)}&w=3480&q=75"`
        }],
        [/^(https?\:)?\/\//, (src = '', nOrigin = '', myReg: RegExp, myself: (src: string, origin: string, ...args: any[]) => string) => {
            try {
                if (URL.canParse(src)) {
                    console.warn(`${src}是绝对路径? 不需要预处理!`);
                    return src;
                }
                const match = myReg.exec(nOrigin)!;
                // console.dir({ match })
                const res = (new URL(src, match[1] ? nOrigin : 'https:' + nOrigin)).toString()
                console.log({ res });
                return res;

            } catch (error: any) {
                // NOTE: 我操你妈的逼, origin没有定义也不报错, 这个origin是全局的全局的那个origin吗???
                console.error(`${src}转换异常! origin: ${nOrigin}; ${error?.message}`);
                return src;
            }
        }]
    ] as const;

    const handleImage = (tree: Root, file: VFile, { exportsNode, origin }: { exportsNode: any; origin: string; }) => {
        console.log({ origin });
        const resolve = srcResolver.find(([reg, res]) => reg.test(origin)) // srcResolver[origin]
        if (!resolve) {
            console.warn(`mdx文件中没有导出${exportNameReg}!`)
            return;
        }
        const transformSrc = (src = '') => resolve[1](src, origin, resolve[0], resolve[1]);
        const reg = /^src([^a-z]|\b)|([^A-Z]|\b)Src([^a-z]|\b)/
        visit(tree, 'mdxJsxFlowElement', function (node) {
            if (node.name !== 'Image') return;
            node.attributes?.forEach((attr: any) => {
                if (attr.type !== 'mdxJsxAttribute') return;
                if (attr.name === 'srcSet') {
                    if (attr.value?.type !== 'mdxJsxAttributeValueExpression') return;
                    const srcList: string[] = []
                    attr.value.data?.estree?.body?.forEach((n: any) => {
                        if (n.type !== 'ExpressionStatement' || n.expression?.type !== 'ArrayExpression') return;
                        n.expression.elements?.forEach((e: any) => {
                            if (e.type !== 'Literal') return;
                            const newSrc = transformSrc(e.value)
                            srcList.push(newSrc);
                            e.value = newSrc;
                            e.raw = newSrc;
                        })
                    })
                    if (srcList.length) {
                        attr.value.value = JSON.stringify(srcList)
                    }
                    return; // 必须, 因为`srcSet`会通过后面的正则
                }
                if (!reg.test(attr.name)) return;
                attr.value = transformSrc(attr.value);
            })
        })
    }

    return function (tree: Root, file: VFile) {
        let setted = false;
        visit(tree, 'mdxjsEsm', (node: any) => {
            let origin;
            const exportsNode = node.data.estree.body.find(
                (node: any) => {
                    if (node.type !== 'ExportNamedDeclaration') return false;
                    if (node.declaration?.type !== 'VariableDeclaration') {
                        return node.specifiers?.find((s: any) => {
                            if (s.type !== 'ExportSpecifier') return false;
                            if (s.exported?.type !== 'Identifier') return false;
                            // 暂不支持, 因为无法获取值
                            console.warn('暂不支持的导出模式!');
                            return false; // exportNameReg.test(s.exported.name)
                        })
                    }
                    return node.declaration.declarations?.find((d: any) => {
                        if (d.type !== 'VariableDeclarator') return false;
                        if (d.id?.type !== 'Identifier') return false;
                        if (!exportNameReg.test(d.id.name)) return false;
                        if (d.init?.type !== 'Literal') return false;
                        return origin = d.init.value;
                    })
                },
            );
            if (exportsNode && origin) {
                if (!setted) {
                    handleImage(tree, file, { exportsNode, origin })
                    setted = true;
                }
                else {
                    throw new Error(`重复导出了${exportNameReg}!`)
                }
                // return EXIT;
            }
        })
    }
}
