// GSAP coin drops + progress fill
(function () {
  function setProgressFill(percent) {
    const fill = document.querySelector("#progressFill");
    const label = document.querySelector("#progressLabel");
    const clamped = Math.max(0, Math.min(100, percent));
    if (fill) fill.style.height = `${clamped}%`;
    if (label) label.textContent = `${clamped.toFixed(2)}%`;
  }

  function dropCoin() {
    const tank = document.querySelector("#progressTank");
    const coins = document.querySelector("#coinLayer");
    if (!tank || !coins || !window.gsap) return;

    const coin = document.createElement("div");
    coin.className = "coin";

    const tankRect = tank.getBoundingClientRect();
    const x = Math.random() * Math.max(10, tankRect.width - 26);

    coin.style.position = "absolute";
    coin.style.left = `${x}px`;
    coin.style.top = `-30px`;

    coins.appendChild(coin);

    const landingY = tankRect.height - (22 + Math.random() * 90);
    window.gsap.to(coin, {
      y: landingY,
      duration: 0.9,
      ease: "bounce.out",
      onComplete: () => {
        window.gsap.to(coin, {
          opacity: 0,
          duration: 0.6,
          delay: 2.0,
          onComplete: () => coin.remove(),
        });
      },
    });
  }

  window.FMAnim = { setProgressFill, dropCoin };
})();
