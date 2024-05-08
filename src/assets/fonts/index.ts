// import { Inter, Lora, Source_Sans_3 } from 'next/font/google'
import localFont from 'next/font/local'
// import interFont from './Inter/fonts.json'
// import robotFont from './Roboto_Mono/fonts.json'

// // define your variable fonts
// const inter = Inter()
// const lora = Lora()
// // define 2 weights of a non-variable font
// const sourceCodePro400 = Source_Sans_3({ weight: '400' })
// const sourceCodePro700 = Source_Sans_3({ weight: '700' })

const inter = localFont({
    src: [
        {
            // NOTE: 千万不能写成如下: 
            // 否则报错: × Unexpected object key type
            // 我草泥马, 属性名不能放在引号内???
            // "path": "./Inter/static/Inter-Medium.ttf",
            // path: "./Inter/static/Inter-Medium.ttf"
            path: "./Inter/Inter-VariableFont_slnt,wght.ttf"
        },
        // {
        //     path: "./Inter/static/Inter-Light.ttf"
        // },
        // {
        //     path: "./Inter/static/Inter-Thin.ttf"
        // },
        // {
        //     path: "./Inter/static/Inter-Bold.ttf"
        // },
        // {
        //     path: "./Inter/static/Inter-Regular.ttf"
        // },
        // {
        //     path: "./Inter/static/Inter-ExtraBold.ttf"
        // },
        // {
        //     path: "./Inter/static/Inter-ExtraLight.ttf"
        // },
        // {
        //     path: "./Inter/static/Inter-Black.ttf"
        // },
        // {
        //     path: "./Inter/static/Inter-SemiBold.ttf"
        // }
    ],
    display: 'swap',
    variable: '--font-inter'
});
const robotMono = localFont({
    src: [
        {
            // path: "./Roboto_Mono/static/RobotoMono-Medium.ttf"
            path: "./Roboto_Mono/RobotoMono-VariableFont_wght.ttf",
            style: "normal"
        },
        {
            path: "./Roboto_Mono/RobotoMono-Italic-VariableFont_wght.ttf",
            style: "italic"
        },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-SemiBold.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-SemiBoldItalic.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-Regular.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-LightItalic.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-BoldItalic.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-ExtraLight.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-ThinItalic.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-ExtraLightItalic.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-Light.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-MediumItalic.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-Bold.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-Italic.ttf"
        // },
        // {
        //     path: "./Roboto_Mono/static/RobotoMono-Thin.ttf"
        // }
    ],
    display: 'swap',
    variable: '--font-robot-mono'
});

const notoSansSC = localFont({
    src: [
        {
            path: "./Noto_Sans_SC/static/NotoSansSC-Regular.ttf",
            weight: "400",
            style: "normal"
        },
        {
            path: "Noto_Sans_SC/static/NotoSansSC-Medium.ttf",
            weight: "500",
            style: "normal"
        },
        {
            path: "Noto_Sans_SC/static/NotoSansSC-SemiBold.ttf",
            weight: "600",
            style: "normal"
        },
        {
            path: "Noto_Sans_SC/static/NotoSansSC-Bold.ttf",
            weight: "700",
            style: "normal"
        },
        // {
        //     path: "Noto_Sans_SC/static/NotoSansSC-ExtraBold.ttf",
        //     weight: "800",
        //     style: "normal"
        // },
    ],
    display: 'swap',
    variable: '--font-noto-sans-sc'
});

const notoSans = localFont({
    src: [
        {
            path: "Noto_Sans/static/NotoSans_SemiCondensed-Regular.ttf",
            weight: "400",
            style: "normal"
        },
        {
            path: "Noto_Sans/static/NotoSans_SemiCondensed-Medium.ttf",
            weight: "500",
            style: "normal"
        },
        {
            path: "Noto_Sans/static/NotoSans_SemiCondensed-SemiBold.ttf",
            weight: "600",
            style: "normal"
        },
        // {
        //     path: "Noto_Sans/static/NotoSans_SemiCondensed-Bold.ttf",
        //     weight: "700",
        //     style: "normal"
        // },
        {
            path: "Noto_Sans/static/NotoSans_SemiCondensed-ExtraBold.ttf",
            weight: "800",
            style: "normal"
        },
    ],
    display: 'swap',
    variable: '--font-noto-sans'
});

export { inter, robotMono, notoSansSC, notoSans }
