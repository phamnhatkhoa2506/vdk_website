<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onDestroy } from 'svelte';

    export let canvas: HTMLCanvasElement;
    export let labels: string[] = [];
    export let data: number[] = [];

    let chart: Chart;

    function drawChart() {
        if (!canvas || labels.length === 0 || data.length === 0) return;

        const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const minIndex = data.indexOf(min);
        const maxIndex = data.indexOf(max);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data,
                        borderColor: 'rgba(255, 200, 132, 1)',
                        tension: 0.3,
                        fill: false,
                        pointRadius: data.map((_, i) => (i === minIndex || i === maxIndex ? 8 : 3)),
                        pointBackgroundColor: data.map((_, i) => {
                            if (i === minIndex) return 'green';
                            if (i === maxIndex) return 'blue';
                            return 'rgba(255, 99, 132, 1)';
                        }),
                        pointStyle: 'circle'
                    },
                    {
                        label: `Average Temp (${avg.toFixed(2)}°C)`,
                        data: Array(data.length).fill(avg),
                        borderColor: 'rgba(0, 200, 0, 0.6)',
                        borderDash: [6, 4],
                        fill: false,
                        pointRadius: 0
                    }
                ]
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
                    y: { beginAtZero: false },
                    x: {
                        ticks: { maxRotation: 90, autoSkip: true }
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
