// Router hash: memetakan hash ke nama halaman dan judulnya.
export const ROUTES = {
  "/dashboard": { title: "Dashboard", label: "Dashboard" },
  "/anggaran": { title: "Anggaran Bulanan", label: "Anggaran" },
  "/transaksi": { title: "Transaksi", label: "Transaksi" },
  "/tagihan": { title: "Tagihan & Langganan", label: "Tagihan" },
  "/tabungan": { title: "Tabungan & Tujuan", label: "Tabungan" },
  "/laporan": { title: "Laporan", label: "Laporan" },
  "/panduan": { title: "Panduan & Metode", label: "Panduan" },
};

export function parseRoute(hash) {
  const path = (hash || "").replace(/^#/, "") || "/dashboard";
  return ROUTES[path] ? path : "/dashboard";
}

export function navLinks(active) {
  return Object.entries(ROUTES).map(([path, r]) =>
    '<a href="#' + path + '"' + (path === active ? ' aria-current="page" class="active"' : "") + ">" + r.label + "</a>"
  ).join("");
}
