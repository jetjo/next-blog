"use client";

import { useEffect, useRef } from "react"
import clsx from "clsx"
import { getTheme, onDark } from "@/client/darkTheme";
import { nextFrame } from "@/client/utils";
import { _parseInt } from "@/utils/number";

function setupPlum(el: HTMLCanvasElement) {

    // setupTheme();

    const _ctx = el!.getContext('2d')!
    let ctx = _ctx;

    interface Point {
        x: number
        y: number
    }

    interface Branch {
        start: Point
        length: number
        theta: number
    }

    let ww = window.innerWidth; let wh = window.innerHeight;
    el.width = ww;
    el.height = wh;

    const getRandomPoint = (): Point => {
        if (Math.random() > .5) {
            const xOffset = _parseInt(Math.random() * ww / 16) * (Math.random() > .5 ? 1 : -1)
            const x = xOffset > 0 ? xOffset : xOffset + ww;
            const y = _parseInt(Math.random() * wh / 2 + wh / 2);
            return { x, y }
        }
        const yOffset = _parseInt(Math.random() * wh / 16);// * (Math.random() > .5 ? -1 : 1)
        const x = _parseInt(Math.random() * ww);
        const y = wh - yOffset;
        return { x, y }
    }

    const getBaseTheta = ({ x, y }: Point) => {
        if (x < ww / 2) {
            if (y < wh / 2) {
                return Math.PI / 4
            }
            return -Math.PI / 4
        }
        if (y < wh / 2) {
            return Math.PI * 3 / 4
        }
        return -Math.PI * 3 / 4
    }

    let strokeStyle = getTheme().theme === 'light' ? 'hsl(85 30% 85%)' : 'hsl(85 90% 85%)'; // 85 + 15 = 100!
    function init() {
        ctx ||= _ctx;
        ctx.strokeStyle = strokeStyle;

        const start = getRandomPoint();
        step({
            start,
            length: 10,
            theta: getBaseTheta(start),
        })
    }

    let pendingTasks: Function[] = []

    function step(b: Branch, depth = 0) {
        if (!ctx) return;
        const end = getEndPoint(b)
        drawBranch(b)

        if (depth < 4 || Math.random() < 0.5) {
            // console.log('1');

            pendingTasks.push(() => step({
                start: end,
                length: b.length + (Math.random() * 2 - 1),
                theta: b.theta - 0.2 * Math.random(),
            }, depth + 1))
        }
        if (depth < 4 || Math.random() < 0.5) {
            // console.log('2');

            pendingTasks.push(() => step({
                start: end,
                length: b.length + (Math.random() * 2 - 1),
                theta: b.theta + 0.2 * Math.random(),
            }, depth + 1))
        }
        // console.log(3);

    }

    function frame() {
        const tasks: Function[] = []
        pendingTasks = pendingTasks.filter((i) => {
            if (Math.random() > 0.4) {
                tasks.push(i)
                return false
            }
            return true
        })
        tasks.forEach(fn => fn())
    }

    let framesCount = 0
    function startFrame() {
        ctx && nextFrame(() => {
            // console.log('drawing~');

            framesCount += 1
            if (framesCount % 3 === 0)
                frame()
            ctx && startFrame()
        })
    }

    startFrame()

    function lineTo(p1: Point, p2: Point) {
        // console.log(p1, p2);

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
    }

    function getEndPoint(b: Branch): Point {
        return {
            x: b.start.x + b.length * Math.cos(b.theta),
            y: b.start.y + b.length * Math.sin(b.theta),
        }
    }

    function drawBranch(b: Branch) {
        lineTo(b.start, getEndPoint(b))
    }

    nextFrame(init)

    const restart = () => {
        ctx?.clearRect(0, 0, el.width, el.height);
        nextFrame(() => {
            ctx = null as any;
            nextFrame(() => {
                ctx = _ctx;
                pendingTasks.length = 0;
                framesCount = 0;
                startFrame()
                nextFrame(init)
            })
        })
    }

    const onWindowResize = (ev: UIEvent) => {
        ww = window.innerWidth
        wh = window.innerHeight
        el.width = ww;
        el.height = wh;
        restart()
    }

    let removeOnDark = onDark((_, { theme }) => {
        strokeStyle = theme === 'light' ? 'hsl(85 20% 90%)' : 'hsl(85 20% 10%)'; // 85 + 15 = 100!
        restart()
    })

    window.addEventListener('resize', onWindowResize)

    return () => {
        ctx = null as any;
        window.removeEventListener('resize', onWindowResize)
        removeOnDark();
    }

}

export default function Plum2() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        return setupPlum(canvasRef.current!)
    }, [])
    return (
        <div className={clsx(' overflow-hidden fixed left-0 right-0 top-0 bottom-0 -z-10  opacity-75 pointer-events-none print:hidden')}>
            <canvas ref={canvasRef} />
        </div>)
}