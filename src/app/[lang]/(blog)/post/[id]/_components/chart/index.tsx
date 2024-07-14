"use client";

import type { ChartData, ChartOptions, ChartTypeRegistry, Chart as ChartJS } from 'chart.js';
import { Chart as _Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface Prop {
    type: keyof ChartTypeRegistry,
    data: any,
    style: any
}

interface LineProps {
    options: ChartOptions<'line'>;
    data: ChartData<'line'>;
}

export default function Chart({ type, data, style = {}, ...props }: Prop) {
    const chartRef = useRef<ChartJS>(null);

    useEffect(() => {
        const chart = chartRef.current;

        if (chart) {
            // console.log('CanvasRenderingContext2D', chart.ctx);
            // console.log('HTMLCanvasElement', chart.canvas);
        }
    }, []);
    return <div style={{ ...style }} className={clsx(' w-full h-full flex place-content-center place-items-center p-2 overflow-hidden')}>
        <_Chart ref={chartRef} type={type} data={data} {...props} />
    </div>
}