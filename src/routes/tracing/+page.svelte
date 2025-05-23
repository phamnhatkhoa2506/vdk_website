<svelte:head>
    <title>Realtime Tracing</title>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import type { ChartDataset } from 'chart.js';
    import { ref, query, orderByKey, startAt, onChildAdded } from 'firebase/database';
    import { database } from '../../lib/firebase';

    let temperatureCanvas: HTMLCanvasElement;
    let humidityCanvas: HTMLCanvasElement;
    let gasCanvas: HTMLCanvasElement;

    let tempChart: Chart;
    let humidityChart: Chart;
    let gasChart: Chart;

    const dataset: ChartDataset<'line'> = {
        label: 'Example',
        data: [],
        borderColor: 'red'
    };

    const today = new Date().toISOString().split('T')[0];

    function createChart(canvas: HTMLCanvasElement, label: string, color: string): Chart {
        const ctx = canvas.getContext('2d');
        return new Chart(ctx!, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        type: 'line',
                        label,
                        data: [],
                        borderColor: color,
                        tension: 0.3,
                        fill: false,
                        pointRadius: 3,
                        pointBackgroundColor: color
                    },
                    {
                        type: 'line',
                        label: 'Average',
                        data: [],
                        borderColor: 'gray',
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Min/Max',
                        type: 'line',
                        data: [],
                        borderColor: 'transparent',
                        pointBackgroundColor: [],
                        pointRadius: [],
                        pointStyle: [],
                        fill: false,
                        showLine: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Thời gian' },
                        ticks: {
                            maxRotation: 90,
                            autoSkip: true
                        }
                    },
                    y: {
                        title: { display: true, text: label }
                    }
                }
            }
        });
    }

    onMount(() => {
        // Khởi tạo biểu đồ
        tempChart = createChart(temperatureCanvas, 'Temperature (°C)', 'rgba(255, 99, 132, 1)');
        humidityChart = createChart(humidityCanvas, 'Humidity (%)', 'rgba(54, 162, 235, 1)');
        gasChart = createChart(gasCanvas, 'CO₂ Concentration (ppm)', 'rgba(75, 192, 192, 1)');

        // Thời gian hiện tại
        const now = new Date();
        const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timeStr = `${pad(threeMinutesAgo.getHours())}:${pad(threeMinutesAgo.getMinutes())}:${pad(threeMinutesAgo.getSeconds())}`;

        // Query chỉ lấy từ thời gian >= 3 phút trước
        const dataRef = query(
            ref(database, `sensors/${today}`),
            orderByKey(),
            startAt(timeStr)
        );

        // Lắng nghe dữ liệu realtime
        onChildAdded(dataRef, (snapshot) => {
            const time = snapshot.key;
            const data = snapshot.val();

            if (!time || !data) return;

            const now = new Date();

            const appendData = (chart: Chart, value: number) => {
                chart.data.labels?.push(time);
                chart.data.datasets[0].data.push(value);

                const values = chart.data.datasets[0].data as number[];
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                const min = Math.min(...values);
                const max = Math.max(...values);

                // Dataset 1: Average line
                chart.data.datasets[1].data = Array(values.length).fill(avg);

                // Dataset 2: Min/Max markers
                const dataset = chart.data.datasets[2] as ChartDataset<'line', number[]>;
                dataset.data = values.map(v => (v === min || v === max) ? v : NaN);
                dataset.pointRadius = values.map(v => (v === min || v === max) ? 7 : 0);
                dataset.pointBackgroundColor = values.map(v => {
                    if (v === min) return 'blue';
                    if (v === max) return 'red';
                    return 'transparent';
                });
                dataset.pointStyle = values.map(v => {
                    if (v === min || v === max) return 'triangle';
                    return 'circle';
                });

                chart.update();
            };

            appendData(tempChart, data.temperature);
            appendData(humidityChart, data.humidity);
            appendData(gasChart, data.gas);
        });

        return () => {
            tempChart.destroy();
            humidityChart.destroy();
            gasChart.destroy();
        };
    });
</script>

<style>
    .top-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .bottom-row {
        width: 100%;
    }

    .bottom-row-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    h2 {
        font-family: "Acme", sans-serif;
    }

    .title {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>

<main>
    <div>
        <h2 class="title">Realtime Tracing {today}</h2>
    </div>
    
    <div class="top-row">
        <div style="width: 100%; height: 300px;">
            <canvas bind:this={gasCanvas}></canvas>
        </div>
        <div style="width: 100%; height: 300px;">
            <canvas bind:this={humidityCanvas}></canvas>
        </div>
    </div>
  
    <div class="bottom-row">
        <div class="bottom-row-container" style="width: 100%; height: 300px;">
            <canvas bind:this={temperatureCanvas}></canvas>
        </div>
    </div>
</main>
