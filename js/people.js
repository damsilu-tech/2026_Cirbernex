// ---- Header / mobile menu ----
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));
}
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
  });
}

// ---- People directory: search + role filter over the static card grid ----
const peopleSearch = document.getElementById('peopleSearch');
const personGrid   = document.getElementById('personGrid');
const peopleCount  = document.getElementById('peopleCount');
const emptyState   = document.getElementById('emptyState');
const roleCards    = document.querySelectorAll('.role-card');

const personCards = personGrid ? Array.from(personGrid.querySelectorAll('.person-card')) : [];

function activeRole() {
  return document.querySelector('.role-card.active')?.dataset.role || 'all';
}

function applyPeopleFilters() {
  const q = (peopleSearch?.value || '').trim().toLowerCase();
  const role = activeRole();
  let visibleCount = 0;

  personCards.forEach(card => {
    const matchesRole  = role === 'all' || card.dataset.role === role;
    const matchesQuery = !q || card.dataset.name.includes(q) || card.textContent.toLowerCase().includes(q);
    const show = matchesRole && matchesQuery;
    card.hidden = !show;
    if (show) visibleCount++;
  });

  if (peopleCount) {
    peopleCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'person' : 'people'}`;
  }
  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
}

if (peopleSearch) {
  peopleSearch.addEventListener('input', applyPeopleFilters);
}

roleCards.forEach(btn => {
  btn.addEventListener('click', () => {
    roleCards.forEach(b => b.classList.toggle('active', b === btn));
    applyPeopleFilters();
  });
});

// ---- Init ----
if (personGrid) {
  applyPeopleFilters();
}
