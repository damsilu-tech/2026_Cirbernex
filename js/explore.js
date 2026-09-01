(() => {
  const surprises = [
    { text: "Discover the woman who became pharaoh.", url: "people.html?id=hatshepsut" },
    { text: "Walk into the Age of Pyramids.", url: "timeline.html#old-kingdom" },
    { text: "Meet the objects buried with the dead.", url: "collection.html?filter=funerary" },
    { text: "Follow the Nile to ancient Luxor.", url: "places.html?id=luxor" },
    { text: "Learn how Egyptians used writing.", url: "collection.html?filter=writing" },
    { text: "Step inside the Virtual Museum.", url: "virtual-museum.html" }
  ];

  const text = document.getElementById("surpriseText");
  const button = document.getElementById("surpriseBtn");
  const top = document.getElementById("surpriseTop");

  function surprise() {
    const pick = surprises[Math.floor(Math.random() * surprises.length)];
    if (text) text.textContent = pick.text;
    if (button) {
      button.dataset.url = pick.url;
      button.textContent = "Explore This Discovery →";
    }
    document.getElementById("surprise")?.scrollIntoView({behavior:"smooth", block:"center"});
  }

  button?.addEventListener("click", () => {
    const url = button.dataset.url;
    if (url) window.location.href = url;
    else surprise();
  });

  top?.addEventListener("click", surprise);

  // Small reveal effect without requiring an animation library.
  const items = document.querySelectorAll(".path-card,.theme-card,.featured-copy,.featured-object,.map-copy,.egypt-map,.era-node");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    items.forEach(el => observer.observe(el));
  }
})();
