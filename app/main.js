// Titik masuk situs: state, render, dan semua pengendali (event) halaman.
import { TRANSACTIONS, BUDGETS, BILLS } from "./data.js";
import { parseRoute, navLinks } from "./router.js";
import { viewDashboard, viewBudget, viewTransactions, viewBills, viewSavings, viewReport, viewGuide } from "./views.js";

const STORE_KEY = "mahesa-budget-v1";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveStored(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      extra: state.extra,
      budgets: state.budgets,
      paidBills: state.paidBills,
    }));
  } catch (e) { /* penyimpanan penuh atau dimatikan: situs tetap jalan */ }
}

const stored = loadStored() || {};
const state = {
  month: "2026-11",
  chart: "line",
  filterCat: "semua",
  search: "",
  sortKey: "",
  sortDir: "asc",
  extra: stored.extra || [],
  budgets: stored.budgets || JSON.parse(JSON.stringify(BUDGETS)),
  paidBills: stored.paidBills || {},
  get transactions() {
    return TRANSACTIONS.concat(this.extra);
  },
};

const VIEWS = {
  "/dashboard": viewDashboard,
  "/anggaran": viewBudget,
  "/transaksi": viewTransactions,
  "/tagihan": viewBills,
  "/tabungan": viewSavings,
  "/laporan": viewReport,
  "/panduan": viewGuide,
};

function render() {
  const route = parseRoute(window.location.hash);
  const app = document.getElementById("app");
  const view = VIEWS[route] || viewDashboard;
  app.innerHTML = view(state);
  document.getElementById("nav").innerHTML = navLinks(route);
  document.title = "Anggaran Keluarga Mahesa — " + route.slice(1);
  wireControls(route);
}

function wireControls(route) {
  document.querySelectorAll("#month-select").forEach((sel) => {
    sel.addEventListener("change", () => { state.month = sel.value; render(); });
  });
  document.querySelectorAll("[data-chart]").forEach((btn) => {
    btn.addEventListener("click", () => { state.chart = btn.dataset.chart; render(); });
  });
  const form = document.getElementById("add-form");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const desc = document.getElementById("f-desc").value.trim();
      const amount = Number(document.getElementById("f-amount").value);
      const date = document.getElementById("f-date").value;
      const cat = document.getElementById("f-cat").value;
      if (!desc || !amount || amount <= 0 || !date) return;
      state.extra.push({ id: "user-" + Date.now(), date, desc, cat, amount });
      saveStored(state);
      state.month = date.slice(0, 7);
      const status = document.getElementById("add-status");
      if (status) status.textContent = "Tersimpan: " + desc + " — " + amount.toLocaleString("id-ID") + " rupiah.";
      render();
    });
  }
  const search = document.getElementById("tx-search");
  if (search) {
    // Ketik tanpa kehilangan fokus: render ulang lalu kembalikan kursor ke akhir.
    search.addEventListener("input", () => {
      state.search = search.value;
      const pos = search.selectionStart;
      render();
      const again = document.getElementById("tx-search");
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
    });
  }
  const filter = document.getElementById("tx-filter");
  if (filter) filter.addEventListener("change", () => { state.filterCat = filter.value; render(); });
  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.sort;
      if (state.sortKey === k) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      else { state.sortKey = k; state.sortDir = "asc"; }
      render();
    });
  });
  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.extra = state.extra.filter((x) => x.id !== btn.dataset.delete);
      saveStored(state);
      render();
    });
  });
  document.querySelectorAll("[data-save-budget]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.querySelector('[data-budget-cat="' + btn.dataset.saveBudget + '"]');
      const v = Number(input.value);
      if (v >= 0) {
        state.budgets[state.month][btn.dataset.saveBudget] = v;
        saveStored(state);
        render();
      }
    });
  });
  document.querySelectorAll("[data-pay-bill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.paidBills[btn.dataset.payBill] = true;
      saveStored(state);
      render();
    });
  });
}

window.addEventListener("hashchange", render);
render();
