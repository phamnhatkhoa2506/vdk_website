<svelte:head>
    <title>Temperature</title>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { getSensorDataByDate, getSensorDataByDateAndHour } from '$lib/database';
    import FilterBar from '../../components/FilterBar.svelte';
    import TemperatureLineChart from '../../components/TemperatureLineChart.svelte';
    import TemperatureAreaChart from '../../components/TemperatureAreaChart.svelte';

    let lineCanvas: HTMLCanvasElement;
    let areaCanvas: HTMLCanvasElement;

    let selectedDate = new Date().toISOString().split('T')[0];
    let selectedHour = "";
    let labels: string[] = [];
    let data: number[] = [];

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
            temperature: entry.temperature
        }));

        tableData.sort((a, b) => a.time.localeCompare(b.time));
        labels = tableData.map(d => d.time);
        data = tableData.map(d => d.temperature);
    }

    function handleFilterChange(event: CustomEvent) {
        const { year, month, day, hour } = event.detail;
        if (year && month && day) {
            selectedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            selectedHour = hour;
            loadChartData(selectedDate, hour);
        }
    }

    onMount(() => {
        loadChartData(selectedDate, selectedHour);
    });
</script>

<FilterBar on:filterChange={handleFilterChange} />

<h3 class="title">{selectedDate}</h3>
<h3 class="title">Temperature (Line Chart)</h3>

<div class="chart-container" style="max-width: 1000px; margin: auto;">
    <canvas bind:this={lineCanvas}></canvas>
    <TemperatureLineChart canvas={lineCanvas} {labels} {data} />
</div>

<h3 class="title">Temperature (Area Chart)</h3>
<div class="chart-container" style="max-width: 1000px; margin: auto;">
    <canvas bind:this={areaCanvas}></canvas>
    <TemperatureAreaChart canvas={areaCanvas} {labels} {data} />
</div>

<style>
    .title {
        font-family: "Acme", sans-serif;
        text-align: center;
        margin-top: 2rem;
    }
</style>
