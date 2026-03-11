// Member UI helpers (search/filter rendering)
(function () {
  function formatINR(n) {
    const val = Number(n) || 0;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  function badgeHTML(isPaid) {
    return `<span class="badge ${isPaid ? "green" : "red"}">${isPaid ? "Paid" : "Not Paid"}</span>`;
  }

  function applyMemberFilters(members, { query, filter }) {
    const q = String(query || "").trim().toLowerCase();
    const f = String(filter || "all").toLowerCase();

    return members.filter((m) => {
      const matchesQuery = !q || String(m.name || "").toLowerCase().includes(q);
      const isPaid = m.status === "YES";
      const matchesFilter = f === "all" || (f === "paid" && isPaid) || (f === "unpaid" && !isPaid);
      return matchesQuery && matchesFilter;
    });
  }

  function renderPublicMemberTable(tbodyEl, members, collectionAmount) {
    if (!tbodyEl) return;

    if (!Array.isArray(members) || members.length === 0) {
      tbodyEl.innerHTML = `
        <tr>
          <td colspan="3" class="opacity-80">No members found</td>
        </tr>
      `;
      return;
    }

    tbodyEl.innerHTML = members
      .map((m) => {
        const isPaid = m.status === "YES";
        const amount = isPaid ? Number(collectionAmount) || 0 : 0;
        return `
          <tr>
            <td>${m.name || ""}</td>
            <td class="mono">${formatINR(amount)}</td>
            <td>${badgeHTML(isPaid)}</td>
          </tr>
        `;
      })
      .join("");
  }

  window.FMMembersUI = {
    formatINR,
    applyMemberFilters,
    renderPublicMemberTable,
  };
})();
