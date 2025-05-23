<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import { getSensorDataByDate } from '$lib/database';
  
    let canvas: HTMLCanvasElement;
    let chart: Chart;
    let table: any[] = [];
    let tableData: any[] = [];

    // Retrieve Data
    const today = new Date().toISOString().split('T')[0];
  
    // Plot chart and table
    onMount(async () => {
        const sensorData = await getSensorDataByDate(today);
        if (!sensorData) return;

        // Chuyển dữ liệu thành mảng
        tableData = Object.entries(sensorData).map(([time, data]) => ({
            time,
            ...data as any
        }));

        // Lấy labels và data cho biểu đồ
        const labels = tableData.map(d => d.time);
        const data = tableData.map(d => d.temperature);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Nhiệt độ (°C)',
                    data,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.3,
                    fill: false 
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

        return undefined;
    });
</script>

<main>
    <h2>Biểu đồ nhiệt độ ngày {today}</h2>
    <div style="width: 100%; height: 300px;">
        <canvas bind:this={canvas} style="width: 100%; height: 100%;"></canvas>
    </div>
  
    <h2>Bảng dữ liệu cảm biến</h2>
    {#if tableData.length > 0}
        <table>
            <thead>
                <tr>
                    <th>Thời gian</th>
                    <th>Nhiệt độ (°C)</th>
                    <th>Độ ẩm (%)</th>
                    <th>Gas</th>
                </tr>
            </thead>
            <tbody>
                {#each tableData as row}
                    <tr>
                    <td>{row.time}</td>
                    <td>{row.temperature}</td>
                    <td>{row.humidity}</td>
                    <td>{row.gas}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Không có dữ liệu.</p>
    {/if}
</main>
  
<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
  
    th, td {
        border: 1px solid #ccc;
        padding: 0.5rem;
        text-align: center;
    }
  
    th {
        background: #f4f4f4;
    }
</style>
  
