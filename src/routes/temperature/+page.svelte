<svelte:head>
    <title>Temperature</title>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto'
    import { getSensorDataByDate, getSensorDataByDateAndHour } from '$lib/database';
    import FilterBar from '../../components/FilterBar.svelte';
  
    let canvas: HTMLCanvasElement;
    let chart: Chart;
    let tableData: any[]
    let selectedDate = new Date().toISOString().split('T')[0];
    let selectedHour = "";

    async function loadChartData(date: string, hour: string) {
        let sensorData;

        const isValidHour = Number.isInteger(Number(hour)) && hour !== "";

        if (isValidHour) {
            sensorData = await getSensorDataByDateAndHour(date, hour);
        } else {
            sensorData = await getSensorDataByDate(date);
        }

        if (!sensorData) return;

        // Format lại tableData từ Firebase object
        tableData = Object.entries(sensorData).map(([time, entry]: any) => ({
            time,
            temperature: entry.temperature
        }));

        // Sort theo thời gian tăng dần
        tableData.sort((a, b) => a.time.localeCompare(b.time));

        const labels = tableData.map(d => d.time);
        const data = tableData.map(d => d.temperature);

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
                        pointRadius: data.map((v, i) => {
                            if (i === minIndex || i === maxIndex) return 8; // 👈 Phóng to min/max
                            return 3; // 👈 Bình thường
                        }),
                        pointBackgroundColor: data.map((v, i) => {
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
                                return `${label}: ${ctx.raw}°C`;
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

    function handleFilterChange(event: CustomEvent) {
        const { year, month, day, hour } = event.detail;
        if (year && month && day) {
            selectedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            selectedHour = hour;
            loadChartData(selectedDate, hour);
        }
    }
  
    onMount(async () => {
        const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
        Chart.register(zoomPlugin);

        loadChartData(selectedDate, selectedHour);
    });
</script>

<style>
    h3 {
        font-family: "Acme", sans-serif;
    }
    
    .title {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>

<div style="width: 100%;">
    <FilterBar on:filterChange={handleFilterChange} />

    <div>
        <h3 class="title">Temperature {selectedDate}</h3>
    </div>

    <div class="chart-container" style="max-width: 1000px; margin: auto;">
        <canvas bind:this={canvas}></canvas>
    </div>
</div>
  
