<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import type { Chart as ChartType } from 'chart.js';
    import {
        MatrixController,
        MatrixElement
    } from 'chartjs-chart-matrix';

    Chart.register(MatrixController, MatrixElement);

    export let matrixData: { x: number, y: number, v: number }[] = [];
    export let xLabels: string[] = [];
    export let yLabels: string[] = [];

    let canvas: HTMLCanvasElement;
    let chart: ChartType;

    function getColor(value: number): string {
        if (value < 30) return '#d4f0ff';
        if (value < 50) return '#7fc8f8';
        if (value < 70) return '#378ce7';
        return '#004e98';
    }

    $: if (matrixData && xLabels && yLabels) {
        if (chart) chart.destroy();
        drawChart();
    }

    function drawChart() {
        if (!canvas || !matrixData || !Array.isArray(matrixData)) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        chart = new Chart(ctx, {
            type: 'matrix',
            data: {
                datasets: [{
                    label: 'Humidity Heatmap',
                    data: matrixData,
                    backgroundColor: ctx => {
                        const raw = ctx.raw as { v?: number };
                        return raw && typeof raw.v === 'number' ? getColor(raw.v) : 'transparent';
                    },
                    borderColor: 'white',
                    borderWidth: 1,
                    width: () => 40,
                    height: () => 40
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: ctx => {
                                const raw = ctx[0].raw as { x?: number, y?: number };
                                const x = typeof raw.x === 'number' ? xLabels[raw.x] : 'N/A';
                                const y = typeof raw.y === 'number' ? yLabels[raw.y] : 'N/A';
                                return `Time: ${x}, Hour: ${y}`;
                            },
                            label: ctx => {
                                const raw = ctx.raw as { v?: number };
                                return `Humidity: ${raw?.v ?? 'N/A'}%`;
                            }
                        }
                    },
                    legend: { display: false }
                },
                scales: {
                    x: {
                        type: 'category',
                        labels: xLabels,
                        offset: true,
                        grid: { display: false },
                        title: { display: true, text: 'Time' }
                    },
                    y: {
                        type: 'category',
                        labels: yLabels,
                        offset: true,
                        grid: { display: false },
                        title: { display: true, text: 'Hour' }
                    }
                }
            }
        });
    }

    onMount(() => {
        drawChart();
    });
</script>

<canvas bind:this={canvas}></canvas>
