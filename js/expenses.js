// Expenses UI helpers + PDF export
(function () {
  function formatINR(n) {
    const val = Number(n) || 0;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  function formatDate(ts) {
    if (!ts) return "";
    const d = new Date(Number(ts));
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
  }

  function renderExpensesTable(tbodyEl, expenses) {
    if (!tbodyEl) return;
    tbodyEl.innerHTML = expenses
      .map(
        (e) => `
        <tr>
          <td>${e.reason ?? ""}</td>
          <td class="mono">${formatINR(e.amount)}</td>
          <td class="mono">${formatDate(e.timestamp)}</td>
        </tr>
      `
      )
      .join("");
  }

  function exportExpensesPDF(expenses) {
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
    doc.text("Amount", 360, y);
    doc.text("Date", 470, y);
    y += 12;
    doc.setDrawColor(220);
    doc.line(40, y, 555, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    expenses.forEach((e) => {
      const reason = String(e.reason ?? "");
      const amt = formatINR(e.amount);
      const date = formatDate(e.timestamp);

      const lines = doc.splitTextToSize(reason, 300);
      doc.text(lines, 40, y);
      doc.text(amt, 360, y);
      doc.text(date, 470, y);

      y += Math.max(18, lines.length * 14);
      if (y > 760) {
        doc.addPage();
        y = 60;
      }
    });

    const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Expenses: ${formatINR(total)}`, 40, y);

    doc.save("JSS-Finance-Expenses-Report.pdf");
  }

  window.FMExpensesUI = { formatINR, formatDate, renderExpensesTable, exportExpensesPDF };
})();
