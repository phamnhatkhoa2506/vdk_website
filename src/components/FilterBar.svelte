<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let selectedYear = '';
    let selectedMonth = '';
    let selectedDay = '';
    let selectedHour = '';

    const years = [2023, 2024, 2025];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    let days: number[] = [];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Recalculate days based on selected year and month
    $: {
        if (selectedYear && selectedMonth) {
            const lastDay = new Date(Number(selectedYear), Number(selectedMonth), 0).getDate();
            days = Array.from({ length: lastDay }, (_, i) => i + 1);

            // reset selectedDay if it's now invalid
            if (selectedDay && Number(selectedDay) > lastDay) {
                selectedDay = '';
            }
        }
    }

    function handleChange() {
        dispatch('filterChange', {
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay,
            hour: selectedHour
        });
    }

    function handleNowClick() {
        const now = new Date();

        selectedYear = now.getFullYear().toString();
        selectedMonth = (now.getMonth() + 1).toString();
        selectedDay = now.getDate().toString();
        selectedHour = now.getHours().toString();

        handleChange();
    }
</script>


<style>
    .filter-bar {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        background: linear-gradient(to right, rgb(18, 102, 228), rgb(3, 3, 167));
    }
  
    select {
        padding: 0.4rem 0.6rem;
        font-size: 1rem;
        font-family: "Acme", sans-serif;
        border-radius: 20px;
        border: 1px solid #ccc;
        width: 100px;
        transition: all 0.1s ease-in;
    }
  
    select:focus {
        outline: none;
        transform: scale(1.15);
    }

    option {
        border-radius: 20px;
    }

    button {
        font-family: "Acme", sans-serif;
        font-size: 1rem;
        width: 80px;
        height: 30px;
        border-radius: 20px;
        outline: none;
        border: 2px solid rgb(32, 213, 32);
        background: none;
        color: white
    }

    button:hover {
        background-color: aliceblue;
        color: black;
        cursor: pointer;
    }

    button:active {
        background-color: rgb(88, 140, 186);
    }
</style>
  
<div class="filter-bar">
    <select bind:value={selectedYear} on:change={handleChange}>
        <option value="" hidden>Year</option>
        {#each years as year}
            <option value={year.toString()}>{year}</option>
        {/each}
    </select>
  
    <select bind:value={selectedMonth} on:change={handleChange}>
        <option value="" hidden>Month</option>
        {#each months as month}
            <option value={month.toString()}>{month}</option>
        {/each}
    </select>
  
    <select bind:value={selectedDay} on:change={handleChange}>
        <option value="" hidden>Day</option>
        {#each days as day}
            <option value={day.toString()}>{day}</option>
        {/each}
    </select>
  
    <select bind:value={selectedHour} on:change={handleChange}>
        <option value="" hidden>Hour</option>
        <option value="None">None</option>
        {#each hours as hour}
            <option value={hour.toString()}>{hour}</option>
        {/each}
    </select>

    <button on:click={handleChange}>Plot</button>
    <button on:click={handleNowClick}>Now</button>
</div>
