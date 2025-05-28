<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onDestroy } from 'svelte';

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
                    label: 'Temperature (°C)',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { usePointStyle: true } },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.dataset.label || ''}: ${ctx.raw}°C`
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
                },
                scales: {
                    y: { beginAtZero: false }
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
