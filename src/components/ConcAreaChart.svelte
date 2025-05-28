<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onDestroy } from 'svelte';
    import zoomPlugin from 'chartjs-plugin-zoom';

    Chart.register(zoomPlugin);

    export let canvas: HTMLCanvasElement;
    export let labels: string[] = [];
    export let data: number[] = [];

    
    let chart: Chart;

    function drawChart() {
        if (!canvas || labels.length === 0 || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Gas Concentration (ppm)',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(0, 255, 0, 0.4)',
                    borderColor: 'green',
                    tension: 0.3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: false }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                const label = ctx.dataset.label || '';
                                return `${label}: ${ctx.raw}ppm`;
                            }
                        }
                    },
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    },
                    zoom: {
                        pan: { enabled: true, mode: 'x' },
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: 'x'
                        }
                    }
                }
            }
        });
    }

    $: if (labels.length && data.length) {
        drawChart();
    }

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script> 