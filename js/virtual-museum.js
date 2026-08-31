'use strict';

/* =========================================================
   OVERLAY SAFETY NET
   ========================================================= */

function syncOverlayVisibility(el) {
  if (!el) return;

  el.style.display = el.hidden ? 'none' : 'flex';
}

/* Sync all overlays/panels on page load */
document.querySelectorAll('.vm-overlay, #vmArtifactPanel').forEach(
  syncOverlayVisibility
);


/* =========================================================
   ENTRANCE
   ========================================================= */

const entrance = document.getElementById('vmEntrance');
const shell = document.getElementById('vmShell');
const enterBtn = document.getElementById('vmEnterBtn');

enterBtn?.addEventListener('click', () => {
  if (!entrance || !shell) return;

  entrance.style.opacity = '0';
  entrance.style.transition = 'opacity 0.8s ease';

  setTimeout(() => {
    entrance.style.display = 'none';

    shell.removeAttribute('hidden');
    shell.style.opacity = '0';
    shell.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        shell.style.opacity = '1';
      });
    });
  }, 800);
});


/* =========================================================
   ROOM NAVIGATION
   ========================================================= */

const roomTabs = document.querySelectorAll('.vm-room-tab');
const rooms = document.querySelectorAll('.vm-room');

const ROOM_ORDER = [
  'lobby',
  'origins',
  'pyramids',
  'gods',
  'royal',
  'nile',
  'afterlife'
];

const ROOM_META = {
  lobby: {
    num: null,
    name: 'Lobby'
  },
  origins: {
    num: '01',
    name: 'Origins'
  },
  pyramids: {
    num: '02',
    name: 'Age of Pyramids'
  },
  gods: {
    num: '03',
    name: 'Gods & Beliefs'
  },
  royal: {
    num: '04',
    name: 'Royal Egypt'
  },
  nile: {
    num: '05',
    name: 'Life on the Nile'
  },
  afterlife: {
    num: '06',
    name: 'The Afterlife'
  }
};

const roomProgress = document.getElementById('vmRoomProgress');
const roomNumEl = document.getElementById('vmRoomNum');
const roomNameEl = document.getElementById('vmRoomName');
const prevRoomBtn = document.getElementById('vmPrevRoom');
const nextRoomBtn = document.getElementById('vmNextRoom');
const floatingMapBtn = document.getElementById('vmFloatingMapBtn');

let currentRoomId = 'lobby';

function updateRoomProgress(roomId) {
  const meta = ROOM_META[roomId];
  const idx = ROOM_ORDER.indexOf(roomId);

  if (!meta || roomId === 'lobby') {
    if (roomProgress) roomProgress.hidden = true;
    if (floatingMapBtn) floatingMapBtn.hidden = true;
    return;
  }

  if (roomProgress) roomProgress.hidden = false;
  if (floatingMapBtn) floatingMapBtn.hidden = false;

  if (roomNumEl) {
    roomNumEl.textContent = `Room ${meta.num}`;
  }

  if (roomNameEl) {
    roomNameEl.textContent = meta.name;
  }

  if (prevRoomBtn) {
    prevRoomBtn.disabled = idx <= 1;
  }

  if (nextRoomBtn) {
    nextRoomBtn.disabled =
      idx === -1 || idx >= ROOM_ORDER.length - 1;
  }
}

function switchRoom(roomId) {
  const target = document.getElementById(`room-${roomId}`);

  if (!target) return;

  /* Hide all rooms */
  rooms.forEach(room => {
    room.hidden = true;
    room.classList.remove('active');
  });

  /* Reset room tabs */
  roomTabs.forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  /* Show target room */
  target.hidden = false;
  target.classList.add('active');

  /* Activate corresponding tab */
  const tab = document.querySelector(
    `.vm-room-tab[data-room="${roomId}"]`
  );

  if (tab) {
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
  }

  currentRoomId = roomId;

  updateRoomProgress(roomId);

  /* Scroll museum content to top */
  const main = document.querySelector('.vm-main');

  if (main) {
    main.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

roomTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchRoom(tab.dataset.room);
  });
});

prevRoomBtn?.addEventListener('click', () => {
  const idx = ROOM_ORDER.indexOf(currentRoomId);

  if (idx > 1) {
    switchRoom(ROOM_ORDER[idx - 1]);
  }
});

nextRoomBtn?.addEventListener('click', () => {
  const idx = ROOM_ORDER.indexOf(currentRoomId);

  if (
    idx !== -1 &&
    idx < ROOM_ORDER.length - 1
  ) {
    switchRoom(ROOM_ORDER[idx + 1]);
  }
});

floatingMapBtn?.addEventListener('click', () => {
  openOverlay('vmMapOverlay');
});


/* =========================================================
   LOBBY CARDS
   ========================================================= */

document.querySelectorAll('.vm-lobby-card').forEach(card => {

  card.addEventListener('click', () => {
    switchRoom(card.dataset.room);
  });

  card.addEventListener('keydown', event => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      switchRoom(card.dataset.room);
    }
  });

});


/* =========================================================
   MAP NODES
   ========================================================= */

document.querySelectorAll('.vm-map-node').forEach(node => {

  node.style.cursor = 'pointer';

  node.addEventListener('click', () => {
    const room = node.dataset.room;

    if (!room) return;

    switchRoom(room);
    closeOverlay('vmMapOverlay');
  });

});


/* =========================================================
   OVERLAY FUNCTIONS
   ========================================================= */

function openOverlay(id) {
  const el = document.getElementById(id);

  if (!el) return;

  el.hidden = false;
  syncOverlayVisibility(el);

  const closeButton = el.querySelector(
    '[aria-label*="Close"]'
  );

  closeButton?.focus();
}

function closeOverlay(id) {
  const el = document.getElementById(id);

  if (!el) return;

  el.hidden = true;
  syncOverlayVisibility(el);
}


/* =========================================================
   MAP / GUIDE / JOURNEY BUTTONS
   ========================================================= */

document.getElementById('vmMapBtn')?.addEventListener(
  'click',
  () => openOverlay('vmMapOverlay')
);

document.getElementById('vmMapClose')?.addEventListener(
  'click',
  () => closeOverlay('vmMapOverlay')
);

document.getElementById('vmGuideBtn')?.addEventListener(
  'click',
  () => openOverlay('vmGuideOverlay')
);

document.getElementById('vmGuideClose')?.addEventListener(
  'click',
  () => closeOverlay('vmGuideOverlay')
);

document.getElementById('vmJourneyBtn')?.addEventListener(
  'click',
  () => {
    renderJourney();
    openOverlay('vmJourneyOverlay');
  }
);

document.getElementById('vmJourneyClose')?.addEventListener(
  'click',
  () => closeOverlay('vmJourneyOverlay')
);


/* =========================================================
   ARTIFACT PANEL CLOSE BUTTON
   IMPORTANT: THIS WAS MISSING FROM YOUR MAIN FILE
   ========================================================= */

document.getElementById('vmApClose')?.addEventListener(
  'click',
  () => {
    const artifactPanel =
      document.getElementById('vmArtifactPanel');

    if (!artifactPanel) return;

    artifactPanel.hidden = true;
    syncOverlayVisibility(artifactPanel);
  }
);


/* =========================================================
   CLOSE OVERLAYS BY CLICKING BACKDROP
   ========================================================= */

document.querySelectorAll('.vm-overlay').forEach(overlay => {

  overlay.addEventListener('click', event => {

    if (event.target === overlay) {
      overlay.hidden = true;
      syncOverlayVisibility(overlay);
    }

  });

});


/* =========================================================
   CLOSE EVERYTHING WITH ESCAPE
   ========================================================= */

document.addEventListener('keydown', event => {

  if (event.key !== 'Escape') return;

  /* Close normal overlays */
  document.querySelectorAll('.vm-overlay').forEach(overlay => {
    overlay.hidden = true;
    syncOverlayVisibility(overlay);
  });

  /* Close artifact detail panel */
  const artifactPanel =
    document.getElementById('vmArtifactPanel');

  if (artifactPanel) {
    artifactPanel.hidden = true;
    syncOverlayVisibility(artifactPanel);
  }

});


/* =========================================================
   GUIDED TOURS
   ========================================================= */

const TOURS = {
  highlights: [
    'lobby',
    'origins',
    'royal',
    'afterlife'
  ],

  pharaohs: [
    'royal',
    'pyramids',
    'gods'
  ],

  gods: [
    'gods',
    'afterlife',
    'nile'
  ],

  everyday: [
    'nile',
    'origins',
    'gods'
  ]
};

let activeTourTimer = null;

document.querySelectorAll('.vm-tour-option').forEach(button => {

  button.addEventListener('click', () => {

    const tourRooms = TOURS[button.dataset.tour];

    if (!tourRooms || !tourRooms.length) return;

    /* Stop an existing tour */
    if (activeTourTimer) {
      clearTimeout(activeTourTimer);
      activeTourTimer = null;
    }

    closeOverlay('vmGuideOverlay');

    let index = 0;

    switchRoom(tourRooms[index]);

    function nextTourRoom() {

      index++;

      if (index >= tourRooms.length) {
        activeTourTimer = null;
        return;
      }

      switchRoom(tourRooms[index]);

      activeTourTimer = setTimeout(
        nextTourRoom,
        8000
      );
    }

    activeTourTimer = setTimeout(
      nextTourRoom,
      8000
    );

  });

});


/* =========================================================
   PHARAOH SHOWCASE
   ========================================================= */

const PHARAOHS = {

  tutankhamun: {
    name: 'Tutankhamun',
    era: 'New Kingdom · 18th Dynasty',
    dates: 'r. c. 1332–1323 BCE',
    desc:
      'One of Egypt\'s most famous rulers — not for his power, but for his extraordinary tomb. Tutankhamun became pharaoh at around nine years old and died aged approximately nineteen. His undisturbed tomb, discovered in 1922, contained over 5,000 objects including his famous golden mask.',
    img:
      'https://upload.wikimedia.org/wikipedia/commons/3/35/Mask_of_Tutankhamun_in_2025.jpg'
  },

  hatshepsut: {
    name: 'Hatshepsut',
    era: 'New Kingdom · 18th Dynasty',
    dates: 'r. c. 1479–1458 BCE',
    desc:
      'One of ancient Egypt\'s most successful rulers — and one of the few women to reign as pharaoh. Hatshepsut ruled for over twenty years, commissioning major building projects including her magnificent mortuary temple at Deir el-Bahari and leading trade expeditions to Punt.',
    img:
      'https://upload.wikimedia.org/wikipedia/commons/7/7b/Seated_Statue_of_Hatshepsut_MET_Hatshepsut2012.jpg'
  },

  ramesses: {
    name: 'Ramesses II',
    era: 'New Kingdom · 19th Dynasty',
    dates: 'r. c. 1279–1213 BCE',
    desc:
      'Known as Ramesses the Great — one of Egypt\'s most powerful and longest-reigning pharaohs. He ruled for approximately 66 years, led military campaigns across the Near East, signed the world\'s first recorded peace treaty, and built more monuments than any other Egyptian king.',
    img:
      'https://upload.wikimedia.org/wikipedia/commons/c/cf/Ramses_II_British_Museum.jpg'
  },

  nefertiti: {
    name: 'Nefertiti',
    era: 'New Kingdom · 18th Dynasty',
    dates: 'fl. c. 1353–1336 BCE',
    desc:
      'Great Royal Wife of the pharaoh Akhenaten. Nefertiti played a significant political and religious role during Egypt\'s most radical religious transformation — the worship of a single solar deity, the Aten. Her painted limestone bust is one of the most recognised ancient artworks in the world.',
    img:
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/Nofretete_Neues_Museum.jpg'
  },

  cleopatra: {
    name: 'Cleopatra VII',
    era: 'Ptolemaic Period',
    dates: 'r. 51–30 BCE',
    desc:
      'The last active ruler of the Ptolemaic Kingdom of Egypt — and one of history\'s most famous figures. Highly educated and fluent in multiple languages, Cleopatra navigated the complex politics of the late Roman Republic and formed alliances with both Julius Caesar and Mark Antony.',
    img:
      'https://upload.wikimedia.org/wikipedia/commons/3/3e/Kleopatra-VII.-Altes-Museum-Berlin1.jpg'
  }

};

function renderPharaoh(key) {

  const pharaoh = PHARAOHS[key];

  if (!pharaoh) return;

  const display =
    document.getElementById('vmPharaohDisplay');

  if (!display) return;

  display.innerHTML = `
    <div
      class="vm-ps-img"
      style="background-image:url('${pharaoh.img}')"
      role="img"
      aria-label="${pharaoh.name}">
    </div>

    <div class="vm-ps-info">
      <span class="vm-ps-era">
        ${pharaoh.era}
      </span>

      <h3>${pharaoh.name}</h3>

      <span class="vm-ps-dates">
        ${pharaoh.dates}
      </span>

      <p>${pharaoh.desc}</p>
    </div>
  `;
}

renderPharaoh('tutankhamun');

document.querySelectorAll('.vm-ps-btn').forEach(button => {

  button.addEventListener('click', () => {

    document.querySelectorAll('.vm-ps-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    renderPharaoh(button.dataset.pharaoh);

  });

});


/* =========================================================
   HOTSPOTS
   ========================================================= */

const HOTSPOT_DATA = {

  crown: {
    tag: 'Royal Crown',
    title: 'The Nemes Headdress',
    text:
      'The striped cloth headdress — the nemes — was one of the most common royal headdresses in ancient Egypt. On this mask, it is rendered in gold with blue glass stripes, framing the king\'s face and falling over the shoulders.'
  },

  striping: {
    tag: 'Material',
    title: 'Gold & Lapis Lazuli',
    text:
      'The mask is made primarily of solid gold, inlaid with coloured glass and semi-precious stones including lapis lazuli, quartz and obsidian. The blue stripes of the nemes imitate the deep blue of lapis lazuli — a material associated with the divine.'
  },

  eyes: {
    tag: 'Symbolism',
    title: 'The Eyes of the King',
    text:
      'The eyes are inlaid with quartz and obsidian, giving them a striking lifelike quality. The eye of the king carried great symbolic power in ancient Egypt — connected with sight, protection and the divine gaze of the pharaoh.'
  },

  beard: {
    tag: 'Royal Symbol',
    title: 'The Ceremonial Beard',
    text:
      'The plaited beard, ending in a curved tip, is a symbol of royalty and divinity in ancient Egypt. Even female pharaohs were depicted wearing this ceremonial beard. It connects the king with the god Osiris, who is frequently shown with a similar beard.'
  },

  collar: {
    tag: 'Decoration',
    title: 'The Broad Collar',
    text:
      'The broad collar — known as a wesekh — was one of the most important items of Egyptian jewellery, worn by royalty and the elite. On this mask it is decorated with inlaid coloured glass forming floral and geometric patterns.'
  }

};

document.querySelectorAll('.vm-hs-point').forEach(button => {

  button.addEventListener('click', () => {

    const data =
      HOTSPOT_DATA[button.dataset.hs];

    if (!data) return;

    const panel =
      document.getElementById('vmHsPanel');

    if (!panel) return;

    panel.innerHTML = `
      <div class="vm-hs-result">

        <span class="vm-hs-result-tag">
          ${data.tag}
        </span>

        <h4>${data.title}</h4>

        <p>${data.text}</p>

      </div>
    `;

  });

});


/* =========================================================
   PROGRESSIVE JOURNEY STEPPER
   ========================================================= */

function initJourney(containerId) {

  const container =
    document.getElementById(containerId);

  if (!container) return;

  const dots =
    container.querySelectorAll('.vm-al-dot');

  const steps =
    container.querySelectorAll('.vm-al-step');

  function goTo(stepIndex) {

    if (
      stepIndex < 0 ||
      stepIndex >= steps.length
    ) {
      return;
    }

    steps.forEach((step, index) => {
      step.hidden = index !== stepIndex;
      step.classList.toggle(
        'active',
        index === stepIndex
      );
    });

    dots.forEach((dot, index) => {

      dot.classList.toggle(
        'active',
        index === stepIndex
      );

      dot.setAttribute(
        'aria-selected',
        index === stepIndex
          ? 'true'
          : 'false'
      );

    });

  }

  dots.forEach((dot, index) => {

    dot.addEventListener('click', () => {
      goTo(index);
    });

  });

  steps.forEach((step, index) => {

    const nextBtn =
      step.querySelector('.vm-al-next');

    nextBtn?.addEventListener('click', () => {

      if (
        nextBtn.classList.contains(
          'vm-al-restart'
        )
      ) {
        goTo(0);
        return;
      }

      goTo(
        Math.min(
          index + 1,
          steps.length - 1
        )
      );

    });

  });

  /* Ensure first step starts visible */
  goTo(0);
}

initJourney('vmNileJourney');
initJourney('vmAlJourney');


/* =========================================================
   ROYAL EGYPT — RELATED FIGURES
   ========================================================= */

function selectPharaoh(key) {

  const button =
    document.querySelector(
      `.vm-ps-btn[data-pharaoh="${key}"]`
    );

  if (!button) return;

  document.querySelectorAll('.vm-ps-btn').forEach(btn => {

    btn.classList.remove('active');

    btn.setAttribute(
      'aria-selected',
      'false'
    );

  });

  button.classList.add('active');

  button.setAttribute(
    'aria-selected',
    'true'
  );

  renderPharaoh(key);

  document
    .querySelector('.vm-pharaoh-showcase')
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
}

document.querySelectorAll('.vm-related-chip').forEach(chip => {

  chip.addEventListener('click', () => {
    selectPharaoh(chip.dataset.pharaoh);
  });

});


/* =========================================================
   4D CONNECTIONS
   ========================================================= */

document.getElementById('vm4dPerson')?.addEventListener(
  'click',
  () => {

    document
      .querySelector('.vm-pharaoh-showcase')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

  }
);

document.getElementById('vm4dPlace')?.addEventListener(
  'click',
  () => {

    openOverlay('vmMapOverlay');

    document
      .querySelector(
        '.vm-map-node[data-room="royal"]'
      )
      ?.focus();

  }
);


/* =========================================================
   MY JOURNEY
   ========================================================= */

let journey = [];

try {
  journey =
    JSON.parse(
      localStorage.getItem('edm-journey') || '[]'
    );

  if (!Array.isArray(journey)) {
    journey = [];
  }

} catch (error) {

  console.warn(
    'Could not load My Journey data.',
    error
  );

  journey = [];
}


function updateJourneyCount() {

  const element =
    document.getElementById(
      'vmJourneyCount'
    );

  if (element) {
    element.textContent = journey.length;
  }

}


function saveToJourney(item) {

  if (!item || !item.id) return;

  const alreadySaved =
    journey.some(
      savedItem => savedItem.id === item.id
    );

  if (alreadySaved) return;

  journey.push(item);

  try {

    localStorage.setItem(
      'edm-journey',
      JSON.stringify(journey)
    );

  } catch (error) {

    console.warn(
      'Could not save My Journey data.',
      error
    );

  }

  updateJourneyCount();
}


function renderJourney() {

  const content =
    document.getElementById(
      'vmJourneyContent'
    );

  if (!content) return;

  if (!journey.length) {

    content.innerHTML = `
      <div class="vm-journey-empty">

        <span>𓂀</span>

        <p>
          You haven't saved any artifacts yet.
          Click "Save to My Journey" on any
          artifact to begin.
        </p>

      </div>
    `;

    return;
  }

  const roomCount =
    new Set(
      journey.map(item => item.room)
    ).size;

  content.innerHTML = `
    <div class="vm-journey-stat">

      <div class="vm-js">
        <strong>${journey.length}</strong>
        <span>Artifacts Saved</span>
      </div>

      <div class="vm-js">
        <strong>${roomCount}</strong>
        <span>Rooms Visited</span>
      </div>

    </div>

    <div class="vm-journey-items">

      ${journey.map(item => `
        <div class="vm-journey-item">

          <span aria-hidden="true">◈</span>

          <span>${item.title}</span>

        </div>
      `).join('')}

    </div>
  `;

}

updateJourneyCount();


/* =========================================================
   SAVE TUTANKHAMUN MASK
   ========================================================= */

document.getElementById('vmSaveMask')?.addEventListener(
  'click',
  function () {

    saveToJourney({
      id: 'mask-tutankhamun',
      title: 'Golden Mask of Tutankhamun',
      room: 'royal'
    });

    this.textContent =
      '✓ Saved to My Journey';

    this.classList.add('saved');
    this.disabled = true;

  }
);


/* =========================================================
   ARTIFACT DETAILS — ORIGINS ROOM
   ========================================================= */

const ARTIFACT_DETAIL = {

  pottery: {
    title: 'Decorated Predynastic Pottery',
    date: 'Predynastic Period · c. 4000–3100 BCE',

    desc:
      'Predynastic pottery provides some of our most important evidence for life before the pharaohs. Decorated with geometric patterns, boats and animals, these vessels tell us about artistic traditions, daily activities and connections between communities along the Nile Valley.',

    facts: [
      'Made from Nile clay',
      'Geometric and animal motifs',
      'Evidence of regional trade',
      'Used in daily life and burials'
    ]
  },

  tools: {
    title: 'Flint Stone Tools',
    date: 'Predynastic Period · c. 5000–3100 BCE',

    desc:
      'Stone tools reveal how Predynastic communities hunted, farmed and processed materials. Flint was the most important tool material — shaped into blades, scrapers, arrowheads and knives through a skill known as knapping.',

    facts: [
      'Made from flint',
      'Used for hunting and farming',
      'Shows growing craft skill',
      'Continued alongside metal tools'
    ]
  },

  ornaments: {
    title: 'Beads & Personal Ornaments',
    date: 'Predynastic Period · c. 4000–3100 BCE',

    desc:
      'Jewellery and ornaments found in Predynastic graves demonstrate craftsmanship, personal identity and the movement of materials across long distances. Materials including shells from the Red Sea, obsidian from Ethiopia and lapis lazuli appear far from their places of origin.',

    facts: [
      'Shell, stone and bone',
      'Evidence of long-distance exchange',
      'Found in burials',
      'Show social differences'
    ]
  }

};


function openArtifactDetail(artifactKey) {

  const data =
    ARTIFACT_DETAIL[artifactKey];

  if (!data) return;

  const panel =
    document.getElementById(
      'vmArtifactPanel'
    );

  const content =
    document.getElementById(
      'vmApContent'
    );

  if (!panel || !content) return;

  content.innerHTML = `
    <span
      class="vm-room-eyebrow"
      style="
        color:var(--gold,#d6a84f);
        display:block;
        margin-bottom:.5rem;
      ">
      Artifact Detail
    </span>

    <h3
      id="artifact-panel-title"
      style="
        font-family:Cinzel,serif;
        font-size:clamp(1.2rem,2.5vw,1.8rem);
        color:white;
        margin-bottom:.4rem;
      ">
      ${data.title}
    </h3>

    <p
      style="
        font-size:.75rem;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:.15em;
        color:rgba(214,168,79,.7);
        margin-bottom:1.2rem;
      ">
      ${data.date}
    </p>

    <p
      style="
        color:rgba(255,255,255,.7);
        line-height:1.75;
        margin-bottom:1.5rem;
        font-size:.9rem;
      ">
      ${data.desc}
    </p>

    <ul
      style="
        list-style:none;
        display:flex;
        flex-direction:column;
        gap:.5rem;
      ">

      ${data.facts.map(fact => `
        <li
          style="
            display:flex;
            align-items:center;
            gap:.7rem;
            font-size:.83rem;
            color:rgba(255,255,255,.6);
            padding:.5rem 0;
            border-bottom:1px solid rgba(255,255,255,.06);
          ">

          <span
            style="
              color:var(--gold,#d6a84f);
              font-size:.7rem;
            ">
            →
          </span>

          ${fact}

        </li>
      `).join('')}

    </ul>

    <div style="margin-top:1.5rem">

      <a
        class="btn btn-gold"
        href="collection.html"
        style="font-size:.85rem">
        Explore Full Collection →
      </a>

    </div>
  `;

  panel.hidden = false;

  syncOverlayVisibility(panel);

  /* Focus close button for accessibility */
  document
    .getElementById('vmApClose')
    ?.focus();
}


/* =========================================================
   ARTIFACT CLICK / KEYBOARD HANDLERS
   ========================================================= */

document.querySelectorAll('.vm-artifact-item').forEach(item => {

  const handler = () => {
    openArtifactDetail(
      item.dataset.artifact
    );
  };

  item.addEventListener(
    'click',
    handler
  );

  item.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();
        handler();

      }

    }
  );

});


/* =========================================================
   INITIAL STATE
   ========================================================= */

/* Make sure the lobby is the initial room */
switchRoom('lobby');

/* Make sure journey count is correct */
updateJourneyCount();

/* Make sure artifact panel starts closed */
const initialArtifactPanel =
  document.getElementById(
    'vmArtifactPanel'
  );

if (initialArtifactPanel) {

  initialArtifactPanel.hidden = true;

  syncOverlayVisibility(
    initialArtifactPanel
  );

}