import * as THREE from "three";

/** Extra canvas textures for the Indian street: shop signs, awnings, banners, footpath. */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext("2d")! };
}

const SHOP_NAMES = [
  "SHARMA GENERAL STORE",
  "किराना स्टोर",
  "VERMA SWEETS",
  "मोबाइल रिचार्ज",
  "NEW TAILORS",
  "CHAI POINT",
  "AUTO PARTS",
  "मेडिकल स्टोर",
  "GUPTA ELECTRONICS",
  "फोटो कॉपी",
  "HOTEL PUNJABI DHABA",
  "CYCLE REPAIR",
];

const SIGN_BG = ["#1f6f43", "#b8241f", "#0f4c81", "#e0a410", "#5b2d8e", "#136b6b"];

export function makeShopSignTexture(seed: number) {
  const { c, ctx } = canvas(512, 128);
  const bg = SIGN_BG[seed % SIGN_BG.length]!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 128);
  // grime / sun fade
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, "rgba(255,255,255,0.14)");
  grad.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.fillStyle = "#fdf6e3";
  ctx.font = "bold 46px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const name = SHOP_NAMES[seed % SHOP_NAMES.length]!;
  ctx.fillText(name, 256, 62, 470);
  // dirt specks
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(30,25,18,${Math.random() * 0.18})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 128, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

export function makeAwningTexture(seed: number) {
  const { c, ctx } = canvas(256, 128);
  const palettes = [
    ["#c8342b", "#f2ede2"],
    ["#1d6f4a", "#f5e9c8"],
    ["#1b4e8a", "#e8e2d2"],
    ["#d98b0d", "#3b2a14"],
  ];
  const [a, b] = palettes[seed % palettes.length]!;
  ctx.fillStyle = b!;
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = a!;
  for (let x = 0; x < 256; x += 42) ctx.fillRect(x, 0, 21, 128);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let i = 0; i < 400; i++) ctx.fillRect(Math.random() * 256, Math.random() * 128, 2, 2);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function makeFootpathTexture() {
  const { c, ctx } = canvas(256, 256);
  ctx.fillStyle = "#9a9287";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(60,55,50,0.45)";
  ctx.lineWidth = 2;
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  for (let x = 0; x < 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(40,36,30,${Math.random() * 0.25})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 60);
  return tex;
}

export function makeShutterTexture() {
  const { c, ctx } = canvas(128, 128);
  ctx.fillStyle = "#6f7a80";
  ctx.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 6) {
    ctx.fillStyle = y % 12 === 0 ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.2)";
    ctx.fillRect(0, y, 128, 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
