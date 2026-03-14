// Stars
const starsEl = document.getElementById("stars");
for (let i = 0; i < 80; i++) {
  const s = document.createElement("div");
  s.className = "star";
  const size = Math.random() * 2.5 + 0.5;
  s.style.cssText = `
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    width: ${size}px;
    height: ${size}px;
    --dur: ${2 + Math.random() * 3}s;
    --delay: ${Math.random() * 4}s;
  `;
  starsEl.appendChild(s);
}

// Floating particles
const particlesEl = document.getElementById("particles");
const emojis = ["✨", "🌸", "⭐", "🎉", "💫", "🌺", "✦", "🎈"];
for (let i = 0; i < 14; i++) {
  const p = document.createElement("div");
  p.className = "particle";
  p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    --size: ${10 + Math.random() * 14}px;
    --dur: ${8 + Math.random() * 10}s;
    --delay: ${Math.random() * 10}s;
  `;
  particlesEl.appendChild(p);
}

// Orbiting dots in card
const ring = document.getElementById("confettiRing");
const dotColors = ["#C9A84C", "#E8A0B0", "#C8A8D8", "#A8D8C8", "#F0D080", "#E8C060"];
for (let i = 0; i < 6; i++) {
  const d = document.createElement("div");
  d.className = "conf-dot";
  const angle = (i / 6) * 360;
  d.style.cssText = `
    background: ${dotColors[i]};
    left: 50%; top: 50%;
    margin: -4px 0 0 -4px;
    --dur: ${3 + i * 0.3}s;
    --delay: ${i * 0.2}s;
    --start: ${angle}deg;
  `;
  ring.appendChild(d);
}

// BG flowers
const bgDeco = document.getElementById("bgDeco");
const flowers = ["✿", "❋", "✾", "❀", "✽"];
for (let i = 0; i < 8; i++) {
  const f = document.createElement("div");
  f.className = "bg-flower";
  f.textContent = flowers[i % flowers.length];
  f.style.cssText = `
    left: ${Math.random() * 85}%;
    top: ${Math.random() * 85}%;
    transform: rotate(${Math.random() * 360}deg);
    font-size: ${30 + Math.random() * 30}px;
    color: #8B6914;
  `;
  bgDeco.appendChild(f);
}

// Confetti burst
function triggerConfetti() {
  const burst = document.getElementById("confettiBurst");
  burst.innerHTML = "";
  const colors = ["#C9A84C", "#E8A0B0", "#C8A8D8", "#A8D8C8", "#F0D080", "#FF9999", "#FFD700", "#98FB98"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("div");
    p.className = "burst-piece";
    const angle = Math.random() * 360;
    const dist = 100 + Math.random() * 250;
    const rad = (angle * Math.PI) / 180;
    const isRect = Math.random() > 0.5;
    p.style.cssText = `
      --w: ${isRect ? 4 + Math.random() * 6 : 6 + Math.random() * 8}px;
      --h: ${isRect ? 8 + Math.random() * 12 : 6 + Math.random() * 8}px;
      --br: ${isRect ? "2px" : "50%"};
      --color: ${colors[Math.floor(Math.random() * colors.length)]};
      --tx: ${Math.cos(rad) * dist}px;
      --ty: ${Math.sin(rad) * dist}px;
      --rot: ${Math.random() * 720 - 360}deg;
      --delay: ${Math.random() * 0.3}s;
    `;
    burst.appendChild(p);
  }
  setTimeout(() => { burst.innerHTML = ""; }, 2000);
}

let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;

  const env = document.getElementById("envelope");
  const hint = document.getElementById("clickHint");
  env.classList.add("opening");
  hint.style.opacity = "0";

  setTimeout(() => {
    document.getElementById("cardContainer").classList.add("visible");
    triggerConfetti();
  }, 700);
}

function flipCard() {
  document.getElementById("card").classList.add("flipped");
}

function closeCard() {
  const card = document.getElementById("card");
  card.classList.remove("flipped");
  document.getElementById("cardContainer").classList.remove("visible");
  setTimeout(() => {
    const env = document.getElementById("envelope");
    const hint = document.getElementById("clickHint");
    env.classList.remove("opening");
    hint.style.opacity = "1";
    opened = false;
  }, 500);
}
