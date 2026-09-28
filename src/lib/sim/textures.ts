import * as THREE from "three";

/** Canvas-generated textures — no binary assets, generated in the browser only. */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext("2d")! };
}

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, alpha: number) {
  for (let i = 0; i < amount; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 2.4;
    const g = Math.floor(Math.random() * 90);
    ctx.fillStyle = `rgba(${g},${g},${g},${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function makeAsphaltTexture(repeatY = 40) {
  const { c, ctx } = canvas(512, 512);
  ctx.fillStyle = "#3a3a38";
  ctx.fillRect(0, 0, 512, 512);
  noise(ctx, 512, 512, 9000, 0.35);

  // patched repairs
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = `rgba(${30 + Math.random() * 40},${30 + Math.random() * 35},${28 + Math.random() * 30},0.5)`;
    ctx.beginPath();
    ctx.ellipse(Math.random() * 512, Math.random() * 512, 30 + Math.random() * 70, 20 + Math.random() * 50, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // cracks
  ctx.strokeStyle = "rgba(20,20,20,0.55)";
  for (let i = 0; i < 30; i++) {
    ctx.lineWidth = 0.6 + Math.random();
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      x += (Math.random() - 0.5) * 60;
      y += (Math.random() - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // faded, broken centre line
  ctx.fillStyle = "rgba(225,220,200,0.32)";
  for (let y = 0; y < 512; y += 120) {
    ctx.globalAlpha = 0.25 + Math.random() * 0.5;
    ctx.fillRect(250, y, 10, 64);
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, repeatY);
  tex.anisotropy = 8;
  return tex;
}

export function makeGroundTexture() {
  const { c, ctx } = canvas(256, 256);
  ctx.fillStyle = "#6b5b45";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2500; i++) {
    const g = Math.random();
    ctx.fillStyle = `rgba(${120 + g * 60},${100 + g * 55},${70 + g * 45},0.35)`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = "rgba(90,105,60,0.35)";
    ctx.beginPath();
    ctx.ellipse(Math.random() * 256, Math.random() * 256, 6 + Math.random() * 14, 4 + Math.random() * 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(30, 90);
  return tex;
}

export function makeBuildingTexture() {
  const { c, ctx } = canvas(256, 256);
  const base = ["#b8a690", "#9d8f7d", "#c2b39c", "#8f7f6c"][Math.floor(Math.random() * 4)]!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  noise(ctx, 256, 256, 2200, 0.16);
  // weather streaks
  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = "rgba(60,55,48,0.12)";
    ctx.fillRect(Math.random() * 256, 0, 2 + Math.random() * 6, 60 + Math.random() * 190);
  }
  // windows
  for (let fy = 28; fy < 236; fy += 56) {
    for (let fx = 20; fx < 236; fx += 52) {
      ctx.fillStyle = Math.random() > 0.35 ? "#2b3238" : "#5d6b72";
      ctx.fillRect(fx, fy, 30, 34);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.strokeRect(fx, fy, 30, 34);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
