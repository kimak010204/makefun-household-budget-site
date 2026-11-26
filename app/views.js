// Tampilan tiap halaman: mengubah data bulan berjalan menjadi HTML.
// Semua angka dihitung dari transaksi + anggaran bulan itu, jadi konsisten.
import { CATEGORIES, MONTHS, BILLS, GOALS, INCOME, monthLabel, catName, catColor, formatRp, formatDate } from "./data.js";
import { lineChart, barChart, donutChart } from "./charts.js";

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function monthTotals(state, monthId) {
  const income = (INCOME[monthId] || []).reduce((s, i) => s + i.amount, 0);
  const txs = state.transactions.filter((t) => t.date.slice(0, 7) === monthId);
  const spent = txs.reduce((s, t) => s + t.amount, 0);
  const byCat = {};
  CATEGORIES.forEach((c) => { byCat[c.id] = 0; });
  txs.forEach((t) => { if (byCat[t.cat] !== undefined) byCat[t.cat] += t.amount; });
  return { income, spent, left: income - spent, byCat, txs };
}

export function progressBar(used, limit) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const cls = pct > 100 ? "over" : pct > 85 ? "warn" : "";
  return '<div class="bar"><div class="bar-fill ' + cls + '" style="width:' + Math.min(100, pct) + '%"></div></div>' +
    '<div class="bar-meta"><span>' + pct + '% terpakai</span><span>Sisa ' + formatRp(Math.max(0, limit - used)) + "</span></div>";
}

function monthPicker(state) {
  return '<label class="month-picker">Bulan <select id="month-select" aria-label="Pilih bulan">' +
    MONTHS.map((m) => '<option value="' + m.id + '"' + (m.id === state.month ? " selected" : "") + ">" + m.label + "</option>").join("") +
    "</select></label>";
}

function chartToggle(state) {
  const kinds = [["line", "Garis"], ["bar", "Batang"], ["donut", "Donat"]];
  return '<div class="seg" role="group" aria-label="Jenis grafik">' +
    kinds.map(([k, label]) => '<button type="button" data-chart="' + k + '" class="' + (state.chart === k ? "active" : "") + '" aria-pressed="' + (state.chart === k) + '">' + label + "</button>").join("") +
    "</div>";
}

export function viewDashboard(state) {
  const t = monthTotals(state, state.month);
  const trend = MONTHS.map((m) => {
    const mt = monthTotals(state, m.id);
    return { label: m.short, value: mt.spent };
  });
  const catItems = CATEGORIES.map((c) => ({ label: c.name, value: t.byCat[c.id], color: c.color }));
  let chartHtml = "";
  if (state.chart === "line") chartHtml = lineChart(trend);
  else if (state.chart === "bar") chartHtml = barChart(trend.map((p) => ({ label: p.label, value: p.value, color: "#2f7d5b" })));
  else chartHtml = donutChart(catItems.filter((i) => i.value > 0));
  const recent = t.txs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const isUnpaid = (b) => !(state.paidBills[b.id] ?? b.paid);
  const unpaidCount = BILLS.filter(isUnpaid).length;
  const unpaidSum = BILLS.filter((b) => !(state.paidBills[b.id] ?? b.paid)).reduce((s, b) => s + b.amount, 0);
  return '<section class="hero"><div><p class="eyebrow">Keluarga Mahesa · ' + monthLabel(state.month) + '</p>' +
    "<h1>Uang keluarga terkendali, tanpa tebak-tebakan.</h1>" +
    "<p>Saldo, pemasukan, dan pengeluaran bulan ini dalam satu layar. Semua angka dihitung dari transaksi nyata keluarga Mahesa — ubah bulan di atas, angkanya ikut berubah.</p>" +
    '<p><a class="btn" href="#/transaksi">+ Tambah transaksi</a> <a class="btn ghost" href="#/anggaran">Lihat anggaran</a></p></div>' +
    '<div class="hero-card"><span>Saldo dompet keluarga</span><strong>' + formatRp(8450000 + t.left) + "</strong><span>Per 25 Nov 2026 · sudah termasuk sisa bulan ini</span></div></section>" +
    '<section class="cards">' +
    '<article class="stat"><span>Pemasukan ' + monthLabel(state.month) + '</span><strong>' + formatRp(t.income) + "</strong><small>Gaji " + formatRp(12500000) + " + usaha sampingan " + formatRp(t.income - 12500000) + "</small></article>" +
    '<article class="stat"><span>Pengeluaran</span><strong>' + formatRp(t.spent) + "</strong><small>Dari " + t.txs.length + " transaksi tercatat</small></article>" +
    '<article class="stat good"><span>Sisa bulan ini</span><strong>' + formatRp(t.left) + "</strong><small>" + Math.round((t.left / t.income) * 100) + "% dari pemasukan belum terpakai</small></article>" +
    '<article class="stat warn"><span>Tagihan belum lunas</span><strong>' + unpaidCount + " tagihan · " + formatRp(unpaidSum) + '</strong><small><a href="#/tagihan">Lihat tagihan →</a></small></article>' +
    "</section>" +
    '<section class="panel"><div class="panel-head"><h2>Tren pengeluaran · Sep – Nov 2026</h2>' + chartToggle(state) + monthPicker(state) + "</div>" + chartHtml +
    '<p class="hint">Pengeluaran November Rp 8.350.000 — naik dari Rp 7.910.000 di Oktober karena tabungan dipindahkan dua kali di awal dan akhir bulan. September Rp 6.590.000.</p></section>' +
    '<section class="panel"><div class="panel-head"><h2>Transaksi terbaru — ' + monthLabel(state.month) + '</h2><a href="#/transaksi">Semua transaksi →</a></div>' +
    '<table class="tbl"><thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead><tbody>' +
    recent.map((x) => "<tr><td>" + formatDate(x.date) + "</td><td>" + esc(x.desc) + "</td><td>" + esc(catName(x.cat)) + '</td><td class="num">' + formatRp(x.amount) + "</td></tr>").join("") +
    "</tbody></table></section>";
}

export function viewBudget(state) {
  const t = monthTotals(state, state.month);
  const budgets = state.budgets[state.month];
  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const rows = CATEGORIES.map((c) => {
    const used = t.byCat[c.id];
    const limit = budgets[c.id];
    return '<article class="budget-row"><div class="budget-top"><span class="cat-dot" style="background:' + c.color + '"></span><strong>' + c.icon + " " + c.name + "</strong><span>" + formatRp(used) + " / " + formatRp(limit) + "</span></div>" +
      progressBar(used, limit) +
      '<label>Ubah anggaran <input type="number" min="0" step="50000" value="' + limit + '" data-budget-cat="' + c.id + '" aria-label="Anggaran ' + esc(c.name) + '"> <button type="button" class="btn small" data-save-budget="' + c.id + '">Simpan</button></label></article>';
  }).join("");
  return '<section class="page-head"><h1>Anggaran Bulanan</h1><p>' + monthLabel(state.month) + ' · Total anggaran ' + formatRp(totalBudget) + ' · terpakai ' + formatRp(t.spent) + ' (' + Math.round((t.spent / totalBudget) * 100) + '%)</p>' + monthPicker(state) + "</section>" +
    '<section class="panel"><h2>Metode 50 / 30 / 20</h2><p>Dari pemasukan ' + formatRp(t.income) + ': kebutuhan 50% (' + formatRp(t.income * 0.5) + '), keinginan 30% (' + formatRp(t.income * 0.3) + '), tabungan 20% (' + formatRp(t.income * 0.2) + '). Keluarga Mahesa menabung ' + formatRp(t.byCat.tabungan) + ' bulan ini — ' + Math.round((t.byCat.tabungan / t.income) * 100) + '% dari pemasukan.</p></section>' +
    '<section class="budget-grid">' + rows + "</section>" +
    '<p class="hint">Anggaran yang diubah tersimpan di peramban ini dan langsung mengubah sisa di halaman ini dan di Dashboard.</p>';
}

export function viewTransactions(state) {
  const t = monthTotals(state, state.month);
  let list = t.txs.slice().sort((a, b) => b.date.localeCompare(a.date));
  if (state.filterCat !== "semua") list = list.filter((x) => x.cat === state.filterCat);
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter((x) => x.desc.toLowerCase().includes(q) || catName(x.cat).toLowerCase().includes(q));
  }
  if (state.sortKey) {
    const k = state.sortKey, dir = state.sortDir === "desc" ? -1 : 1;
    list.sort((a, b) => {
      if (k === "amount") return (a.amount - b.amount) * dir;
      if (k === "date") return a.date.localeCompare(b.date) * dir;
      return a.desc.localeCompare(b.desc) * dir;
    });
  }
  const total = list.reduce((s, x) => s + x.amount, 0);
  const arrow = (k) => state.sortKey === k ? (state.sortDir === "desc" ? " ▼" : " ▲") : "";
  return '<section class="page-head"><h1>Transaksi</h1><p>' + monthLabel(state.month) + ' · ' + list.length + " transaksi · total " + formatRp(total) + "</p>" + monthPicker(state) + "</section>" +
    '<section class="panel"><h2>Tambah transaksi</h2><form id="add-form" class="form-grid">' +
    '<label>Tanggal <input type="date" id="f-date" value="2026-11-26" required></label>' +
    '<label>Deskripsi <input type="text" id="f-desc" placeholder="cth. Belanja pasar" required></label>' +
    '<label>Kategori <select id="f-cat">' + CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.name + "</option>").join("") + "</select></label>" +
    '<label>Jumlah (Rp) <input type="number" id="f-amount" min="1000" step="1000" placeholder="150000" required></label>' +
    '<button class="btn" type="submit">Simpan transaksi</button></form>' +
    '<p class="hint" id="add-status" role="status"></p></section>' +
    '<section class="panel"><div class="toolbar"><label>Cari <input type="search" id="tx-search" placeholder="Cari deskripsi / kategori…" value="' + esc(state.search) + '"></label>' +
    '<label>Filter kategori <select id="tx-filter"><option value="semua">Semua kategori</option>' +
    CATEGORIES.map((c) => '<option value="' + c.id + '"' + (state.filterCat === c.id ? " selected" : "") + ">" + c.name + "</option>").join("") + "</select></label></div>" +
    '<table class="tbl"><thead><tr><th><button type="button" class="th-sort" data-sort="date">Tanggal' + arrow("date") + '</button></th><th><button type="button" class="th-sort" data-sort="desc">Deskripsi' + arrow("desc") + '</button></th><th>Kategori</th><th><button type="button" class="th-sort" data-sort="amount">Jumlah' + arrow("amount") + "</button></th><th></th></tr></thead><tbody>" +
    (list.length ? list.map((x) => "<tr><td>" + formatDate(x.date) + "</td><td>" + esc(x.desc) + "</td><td>" + esc(catName(x.cat)) + '</td><td class="num">' + formatRp(x.amount) + '</td><td><button type="button" class="link-btn" data-delete="' + x.id + '">Hapus</button></td></tr>').join("") : '<tr><td colspan="5">Tidak ada transaksi yang cocok. Ubah pencarian atau filter.</td></tr>') +
    "</tbody></table></section>";
}

export function viewBills(state) {
  const rows = BILLS.map((b) => {
    const paid = state.paidBills[b.id] ?? b.paid;
    return '<article class="bill-row ' + (paid ? "paid" : "due") + '"><div><strong>' + esc(b.name) + "</strong><span>Jatuh tempo tiap tanggal " + b.due + " · " + esc(catName(b.cat)) + "</span></div>" +
      '<div class="bill-right"><strong>' + formatRp(b.amount) + "</strong>" +
      (paid ? '<span class="badge ok">✓ Lunas</span>' : '<span class="badge due">Belum lunas</span><button type="button" class="btn small" data-pay-bill="' + b.id + '">Tandai lunas</button>') + "</div></article>";
  }).join("");
  const unpaidSum = BILLS.filter((b) => !(state.paidBills[b.id] ?? b.paid)).reduce((s, b) => s + b.amount, 0);
  const paidSum = BILLS.filter((b) => state.paidBills[b.id] ?? b.paid).reduce((s, b) => s + b.amount, 0);
  return '<section class="page-head"><h1>Tagihan &amp; Langganan</h1><p>November 2026 · sudah lunas ' + formatRp(paidSum) + ' · masih harus dibayar ' + formatRp(unpaidSum) + "</p></section>" +
    '<section class="panel"><h2>Jadwal tagihan bulan ini</h2><div class="bill-list">' + rows + "</div>" +
    '<p class="hint">Menandai lunas tersimpan di peramban ini. Tagihan yang sudah lunas tidak dihitung lagi di “belum lunas” di Dashboard.</p></section>' +
    '<section class="panel"><h2>Langganan aktif</h2><ul class="clean"><li>Internet rumah — Rp 450.000 / bulan, jatuh tempo tanggal 11.</li><li>Streaming bulanan — Rp 150.000 / bulan, jatuh tempo tanggal 25.</li><li>Asuransi kesehatan — Rp 375.000 / bulan, jatuh tempo tanggal 15.</li></ul><p>Tip: gabungkan langganan yang jarang dipakai — keluarga Mahesa sudah berhenti satu layanan musik (hemat Rp 59.000 / bulan).</p></section>';
}

export function viewSavings(state) {
  const t = monthTotals(state, state.month);
  const cards = GOALS.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return '<article class="goal-card"><h3>' + esc(g.name) + "</h3><p>" + esc(g.note) + "</p>" +
      '<div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      "<p><strong>" + formatRp(g.saved) + "</strong> dari " + formatRp(g.target) + " · " + pct + "% · kurang " + formatRp(g.target - g.saved) + "</p></article>";
  }).join("");
  return '<section class="page-head"><h1>Tabungan &amp; Tujuan</h1><p>Tabungan bulan ini (' + monthLabel(state.month) + "): " + formatRp(t.byCat.tabungan) + " · total terkumpul semua tujuan " + formatRp(GOALS.reduce((s, g) => s + g.saved, 0)) + "</p>" + monthPicker(state) + "</section>" +
    '<section class="goal-grid">' + cards + "</section>" +
    '<section class="panel"><h2>Cara keluarga Mahesa menabung</h2><ol><li>Pindahkan tabungan di awal bulan, begitu gaji masuk — jangan menunggu sisa.</li><li>Satu rekening terpisah untuk dana darurat, jangan dicampur belanja harian.</li><li>Setiap ada pemasukan usaha sampingan, 50% langsung masuk tabungan.</li></ol></section>';
}

export function viewReport(state) {
  const catItems = CATEGORIES.map((c) => {
    const total = MONTHS.reduce((s, m) => s + monthTotals(state, m.id).byCat[c.id], 0);
    return { label: c.name, value: total, color: c.color };
  });
  const monthItems = MONTHS.map((m) => ({ label: m.short, value: monthTotals(state, m.id).spent, color: "#2f7d5b" }));
  const t = monthTotals(state, state.month);
  const biggest = CATEGORIES.map((c) => ({ name: c.name, v: t.byCat[c.id] })).sort((a, b) => b.v - a.v)[0];
  return '<section class="page-head"><h1>Laporan</h1><p>Perbandingan Sep – Nov 2026 · ' + monthLabel(state.month) + " dipilih di bawah</p>" + monthPicker(state) + "</section>" +
    '<section class="panel"><div class="panel-head"><h2>Pengeluaran per bulan</h2>' + chartToggle(state) + "</div>" +
    (state.chart === "donut" ? donutChart(catItems.filter((i) => i.value > 0)) : state.chart === "bar" ? barChart(monthItems) : lineChart(monthItems.map((m) => ({ label: m.label, value: m.value })))) +
    '<p class="hint">Total 3 bulan: ' + formatRp(monthItems.reduce((s, m) => s + m.value, 0)) + ". Rata-rata per bulan " + formatRp(monthItems.reduce((s, m) => s + m.value, 0) / 3) + ".</p></section>" +
    '<section class="panel"><h2>Pengeluaran per kategori (3 bulan)</h2>' + barChart(catItems) + "</section>" +
    '<section class="panel"><h2>Tips hemat untuk keluarga Mahesa</h2><ul><li><strong>' + esc(biggest.name) + " paling besar bulan ini (" + formatRp(biggest.v) + ").</strong> Belanja pasar 2x seminggu dengan daftar belanja bisa memangkas Rp 200.000–300.000 per bulan.</li><li>Transport Rp 670.000: gabungkan perjalanan dan kurangi ojek — target Rp 550.000 bulan depan.</li><li>Hiburan Rp 350.000: satu malam film di rumah menggantikan satu kali bioskop (hemat sekitar Rp 120.000).</li><li>Tagihan listrik Rp 620.000: matikan lampu di siang hari dan cabut pengisi daya yang tidak dipakai.</li></ul></section>";
}

export function viewGuide() {
  return '<section class="page-head"><h1>Panduan &amp; Metode</h1><p>Cara memakai situs ini dan metode 50/30/20 untuk keluarga.</p></section>' +
    '<section class="panel"><h2>Metode 50 / 30 / 20</h2><p><strong>50% kebutuhan</strong> — makan, tagihan rumah, transport, pendidikan, kesehatan. <strong>30% keinginan</strong> — hiburan, makan di luar, langganan. <strong>20% tabungan</strong> — dana darurat dulu, lalu tujuan lain.</p><p>Contoh dari pemasukan keluarga Mahesa Rp 15.000.000: kebutuhan Rp 7.500.000, keinginan Rp 4.500.000, tabungan Rp 3.000.000.</p></section>' +
    '<section class="panel"><h2>Cara memakai situs ini</h2><ol><li><strong>Dashboard</strong> — lihat saldo, sisa bulan, dan tren pengeluaran.</li><li><strong>Anggaran</strong> — atur batas tiap kategori, lalu simpan.</li><li><strong>Transaksi</strong> — catat setiap pengeluaran lewat form; cari, filter, dan urutkan tabelnya.</li><li><strong>Tagihan</strong> — tandai lunas begitu dibayar, supaya tidak terlewat.</li><li><strong>Tabungan</strong> — pantau progress tiap tujuan.</li><li><strong>Laporan</strong> — bandingkan bulan dan kategori, baca tips hematnya.</li></ol><p>Semua perubahan tersimpan di peramban ini (localStorage) dan situs tetap jalan tanpa internet.</p></section>' +
    '<section class="panel"><h2>Pertanyaan yang sering ditanya</h2><dl><dt>Apakah datanya nyata?</dt><dd>Data keluarga Mahesa adalah contoh fiksi yang konsisten — angka di semua halaman dihitung dari transaksi yang sama.</dd><dt>Apakah transaksi saya tersimpan?</dt><dd>Ya, di peramban ini saja. Hapus data peramban berarti transaksi tambahan ikut hilang; data contoh tetap ada.</dd><dt>Bisakah dipakai di HP?</dt><dd>Bisa — tata letak menyesuaikan layar kecil, tabel bisa digeser, dan semua tombol tetap bisa ditekan.</dd></dl></section>';
}
