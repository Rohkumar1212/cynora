import fs from "fs";
import path from "path";

const products = [
  { id: "det-wool", tag: "WOOL & DELICATE", from: "#8a7ab0", to: "#453a63" },
  { id: "det-color", tag: "COLOR PROTECT", from: "#5fa0cf", to: "#274f6b" },
  { id: "dish-gel", tag: "DISH WASH GEL", from: "#f3cf6e", to: "#b8811d" },
  { id: "floor-cleaner", tag: "FLOOR CLEANER", from: "#4d7a5f", to: "#1c3327" },
  { id: "hand-wash", tag: "ROSE & ALOE", from: "#e08fa9", to: "#8a3f57" },
  { id: "surface-cleaner", tag: "CITRUS FRESH", from: "#5fa0cf", to: "#1f4058" },
  { id: "glass-polish", tag: "GLASS & CHROME", from: "#b083c9", to: "#4f2f61" },
  { id: "det-front-load", tag: "FRONT LOAD MATIC", from: "#8a7ab0", to: "#2f2645" },
];

const outDir = path.join(process.cwd(), "public", "images", "products");
fs.mkdirSync(outDir, { recursive: true });

function pouchSVG({ tag, from, to }) {
  return `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <linearGradient id="pouch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(255,255,255,0.16)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#efd289"/>
      <stop offset="1" stop-color="#c9a24b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <g opacity="0.5">
    <circle cx="80" cy="500" r="180" fill="rgba(255,255,255,0.06)"/>
    <circle cx="540" cy="90" r="140" fill="rgba(255,255,255,0.05)"/>
  </g>
  <path d="M195 150 h210 a26 26 0 0 1 26 26 v330 a44 44 0 0 1-44 44 H213 a44 44 0 0 1-44-44 V176 a26 26 0 0 1 26-26 z" fill="url(#pouch)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <rect x="262" y="112" width="76" height="52" rx="12" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
  <rect x="278" y="96" width="44" height="26" rx="8" fill="rgba(255,255,255,0.35)"/>
  <text x="300" y="330" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="40" fill="url(#gold)" letter-spacing="4">CYNORA</text>
  <line x1="240" y1="352" x2="360" y2="352" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <text x="300" y="382" text-anchor="middle" font-family="Arial, sans-serif" font-weight="600" font-size="15" fill="rgba(255,255,255,0.85)" letter-spacing="2">${tag}</text>
  <path d="M540 470 l10 26 26 10 -26 10 -10 26 -10-26 -26-10 26-10z" fill="url(#gold)" opacity="0.85"/>
</svg>`;
}

for (const p of products) {
  fs.writeFileSync(path.join(outDir, `${p.id}.svg`), pouchSVG(p));
}

// Hero illustration
const hero = `<svg width="900" height="700" viewBox="0 0 900 700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbe9b8"/>
      <stop offset="1" stop-color="#efd289"/>
    </linearGradient>
  </defs>
  <rect width="900" height="700" fill="none"/>
  <circle cx="450" cy="350" r="320" fill="url(#hbg)" opacity="0.18"/>
  <circle cx="620" cy="180" r="120" fill="#c9a24b" opacity="0.15"/>
</svg>`;
fs.writeFileSync(path.join(process.cwd(), "public", "images", "hero-glow.svg"), hero);

console.log("Generated", products.length + 1, "images");
