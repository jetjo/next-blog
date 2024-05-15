
// @ts-check
import { writeFile } from 'fs/promises'
import _path, { fileURLToPath } from 'url'

const devopsLangs_ = [] as const;

const devopsLangs_$ = [
    ["CLI",
        [/^(sh|zsh|bash)$/i, "Bash", true, ['sh', 'zsh', 'bash']],
        [/^(bat|cmd)$/i, "Cmd", false, ['bat', 'cmd']],
        [/^ps1$/i, "PowerShell", false, ['ps1']]
    ]
] as const;

const programLangs_ = [
    /* // 暂不考虑复杂的类型切换  
    [/^([jt]sx?)$/i, ["Component", "React", ['js', 'jsx', 'tsx', 'ts']]],
      [/^vue$/i, ["Component", "Vue", ['vue']]],
      // 有重叠,无法区分
      // [/^([jt]sx?|m[jt]s)$/i, ["Component", "React", ['js', 'jsx', 'tsx', 'ts', 'mjs', 'mts']]],
      // [/^(vue|[jt]sx?|m[jt]s)$/i, ["Component", "Vue", ['vue', 'js', 'jsx', 'tsx', 'ts', 'mjs', 'mts']]],
      [/^(c[jt]s)$/i, ["Module", "CommonJS", ['cjs', 'cts']]],
      [/^(m[jt]s)$/i, ["Module", "ES", ['mjs', 'mts']]], */

    // [/^mdx?$/i, ["Comment", "MakeDown", ['md', 'mdx']]],// 没有切换语言的必要
    // [/^(z?sh|bat|ps[l1])$/i, ["DevOpsProgram", "Shell", ['sh', 'zsh', 'bat', 'ps', 'psl', 'ps1']]], // 需要进一步切换语言
    // [/^(jsonc?|ya?ml|toml|xml|csv)$/i, ["DevOpsConfigure", "SerializedTextData", ['json', 'jsonc', 'yaml', 'yml', 'toml', 'xml', 'csv']]], // 需要进一步切换语言
    // [/^sql$/i, ["Database", "SQL", ['mysql', 'postgresql', 'sqlite', 'microsoft-access', 'db2', 'oracle', 'sybase', 'berkeleyDB']]],// 没有切换语言的必要
    ...devopsLangs_
] as const

const programLangs_$ = [
    ["Program",
        [/^(jsx?|[mc]js)$/i, "Javascript", true, ['js', 'jsx', 'mjs', 'cjs']],
        [/^(tsx?|[mc]ts)$/i, "Typescript", false, ['ts', 'tsx', 'mts', 'cts']]
    ],
    ["Style",
        [/^css$/i, "CSS", true, ['css']],
        [/^less$/i, "Less", false, ['less']],
        [/^s[ac]ss$/i, "Sass", false, ['scss', 'sass']],
        [/^styl$/i, "Stylus", false, ['styl']]
    ],
    ["Template",
        [/^html?$/i, "HTML", true, ['html', 'htm']],
        [/^pug$/i, "Pug", false, ['pug']],
        [/^ejs$/i, "EJS", false, ['ejs']]
    ],
    ...devopsLangs_$
] as const

// console.log({ programLangs_$Map });
// const getLangInfo = (lang: Lang) => programLangs_$Map[lang];
let resetFlag = true;
; await (async () => {
    const envResetGramLang = process.env.resetGramLang;
    if (!envResetGramLang || !resetFlag) return;
    resetFlag = false;
    // console.log({ programLangs });

    const programLangs_$Map = programLangs_$.map(([type, ...tokens]) => {
        return (tokens as any).map(([reg, label, isActive, langs]) => {
            return langs.map(lang => {
                return {
                    [lang]: {
                        reg,
                        label,
                        type,
                        lang,
                        isActive
                    }
                } as const
            }).reduce((res, cur) => (Object.assign(res, cur), res))
        }).reduce((res, cur) => (Object.assign(res, cur), res))
    }).reduce((res, cur) => (Object.assign(res, cur), res))

    const programLabels_$Map = programLangs_$.map(([type, ...tokens]) => {
        const lm = programLangs_$Map
        return (tokens as any).map(([reg, label, isActive, langs]) => {
            return {
                [label]: {
                    reg,
                    label,
                    type,
                    langs,
                    langMap: langs.map(l => ({ [l]: lm[l] })).reduce((res, cur) => (Object.assign(res, cur), res)),
                    langArr: langs.map(l => (lm[l])),//.reduce((res, cur) => (Object.assign(res, cur), res)),
                    isActive
                }
            } as const
        }).reduce((res, cur) => (Object.assign(res, cur), res))
    }).reduce((res, cur) => (Object.assign(res, cur), res))

    const programTypes_$Map = programLangs_$.map(([type, ..._tokens]) => {
        const tokens: any[] = _tokens;
        const lm = programLabels_$Map
        return {
            [type]: {
                labels: tokens.map(t => t[1]),
                labelMap: tokens.map(([reg, label, isActive, langs]) => ({ [label]: lm[label] })).reduce((res, cur) => (Object.assign(res, cur), res)),
                labelArr: tokens.map(([reg, label, isActive, langs]) => (lm[label]))//.reduce((res, cur) => (Object.assign(res, cur), res))
            }
        } as const
    }).reduce((res, cur) => (Object.assign(res, cur), res))

    const programLangs = JSON.stringify(programLangs_$Map, (key, value) => key === 'reg' ? String(value) : value, 4).replaceAll(/\s"(.*)":\s/g, " $1: ").replaceAll(/\s"\/(.*)\/([dgimsuvy]*)"([,|\s])/g, ' /$1/$2$3');// "/^(bat|cmd)$/i" => /^(bat|cmd)$/i
    const programLabels = JSON.stringify(programLabels_$Map, (key, value) => key === 'reg' ? String(value) : value, 4).replaceAll(/\s"(.*)":\s/g, " $1: ").replaceAll(/\s"\/(.*)\/([dgimsuvy]*)"([,|\s])/g, ' /$1/$2$3');// "/^(bat|cmd)$/i" => /^(bat|cmd)$/i
    const programTypes = JSON.stringify(programTypes_$Map, (key, value) => value instanceof RegExp ? String(value) : value, 4).replaceAll(/\s"(.*)":\s/g, " $1: ").replaceAll(/\s"\/(.*)\/([dgimsuvy]*)"([,|\s])/g, ' /$1/$2$3');// "/^(bat|cmd)$/i" => /^(bat|cmd)$/i

    const allLangs = programLangs_$.map(([type, ...tokens]) => {
        const langGroups = (tokens as any).map(([reg, label, isActive, langs]) => langs)
        const langs = langGroups.flat()
        return langs;
    }).flat();

    const allLabels = programLangs_$.map(([type, ...tokens]) => {
        const labels = (tokens as any).map(([reg, label, isActive, langs]) => label)
        return labels;
    }).flat()

    const allType = programLangs_$.map(([type, ...tokens]) => type)

    const label1 = (label = '') => `${label}: programLabels['${label}'].langArr.find(l => l.isActive)?.lang!`

    const expression1 = `export const allLabelsLang = {\n\t${allLabels.map(l => label1(l)).join(',\n\t')}\n}`

    const type1 = (type = '') => `${type}: { activeLabel: programTypes['${type}'].labelArr.find(l => l.isActive)?.langArr.find(l => l.isActive) }`
    const expression2 = `export const allActiveLabels = {\n\t${allType.map(l => type1(l)).join(',\n\t')}\n}`

    const type2 = (type = '') => `${type}: { activeLabel: programTypes['${type}'].labelArr.find(l => l.isActive)?.label! }`
    const expression3 = `export const allTypesLabel = {\n\t${allType.map(l => type2(l)).join(',\n\t')}\n}`

    await writeFile(_path.resolve(fileURLToPath(import.meta.url),
        '../langs.ts'), `
const programLangs = (${programLangs} as const);\n
const programLabels = (${programLabels} as const);\n
const programTypes = (${programTypes} as const);\n
const allLangs = (${JSON.stringify(allLangs, null, 2)} as const);\n
const allLabels = (${JSON.stringify(allLabels, null, 2)} as const);\n
const allType = (${JSON.stringify(allType, null, 2)} as const);\n
export type Lang = keyof typeof programLangs;\n
${expression1};\n
export type AllLabelsLang = typeof allLabelsLang;\n
${expression2};\n
export type AllActiveLabels = typeof allActiveLabels;\n
${expression3};\n
export type AllTypesLabel = typeof allTypesLabel;\n
const getLangConf = (l:Lang) => (programLangs[l])
export type LangConf = Readonly<ReturnType<typeof getLangConf>>

export type Label = keyof typeof programLabels;\n
export type Type = keyof typeof programTypes;\n
export { programLangs, programLabels, programTypes, allLangs, allLabels, allType }\n`,
        'utf-8')
    console.warn('重新生成了lang.ts!');
    setTimeout(() => {
        resetFlag = true;
    }, 0);
})()

// export { programLangs }