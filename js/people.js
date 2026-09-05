// ---- Header ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? '✕' : '☰';
});

// ---- Places data ----
// type: cities | temples | monuments | necropolises | settlements | landscapes
const PLACES = [
  { id: 'giza',               name: 'Giza',               type: 'monuments',    period: 'old-kingdom',    typeLabel: 'Monumental Landscape', periodLabel: 'Old Kingdom',
    blurb: 'Home to the Great Pyramid and one of the most recognizable monumental landscapes of ancient Egypt.' },
  { id: 'memphis',             name: 'Memphis',            type: 'cities',       period: 'early-dynastic', typeLabel: 'Ancient City',          periodLabel: 'Early Dynastic – later periods',
    blurb: "One of ancient Egypt's major political and cultural centres." },
  { id: 'thebes',              name: 'Thebes',             type: 'cities',       period: 'new-kingdom',    typeLabel: 'Ancient City',          periodLabel: 'Middle Kingdom – New Kingdom',
    blurb: 'A major centre of royal power and religious life, especially during the New Kingdom.' },
  { id: 'karnak',              name: 'Karnak',             type: 'temples',      period: 'new-kingdom',    typeLabel: 'Temple Complex',        periodLabel: 'Thebes',
    blurb: 'A vast temple complex associated particularly with the worship of Amun.' },
  { id: 'luxor-temple',        name: 'Luxor Temple',       type: 'temples',      period: 'new-kingdom',    typeLabel: 'Temple Complex',        periodLabel: 'Thebes',
    blurb: 'A grand temple dedicated to the rejuvenation of kingship, linked to Karnak by a processional avenue.' },
  { id: 'saqqara',             name: 'Saqqara',            type: 'necropolises', period: 'old-kingdom',    typeLabel: 'Necropolis',            periodLabel: 'Near Memphis',
    blurb: 'A vast cemetery containing monuments and tombs spanning many periods of Egyptian history.' },
  { id: 'valley-of-the-kings', name: 'Valley of the Kings',type: 'necropolises', period: 'new-kingdom',    typeLabel: 'Royal Necropolis',      periodLabel: 'New Kingdom',
    blurb: 'The royal burial ground where many New Kingdom rulers were buried.' },
  { id: 'abu-simbel',          name: 'Abu Simbel',         type: 'temples',      period: 'new-kingdom',    typeLabel: 'Temple Complex',        periodLabel: 'New Kingdom',
    blurb: 'A monumental temple complex associated with the reign of Ramesses II.' },
  { id: 'deir-el-bahari',      name: 'Deir el-Bahari',     type: 'monuments',    period: 'new-kingdom',    typeLabel: 'Monumental Landscape',  periodLabel: 'Thebes',
    blurb: 'A dramatic landscape of temples and cliffs, including the famous temple of Hatshepsut.' },
  { id: 'alexandria',          name: 'Alexandria',         type: 'cities',       period: 'ptolemaic',      typeLabel: 'Ancient City',          periodLabel: 'Ptolemaic & Roman',
    blurb: 'A great Mediterranean port city founded by Alexander the Great, a centre of learning and trade.' },
  { id: 'deir-el-medina',      name: 'Deir el-Medina',     type: 'settlements',  period: 'new-kingdom',    typeLabel: 'Workers\' Village',     periodLabel: 'New Kingdom',
    blurb: 'The village of the artisans who built and decorated the royal tombs of the Valley of the Kings.' },
  { id: 'nile-valley',         name: 'The Nile Valley',    type: 'landscapes',   period: 'predynastic',    typeLabel: 'River & Landscape',     periodLabel: 'All Periods',
    blurb: 'The river and floodplain that sustained agriculture, travel and settlement throughout Egyptian history.' },
];

// ---- Search suggestions (hero search) ----
const heroSearch  = document.getElementById('heroSearch');
const suggestions = document.getElementById('searchSuggestions');

function renderSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (!q) { suggestions.innerHTML = ''; suggestions.classList.remove('open'); return; }
  const matches = PLACES.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6);
  if (!matches.length) {
    suggestions.innerHTML = '<div class="suggestion-empty">No places found.</div>';
  } else {
    suggestions.innerHTML = matches.map(p => `
      <a class="suggestion-item" href="places.html?id=${p.id}">
        <strong>${p.name}</strong><span>${p.typeLabel}</span>
      </a>
    `).join('');
  }
  suggestions.classList.add('open');
}

heroSearch.addEventListener('input', () => renderSuggestions(heroSearch.value));
heroSearch.addEventListener('blur', () => setTimeout(() => suggestions.classList.remove('open'), 150));
heroSearch.addEventListener('focus', () => { if (heroSearch.value) renderSuggestions(heroSearch.value); });

document.querySelectorAll('.example-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    heroSearch.value = btn.dataset.q;
    heroSearch.focus();
    renderSuggestions(btn.dataset.q);
    document.getElementById('browseSearch').value = btn.dataset.q;
    document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
    applyFilters();
  });
});

// ---- Explore by type cards -> jump to browse, filtered ----
document.querySelectorAll('.type-card').forEach(card => {
  card.addEventListener('click', () => {
    setActiveTypeFilter(card.dataset.type);
    document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
    applyFilters();
  });
});

// ---- Historical question cards -> jump to browse, filtered ----
document.querySelectorAll('.question-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveTypeFilter(card.dataset.filter);
    document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
    applyFilters();
  });
});

function setActiveTypeFilter(type) {
  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.type === type);
  });
}

// ---- Browse grid ----
const browseGrid    = document.getElementById('browseGrid');
const browseEmpty   = document.getElementById('browseEmpty');
const browseSearch  = document.getElementById('browseSearch');
const periodFilter  = document.getElementById('periodFilter');
const typeFilters   = document.getElementById('typeFilters');

function renderBrowseGrid(list) {
  if (!list.length) {
    browseGrid.innerHTML = '';
    browseEmpty.hidden = false;
    return;
  }
  browseEmpty.hidden = true;
  browseGrid.innerHTML = list.map(p => `
    <a class="browse-card" href="places.html?id=${p.id}">
      <div class="bc-image bc-${p.id}"></div>
      <div class="bc-body">
        <small>${p.typeLabel.toUpperCase()}</small>
        <h3>${p.name}</h3>
        <span class="bc-period">${p.periodLabel}</span>
        <span class="bc-link">Explore Place →</span>
      </div>
    </a>
  `).join('');
}

function applyFilters() {
  const q = browseSearch.value.trim().toLowerCase();
  const activeType = document.querySelector('.filter-pill.active')?.dataset.type || 'all';
  const activePeriod = periodFilter.value;

  const filtered = PLACES.filter(p => {
    const matchesQuery  = !q || p.name.toLowerCase().includes(q);
    const matchesType   = activeType === 'all' || p.type === activeType;
    const matchesPeriod = activePeriod === 'all' || p.period === activePeriod;
    return matchesQuery && matchesType && matchesPeriod;
  });

  renderBrowseGrid(filtered);
}

typeFilters.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-pill');
  if (!btn) return;
  setActiveTypeFilter(btn.dataset.type);
  applyFilters();
});

browseSearch.addEventListener('input', applyFilters);
periodFilter.addEventListener('change', applyFilters);

// ---- Init ----
renderBrowseGrid(PLACES);