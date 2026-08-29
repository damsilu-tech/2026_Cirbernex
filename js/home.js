/* =============================================
   HOME PAGE — home.js
   ============================================= */

'use strict';

/* --------------------------------------------------
   API CONFIGURATION
   Change API_BASE to your deployed URL when live.
   -------------------------------------------------- */
const API_BASE = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'https://cibernex-api.onrender.com';
  }
  return ''; // relative path for production
})();

/* --------------------------------------------------
   REDUCED MOTION
   -------------------------------------------------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------
   STICKY HEADER
   -------------------------------------------------- */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

/* --------------------------------------------------
   MOBILE NAVIGATION
   -------------------------------------------------- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
    menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

/* --------------------------------------------------
   INTERACTIVE TIMELINE
   -------------------------------------------------- */
const eraData = {
  predynastic: {
    date:        'Before 3100 BCE',
    title:       'Predynastic Egypt',
    description: 'Before the pharaohs, communities along the Nile developed agriculture, craft traditions, trade networks and social structures that helped shape the civilization that followed.',
    link:        'predynastic.html'
  },
  old: {
    date:        'c. 2686–2181 BCE',
    title:       'The Old Kingdom',
    description: 'The Old Kingdom is famous for monumental architecture, including the great pyramids of Giza. Kingship, administration and religious traditions became increasingly organized.',
    link:        'timeline.html'
  },
  middle: {
    date:        'c. 2055–1650 BCE',
    title:       'The Middle Kingdom',
    description: 'The Middle Kingdom brought political reunification, artistic development and major literary works. It is often remembered as a period of cultural renewal.',
    link:        'timeline.html'
  },
  new: {
    date:        'c. 1550–1070 BCE',
    title:       'The New Kingdom',
    description: 'The New Kingdom saw Egypt become a powerful international state. Famous rulers included Hatshepsut, Akhenaten, Tutankhamun and Ramesses II.',
    link:        'timeline.html'
  },
  late: {
    date:        'After 1070 BCE',
    title:       'Later Egypt',
    description: 'Egypt later came under the influence and rule of several foreign powers, while its distinctive culture, writing and religious traditions continued to evolve.',
    link:        'timeline.html'
  }
};

const eraButtons     = document.querySelectorAll('.era');
const eraDescription = document.getElementById('eraDescription');
const eraDate        = document.getElementById('eraDate');
const eraTitle       = document.getElementById('eraTitle');
const exploreMore    = document.getElementById('exploreMore');

eraButtons.forEach(button => {
  button.addEventListener('click', () => {
    eraButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    const era = button.dataset.era;
    const data = eraData[era];
    if (!data) return;

    if (eraDate)        eraDate.textContent        = data.date;
    if (eraTitle)       eraTitle.textContent       = data.title;
    if (eraDescription) eraDescription.textContent = data.description;
    if (exploreMore) {
      exploreMore.href        = data.link;
      exploreMore.setAttribute('aria-label', `Explore ${data.title} in detail`);
    }
  });
});

/* --------------------------------------------------
   GSAP HORIZONTAL SCROLL (Explore cards)
   -------------------------------------------------- */
if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const cardsTrack  = document.querySelector('.cards-track');
  const cardsWindow = document.querySelector('.cards-window');

  if (cardsTrack && cardsWindow) {
    function initHorizontalScroll() {
      if (window.innerWidth < 768) {
        ScrollTrigger.getAll()
          .filter(st => st.vars.trigger === '#explore')
          .forEach(st => st.kill());
        gsap.set(cardsTrack, { clearProps: 'x' });
        return;
      }

      const distance = cardsTrack.scrollWidth - window.innerWidth;
      gsap.to(cardsTrack, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: '#explore',
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }

    initHorizontalScroll();

    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      const nowWide = window.innerWidth >= 768;
      const wasWide = lastWidth >= 768;
      if (nowWide !== wasWide) {
        ScrollTrigger.getAll().forEach(st => st.kill());
        gsap.set(cardsTrack, { clearProps: 'x' });
        initHorizontalScroll();
      }
      lastWidth = window.innerWidth;
    });
  }
}

/* --------------------------------------------------
   COLLECTION PAGE — CATEGORY FILTER FROM URL
   (handles collection.html?category=royal etc.)
   This runs on collection.html, not index.html,
   but is placed here so you can move it to
   collection.js if preferred.
   -------------------------------------------------- */

/* --------------------------------------------------
   ARTIFACT HELPERS
   -------------------------------------------------- */
const CATEGORY_LABELS = {
  royal:      'Royalty & Elite',
  funerary:   'Funerary & Afterlife',
  religious:  'Religion & Ritual',
  everyday:   'Daily Life',
  writing:    'Writing & Documents',
  art:        'Art & Sculpture',
  monuments:  'Architecture & Monuments'
};

function categoryLabel(cat) {
  return CATEGORY_LABELS[cat] || cat;
}

function buildFeaturedCard(a) {
  const card = document.createElement('a');
  card.className = 'featured-card';
  card.href = 'collection.html';
  card.setAttribute('aria-label', `${a.title}${a.date ? ', ' + a.date : ''}`);

  card.innerHTML = `
    <div class="featured-thumb">
      <img
        src="${a.imageUrl || ''}"
        alt="${a.title}"
        loading="lazy"
        onerror="this.closest('.featured-thumb').style.background='#c9bfa8';this.remove()"
      >
      <span class="featured-badge">${categoryLabel(a.category)}</span>
    </div>
    <div class="featured-body">
      ${a.date ? `<span class="featured-date">${a.date}</span>` : ''}
      <h3>${a.title}</h3>
      <p>${(a.description || '').slice(0, 100)}…</p>
    </div>
  `;
  return card;
}

/* --------------------------------------------------
   FEATURED ARTIFACTS
   -------------------------------------------------- */
const FEATURED_TITLES = [
  "Tutankhamun's Mummy",
  'Canopic Jar (Falcon-headed)',
  'Heart Scarab',
  'The Rosetta Stone'
];

async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  try {
    const res  = await fetch(`${API_BASE}/api/artifacts`);
    if (!res.ok) throw new Error('API error');
    const all  = await res.json();

    let picks = FEATURED_TITLES
      .map(t => all.find(a => a.title === t))
      .filter(Boolean);

    if (picks.length < 4) picks = all.slice(0, 4);

    grid.innerHTML = '';
    picks.forEach(a => grid.appendChild(buildFeaturedCard(a)));

    // Update artifact count in About section
    const statEl = document.getElementById('statArtifacts');
    if (statEl) statEl.textContent = all.length + '+';

  } catch {
    // Fallback: show static cards with same structure
    const fallback = [
      {
        title:       "Golden Mask of Tutankhamun",
        category:    'funerary',
        date:        'c. 1323 BCE',
        description: "The iconic funerary mask of the boy pharaoh, crafted from solid gold and inlaid with lapis lazuli and coloured glass.",
        imageUrl:    'https://upload.wikimedia.org/wikipedia/commons/3/35/Mask_of_Tutankhamun_in_2025.jpg'
      },
      {
        title:       'Canopic Jar',
        category:    'funerary',
        date:        'c. 1550–1070 BCE',
        description: 'Used during mummification to store the internal organs of the deceased. Four jars protected the liver, lungs, stomach and intestines.',
        imageUrl:    'https://upload.wikimedia.org/wikipedia/commons/3/35/Canopic_jars_%28casts%29%2C_Egypt%2C_945-712_BC_-_National_Museum_of_Natural_History%2C_United_States_-_DSC00557.jpg'
      },
      {
        title:       'The Rosetta Stone',
        category:    'writing',
        date:        '196 BCE',
        description: 'The key to deciphering ancient Egyptian hieroglyphics. Inscribed with the same decree in three scripts — hieroglyphics, Demotic and Greek.',
        imageUrl:    'https://upload.wikimedia.org/wikipedia/commons/8/89/Rosetta_stone.jpg'
      },
      {
        title:       'Heart Scarab',
        category:    'funerary',
        date:        'New Kingdom',
        description: 'A funerary amulet placed over the heart of a mummy. Intended to prevent the heart from testifying against its owner in the judgment of the dead.',
        imageUrl:    'https://static.wixstatic.com/media/4ba240_b28f3e91a7da44d89961c4cf83f4fdbd~mv2_d_2362_1925_s_2.jpg'
      }
    ];

    grid.innerHTML = '';
    fallback.forEach(a => grid.appendChild(buildFeaturedCard(a)));
  }
}

/* --------------------------------------------------
   ARTIFACT OF THE DAY
   -------------------------------------------------- */
async function loadArtifactOfDay() {
  const card = document.getElementById('aotdCard');
  if (!card) return;

  try {
    const res = await fetch(`${API_BASE}/api/artifacts`);
    if (!res.ok) throw new Error('API error');
    const all = await res.json();
    if (!all.length) throw new Error('Empty');

    // Pick deterministically based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const artifact  = all[dayOfYear % all.length];

    card.innerHTML = `
      <div class="aotd-image" style="background-image:url('${artifact.imageUrl || ''}'); background-color:#c9bfa8;" role="img" aria-label="${artifact.title}">
        <span class="aotd-badge">Today's Artifact</span>
      </div>
      <div class="aotd-body">
        ${artifact.date ? `<span class="aotd-date">${artifact.date}</span>` : ''}
        <h3>${artifact.title}</h3>
        <p>${artifact.description || ''}</p>
        <a class="btn btn-gold" href="collection.html" aria-label="Explore ${artifact.title} in the collection">Explore Artifact →</a>
      </div>
    `;
  } catch {
    card.innerHTML = `
      <div class="aotd-image" style="background-image:url('https://upload.wikimedia.org/wikipedia/commons/8/89/Rosetta_stone.jpg'); background-color:#c9bfa8;" role="img" aria-label="The Rosetta Stone">
        <span class="aotd-badge">Today's Artifact</span>
      </div>
      <div class="aotd-body">
        <span class="aotd-date">196 BCE</span>
        <h3>The Rosetta Stone</h3>
        <p>The key to deciphering ancient Egyptian hieroglyphics — inscribed with the same decree in three scripts, it unlocked 3,000 years of Egyptian history for modern scholars.</p>
        <a class="btn btn-gold" href="collection.html">Explore Artifact →</a>
      </div>
    `;
  }
}

/* --------------------------------------------------
   HIEROGLYPH EXHIBIT
   -------------------------------------------------- */
const HIEROGLYPHS = {
  A: { glyph: '𓄿', meaning: 'Egyptian vulture — represents the "ah" sound' },
  B: { glyph: '𓃀', meaning: 'Foot — represents the "b" sound' },
  C: { glyph: '𓎡', meaning: 'Basket with handle — represents the "k" sound' },
  D: { glyph: '𓂧', meaning: 'Hand — represents the "d" sound' },
  E: { glyph: '𓄿', meaning: 'Quail chick — represents the "ee" sound' },
  F: { glyph: '𓆑', meaning: 'Horned viper — represents the "f" sound' },
  G: { glyph: '𓎼', meaning: 'Stand — represents the "g" sound' },
  H: { glyph: '𓉔', meaning: 'Shelter — represents the "h" sound' },
  I: { glyph: '𓇋', meaning: 'Flowering reed — represents the "ee" or "i" sound' },
  J: { glyph: '𓆓', meaning: 'Cobra — represents the "dj" sound' },
  K: { glyph: '𓎡', meaning: 'Basket with handle — represents the "k" sound' },
  L: { glyph: '𓃭', meaning: 'Lion — represents the "l" sound' },
  M: { glyph: '𓅓', meaning: 'Owl — represents the "m" sound' },
  N: { glyph: '𓈖', meaning: 'Water — represents the "n" sound' },
  O: { glyph: '𓌀', meaning: 'Lasso — represents the "wa" sound' },
  P: { glyph: '𓊪', meaning: 'Stool — represents the "p" sound' },
  Q: { glyph: '𓈙', meaning: 'Hill slope — represents the "q" sound' },
  R: { glyph: '𓂋', meaning: 'Mouth — represents the "r" sound' },
  S: { glyph: '𓋴', meaning: 'Folded cloth — represents the "s" sound' },
  T: { glyph: '𓏏', meaning: 'Bread loaf — represents the "t" sound' },
  U: { glyph: '𓌀', meaning: 'Quail chick — represents the "w" or "u" sound' },
  V: { glyph: '𓆑', meaning: 'Horned viper — represents the "f/v" sound' },
  W: { glyph: '𓌀', meaning: 'Quail chick — represents the "w" sound' },
  X: { glyph: '𓎡', meaning: 'Basket — represents the "ks" sound' },
  Y: { glyph: '𓇌', meaning: 'Two reeds — represents the "y" sound' },
  Z: { glyph: '𓊃', meaning: 'Door bolt — represents the "z" sound' }
};

function initHieroglyph() {
  const alphabet   = document.getElementById('hieroAlphabet');
  const display    = document.getElementById('hieroDisplay');
  if (!alphabet || !display) return;

  Object.keys(HIEROGLYPHS).forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'hiero-btn';
    btn.textContent = letter;
    btn.setAttribute('aria-label', `Show hieroglyph for letter ${letter}`);
    btn.addEventListener('click', () => {
      alphabet.querySelectorAll('.hiero-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const data = HIEROGLYPHS[letter];
      display.innerHTML = `
        <div class="hiero-result">
          <span class="hiero-glyph" aria-hidden="true">${data.glyph}</span>
          <span class="hiero-letter-shown">Letter: ${letter}</span>
          <p class="hiero-meaning">${data.meaning}</p>
        </div>
      `;
    });
    alphabet.appendChild(btn);
  });
}

/* --------------------------------------------------
   DID YOU KNOW FACTS
   -------------------------------------------------- */
const FACTS = [
  "Ancient Egypt lasted over 3,000 years — longer than the time between Cleopatra and today.",
  "There are over 130 pyramids in Egypt. Most people only know about the three at Giza.",
  "The Egyptian writing system used over 700 different hieroglyphic signs.",
  "Ancient Egyptians worshipped more than 2,000 different gods and goddesses.",
  "At least seven women ruled Egypt as pharaoh — including Hatshepsut, one of the most successful rulers in history.",
  "Egyptian physicians performed surgery, set broken bones and prescribed herbal remedies over 3,500 years ago.",
  "The Great Pyramid of Giza was the tallest human-made structure in the world for over 3,800 years.",
  "Cats were so sacred in ancient Egypt that killing one — even accidentally — was punishable by death."
];

let currentFact = 0;

function initFacts() {
  const textEl   = document.getElementById('factText');
  const numEl    = document.getElementById('factNum');
  const nextBtn  = document.getElementById('factNextBtn');
  if (!textEl || !numEl || !nextBtn) return;

  function showFact(idx) {
    textEl.textContent = FACTS[idx];
    numEl.textContent  = `${String(idx + 1).padStart(2, '0')} / ${String(FACTS.length).padStart(2, '0')}`;
    numEl.setAttribute('aria-label', `Fact ${idx + 1} of ${FACTS.length}`);
  }

  showFact(currentFact);

  nextBtn.addEventListener('click', () => {
    currentFact = (currentFact + 1) % FACTS.length;
    showFact(currentFact);
  });
}

/* --------------------------------------------------
   INITIALISE
   -------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  loadFeatured();
  loadArtifactOfDay();
  initHieroglyph();
  initFacts();
});