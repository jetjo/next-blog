"use client";

import { useEffect, useRef } from "react"
import clsx from "clsx"
import { getTheme, onDark } from "@/client/darkTheme";
import { nextFrame } from "@/client/utils";
import { _parseInt } from "utils/number.mjs";
import { throttle } from "lodash-es";

class Branch {
    static ctx?: CanvasRenderingContext2D
    start!: Point
    length!: number
    theta!: number
    /**起始值0 */
    depth!: number

    constructor({ mode, start, preBranch, radianOffset }: { mode: 'init' | 'bTree', start: Point, preBranch?: Branch, radianOffset?: -0.2 | 0.2 }) {
        if (mode === 'init') {
            Object.assign(this, start);
            this.start = start;
            this.length = 10;
        } else if (mode === 'bTree') {
            const { length, depth, theta } = preBranch!;
            this.start = start;
            this.length = length + (Math.random() * 2 - 1);
            this.theta = theta + radianOffset! * Math.random();
            this.depth = depth + 1;
        }
    }


    static lineTo(start: Point, end: Point) {
        // console.log(p1, p2);
        const ctx = Branch.ctx;
        if (!ctx) return;
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }

    static drawBranch(branch: Branch, path: Path) {
        const end = new Point({ mode: "endpoint", branch: branch })
        Branch.lineTo(branch.start, end)
        branch.start.depth = branch.depth;
        branch.start.theta = branch.theta;
        path.endPoints.push(end)
        path.pointsLens++
        path.maxDepth = Math.max(path.maxDepth, branch.depth)
        return end;
    }

}

class Point {
    static ctx = { ww: 100, wh: 100, isDarkMode: false }
    x: number = 0;
    y: number = 0;
    /**作为线段起点时, 线段的深度 */
    depth!: number | undefined;
    /**作为线段起点时, 线段的角度 */
    theta!: number | undefined;
    constructor({ mode, branch }: { mode: 'random' | 'endpoint', branch?: Branch }) {
        if (mode === 'random') {
            Object.assign(this, Point.Random())
            this.depth = 0;
            this.theta = Point.genTheta(this);
        } else if (mode === 'endpoint') {
            Object.assign(this, Point.Endpoint(branch!))
        }
    }
    static Random() {
        const { ww, wh, isDarkMode } = Point.ctx;
        // if (Math.random() > .5) {
        const xOffset = _parseInt(Math.random() * ww / 16) * (Math.random() > .5 ? 1 : -1)
        const x = xOffset > 0 ? xOffset : xOffset + ww;
        const y = isDarkMode ?
            _parseInt(Math.random() * wh / 3 + wh / 3) :
            _parseInt(Math.random() * wh / 3 + wh * 2 / 3);
        return { x, y }
        // }
        // const yOffset = _parseInt(Math.random() * wh / 16);// * (Math.random() > .5 ? -1 : 1)
        // const x = _parseInt(Math.random() * ww);
        // const y = wh - yOffset;
        // return { x, y }
    }

    static Endpoint(b: Branch) {
        return {
            x: b.start.x + b.length * Math.cos(b.theta),
            y: b.start.y + b.length * Math.sin(b.theta),
        }
    }

    static genTheta({ x, y }: Point) {
        const { ww, wh } = Point.ctx;
        if (x < ww / 2) {
            if (y < wh / 2) {
                return Math.PI / (3 + Math.random())
            }
            return -Math.PI / (3 + Math.random())
        }
        if (y < wh / 2) {
            return Math.PI * 3 / (3 + Math.random())
        }
        return -Math.PI * 3 / (3 + Math.random())
    }
}

type Path = {
    startPoint: Point;
    endPoints: Point[];
    pointsLens: number;
    maxDepth: number;
    reset: () => Path;
}

// @ts-ignore
const pathCtor: Path = {
    reset: () => {
        const path = {} as Path
        path.startPoint = new Point({ mode: 'random' });
        path.endPoints = []
        path.pointsLens = 1;
        path.maxDepth = 0;
        return path;
    }
}

function setupPlum(el: HTMLCanvasElement) {

    // setupTheme();

    const _ctx = el!.getContext('2d')!
    let ctx = _ctx;

    function init() {
        let ww = window.innerWidth; let wh = window.innerHeight;
        el.width = ww;
        el.height = wh;
        ctx ||= _ctx;
        ctx.strokeStyle = getTheme().theme === 'light' ? 'hwb(85deg 73.75% 13.75%)' : 'hwb(198.44deg 21.96% 2.75% / 33%)'; // 85 + 15 = 100!
        Point.ctx = { ww, wh, isDarkMode: getTheme().theme === 'dark' }
        const path = pathCtor.reset();
        Branch.ctx = ctx;
        const start = path.startPoint;
        step(new Branch({ start, mode: "init" }), path)
    }
    let pendingTasks: Function[] = []

    function step(b: Branch, path: Path) {
        if (!ctx) return;
        const nextStart = Branch.drawBranch(b, path)

        const { ww, wh } = Point.ctx;
        const wl = Math.abs(nextStart.x - path.startPoint.x);
        const hl = Math.abs(nextStart.y - path.startPoint.y);
        if (wl > ww * (.65 + .3 * Math.random()) || hl > wh * 2 / (3) || nearBoundary(path)) {
            // @ts-ignore 终止绘画
            ctx = null;
            Branch.ctx = undefined;
            console.log(path, 'plum end!');
        }
        const depth = b.depth;
        if (depth < 4 || Math.random() < 0.5) {
            pendingTasks.push(() => step(new Branch({
                mode: "bTree",
                start: nextStart,
                preBranch: b,
                radianOffset: -.2
            }), path))
        }
        if (depth < 4 || Math.random() < 0.5) {
            pendingTasks.push(() => step(new Branch({
                mode: "bTree",
                start: JSON.parse(JSON.stringify(nextStart)),
                preBranch: b,
                radianOffset: .2
            }), path))
        }
    }

    function runSomeTask() {
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
    function runSomeTaskEveryNFrame(N = 3) {
        ctx && nextFrame(() => {
            // console.log('drawing~');
            framesCount += 1
            if (framesCount % N === 0)
                runSomeTask()
            ctx && runSomeTaskEveryNFrame()
        })
    }

    runSomeTaskEveryNFrame()

    return (() => {
        nextFrame(init)
        nextFrame(init)

        const restart = () => {
            // path.reset();
            ctx?.clearRect(0, 0, el.width, el.height);
            nextFrame(() => {
                ctx = null as any;
                nextFrame(() => {
                    ctx = _ctx;
                    pendingTasks.length = 0;
                    framesCount = 0;
                    runSomeTaskEveryNFrame()
                    nextFrame(init)
                    nextFrame(init)
                })
            })
        }

        const onWindowResize = throttle((ev: UIEvent) => {
            restart()
        }, 5000, { leading: false, trailing: true })

        let removeOnDark = onDark((_, { theme }) => {
            restart()
        })

        window.addEventListener('resize', onWindowResize)

        return () => {
            ctx = null as any;
            window.removeEventListener('resize', onWindowResize)
            removeOnDark();
        }
    })()
}

export default function Plum2() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        return setupPlum(canvasRef.current!)
    }, [])
    return (
        <div className={clsx(
            ' overflow-hidden fixed left-0 right-0 top-0 bottom-0 -z-10  opacity-75 pointer-events-none print:hidden')}
        >
            <canvas ref={canvasRef} />
        </div>)
}

function nearBoundary(path: Path): boolean {
    const endPs: Point[] = []
    const len = -1 * path.endPoints.length;
    let i = -1;
    const ctx = Branch.ctx;
    while (i >= len) {
        if (!ctx) return true;
        const p = path.endPoints.at(i--)
        // i--;
        if (!p?.depth) continue;
        if (p.depth < path.maxDepth) break;
        if (p.depth > path.maxDepth) throw new Error('运行异常!')
        endPs.push(p)
    }
    if (endPs.length < 2) return false;
    const endPsY: number[] = []
    const endPsX: number[] = []
    endPs.map(p => {
        endPsY.push(p.y)
        endPsX.push(p.x)
    })
    const maxY = Math.max(...endPsY)
    const minY = Math.min(...endPsY)
    const maxX = Math.max(...endPsX)
    const minX = Math.max(...endPsX)
    const { ww, wh } = Point.ctx;
    return (maxY - minY) > (wh / 3) || (maxX - minX) > (ww / 3)
}
