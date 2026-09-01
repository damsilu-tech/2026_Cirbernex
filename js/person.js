(() => {
  const btn = document.getElementById("menuBtn");
  const links = document.getElementById("navLinks");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  const people = window.EGYPT_PEOPLE || {};
  const params = new URLSearchParams(window.location.search);
  const requestedId = (params.get("id") || "").toLowerCase().trim();
  const person = people[requestedId];

  // Never silently fall back to Hatshepsut. An unknown ID gets a clear,
  // recoverable message instead of showing the wrong person's biography.
  if (!person) {
    document.title = "Person not found | Egypt's Digital Museum";
    document.getElementById("personName").textContent = "Person not found";
    document.getElementById("personTitle").textContent = "This historical profile does not exist yet.";
    document.getElementById("personDescription").textContent =
      "The requested person could not be found. Return to the People directory and choose a profile.";
    document.getElementById("breadcrumbName").textContent = "Not found";
    const hero = document.querySelector(".person-hero-grid");
    const fallback = document.createElement("div");
    fallback.className = "person-not-found";
    fallback.innerHTML = '<a class="btn btn-gold" href="people.html">← Back to People</a>';
    hero?.appendChild(fallback);
    return;
  }

  const $ = id => document.getElementById(id);
  const set = (id, value) => { const el = $(id); if (el) el.textContent = value; };

  document.title = `${person.name} | Egypt's Digital Museum`;
  set("personName", person.name);
  set("breadcrumbName", person.name);
  set("personTitle", person.title);
  set("personDescription", person.description);
  set("period", person.period);
  set("dynasty", person.dynasty);
  set("reign", person.reign);
  set("known", person.known);
  set("home", person.home);
  set("site", person.site);
  set("role", person.role.charAt(0).toUpperCase() + person.role.slice(1));
  set("portraitSymbol", person.symbol);
  set("portraitCaption", `${person.known.toUpperCase()}<br><span>${person.dynasty.toUpperCase()}</span>`);
  $("eyebrow").textContent = person.eyebrow;
  $("storyTitle").textContent = person.storyTitle || `The story of ${person.name}.`;

  const body = $("storyBody");
  (person.story || []).forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    body.appendChild(p);
  });

  const timeline = $("lifeTimeline");
  (person.timeline || []).forEach((item, index) => {
    const card = document.createElement("div");
    if (index === 1) card.className = "current";
    card.innerHTML = `<span>${item.date}</span><b>${item.event}</b><small>${item.text}</small>`;
    timeline.appendChild(card);
  });

  const achievements = $("achievements");
  (person.achievements || []).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "achievement-row";
    row.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><p></p>`;
    row.querySelector("p").textContent = item;
    achievements.appendChild(row);
  });

  function renderCards(targetId, items, type) {
    const target = $(targetId);
    (items || []).forEach(item => {
      const a = document.createElement("a");
      a.href = type === "story" ? item.url : "collection.html";
      a.innerHTML = `<small>${type.toUpperCase()}</small><b></b><span></span>`;
      a.querySelector("b").textContent = item.name;
      a.querySelector("span").textContent = `${item.text} →`;
      target.appendChild(a);
    });
  }
  renderCards("placesGrid", person.places, "place");
  renderCards("artifactsGrid", person.artifacts, "artifact");
  renderCards("storiesGrid", person.stories, "story");

  const note = $("storyNote");
  note.textContent = `Explore ${person.name}'s biography alongside the places, objects and stories connected to this life.`;
})();