(() => {
  const cards = [...document.querySelectorAll(".person-card")];
  const roleButtons = [...document.querySelectorAll(".role-card")];
  const search = document.getElementById("peopleSearch");
  const count = document.getElementById("peopleCount");
  const empty = document.getElementById("emptyState");

  let role = "all";

  function filterPeople() {
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const matchesRole = role === "all" || card.dataset.role === role;
      const matchesSearch = !query || (card.dataset.name || "").includes(query);
      const show = matchesRole && matchesSearch;
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });

    if (count) count.textContent = `Showing ${visible} ${visible === 1 ? "person" : "people"}`;
    if (empty) empty.hidden = visible !== 0;
  }

  roleButtons.forEach(button => {
    button.addEventListener("click", () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      role = button.dataset.role;
      filterPeople();
    });
  });

  search?.addEventListener("input", filterPeople);
  filterPeople();
})();
