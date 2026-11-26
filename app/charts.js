// Chart SVG murni — tanpa library. Tiga jenis: garis, batang, donat.
// Semua fungsi menerima data polos dan mengembalikan string SVG.
import { formatRp } from "./data.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

export function lineChart(points, opts) {
  const w = (opts && opts.width) || 640;
  const h = (opts && opts.height) || 220;
  const padL = 92, padR = 14, padT = 14, padB = 28;
  const max = Math.max.apply(null, points.map((p) => p.value).concat([1]));
  const stepX = points.length > 1 ? (w - padL - padR) / (points.length - 1) : 0;
  const y = (v) => padT + (h - padT - padB) * (1 - v / max);
  const x = (i) => padL + i * stepX;
  let dots = "";
  let path = "";
  points.forEach((p, i) => {
    path += (i === 0 ? "M " : " L ") + x(i).toFixed(1) + " " + y(p.value).toFixed(1);
    dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.value).toFixed(1) + '" r="4.5" fill="#2f7d5b"><title>' + esc(p.label) + ": " + formatRp(p.value) + '</title></circle>';
    dots += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="12" fill="#5c665f">' + esc(p.label) + "</text>";
  });
  const grid = [0, 0.5, 1].map((f) => {
    const gy = padT + (h - padT - padB) * (1 - f);
    return '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" stroke="#e3e8e4" stroke-width="1"/><text x="' + (padL - 6) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="11" fill="#7a847e">' + formatRp(max * f) + "</text>";
  }).join("");
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Grafik garis tren pengeluaran">' + grid +
    '<path d="' + path + '" fill="none" stroke="#2f7d5b" stroke-width="3" stroke-linejoin="round"/>' + dots + "</svg>";
}

export function barChart(items, opts) {
  const w = (opts && opts.width) || 640;
  const h = (opts && opts.height) || 240;
  const max = Math.max.apply(null, items.map((i) => i.value).concat([1]));
  const bw = Math.min(64, (w - 20) / items.length - 14);
  const gap = (w - bw * items.length) / (items.length + 1);
  let bars = "";
  items.forEach((it, i) => {
    const bh = Math.max(4, (h - 52) * (it.value / max));
    const bx = gap + i * (bw + gap);
    const by = h - 32 - bh;
    bars += '<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '" rx="6" fill="' + it.color + '"><title>' + esc(it.label) + ": " + formatRp(it.value) + "</title></rect>";
    bars += '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (by - 6) + '" text-anchor="middle" font-size="11" fill="#33413a">' + formatRp(it.value) + "</text>";
    bars += '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (h - 12) + '" text-anchor="middle" font-size="12" fill="#5c665f">' + esc(it.label) + "</text>";
  });
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Grafik batang">' + bars + "</svg>";
}

export function donutChart(items, opts) {
  const size = (opts && opts.size) || 240;
  const cx = size / 2, cy = size / 2, r = size / 2 - 18, inner = r - 34;
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  let angle = -Math.PI / 2;
  let paths = "";
  items.forEach((it) => {
    if (it.value <= 0) return;
    const frac = it.value / total;
    const a2 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const x3 = cx + inner * Math.cos(a2), y3 = cy + inner * Math.sin(a2);
    const x4 = cx + inner * Math.cos(angle), y4 = cy + inner * Math.sin(angle);
    paths += '<path d="M ' + x1.toFixed(1) + " " + y1.toFixed(1) + " A " + r + " " + r + " 0 " + large + " 1 " + x2.toFixed(1) + " " + y2.toFixed(1) +
      " L " + x3.toFixed(1) + " " + y3.toFixed(1) + " A " + inner + " " + inner + " 0 " + large + " 0 " + x4.toFixed(1) + " " + y4.toFixed(1) +
      ' Z" fill="' + it.color + '"><title>' + esc(it.label) + ": " + formatRp(it.value) + "</title></path>";
    angle = a2;
  });
  const legend = items.map((it) => '<span class="legend-item"><i style="background:' + it.color + '"></i>' + esc(it.label) + " — " + formatRp(it.value) + "</span>").join("");
  return '<div class="donut-wrap"><svg viewBox="0 0 ' + size + " " + size + '" role="img" aria-label="Grafik donat per kategori">' + paths +
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="13" fill="#5c665f">Total</text>' +
    '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="15" font-weight="700" fill="#1d2b25">' + formatRp(total) + "</text></svg>" +
    '<div class="legend">' + legend + "</div></div>";
}
