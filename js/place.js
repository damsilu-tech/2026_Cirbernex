(() => {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  const params = new URLSearchParams(window.location.search);
  const requestedPlace = params.get("id");
  if (requestedPlace) {
    document.documentElement.dataset.requestedPlace = requestedPlace;
  }
})();