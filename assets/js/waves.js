const CONFIG = {
  spawnInterval: 1800,
  ringsPerDrop: 5,
  ringSpacing: 28,
  expandSpeed: 2.2,
  maxRadius: 950,
  maxDrops: 8,
  riftAmplitude: 7,
  riftFrequency: 8,
  riftPhaseSpeed: 0.025,
  angleSteps: 220,
  lineWidth: 0.75,
  noiseStrength: 3,
  noiseScale: 0.15,
  cursorThrottle: 180,  
  light: {
    strokeColor: "30, 20, 10",  
    maxOpacity: 0.12,  
    decayRate: 0.002,
  },
  dark: {
  strokeColor: "235, 225, 210",  
  maxOpacity: 0.18,            
  decayRate: 0.0015,
    },
};

const canvas = document.createElement("canvas");
canvas.style.cssText = `
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
`;
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");

let drops = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let phase = 0;
let lastSpawn = 0;

function noise(x, y, seed) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.3) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function isDark() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function spawnDrop() {
  const rings = [];
  for (let i = 0; i < CONFIG.ringsPerDrop; i++) {
    rings.push({
      x: mouse.x,
      y: mouse.y,
      radius: i * CONFIG.ringSpacing,
      opacity: 1 - i * 0.18,
      birthPhase: phase,
      seed: Math.random() * 100,
    });
  }
  drops.push(rings);
  if (drops.length > CONFIG.maxDrops) drops.shift();
}

// Re-clear canvas on theme switch to avoid stale rendering
const themeObserver = new MutationObserver(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops = [];
  spawnDrop();
});
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  const now = Date.now();
  if (now - lastSpawn > CONFIG.cursorThrottle) {
    spawnDrop();
    lastSpawn = now;
  }
});

setInterval(spawnDrop, CONFIG.spawnInterval);

function drawRiftedRing(ring, mode) {
  const steps = CONFIG.angleSteps;
  ctx.beginPath();
  for (let s = 0; s <= steps; s++) {
    const angle = (s / steps) * Math.PI * 2;

    const rift = CONFIG.riftAmplitude *
      Math.sin(CONFIG.riftFrequency * angle + phase - ring.birthPhase);

    // Multi-layered noise for richer texture
    const nx = Math.cos(angle) * CONFIG.noiseScale;
    const ny = Math.sin(angle) * CONFIG.noiseScale;
    const grain =
      CONFIG.noiseStrength * noise(nx * ring.radius, ny * ring.radius, ring.seed) +
      (CONFIG.noiseStrength * 0.4) * noise(nx * ring.radius * 2.3, ny * ring.radius * 2.3, ring.seed + 13);

    const r = ring.radius + rift + grain;
    const x = ring.x + r * Math.cos(angle);
    const y = ring.y + r * Math.sin(angle);
    s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(${mode.strokeColor}, ${ring.opacity * mode.maxOpacity})`;
  ctx.lineWidth = CONFIG.lineWidth;
  ctx.shadowBlur = isDark() ? 6 : 0;
  ctx.shadowColor = `rgba(${mode.strokeColor}, 0.07)`;
  ctx.stroke();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const mode = isDark() ? CONFIG.dark : CONFIG.light;

  phase += CONFIG.riftPhaseSpeed;
  drops = drops.filter((rings) => rings.some((r) => r.opacity > 0.01));

  for (const rings of drops) {
    for (const ring of rings) {
      if (ring.opacity <= 0.01) continue;
      drawRiftedRing(ring, mode);
      ring.radius += CONFIG.expandSpeed;
      ring.opacity -= mode.decayRate;
      if (ring.radius > CONFIG.maxRadius) ring.opacity = 0;
    }
  }

  requestAnimationFrame(animate);
}

spawnDrop();
animate();