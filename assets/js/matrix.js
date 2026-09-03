(function() {
  'use strict';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';

  document.body.prepend(canvas);

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

  const fontSize = 16;
  const columns = Math.floor(width / fontSize);
  const drops = new Array(columns).fill(1);

  let isRunning = true;

  function draw() {
    if (!isRunning) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.shadowBlur = 0;
    ctx.fillRect(0, 0, width, height);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff00';
    ctx.fillStyle = '#00ff00';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.matrixRain = {
    toggle: function() {
      isRunning = !isRunning;
      if (isRunning) draw();
    },
    isActive: function() { return isRunning; }
  };

  draw();
})();