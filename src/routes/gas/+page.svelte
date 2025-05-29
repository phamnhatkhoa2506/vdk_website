<svelte:head>
    <title>Concentration</title>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { getSensorDataByDate, getSensorDataByDateAndHour } from '$lib/database';
    import FilterBar from '../../components/FilterBar.svelte';
    import ConcLineChart from '../../components/ConcLineChart.svelte';
    import ConcAreaChart from '../../components/ConcAreaChart.svelte';
    
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
            gas: entry.gas
        }));

        tableData.sort((a, b) => a.time.localeCompare(b.time));
        labels = tableData.map(d => d.time);
        data = tableData.map(d => d.gas);
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
<h3 class="title">CO2 Concentration (Line Chart)</h3>

<div class="chart-container" style="max-width: 1000px; margin: auto;">
    <canvas bind:this={lineCanvas}></canvas>
    <ConcLineChart canvas={lineCanvas} {labels} {data} />
</div>

<h3 class="title">CO2 Concentration (Area Chart)</h3>
<div class="chart-container" style="max-width: 1000px; margin: auto;">
    <canvas bind:this={areaCanvas}></canvas>
    <ConcAreaChart canvas={areaCanvas} {labels} {data} />
</div>

<style>
    .title {
        font-family: "Acme", sans-serif;
        text-align: center;
        margin-top: 2rem;
    }
</style>
