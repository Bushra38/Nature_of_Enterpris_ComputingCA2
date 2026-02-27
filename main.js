// ===============================
// Powerlifting Website - main.js
// Loads machinelearning.csv (comma or tab separated)
// Builds KPIs + Stats + 3 Charts (Chart.js)
// ===============================

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

const CSV_FILE = "machinelearning.csv"; // must be in same folder as index.html

// Utility: safe number
function toNum(v) {
  if (v === null || v === undefined) return NaN;
  const s = String(v).trim();
  if (s === "") return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

// Utility: mean/median/std
function mean(arr) {
  const a = arr.filter(Number.isFinite);
  if (!a.length) return NaN;
  return a.reduce((x, y) => x + y, 0) / a.length;
}
function median(arr) {
  const a = arr.filter(Number.isFinite).slice().sort((x, y) => x - y);
  if (!a.length) return NaN;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}
function stdDev(arr) {
  const a = arr.filter(Number.isFinite);
  if (a.length < 2) return NaN;
  const m = mean(a);
  const v = a.reduce((sum, x) => sum + (x - m) ** 2, 0) / (a.length - 1);
  return Math.sqrt(v);
}

// Detect delimiter (comma or tab)
function detectDelimiter(headerLine) {
  const commaCount = (headerLine.match(/,/g) || []).length;
  const tabCount = (headerLine.match(/\t/g) || []).length;
  return tabCount > commaCount ? "\t" : ",";
}

// Simple parser (works for your dataset)
function parseDelimited(text) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trimEnd())
    .filter(l => l.trim() !== "");

  if (lines.length < 2) return { headers: [], rows: [] };

  const delim = detectDelimiter(lines[0]);
  const headers = lines[0].split(delim).map(h => h.trim());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(delim);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (parts[idx] ?? "").trim();
    });
    rows.push(obj);
  }
  return { headers, rows };
}

// Format numbers nicely
function fmt(n, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtInt(n) {
  if (!Number.isFinite(n)) return "—";
  return Math.round(n).toString();
}

// Build Histogram bins
function makeBins(values, binCount = 10) {
  const v = values.filter(Number.isFinite);
  if (!v.length) return { labels: [], counts: [] };

  const minV = Math.min(...v);
  const maxV = Math.max(...v);

  if (minV === maxV) {
    return { labels: [`${fmtInt(minV)}–${fmtInt(maxV)}`], counts: [v.length] };
  }

  const width = (maxV - minV) / binCount;
  const counts = new Array(binCount).fill(0);
  for (const x of v) {
    let idx = Math.floor((x - minV) / width);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  }
  const labels = [];
  for (let i = 0; i < binCount; i++) {
    const a = minV + i * width;
    const b = minV + (i + 1) * width;
    labels.push(`${fmtInt(a)}–${fmtInt(b)}`);
  }
  return { labels, counts };
}

// Global chart refs (so refresh won’t stack charts)
let scatterChart, histChart, barChart;

async function init() {
  try {
    const res = await fetch(CSV_FILE);
    if (!res.ok) throw new Error(`Failed to load ${CSV_FILE}: ${res.status}`);
    const text = await res.text();

    const { headers, rows } = parseDelimited(text);

    // KPIs
    document.getElementById("kpiRows").textContent = rows.length ? rows.length : "—";
    document.getElementById("kpiCols").textContent = headers.length ? headers.length : "—";
    document.getElementById("kpiUpdated").textContent = new Date().toLocaleDateString();

    // Count missing values in key fields
    const keyFields = ["Age", "BodyweightKg", "BestSquatKg", "BestBenchKg", "BestDeadliftKg", "TotalKg", "Wilks"];
    let missing = 0;
    for (const r of rows) {
      for (const f of keyFields) {
        if (f in r) {
          const v = String(r[f] ?? "").trim();
          if (v === "" || v.toLowerCase() === "na" || v.toLowerCase() === "nan") missing++;
        }
      }
    }
    document.getElementById("kpiMissing").textContent = missing;

    // Pull numeric columns
    const totalVals = rows.map(r => toNum(r["TotalKg"]));
    const meanTotal = mean(totalVals);
    const medTotal = median(totalVals);
    const sdTotal = stdDev(totalVals);
    const maxTotal = Math.max(...totalVals.filter(Number.isFinite));

    document.getElementById("meanTotal").textContent = fmt(meanTotal, 2);
    document.getElementById("medianTotal").textContent = fmt(medTotal, 2);
    document.getElementById("stdevTotal").textContent = fmt(sdTotal, 2);
    document.getElementById("maxTotal").textContent = fmt(maxTotal, 2);

    // -------- Chart 1: Scatter (Bodyweight vs Total) --------
    const scatter = [];
    for (const r of rows) {
      const bw = toNum(r["BodyweightKg"]);
      const tot = toNum(r["TotalKg"]);
      if (Number.isFinite(bw) && Number.isFinite(tot)) {
        scatter.push({ x: bw, y: tot });
      }
    }

    // Downsample if huge (keeps site fast)
    const MAX_POINTS = 300;
    let scatterUse = scatter;
    if (scatter.length > MAX_POINTS) {
      const step = Math.ceil(scatter.length / MAX_POINTS);
      scatterUse = scatter.filter((_, i) => i % step === 0);
    }

    if (scatterChart) scatterChart.destroy();
    scatterChart = new Chart(document.getElementById("scatterChart"), {
      type: "scatter",
      data: { datasets: [{ label: "Lifters", data: scatterUse }] },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Bodyweight (Kg)" } },
          y: { title: { display: true, text: "Total (Kg)" } }
        }
      }
    });

    // -------- Chart 2: Histogram (TotalKg distribution) --------
    const { labels, counts } = makeBins(totalVals, 10);
    if (histChart) histChart.destroy();
    histChart = new Chart(document.getElementById("histChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Frequency", data: counts }]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "TotalKg bins" } },
          y: { title: { display: true, text: "Count" } }
        }
      }
    });

    // -------- Chart 3: Avg Total by Equipment --------
    const equipMap = new Map(); // equip -> {sum, count}
    for (const r of rows) {
      const eq = (r["Equipment"] || "").trim() || "Unknown";
      const tot = toNum(r["TotalKg"]);
      if (!Number.isFinite(tot)) continue;

      if (!equipMap.has(eq)) equipMap.set(eq, { sum: 0, count: 0 });
      const obj = equipMap.get(eq);
      obj.sum += tot;
      obj.count += 1;
    }

    const equipLabels = Array.from(equipMap.keys());
    const equipAvg = equipLabels.map(k => {
      const { sum, count } = equipMap.get(k);
      return count ? sum / count : 0;
    });

    if (barChart) barChart.destroy();
    barChart = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: equipLabels,
        datasets: [{ label: "Average TotalKg", data: equipAvg }]
      },
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: "Average Total (Kg)" } }
        }
      }
    });

  } catch (err) {
    console.error(err);
    alert("Error loading data/charts. Open Console (F12) to see details.");
  }
}

// Run after page loads
init();