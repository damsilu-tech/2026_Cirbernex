const API_BASE = (() => {
  const host = window.location.hostname;

  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  return 'https://cibernex-api.onrender.com';
})();

const API = `${API_BASE}/api/artifacts`;
let artifacts = [];

// ---- Dynamic form state ----
let currentMaterials = [];   // array of strings
let selectedRelated  = [];   // array of related artifact ids

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

// ---- Image preview ----
function previewImage(url) {
  const img = document.getElementById('imgPreview');
  if (url) { img.src = url; img.style.display = 'block'; }
  else img.style.display = 'none';
}

// ---- Toast ----
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 4000);
}

// ==================================================
// ---- Materials (dynamic add / remove list) ----
// ==================================================
function renderMaterials() {
  const wrap = document.getElementById('materialsList');
  if (!currentMaterials.length) {
    wrap.innerHTML = '<div class="materials-empty">No materials added yet.</div>';
    return;
  }
  wrap.innerHTML = currentMaterials.map((m, i) => `
    <div class="material-row">
      <input type="text" value="${escapeAttr(m)}" placeholder="e.g. Gold"
             oninput="updateMaterial(${i}, this.value)">
      <button type="button" class="btn-remove-material" onclick="removeMaterial(${i})" aria-label="Remove material">×</button>
    </div>
  `).join('');
}

function addMaterialRow(value = '') {
  currentMaterials.push(value);
  renderMaterials();
  const rows = document.querySelectorAll('#materialsList .material-row input');
  if (rows.length) rows[rows.length - 1].focus();
}

function updateMaterial(index, value) {
  currentMaterials[index] = value;
}

function removeMaterial(index) {
  currentMaterials.splice(index, 1);
  renderMaterials();
}

// ==================================================
// ---- Related Artifacts (searchable multi-select) ----
// ==================================================
function renderRelatedList(query = '') {
  const wrap = document.getElementById('relatedList');
  const editId = document.getElementById('editId').value;
  const q = query.trim().toLowerCase();

  const candidates = artifacts.filter(a => a._id !== editId &&
    (!q || a.title.toLowerCase().includes(q)));

  if (!candidates.length) {
    wrap.innerHTML = '<div class="related-empty">No matching artifacts.</div>';
    return;
  }

  wrap.innerHTML = candidates.map(a => `
    <label class="related-item">
      <input type="checkbox" value="${a._id}"
        ${selectedRelated.includes(a._id) ? 'checked' : ''}
        onchange="toggleRelated('${a._id}', this.checked)">
      <span>${a.title}</span>
    </label>
  `).join('');
}

function toggleRelated(id, checked) {
  if (checked) {
    if (!selectedRelated.includes(id)) selectedRelated.push(id);
  } else {
    selectedRelated = selectedRelated.filter(x => x !== id);
  }
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// ---- Load artifacts ----
async function loadArtifacts() {
  try {
    const res = await fetch(API);
    artifacts = await res.json();
    renderList(artifacts);
    document.getElementById('countBadge').textContent = artifacts.length;
    renderRelatedList(document.getElementById('relatedSearch') ? document.getElementById('relatedSearch').value : '');
  } catch {
    document.getElementById('artifactList').innerHTML = '<div class="empty-list">Could not connect to server.</div>';
  }
}

// ---- Render list ----
function renderList(data) {
  const list = document.getElementById('artifactList');
  if (!data.length) {
    list.innerHTML = '<div class="empty-list">No artifacts found.</div>';
    return;
  }
  list.innerHTML = data.map(a => `
    <div class="artifact-row">
      <img src="${a.imageUrl}" alt="${a.title}" onerror="this.src=''">
      <div class="artifact-row-info">
        <strong>${a.title}</strong>
        <span>${a.category}${a.period ? ' · ' + a.period : ''}${a.date ? ' · ' + a.date : ''}</span>
      </div>
      <div class="row-actions">
        <button class="btn-edit" onclick="editArtifact('${a._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteArtifact('${a._id}', '${a.title}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// ---- Search ----
function filterList(query) {
  const q = query.toLowerCase();
  const filtered = artifacts.filter(a =>
    a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
  );
  renderList(filtered);
}

// ---- Submit (add or update) ----
async function submitForm() {
  const id     = document.getElementById('editId').value;
  const title  = document.getElementById('title').value.trim();
  const cat    = document.getElementById('category').value;
  const per    = document.getElementById('period').value;
  const shortD = document.getElementById('shortDescription').value.trim();
  const desc   = document.getElementById('description').value.trim();
  const img    = document.getElementById('imageUrl').value.trim();

  if (!title || !cat || !per || !shortD || !desc || !img) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const materials = currentMaterials.map(m => m.trim()).filter(Boolean);

  const body = {
    title,
    category:         cat,
    period:           per,
    date:             document.getElementById('date').value.trim(),
    dynasty:          document.getElementById('dynasty').value.trim(),
    imageUrl:         img,
    shortDescription: shortD,
    description:      desc,
    materials,
    significance:     document.getElementById('significance').value.trim(),
    discovery:        document.getElementById('discovery').value.trim(),
    person: {
      name: document.getElementById('personName').value.trim(),
      role: document.getElementById('personRole').value.trim(),
    },
    place: {
      name:     document.getElementById('placeName').value.trim(),
      location: document.getElementById('placeLocation').value.trim(),
    },
    relatedArtifacts: selectedRelated,
  };

  try {
    const url    = id ? `${API}/${id}` : API;
    const method = id ? 'PUT' : 'POST';
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error();
    showToast(id ? '✓ Artifact updated!' : '✓ Artifact added!');
    clearForm();
    loadArtifacts();
  } catch {
    showToast('Something went wrong. Is the server running?', 'error');
  }
}

// ---- Edit ----
function editArtifact(id) {
  const a = artifacts.find(x => x._id === id);
  if (!a) return;

  document.getElementById('editId').value           = a._id;
  document.getElementById('title').value             = a.title;
  document.getElementById('category').value          = a.category;
  document.getElementById('period').value             = a.period || '';
  document.getElementById('date').value               = a.date || '';
  document.getElementById('dynasty').value            = a.dynasty || '';
  document.getElementById('imageUrl').value           = a.imageUrl;
  document.getElementById('shortDescription').value   = a.shortDescription || '';
  document.getElementById('description').value        = a.description || '';
  document.getElementById('significance').value       = a.significance || '';
  document.getElementById('discovery').value          = a.discovery || '';
  document.getElementById('personName').value         = (a.person && a.person.name) || '';
  document.getElementById('personRole').value         = (a.person && a.person.role) || '';
  document.getElementById('placeName').value          = (a.place && a.place.name) || '';
  document.getElementById('placeLocation').value      = (a.place && a.place.location) || '';

  currentMaterials = Array.isArray(a.materials) ? [...a.materials] : [];
  renderMaterials();

  selectedRelated = Array.isArray(a.relatedArtifacts) ? [...a.relatedArtifacts] : [];
  document.getElementById('relatedSearch').value = '';
  renderRelatedList();

  document.getElementById('formTitle').textContent = '✏️ Edit Artifact';
  previewImage(a.imageUrl);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Delete ----
async function deleteArtifact(id, title) {
  if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    showToast(`✓ "${title}" deleted.`);
    loadArtifacts();
  } catch {
    showToast('Delete failed. Is the server running?', 'error');
  }
}

// ---- Clear form ----
function clearForm() {
  ['editId','title','date','dynasty','imageUrl','shortDescription','description',
   'significance','discovery','personName','personRole','placeName','placeLocation'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('category').value = '';
  document.getElementById('period').value = '';

  currentMaterials = [];
  renderMaterials();

  selectedRelated = [];
  document.getElementById('relatedSearch').value = '';
  renderRelatedList();

  document.getElementById('formTitle').textContent = '➕ Add New Artifact';
  document.getElementById('imgPreview').style.display = 'none';
}

renderMaterials();
loadArtifacts();