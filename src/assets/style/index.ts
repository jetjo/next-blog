import "./globals.css";
// import '@wooorm/starry-night/style/core'
// import '@wooorm/starry-night/style/both'
import "./code/base.css"
import "./code/light.css"
import "./code/dark.css"
import './katex.css'
import './dialog.css'
import { _parseInt } from "utils/number.js";

const hues: number[] = []

for (let i = 0; i < 90; i++) {
    if (i % 8 === 0) {
        hues.push(_parseInt((1 - (Math.random() / 3)) * 45 + 15))
        continue;
    }
    if (i % 4 === 0) {
        hues.push(_parseInt((1 / 3 + Math.random() / 3) * 45 + 15))
        continue;
    }
    if (i % 2 === 0) {
        hues.push(_parseInt((Math.random() / 3) * 45 + 15))
        continue;
    }
    hues.push(hues[i - 1] + 180)
}


// const whitenessLight = '0%'
// const blacknessLight = '15%'
const whitenessLight = '0%'
const blacknessLight = '25%'
// const whitenessLight = '30%'
// const blacknessLight = '15%'
const saturationLight = '65%'
const lightnessLight = '58%'

const whitenessDark = '5%'
const blacknessDark = '10%'
const saturationDark = '100%'
const lightnessDark = '30%'

export const hwbLights: string[] = hues.map(h => `hwb(${h}deg ${whitenessLight} ${blacknessLight})`)
export const hslLights: string[] = hues.map(h => `hsl(${h}deg ${saturationLight} ${lightnessLight})`)

export const hwbDarks: string[] = hues.map(h => `hwb(${h}deg ${whitenessDark} ${blacknessDark})`)
export const hslDarks: string[] = hues.map(h => `hsl(${h}deg ${saturationDark} ${lightnessDark})`)