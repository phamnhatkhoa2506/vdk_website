<svelte:head>
    <title>Home</title>
</svelte:head>

<style>
    p {
        width: 100%;
        text-align: center;
        font-family: "Acme", sans-serif;
        font-size: 10rem;
    }
  
    p span {
        display: inline-block;          
        animation: wordJump 0.6s ease-in-out infinite;
        margin: 0;
        padding: 0;
    }
  
    p span:nth-child(1) { animation-delay: 0s;   }
    p span:nth-child(2) { animation-delay: 0.2s; }
    p span:nth-child(3) { animation-delay: 0.4s; }
    p span:nth-child(4) { animation-delay: 0.6s; }
    p span:nth-child(5) { animation-delay: 0.8s; }
  
    @keyframes wordJump {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
</style>
  
<p>
    <span style="color: red;">H</span>
    <span style="color: green;">e</span>
    <span style="color: blue;">l</span>
    <span style="color: yellow;">l</span>
    <span style="color: purple;">o</span>
    <span style="color: orange;">!</span>
</p>
  