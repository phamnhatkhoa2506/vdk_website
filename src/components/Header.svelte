<script lang="ts">
    // Không cần gì đặc biệt ở đây nếu chỉ là nav tĩnh
</script>
  
<style>
    nav {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        gap: 40px;
    }
  
    a {
        text-decoration: none;
        transition: all 0.2s ease;
        color: white;
        font-size: 1rem;
        font-family: "Acme", sans-serif;
        font-weight: 400;
        font-style: normal;
        display: inline-block;
        transform: translateY(0);
    }

    a:hover {
        color: rgb(245, 255, 130);
        transform: translateY(-4px) scale(1.15); /* Phóng to và nhảy nhẹ */
    }

    a:focus {
        color: rgb(255, 1, 1);
    }
  
    header {
        position: sticky;
        height: 60px;
        background: linear-gradient(to right, rgb(10, 10, 103), rgb(14, 14, 47));
    }
</style>
  
<header>
    <nav>
        <a href="/temperature">Temperature</a>
        <a href="/humidity">Humidity</a>
        <a href="/gas">CO₂ Concentration</a>
        <a href="/tracing">Real-time tracing</a>
    </nav>
</header>
  