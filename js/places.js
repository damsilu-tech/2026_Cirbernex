/* ==========================================================================
   places.js — Individual Place Detail Page
   Renders one place from a static editorial PLACE_DATA object, and enriches
   it with live "connected artifacts" pulled from the MongoDB-backed API.
   ========================================================================== */

/* ---------------------------------------------------------------
   API CONFIG
   --------------------------------------------------------------- */
const API_BASE = (() => {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:3000';
  return 'https://cibernex-api.onrender.com';
})();

const FALLBACK_IMAGE = 'assets/images/fallbackartifacts/images.png';

/* ---------------------------------------------------------------
   HEADER (menu + scroll) — same behaviour as the rest of the site
   --------------------------------------------------------------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? '✕' : '☰';
});

/* ---------------------------------------------------------------
   EDITORIAL PLACE DATA
   Cautious, general-audience historical wording. Dates are
   approximate ("c.") where precision is not well established.
   --------------------------------------------------------------- */
const PLACE_DATA = {

  giza: {
    name: 'Giza',
    slug: 'giza',
    type: 'Monumental Landscape',
    period: 'Old Kingdom',
    date: 'c. 26th century BCE',
    location: 'West Bank of the Nile, near modern Cairo',
    heroImage: 'https://source.unsplash.com/1600x900/?giza,pyramids,egypt',
    intro: 'A plateau on the desert edge west of the Nile, chosen by Old Kingdom rulers as the setting for some of the largest monuments ever built — the pyramid complexes of Khufu, Khafre and Menkaure, and the Great Sphinx.',
    locationInfo: {
      modern: 'Part of Greater Cairo, on the western edge of the city, Egypt.',
      ancient: 'A desert plateau on the west bank of the Nile, across the river from the ancient city of Memphis.',
      nileContext: 'Positioned so that stone and materials could be transported by river and canal from quarries elsewhere in Egypt to the building site.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'EAST BANK', places: ['Memphis (across the river)'], active: false },
          { label: 'WEST BANK', places: ['Giza Plateau', 'Saqqara (further south)'], active: true }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'A royal choice of site', text: 'During the Fourth Dynasty, the Giza plateau was chosen as a royal burial site, likely for its stable bedrock and proximity to the capital at Memphis.' },
      { period: 'Development', title: 'Three pyramid complexes', text: 'Over several generations, the pyramids of Khufu, Khafre and Menkaure were built here, each accompanied by mortuary and valley temples, causeways and smaller subsidiary pyramids.' },
      { period: 'Old Kingdom legacy', title: 'A statement of royal power', text: 'The scale of the Giza monuments reflects the administrative and economic capacity of the Old Kingdom state, and its ideas about kingship and the afterlife.' },
      { period: 'Later history', title: 'Continued significance', text: 'Giza remained a place of religious and cultural importance long after the Old Kingdom, and has been a focus of exploration, restoration and study since the modern era.' }
    ],
    featuresLabel: 'Monuments',
    features: [
      { name: 'Great Pyramid of Khufu', description: 'The largest of the Giza pyramids, built as the tomb of the Fourth Dynasty king Khufu.', date: 'c. 26th century BCE', image: 'https://source.unsplash.com/800x600/?great-pyramid,khufu' },
      { name: 'Pyramid of Khafre', description: 'The second-largest pyramid at Giza, built for Khufu\'s son Khafre, and closely associated with the Great Sphinx.', date: 'c. 26th century BCE', image: 'https://source.unsplash.com/800x600/?khafre,pyramid' },
      { name: 'Pyramid of Menkaure', description: 'The smallest of the three main Giza pyramids, built for King Menkaure.', date: 'c. 26th–25th century BCE', image: 'https://source.unsplash.com/800x600/?menkaure,pyramid' },
      { name: 'Great Sphinx', description: 'A monumental limestone statue with a lion\'s body and a royal head, closely associated with Khafre\'s pyramid complex.', date: 'c. 26th century BCE', image: 'https://source.unsplash.com/800x600/?sphinx,giza' }
    ],
    people: [
      { name: 'Khufu', slug: null, role: 'Pharaoh', description: 'Fourth Dynasty king traditionally credited with commissioning the Great Pyramid.' },
      { name: 'Khafre', slug: null, role: 'Pharaoh', description: 'Son of Khufu, associated with the second Giza pyramid and, by tradition, the Great Sphinx.' },
      { name: 'Menkaure', slug: null, role: 'Pharaoh', description: 'Builder of the third and smallest of the main Giza pyramids.' }
    ],
    timeline: [
      { date: 'c. 2600 BCE', title: 'Construction begins', description: 'Work starts on the Great Pyramid complex of Khufu.' },
      { date: 'c. 2570–2500 BCE', title: 'Khafre and Menkaure', description: 'The second and third pyramid complexes are completed, along with the Great Sphinx.' },
      { date: 'Later Old Kingdom', title: 'Continued royal and religious use', description: 'The plateau remains an active mortuary and religious landscape.' },
      { date: 'Modern era', title: 'Archaeological exploration', description: 'Systematic excavation, survey and conservation work continues to refine understanding of the site.' }
    ],
    stories: [
      { title: 'How were the pyramids built?', description: 'Explore what is known — and still debated — about Old Kingdom construction methods.', href: 'learn.html' },
      { title: 'The Old Kingdom and the Age of Pyramids', description: 'See Giza in the context of Egypt\'s great age of monumental building.', href: 'old-kingdom.html' },
      { title: 'Life along the Nile', description: 'Discover how the river shaped settlement, agriculture and transport near Giza.', href: 'timeline.html' }
    ]
  },

  memphis: {
    name: 'Memphis',
    slug: 'memphis',
    type: 'Ancient City',
    period: 'Early Dynastic – later periods',
    date: 'c. 31st century BCE onward',
    location: 'Near modern Mit Rahina, south of Cairo',
    heroImage: 'https://source.unsplash.com/1600x900/?ancient,ruins,egypt',
    intro: 'One of ancient Egypt\'s most important cities, traditionally associated with the unification of Upper and Lower Egypt and long a centre of political and religious life.',
    locationInfo: {
      modern: 'Near the village of Mit Rahina, south of Cairo, Egypt.',
      ancient: 'Situated near the boundary between the Nile Delta and the Nile Valley, close to the apex of Lower Egypt.',
      nileContext: 'Positioned on the west bank of the Nile, giving it control over river traffic between Upper and Lower Egypt.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'EAST BANK', places: ['Nile floodplain settlements'], active: false },
          { label: 'WEST BANK', places: ['Memphis', 'Saqqara necropolis (nearby)', 'Giza plateau (nearby)'], active: true }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'A city at the crossroads', text: 'Memphis grew near the traditional boundary of Upper and Lower Egypt and is closely linked in later tradition with the country\'s early unification.' },
      { period: 'Development', title: 'A centre of administration and religion', text: 'For long stretches of Egyptian history, Memphis served as an important administrative centre and as a major cult centre for the god Ptah.' },
      { period: 'Old Kingdom prominence', title: 'Capital in the Age of Pyramids', text: 'During the Old Kingdom, Memphis was closely associated with the royal court, and its necropolises at Giza and Saqqara reflect its importance.' },
      { period: 'Later history', title: 'Continued importance', text: 'Memphis remained significant into later periods, even as political power shifted, and its ruins were studied by later Egyptians and, eventually, modern archaeologists.' }
    ],
    featuresLabel: 'Major Sites',
    features: [
      { name: 'Temple of Ptah', description: 'A major temple dedicated to Ptah, the patron god of craftsmen and one of the principal deities of Memphis.', date: 'Multiple periods', image: 'https://source.unsplash.com/800x600/?temple,ruins,egypt' },
      { name: 'Colossal statuary', description: 'Large royal statues associated with the site attest to its long-standing royal and religious significance.', date: 'New Kingdom and later', image: 'https://source.unsplash.com/800x600/?statue,egypt' },
      { name: 'Necropolis connections', description: 'Memphis is closely linked with the nearby desert cemeteries of Saqqara and Giza, used across many periods.', date: 'Old Kingdom onward', image: 'https://source.unsplash.com/800x600/?necropolis,desert' }
    ],
    people: [
      { name: 'Narmer', slug: null, role: 'Early ruler', description: 'Associated in tradition with the unification of Egypt near this region.' },
      { name: 'Ptah', slug: null, role: 'Patron deity', description: 'The principal god of Memphis, associated with craftsmanship and creation.' }
    ],
    timeline: [
      { date: 'c. 3100 BCE', title: 'Early prominence', description: 'Memphis emerges as an important centre near the start of Egyptian dynastic history.' },
      { date: 'Old Kingdom', title: 'Royal and religious hub', description: 'The city flourishes alongside the great building projects at nearby Giza and Saqqara.' },
      { date: 'New Kingdom and later', title: 'Continued significance', description: 'Memphis remains an important city even as political centres shift elsewhere.' },
      { date: 'Modern era', title: 'Rediscovery', description: 'Excavations at Mit Rahina continue to reveal more about the ancient city.' }
    ],
    stories: [
      { title: 'The unification of Upper and Lower Egypt', description: 'Learn about the traditions surrounding Egypt becoming a single kingdom.', href: 'early-dynastic.html' },
      { title: 'Gods and temples of ancient Egypt', description: 'Explore the religious world that shaped cities like Memphis.', href: 'learn.html' }
    ]
  },

  thebes: {
    name: 'Thebes',
    slug: 'thebes',
    type: 'Ancient City',
    period: 'Middle Kingdom – New Kingdom',
    date: 'c. 21st–11th centuries BCE',
    location: 'Modern Luxor, Upper Egypt',
    heroImage: 'https://source.unsplash.com/1600x900/?luxor,egypt,temple',
    intro: 'A major religious and political centre in Upper Egypt, especially prominent during the Middle and New Kingdoms, when it became closely associated with the god Amun and with royal power.',
    locationInfo: {
      modern: 'Modern Luxor, Upper Egypt.',
      ancient: 'A city spanning both banks of the Nile in Upper Egypt, with temples on the east bank and mortuary and funerary sites on the west.',
      nileContext: 'The Nile divided the city\'s roles: the east bank for the living and the great temples, the west bank for royal tombs and mortuary temples.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'EAST BANK', places: ['Karnak Temple', 'Luxor Temple'], active: true },
          { label: 'WEST BANK', places: ['Valley of the Kings', 'Deir el-Bahari'], active: false }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'Rise to prominence', text: 'Thebes grew in importance during the Middle Kingdom, partly through its association with rulers who reunified Egypt after periods of division.' },
      { period: 'New Kingdom capital', title: 'A city of temples and kings', text: 'During the New Kingdom, Thebes became one of Egypt\'s most important cities, home to the great temple complex of Karnak and closely tied to royal ideology.' },
      { period: 'Religious centre', title: 'The city of Amun', text: 'Thebes was the principal cult centre of Amun, whose temple at Karnak grew over centuries into one of the largest religious complexes in the ancient world.' },
      { period: 'Later history', title: 'Decline and legacy', text: 'As political centres shifted in later periods, Thebes lost some of its former prominence, but remained an important religious and cultural site.' }
    ],
    featuresLabel: 'Major Sites',
    features: [
      { name: 'Karnak Temple', description: 'A vast temple precinct on the east bank, primarily dedicated to Amun-Re, developed over many centuries.', date: 'Middle Kingdom onward', image: 'https://source.unsplash.com/800x600/?karnak,temple' },
      { name: 'Luxor Temple', description: 'A major temple linked to Karnak by a processional avenue, associated with royal ideology and festivals.', date: 'New Kingdom', image: 'https://source.unsplash.com/800x600/?luxor,temple,columns' },
      { name: 'West Bank necropolises', description: 'The Valley of the Kings, Valley of the Queens and mortuary temples of the west bank complemented the temples of the east.', date: 'New Kingdom', image: 'https://source.unsplash.com/800x600/?valley,desert,egypt' }
    ],
    people: [
      { name: 'Hatshepsut', slug: 'hatshepsut', role: 'Pharaoh', description: 'A New Kingdom ruler whose mortuary temple stands at nearby Deir el-Bahari on the west bank.' },
      { name: 'Thutmose III', slug: 'thutmose-iii', role: 'Pharaoh', description: 'A New Kingdom military and building king closely associated with Thebes and Karnak.' },
      { name: 'Amenhotep III', slug: null, role: 'Pharaoh', description: 'Commissioned significant additions to Luxor Temple and other Theban monuments.' }
    ],
    timeline: [
      { date: 'Middle Kingdom', title: 'Regional rise', description: 'Thebes gains prominence as rulers based here help reunify Egypt.' },
      { date: 'Early New Kingdom', title: 'Royal patronage', description: 'Kings expand Karnak and establish Thebes as a major religious centre.' },
      { date: 'New Kingdom height', title: 'City of temples and tombs', description: 'Thebes flourishes on both banks, with temples in the east and royal burials in the west.' },
      { date: 'Later periods', title: 'Shifting political centres', description: 'Thebes retains religious importance even as administrative power moves elsewhere.' }
    ],
    stories: [
      { title: 'The temples of Karnak', description: 'A closer look at one of the largest religious complexes ever built.', href: 'places.html?id=karnak' },
      { title: 'Life on the west bank', description: 'Explore the communities that supported the royal necropolis.', href: 'places.html?id=deir-el-bahari' },
      { title: 'The New Kingdom', description: 'See Thebes in the context of Egypt\'s imperial age.', href: 'new-kingdom.html' }
    ]
  },

  karnak: {
    name: 'Karnak',
    slug: 'karnak',
    type: 'Temple Complex',
    period: 'Middle Kingdom – Ptolemaic Period',
    date: 'Developed over c. 2,000 years',
    location: 'East Bank of Thebes (modern Luxor)',
    heroImage: 'https://source.unsplash.com/1600x900/?karnak,temple,columns',
    intro: 'A vast temple precinct on the east bank of ancient Thebes, developed and expanded by successive rulers over roughly two thousand years, principally in honour of the god Amun-Re.',
    locationInfo: {
      modern: 'On the east bank of the Nile in modern Luxor, Egypt.',
      ancient: 'Part of the religious heart of ancient Thebes, linked to Luxor Temple by a processional avenue.',
      nileContext: 'Situated close to the river on the east bank, opposite the royal necropolises of the west bank.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'EAST BANK', places: ['Karnak Temple', 'Luxor Temple (via avenue)'], active: true },
          { label: 'WEST BANK', places: ['Valley of the Kings', 'Deir el-Bahari'], active: false }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'A modest beginning', text: 'The earliest structures at Karnak likely date to the Middle Kingdom, when a modest temple to Amun stood on the site.' },
      { period: 'Development', title: 'Centuries of expansion', text: 'Nearly every New Kingdom pharaoh added to Karnak, resulting in a sprawling complex of halls, pylons, obelisks and shrines.' },
      { period: 'Religious importance', title: 'Home of Amun-Re', text: 'Karnak became the principal cult centre of Amun-Re, one of the most important gods of the New Kingdom state religion.' },
      { period: 'Later history', title: 'Continued use and study', text: 'Karnak continued to receive royal attention into the Ptolemaic Period, and remains one of the most studied sites in Egypt today.' }
    ],
    featuresLabel: 'Major Features',
    features: [
      { name: 'Great Hypostyle Hall', description: 'A forest of massive columns built primarily under Seti I and Ramesses II, among the most recognisable spaces in Egyptian architecture.', date: 'New Kingdom', image: 'https://source.unsplash.com/800x600/?hypostyle,hall,columns' },
      { name: 'Precinct of Amun-Re', description: 'The largest and most important precinct within Karnak, home to the main temple of Amun-Re.', date: 'Middle Kingdom onward', image: 'https://source.unsplash.com/800x600/?amun,temple,egypt' },
      { name: 'Avenue of Sphinxes', description: 'A processional way lined with sphinx statues, connecting Karnak to Luxor Temple.', date: 'New Kingdom / later restorations', image: 'https://source.unsplash.com/800x600/?sphinx,avenue' }
    ],
    people: [
      { name: 'Seti I', slug: 'seti-i', role: 'Pharaoh', description: 'Contributed significantly to the Great Hypostyle Hall at Karnak.' },
      { name: 'Ramesses II', slug: 'ramesses-ii', role: 'Pharaoh', description: 'Completed and added to major sections of Karnak, continuing his predecessors\' work.' },
      { name: 'Hatshepsut', slug: 'hatshepsut', role: 'Pharaoh', description: 'Erected obelisks and other monuments within the Karnak precinct.' }
    ],
    timeline: [
      { date: 'Middle Kingdom', title: 'Early temple', description: 'A modest shrine to Amun is established on the site.' },
      { date: 'Early New Kingdom', title: 'Rapid expansion', description: 'Successive kings add pylons, courts and shrines.' },
      { date: 'Ramesside period', title: 'The Hypostyle Hall', description: 'Seti I and Ramesses II complete the Great Hypostyle Hall.' },
      { date: 'Ptolemaic Period', title: 'Continued additions', description: 'Later rulers continue to add to and restore parts of the complex.' }
    ],
    stories: [
      { title: 'How temples were built and expanded', description: 'Learn how Egyptian temples grew over generations of royal patronage.', href: 'learn.html' },
      { title: 'The god Amun-Re', description: 'Explore the religious ideas behind Karnak\'s principal deity.', href: 'learn.html' },
      { title: 'Thebes: city of temples and kings', description: 'See Karnak in the context of the wider city of Thebes.', href: 'places.html?id=thebes' }
    ]
  },

  saqqara: {
    name: 'Saqqara',
    slug: 'saqqara',
    type: 'Necropolis',
    period: 'Early Dynastic – Late Period',
    date: 'c. 27th century BCE onward',
    location: 'Near Memphis, west of the Nile',
    heroImage: 'https://source.unsplash.com/1600x900/?saqqara,step,pyramid',
    intro: 'A vast desert cemetery serving the ancient capital of Memphis, used across nearly the whole span of Egyptian history and home to the Step Pyramid of Djoser, among the earliest large stone monuments in the world.',
    locationInfo: {
      modern: 'Near the village of Saqqara, south of Cairo, Egypt.',
      ancient: 'A desert escarpment on the west bank of the Nile, serving as the main necropolis of nearby Memphis.',
      nileContext: 'Set back from the river on the desert edge, in keeping with the Egyptian practice of situating cemeteries on the west, away from the fertile floodplain.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'EAST BANK', places: ['Nile floodplain'], active: false },
          { label: 'WEST BANK', places: ['Memphis (nearby)', 'Saqqara necropolis', 'Giza plateau (further north)'], active: true }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'Early tombs', text: 'Saqqara was used for elite burials from the Early Dynastic Period onward, reflecting its role as the cemetery of nearby Memphis.' },
      { period: 'A turning point', title: 'The Step Pyramid of Djoser', text: 'In the Third Dynasty, the Step Pyramid complex of King Djoser was built here, an early large-scale stone monument credited to the architect Imhotep.' },
      { period: 'Continued use', title: 'Centuries of burials', text: 'Saqqara continued to be used as a burial ground across many later periods, resulting in a dense and layered archaeological landscape.' },
      { period: 'Later history', title: 'A site of ongoing discovery', text: 'Saqqara remains an active area of excavation, with new tombs and structures still being uncovered.' }
    ],
    featuresLabel: 'Monuments',
    features: [
      { name: 'Step Pyramid of Djoser', description: 'Egypt\'s first large stone pyramid, built as a monumental version of earlier mastaba tombs.', date: 'c. 27th century BCE', image: 'https://source.unsplash.com/800x600/?step,pyramid,djoser' },
      { name: 'Mastaba tombs', description: 'Flat-roofed rectangular tombs of officials and nobles, found in large numbers across the site.', date: 'Multiple periods', image: 'https://source.unsplash.com/800x600/?mastaba,tomb,egypt' },
      { name: 'Serapeum', description: 'An underground gallery associated with the burial of sacred Apis bulls, used in later periods.', date: 'New Kingdom and later', image: 'https://source.unsplash.com/800x600/?underground,tomb,egypt' }
    ],
    people: [
      { name: 'Djoser', slug: null, role: 'Pharaoh', description: 'Third Dynasty king for whom the Step Pyramid complex was built.' },
      { name: 'Imhotep', slug: null, role: 'Architect and official', description: 'Credited by tradition as the architect of the Step Pyramid, later revered for his wisdom.' }
    ],
    timeline: [
      { date: 'Early Dynastic Period', title: 'Elite burials begin', description: 'Saqqara is used for the tombs of officials serving the early Egyptian state.' },
      { date: 'c. 2650 BCE', title: 'The Step Pyramid', description: 'Djoser\'s Step Pyramid complex is constructed under Imhotep.' },
      { date: 'Old Kingdom onward', title: 'Continued royal and elite burials', description: 'Later kings and officials add further monuments and tombs.' },
      { date: 'Modern era', title: 'Ongoing excavation', description: 'Archaeologists continue to uncover new tombs and structures at Saqqara.' }
    ],
    stories: [
      { title: 'From mastaba to pyramid', description: 'Trace how Egyptian tomb architecture evolved toward the pyramid form.', href: 'old-kingdom.html' },
      { title: 'Imhotep: architect and legend', description: 'Learn about the figure credited with the Step Pyramid\'s design.', href: 'learn.html' }
    ]
  },

  'valley-of-the-kings': {
    name: 'Valley of the Kings',
    slug: 'valley-of-the-kings',
    type: 'Royal Necropolis',
    period: 'New Kingdom',
    date: 'c. 16th–11th centuries BCE',
    location: 'West Bank of Thebes (modern Luxor)',
    heroImage: 'https://source.unsplash.com/1600x900/?valley-of-the-kings,egypt',
    intro: 'A remote desert valley on the west bank of ancient Thebes, chosen by New Kingdom rulers as a discreet setting for their rock-cut tombs, in place of the pyramids of earlier periods.',
    locationInfo: {
      modern: 'On the west bank of the Nile, opposite modern Luxor, Egypt.',
      ancient: 'A narrow desert valley behind the Theban hills, overlooked by a natural pyramid-shaped peak.',
      nileContext: 'Separated from the fertile Nile floodplain by the Theban hills, reinforcing its role as a hidden, sacred burial ground for kings.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'EAST BANK', places: ['Thebes / Karnak', 'Luxor Temple'], active: false },
          { label: 'WEST BANK', places: ['Deir el-Bahari', 'Valley of the Kings'], active: true }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'A new approach to royal burial', text: 'From the early New Kingdom, rulers began cutting tombs into the cliffs of this valley rather than building pyramids, likely for greater security.' },
      { period: 'Development', title: 'Generations of royal tombs', text: 'Over roughly five centuries, most New Kingdom pharaohs were buried here, along with some queens and officials.' },
      { period: 'Major period', title: 'Height of tomb decoration', text: 'Tomb interiors were elaborately decorated with religious texts and imagery intended to guide and protect the king in the afterlife.' },
      { period: 'Later history', title: 'Reuse and rediscovery', text: 'Many tombs were robbed in antiquity; later periods saw reuse of some tombs, and the valley became a major focus of archaeological exploration from the modern era onward.' }
    ],
    featuresLabel: 'Tombs',
    features: [
      { name: 'KV62 — Tomb of Tutankhamun', description: 'A relatively small tomb, famous for being found largely intact in the twentieth century.', date: 'c. 14th century BCE', image: 'https://source.unsplash.com/800x600/?tutankhamun,tomb' },
      { name: 'KV17 — Tomb of Seti I', description: 'One of the longest and most elaborately decorated tombs in the valley.', date: 'c. 13th century BCE', image: 'https://source.unsplash.com/800x600/?egyptian,tomb,painting' },
      { name: 'KV5 — Tomb of the sons of Ramesses II', description: 'A large, complex tomb associated with several sons of Ramesses II.', date: 'c. 13th century BCE', image: 'https://source.unsplash.com/800x600/?ramesses,tomb' }
    ],
    people: [
      { name: 'Tutankhamun', slug: 'tutankhamun', role: 'Pharaoh', description: 'Buried in KV62, one of the few near-intact royal tombs found in modern times.' },
      { name: 'Ramesses II', slug: 'ramesses-ii', role: 'Pharaoh', description: 'A long-reigning New Kingdom king whose tomb and sons\' tomb are located in the valley.' },
      { name: 'Seti I', slug: 'seti-i', role: 'Pharaoh', description: 'Buried in one of the valley\'s largest and most finely decorated tombs.' },
      { name: 'Thutmose III', slug: 'thutmose-iii', role: 'Pharaoh', description: 'A New Kingdom ruler buried in the valley during its early use as a royal necropolis.' }
    ],
    timeline: [
      { date: 'Early New Kingdom', title: 'First royal tombs', description: 'Rulers begin cutting tombs into the valley\'s cliffs.' },
      { date: 'New Kingdom', title: 'Continued royal burials', description: 'Successive pharaohs and some queens and officials are buried in the valley.' },
      { date: 'Later New Kingdom', title: 'Robbery and reuse', description: 'Many tombs are robbed in antiquity; some are reused or resealed by later officials.' },
      { date: 'Modern era', title: 'Archaeological exploration', description: 'Systematic exploration, including the discovery of Tutankhamun\'s tomb, transforms understanding of the valley.' }
    ],
    stories: [
      { title: 'The burial of Tutankhamun', description: 'Explore what the discovery of KV62 revealed about New Kingdom royal burial.', href: 'collection.html' },
      { title: 'How Egyptian tombs were decorated', description: 'Learn about the religious texts and imagery found in royal tombs.', href: 'learn.html' },
      { title: 'Life on the west bank of Thebes', description: 'Discover the communities that supported the royal necropolis.', href: 'places.html?id=deir-el-bahari' },
      { title: 'Why did New Kingdom kings choose the western desert?', description: 'Consider the religious and practical reasons behind this shift in royal burial practice.', href: 'new-kingdom.html' }
    ]
  },

  'abu-simbel': {
    name: 'Abu Simbel',
    slug: 'abu-simbel',
    type: 'Temple Complex',
    period: 'New Kingdom',
    date: 'c. 13th century BCE',
    location: 'Southern Upper Egypt, near the border with Nubia',
    heroImage: 'https://source.unsplash.com/1600x900/?abu-simbel,temple',
    intro: 'A monumental rock-cut temple complex in the far south of Egypt, built under Ramesses II to project royal and religious power at the frontier with Nubia.',
    locationInfo: {
      modern: 'Near the town of Abu Simbel, southern Egypt, close to the border with Sudan.',
      ancient: 'Situated in ancient Nubia, at the southern edge of Egyptian control.',
      nileContext: 'Built on the west bank of the Nile, positioned to impress travellers approaching Egypt from the south.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'WEST BANK', places: ['Great Temple of Ramesses II', 'Small Temple of Nefertari'], active: true }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'A frontier statement', text: 'Ramesses II commissioned Abu Simbel partly to display Egyptian power to Nubia and neighbouring peoples along a key southern route.' },
      { period: 'Development', title: 'Two temples', text: 'The complex includes a great temple dedicated to Ramesses II and the gods, and a smaller temple dedicated to Queen Nefertari and the goddess Hathor.' },
      { period: 'Religious and political role', title: 'Kingship and the gods', text: 'The temples combine religious dedication with an unmistakable message about royal authority at the edge of Egyptian territory.' },
      { period: 'Later history', title: 'Rediscovery and relocation', text: 'The temples were studied by modern explorers and, in the twentieth century, relocated to higher ground to avoid flooding from the Aswan High Dam.' }
    ],
    featuresLabel: 'Monuments',
    features: [
      { name: 'Great Temple of Ramesses II', description: 'Fronted by four colossal seated statues of Ramesses II, this temple is dedicated to the king and several major gods.', date: 'c. 13th century BCE', image: 'https://source.unsplash.com/800x600/?abu-simbel,statues' },
      { name: 'Small Temple of Nefertari', description: 'Dedicated to Queen Nefertari and the goddess Hathor, an unusually prominent tribute to a royal consort.', date: 'c. 13th century BCE', image: 'https://source.unsplash.com/800x600/?nefertari,temple' }
    ],
    people: [
      { name: 'Ramesses II', slug: 'ramesses-ii', role: 'Pharaoh', description: 'Commissioned the temple complex as a statement of power on Egypt\'s southern frontier.' },
      { name: 'Nefertari', slug: null, role: 'Queen', description: 'Principal wife of Ramesses II, honoured with her own temple at the site.' }
    ],
    timeline: [
      { date: 'c. 1264–1244 BCE', title: 'Construction', description: 'The temple complex is carved from the rock under Ramesses II.' },
      { date: 'Later New Kingdom', title: 'Continued religious use', description: 'The temples remain in use as part of Egyptian religious and royal tradition.' },
      { date: '19th–20th century', title: 'Rediscovery by modern explorers', description: 'The temples become known to the wider world and are studied in detail.' },
      { date: '1960s', title: 'Relocation', description: 'The temples are moved to higher ground during the construction of the Aswan High Dam, to prevent them being submerged.' }
    ],
    stories: [
      { title: 'Ramesses II and monumental building', description: 'Explore the scale of building projects undertaken during this reign.', href: 'new-kingdom.html' },
      { title: 'Saving Abu Simbel', description: 'Learn about the twentieth-century effort to relocate the temples.', href: 'learn.html' }
    ]
  },

  'deir-el-bahari': {
    name: 'Deir el-Bahari',
    slug: 'deir-el-bahari',
    type: 'Monumental Landscape',
    period: 'Middle Kingdom – New Kingdom',
    date: 'c. 21st–15th centuries BCE',
    location: 'West Bank of Thebes (modern Luxor)',
    heroImage: 'https://source.unsplash.com/1600x900/?hatshepsut,temple,egypt',
    intro: 'A dramatic bay of cliffs on the west bank of ancient Thebes, chosen as the setting for mortuary temples, most famously that of Queen Hatshepsut.',
    locationInfo: {
      modern: 'On the west bank of the Nile opposite modern Luxor, Egypt.',
      ancient: 'A natural amphitheatre of cliffs near the Valley of the Kings, on the Theban west bank.',
      nileContext: 'Part of the wider Theban necropolis on the west bank, connected by ritual routes to the temples of the east bank.',
      diagram: {
        root: 'NILE',
        branches: [
          { label: 'EAST BANK', places: ['Thebes / Karnak'], active: false },
          { label: 'WEST BANK', places: ['Deir el-Bahari', 'Valley of the Kings (nearby)'], active: true }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'An early mortuary temple', text: 'The site was first used in the Middle Kingdom for the mortuary temple of Mentuhotep II, who reunified Egypt.' },
      { period: 'Development', title: 'Hatshepsut\'s temple', text: 'In the New Kingdom, Queen Hatshepsut built her own mortuary temple here, designed to harmonise dramatically with the surrounding cliffs.' },
      { period: 'Religious role', title: 'A place of ritual and memory', text: 'Mortuary temples at Deir el-Bahari served as settings for rituals honouring the deceased ruler and connecting them with the gods.' },
      { period: 'Later history', title: 'Rediscovery', text: 'The site was extensively studied and restored during the modern era, revealing details of its architecture and decoration.' }
    ],
    featuresLabel: 'Monuments',
    features: [
      { name: 'Mortuary Temple of Hatshepsut', description: 'A terraced temple built into the cliffs, one of the most distinctive structures in Egyptian architecture.', date: 'c. 15th century BCE', image: 'https://source.unsplash.com/800x600/?hatshepsut,temple,terrace' },
      { name: 'Temple of Mentuhotep II', description: 'An earlier Middle Kingdom mortuary temple, partly inspiring the later design of Hatshepsut\'s temple nearby.', date: 'c. 21st century BCE', image: 'https://source.unsplash.com/800x600/?mentuhotep,temple' }
    ],
    people: [
      { name: 'Hatshepsut', slug: 'hatshepsut', role: 'Pharaoh', description: 'Built her mortuary temple at Deir el-Bahari, one of the most celebrated monuments of the New Kingdom.' },
      { name: 'Senenmut', slug: 'senenmut', role: 'Official', description: 'A high official under Hatshepsut, associated with the design and construction of her temple.' }
    ],
    timeline: [
      { date: 'c. 2050 BCE', title: 'Mentuhotep II\'s temple', description: 'An early mortuary temple is built at the site following the reunification of Egypt.' },
      { date: 'c. 1479–1458 BCE', title: 'Hatshepsut\'s reign', description: 'Hatshepsut commissions her own mortuary temple at Deir el-Bahari.' },
      { date: 'Later New Kingdom', title: 'Continued religious use', description: 'The site remains part of the wider ritual landscape of the Theban west bank.' },
      { date: 'Modern era', title: 'Excavation and restoration', description: 'Archaeological teams document and restore the temples at the site.' }
    ],
    stories: [
      { title: 'Hatshepsut: a woman who ruled as pharaoh', description: 'Explore the reign of one of Egypt\'s most notable female rulers.', href: 'people.html' },
      { title: 'Life on the west bank of Thebes', description: 'Discover the communities and workers connected to the Theban necropolis.', href: 'places.html?id=valley-of-the-kings' }
    ]
  },

  alexandria: {
    name: 'Alexandria',
    slug: 'alexandria',
    type: 'Ancient City',
    period: 'Ptolemaic & Roman',
    date: 'Founded 332 BCE',
    location: 'Mediterranean coast, northern Egypt',
    heroImage: 'https://source.unsplash.com/1600x900/?alexandria,mediterranean,coast',
    intro: 'A great Mediterranean port city founded by Alexander the Great, which grew into one of the ancient world\'s leading centres of trade, scholarship and culture under the Ptolemaic dynasty and later Roman rule.',
    locationInfo: {
      modern: 'Egypt\'s second-largest city, on the Mediterranean coast.',
      ancient: 'Founded on the Mediterranean shore near the western edge of the Nile Delta, distinct from the older cities of the Nile Valley.',
      nileContext: 'Connected to the Nile Delta\'s waterways, linking Mediterranean trade routes with the Egyptian interior.',
      diagram: {
        root: 'MEDITERRANEAN SEA',
        branches: [
          { label: 'COASTAL CITY', places: ['Alexandria'], active: true },
          { label: 'NILE DELTA (inland)', places: ['Delta waterways and towns'], active: false }
        ]
      }
    },
    history: [
      { period: 'Origins', title: 'A new foundation', text: 'Alexandria was founded in 332 BCE by Alexander the Great, on the site of a smaller existing settlement, as a new Mediterranean capital.' },
      { period: 'Ptolemaic flourishing', title: 'A centre of learning', text: 'Under the Ptolemaic dynasty, Alexandria became renowned for institutions of scholarship, most famously its great library and associated centre of research.' },
      { period: 'Political importance', title: 'Capital of Ptolemaic Egypt', text: 'Alexandria served as the capital of Egypt under the Ptolemies, including during the reign of Cleopatra VII.' },
      { period: 'Later history', title: 'Roman and later periods', text: 'The city remained a major Mediterranean port and cultural centre under Roman rule and into later periods of Egyptian history.' }
    ],
    featuresLabel: 'Major Sites',
    features: [
      { name: 'The ancient Library of Alexandria', description: 'A renowned centre of scholarship and manuscript collection in the ancient world, though its precise physical form and eventual fate remain the subject of ongoing study.', date: 'Ptolemaic Period', image: 'https://source.unsplash.com/800x600/?ancient,library' },
      { name: 'The Lighthouse (Pharos) of Alexandria', description: 'A monumental lighthouse on the island of Pharos, counted among the Seven Wonders of the Ancient World.', date: 'c. 3rd century BCE', image: 'https://source.unsplash.com/800x600/?lighthouse,ancient' },
      { name: 'Catacombs of Kom el-Shoqafa', description: 'An underground necropolis blending Egyptian, Greek and Roman artistic traditions.', date: 'Roman Period', image: 'https://source.unsplash.com/800x600/?catacombs,ancient' }
    ],
    people: [
      { name: 'Alexander the Great', slug: null, role: 'Founder', description: 'Founded the city in 332 BCE during his campaign through Egypt.' },
      { name: 'Cleopatra VII', slug: null, role: 'Pharaoh', description: 'The last active ruler of the Ptolemaic Kingdom, based in Alexandria.' }
    ],
    timeline: [
      { date: '332 BCE', title: 'Foundation', description: 'Alexander the Great founds the city on the Mediterranean coast.' },
      { date: 'Ptolemaic Period', title: 'Rise as a centre of learning', description: 'Alexandria becomes famous for its library and scholarly institutions.' },
      { date: '1st century BCE', title: 'End of Ptolemaic rule', description: 'Alexandria is the setting for the final years of Ptolemaic Egypt under Cleopatra VII.' },
      { date: 'Roman Period onward', title: 'Continued significance', description: 'The city remains an important Mediterranean port and cultural centre.' }
    ],
    stories: [
      { title: 'Egypt under the Ptolemies', description: 'Explore the Greek-ruled period that followed Alexander\'s conquest.', href: 'late-period.html' },
      { title: 'Cleopatra VII and the end of an era', description: 'Learn about the final ruler of independent Ptolemaic Egypt.', href: 'people.html' }
    ]
  }

};

/* ---------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------- */
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function imgTag(src, alt, cls, lazy) {
  const safeSrc = src || FALLBACK_IMAGE;
  return `<img src="${esc(safeSrc)}" alt="${esc(alt)}" class="${cls || ''}" ${lazy ? 'loading="lazy"' : ''} onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';">`;
}

const app = document.getElementById('placeApp');

/* ---------------------------------------------------------------
   ENTRY POINT
   --------------------------------------------------------------- */
function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) { renderChooser(); return; }

  const place = PLACE_DATA[id];
  if (!place) { renderNotFound(id); return; }

  renderPlace(place);
}

/* ---------------------------------------------------------------
   STATE: NO ID PROVIDED
   --------------------------------------------------------------- */
function renderChooser() {
  document.title = "Choose a Place | Egypt's Digital Museum";
  const cards = Object.values(PLACE_DATA).map(p => `
    <a class="chooser-card" href="places.html?id=${esc(p.slug)}">
      <small>${esc(p.type.toUpperCase())}</small>
      <h3>${esc(p.name)}</h3>
      <span>${esc(p.period)}</span>
    </a>
  `).join('');

  app.innerHTML = `
    <section class="state-section" aria-labelledby="choose-title">
      <div class="container state-inner">
        <div class="section-kicker">Places of Egypt</div>
        <h1 id="choose-title">Choose a place to explore.</h1>
        <p>This page shows a deep dive into a single historical location. Pick one below, or browse the full map on the Places page.</p>
        <div class="chooser-grid">${cards}</div>
        <a class="text-link" href="place.html">← Back to Places</a>
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------------
   STATE: INVALID ID
   --------------------------------------------------------------- */
function renderNotFound(id) {
  document.title = "Place Not Found | Egypt's Digital Museum";
  app.innerHTML = `
    <section class="state-section" aria-labelledby="notfound-title">
      <div class="container state-inner">
        <div class="section-kicker">Place Not Found</div>
        <h1 id="notfound-title">This place could not be found in the museum.</h1>
        <p>We couldn't find a record for "<strong>${esc(id)}</strong>". It may not be documented yet, or the link may be out of date.</p>
        <a class="btn btn-gold" href="place.html">← Return to Places</a>
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------------
   MAIN RENDER
   --------------------------------------------------------------- */
function renderPlace(place) {
  document.title = `${place.name} | Egypt's Digital Museum`;

  app.innerHTML = [
    renderHero(place),
    renderStickyNav(place),
    renderLocation(place),
    renderHistory(place),
    renderFeatures(place),
    renderPeople(place),
    renderArtifactsShell(),
    renderTimeline(place),
    renderStories(place),
    renderConnections(place),
    renderExploreMore()
  ].join('');

  setupStickyNav();
  loadArtifacts(place);
}

/* ---------- HERO ---------- */
function renderHero(place) {
  return `
    <section class="place-hero-detail">
      ${imgTag(place.heroImage, place.name, 'hero-bg')}
      <div class="hero-scrim"></div>
      <div class="container hero-detail-inner">
        <a class="back-link" href="place.html">← Places</a>
        <div class="hero-tags">
          <span>${esc(place.type)}</span>
          <span>${esc(place.period)}</span>
        </div>
        <h1>${esc(place.name)}</h1>
        <p class="hero-date">${esc(place.date)}</p>
        <p class="hero-intro">${esc(place.intro)}</p>
        <div class="hero-meta-row">
          <div><small>TYPE</small><span>${esc(place.type)}</span></div>
          <div><small>LOCATION</small><span>${esc(place.location)}</span></div>
          <div><small>PERIOD</small><span>${esc(place.period)}</span></div>
        </div>
      </div>
    </section>
  `;
}

/* ---------- STICKY NAV ---------- */
function renderStickyNav(place) {
  return `
    <nav class="place-subnav" aria-label="Sections of this place">
      <div class="place-subnav-inner">
        <a href="#overview">Overview</a>
        <a href="#history">History</a>
        <a href="#features">${esc(place.featuresLabel || 'Features')}</a>
        <a href="#people">People</a>
        <a href="#artifacts">Artifacts</a>
        <a href="#timeline">Timeline</a>
        <a href="#stories">Stories</a>
      </div>
    </nav>
  `;
}

function setupStickyNav() {
  const links = document.querySelectorAll('.place-subnav a');
  const sections = Array.from(links)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/* ---------- LOCATION ---------- */
function renderLocation(place) {
  const info = place.locationInfo || {};
  const diagram = info.diagram || { root: 'NILE', branches: [] };

  const branches = diagram.branches.map(b => `
    <div class="loc-branch ${b.active ? 'loc-branch-active' : ''}">
      <div class="loc-branch-label">${esc(b.label)}</div>
      <ul>
        ${b.places.map(p => `<li>${esc(p)}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  return `
    <section id="overview" class="place-section" aria-labelledby="location-title">
      <div class="container">
        <div class="section-kicker">Location</div>
        <h2 id="location-title">Where is this place?</h2>

        <div class="location-layout">
          <div class="location-facts">
            <div class="loc-fact"><small>MODERN LOCATION</small><p>${esc(info.modern || '—')}</p></div>
            <div class="loc-fact"><small>ANCIENT CONTEXT</small><p>${esc(info.ancient || '—')}</p></div>
            <div class="loc-fact"><small>RELATIONSHIP TO THE NILE</small><p>${esc(info.nileContext || '—')}</p></div>
          </div>

          <div class="location-diagram" aria-hidden="true">
            <div class="loc-root">${esc(diagram.root)}</div>
            <div class="loc-trunk"></div>
            <div class="loc-branches">${branches}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ---------- HISTORY ---------- */
function renderHistory(place) {
  const phases = (place.history || []).map((h, i) => `
    <div class="history-card">
      <div class="history-index">0${i + 1}</div>
      <div>
        <small>${esc(h.period)}</small>
        <h3>${esc(h.title)}</h3>
        <p>${esc(h.text)}</p>
      </div>
    </div>
  `).join('<div class="history-connector" aria-hidden="true"></div>');

  return `
    <section id="history" class="place-section place-section-alt" aria-labelledby="history-title">
      <div class="container">
        <div class="section-kicker">The History of This Place</div>
        <h2 id="history-title">How ${esc(place.name)} took shape.</h2>
        <div class="history-flow">${phases}</div>
      </div>
    </section>
  `;
}

/* ---------- FEATURES (Tombs / Monuments / Major Sites, adaptive) ---------- */
function renderFeatures(place) {
  const label = place.featuresLabel || 'Features';
  const cards = (place.features || []).map(f => `
    <article class="feature-card">
      ${imgTag(f.image, f.name, 'feature-image', true)}
      <div class="feature-body">
        <h3>${esc(f.name)}</h3>
        ${f.date ? `<span class="feature-date">${esc(f.date)}</span>` : ''}
        <p>${esc(f.description)}</p>
      </div>
    </article>
  `).join('');

  return `
    <section id="features" class="place-section" aria-labelledby="features-title">
      <div class="container">
        <div class="section-kicker">${esc(label)}</div>
        <h2 id="features-title">${esc(label)} at ${esc(place.name)}.</h2>
        <div class="feature-grid">${cards || '<p class="section-empty">Details for this section are still being documented.</p>'}</div>
      </div>
    </section>
  `;
}

/* ---------- PEOPLE CONNECTED ---------- */
function renderPeople(place) {
  const cards = (place.people || []).map(p => {
    const inner = `
      <small>${esc(p.role)}</small>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description)}</p>
      ${p.slug ? '<span class="person-link">Explore Person →</span>' : ''}
    `;
    return p.slug
      ? `<a class="person-card" href="person.html?id=${esc(p.slug)}">${inner}</a>`
      : `<div class="person-card person-card-static">${inner}</div>`;
  }).join('');

  return `
    <section id="people" class="place-section place-section-alt" aria-labelledby="people-title">
      <div class="container">
        <div class="section-kicker">People Connected</div>
        <h2 id="people-title">Who is linked to ${esc(place.name)}?</h2>
        <div class="person-grid">${cards || '<p class="section-empty">No documented people connections yet.</p>'}</div>
      </div>
    </section>
  `;
}

/* ---------- ARTIFACTS (shell now, filled in async) ---------- */
function renderArtifactsShell() {
  return `
    <section id="artifacts" class="place-section" aria-labelledby="artifacts-title">
      <div class="container">
        <div class="section-kicker">Artifacts Connected to This Place</div>
        <h2 id="artifacts-title">Objects with a story here.</h2>
        <div id="artifactsGrid" class="artifact-grid artifact-grid-loading">
          <p class="section-loading">Looking for connected artifacts…</p>
        </div>
      </div>
    </section>
  `;
}

async function loadArtifacts(place) {
  const grid = document.getElementById('artifactsGrid');
  if (!grid) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_BASE}/api/artifacts`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Bad response');
    const artifacts = await res.json();

    const nameLower = place.name.toLowerCase();
    const matches = (Array.isArray(artifacts) ? artifacts : []).filter(a => {
      const placeName = a.place && a.place.name ? String(a.place.name).toLowerCase() : '';
      const location   = a.location ? String(a.location).toLowerCase() : '';
      const discovery  = a.discovery ? String(a.discovery).toLowerCase() : '';
      return placeName.includes(nameLower) || location.includes(nameLower) || discovery.includes(nameLower);
    });

    if (!matches.length) {
      grid.classList.remove('artifact-grid-loading');
      grid.innerHTML = `
        <div class="section-empty-box">
          <p>No connected artifacts yet.</p>
          <small>This location's artifact connections are still being documented.</small>
        </div>
      `;
      return;
    }

    grid.classList.remove('artifact-grid-loading');
    grid.innerHTML = matches.map(a => `
      <a class="artifact-card" href="artifact.html?id=${esc(a._id)}">
        ${imgTag(a.imageUrl, a.title, 'artifact-image', true)}
        <div class="artifact-body">
          <small>${esc(a.category || '')}${a.period ? ' · ' + esc(a.period) : ''}</small>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.shortDescription || a.description || '')}</p>
        </div>
      </a>
    `).join('');

  } catch (err) {
    clearTimeout(timeout);
    grid.classList.remove('artifact-grid-loading');
    grid.innerHTML = `
      <div class="section-empty-box">
        <p>No connected artifacts yet.</p>
        <small>This location's artifact connections are still being documented.</small>
      </div>
    `;
  }
}

/* ---------- TIMELINE ---------- */
function renderTimeline(place) {
  const events = (place.timeline || []).map(t => `
    <div class="tl-event">
      <div class="tl-dot"></div>
      <div class="tl-body">
        <span class="tl-date">${esc(t.date)}</span>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.description)}</p>
      </div>
    </div>
  `).join('');

  return `
    <section id="timeline" class="place-section place-section-alt" aria-labelledby="timeline-title">
      <div class="container">
        <div class="section-kicker">This Place Through Time</div>
        <h2 id="timeline-title">${esc(place.name)}, across the centuries.</h2>
        <div class="place-timeline">${events || '<p class="section-empty">Timeline details are still being documented.</p>'}</div>
      </div>
    </section>
  `;
}

/* ---------- STORIES ---------- */
function renderStories(place) {
  const cards = (place.stories || []).map(s => `
    <a class="story-card" href="${esc(s.href)}">
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.description)}</p>
      <span class="story-link">Read more →</span>
    </a>
  `).join('');

  return `
    <section id="stories" class="place-section" aria-labelledby="stories-title">
      <div class="container">
        <div class="section-kicker">Related Stories</div>
        <h2 id="stories-title">Continue exploring ${esc(place.name)}.</h2>
        <div class="story-grid">${cards || '<p class="section-empty">Related stories are still being documented.</p>'}</div>
      </div>
    </section>
  `;
}

/* ---------- CONNECTIONS / MUSEUM GRAPH ---------- */
function renderConnections(place) {
  return `
    <section class="connections-section" aria-labelledby="connections-title">
      <div class="container">
        <div class="section-kicker">One Place. Many Stories.</div>
        <h2 id="connections-title">${esc(place.name)} at the centre of the museum.</h2>

        <div class="graph">
          <div class="graph-root">${esc(place.name.toUpperCase())}</div>
          <div class="graph-branches">
            <div class="graph-branch">
              <strong>PEOPLE</strong>
              <span>Pharaohs</span>
              <span>Officials</span>
              <span>Artisans</span>
            </div>
            <div class="graph-branch">
              <strong>ARTIFACTS</strong>
              <span>Funerary objects</span>
              <span>Inscriptions</span>
              <span>Sculptures</span>
            </div>
            <div class="graph-branch">
              <strong>TIMELINE</strong>
              <span>${esc(place.period)}</span>
            </div>
            <div class="graph-branch">
              <strong>STORIES</strong>
              <span>Related discoveries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ---------- EXPLORE MORE ---------- */
function renderExploreMore() {
  return `
    <section class="explore-more-section" aria-labelledby="more-title">
      <div class="container explore-more-inner">
        <div class="section-kicker">Continue Your Journey</div>
        <h2 id="more-title">There's more of Egypt to discover.</h2>
        <div class="explore-more-actions">
          <a class="btn btn-ghost" href="place.html">← Explore Places</a>
          <a class="btn btn-gold" href="people.html">Explore People →</a>
          <a class="btn btn-ghost" href="collection.html">Explore Collection →</a>
          <a class="btn btn-ghost" href="timeline.html">Travel Through Time →</a>
        </div>
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------------
   GO
   --------------------------------------------------------------- */
init();