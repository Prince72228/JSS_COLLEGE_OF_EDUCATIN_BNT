import { ensureInitialized, listenExpenses } from "./firebase.js";

function formatRs(n) {
  const val = Number(n) || 0;
  return `Rs. ${val.toLocaleString("en-IN")}`;
}

async function boot() {
  if (location.protocol === "file:") {
    document.body.dataset.localfile = "true";
  }

  await ensureInitialized();

  let expenses = [];

  const unsub = listenExpenses((rows) => {
    expenses = rows;
    const tbody = document.querySelector("#expenseTbody");
    if (tbody) {
      tbody.innerHTML = expenses
        .map((e) => `
          <tr>
            <td>${e.reason ?? ""}</td>
            <td class="mono">${formatRs(e.amount)}</td>
          </tr>
        `)
        .join("");
    }

    const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const totalEl = document.querySelector("#totalExpenses");
    if (totalEl) totalEl.textContent = formatRs(total);
  });

  document.querySelector("#downloadPdf")?.addEventListener("click", () => {
    if (!window.jspdf?.jsPDF) return alert("jsPDF not loaded");
    const doc = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("JSS College of Education Banahatti", 40, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Finance Report – Expenses", 40, 72);

    let y = 110;
    doc.setFont("helvetica", "bold");
    doc.text("Reason", 40, y);
    doc.text("Amount", 420, y);
    y += 12;
    doc.setDrawColor(220);
    doc.line(40, y, 555, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    expenses.forEach((e) => {
      const reason = String(e.reason ?? "");
      const amt = formatRs(e.amount);

      const lines = doc.splitTextToSize(reason, 360);
      doc.text(lines, 40, y);
      doc.text(amt, 420, y);
      y += Math.max(18, lines.length * 14);
      if (y > 760) {
        doc.addPage();
        y = 60;
      }
    });

    const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Expenses: ${formatRs(total)}`, 40, y);

    doc.save("JSS-Finance-Expenses-Report.pdf");
  });

  window.addEventListener("beforeunload", () => unsub?.());
}

boot().catch((err) => {
  console.error(err);
  const el = document.querySelector("#fatalError");
  if (el) el.textContent = err?.message || String(err);
});
