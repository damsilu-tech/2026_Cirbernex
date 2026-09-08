/* =============================================
   LEARN PAGE — learn.js
   ============================================= */

'use strict';

/* --------------------------------------------------
   API CONFIGURATION (same detection pattern as home.js)
   -------------------------------------------------- */
const API_BASE = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://cibernex-api.onrender.com';
})();

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
   SECTION NAV — SCROLL SPY
   -------------------------------------------------- */
function initSectionNav() {
  const snavButtons = Array.from(document.querySelectorAll('.lrn-snav-btn'));
  if (!snavButtons.length) return;

  const targets = snavButtons
    .map(btn => document.getElementById(btn.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (!targets.length) return;

  const setActive = (id) => {
    snavButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    targets.forEach(t => observer.observe(t));
  }
}

/* --------------------------------------------------
   SCROLL REVEAL (lightweight, respects reduced motion)
   -------------------------------------------------- */
function initScrollReveal() {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const revealEls = document.querySelectorAll('.lrn-reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('lrn-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
}

/* --------------------------------------------------
   HIEROGLYPH DECODER (mirrors homepage exhibit)
   -------------------------------------------------- */
const LRN_HIEROGLYPHS = {
  A: { glyph: '𓄿', meaning: 'Egyptian vulture — represents the "ah" sound.' },
  B: { glyph: '𓃀', meaning: 'Foot — represents the "b" sound.' },
  D: { glyph: '𓂧', meaning: 'Hand — represents the "d" sound.' },
  F: { glyph: '𓆑', meaning: 'Horned viper — represents the "f" sound.' },
  H: { glyph: '𓉔', meaning: 'Shelter — represents the "h" sound.' },
  I: { glyph: '𓇋', meaning: 'Flowering reed — represents the "ee" or "i" sound.' },
  K: { glyph: '𓎡', meaning: 'Basket with handle — represents the "k" sound.' },
  L: { glyph: '𓃭', meaning: 'Lion — represents the "l" sound.' },
  M: { glyph: '𓅓', meaning: 'Owl — represents the "m" sound.' },
  N: { glyph: '𓈖', meaning: 'Water — represents the "n" sound.' },
  P: { glyph: '𓊪', meaning: 'Stool — represents the "p" sound.' },
  R: { glyph: '𓂋', meaning: 'Mouth — represents the "r" sound.' },
  S: { glyph: '𓋴', meaning: 'Folded cloth — represents the "s" sound.' },
  T: { glyph: '𓏏', meaning: 'Bread loaf — represents the "t" sound.' },
  W: { glyph: '𓌀', meaning: 'Quail chick — represents the "w" sound.' },
  Y: { glyph: '𓇌', meaning: 'Two reeds — represents the "y" sound.' }
};

function initDecoder() {
  const alphabet = document.getElementById('lrnDecodeAlphabet');
  const display = document.getElementById('lrnDecodeDisplay');
  if (!alphabet || !display) return;

  Object.keys(LRN_HIEROGLYPHS).forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'lrn-decode-btn';
    btn.type = 'button';
    btn.textContent = letter;
    btn.setAttribute('aria-label', `Show hieroglyph for letter ${letter}`);
    btn.addEventListener('click', () => {
      alphabet.querySelectorAll('.lrn-decode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const data = LRN_HIEROGLYPHS[letter];
      display.innerHTML = `
        <div>
          <span class="lrn-decode-glyph" aria-hidden="true">${data.glyph}</span>
          <span class="lrn-decode-letter">Letter: ${letter}</span>
          <p class="lrn-decode-meaning">${data.meaning}</p>
        </div>
      `;
    });
    alphabet.appendChild(btn);
  });
}

/* --------------------------------------------------
   WRITE YOUR NAME
   -------------------------------------------------- */
function initNameTool() {
  const input = document.getElementById('lrnNameInput');
  const button = document.getElementById('lrnNameBtn');
  const output = document.getElementById('lrnNameOutput');
  if (!input || !button || !output) return;

  function render() {
    const raw = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!raw) {
      output.textContent = '';
      return;
    }
    const glyphs = raw
      .split('')
      .map(ch => (LRN_HIEROGLYPHS[ch] ? LRN_HIEROGLYPHS[ch].glyph : ''))
      .filter(Boolean)
      .join(' ');
    output.textContent = glyphs || '—';
  }

  button.addEventListener('click', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') render();
  });
}

/* --------------------------------------------------
   REAL ARTIFACTS — SINGLE API REQUEST, CLIENT FILTER
   -------------------------------------------------- */
const LRN_CATEGORY_LABELS = {
  royal: 'Royalty & Elite',
  funerary: 'Funerary & Afterlife',
  religious: 'Religion & Ritual',
  everyday: 'Daily Life',
  writing: 'Writing & Documents',
  art: 'Art & Sculpture',
  monuments: 'Architecture & Monuments'
};

let lrnArtifacts = [];
let lrnActiveCategory = 'all';

function lrnBuildArtifactCard(a) {
  const card = document.createElement('a');
  card.className = 'lrn-artifact-card';
  card.href = `artifact/artifact.html?id=${encodeURIComponent(a._id || '')}`;
  card.setAttribute('aria-label', a.title || 'Artifact');

  card.innerHTML = `
    <div class="lrn-artifact-thumb" style="background-image:url('${a.imageUrl || ''}')">
      <span class="lrn-artifact-badge">${LRN_CATEGORY_LABELS[a.category] || a.category || 'Artifact'}</span>
    </div>
    <div class="lrn-artifact-body">
      ${a.date ? `<span>${a.date}</span>` : ''}
      <h3>${a.title || 'Untitled Artifact'}</h3>
      <p>${(a.description || '').slice(0, 90)}${a.description && a.description.length > 90 ? '…' : ''}</p>
    </div>
  `;
  return card;
}

function lrnRenderArtifacts() {
  const grid = document.getElementById('lrnArtifactGrid');
  if (!grid) return;

  const filtered = lrnActiveCategory === 'all'
    ? lrnArtifacts
    : lrnArtifacts.filter(a => a.category === lrnActiveCategory);

  grid.innerHTML = '';

  if (!filtered.length) {
    grid.innerHTML = '<div class="lrn-artifact-empty">No artifacts found in this category yet.</div>';
    return;
  }

  filtered.slice(0, 8).forEach(a => grid.appendChild(lrnBuildArtifactCard(a)));
}

async function initArtifacts() {
  const grid = document.getElementById('lrnArtifactGrid');
  const filters = document.getElementById('lrnArtifactFilters');
  if (!grid) return;

  try {
    const res = await fetch(`${API_BASE}/api/artifacts`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid data');

    lrnArtifacts = data;
    lrnRenderArtifacts();

    if (filters) {
      filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.lrn-filter-btn');
        if (!btn) return;
        filters.querySelectorAll('.lrn-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        lrnActiveCategory = btn.dataset.category;
        lrnRenderArtifacts();
      });
    }
  } catch (err) {
    console.error('Error loading artifacts for Learn page:', err);
    grid.innerHTML = '<div class="lrn-artifact-error">We couldn\'t load live artifacts right now — please check back soon, or browse the full collection instead.</div>';
    if (filters) filters.style.display = 'none';
  }
}

/* --------------------------------------------------
   A DAY IN ANCIENT EGYPT
   -------------------------------------------------- */
const LRN_DAY_PROFILES = {
  farmer: {
    label: 'Farmer',
    morning: 'Rises early to tend fields, irrigate crops and check on livestock along the Nile floodplain.',
    midday: 'Shares a simple meal of bread, beer and vegetables with family or fellow workers in the shade.',
    afternoon: 'Continues fieldwork — sowing, harvesting or repairing irrigation channels depending on the season.',
    evening: 'Returns home for a family meal and rest as the sun sets over the fields.'
  },
  scribe: {
    label: 'Scribe',
    morning: 'Reports to a temple, palace or official\'s office to prepare papyrus, ink and writing tools.',
    midday: 'Breaks for food while reviewing texts, records or letters already copied that day.',
    afternoon: 'Records taxes, transactions or official correspondence using hieratic script.',
    evening: 'May study literary or religious texts to continue training in the scribal tradition.'
  },
  artisan: {
    label: 'Artisan',
    morning: 'Begins work in a workshop, shaping stone, wood, metal or faience under a master craftsperson.',
    midday: 'Rests briefly and eats before returning to detailed, often collaborative work.',
    afternoon: 'Continues carving, painting or assembling objects destined for tombs, temples or homes.',
    evening: 'Finishes the day\'s work and returns to a household within the artisans\' community.'
  },
  fisher: {
    label: 'Fisher',
    morning: 'Sets out on the Nile at dawn with nets and traps to catch fish for food and trade.',
    midday: 'Sorts and prepares the morning\'s catch, some to be dried or salted for storage.',
    afternoon: 'May repair boats and nets, or make a second trip depending on the season and river conditions.',
    evening: 'Brings the day\'s catch home or to market before the evening meal.'
  },
  priest: {
    label: 'Priest',
    morning: 'Performs purification rituals and the first of several daily offerings to the temple\'s god.',
    midday: 'Attends to temple administration, land records or teaching alongside religious duties.',
    afternoon: 'Continues rituals and may oversee offerings brought by visitors to the temple.',
    evening: 'Performs closing rites for the day before returning home, as many priests served in rotations.'
  },
  builder: {
    label: 'Builder',
    morning: 'Joins a work crew moving stone, mixing mortar or shaping blocks at a monument or tomb site.',
    midday: 'Receives rations of bread, beer and other food provided as part of organized labor.',
    afternoon: 'Continues construction work, often under the direction of overseers and skilled craftsmen.',
    evening: 'Returns to a nearby workers\' settlement to rest before the next day\'s labor.'
  }
};

function initDayInLife() {
  const buttons = document.querySelectorAll('.lrn-day-btn');
  const morning = document.getElementById('lrnDayMorning');
  const midday = document.getElementById('lrnDayMidday');
  const afternoon = document.getElementById('lrnDayAfternoon');
  const evening = document.getElementById('lrnDayEvening');
  if (!buttons.length || !morning || !midday || !afternoon || !evening) return;

  function render(key) {
    const profile = LRN_DAY_PROFILES[key];
    if (!profile) return;
    morning.textContent = profile.morning;
    midday.textContent = profile.midday;
    afternoon.textContent = profile.afternoon;
    evening.textContent = profile.evening;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.profile);
    });
  });

  render('farmer');
}

/* --------------------------------------------------
   QUIZ
   -------------------------------------------------- */
const LRN_QUIZ = [
  {
    q: 'Which river was central to ancient Egyptian civilization?',
    options: ['Tigris', 'Nile', 'Euphrates', 'Indus'],
    correct: 1
  },
  {
    q: 'What Egyptian concept represents order, balance and justice?',
    options: ['Ka', 'Ba', 'Maat', 'Akh'],
    correct: 2
  },
  {
    q: 'What writing system combined sounds, words and ideas?',
    options: ['Cuneiform', 'Hieroglyphs', 'Runes', 'Braille'],
    correct: 1
  },
  {
    q: 'Where are the three most famous pyramids located?',
    options: ['Luxor', 'Abydos', 'Giza', 'Karnak'],
    correct: 2
  },
  {
    q: 'Which of these was NOT a common ancient Egyptian profession?',
    options: ['Scribe', 'Farmer', 'Astronaut', 'Craftsperson'],
    correct: 2
  },
  {
    q: 'What did canopic jars typically store?',
    options: ['Grain', 'Internal organs', 'Jewelry', 'Water'],
    correct: 1
  }
];

function initQuiz() {
  const shell = document.getElementById('lrnQuizShell');
  if (!shell) return;

  let current = 0;
  let score = 0;

  function renderQuestion() {
    const item = LRN_QUIZ[current];
    shell.innerHTML = `
      <div class="lrn-quiz-progress">Question ${current + 1} of ${LRN_QUIZ.length}</div>
      <div class="lrn-quiz-question">${item.q}</div>
      <div class="lrn-quiz-options" role="list"></div>
      <div class="lrn-quiz-feedback" aria-live="polite"></div>
      <div class="lrn-quiz-actions"></div>
    `;

    const optionsWrap = shell.querySelector('.lrn-quiz-options');
    const feedback = shell.querySelector('.lrn-quiz-feedback');
    const actions = shell.querySelector('.lrn-quiz-actions');

    item.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'lrn-quiz-option';
      btn.type = 'button';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        optionsWrap.querySelectorAll('.lrn-quiz-option').forEach(b => b.disabled = true);

        if (idx === item.correct) {
          btn.classList.add('correct');
          feedback.textContent = 'Correct!';
          score++;
        } else {
          btn.classList.add('incorrect');
          optionsWrap.children[item.correct].classList.add('correct');
          feedback.textContent = "Not quite — here's what the evidence tells us.";
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-gold';
        nextBtn.type = 'button';
        nextBtn.textContent = current < LRN_QUIZ.length - 1 ? 'Next →' : 'See Your Score →';
        nextBtn.addEventListener('click', () => {
          current++;
          if (current < LRN_QUIZ.length) {
            renderQuestion();
          } else {
            renderResult();
          }
        });
        actions.appendChild(nextBtn);
      });
      optionsWrap.appendChild(btn);
    });
  }

  function renderResult() {
    shell.innerHTML = `
      <div class="lrn-quiz-result">
        <strong>${score} / ${LRN_QUIZ.length}</strong>
        <p>Thanks for exploring what you know about ancient Egypt.</p>
        <div class="buttons" style="margin-top:1.5rem">
          <button class="btn btn-gold" id="lrnQuizRestart" type="button">Try Again →</button>
          <a class="btn btn-ghost" href="collection.html">Explore the Collection</a>
        </div>
      </div>
    `;
    document.getElementById('lrnQuizRestart').addEventListener('click', () => {
      current = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

/* --------------------------------------------------
   INITIALISE
   -------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initSectionNav();
  initScrollReveal();
  initDecoder();
  initNameTool();
  initArtifacts();
  initDayInLife();
  initQuiz();
});