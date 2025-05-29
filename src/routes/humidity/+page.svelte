<svelte:head>
    <title>Humidity</title>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { getSensorDataByDate, getSensorDataByDateAndHour } from '$lib/database';
    import FilterBar from '../../components/FilterBar.svelte';
    import HumidityLineChart from '../../components/HumidityLineChart.svelte';
    import HumidityAreaChart from '../../components/HumidityAreaChart.svelte';

    let lineCanvas: HTMLCanvasElement;
    let areaCanvas: HTMLCanvasElement;

    let selectedDate = new Date().toISOString().split('T')[0];
    let selectedHour = "";
    let labels: string[] = [];
    let data: number[] = [];
    let matrixData: { x: number, y: number, v: number }[] = [];
    let xLabels: string[] = []; // các phút (0-59 hoặc cụ thể hơn)
    let yLabels: string[] = []; // các giờ (0-23)

    async function loadChartData(date: string, hour: string) {
        let sensorData;

        const isValidHour = Number.isInteger(Number(hour)) && hour !== "";

        if (isValidHour) {
            sensorData = await getSensorDataByDateAndHour(date, hour);
        } else {
            sensorData = await getSensorDataByDate(date);
        }

        if (!sensorData) return;

        const tableData = Object.entries(sensorData).map(([time, entry]: any) => ({
            time,
            humidity: entry.humidity
        }));

        tableData.sort((a, b) => a.time.localeCompare(b.time));
        labels = tableData.map(d => d.time);
        data = tableData.map(d => d.humidity);
    }

    async function loadHeatmapData() {
        const raw = await getSensorDataByDate(selectedDate);

        const xSet = new Set<string>();
        const ySet = new Set<string>();

        // Bước 1: Lấy toàn bộ nhãn
        for (const time of Object.keys(raw)) {
            const [hour, minute] = time.split(':');
            xSet.add(`${hour}:${minute}`);
            ySet.add(hour);
        }

        // Bước 2: Sort nhãn
        xLabels = Array.from(xSet).sort();
        yLabels = Array.from(ySet).sort();

        // Bước 3: Build matrixData sau khi đã có xLabels & yLabels
        matrixData = [];

        for (const [time, entry] of Object.entries(raw)) {
            const [hour, minute, second] = time.split(':');
            const xIndex = xLabels.indexOf(minute);
            const yIndex = yLabels.indexOf(hour);
            const value = (entry as { humidity: number }).humidity;

            matrixData.push({ x: xIndex, y: yIndex, v: value });
        }
    }

    async function handleFilterChange(event: CustomEvent) {
        const { year, month, day, hour } = event.detail;
        if (year && month && day) {
            selectedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            selectedHour = hour;
            await loadChartData(selectedDate, hour);
            await loadHeatmapData();
        }
    }

    onMount(() => {
        loadChartData(selectedDate, selectedHour);
        loadHeatmapData()
    });
</script>

<FilterBar on:filterChange={handleFilterChange} />

<h3 class="title">{selectedDate}</h3>
<h3 class="title">Humidity (Line Chart)</h3>

<div class="chart-container" style="max-width: 1000px; margin: auto;">
    <canvas bind:this={lineCanvas}></canvas>
    <HumidityLineChart canvas={lineCanvas} {labels} {data} />
</div>

<h3 class="title">Humidity (Area Chart)</h3>
<div class="chart-container" style="max-width: 1000px; margin: auto;">
    <canvas bind:this={areaCanvas}></canvas>
    <HumidityAreaChart canvas={areaCanvas} {labels} {data} />
</div>

<style>
    .title {
        font-family: "Acme", sans-serif;
        text-align: center;
        margin-top: 2rem;
    }
</style>
