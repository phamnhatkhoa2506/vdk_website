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
                        label: 'Humidity (%)',
                        data,
                        borderColor: 'blue',
                        tension: 0.3,
                        fill: false,
                        pointRadius: data.map((v, i) => {
                            if (i === minIndex || i === maxIndex) return 8; // 👈 Phóng to min/max
                            return 3; // 👈 Bình thường
                        }),
                        pointBackgroundColor: data.map((v, i) => {
                            if (i === minIndex) return 'green';
                            if (i === maxIndex) return 'pink';
                            return 'orange';
                        }),
                        pointStyle: 'circle'
                    },
                    {
                        label: `Average Humid (${avg.toFixed(2)}%)`,
                        data: Array(data.length).fill(avg),
                        borderColor: 'red   ',
                        borderDash: [6, 4], 
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: false },
                    x: {
                        ticks: {
                            maxRotation: 90,
                            autoSkip: true
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                const label = ctx.dataset.label || '';
                                return `${label}: ${ctx.raw}%`;
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
