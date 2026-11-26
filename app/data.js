// Data keluarga Mahesa — fiksi, konsisten antar halaman dan bulan.
// Semua angka dalam Rupiah. Nov 2026 adalah bulan berjalan.
export const CATEGORIES = [
  { id: "makan", name: "Makan & Belanja", color: "#e07856", icon: "🍲" },
  { id: "transport", name: "Transport", color: "#3f8f7b", icon: "🛵" },
  { id: "tagihan", name: "Tagihan Rumah", color: "#5b7ec9", icon: "🏠" },
  { id: "pendidikan", name: "Pendidikan", color: "#8a63b8", icon: "📚" },
  { id: "kesehatan", name: "Kesehatan", color: "#c95d7e", icon: "🩺" },
  { id: "hiburan", name: "Hiburan", color: "#d9a441", icon: "🎬" },
  { id: "tabungan", name: "Tabungan", color: "#2f7d5b", icon: "💰" },
];

export const INCOME_KINDS = [
  { id: "gaji", name: "Gaji" },
  { id: "usaha", name: "Usaha sampingan" },
];

export const MONTHS = [
  { id: "2026-09", label: "September 2026", short: "Sep" },
  { id: "2026-10", label: "Oktober 2026", short: "Okt" },
  { id: "2026-11", label: "November 2026", short: "Nov" },
];

export const BUDGETS = {
  "2026-09": { makan: 3400000, transport: 1100000, tagihan: 2700000, pendidikan: 1400000, kesehatan: 700000, hiburan: 800000, tabungan: 1800000 },
  "2026-10": { makan: 3500000, transport: 1200000, tagihan: 2800000, pendidikan: 1500000, kesehatan: 800000, hiburan: 900000, tabungan: 2000000 },
  "2026-11": { makan: 3500000, transport: 1200000, tagihan: 2800000, pendidikan: 1500000, kesehatan: 800000, hiburan: 900000, tabungan: 2000000 },
};

export const INCOME = {
  "2026-09": [{ kind: "gaji", amount: 12500000, note: "Gaji Ayah — 1 Sep" }, { kind: "usaha", amount: 2200000, note: "Jualan kue Ibu — Sep" }],
  "2026-10": [{ kind: "gaji", amount: 12500000, note: "Gaji Ayah — 1 Okt" }, { kind: "usaha", amount: 2800000, note: "Jualan kue Ibu — Okt" }],
  "2026-11": [{ kind: "gaji", amount: 12500000, note: "Gaji Ayah — 1 Nov" }, { kind: "usaha", amount: 2500000, note: "Jualan kue Ibu — Nov" }],
};

// Transaksi: id, tanggal, deskripsi, kategori, jumlah. Jumlah per kategori
// dijumlahkan di mana-mana, jadi angka dashboard, anggaran, dan laporan sama.
export const TRANSACTIONS = [
  // September 2026
  { id: "sep-01", date: "2026-09-03", desc: "Belanja pasar mingguan", cat: "makan", amount: 430000 },
  { id: "sep-02", date: "2026-09-05", desc: "Bensin motor", cat: "transport", amount: 280000 },
  { id: "sep-03", date: "2026-09-06", desc: "Listrik PLN", cat: "tagihan", amount: 610000 },
  { id: "sep-04", date: "2026-09-07", desc: "SPP sekolah Rani", cat: "pendidikan", amount: 800000 },
  { id: "sep-05", date: "2026-09-09", desc: "Supermarket bulanan", cat: "makan", amount: 590000 },
  { id: "sep-06", date: "2026-09-11", desc: "Air PDAM", cat: "tagihan", amount: 300000 },
  { id: "sep-07", date: "2026-09-13", desc: "Internet rumah", cat: "tagihan", amount: 450000 },
  { id: "sep-08", date: "2026-09-15", desc: "Buku & alat tulis", cat: "pendidikan", amount: 320000 },
  { id: "sep-09", date: "2026-09-17", desc: "Belanja pasar mingguan", cat: "makan", amount: 460000 },
  { id: "sep-10", date: "2026-09-19", desc: "Bensin motor", cat: "transport", amount: 260000 },
  { id: "sep-11", date: "2026-09-21", desc: "Apotek & vitamin", cat: "kesehatan", amount: 230000 },
  { id: "sep-12", date: "2026-09-23", desc: "Nonton bioskop keluarga", cat: "hiburan", amount: 190000 },
  { id: "sep-13", date: "2026-09-25", desc: "Pindah ke tabungan", cat: "tabungan", amount: 1000000 },
  { id: "sep-14", date: "2026-09-27", desc: "Supermarket & dapur", cat: "makan", amount: 520000 },
  { id: "sep-15", date: "2026-09-29", desc: "Iuran RT & kebersihan", cat: "tagihan", amount: 150000 },
  // Oktober 2026
  { id: "okt-01", date: "2026-10-02", desc: "Belanja pasar mingguan", cat: "makan", amount: 440000 },
  { id: "okt-02", date: "2026-10-04", desc: "Bensin motor", cat: "transport", amount: 300000 },
  { id: "okt-03", date: "2026-10-05", desc: "Listrik PLN", cat: "tagihan", amount: 640000 },
  { id: "okt-04", date: "2026-10-07", desc: "SPP sekolah Rani", cat: "pendidikan", amount: 800000 },
  { id: "okt-05", date: "2026-10-08", desc: "Supermarket bulanan", cat: "makan", amount: 610000 },
  { id: "okt-06", date: "2026-10-10", desc: "Air PDAM", cat: "tagihan", amount: 320000 },
  { id: "okt-07", date: "2026-10-12", desc: "Internet rumah", cat: "tagihan", amount: 450000 },
  { id: "okt-08", date: "2026-10-14", desc: "Les matematika Rani", cat: "pendidikan", amount: 350000 },
  { id: "okt-09", date: "2026-10-16", desc: "Belanja pasar mingguan", cat: "makan", amount: 470000 },
  { id: "okt-10", date: "2026-10-18", desc: "Periksa gigi Budi", cat: "kesehatan", amount: 280000 },
  { id: "okt-11", date: "2026-10-20", desc: "Bensin motor & parkir", cat: "transport", amount: 290000 },
  { id: "okt-12", date: "2026-10-22", desc: "Streaming & mainan", cat: "hiburan", amount: 260000 },
  { id: "okt-13", date: "2026-10-24", desc: "Pindah ke tabungan", cat: "tabungan", amount: 1000000 },
  { id: "okt-14", date: "2026-10-26", desc: "Supermarket & dapur", cat: "makan", amount: 550000 },
  { id: "okt-15", date: "2026-10-28", desc: "Iuran RT & kebersihan", cat: "tagihan", amount: 150000 },
  { id: "okt-16", date: "2026-10-30", desc: "Pindah ke tabungan", cat: "tabungan", amount: 1000000 },
  // November 2026 (bulan berjalan)
  { id: "nov-01", date: "2026-11-03", desc: "Belanja pasar mingguan", cat: "makan", amount: 450000 },
  { id: "nov-02", date: "2026-11-04", desc: "Bensin motor", cat: "transport", amount: 300000 },
  { id: "nov-03", date: "2026-11-05", desc: "Listrik PLN", cat: "tagihan", amount: 620000 },
  { id: "nov-04", date: "2026-11-06", desc: "SPP sekolah Rani", cat: "pendidikan", amount: 800000 },
  { id: "nov-05", date: "2026-11-08", desc: "Supermarket bulanan", cat: "makan", amount: 620000 },
  { id: "nov-06", date: "2026-11-10", desc: "Air PDAM", cat: "tagihan", amount: 310000 },
  { id: "nov-07", date: "2026-11-11", desc: "Internet rumah", cat: "tagihan", amount: 450000 },
  { id: "nov-08", date: "2026-11-12", desc: "Buku & alat tulis", cat: "pendidikan", amount: 350000 },
  { id: "nov-09", date: "2026-11-14", desc: "Belanja pasar mingguan", cat: "makan", amount: 380000 },
  { id: "nov-10", date: "2026-11-15", desc: "Bensin motor", cat: "transport", amount: 250000 },
  { id: "nov-11", date: "2026-11-17", desc: "Apotek & vitamin", cat: "kesehatan", amount: 250000 },
  { id: "nov-12", date: "2026-11-18", desc: "Gas LPG & galon", cat: "tagihan", amount: 180000 },
  { id: "nov-13", date: "2026-11-19", desc: "Pindah ke tabungan", cat: "tabungan", amount: 1000000 },
  { id: "nov-14", date: "2026-11-20", desc: "Nonton bioskop keluarga", cat: "hiburan", amount: 200000 },
  { id: "nov-15", date: "2026-11-21", desc: "Les matematika Rani", cat: "pendidikan", amount: 200000 },
  { id: "nov-16", date: "2026-11-22", desc: "Supermarket & dapur", cat: "makan", amount: 540000 },
  { id: "nov-17", date: "2026-11-23", desc: "Ojek & parkir", cat: "transport", amount: 120000 },
  { id: "nov-18", date: "2026-11-24", desc: "Periksa kesehatan Ibu", cat: "kesehatan", amount: 180000 },
  { id: "nov-19", date: "2026-11-25", desc: "Streaming bulanan", cat: "hiburan", amount: 150000 },
  { id: "nov-20", date: "2026-11-25", desc: "Pindah ke tabungan", cat: "tabungan", amount: 1000000 },
];

export const BILLS = [
  { id: "bill-listrik", name: "Listrik PLN", amount: 620000, due: 5, cat: "tagihan", paid: true },
  { id: "bill-air", name: "Air PDAM", amount: 310000, due: 10, cat: "tagihan", paid: true },
  { id: "bill-internet", name: "Internet rumah", amount: 450000, due: 11, cat: "tagihan", paid: false },
  { id: "bill-spp", name: "SPP sekolah Rani", amount: 800000, due: 6, cat: "pendidikan", paid: true },
  { id: "bill-iuran", name: "Iuran RT & kebersihan", amount: 150000, due: 28, cat: "tagihan", paid: false },
  { id: "bill-streaming", name: "Streaming bulanan", amount: 150000, due: 25, cat: "hiburan", paid: true },
  { id: "bill-asuransi", name: "Asuransi kesehatan", amount: 375000, due: 15, cat: "kesehatan", paid: false },
];

export const GOALS = [
  { id: "goal-darurat", name: "Dana darurat", target: 20000000, saved: 12500000, note: "6 bulan biaya hidup — prioritas utama keluarga." },
  { id: "goal-liburan", name: "Liburan akhir tahun", target: 8000000, saved: 3200000, note: "Ke pantai bersama Rani dan Budi, Desember." },
  { id: "goal-motor", name: "DP motor baru", target: 15000000, saved: 6750000, note: "Ganti motor lama yang sering mogok." },
  { id: "goal-sekolah", name: "Tabungan sekolah anak", target: 10000000, saved: 4100000, note: "Biaya masuk tahun ajaran baru." },
];

export function monthLabel(id) {
  const m = MONTHS.find((x) => x.id === id);
  return m ? m.label : id;
}

export function catName(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.name : id;
}

export function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : "#888888";
}

export function formatRp(n) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function formatDate(iso) {
  const parts = iso.split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}
